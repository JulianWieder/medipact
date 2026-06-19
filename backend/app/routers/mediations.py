from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_invite import MediationInvite
from app.models.mediation_note import MediationNote
from app.models.note_reaction import NoteReaction
from app.models.mediation_participant import MediationParticipant
from app.models.mediation_step_rule import MediationStepRule
from app.models.mediation_custom_step import MediationCustomStep
from app.models.phase_step_default import PhaseStepDefault
from app.models.user import User
from app.paypal import PayPalError, capture_order, create_order
from app.security import get_current_user, get_current_db_user


router = APIRouter(prefix="/mediations", tags=["mediations"])
mediations = []


class MediationCreate(BaseModel):
    title: Optional[str] = None
    mediation_type: str
    description: Optional[str] = None
    priority: Optional[str] = None
    role: Optional[str] = None
    status: str = "draft"


class MediationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    phase: Optional[str] = None
    # is_paid wird bewusst NICHT hier aufgenommen - darf nur über den
    # dedizierten /pay-Endpoint gesetzt werden, nicht über das generische Update.


class NoteCreate(BaseModel):
    phase: str
    step: str = ""
    participant_id: str
    content: str
    submitted: bool = False


class ReflectRequest(BaseModel):
    phase: str
    step: str
    step_title: str
    inputs: list[dict]


def _require_participant(mediation_id: int, user: User, db: Session) -> MediationParticipant:
    p = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )
    if not p:
        raise HTTPException(status_code=403, detail="Not allowed")
    return p


# ── Workflow-Regeln (konfigurierbar pro Fall, ohne Code-Änderung) ──────────────
#
# Standardmäßig müssen nur die Konfliktparteien einen Schritt abschließen,
# damit er als erledigt gilt – Mediator/Admin werden nicht mitgezählt (sie
# füllen die Partei-Formulare normalerweise nicht aus). Über die Tabelle
# `mediation_step_rules` kann das pro Mediation und Schritt überschrieben
# werden (z.B. "Mediator muss hier auch unterschreiben" oder "Schritt für
# diesen Fall überspringen") – siehe /workflow-rules-Endpoints unten.

DEFAULT_PARTY_ROLES = {"owner", "initiator", "other_party"}

# Pseudo-Phase für die Vertragsunterschrift (kein echter Notiz-Phase-Wert).
CONTRACT_RULE_PHASE = "__contract__"

# Rollen, die Workflow-Regeln für einen Fall verwalten dürfen.
_WORKFLOW_ADMIN_ROLES = {"mediator", "owner", "admin"}


def _get_step_rule(
    db: Session, mediation_id: int, phase: str, step: str
) -> Optional[MediationStepRule]:
    return (
        db.query(MediationStepRule)
        .filter(
            MediationStepRule.mediation_id == mediation_id,
            MediationStepRule.phase == phase,
            MediationStepRule.step == step,
        )
        .first()
    )


def _resolve_step_requirement(
    db: Session, mediation_id: int, phase: str, step: str, available_roles: set[str]
) -> tuple[set[str], bool]:
    """
    Ermittelt, welche Rollen einen Schritt abschließen müssen, und ob der
    Schritt für diesen Fall komplett übersprungen wird.

    Reihenfolge: expliziter Override > Standard (Konfliktparteien) > falls
    keine Konfliktpartei unter den Teilnehmern ist, alle vorhandenen Rollen
    (Fallback, damit ein Schritt nie unerfüllbar wird).
    """
    rule = _get_step_rule(db, mediation_id, phase, step)
    if rule and rule.skip:
        return set(), True

    if rule and rule.required_roles:
        required = {r.strip() for r in rule.required_roles.split(",") if r.strip()}
    else:
        required = DEFAULT_PARTY_ROLES & available_roles

    if not required:
        required = available_roles

    return required, False


class WorkflowRuleUpsert(BaseModel):
    phase: str
    step: str = ""
    required_roles: Optional[list[str]] = None  # None = zurück auf Standard
    skip: bool = False


@router.get("/{mediation_id}/workflow-rules")
def list_workflow_rules(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """
    Alle für diesen Fall hinterlegten Workflow-Overrides, plus die in diesem
    Fall vorhandenen Teilnehmer-Rollen (damit das Dashboard die passenden
    Auswahlmöglichkeiten anzeigen kann) und die Standardrollen.
    """
    _require_participant(mediation_id, current_user, db)

    rules = (
        db.query(MediationStepRule)
        .filter(MediationStepRule.mediation_id == mediation_id)
        .all()
    )
    available_roles = sorted(
        {
            p.role
            for p in db.query(MediationParticipant)
            .filter(MediationParticipant.mediation_id == mediation_id)
            .all()
        }
    )
    return {
        "default_required_roles": sorted(DEFAULT_PARTY_ROLES),
        "available_roles": available_roles,
        "rules": [
            {
                "phase": r.phase,
                "step": r.step,
                "required_roles": r.required_roles.split(",") if r.required_roles else None,
                "skip": r.skip,
            }
            for r in rules
        ],
    }


@router.put("/{mediation_id}/workflow-rules")
def upsert_workflow_rule(
    mediation_id: int,
    payload: WorkflowRuleUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Legt eine Abweichung vom Standard-Workflow für diesen Fall fest (oder ändert sie)."""
    participant = _require_participant(mediation_id, current_user, db)
    if participant.role not in _WORKFLOW_ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Nur der Mediator kann den Workflow anpassen")

    rule = _get_step_rule(db, mediation_id, payload.phase, payload.step)
    required_roles_str = ",".join(payload.required_roles) if payload.required_roles else None

    if rule:
        rule.required_roles = required_roles_str
        rule.skip = payload.skip
    else:
        rule = MediationStepRule(
            mediation_id=mediation_id,
            phase=payload.phase,
            step=payload.step,
            required_roles=required_roles_str,
            skip=payload.skip,
        )
        db.add(rule)

    db.commit()
    db.refresh(rule)
    return {
        "phase": rule.phase,
        "step": rule.step,
        "required_roles": rule.required_roles.split(",") if rule.required_roles else None,
        "skip": rule.skip,
    }


@router.delete("/{mediation_id}/workflow-rules")
def delete_workflow_rule(
    mediation_id: int,
    phase: str = Query(...),
    step: str = Query(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Entfernt einen Override – der Schritt fällt zurück auf das Standardverhalten."""
    participant = _require_participant(mediation_id, current_user, db)
    if participant.role not in _WORKFLOW_ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Nur der Mediator kann den Workflow anpassen")

    rule = _get_step_rule(db, mediation_id, phase, step)
    if rule:
        db.delete(rule)
        db.commit()
    return {"status": "reset"}


def _mediation_price_eur(db: Session, mediation_id: int) -> float:
    """Preis für die Freischaltung: 499 € pro Teilnehmer (mind. 1)."""
    count = (
        db.query(MediationParticipant)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .count()
    )
    count = max(count, 1)
    return round(settings.PRICE_PER_PARTICIPANT_EUR * count, 2)


@router.post("")
def create_mediation(
    mediation: MediationCreate,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.email == current_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_mediation = Mediation(
        title=mediation.title or "Neue Mediation",
        mediation_type=mediation.mediation_type,
        description=mediation.description,
        priority=mediation.priority,
        role=mediation.role,
        status=mediation.status,
    )
    db.add(db_mediation)
    db.commit()
    db.refresh(db_mediation)

    participant = MediationParticipant(
        mediation_id=db_mediation.id,
        user_id=user.id,
        role=mediation.role or "owner",
    )
    db.add(participant)
    db.commit()

    return {
        "mediation_id": db_mediation.id,
        "id": db_mediation.id,
        "title": db_mediation.title,
        "mediation_type": db_mediation.mediation_type,
        "description": db_mediation.description,
        "priority": db_mediation.priority,
        "role": db_mediation.role,
        "status": db_mediation.status,
    }


@router.patch("/{mediation_id}")
def update_mediation(
    mediation_id: int,
    payload: MediationUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    is_participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )
    if not is_participant:
        raise HTTPException(status_code=403, detail="Not allowed")

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    update_data = payload.model_dump(exclude_none=True)

    # Phase 1 darf erst starten, wenn bezahlt wurde. Diese Prüfung greift
    # serverseitig, damit ein direkter API-Call (z.B. via Link) die Paywall
    # nicht umgehen kann.
    if update_data.get("status") == "active" and not mediation.is_paid:
        raise HTTPException(
            status_code=402,
            detail="Zahlung erforderlich, bevor die Mediation gestartet werden kann.",
        )

    for key, value in update_data.items():
        setattr(mediation, key, value)

    db.commit()
    db.refresh(mediation)
    return mediation


@router.get("/{mediation_id}/price")
def get_mediation_price(
    mediation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Liefert den aktuellen Preis zur Freischaltung (499 € pro Teilnehmer)."""
    _require_participant(mediation_id, user, db)
    count = (
        db.query(MediationParticipant)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .count()
    )
    return {
        "price_eur": _mediation_price_eur(db, mediation_id),
        "price_per_participant_eur": settings.PRICE_PER_PARTICIPANT_EUR,
        "participant_count": max(count, 1),
    }


class PayPalCaptureRequest(BaseModel):
    order_id: str


@router.post("/{mediation_id}/pay/paypal/create-order")
async def create_paypal_order(
    mediation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Erstellt eine PayPal-Order über den fälligen Betrag (499 €/Teilnehmer)."""
    _require_participant(mediation_id, user, db)
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")
    if mediation.is_paid:
        raise HTTPException(status_code=400, detail="Mediation ist bereits bezahlt.")

    price = _mediation_price_eur(db, mediation_id)
    try:
        order = await create_order(price, mediation_id)
    except PayPalError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return {"order_id": order["id"], "price_eur": price}


@router.post("/{mediation_id}/pay/paypal/capture-order")
async def capture_paypal_order(
    mediation_id: int,
    payload: PayPalCaptureRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Erfasst eine vom Nutzer im PayPal-Fenster genehmigte Order.

    Erst wenn PayPal den Status "COMPLETED" zurückmeldet, wird die Mediation
    als bezahlt markiert - die Bestätigung kommt also direkt von PayPal, nicht
    vom Client.
    """
    _require_participant(mediation_id, user, db)
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    try:
        result = await capture_order(payload.order_id)
    except PayPalError as e:
        raise HTTPException(status_code=502, detail=str(e))

    if result.get("status") != "COMPLETED":
        raise HTTPException(
            status_code=402,
            detail="Die Zahlung wurde von PayPal nicht als abgeschlossen gemeldet.",
        )

    mediation.is_paid = True
    db.commit()
    db.refresh(mediation)
    return {"ok": True, "is_paid": mediation.is_paid}


@router.get("/me")
def get_my_mediations(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.email == current_user_email).first()
    if not user:
        return []

    rows = (
        db.query(Mediation, MediationParticipant)
        .join(MediationParticipant, Mediation.id == MediationParticipant.mediation_id)
        .filter(MediationParticipant.user_id == user.id)
        .all()
    )

    result = []
    for mediation, participant in rows:
        # Wartet auf meine Eingabe: aktive Mediation, aber noch keine
        # submitted Note für die aktuelle Phase von diesem Teilnehmer
        is_my_turn = False
        if mediation.status == "active" and mediation.phase:
            submitted_note = (
                db.query(MediationNote)
                .filter(
                    MediationNote.mediation_id == mediation.id,
                    MediationNote.participant_id == participant.id,
                    MediationNote.phase == mediation.phase,
                    MediationNote.submitted == True,
                )
                .first()
            )
            is_my_turn = submitted_note is None

        result.append({
            "mediation_id": mediation.id,
            "title": mediation.title,
            "role": participant.role,
            "status": mediation.status,
            "phase": mediation.phase,
            "mediation_type": mediation.mediation_type,
            "is_my_turn": is_my_turn,
        })

    return result


@router.get("/all")
def get_all_mediations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Alle Mediationen ohne Teilnehmerfilter – nur für Mediatoren und Admins."""
    if current_user.role not in ("mediator", "admin"):
        raise HTTPException(status_code=403, detail="Nur für Mediatoren und Admins zugänglich")

    rows = db.query(Mediation).order_by(Mediation.id.desc()).all()
    return [
        {
            "mediation_id": m.id,
            "id": m.id,
            "title": m.title,
            "mediation_type": m.mediation_type,
            "status": m.status,
            "phase": m.phase,
            "role": "mediator",
        }
        for m in rows
    ]

@router.get("/{mediation_id}")
def get_mediation(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    is_participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    if not is_participant:
        raise HTTPException(status_code=403, detail="Not allowed")

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    return {
        "mediation_id": mediation.id,
        "title": mediation.title,
        "mediation_type": mediation.mediation_type,
        "description": mediation.description,
        "priority": mediation.priority,
        "status": mediation.status,
        "phase": mediation.phase,
        "role": is_participant.role,
        "is_paid": mediation.is_paid,
    }


@router.get("/{mediation_id}/participants")
def get_mediation_participants(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    is_participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    if not is_participant:
        raise HTTPException(status_code=403, detail="Not allowed")

    confirmed = (
        db.query(MediationParticipant, User)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .all()
    )
    result = [
        {
            "id": str(participant.id),
            "name": user.name,
            "email": user.email,
            "role": participant.role,
            "invitationStatus": "accepted",
        }
        for participant, user in confirmed
    ]

    pending_invites = (
        db.query(MediationInvite)
        .filter(
            MediationInvite.mediation_id == mediation_id,
            MediationInvite.status == "pending",
        )
        .all()
    )
    for invite in pending_invites:
        result.append({
            "id": f"invite-{invite.id}",
            "name": invite.invited_email or "Unbekannt",
            "email": invite.invited_email,
            "role": invite.role,
            "invitationStatus": "pending",
        })
    return result


# ── Notizen & Schritte ─────────────────────────────────────────────────────────

@router.get("/{mediation_id}/notes")
def get_notes(
    mediation_id: int,
    phase: str = Query(...),
    step: str = Query(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_participant(mediation_id, current_user, db)
    notes = (
        db.query(MediationNote)
        .filter(
            MediationNote.mediation_id == mediation_id,
            MediationNote.phase == phase,
            MediationNote.step == step,
        )
        .all()
    )
    return [
        {"participant_id": str(n.participant_id), "content": n.content, "submitted": n.submitted}
        for n in notes
    ]


@router.get("/{mediation_id}/step-status")
def get_step_status(
    mediation_id: int,
    phase: str = Query(...),
    step: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_participant(mediation_id, current_user, db)

    participants = (
        db.query(MediationParticipant, User)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .all()
    )
    notes = (
        db.query(MediationNote)
        .filter(
            MediationNote.mediation_id == mediation_id,
            MediationNote.phase == phase,
            MediationNote.step == step,
        )
        .all()
    )
    submitted_ids = set(n.participant_id for n in notes if n.submitted)

    result = [
        {
            "participant_id": str(p.id),
            "name": u.name,
            "role": p.role,
            "submitted": p.id in submitted_ids,
        }
        for p, u in participants
    ]

    available_roles = {p.role for p, _ in participants}
    required_roles, skip = _resolve_step_requirement(
        db, mediation_id, phase, step, available_roles
    )
    if skip:
        all_submitted = True
    else:
        required = [r for r in result if r["role"] in required_roles]
        all_submitted = len(required) > 0 and all(r["submitted"] for r in required)
    return {"participants": result, "all_submitted": all_submitted}


@router.get("/{mediation_id}/phase-steps")
def get_phase_steps(
    mediation_id: int,
    phase: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """
    Liefert die f\u00fcr diesen Fall geltende, fertig zusammengef\u00fchrte Schrittliste
    einer Phase:

      1. Default-Schritte f\u00fcr den Mediationstyp dieses Falls aus
         `phase_step_defaults` (enabled=true), in konfigurierter Reihenfolge.
      2. Zus\u00e4tzliche Schritte, die der Mediator f\u00fcr diesen Fall \u00fcber
         `MediationCustomStep` angelegt hat (h\u00e4ngen danach an).
      3. Schritte, f\u00fcr die `MediationStepRule.skip=true` gesetzt ist, werden
         herausgefiltert.

    Ersetzt die fr\u00fcher statische Liste aus phaseData.ts/EinleitungClient.tsx
    im Frontend \u2013 die Konfiguration kommt jetzt vollst\u00e4ndig vom Backend.
    """
    _require_participant(mediation_id, current_user, db)

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    defaults = (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == mediation.mediation_type,
            PhaseStepDefault.phase == phase,
            PhaseStepDefault.enabled.is_(True),
        )
        .order_by(PhaseStepDefault.position, PhaseStepDefault.id)
        .all()
    )
    custom_steps = (
        db.query(MediationCustomStep)
        .filter(
            MediationCustomStep.mediation_id == mediation_id,
            MediationCustomStep.phase == phase,
        )
        .order_by(MediationCustomStep.position, MediationCustomStep.id)
        .all()
    )
    rules = {
        r.step: r
        for r in db.query(MediationStepRule)
        .filter(
            MediationStepRule.mediation_id == mediation_id,
            MediationStepRule.phase == phase,
        )
        .all()
    }

    steps = []
    for d in defaults:
        rule = rules.get(d.step_key)
        if rule and rule.skip:
            continue
        steps.append(
            {
                "key": d.step_key,
                "title": d.title,
                "description": d.description,
                "placeholder": d.placeholder,
                "reflection_mode": d.reflection_mode,
                "custom": False,
            }
        )
    for c in custom_steps:
        rule = rules.get(c.step_key)
        if rule and rule.skip:
            continue
        steps.append(
            {
                "key": c.step_key,
                "title": c.title,
                "description": c.description,
                "placeholder": "",
                "reflection_mode": None,
                "custom": True,
            }
        )

    return {"phase": phase, "mediation_type": mediation.mediation_type, "steps": steps}


@router.post("/{mediation_id}/notes")
def save_note(
    mediation_id: int,
    payload: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    own_participant = _require_participant(mediation_id, current_user, db)

    if str(own_participant.id) != payload.participant_id:
        raise HTTPException(status_code=403, detail="Du kannst nur deine eigene Notiz speichern")

    existing = (
        db.query(MediationNote)
        .filter(
            MediationNote.mediation_id == mediation_id,
            MediationNote.participant_id == own_participant.id,
            MediationNote.phase == payload.phase,
            MediationNote.step == payload.step,
        )
        .first()
    )
    if existing:
        existing.content = payload.content
        existing.submitted = payload.submitted
    else:
        db.add(MediationNote(
            mediation_id=mediation_id,
            participant_id=own_participant.id,
            phase=payload.phase,
            step=payload.step,
            content=payload.content,
            submitted=payload.submitted,
        ))
    db.commit()
    return {"ok": True}

@router.get("/{mediation_id}/notes/all")
def get_all_phase_notes(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Alle Notizen eines Falls über alle Phasen – für Teilnehmer oder Mediator/Admin."""
    is_participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    if not is_participant and current_user.role not in ("mediator", "admin"):
        raise HTTPException(status_code=403, detail="Not allowed")

    rows = (
        db.query(MediationNote, MediationParticipant, User)
        .join(MediationParticipant, MediationNote.participant_id == MediationParticipant.id)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(MediationNote.mediation_id == mediation_id)
        .order_by(MediationNote.phase, MediationNote.step)
        .all()
    )

    from collections import defaultdict
    grouped: dict[str, list] = defaultdict(list)
    for note, participant, user in rows:
        grouped[note.phase].append({
            "participant_name": user.name,
            "step": note.step,
            "content": note.content,
            "submitted": note.submitted,
        })

    PHASE_LABELS = {
        "einleitung": "Einleitung",
        "themensammlung": "Themensammlung",
        "interessenanalyse": "Interessenanalyse",
        "optionsentwicklung": "Optionsentwicklung",
        "vereinbarung": "Vereinbarung",
        "abschluss": "Abschluss",
    }

    return [
        {
            "phase": phase,
            "phase_label": PHASE_LABELS.get(phase, phase.capitalize()),
            "notes": notes,
        }
        for phase, notes in grouped.items()
    ]


# ── Reaktionen ────────────────────────────────────────────────────────────────

class ReactionCreate(BaseModel):
    phase: str
    step: str = ""
    target_participant_id: str
    item_index: int
    action: str  # "accept" | "reject" | "trade"
    trade_item_index: int | None = None


@router.post("/{mediation_id}/reactions")
def save_reaction(
    mediation_id: int,
    payload: ReactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    from_participant = _require_participant(mediation_id, current_user, db)

    if payload.action not in ("accept", "reject", "trade"):
        raise HTTPException(status_code=422, detail="action muss accept, reject oder trade sein")

    if payload.action == "trade" and payload.trade_item_index is None:
        raise HTTPException(status_code=422, detail="trade_item_index erforderlich bei action=trade")

    existing = (
        db.query(NoteReaction)
        .filter(
            NoteReaction.mediation_id == mediation_id,
            NoteReaction.phase == payload.phase,
            NoteReaction.step == payload.step,
            NoteReaction.from_participant_id == from_participant.id,
            NoteReaction.target_participant_id == int(payload.target_participant_id),
            NoteReaction.item_index == payload.item_index,
        )
        .first()
    )

    if existing:
        existing.action = payload.action
        existing.trade_item_index = payload.trade_item_index
    else:
        db.add(NoteReaction(
            mediation_id=mediation_id,
            phase=payload.phase,
            step=payload.step,
            from_participant_id=from_participant.id,
            target_participant_id=int(payload.target_participant_id),
            item_index=payload.item_index,
            action=payload.action,
            trade_item_index=payload.trade_item_index,
        ))

    db.commit()
    return {"ok": True}


@router.get("/{mediation_id}/reactions")
def get_reactions(
    mediation_id: int,
    phase: str = Query(...),
    step: str = Query(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_participant(mediation_id, current_user, db)

    rows = (
        db.query(NoteReaction)
        .filter(
            NoteReaction.mediation_id == mediation_id,
            NoteReaction.phase == phase,
            NoteReaction.step == step,
        )
        .all()
    )

    return [
        {
            "from_participant_id": str(r.from_participant_id),
            "target_participant_id": str(r.target_participant_id),
            "item_index": r.item_index,
            "action": r.action,
            "trade_item_index": r.trade_item_index,
        }
        for r in rows
    ]


# ── KI-Titelgenerierung ───────────────────────────────────────────────────────

class GenerateTitleRequest(BaseModel):
    description: str
    mediation_type: str


@router.post("/generate-title")
def generate_title(
    payload: GenerateTitleRequest,
    current_user: User = Depends(get_current_db_user),
):
    """Generiert einen kurzen, prägnanten Mediationstitel aus der Beschreibung."""
    from app.config import settings
    import anthropic

    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(status_code=503, detail="KI nicht konfiguriert")

    type_labels = {
        "trennung": "Trennung & Scheidung",
        "erbschaft": "Erbschaftsstreit",
        "nachbarschaft": "Nachbarschaftskonflikt",
    }
    type_label = type_labels.get(payload.mediation_type, payload.mediation_type)

    prompt = (
        f"Du bist ein Mediationsassistent. Erstelle einen kurzen, prägnanten Titel (max. 6 Wörter) "
        f"für eine Mediation im Bereich '{type_label}' auf Basis dieser Beschreibung:\n\n"
        f"{payload.description}\n\n"
        f"Antworte NUR mit dem Titel, ohne Anführungszeichen, ohne Erklärung."
    )

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=30,
        messages=[{"role": "user", "content": prompt}],
    )
    title = message.content[0].text.strip().strip('"').strip("'")
    return {"title": title}


# ── KI-Paraphrasierung ────────────────────────────────────────────────────────

class ReflectRequest(BaseModel):
    phase: str
    step: str
    step_title: str
    inputs: list[dict]


@router.post("/{mediation_id}/reflect")
def reflect(
    mediation_id: int,
    payload: ReflectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_participant(mediation_id, current_user, db)

    from app.config import settings
    import anthropic

    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(status_code=503, detail="KI nicht konfiguriert")

    parts = "\n\n".join(
        f"**{inp['name']} ({inp['role']}):**\n{inp['content']}"
        for inp in payload.inputs
        if inp.get("content", "").strip()
    )
    prompt = (
        f"Du bist ein neutraler Mediationsassistent. "
        f"Fasse die folgenden Eingaben der Parteien zum Schritt '{payload.step_title}' "
        f"sachlich, neutral und respektvoll zusammen. "
        f"Hebe gemeinsame Punkte hervor. Keine Bewertung, kein Ratschlag.\n\n{parts}"
    )

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return {"reflection": message.content[0].text}


# ── Mediationsvertrag ─────────────────────────────────────────────────────────

from app.models.mediation_contract import MediationContract, MediationContractSignature


class ContractSignRequest(BaseModel):
    signed_name: str


@router.post("/{mediation_id}/contract/generate")
def generate_contract(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Generiert den Mediationsvertrag aus allen Phase-1-Notizen via KI.
    Teilnehmer mit Rolle mediator/admin im Fall darf generieren. Bestehender Vertrag wird überschrieben."""
    participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    if not participant and current_user.role not in ("mediator", "admin"):
        raise HTTPException(status_code=403, detail="Nicht an dieser Mediation beteiligt")

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation nicht gefunden")

    # Alle Phase-1-Notizen laden
    phase_keys = ["einleitung", "einleitung_rollen", "einleitung_vertrauen", "einleitung_ziel"]
    notes = (
        db.query(MediationNote, MediationParticipant, User)
        .join(MediationParticipant, MediationNote.participant_id == MediationParticipant.id)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(
            MediationNote.mediation_id == mediation_id,
            MediationNote.phase.in_(phase_keys),
            MediationNote.submitted == True,
        )
        .all()
    )

    if not notes:
        raise HTTPException(status_code=422, detail="Noch keine abgeschlossenen Eingaben in Phase 1")

    from app.config import settings
    import anthropic

    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(status_code=503, detail="KI nicht konfiguriert")

    STEP_LABELS = {
        "einleitung": "Regeln",
        "einleitung_rollen": "Rollen",
        "einleitung_vertrauen": "Vertrauen",
        "einleitung_ziel": "Ziel",
    }

    parts = []
    for note, participant, user in notes:
        import json as _json
        try:
            items = _json.loads(note.content)
            if not isinstance(items, list):
                items = [note.content]
        except Exception:
            items = [note.content]
        items_text = "\n".join(f"- {i}" for i in items if i.strip())
        if items_text:
            parts.append(f"{user.name} ({STEP_LABELS.get(note.phase, note.phase)}):\n{items_text}")

    notes_text = "\n\n".join(parts)

    prompt = (
        "Du bist ein erfahrener Mediationsassistent. "
        "Erstelle auf Basis der folgenden Eingaben der Parteien einen kurzen, klaren Mediationsvertrag auf Deutsch. "
        "Der Vertrag soll:\n"
        "- Die gemeinsamen Regeln für das Verfahren festhalten\n"
        "- Die Rollen der Beteiligten klären\n"
        "- Die Grundsätze (Freiwilligkeit, Vertraulichkeit, Eigenverantwortung, Neutralität) explizit nennen\n"
        "- Besonders auf die Online-Besonderheiten eingehen (digitale Vertraulichkeit, Umgang mit technischen Problemen)\n"
        "- Das gemeinsame Ziel der Mediation benennen\n"
        "- In einem respektvollen, verbindlichen Ton gehalten sein\n"
        "- Maximal 400 Wörter\n\n"
        f"Eingaben der Parteien:\n\n{notes_text}"
    )

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1200,
        messages=[{"role": "user", "content": prompt}],
    )
    generated_text = message.content[0].text

    # Speichern oder überschreiben
    existing = db.query(MediationContract).filter(MediationContract.mediation_id == mediation_id).first()
    if existing:
        existing.generated_text = generated_text
        existing.created_at = __import__('datetime').datetime.utcnow()
        # Unterschriften löschen bei Neugeneration
        db.query(MediationContractSignature).filter(
            MediationContractSignature.contract_id == existing.id
        ).delete()
        db.commit()
        return {"text": generated_text, "contract_id": existing.id}
    else:
        contract = MediationContract(mediation_id=mediation_id, generated_text=generated_text)
        db.add(contract)
        db.commit()
        db.refresh(contract)
        return {"text": generated_text, "contract_id": contract.id}


@router.get("/{mediation_id}/contract")
def get_contract(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_participant(mediation_id, current_user, db)

    # Prüfen ob aktueller User Mediator/Admin in dieser Mediation ist
    caller_participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    caller_is_mediator = current_user.role in ("mediator", "admin") or (
        caller_participant and caller_participant.role in ("mediator", "admin")
    )

    contract = db.query(MediationContract).filter(MediationContract.mediation_id == mediation_id).first()
    if not contract:
        return {"contract": None}

    # Parteien sehen den Vertrag erst wenn der Mediator ihn freigegeben hat
    if not contract.is_released and not caller_is_mediator:
        return {"contract": None}

    signatures = (
        db.query(MediationContractSignature, MediationParticipant, User)
        .join(MediationParticipant, MediationContractSignature.participant_id == MediationParticipant.id)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(MediationContractSignature.contract_id == contract.id)
        .all()
    )

    all_participants = (
        db.query(MediationParticipant)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .all()
    )
    # Wer unterschreiben muss, ist (wie bei den Content-Schritten) konfigurierbar
    # – Standard sind nur die Konfliktparteien, damit ein als Participant
    # hinterlegter Mediator/Admin den Vertragsabschluss nicht dauerhaft blockiert.
    available_roles = {p.role for p in all_participants}
    required_roles, skip = _resolve_step_requirement(
        db, mediation_id, CONTRACT_RULE_PHASE, "", available_roles
    )
    signed_ids = {sig.participant_id for sig, _, _ in signatures}
    if skip:
        all_signed = True
    else:
        required_participants = [p for p in all_participants if p.role in required_roles]
        all_signed = len(required_participants) > 0 and all(
            p.id in signed_ids for p in required_participants
        )

    return {
        "contract": {
            "id": contract.id,
            "text": contract.generated_text,
            "created_at": contract.created_at.isoformat(),
        },
        "signatures": [
            {
                "participant_id": str(sig.participant_id),
                "name": user.name,
                "signed_name": sig.signed_name,
                "signed_at": sig.signed_at.isoformat(),
            }
            for sig, participant, user in signatures
        ],
        "all_signed": all_signed,
        "is_released": contract.is_released,
    }


@router.post("/{mediation_id}/contract/release")
def release_contract(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Gibt den generierten Vertrag für die Parteien frei. Nur Mediatoren/Admins."""
    caller_participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    caller_is_mediator = current_user.role in ("mediator", "admin") or (
        caller_participant and caller_participant.role in ("mediator", "admin")
    )
    if not caller_is_mediator:
        raise HTTPException(status_code=403, detail="Nur Mediatoren dürfen den Vertrag freigeben")

    contract = db.query(MediationContract).filter(MediationContract.mediation_id == mediation_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Kein Vertrag vorhanden")

    contract.is_released = True
    db.commit()
    return {"ok": True}


@router.post("/{mediation_id}/contract/sign")
def sign_contract(
    mediation_id: int,
    payload: ContractSignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    participant = _require_participant(mediation_id, current_user, db)

    contract = db.query(MediationContract).filter(MediationContract.mediation_id == mediation_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Kein Vertrag vorhanden")

    if not payload.signed_name.strip():
        raise HTTPException(status_code=422, detail="Name darf nicht leer sein")

    existing = db.query(MediationContractSignature).filter(
        MediationContractSignature.contract_id == contract.id,
        MediationContractSignature.participant_id == participant.id,
    ).first()

    if existing:
        existing.signed_name = payload.signed_name.strip()
        existing.signed_at = __import__('datetime').datetime.utcnow()
    else:
        db.add(MediationContractSignature(
            contract_id=contract.id,
            participant_id=participant.id,
            signed_name=payload.signed_name.strip(),
        ))

    db.commit()
    return {"ok": True}


# ── Terminvereinbarung ────────────────────────────────────────────────────────

from app.models.mediation_appointment import MediationAppointmentSlot, MediationAppointmentVote


def _slot_status(db: Session, slot: "MediationAppointmentSlot", mediation_id: int) -> str:
    """Ermittelt den Status eines Terminslots: proposed | reserved | confirmed.

    - proposed: noch nicht alle Beteiligten haben zugestimmt
    - reserved: alle Beteiligten haben zugestimmt, der Mediator hat aber noch
      nicht final bestätigt
    - confirmed: der Mediator hat final bestätigt – der Termin ist verbindlich
    """
    if slot.mediator_confirmed_at:
        return "confirmed"

    all_participant_ids = {
        p.id for p in db.query(MediationParticipant).filter(
            MediationParticipant.mediation_id == mediation_id
        ).all()
    }
    if not all_participant_ids:
        return "proposed"

    accepted_ids = {
        v.participant_id for v in db.query(MediationAppointmentVote).filter(
            MediationAppointmentVote.slot_id == slot.id,
            MediationAppointmentVote.accepted == True,  # noqa: E712
        ).all()
    }
    all_accepted = all_participant_ids == accepted_ids
    return "reserved" if all_accepted else "proposed"


@router.get("/appointments/all")
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Gibt alle Terminslots zurück, an denen der aktuelle Nutzer beteiligt ist.

    Mediatoren und Admins sehen die Termine aus allen Mediationen, auch wenn
    sie selbst kein MediationParticipant des jeweiligen Falls sind.
    """
    if current_user.role in ("mediator", "admin"):
        mediation_ids = [m.id for m in db.query(Mediation.id).all()]
    else:
        participations = (
            db.query(MediationParticipant)
            .filter(MediationParticipant.user_id == current_user.id)
            .all()
        )
        mediation_ids = [p.mediation_id for p in participations]

    if not mediation_ids:
        return []

    slots = (
        db.query(MediationAppointmentSlot, Mediation)
        .join(Mediation, MediationAppointmentSlot.mediation_id == Mediation.id)
        .filter(MediationAppointmentSlot.mediation_id.in_(mediation_ids))
        .order_by(MediationAppointmentSlot.proposed_datetime)
        .all()
    )

    result = []
    for slot, mediation in slots:
        result.append({
            "id": slot.id,
            "mediation_id": mediation.id,
            "mediation_title": mediation.title,
            "mediation_type": mediation.mediation_type,
            "proposed_datetime": slot.proposed_datetime.isoformat(),
            "status": _slot_status(db, slot, mediation.id),
        })

    return result


@router.get("/feedback/all")
def get_all_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Gibt das Feedback aus allen Fällen zurück, an denen der aktuelle Nutzer beteiligt ist.

    Wird für das Feedback-Widget im Workspace-Dashboard genutzt, damit der
    Mediator nicht jeden Fall einzeln öffnen muss, um neue Rückmeldungen zu sehen.
    """
    import json as _json

    participations = (
        db.query(MediationParticipant)
        .filter(MediationParticipant.user_id == current_user.id)
        .all()
    )
    mediation_ids = [p.mediation_id for p in participations]
    if not mediation_ids:
        return []

    rows = (
        db.query(MediationFeedback, MediationParticipant, User, Mediation)
        .join(MediationParticipant, MediationFeedback.participant_id == MediationParticipant.id)
        .join(User, MediationParticipant.user_id == User.id)
        .join(Mediation, MediationFeedback.mediation_id == Mediation.id)
        .filter(MediationFeedback.mediation_id.in_(mediation_ids))
        .order_by(MediationFeedback.created_at.desc())
        .all()
    )

    result = []
    for feedback, participant, user, mediation in rows:
        try:
            answers = _json.loads(feedback.answers)
        except (TypeError, ValueError):
            answers = {}
        result.append({
            "id": feedback.id,
            "mediation_id": mediation.id,
            "mediation_title": mediation.title,
            "mediation_type": mediation.mediation_type,
            "occasion": feedback.occasion,
            "participant_id": participant.id,
            "participant_name": user.name,
            "participant_role": participant.role,
            "answers": answers,
            "created_at": feedback.created_at.isoformat(),
        })
    return result


class AppointmentVoteRequest(BaseModel):
    slot_id: int
    accepted: bool


def _next_weekday_slots(n: int = 3):
    """Schlägt n Termine vor: verteilt über 2-3 Wochen, Mo-Fr 10:00 Uhr."""
    import datetime as dt
    slots = []
    base = dt.datetime.utcnow().replace(hour=10, minute=0, second=0, microsecond=0)
    offsets = [10, 14, 21]
    for offset in offsets[:n]:
        candidate = base + dt.timedelta(days=offset)
        while candidate.weekday() >= 5:
            candidate += dt.timedelta(days=1)
        slots.append(candidate)
    return slots


@router.post("/{mediation_id}/appointment/propose")
def propose_appointment(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Schlägt 3 Terminoptionen vor (alte werden ersetzt)."""
    _require_participant(mediation_id, current_user, db)

    old_slots = db.query(MediationAppointmentSlot).filter(
        MediationAppointmentSlot.mediation_id == mediation_id
    ).all()
    for slot in old_slots:
        db.query(MediationAppointmentVote).filter(
            MediationAppointmentVote.slot_id == slot.id
        ).delete()
    db.query(MediationAppointmentSlot).filter(
        MediationAppointmentSlot.mediation_id == mediation_id
    ).delete()

    new_slots = []
    for dt_val in _next_weekday_slots(3):
        slot = MediationAppointmentSlot(mediation_id=mediation_id, proposed_datetime=dt_val)
        db.add(slot)
        new_slots.append(slot)

    db.commit()
    for slot in new_slots:
        db.refresh(slot)

    return [
        {"id": s.id, "proposed_datetime": s.proposed_datetime.isoformat()}
        for s in new_slots
    ]


class AppointmentVoteRequest(BaseModel):
    slot_id: int
    accepted: bool


@router.post("/{mediation_id}/appointment/vote")
def vote_appointment_slot(
    mediation_id: int,
    payload: AppointmentVoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Speichert die Zu- oder Absage eines Teilnehmers zu einem Terminslot (Upsert)."""
    participant = _require_participant(mediation_id, current_user, db)

    slot = db.query(MediationAppointmentSlot).filter(
        MediationAppointmentSlot.id == payload.slot_id,
        MediationAppointmentSlot.mediation_id == mediation_id,
    ).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Terminslot nicht gefunden")

    existing_vote = db.query(MediationAppointmentVote).filter(
        MediationAppointmentVote.slot_id == payload.slot_id,
        MediationAppointmentVote.participant_id == participant.id,
    ).first()

    if existing_vote:
        existing_vote.accepted = payload.accepted
    else:
        existing_vote = MediationAppointmentVote(
            slot_id=payload.slot_id,
            participant_id=participant.id,
            accepted=payload.accepted,
        )
        db.add(existing_vote)

    db.commit()
    db.refresh(existing_vote)
    return {"ok": True, "slot_id": existing_vote.slot_id, "accepted": existing_vote.accepted}


@router.get("/{mediation_id}/appointment/slots")
def get_appointment_slots(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Gibt alle Slots mit Abstimmungsstand zurück.

    `reserved` ist der Slot, dem alle Beteiligten zugestimmt haben, der aber
    noch auf die finale Bestätigung durch den Mediator wartet. `confirmed`
    ist erst gesetzt, wenn der Mediator final bestätigt hat – nur dann ist
    der Termin verbindlich.
    """
    _require_participant(mediation_id, current_user, db)

    slots = db.query(MediationAppointmentSlot).filter(
        MediationAppointmentSlot.mediation_id == mediation_id
    ).all()

    all_participants = db.query(MediationParticipant).filter(
        MediationParticipant.mediation_id == mediation_id
    ).all()
    all_participant_ids = {p.id for p in all_participants}
    participant_count = len(all_participants)

    result = []
    confirmed_slot = None
    reserved_slot = None

    for slot in slots:
        votes = db.query(MediationAppointmentVote, MediationParticipant, User).join(
            MediationParticipant, MediationAppointmentVote.participant_id == MediationParticipant.id
        ).join(
            User, MediationParticipant.user_id == User.id
        ).filter(MediationAppointmentVote.slot_id == slot.id).all()

        vote_list = [
            {"participant_id": v.participant_id, "name": user.name, "accepted": v.accepted}
            for v, participant, user in votes
        ]
        voted_ids = {v.participant_id for v, _, _ in votes}
        accepted_ids = {v.participant_id for v, _, _ in votes if v.accepted}
        all_accepted = participant_count > 0 and all_participant_ids == accepted_ids
        all_voted = all_participant_ids == voted_ids
        mediator_confirmed = slot.mediator_confirmed_at is not None
        status = "confirmed" if mediator_confirmed else ("reserved" if all_accepted else "proposed")

        slot_data = {
            "id": slot.id,
            "proposed_datetime": slot.proposed_datetime.isoformat(),
            "votes": vote_list,
            "all_accepted": all_accepted,
            "all_voted": all_voted,
            "mediator_confirmed": mediator_confirmed,
            "status": status,
        }
        result.append(slot_data)
        if status == "confirmed":
            confirmed_slot = slot_data
        elif status == "reserved":
            reserved_slot = slot_data

    return {"slots": result, "confirmed": confirmed_slot, "reserved": reserved_slot}


class AppointmentConfirmRequest(BaseModel):
    slot_id: int


@router.post("/{mediation_id}/appointment/confirm")
def confirm_appointment_slot(
    mediation_id: int,
    payload: AppointmentConfirmRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Finale Bestätigung eines reservierten Terminslots durch den Mediator.

    Erst ab dieser Bestätigung gilt der Termin als verbindlich vereinbart.
    Nur Nutzer mit globaler Rolle 'mediator' oder 'admin' dürfen das.
    """
    if current_user.role not in ("mediator", "admin"):
        raise HTTPException(status_code=403, detail="Nur Mediatoren dürfen Termine final bestätigen")

    slot = db.query(MediationAppointmentSlot).filter(
        MediationAppointmentSlot.id == payload.slot_id,
        MediationAppointmentSlot.mediation_id == mediation_id,
    ).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Terminslot nicht gefunden")

    all_participants = db.query(MediationParticipant).filter(
        MediationParticipant.mediation_id == mediation_id
    ).all()
    all_participant_ids = {p.id for p in all_participants}
    accepted_ids = {
        v.participant_id for v in db.query(MediationAppointmentVote).filter(
            MediationAppointmentVote.slot_id == slot.id,
            MediationAppointmentVote.accepted == True,  # noqa: E712
        ).all()
    }
    all_accepted = bool(all_participant_ids) and all_participant_ids == accepted_ids
    if not all_accepted:
        raise HTTPException(
            status_code=400,
            detail="Dieser Termin wurde noch nicht von allen Beteiligten akzeptiert",
        )

    import datetime as dt
    slot.mediator_confirmed_at = dt.datetime.utcnow()
    db.commit()
    db.refresh(slot)

    return {
        "ok": True,
        "slot_id": slot.id,
        "proposed_datetime": slot.proposed_datetime.isoformat(),
        "mediator_confirmed_at": slot.mediator_confirmed_at.isoformat(),
    }


from app.models.mediation_feedback import MediationFeedback


class FeedbackSaveRequest(BaseModel):
    occasion: str  # "after_videocall" | "before_contract"
    answers: dict


@router.post("/{mediation_id}/feedback")
def save_feedback(
    mediation_id: int,
    payload: FeedbackSaveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Speichert das Feedback eines Teilnehmers für einen Anlass.

    Jede Einreichung wird als neue Zeile gespeichert (keine Upsert-Logik mehr),
    damit der Mediator im Workspace den Zeitverlauf wiederholter Rückmeldungen
    eines Teilnehmers sehen kann.
    """
    import json as _json
    import datetime as _dt

    participant = _require_participant(mediation_id, current_user, db)

    if payload.occasion not in ("after_videocall", "before_contract"):
        raise HTTPException(status_code=422, detail="Ungültiger Anlass")

    entry = MediationFeedback(
        mediation_id=mediation_id,
        participant_id=participant.id,
        occasion=payload.occasion,
        answers=_json.dumps(payload.answers, ensure_ascii=False),
        created_at=_dt.datetime.utcnow(),
        updated_at=_dt.datetime.utcnow(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"ok": True, "id": entry.id}


@router.get("/{mediation_id}/feedback/me")
def get_my_feedback(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Gibt zurück, für welche Anlässe der aktuelle Teilnehmer bereits Feedback abgegeben hat."""
    participant = _require_participant(mediation_id, current_user, db)

    occasions = (
        db.query(MediationFeedback.occasion)
        .filter(
            MediationFeedback.mediation_id == mediation_id,
            MediationFeedback.participant_id == participant.id,
        )
        .distinct()
        .all()
    )
    return {"submitted_occasions": [o[0] for o in occasions]}


@router.get("/{mediation_id}/feedback")
def get_feedback(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Gibt alle Feedback-Einträge eines Falls zurück (chronologisch), inkl. Teilnehmername/-rolle."""
    import json as _json

    # Sicherstellen, dass der aktuelle Nutzer Teil dieses Falls ist.
    _require_participant(mediation_id, current_user, db)

    rows = (
        db.query(MediationFeedback, MediationParticipant, User)
        .join(MediationParticipant, MediationFeedback.participant_id == MediationParticipant.id)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(MediationFeedback.mediation_id == mediation_id)
        .order_by(MediationFeedback.created_at.asc())
        .all()
    )

    result = []
    for feedback, participant, user in rows:
        try:
            answers = _json.loads(feedback.answers)
        except (TypeError, ValueError):
            answers = {}
        result.append({
            "id": feedback.id,
            "occasion": feedback.occasion,
            "participant_id": participant.id,
            "participant_name": user.name,
            "participant_role": participant.role,
            "answers": answers,
            "created_at": feedback.created_at.isoformat(),
        })
    return result


# ── KI-Analyse (SWOT + Gesprächstipps) ──────────────────────────────────────

@router.post("/{mediation_id}/analyse")
def analyse_mediation(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Generiert SWOT-Analyse + Gesprächstipps pro Teilnehmer für den Mediator."""
    import json as _json
    import anthropic
    from app.config import settings

    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(status_code=503, detail="KI nicht konfiguriert")

    # Nur Mediator/Owner/Admin darf analysieren
    participant = _require_participant(mediation_id, current_user, db)
    if participant.role not in ("mediator", "owner", "admin"):
        raise HTTPException(status_code=403, detail="Nur für Mediatoren")

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation nicht gefunden")

    # Alle Teilnehmer laden
    participants_with_users = (
        db.query(MediationParticipant, User)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .all()
    )
    participants_info = [
        {"name": u.name, "email": u.email, "role": p.role}
        for p, u in participants_with_users
    ]

    # Alle Notizen laden
    notes = (
        db.query(MediationNote, MediationParticipant, User)
        .join(MediationParticipant, MediationNote.participant_id == MediationParticipant.id)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(MediationNote.mediation_id == mediation_id, MediationNote.submitted == True)
        .all()
    )

    notes_text = ""
    for note, part, user in notes:
        content = note.content
        try:
            parsed = _json.loads(content)
            if isinstance(parsed, list):
                content = " | ".join(str(x) for x in parsed if x)
        except Exception:
            pass
        notes_text += f"\n[{user.name} / {note.phase} / {note.step}]: {content}"

    type_labels = {
        "trennung": "Trennung & Scheidung",
        "erbschaft": "Erbschaftsstreit",
        "nachbarschaft": "Nachbarschaftskonflikt",
    }
    type_label = type_labels.get(mediation.mediation_type or "", mediation.mediation_type or "")
    phase_labels = {
        "einleitung": "Einleitung",
        "themensammlung": "Themensammlung",
        "interessen": "Interessen",
        "optionen": "Optionen",
        "verhandlung": "Verhandlung",
        "abschluss": "Abschluss",
    }
    current_phase = phase_labels.get(mediation.phase or "", mediation.phase or "Unbekannt")

    participants_list = "\n".join(
        f"- {p['name']} ({p['role']})" for p in participants_info
    )

    prompt = f"""Du bist ein erfahrener Mediationsexperte. Analysiere den folgenden Mediationsfall und gib eine strukturierte JSON-Antwort zurück.

FALLDETAILS:
- Titel: {mediation.title or 'Neue Mediation'}
- Konfliktart: {type_label}
- Aktuelle Phase: {current_phase}
- Beschreibung: {mediation.description or 'Keine Beschreibung'}
- Priorität/Dringlichkeit: {mediation.priority or 'Nicht angegeben'}

BETEILIGTE:
{participants_list}

BISHERIGE NOTIZEN DER PARTEIEN:
{notes_text if notes_text.strip() else 'Noch keine Notizen eingereicht.'}

Erstelle eine Analyse mit folgendem JSON-Format (auf Deutsch):
{{
  "swot": {{
    "staerken": ["...", "..."],
    "schwaechen": ["...", "..."],
    "chancen": ["...", "..."],
    "risiken": ["...", "..."]
  }},
  "zusammenfassung": "2-3 Sätze zur Gesamtlage der Mediation",
  "empfehlungen": ["...", "..."],
  "teilnehmer_tipps": [
    {{
      "name": "Name des Teilnehmers",
      "rolle": "Rolle",
      "tipps": ["Konkreter Gesprächstipp 1", "Tipp 2", "Tipp 3"]
    }}
  ]
}}

WICHTIG: Antworte NUR mit dem JSON-Objekt, ohne Erklärung, ohne Markdown-Code-Blöcke."""

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    # Markdown-Blöcke entfernen falls vorhanden
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        result = _json.loads(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="KI-Antwort konnte nicht verarbeitet werden")

    return result
