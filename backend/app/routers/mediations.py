from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.invoice import Invoice
from app.models.mediation import Mediation
from app.models.mediation_invite import MediationInvite
from app.models.mediation_note import MediationNote
from app.models.note_reaction import NoteReaction
from app.models.mediation_participant import MediationParticipant
from app.models.mediation_step_rule import MediationStepRule
from app.models.mediation_custom_step import MediationCustomStep
from app.models.mediation_step_content import MediationStepContent
from app.models.mediation_block_response import MediationBlockResponse
from app.models.phase_step_default import PhaseStepDefault
from app.models.mediation_variant import MediationVariant
from app.models.user import User
from app.paypal import PayPalError, capture_order, create_order
from app.prompts import get_prompt
from app.routers.invoices import _next_invoice_number
from app.security import get_current_user, get_current_db_user
from app.services.llm import ai_complete
from app import pricing
from app.services import billing


router = APIRouter(prefix="/mediations", tags=["mediations"])
mediations = []


class MediationCreate(BaseModel):
    title: Optional[str] = None
    mediation_type: str
    description: Optional[str] = None
    priority: Optional[str] = None
    role: Optional[str] = None
    status: str = "draft"
    # Gewähltes Paket (online | hybrid | vollservice). Bestimmt zusammen mit
    # mediation_type den Preis (siehe app/pricing.py).
    package: Optional[str] = None


class MediationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    phase: Optional[str] = None
    # Paket (online|hybrid|vollservice) – solange der Fall noch nicht bezahlt ist,
    # änderbar (z.B. im Erstell-Wizard). Wird serverseitig normalisiert.
    package: Optional[str] = None
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


def _require_paid_participant(mediation_id: int, user: User, db: Session) -> MediationParticipant:
    """Wie `_require_participant`, erzwingt aber zusätzlich die Paywall: bei noch
    nicht bezahltem Fall wird für Parteien mit 402 abgewiesen (Mediator/Admin
    ausgenommen, siehe billing.ensure_unlocked). An allen Endpunkten verwenden,
    die bezahlte Mediations-Inhalte liefern oder verändern."""
    participant = _require_participant(mediation_id, user, db)
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")
    billing.ensure_unlocked(mediation, participant, user)
    return participant


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


# ── Rechnungsadresse (pro Fall, am eigenen Teilnehmer-Datensatz) ──────────────
#
# Wird abgefragt, bevor ein Fall gestartet werden kann, weil der Start
# (status -> "active", siehe update_mediation) automatisch eine Rechnung für
# den startenden Teilnehmer anlegt und diese Adresse als Rechnungsempfänger
# braucht (siehe Invoice.billing_* in models/invoice.py).

def _serialize_billing_address(participant: MediationParticipant) -> dict:
    return {
        "billing_street": participant.billing_street,
        "billing_postal_code": participant.billing_postal_code,
        "billing_city": participant.billing_city,
    }


class BillingAddressUpdate(BaseModel):
    billing_street: str
    billing_postal_code: str
    billing_city: str


@router.get("/{mediation_id}/billing-address")
def get_billing_address(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Liefert die Rechnungsadresse des AUFRUFENDEN Nutzers für diesen Fall."""
    participant = _require_participant(mediation_id, current_user, db)
    return _serialize_billing_address(participant)


@router.patch("/{mediation_id}/billing-address")
def update_billing_address(
    mediation_id: int,
    payload: BillingAddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Setzt/ändert die Rechnungsadresse des AUFRUFENDEN Nutzers für diesen Fall."""
    participant = _require_participant(mediation_id, current_user, db)

    street = payload.billing_street.strip()
    postal_code = payload.billing_postal_code.strip()
    city = payload.billing_city.strip()
    if not street or not postal_code or not city:
        raise HTTPException(
            status_code=422,
            detail="Straße, PLZ und Ort dürfen nicht leer sein",
        )

    participant.billing_street = street
    participant.billing_postal_code = postal_code
    participant.billing_city = city
    db.commit()
    db.refresh(participant)
    return _serialize_billing_address(participant)


def _mediation_price_eur(db: Session, mediation_id: int) -> float:
    """DEPRECATED – Summe der Grundbeträge aller zahlungspflichtigen Parteien.

    Wird nur noch als grober Gesamtpreis (z.B. Übersicht) genutzt. Die tatsächliche
    Abrechnung läuft pro Partei über app/services/billing.py.
    """
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        return 0.0
    return round(sum(billing.participant_base_due(db, mediation, p) for p in billing.owing_participants(db, mediation)), 2)


def _ensure_start_invoice(
    db: Session, mediation: Mediation, participant: MediationParticipant, user: User
) -> None:
    """
    Legt automatisch eine Rechnung an, wenn ein Fall gestartet wird (siehe
    update_mediation unten). Rechnungsempfänger ist der Teilnehmer, der den
    Fall startet (dessen Rechnungsadresse an dieser Stelle bereits Pflicht
    ist, siehe /billing-address-Endpoints oben).

    Idempotent: existiert für (mediation, participant) bereits eine
    Rechnung (z.B. durch einen erneuten PATCH-Aufruf), wird keine zweite
    angelegt.

    Die Rechnung geht NICHT automatisch per E-Mail raus - sie steht zunächst
    nur als PDF zum Ansehen/Ausdrucken bereit (GET /invoices/{id}/pdf). Erst
    ein Mediator/Admin kann sie nach Prüfung explizit per E-Mail freigeben
    (POST /invoices/{id}/send-email, siehe routers/invoices.py).

    Steuersatz wird bewusst auf 0.0 als Platzhalter gesetzt (auf Wunsch von
    Julian, da die USt-ID/Kleinunternehmer-Status noch nicht final geklärt
    ist) - der Mediator/Admin muss den tatsächlichen Satz vor Freigabe im
    Rechnungsformular prüfen und ggf. anpassen.
    """
    existing = (
        db.query(Invoice)
        .filter(
            Invoice.mediation_id == mediation.id,
            Invoice.participant_id == participant.id,
        )
        .first()
    )
    if existing:
        return

    invoice = Invoice(
        invoice_number=_next_invoice_number(db),
        mediation_id=mediation.id,
        participant_id=participant.id,
        payer_name=user.name,
        payer_email=user.email,
        billing_street=participant.billing_street,
        billing_postal_code=participant.billing_postal_code,
        billing_city=participant.billing_city,
        amount=billing.participant_final_due(db, mediation, participant),
        tax_rate=0.0,
        currency="EUR",
        status="paid",
        issued_at=datetime.now(timezone.utc),
        paid_at=datetime.now(timezone.utc),
    )
    db.add(invoice)
    db.commit()


MEDIATOR_ROLE = "mediator"


def _mediator_participant(db: Session, mediation_id: int) -> MediationParticipant | None:
    return (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.role == MEDIATOR_ROLE,
        )
        .first()
    )


def _ensure_default_mediator(db: Session, mediation: Mediation) -> None:
    """Ordnet dem Fall den Standard-Mediator (settings.DEFAULT_MEDIATOR_EMAIL) zu,
    sofern noch kein Mediator zugeordnet ist UND dieser Nutzer existiert. Legt
    bewusst KEINEN Nutzer automatisch an (siehe Produktentscheidung)."""
    if _mediator_participant(db, mediation.id):
        return
    mediator_user = (
        db.query(User)
        .filter(func.lower(User.email) == settings.DEFAULT_MEDIATOR_EMAIL.lower())
        .first()
    )
    if not mediator_user:
        return
    db.add(
        MediationParticipant(
            mediation_id=mediation.id,
            user_id=mediator_user.id,
            role=MEDIATOR_ROLE,
        )
    )
    db.commit()


def _serialize_mediator(db: Session, mediation_id: int) -> dict | None:
    part = _mediator_participant(db, mediation_id)
    if not part:
        return None
    u = db.query(User).filter(User.id == part.user_id).first()
    if not u:
        return None
    return {"participant_id": part.id, "user_id": u.id, "name": u.name, "email": u.email}


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
        package=pricing.normalize_package(mediation.package),
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

    # Jeder Fall bekommt automatisch den Standard-Mediator zugeordnet (falls vorhanden).
    _ensure_default_mediator(db, db_mediation)

    return {
        "mediation_id": db_mediation.id,
        "id": db_mediation.id,
        "title": db_mediation.title,
        "mediation_type": db_mediation.mediation_type,
        "variant_key": db_mediation.variant_key,
        "description": db_mediation.description,
        "priority": db_mediation.priority,
        "role": db_mediation.role,
        "status": db_mediation.status,
        "package": db_mediation.package,
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

    # Paket normalisieren; nach Bezahlung nicht mehr änderbar (Preis fixiert).
    if "package" in update_data:
        if mediation.is_paid:
            update_data.pop("package")
        else:
            update_data["package"] = pricing.normalize_package(update_data["package"])

    # Phase 1 darf erst starten, wenn bezahlt wurde. Diese Prüfung greift
    # serverseitig, damit ein direkter API-Call (z.B. via Link) die Paywall
    # nicht umgehen kann.
    if update_data.get("status") == "active" and not mediation.is_paid:
        raise HTTPException(
            status_code=402,
            detail="Zahlung erforderlich, bevor die Mediation gestartet werden kann.",
        )

    # "Fall wird gestartet" = Übergang nach status "active". Genau in diesem
    # Moment wird automatisch eine Rechnung für den startenden Teilnehmer
    # angelegt (siehe _ensure_start_invoice) - dafür muss die Rechnungsadresse
    # vorher hinterlegt sein (siehe /billing-address-Endpoints oben).
    starting_now = update_data.get("status") == "active" and mediation.status != "active"
    if starting_now and not (
        is_participant.billing_street
        and is_participant.billing_postal_code
        and is_participant.billing_city
    ):
        raise HTTPException(
            status_code=422,
            detail="Bitte hinterlege zuerst deine Rechnungsadresse (Straße, PLZ, Ort), bevor du die Mediation startest.",
        )

    for key, value in update_data.items():
        setattr(mediation, key, value)

    db.commit()
    db.refresh(mediation)

    if starting_now:
        _ensure_start_invoice(db, mediation, is_participant, user)

    return mediation


@router.get("/packages/{mediation_type}")
def list_packages(
    mediation_type: str,
    user: User = Depends(get_current_db_user),
):
    """Angebotene Pakete + Grundpreise für einen Konflikttyp (für die Paketwahl
    bei der Fallerstellung). "packages" kollidiert nicht mit /{mediation_id},
    da mediation_id ein int ist."""
    return {
        "mediation_type": mediation_type,
        "billing_model": pricing.billing_model(mediation_type),
        "packages": pricing.available_packages(mediation_type),
    }


class DiscountApplyRequest(BaseModel):
    code: str


def _payment_status_payload(db: Session, mediation: Mediation, me: MediationParticipant) -> dict:
    """Vollständiger Bezahl-Status: eigener Anteil + Status aller Parteien."""
    my_base = billing.participant_base_due(db, mediation, me)
    my_final = billing.participant_final_due(db, mediation, me)

    parties = []
    for p in (
        db.query(MediationParticipant)
        .filter(MediationParticipant.mediation_id == mediation.id)
        .all()
    ):
        # Nur zahlungspflichtige Parteien (owner/other_party) im Bezahl-Status listen;
        # Mediator/Beobachter erscheinen hier nicht.
        if not billing.is_paying_party(p):
            continue
        owes = billing.participant_owes(mediation, p)
        u = db.query(User).filter(User.id == p.user_id).first()
        parties.append({
            "participant_id": p.id,
            "role": p.role,
            "name": (u.name if u else None),
            "owes": owes,
            "paid": bool(p.paid),
            "amount_due_eur": billing.participant_final_due(db, mediation, p) if owes else 0.0,
            "is_you": p.id == me.id,
        })

    return {
        "mediation_type": mediation.mediation_type,
        "package": mediation.package,
        "billing_model": pricing.billing_model(mediation.mediation_type),
        "case_base_price_eur": pricing.base_price(mediation.mediation_type, mediation.package),
        "is_paid": bool(mediation.is_paid),
        "all_owing_paid": billing.all_owing_paid(db, mediation),
        "you": {
            "owes": billing.participant_owes(mediation, me),
            "base_due_eur": my_base,
            "discount_code": me.discount_code,
            "discount_amount_eur": round(me.discount_amount or 0.0, 2),
            "amount_due_eur": my_final,
            "paid": bool(me.paid),
        },
        "participants": parties,
    }


def _get_mediation_or_404(db: Session, mediation_id: int) -> Mediation:
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")
    return mediation


@router.get("/{mediation_id}/price")
def get_mediation_price(
    mediation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Bezahl-Status für die aktuelle Partei: eigener Anteil (nach Rabatt) plus
    Status aller Parteien. Der Fall wird erst freigeschaltet, wenn alle
    zahlungspflichtigen Parteien bezahlt haben."""
    me = _require_participant(mediation_id, user, db)
    mediation = _get_mediation_or_404(db, mediation_id)
    return _payment_status_payload(db, mediation, me)


@router.post("/{mediation_id}/discount")
def apply_discount(
    mediation_id: int,
    payload: DiscountApplyRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Wendet einen Rabattcode auf den eigenen Anteil an (löst ihn noch nicht ein –
    das geschieht erst bei erfolgreicher Zahlung)."""
    me = _require_participant(mediation_id, user, db)
    mediation = _get_mediation_or_404(db, mediation_id)
    if me.paid:
        raise HTTPException(status_code=400, detail="Dein Anteil ist bereits bezahlt.")

    base_due = billing.participant_base_due(db, mediation, me)
    discount, code = billing.validate_discount(db, payload.code, mediation, base_due)

    me.discount_code = code.code
    me.discount_amount = discount
    db.commit()
    db.refresh(me)
    return _payment_status_payload(db, mediation, me)


@router.delete("/{mediation_id}/discount")
def remove_discount(
    mediation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Entfernt einen zuvor angewendeten (noch nicht bezahlten) Rabattcode."""
    me = _require_participant(mediation_id, user, db)
    mediation = _get_mediation_or_404(db, mediation_id)
    if me.paid:
        raise HTTPException(status_code=400, detail="Dein Anteil ist bereits bezahlt.")
    me.discount_code = None
    me.discount_amount = 0.0
    db.commit()
    db.refresh(me)
    return _payment_status_payload(db, mediation, me)


class PayPalCaptureRequest(BaseModel):
    order_id: str


@router.post("/{mediation_id}/pay/paypal/create-order")
async def create_paypal_order(
    mediation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Erstellt eine PayPal-Order über den EIGENEN Anteil dieser Partei (nach Rabatt)."""
    me = _require_participant(mediation_id, user, db)
    mediation = _get_mediation_or_404(db, mediation_id)
    if me.paid:
        raise HTTPException(status_code=400, detail="Dein Anteil ist bereits bezahlt.")

    if not billing.participant_owes(mediation, me):
        raise HTTPException(status_code=400, detail="Für dich fällt kein Betrag an.")

    amount = billing.participant_final_due(db, mediation, me)
    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Dein Anteil beträgt 0 € – nutze die kostenlose Freischaltung.",
        )

    try:
        order = await create_order(amount, mediation_id)
    except PayPalError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return {"order_id": order["id"], "amount_eur": amount}


@router.post("/{mediation_id}/pay/paypal/capture-order")
async def capture_paypal_order(
    mediation_id: int,
    payload: PayPalCaptureRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Erfasst die genehmigte PayPal-Order für den EIGENEN Anteil.

    Erst wenn PayPal "COMPLETED" meldet, gilt der Anteil als bezahlt. Der Fall
    wird freigeschaltet, sobald ALLE zahlungspflichtigen Parteien bezahlt haben.
    """
    me = _require_participant(mediation_id, user, db)
    mediation = _get_mediation_or_404(db, mediation_id)

    try:
        result = await capture_order(payload.order_id)
    except PayPalError as e:
        raise HTTPException(status_code=502, detail=str(e))

    if result.get("status") != "COMPLETED":
        raise HTTPException(
            status_code=402,
            detail="Die Zahlung wurde von PayPal nicht als abgeschlossen gemeldet.",
        )

    amount = billing.participant_final_due(db, mediation, me)
    billing.mark_participant_paid(db, me, amount=amount, order_id=payload.order_id)
    billing.check_and_unlock(db, mediation)
    db.refresh(mediation)
    return {"ok": True, **_payment_status_payload(db, mediation, me)}


@router.post("/{mediation_id}/pay/free")
def redeem_free(
    mediation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Schaltet den eigenen Anteil ohne Zahlung frei, wenn er (z.B. durch einen
    Voll-Rabattcode) 0 € beträgt."""
    me = _require_participant(mediation_id, user, db)
    mediation = _get_mediation_or_404(db, mediation_id)
    if me.paid:
        raise HTTPException(status_code=400, detail="Dein Anteil ist bereits bezahlt.")

    amount = billing.participant_final_due(db, mediation, me)
    owes = billing.participant_owes(mediation, me)
    if owes and amount > 0:
        raise HTTPException(
            status_code=400,
            detail="Es ist noch ein Betrag offen – bitte per PayPal bezahlen.",
        )

    billing.mark_participant_paid(db, me, amount=0.0)
    billing.check_and_unlock(db, mediation)
    db.refresh(mediation)
    return {"ok": True, **_payment_status_payload(db, mediation, me)}


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
            "variant_key": mediation.variant_key,
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
            "variant_key": m.variant_key,
            "status": m.status,
            "phase": m.phase,
            "role": "mediator",
        }
        for m in rows
    ]

@router.get("/mediators")
def list_available_mediators(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Alle Nutzer mit Rolle 'mediator' – für die Mediator-Auswahl im Workspace.
    Nur für Mediatoren/Admins. MUSS vor /{mediation_id} (int) stehen, sonst
    würde "mediators" als mediation_id interpretiert (422)."""
    if current_user.role not in ("mediator", "admin"):
        raise HTTPException(status_code=403, detail="Nur für Mediatoren und Admins zugänglich")
    users = db.query(User).filter(User.role == "mediator").order_by(User.name).all()
    return [{"user_id": u.id, "name": u.name, "email": u.email} for u in users]


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
        "variant_key": mediation.variant_key,
        "description": mediation.description,
        "priority": mediation.priority,
        "status": mediation.status,
        "phase": mediation.phase,
        "role": is_participant.role,
        "is_paid": mediation.is_paid,
        "mediator": _serialize_mediator(db, mediation.id),
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


class MediatorAssignRequest(BaseModel):
    user_id: int


@router.post("/{mediation_id}/mediator")
def assign_mediator(
    mediation_id: int,
    payload: MediatorAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Ordnet dem Fall einen Mediator zu bzw. wechselt ihn (nur Mediator/Admin).
    Es bleibt immer genau ein Mediator-Teilnehmer übrig."""
    if current_user.role not in ("mediator", "admin"):
        raise HTTPException(status_code=403, detail="Nur Mediatoren/Admins dürfen den Mediator ändern.")

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    new_mediator = db.query(User).filter(User.id == payload.user_id).first()
    if not new_mediator or new_mediator.role != "mediator":
        raise HTTPException(status_code=400, detail="Ausgewählter Nutzer ist kein Mediator.")

    # Alle bisherigen Mediator-Teilnehmer entfernen, damit genau einer übrig bleibt.
    db.query(MediationParticipant).filter(
        MediationParticipant.mediation_id == mediation_id,
        MediationParticipant.role == MEDIATOR_ROLE,
    ).delete(synchronize_session=False)

    db.add(
        MediationParticipant(
            mediation_id=mediation_id,
            user_id=new_mediator.id,
            role=MEDIATOR_ROLE,
        )
    )
    db.commit()
    return {"ok": True, "mediator": _serialize_mediator(db, mediation_id)}


# ── Notizen & Schritte ─────────────────────────────────────────────────────────

@router.get("/{mediation_id}/notes")
def get_notes(
    mediation_id: int,
    phase: str = Query(...),
    step: str = Query(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_paid_participant(mediation_id, current_user, db)
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
    _require_paid_participant(mediation_id, current_user, db)

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


def _is_visible(cond, flags) -> bool:
    """Wertet eine visible_if-Bedingung gegen die Fall-Flags aus.

    cond-Form: {"all": [{"flag": "glasl_zone", "eq": "lose_lose"}, ...]}
    (alle Bedingungen müssen zutreffen). None/leer = immer sichtbar. Fehlt ein
    Flag im Fall, gilt die Bedingung als NICHT erfüllt (tolerant: kein Crash).
    """
    if not cond or not isinstance(cond, dict):
        return True
    conditions = cond.get("all")
    if not conditions or not isinstance(conditions, list):
        return True
    flag_map = flags if isinstance(flags, dict) else {}
    for c in conditions:
        if not isinstance(c, dict):
            continue
        if flag_map.get(c.get("flag")) != c.get("eq"):
            return False
    return True


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
    _require_paid_participant(mediation_id, current_user, db)

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    # Standard-Schritte (variant_key IS NULL) gelten immer; Schritte einer
    # Variante kommen nur dazu, wenn dieser Fall ihr zugeordnet ist
    # (mediations.variant_key). Varianten sind additiv, siehe MediationVariant.
    variant_filter = PhaseStepDefault.variant_key.is_(None)
    if mediation.variant_key:
        variant_filter = or_(
            variant_filter,
            PhaseStepDefault.variant_key == mediation.variant_key,
        )
    defaults = (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == mediation.mediation_type,
            PhaseStepDefault.phase == phase,
            PhaseStepDefault.enabled.is_(True),
            variant_filter,
        )
        # Basis-Schritte zuerst (in ihrer Reihenfolge), danach die Zusatz-
        # Schritte der Variante (in ihrer eigenen Reihenfolge). Positionen
        # werden pro Scope (variant_key) unabhängig ab 0 vergeben, daher
        # nicht über beide Scopes hinweg mischen.
        .order_by(
            PhaseStepDefault.variant_key.isnot(None),
            PhaseStepDefault.position,
            PhaseStepDefault.id,
        )
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
    # Fallbezogener Inhalt für "individuelle" Schritte (step_key -> Eintrag).
    step_contents = {
        sc.step_key: sc
        for sc in db.query(MediationStepContent)
        .filter(
            MediationStepContent.mediation_id == mediation_id,
            MediationStepContent.phase == phase,
        )
        .all()
    }
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
        # Eskalations-/Segmentierungs-Filter: Schritte mit visible_if erscheinen
        # nur, wenn die Fall-Flags die Bedingung erfüllen.
        if not _is_visible(d.visible_if, mediation.flags):
            continue
        types = d.content_types.split(",") if d.content_types else None
        is_individual = bool(types) and "individuell" in types
        is_result = bool(types) and "ergebnis" in types
        # Bei individuellen Schritten überschreibt der fallbezogene Inhalt die
        # (leeren) globalen Vorgaben; sonst gelten die globalen Werte.
        sc = step_contents.get(d.step_key)
        # Ergebnis-Schritte: der pro Fall kuratierte Text wird NUR ausgeliefert,
        # wenn der Mediator ihn freigegeben hat (released) – sonst greift die
        # statische Beschreibung (Platzhalter/Einleitung), nie unfreigegebener Text.
        result_released = bool(sc and sc.released)
        if is_result:
            description = sc.body_text if (result_released and sc and sc.body_text) else d.description
        else:
            description = sc.body_text if (sc and sc.body_text is not None) else d.description
        steps.append(
            {
                "key": d.step_key,
                "title": d.title,
                "description": description,
                "placeholder": d.placeholder,
                "reflection_mode": d.reflection_mode,
                "content_types": types,
                "blocks": d.blocks or None,
                "video_url": (sc.video_url if sc and sc.video_url is not None else d.video_url),
                "meeting_url": (sc.meeting_url if sc and sc.meeting_url is not None else d.meeting_url),
                "question": (sc.question if sc and sc.question is not None else d.question),
                "contract_template": d.contract_template,
                "result_source_phase": d.result_source_phase,
                "result_released": result_released,
                "feedback_occasion": (
                    sc.feedback_occasion if sc and sc.feedback_occasion is not None else d.feedback_occasion
                ),
                "individual": is_individual,
                "custom": False,
            }
        )
    for c in custom_steps:
        rule = rules.get(c.step_key)
        if rule and rule.skip:
            continue
        sc = step_contents.get(c.step_key)
        steps.append(
            {
                "key": c.step_key,
                "title": c.title,
                "description": (sc.body_text if sc and sc.body_text is not None else c.description),
                "placeholder": "",
                "reflection_mode": None,
                "content_types": None,
                "blocks": None,
                "video_url": sc.video_url if sc else None,
                "meeting_url": sc.meeting_url if sc else None,
                "question": sc.question if sc else None,
                "contract_template": None,
                "result_source_phase": None,
                "result_released": bool(sc and sc.released),
                "feedback_occasion": sc.feedback_occasion if sc else None,
                "individual": True,
                "custom": True,
            }
        )

    return {
        "phase": phase,
        "mediation_type": mediation.mediation_type,
        "flags": mediation.flags or {},
        "steps": steps,
    }


class FlagsUpdate(BaseModel):
    # Zu setzende/aktualisierende Flags (werden mit den bestehenden gemerged).
    # Ein Flag auf None setzen entfernt es.
    flags: dict


@router.get("/{mediation_id}/flags")
def get_flags(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_paid_participant(mediation_id, current_user, db)
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")
    return {"flags": mediation.flags or {}}


@router.put("/{mediation_id}/flags")
def set_flags(
    mediation_id: int,
    payload: FlagsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Merged Flags in den Fall (Eskalations-/Segmentierungs-Steuerung).

    Nur Mediator/Owner/Admin – Flags wirken auf ALLE Teilnehmer (welche Schritte
    sichtbar sind), daher nicht durch eine einzelne Partei setzbar.
    """
    participant = _require_paid_participant(mediation_id, current_user, db)
    if participant.role not in _WORKFLOW_ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Nur Mediator/Owner dürfen Flags setzen")
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    current = dict(mediation.flags or {})
    for key, value in payload.flags.items():
        if value is None:
            current.pop(key, None)
        else:
            current[key] = value
    mediation.flags = current or None
    # JSON-Spalte: Neuzuweisung nötig, damit SQLAlchemy die Änderung erkennt.
    from sqlalchemy.orm.attributes import flag_modified

    flag_modified(mediation, "flags")
    db.commit()
    return {"flags": mediation.flags or {}}


def _save_ai_output(
    db: Session,
    mediation_id: int,
    phase: str,
    step_key: str,
    block_id: str,
    block_type: str,
    value,
) -> None:
    """Persistiert eine KI-Ausgabe als MediationBlockResponse (author='ai'),
    damit sie – wie alle anderen Eingaben – im Workspace-Fallmanager unter
    „Alle Eingaben" einsehbar bleibt. Pro (step_key, block_id) genau ein
    KI-Eintrag; ein erneuter Lauf überschreibt den alten (updated_at zeigt
    den letzten Stand)."""
    existing = (
        db.query(MediationBlockResponse)
        .filter(
            MediationBlockResponse.mediation_id == mediation_id,
            MediationBlockResponse.step_key == step_key,
            MediationBlockResponse.block_id == block_id,
            MediationBlockResponse.author_key == "ai",
        )
        .first()
    )
    if existing:
        existing.value = value
        existing.phase = phase
        existing.block_type = block_type
        existing.submitted = True
    else:
        db.add(
            MediationBlockResponse(
                mediation_id=mediation_id,
                phase=phase,
                step_key=step_key,
                block_id=block_id,
                block_type=block_type,
                author_key="ai",
                author_source="ai",
                author_participant_id=None,
                value=value,
                submitted=True,
            )
        )
    db.commit()


class SummarizeResultsRequest(BaseModel):
    # Phase, deren eingereichte Eingaben zusammengefasst werden sollen.
    # None = alle eingereichten Eingaben des Falls.
    source_phase: Optional[str] = None


@router.post("/{mediation_id}/summarize-results")
def summarize_results(
    mediation_id: int,
    payload: SummarizeResultsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """
    Erzeugt per KI eine neutrale, teilnehmer-taugliche Zusammenfassung der
    eingereichten Eingaben einer Quell-Phase. Nur Mediator/Owner/Admin.

    Das Ergebnis ist ein VORSCHLAG: Der Mediator kuratiert den Text und gibt ihn
    anschließend im Ergebnis-Schritt explizit frei (MediationStepContent.released),
    erst dann sehen ihn die Teilnehmer.
    """
    import json as _json

    participant = _require_paid_participant(mediation_id, current_user, db)
    if participant.role not in ("mediator", "owner", "admin"):
        raise HTTPException(status_code=403, detail="Nur für Mediatoren")

    q = (
        db.query(MediationNote, MediationParticipant, User)
        .join(MediationParticipant, MediationNote.participant_id == MediationParticipant.id)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(
            MediationNote.mediation_id == mediation_id,
            MediationNote.submitted == True,  # noqa: E712
        )
    )
    if payload.source_phase:
        q = q.filter(MediationNote.phase == payload.source_phase)
    rows = q.all()

    inputs_text = ""
    for note, _part, user in rows:
        content = note.content
        try:
            parsed = _json.loads(content)
            if isinstance(parsed, list):
                content = " | ".join(str(x) for x in parsed if x)
        except Exception:
            pass
        inputs_text += f"\n[{user.name} / {note.phase}]: {content}"

    if not inputs_text.strip():
        return {"summary": ""}

    prompt = get_prompt("summarize_results", inputs_text=inputs_text)

    summary = ai_complete(prompt, max_tokens=800)
    # KI-Ausgabe dauerhaft ablegen (einsehbar im Workspace unter „Alle Eingaben").
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    scope = payload.source_phase or "alle"
    _save_ai_output(
        db,
        mediation_id,
        phase=payload.source_phase or (mediation.phase if mediation and mediation.phase else "einleitung"),
        step_key="__ki__",
        block_id=f"zusammenfassung:{scope}",
        block_type="ki-zusammenfassung",
        value=summary,
    )
    return {"summary": summary}


@router.post("/{mediation_id}/notes")
def save_note(
    mediation_id: int,
    payload: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    own_participant = _require_paid_participant(mediation_id, current_user, db)

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

    # Paywall: eine zahlungspflichtige Partei darf die Inhalte erst nach Bezahlung
    # sehen; globale Mediator/Admin (ohne Teilnehmer-Eintrag) sind ausgenommen.
    if is_participant is not None:
        mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
        if mediation:
            billing.ensure_unlocked(mediation, is_participant, current_user)

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
            "participant_id": str(participant.id),
            "participant_name": user.name,
            "step": note.step,
            "content": note.content,
            "submitted": note.submitted,
        })

    # ── Block-Antworten (dynamische Schritte) inkl. KI-Beiträge ─────────────
    # Jede Eingabe über Block-Schritte landet in mediation_block_responses –
    # getrennt nach Autor (Partei / Mediator / KI). Hier werden sie zusammen
    # mit den klassischen Notizen ausgeliefert, damit der Fallmanager im
    # Workspace ALLE Eingaben eines Falls zeigt.
    participant_names: dict[int, str] = {
        p.id: u.name
        for p, u in (
            db.query(MediationParticipant, User)
            .join(User, MediationParticipant.user_id == User.id)
            .filter(MediationParticipant.mediation_id == mediation_id)
            .all()
        )
    }
    # step_key -> Titel (globale Defaults + fallbezogene Zusatz-Schritte).
    step_titles: dict[str, str] = {
        d.step_key: d.title
        for d in db.query(PhaseStepDefault).filter(PhaseStepDefault.enabled.is_(True)).all()
    }
    step_titles.update({
        c.step_key: c.title
        for c in db.query(MediationCustomStep)
        .filter(MediationCustomStep.mediation_id == mediation_id)
        .all()
    })
    step_titles["__ki__"] = "KI-Auswertung"

    # Sichtbarkeit wie in list_block_responses: Mediator/Owner/Admin sehen alle
    # Beiträge, eine Konfliktpartei nur die eigenen.
    is_case_manager = current_user.role in ("mediator", "admin") or (
        is_participant is not None and is_participant.role in ("mediator", "owner", "admin")
    )
    grouped_blocks: dict[str, list] = defaultdict(list)
    block_query = db.query(MediationBlockResponse).filter(
        MediationBlockResponse.mediation_id == mediation_id
    )
    if not is_case_manager and is_participant is not None:
        block_query = block_query.filter(
            MediationBlockResponse.author_participant_id == is_participant.id
        )
    block_rows = (
        block_query
        .order_by(
            MediationBlockResponse.phase,
            MediationBlockResponse.step_key,
            MediationBlockResponse.block_id,
        )
        .all()
    )
    for r in block_rows:
        if r.author_source == "ai":
            author_name = "KI"
        else:
            author_name = participant_names.get(r.author_participant_id or -1, "Unbekannt")
        grouped_blocks[r.phase].append({
            "step_key": r.step_key,
            "step_title": step_titles.get(r.step_key, r.step_key),
            "block_id": r.block_id,
            "block_type": r.block_type,
            "author_source": r.author_source,
            "author_name": author_name,
            "value": r.value,
            "submitted": r.submitted,
            "updated_at": r.updated_at.isoformat() if r.updated_at else None,
        })

    # Anzeigenamen identisch zum Workspace-Designer (app/workspace/types.ts).
    PHASE_LABELS = {
        "einladung": "Onboarding",
        "einleitung": "Einleitung",
        "themensammlung": "Themensammlung",
        "interessen": "Interessen",
        "optionen": "Optionen",
        "verhandlung": "Verhandlung",
        "abschluss": "Abschluss",
    }
    phase_order = list(PHASE_LABELS.keys())

    all_phases = sorted(
        set(grouped.keys()) | set(grouped_blocks.keys()),
        key=lambda p: (phase_order.index(p) if p in phase_order else len(phase_order), p),
    )
    return [
        {
            "phase": phase,
            "phase_label": PHASE_LABELS.get(phase, step_titles.get(phase, phase.capitalize())),
            "notes": grouped.get(phase, []),
            "block_responses": grouped_blocks.get(phase, []),
        }
        for phase in all_phases
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
    from_participant = _require_paid_participant(mediation_id, current_user, db)

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
    _require_paid_participant(mediation_id, current_user, db)

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
    type_labels = {
        "trennung": "Trennung & Scheidung",
        "erbschaft": "Erbschaftsstreit",
        "nachbarschaft": "Nachbarschaftskonflikt",
    }
    type_label = type_labels.get(payload.mediation_type, payload.mediation_type)

    prompt = get_prompt("generate_title", type_label=type_label, description=payload.description)

    title = ai_complete(prompt, max_tokens=30).strip('"').strip("'")
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
    _require_paid_participant(mediation_id, current_user, db)

    parts = "\n\n".join(
        f"**{inp['name']} ({inp['role']}):**\n{inp['content']}"
        for inp in payload.inputs
        if inp.get("content", "").strip()
    )
    prompt = get_prompt("reflect", step_title=payload.step_title, parts=parts)

    return {"reflection": ai_complete(prompt, max_tokens=1024)}


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

    # Paywall: Partei erst nach Bezahlung; globale Mediator/Admin ausgenommen.
    if participant is not None:
        billing.ensure_unlocked(mediation, participant, current_user)

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

    prompt = get_prompt("contract", notes_text=notes_text)

    generated_text = ai_complete(prompt, max_tokens=1200)

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
    _require_paid_participant(mediation_id, current_user, db)

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
    participant = _require_paid_participant(mediation_id, current_user, db)

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
    _require_paid_participant(mediation_id, current_user, db)

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
    participant = _require_paid_participant(mediation_id, current_user, db)

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
    _require_paid_participant(mediation_id, current_user, db)

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

    participant = _require_paid_participant(mediation_id, current_user, db)

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
    participant = _require_paid_participant(mediation_id, current_user, db)

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

    # Sicherstellen, dass der aktuelle Nutzer Teil dieses Falls ist (und bezahlt hat).
    _require_paid_participant(mediation_id, current_user, db)

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

    # Nur Mediator/Owner/Admin darf analysieren
    participant = _require_paid_participant(mediation_id, current_user, db)
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

    prompt = get_prompt(
        "analyse",
        title=mediation.title or "Neue Mediation",
        type_label=type_label,
        current_phase=current_phase,
        description=mediation.description or "Keine Beschreibung",
        priority=mediation.priority or "Nicht angegeben",
        participants_list=participants_list,
        notes_text=notes_text if notes_text.strip() else "Noch keine Notizen eingereicht.",
    )

    raw = ai_complete(prompt, max_tokens=1500)
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

    # KI-Ausgabe dauerhaft ablegen (einsehbar im Workspace unter „Alle Eingaben").
    _save_ai_output(
        db,
        mediation_id,
        phase=mediation.phase or "einleitung",
        step_key="__ki__",
        block_id="analyse",
        block_type="ki-analyse",
        value=result,
    )
    return result


# ── Fall-Analyse: Phasen-Zusammenfassungen + SWOT zur Finalisierung ─────────

PHASE_LABELS_ANALYSE = {
    "einladung": "Onboarding",
    "einleitung": "Einleitung",
    "themensammlung": "Themensammlung",
    "interessen": "Interessen",
    "optionen": "Optionen",
    "verhandlung": "Verhandlung",
    "abschluss": "Abschluss",
}

TYPE_LABELS_ANALYSE = {
    "trennung": "Trennung & Scheidung",
    "erbschaft": "Erbschaftsstreit",
    "nachbarschaft": "Nachbarschaftskonflikt",
    "geschaeft": "Geschäftskonflikt",
}


def _collect_inputs_text(db: Session, mediation_id: int, phase: str | None = None) -> str:
    """Sammelt alle Eingaben der Streitparteien UND des Mediators als Klartext –
    klassische Notizen (MediationNote) plus Block-Antworten (dynamische
    Schritte), KI-Beiträge ausgenommen. Optional auf eine Phase gefiltert.
    Dieser Text ist exakt das, was der Analyse-Prompt als Eingaben erhält."""
    import json as _json

    role_labels = {
        "mediator": "Mediator",
        "owner": "Partei",
        "admin": "Admin",
        "participant": "Partei",
    }

    lines: list[str] = []

    # Klassische Notizen (eingereicht)
    note_q = (
        db.query(MediationNote, MediationParticipant, User)
        .join(MediationParticipant, MediationNote.participant_id == MediationParticipant.id)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(
            MediationNote.mediation_id == mediation_id,
            MediationNote.submitted == True,  # noqa: E712
        )
    )
    if phase:
        note_q = note_q.filter(MediationNote.phase == phase)
    for note, part, user in note_q.order_by(MediationNote.phase, MediationNote.step).all():
        content = note.content
        try:
            parsed = _json.loads(content)
            if isinstance(parsed, list):
                content = " | ".join(str(x) for x in parsed if x)
        except Exception:
            pass
        role = role_labels.get(part.role, part.role or "Partei")
        label = PHASE_LABELS_ANALYSE.get(note.phase, note.phase)
        lines.append(f"[{user.name} ({role}) / Phase {label} / Schritt {note.step}]: {content}")

    # Block-Antworten (dynamische Schritte) – ohne KI-Beiträge
    participant_info = {
        p.id: (u.name, role_labels.get(p.role, p.role or "Partei"))
        for p, u in (
            db.query(MediationParticipant, User)
            .join(User, MediationParticipant.user_id == User.id)
            .filter(MediationParticipant.mediation_id == mediation_id)
            .all()
        )
    }
    block_q = db.query(MediationBlockResponse).filter(
        MediationBlockResponse.mediation_id == mediation_id,
        MediationBlockResponse.author_source != "ai",
    )
    if phase:
        block_q = block_q.filter(MediationBlockResponse.phase == phase)
    for r in block_q.order_by(
        MediationBlockResponse.phase,
        MediationBlockResponse.step_key,
        MediationBlockResponse.block_id,
    ).all():
        value = r.value
        if isinstance(value, (dict, list)):
            try:
                value = _json.dumps(value, ensure_ascii=False)
            except Exception:
                value = str(value)
        if value is None or not str(value).strip():
            continue
        name, role = participant_info.get(
            r.author_participant_id or -1, ("Unbekannt", "Partei")
        )
        if r.author_source == "mediator":
            role = "Mediator"
        label = PHASE_LABELS_ANALYSE.get(r.phase, r.phase)
        lines.append(
            f"[{name} ({role}) / Phase {label} / Schritt {r.step_key} / Block {r.block_id}]: {value}"
        )

    return "\n".join(lines)


class PhaseAnalyseRequest(BaseModel):
    phase: str


@router.post("/{mediation_id}/analyse-phase")
def analyse_phase(
    mediation_id: int,
    payload: PhaseAnalyseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """KI-Zusammenfassung der Eingaben (Parteien + Mediator) EINER Phase.

    Gibt neben der Zusammenfassung auch den vollständigen Prompt zurück, der an
    die KI gesendet wurde (Transparenz). Das Ergebnis wird als
    MediationBlockResponse (author='ai') gespeichert und kann über
    GET /analysen jederzeit wieder geladen werden."""
    participant = _require_paid_participant(mediation_id, current_user, db)
    if participant.role not in ("mediator", "owner", "admin"):
        raise HTTPException(status_code=403, detail="Nur für Mediatoren")

    if payload.phase not in PHASE_LABELS_ANALYSE:
        raise HTTPException(status_code=422, detail="Unbekannte Phase")

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation nicht gefunden")

    inputs_text = _collect_inputs_text(db, mediation_id, phase=payload.phase)
    if not inputs_text.strip():
        return {
            "phase": payload.phase,
            "summary": None,
            "prompt": None,
            "message": "In dieser Phase liegen noch keine Eingaben vor.",
        }

    phase_label = PHASE_LABELS_ANALYSE[payload.phase]
    type_label = TYPE_LABELS_ANALYSE.get(
        mediation.mediation_type or "", mediation.mediation_type or ""
    )
    prompt = get_prompt(
        "phase_analyse",
        title=mediation.title or "Neue Mediation",
        type_label=type_label,
        phase_label=phase_label,
        inputs_text=inputs_text,
    )

    summary = ai_complete(prompt, max_tokens=900)

    saved_at = datetime.now(timezone.utc).isoformat()
    _save_ai_output(
        db,
        mediation_id,
        phase=payload.phase,
        step_key="__ki__",
        block_id=f"phasen-analyse:{payload.phase}",
        block_type="ki-phasen-analyse",
        value={"summary": summary, "prompt": prompt, "saved_at": saved_at},
    )
    return {
        "phase": payload.phase,
        "summary": summary,
        "prompt": prompt,
        "saved_at": saved_at,
    }


@router.post("/{mediation_id}/analyse-swot")
def analyse_swot(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """SWOT-Analyse zur Fall-Finalisierung & Ziel über ALLE Eingaben
    (Parteien + Mediator, alle Phasen). Gibt den gesendeten Prompt mit zurück
    und speichert das Ergebnis dauerhaft."""
    import json as _json

    participant = _require_paid_participant(mediation_id, current_user, db)
    if participant.role not in ("mediator", "owner", "admin"):
        raise HTTPException(status_code=403, detail="Nur für Mediatoren")

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation nicht gefunden")

    participants_with_users = (
        db.query(MediationParticipant, User)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .all()
    )
    participants_list = "\n".join(
        f"- {u.name} ({p.role})" for p, u in participants_with_users
    )

    inputs_text = _collect_inputs_text(db, mediation_id)
    type_label = TYPE_LABELS_ANALYSE.get(
        mediation.mediation_type or "", mediation.mediation_type or ""
    )
    current_phase = PHASE_LABELS_ANALYSE.get(
        mediation.phase or "", mediation.phase or "Unbekannt"
    )

    prompt = get_prompt(
        "swot_ziel",
        title=mediation.title or "Neue Mediation",
        type_label=type_label,
        current_phase=current_phase,
        description=mediation.description or "Keine Beschreibung",
        participants_list=participants_list or "- Keine Angaben",
        inputs_text=inputs_text if inputs_text.strip() else "Noch keine Eingaben vorhanden.",
    )

    raw = ai_complete(prompt, max_tokens=1500)
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        result = _json.loads(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="KI-Antwort konnte nicht verarbeitet werden")

    saved_at = datetime.now(timezone.utc).isoformat()
    stored = dict(result)
    stored["prompt"] = prompt
    stored["saved_at"] = saved_at
    _save_ai_output(
        db,
        mediation_id,
        phase=mediation.phase or "einleitung",
        step_key="__ki__",
        block_id="swot-finalisierung",
        block_type="ki-swot-ziel",
        value=stored,
    )

    result["prompt"] = prompt
    result["saved_at"] = saved_at
    return result


@router.get("/{mediation_id}/analysen")
def get_saved_analyses(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Lädt alle gespeicherten Fall-Analysen (Phasen-Zusammenfassungen + SWOT),
    inkl. des jeweils an die KI gesendeten Prompts."""
    participant = _require_paid_participant(mediation_id, current_user, db)
    if participant.role not in ("mediator", "owner", "admin"):
        raise HTTPException(status_code=403, detail="Nur für Mediatoren")

    rows = (
        db.query(MediationBlockResponse)
        .filter(
            MediationBlockResponse.mediation_id == mediation_id,
            MediationBlockResponse.author_key == "ai",
            MediationBlockResponse.block_type.in_(
                ["ki-phasen-analyse", "ki-swot-ziel"]
            ),
        )
        .all()
    )

    phasen: dict[str, dict] = {}
    swot = None
    for r in rows:
        value = r.value if isinstance(r.value, dict) else {}
        updated = r.updated_at.isoformat() if r.updated_at else None
        if r.block_type == "ki-phasen-analyse":
            phase_key = r.block_id.split(":", 1)[1] if ":" in r.block_id else r.phase
            phasen[phase_key] = {
                "summary": value.get("summary"),
                "prompt": value.get("prompt"),
                "saved_at": value.get("saved_at") or updated,
            }
        elif r.block_type == "ki-swot-ziel":
            swot = dict(value)
            swot.setdefault("saved_at", updated)

    return {"phasen": phasen, "swot": swot}


# ── Varianten-Zuordnung (Fall <-> MediationVariant) ─────────────────────────

class VariantAssignRequest(BaseModel):
    # key einer MediationVariant des passenden mediation_type — oder None,
    # um die Zuordnung zu entfernen (Fall läuft wieder als Basis-Workflow).
    variant_key: Optional[str] = None


@router.put("/{mediation_id}/variant")
def set_mediation_variant(
    mediation_id: int,
    payload: VariantAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """
    Ordnet einem Fall eine Mediations-Variante zu (oder entfernt sie).

    Nur Mediatoren/Admins. Jederzeit änderbar — auch bei laufender Mediation:
    bereits erledigte Schritte (MediationNote) bleiben erhalten, die
    Schrittliste wird ab sofort mit den Schritten der neuen Variante
    aufgelöst (siehe get_phase_steps). Per-Fall-Anpassungen über
    MediationCustomStep/MediationStepRule sind davon unabhängig.
    """
    if current_user.role not in ("mediator", "admin"):
        raise HTTPException(status_code=403, detail="Nur für Mediatoren und Admins")

    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    if payload.variant_key is not None:
        variant = (
            db.query(MediationVariant)
            .filter(
                MediationVariant.mediation_type == mediation.mediation_type,
                MediationVariant.key == payload.variant_key,
                MediationVariant.enabled.is_(True),
            )
            .first()
        )
        if not variant:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Variante '{payload.variant_key}' existiert nicht (oder ist "
                    f"deaktiviert) für Mediationstyp '{mediation.mediation_type}'"
                ),
            )

    mediation.variant_key = payload.variant_key
    db.commit()
    db.refresh(mediation)

    return {
        "mediation_id": mediation.id,
        "mediation_type": mediation.mediation_type,
        "variant_key": mediation.variant_key,
    }
