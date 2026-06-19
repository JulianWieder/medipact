"""
API-Endpoints zur Verwaltung der Standard-Schritte pro Mediationstyp und
Phase (phase_step_defaults). Nur für Plattform-Admins/Mediatoren – das ist
die globale Konfiguration, nicht der Pro-Fall-Override (siehe
mediations.py: workflow-rules, custom_steps.py: custom-steps).
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.phase_step_default import PhaseStepDefault
from app.models.user import User
from app.security import get_current_db_user

router = APIRouter(prefix="/admin/phase-step-defaults", tags=["phase_step_defaults"])

# Konsistent mit is_admin in routers/auth.py (GET /me/role)
_ADMIN_ROLES = {"mediator", "admin"}


def _require_admin(user: User) -> None:
    if user.role not in _ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Nur Admins können Phasen-Schritte konfigurieren")


def _serialize(step: PhaseStepDefault) -> dict:
    return {
        "id": step.id,
        "mediation_type": step.mediation_type,
        "phase": step.phase,
        "step_key": step.step_key,
        "title": step.title,
        "description": step.description,
        "placeholder": step.placeholder,
        "reflection_mode": step.reflection_mode,
        "required_roles": step.required_roles.split(",") if step.required_roles else None,
        "position": step.position,
        "enabled": step.enabled,
    }


class PhaseStepDefaultCreate(BaseModel):
    mediation_type: str
    phase: str
    step_key: str
    title: str
    description: str = ""
    placeholder: str = ""
    reflection_mode: Optional[str] = None
    required_roles: Optional[list[str]] = None
    enabled: bool = True


class PhaseStepDefaultUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    placeholder: Optional[str] = None
    reflection_mode: Optional[str] = None
    required_roles: Optional[list[str]] = None
    enabled: Optional[bool] = None


class ReorderItem(BaseModel):
    id: int
    position: int


class ReorderRequest(BaseModel):
    items: list[ReorderItem]


@router.get("")
def list_phase_step_defaults(
    mediation_type: str,
    phase: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Alle Default-Schritte für (mediation_type, phase), sortiert nach Reihenfolge."""
    _require_admin(user)
    steps = (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == mediation_type,
            PhaseStepDefault.phase == phase,
        )
        .order_by(PhaseStepDefault.position, PhaseStepDefault.id)
        .all()
    )
    return [_serialize(s) for s in steps]


@router.post("")
def create_phase_step_default(
    payload: PhaseStepDefaultCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)

    existing = (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == payload.mediation_type,
            PhaseStepDefault.phase == payload.phase,
            PhaseStepDefault.step_key == payload.step_key,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Step-Key existiert bereits für diesen Mediationstyp/Phase")

    count = (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == payload.mediation_type,
            PhaseStepDefault.phase == payload.phase,
        )
        .count()
    )

    step = PhaseStepDefault(
        mediation_type=payload.mediation_type,
        phase=payload.phase,
        step_key=payload.step_key,
        title=payload.title,
        description=payload.description,
        placeholder=payload.placeholder,
        reflection_mode=payload.reflection_mode,
        required_roles=",".join(payload.required_roles) if payload.required_roles else None,
        position=count,
        enabled=payload.enabled,
    )
    db.add(step)
    db.commit()
    db.refresh(step)
    return _serialize(step)


@router.patch("/{step_id}")
def update_phase_step_default(
    step_id: int,
    payload: PhaseStepDefaultUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)

    step = db.query(PhaseStepDefault).filter(PhaseStepDefault.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step nicht gefunden")

    update_data = payload.model_dump(exclude_unset=True)
    if "required_roles" in update_data:
        roles = update_data.pop("required_roles")
        step.required_roles = ",".join(roles) if roles else None
    for key, value in update_data.items():
        setattr(step, key, value)

    db.commit()
    db.refresh(step)
    return _serialize(step)


@router.delete("/{step_id}")
def delete_phase_step_default(
    step_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)

    step = db.query(PhaseStepDefault).filter(PhaseStepDefault.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step nicht gefunden")

    db.delete(step)
    db.commit()
    return {"status": "deleted"}


@router.post("/reorder")
def reorder_phase_step_defaults(
    payload: ReorderRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Setzt die position für mehrere Steps in einem Batch (Drag & Drop im Admin-UI)."""
    _require_admin(user)

    ids = [item.id for item in payload.items]
    steps = {
        s.id: s
        for s in db.query(PhaseStepDefault).filter(PhaseStepDefault.id.in_(ids)).all()
    }
    if len(steps) != len(ids):
        raise HTTPException(status_code=404, detail="Mindestens ein Step wurde nicht gefunden")

    for item in payload.items:
        steps[item.id].position = item.position

    db.commit()
    return [_serialize(steps[item.id]) for item in payload.items]
