from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_invite import MediationInvite
from app.models.mediation_note import MediationNote
from app.models.note_reaction import NoteReaction
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
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

    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(mediation, key, value)

    db.commit()
    db.refresh(mediation)
    return mediation


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
    all_submitted = len(result) > 0 and all(r["submitted"] for r in result)
    return {"participants": result, "all_submitted": all_submitted}


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
    signed_ids = {sig.participant_id for sig, _, _ in signatures}
    all_signed = len(all_participants) > 0 and all(p.id in signed_ids for p in all_participants)

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


@router.get("/appointments/all")
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Gibt alle Terminslots zurück, an denen der aktuelle Nutzer beteiligt ist."""
    # Alle Mediations-IDs des Users ermitteln
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
            "mediation_type": mediation.conflict_type,
            "proposed_datetime": slot.proposed_datetime.isoformat(),
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


@router.get("/{mediation_id}/appointment/slots")
def get_appointment_slots(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Gibt alle Slots mit Abstimmungsstand zurück."""
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

        slot_data = {
            "id": slot.id,
            "proposed_datetime": slot.proposed_datetime.isoformat(),
            "votes": vote_list,
            "all_accepted": all_accepted,
            "all_voted": all_voted,
        }
        result.append(slot_data)
        if all_accepted:
            confirmed_slot = slot_data

    return {"slots": result, "confirmed": confirmed_slot}


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
