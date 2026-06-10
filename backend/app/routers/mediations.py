from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_invite import MediationInvite
from app.models.mediation_note import MediationNote
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
