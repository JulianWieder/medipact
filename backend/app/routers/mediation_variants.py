"""
API-Endpoints zur Verwaltung von Mediations-Varianten (mediation_variants).

Eine Variante ist eine frei benennbare Ausprägung eines Mediationstyps
(z.B. "Trennung mit Kindern" als Variante von "trennung"), die im Workflow
Designer zusätzliche/abweichende Schritte bekommen kann (siehe
phase_step_defaults.py: variant_key). Nur für Plattform-Admins/Mediatoren –
analog zu phase_step_defaults.py.
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation_variant import MediationVariant
from app.models.phase_step_default import PhaseStepDefault
from app.models.user import User
from app.security import get_current_db_user

router = APIRouter(prefix="/admin/mediation-variants", tags=["mediation_variants"])

# Konsistent mit is_admin in routers/auth.py (GET /me/role)
_ADMIN_ROLES = {"mediator", "admin"}


def _require_admin(user: User) -> None:
    if user.role not in _ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Nur Admins können Varianten verwalten")


def _slugify(label: str) -> str:
    import re
    import unicodedata

    normalized = unicodedata.normalize("NFKD", label).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "_", normalized.lower()).strip("_")
    return slug or "variante"


def _serialize(variant: MediationVariant) -> dict:
    return {
        "id": variant.id,
        "mediation_type": variant.mediation_type,
        "key": variant.key,
        "label": variant.label,
        "description": variant.description,
        "position": variant.position,
        "enabled": variant.enabled,
    }


class MediationVariantCreate(BaseModel):
    mediation_type: str
    label: str
    key: Optional[str] = None
    description: str = ""
    enabled: bool = True


class MediationVariantUpdate(BaseModel):
    label: Optional[str] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    position: Optional[int] = None


@router.get("")
def list_mediation_variants(
    mediation_type: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Alle Varianten für einen Mediationstyp, sortiert nach Reihenfolge."""
    _require_admin(user)
    variants = (
        db.query(MediationVariant)
        .filter(MediationVariant.mediation_type == mediation_type)
        .order_by(MediationVariant.position, MediationVariant.id)
        .all()
    )
    return [_serialize(v) for v in variants]


@router.post("")
def create_mediation_variant(
    payload: MediationVariantCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)

    label = payload.label.strip()
    if not label:
        raise HTTPException(status_code=422, detail="Bezeichnung darf nicht leer sein")

    key = (payload.key or "").strip() or _slugify(label)

    existing = (
        db.query(MediationVariant)
        .filter(
            MediationVariant.mediation_type == payload.mediation_type,
            MediationVariant.key == key,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409, detail="Diese Variante existiert bereits für diesen Mediationstyp"
        )

    count = (
        db.query(MediationVariant)
        .filter(MediationVariant.mediation_type == payload.mediation_type)
        .count()
    )

    variant = MediationVariant(
        mediation_type=payload.mediation_type,
        key=key,
        label=label,
        description=payload.description,
        position=count,
        enabled=payload.enabled,
    )
    db.add(variant)
    db.commit()
    db.refresh(variant)
    return _serialize(variant)


@router.patch("/{variant_id}")
def update_mediation_variant(
    variant_id: int,
    payload: MediationVariantUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)

    variant = db.query(MediationVariant).filter(MediationVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variante nicht gefunden")

    update_data = payload.model_dump(exclude_unset=True)
    if "label" in update_data and not (update_data["label"] or "").strip():
        raise HTTPException(status_code=422, detail="Bezeichnung darf nicht leer sein")
    for key, value in update_data.items():
        setattr(variant, key, value)

    db.commit()
    db.refresh(variant)
    return _serialize(variant)


@router.delete("/{variant_id}")
def delete_mediation_variant(
    variant_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)

    variant = db.query(MediationVariant).filter(MediationVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variante nicht gefunden")

    # Zugehörige variantenspezifische Schritte mit entfernen, damit keine
    # verwaisten phase_step_defaults-Einträge zurückbleiben.
    db.query(PhaseStepDefault).filter(
        PhaseStepDefault.mediation_type == variant.mediation_type,
        PhaseStepDefault.variant_key == variant.key,
    ).delete(synchronize_session=False)

    db.delete(variant)
    db.commit()
    return {"status": "deleted"}
