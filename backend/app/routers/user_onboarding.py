"""
API des Nutzer-Onboardings: der einmalige Durchlauf, den jede Person absolviert,
bevor sie Faelle bearbeiten kann.

Abgrenzung zu den Fall-Endpunkten:
  - Die VORLAGE (welche Schritte, welche Bloecke) liegt in phase_step_defaults
    unter dem Pseudo-Typ "@user" und wird im Workflow Manager gepflegt — dieser
    Router liest sie nur, er verwaltet sie nicht (das macht
    routers/phase_step_defaults.py, unveraendert).
  - Die ANTWORTEN liegen in user_onboarding_responses, pro Person genau eine je
    Block. Es gibt hier bewusst keinen author_key wie bei den Fall-Antworten:
    im Onboarding ist immer nur eine Person beteiligt.

Die Einsicht auf fremde Onboardings (GET /onboarding/users/{id}) ist bewusst
eng gefasst: Admins sehen alle, Mediatoren nur Personen, die in einem ihrer
eigenen Faelle Teilnehmer sind.
"""
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.models.user_onboarding_response import UserOnboardingResponse
from app.security import get_current_db_user
from app.services import onboarding, tenancy

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


# ── Eigenes Onboarding ──────────────────────────────────────────────────────


@router.get("/steps")
def list_my_steps(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Schritte + eigene Antworten + Wiedereinstiegspunkt in einem Aufruf.

    Bewusst ein einziger Endpoint: die Seite braucht immer alle drei Teile, und
    drei getrennte Requests waren beim Fall-Flow schon die Ursache fuer
    flackernde Zwischenzustaende.
    """
    steps = onboarding.get_steps(db)
    # effective_values statt responses_by_block: Profil-Bloecke werden aus den
    # users-Spalten vorbefuellt. Bestandsnutzer sehen ihren Namen und ihre
    # Rechnungsanschrift damit schon ausgefuellt, statt sie neu einzutippen.
    values = onboarding.effective_values(db, user)
    missing = onboarding.missing_required(db, user)
    resume = missing[0]["step_key"] if missing else None
    return {
        "steps": [onboarding.serialize_step(s) for s in steps],
        "values": values,
        "completed": onboarding.is_complete(user),
        "completed_at": (
            user.onboarding_completed_at.isoformat()
            if user.onboarding_completed_at
            else None
        ),
        # step_key, bei dem der Flow aufsetzen soll. NULL = alles beantwortet.
        "resume_step_key": resume,
        "missing": missing,
        # Profilwerte separat, damit die Bloecke stammdaten/rechnungsdaten auch
        # dann vorbefuellt sind, wenn sie erst spaeter in die Vorlage kamen und
        # die users-Spalten schon anderweitig gefuellt wurden.
        "profile": _profile(user),
    }


@router.get("/status")
def my_status(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Schlanke Variante fuer Header/Middleware — ohne Bloecke und Antworten."""
    missing = onboarding.missing_required(db, user)
    return {
        "completed": onboarding.is_complete(user),
        "open_count": len(missing),
        "resume_step_key": missing[0]["step_key"] if missing else None,
    }


class SaveResponseRequest(BaseModel):
    step_key: str
    block_id: str
    block_type: Optional[str] = None
    value: Any = None


@router.put("/responses")
def save_response(
    payload: SaveResponseRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Legt die Antwort auf einen Block an oder aktualisiert sie.

    Kein Abgleich gegen die Vorlage: Bloecke koennen im Workflow Manager
    jederzeit umgebaut werden, und eine Antwort auf einen inzwischen entfernten
    Block soll das Speichern der uebrigen nicht blockieren. Verwaiste Antworten
    stoeren nicht — missing_required liest ausschliesslich die aktuelle Vorlage.
    """
    row = (
        db.query(UserOnboardingResponse)
        .filter(
            UserOnboardingResponse.user_id == user.id,
            UserOnboardingResponse.step_key == payload.step_key,
            UserOnboardingResponse.block_id == payload.block_id,
        )
        .first()
    )
    if row is None:
        row = UserOnboardingResponse(
            user_id=user.id,
            step_key=payload.step_key,
            block_id=payload.block_id,
        )
        db.add(row)

    row.block_type = payload.block_type or row.block_type
    row.value = payload.value

    # stammdaten/rechnungsdaten zusaetzlich ins Profil spiegeln, damit
    # Rechnungen und die Vorbefuellung neuer Faelle sie lesen koennen, ohne die
    # Blockliste des Onboardings zu kennen.
    if payload.block_type:
        onboarding.mirror_to_profile(user, payload.block_type, payload.value)
        db.add(user)

    db.commit()
    return {"ok": True}


@router.post("/complete")
def complete(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Schliesst das Onboarding ab — nur wenn kein Pflichtfeld mehr offen ist.

    Diese Pruefung ist die eigentliche Sperre. Die Middleware im Frontend leitet
    nur um; wer die API direkt anspricht, kaeme sonst ohne Stammdaten durch.
    """
    missing = onboarding.missing_required(db, user)
    if missing:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Es fehlen noch Pflichtangaben.",
                "missing": missing,
                "resume_step_key": missing[0]["step_key"],
            },
        )
    if not onboarding.is_complete(user):
        onboarding.mark_complete(db, user)
        db.commit()
    return {"ok": True, "completed": True}


# ── Einsicht auf fremde Onboardings (Admin + Mediator) ───────────────────────


def _profile(user: User) -> dict:
    return {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "street": user.billing_street,
        "postal_code": user.billing_postal_code,
        "city": user.billing_city,
    }


def _shares_case_with(db: Session, mediator: User, target_user_id: int) -> bool:
    """Ist die Zielperson Teilnehmer in einem Fall, in dem dieser Mediator
    selbst als Teilnehmer eingetragen ist?

    Die Mediator-Zuordnung laeuft ueber MediationParticipant mit role
    "mediator" — es gibt keine Spalte mediations.mediator_id. Deshalb hier die
    Schnittmenge ueber die Teilnahmen, nicht ueber ein Feld am Fall.
    """
    case_ids = {
        row[0]
        for row in db.query(MediationParticipant.mediation_id)
        .filter(MediationParticipant.user_id == mediator.id)
        .all()
    }
    if not case_ids:
        return False
    return (
        db.query(MediationParticipant.id)
        .filter(
            MediationParticipant.user_id == target_user_id,
            MediationParticipant.mediation_id.in_(case_ids),
        )
        .first()
        is not None
    )


@router.get("/users/{user_id}")
def get_user_onboarding(
    user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Onboarding-Stand und Antworten einer Person.

    Sichtbar fuer:
      - globale Admins: jede Person
      - firm_admin: Personen des eigenen Mandanten
      - Mediatoren: nur Personen aus ihren eigenen Faellen
      - jede Person selbst
    """
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")

    role = tenancy.role_of(user)
    allowed = user.id == target.id or role == "admin"
    if not allowed and role == tenancy.FIRM_ADMIN_ROLE:
        allowed = (
            getattr(user, "organization_id", None) is not None
            and target.organization_id == user.organization_id
        )
    if not allowed and role == "mediator":
        allowed = _shares_case_with(db, user, target.id)
    if not allowed:
        raise HTTPException(status_code=403, detail="Kein Zugriff auf dieses Onboarding")

    steps = onboarding.get_steps(db)
    values = onboarding.effective_values(db, target)
    missing = onboarding.missing_required(db, target)
    return {
        "user_id": target.id,
        "name": target.name,
        "email": target.email,
        "completed": onboarding.is_complete(target),
        "completed_at": (
            target.onboarding_completed_at.isoformat()
            if target.onboarding_completed_at
            else None
        ),
        "open_count": len(missing),
        "profile": _profile(target),
        # Antworten mitliefern, damit die Ansicht nicht raten muss, was zu
        # welchem Block gehoert — die Vorlage kann sich geaendert haben.
        "steps": [onboarding.serialize_step(s) for s in steps],
        "values": values,
    }
