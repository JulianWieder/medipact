"""Mandanten-Verwaltung (Organizations).

Ein Mandant (z.B. Kanzlei/Praxis) kann mehrere Mediatoren haben. Das Abo hängt
am Mandanten: Der Monatspreis richtet sich nach Plan + Anzahl Mediatoren
(siehe app/pricing.py, Abschnitt "Mandanten-Abos").

Berechtigungen:
  • Anlegen/Ändern/Löschen von Mandanten + Mitglieder zuordnen: nur Admins
    (role == "admin"), analog zum Benutzermanager in routers/auth.py.
  • Lesen: Admins sehen alle Mandanten; Mediatoren sehen ihren eigenen.
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from app import pricing
from app.database import get_db
from app.models.organization import Organization
from app.models.user import User
from app.security import get_current_db_user

router = APIRouter(prefix="/organizations", tags=["organizations"])


def _require_admin(user: User) -> None:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Nur für Administratoren")


def _mediator_count(db: Session, org_id: int) -> int:
    return (
        db.query(User)
        .filter(User.organization_id == org_id, User.role == "mediator")
        .count()
    )


def _serialize(db: Session, org: Organization) -> dict:
    count = _mediator_count(db, org.id)
    return {
        "id": org.id,
        "name": org.name,
        "plan": org.plan,
        "plan_label": pricing.ABO_PLAN_LABELS.get(org.plan, org.plan),
        "mediator_count": count,
        "monthly_price_eur": pricing.organization_monthly_price(org.plan, count),
        "created_at": org.created_at.isoformat() if org.created_at else None,
    }


class OrganizationCreate(BaseModel):
    name: str
    plan: str = pricing.DEFAULT_ABO_PLAN

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name darf nicht leer sein.")
        return v

    @field_validator("plan")
    @classmethod
    def plan_valid(cls, v: str) -> str:
        return pricing.normalize_abo_plan(v)


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None


class MemberRequest(BaseModel):
    user_id: int


@router.get("/plans")
def list_plans(user: User = Depends(get_current_db_user)):
    """Alle Abo-Pläne inkl. Konditionen (für Auswahl-UIs)."""
    return pricing.abo_plan_options()


@router.get("")
def list_organizations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Admins: alle Mandanten. Mediatoren: nur der eigene Mandant."""
    if user.role == "admin":
        orgs = db.query(Organization).order_by(Organization.name).all()
    elif user.organization_id:
        orgs = db.query(Organization).filter(Organization.id == user.organization_id).all()
    else:
        orgs = []
    return [_serialize(db, o) for o in orgs]


@router.post("", status_code=201)
def create_organization(
    payload: OrganizationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)
    if db.query(Organization).filter(Organization.name == payload.name).first():
        raise HTTPException(status_code=409, detail="Ein Mandant mit diesem Namen existiert bereits.")
    org = Organization(name=payload.name, plan=payload.plan)
    db.add(org)
    db.commit()
    db.refresh(org)
    return _serialize(db, org)


@router.get("/{org_id}")
def get_organization(
    org_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Mandant nicht gefunden")
    if user.role != "admin" and user.organization_id != org.id:
        raise HTTPException(status_code=403, detail="Kein Zugriff auf diesen Mandanten")
    data = _serialize(db, org)
    data["members"] = [
        {"id": m.id, "name": m.name, "email": m.email, "role": m.role}
        for m in (
            db.query(User)
            .filter(User.organization_id == org.id)
            .order_by(User.name)
            .all()
        )
    ]
    return data


@router.patch("/{org_id}")
def update_organization(
    org_id: int,
    payload: OrganizationUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Mandant nicht gefunden")

    if payload.name is not None:
        name = payload.name.strip()
        if not name:
            raise HTTPException(status_code=400, detail="Name darf nicht leer sein.")
        clash = (
            db.query(Organization)
            .filter(Organization.name == name, Organization.id != org.id)
            .first()
        )
        if clash:
            raise HTTPException(status_code=409, detail="Ein Mandant mit diesem Namen existiert bereits.")
        org.name = name

    if payload.plan is not None:
        plan = pricing.normalize_abo_plan(payload.plan)
        count = _mediator_count(db, org.id)
        if not pricing.abo_plan_allows(plan, count):
            raise HTTPException(
                status_code=400,
                detail=f"Plan „{pricing.ABO_PLAN_LABELS[plan]}“ erlaubt die aktuelle "
                f"Mediatoren-Anzahl ({count}) nicht.",
            )
        org.plan = plan

    db.commit()
    return _serialize(db, org)


@router.delete("/{org_id}")
def delete_organization(
    org_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Mandant nicht gefunden")
    # Mitglieder lösen, statt sie zu löschen.
    db.query(User).filter(User.organization_id == org.id).update({"organization_id": None})
    db.delete(org)
    db.commit()
    return {"ok": True}


@router.post("/{org_id}/members")
def add_member(
    org_id: int,
    payload: MemberRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Ordnet einen Nutzer (typisch: Mediator) dem Mandanten zu. Nur Admins."""
    _require_admin(user)
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Mandant nicht gefunden")
    target = db.query(User).filter(User.id == payload.user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")

    if target.role == "mediator":
        new_count = _mediator_count(db, org.id) + (0 if target.organization_id == org.id else 1)
        if not pricing.abo_plan_allows(org.plan, new_count):
            raise HTTPException(
                status_code=400,
                detail=f"Plan „{pricing.ABO_PLAN_LABELS.get(org.plan, org.plan)}“ erlaubt "
                f"maximal {pricing.ABO_PRICING[pricing.normalize_abo_plan(org.plan)]['max_mediators']} Mediatoren. "
                "Bitte Plan upgraden.",
            )

    target.organization_id = org.id
    db.commit()
    return _serialize(db, org)


@router.delete("/{org_id}/members/{user_id}")
def remove_member(
    org_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)
    target = (
        db.query(User)
        .filter(User.id == user_id, User.organization_id == org_id)
        .first()
    )
    if not target:
        raise HTTPException(status_code=404, detail="Nutzer ist diesem Mandanten nicht zugeordnet")
    target.organization_id = None
    db.commit()
    org = db.query(Organization).filter(Organization.id == org_id).first()
    return _serialize(db, org) if org else {"ok": True}
