"""Admin-Verwaltung für Rabattcodes (nur Mediator/Admin).

Die Anwendung/Einlösung der Codes durch Teilnehmer läuft über
routers/mediations.py (/{id}/discount + Bezahl-Endpunkte). Hier geht es nur
ums Anlegen, Auflisten, Ändern und Löschen der Codes.
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.discount_code import DiscountCode
from app.models.user import User
from app.security import get_current_db_user

router = APIRouter(prefix="/discount-codes", tags=["discount-codes"])

_ADMIN_ROLES = {"mediator", "admin"}
_KINDS = {"percent", "fixed", "full"}
_SCOPES = {"participant", "case"}


def _require_admin(user: User) -> None:
    if user.role not in _ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Nur Mediatoren/Admins dürfen Rabattcodes verwalten.")


class DiscountCodeCreate(BaseModel):
    code: str
    kind: str = "percent"           # percent | fixed | full
    value: float = 0.0              # percent: 0..100, fixed: EUR, full: ignoriert
    scope: str = "participant"      # participant | case
    active: bool = True
    max_uses: Optional[int] = None
    valid_until: Optional[datetime] = None
    restrict_type: Optional[str] = None
    restrict_package: Optional[str] = None
    description: Optional[str] = None


class DiscountCodeUpdate(BaseModel):
    kind: Optional[str] = None
    value: Optional[float] = None
    scope: Optional[str] = None
    active: Optional[bool] = None
    max_uses: Optional[int] = None
    valid_until: Optional[datetime] = None
    restrict_type: Optional[str] = None
    restrict_package: Optional[str] = None
    description: Optional[str] = None


def _serialize(code: DiscountCode) -> dict:
    return {
        "id": code.id,
        "code": code.code,
        "kind": code.kind,
        "value": code.value,
        "scope": code.scope,
        "active": code.active,
        "max_uses": code.max_uses,
        "used_count": code.used_count,
        "valid_until": code.valid_until.isoformat() if code.valid_until else None,
        "restrict_type": code.restrict_type,
        "restrict_package": code.restrict_package,
        "description": code.description,
    }


def _validate_kind_scope(kind: str, scope: str) -> None:
    if kind not in _KINDS:
        raise HTTPException(status_code=400, detail=f"Ungültiger Typ. Erlaubt: {', '.join(sorted(_KINDS))}.")
    if scope not in _SCOPES:
        raise HTTPException(status_code=400, detail=f"Ungültige Geltung. Erlaubt: {', '.join(sorted(_SCOPES))}.")


@router.get("")
def list_codes(db: Session = Depends(get_db), user: User = Depends(get_current_db_user)):
    _require_admin(user)
    codes = db.query(DiscountCode).order_by(DiscountCode.created_at.desc()).all()
    return [_serialize(c) for c in codes]


@router.post("")
def create_code(
    payload: DiscountCodeCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)
    code_str = payload.code.strip()
    if not code_str:
        raise HTTPException(status_code=400, detail="Code darf nicht leer sein.")
    _validate_kind_scope(payload.kind, payload.scope)

    existing = (
        db.query(DiscountCode)
        .filter(func.lower(DiscountCode.code) == code_str.lower())
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Dieser Code existiert bereits.")

    code = DiscountCode(
        code=code_str,
        kind=payload.kind,
        value=payload.value,
        scope=payload.scope,
        active=payload.active,
        max_uses=payload.max_uses,
        valid_until=payload.valid_until,
        restrict_type=payload.restrict_type,
        restrict_package=payload.restrict_package,
        description=payload.description,
    )
    db.add(code)
    db.commit()
    db.refresh(code)
    return _serialize(code)


@router.patch("/{code_id}")
def update_code(
    code_id: int,
    payload: DiscountCodeUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)
    code = db.query(DiscountCode).filter(DiscountCode.id == code_id).first()
    if not code:
        raise HTTPException(status_code=404, detail="Code nicht gefunden.")

    data = payload.model_dump(exclude_none=True)
    kind = data.get("kind", code.kind)
    scope = data.get("scope", code.scope)
    _validate_kind_scope(kind, scope)

    for key, value in data.items():
        setattr(code, key, value)
    db.commit()
    db.refresh(code)
    return _serialize(code)


@router.delete("/{code_id}")
def delete_code(
    code_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    _require_admin(user)
    code = db.query(DiscountCode).filter(DiscountCode.id == code_id).first()
    if not code:
        raise HTTPException(status_code=404, detail="Code nicht gefunden.")
    db.delete(code)
    db.commit()
    return {"ok": True}
