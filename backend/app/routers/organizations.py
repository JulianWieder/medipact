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

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from app import pricing
from app.database import get_db
from app.models.organization import Organization
from app.models.user import User
from app.security import get_current_db_user
from app.services import tenancy
from app.paypal import PayPalError, capture_order, create_order

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
        "is_active": bool(getattr(org, "is_active", True)),
        "billing_email": getattr(org, "billing_email", None),
        "contract_signed_at": org.contract_signed_at.isoformat() if getattr(org, "contract_signed_at", None) else None,
        "contract_signer_name": getattr(org, "contract_signer_name", None),
        "onboarding_payment_method": getattr(org, "onboarding_payment_method", None),
        "onboarding_paid_at": org.onboarding_paid_at.isoformat() if getattr(org, "onboarding_paid_at", None) else None,
        "onboarding_completed_at": org.onboarding_completed_at.isoformat() if getattr(org, "onboarding_completed_at", None) else None,
        "onboarding_complete": bool(getattr(org, "onboarding_completed_at", None)),
        "base_config_accepted": bool(getattr(org, "base_config_accepted_at", None)),
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
    is_active: Optional[bool] = None
    billing_email: Optional[str] = None


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
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Unternehmen nicht gefunden")
    # Globaler Admin: jedes Unternehmen. Firmen-Admin: nur das eigene.
    if not tenancy.can_manage_org(user, org.id):
        raise HTTPException(status_code=403, detail="Kein Zugriff auf dieses Unternehmen")

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
            raise HTTPException(status_code=409, detail="Ein Unternehmen mit diesem Namen existiert bereits.")
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

    if payload.is_active is not None:
        if not tenancy.is_global_admin(user):
            raise HTTPException(status_code=403, detail="Nur Administratoren können das Abo aktivieren/deaktivieren.")
        org.is_active = payload.is_active

    if payload.billing_email is not None:
        org.billing_email = payload.billing_email.strip() or None

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


# ── Onboarding-Finalisierung (unternehmensweit, einmalig) ────────────────────
#
# Servicevertrag per Kurz-Unterschrift + Zahlung (Rechnung/Abo oder PayPal).
# Nur Firmen-Admin der eigenen Org bzw. globaler Admin. Zahlbetrag = Monatspreis
# des gewählten Plans (erste Rate); reine Preislogik in app/pricing.py.


class SignContractRequest(BaseModel):
    signer_name: str

    @field_validator("signer_name")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Bitte den Namen für die Unterschrift eingeben.")
        return v.strip()


class OnboardingPayRequest(BaseModel):
    method: str  # "invoice" | "paypal"
    order_id: Optional[str] = None


def _onboarding_amount(db: Session, org: Organization) -> float:
    return pricing.organization_monthly_price(org.plan, _mediator_count(db, org.id))


def _load_manageable_org(org_id: int, db: Session, user: User) -> Organization:
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Unternehmen nicht gefunden")
    if not tenancy.can_manage_org(user, org.id):
        raise HTTPException(status_code=403, detail="Kein Zugriff auf dieses Unternehmen")
    return org


def _maybe_complete(org: Organization) -> None:
    if org.contract_signed_at and org.onboarding_paid_at and not org.onboarding_completed_at:
        org.onboarding_completed_at = datetime.now(timezone.utc)


@router.get("/{org_id}/onboarding")
def get_onboarding(org_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_db_user)):
    org = _load_manageable_org(org_id, db, user)
    return {
        "organization_id": org.id,
        "plan": org.plan,
        "plan_label": pricing.ABO_PLAN_LABELS.get(org.plan, org.plan),
        "amount_eur": _onboarding_amount(db, org),
        "currency": "EUR",
        "contract_signed": bool(org.contract_signed_at),
        "contract_signer_name": org.contract_signer_name,
        "paid": bool(org.onboarding_paid_at),
        "payment_method": org.onboarding_payment_method,
        "complete": bool(org.onboarding_completed_at),
    }


@router.post("/{org_id}/onboarding/sign")
def sign_contract(org_id: int, payload: SignContractRequest, db: Session = Depends(get_db), user: User = Depends(get_current_db_user)):
    org = _load_manageable_org(org_id, db, user)
    org.contract_signed_at = datetime.now(timezone.utc)
    org.contract_signer_name = payload.signer_name
    _maybe_complete(org)
    db.commit()
    return _serialize(db, org)


@router.post("/{org_id}/onboarding/paypal/create-order")
async def create_onboarding_order(org_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_db_user)):
    org = _load_manageable_org(org_id, db, user)
    amount = _onboarding_amount(db, org)
    try:
        order = await create_order(amount, org.id)
    except PayPalError as e:
        raise HTTPException(status_code=502, detail=str(e))
    return {"order_id": order.get("id"), "amount_eur": amount, "currency": "EUR"}


@router.post("/{org_id}/onboarding/pay")
async def pay_onboarding(org_id: int, payload: OnboardingPayRequest, db: Session = Depends(get_db), user: User = Depends(get_current_db_user)):
    org = _load_manageable_org(org_id, db, user)
    method = (payload.method or "").lower()
    if method == "paypal":
        if not payload.order_id:
            raise HTTPException(status_code=400, detail="order_id fehlt.")
        try:
            result = await capture_order(payload.order_id)
        except PayPalError as e:
            raise HTTPException(status_code=502, detail=str(e))
        if result.get("status") != "COMPLETED":
            raise HTTPException(status_code=400, detail="Zahlung nicht abgeschlossen")
        org.onboarding_paypal_order_id = payload.order_id
        org.onboarding_payment_method = "paypal"
    elif method == "invoice":
        org.onboarding_payment_method = "invoice"
    else:
        raise HTTPException(status_code=400, detail="Ungültige Zahlungsart (invoice|paypal).")
    org.onboarding_paid_at = datetime.now(timezone.utc)
    _maybe_complete(org)
    db.commit()
    return _serialize(db, org)


# ── Grundkonfiguration (Abo-Modell): einmal pro Unternehmen ──────────────────
#
# Die INHALTE (Blöcke) kommen aus dem WorkflowManager-Schritt
# mediation_type="organisation", phase="einladung", step_key="abo_grundkonfiguration"
# (Seed p9f0a1b2c3d4) und sind dort im Designer editierbar. Hier werden nur die
# ANTWORTEN des Unternehmens (base_config) und die Akzeptanz gespeichert.
# Erst nach Akzeptanz können Abo-Fälle angelegt werden (Gate in
# routers/mediations.create_mediation). Einzel-B2C-Fälle bleiben unberührt.

def _base_config_blocks(db: Session) -> list:
    from app.models.phase_step_default import PhaseStepDefault

    step = (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == "organisation",
            PhaseStepDefault.phase == "einladung",
            PhaseStepDefault.step_key == "abo_grundkonfiguration",
            PhaseStepDefault.enabled.is_(True),
        )
        .first()
    )
    return (step.blocks or []) if step else []


def _load_member_org(org_id: int, db: Session, user: User) -> Organization:
    """Lesezugriff: Mitglieder des Unternehmens (alle Rollen) + globale Admins.

    Beteiligte in Abo-Fällen sehen die Grundkonfiguration im Fall-Start
    (read-only) – dafür reicht die Org-Zugehörigkeit."""
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Unternehmen nicht gefunden")
    if (user.role or "").lower() != "admin" and user.organization_id != org.id:
        raise HTTPException(status_code=403, detail="Kein Zugriff auf dieses Unternehmen")
    return org


class BaseConfigUpdate(BaseModel):
    # Antworten (Block-id -> Wert); werden mit dem Bestand gemerged.
    values: dict


class BaseConfigAccept(BaseModel):
    accepted_by: Optional[str] = None


def _base_config_payload(db: Session, org: Organization) -> dict:
    return {
        "organization_id": org.id,
        "blocks": _base_config_blocks(db),
        "values": org.base_config or {},
        "accepted": bool(org.base_config_accepted_at),
        "accepted_at": org.base_config_accepted_at.isoformat() if org.base_config_accepted_at else None,
        "accepted_by": org.base_config_accepted_by,
    }


@router.get("/{org_id}/base-config")
def get_base_config(org_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_db_user)):
    org = _load_member_org(org_id, db, user)
    return _base_config_payload(db, org)


@router.put("/{org_id}/base-config")
def update_base_config(org_id: int, payload: BaseConfigUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_db_user)):
    org = _load_manageable_org(org_id, db, user)
    merged = dict(org.base_config or {})
    for k, v in (payload.values or {}).items():
        if v is None:
            merged.pop(k, None)
        else:
            merged[k] = v
    org.base_config = merged
    db.commit()
    return _base_config_payload(db, org)


@router.post("/{org_id}/base-config/accept")
def accept_base_config(org_id: int, payload: BaseConfigAccept, db: Session = Depends(get_db), user: User = Depends(get_current_db_user)):
    org = _load_manageable_org(org_id, db, user)
    if not (org.base_config or {}):
        raise HTTPException(status_code=422, detail="Bitte zuerst die Grundkonfiguration ausfüllen.")
    org.base_config_accepted_at = datetime.now(timezone.utc)
    org.base_config_accepted_by = (payload.accepted_by or user.name or user.email or "").strip() or None
    db.commit()
    return _base_config_payload(db, org)
