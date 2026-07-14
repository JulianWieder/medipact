"""Tenant-Isolation für das Firmenkunden-Modell.

Ein Firmenkunde (Organization) ist ein Tenant. ``firm_admin`` und Firmen-
Mediatoren (Mediator MIT organization_id) sehen ausschließlich Nutzer und Fälle
ihres eigenen Unternehmens. Nur der globale ``admin`` (medipact-intern) sieht
alles tenant-übergreifend; Pool-Mediatoren (Mediator OHNE organization_id) sind
medipact-Personal und sehen wie bisher alle B2C-Fälle.

Diese Regeln werden serverseitig erzwungen – niemals nur im UI.
Siehe docs/business-mandanten-spec.md.
"""
from __future__ import annotations

from fastapi import HTTPException

FIRM_ADMIN_ROLE = "firm_admin"


def role_of(user) -> str:
    return (getattr(user, "role", "") or "").lower()


def is_global_admin(user) -> bool:
    return role_of(user) == "admin"


def is_firm_admin(user) -> bool:
    return role_of(user) == FIRM_ADMIN_ROLE


def is_tenant_scoped(user) -> bool:
    """True, wenn die Sicht des Nutzers auf sein eigenes Unternehmen begrenzt ist:
    firm_admin sowie Mediatoren mit organization_id. Globale Admins und Pool-
    Mediatoren (ohne organization_id) sind NICHT tenant-begrenzt."""
    if is_global_admin(user):
        return False
    role = role_of(user)
    if role == FIRM_ADMIN_ROLE:
        return True
    if role == "mediator" and getattr(user, "organization_id", None) is not None:
        return True
    return False


def can_manage_org(user, org_id: int | None) -> bool:
    """Darf der Nutzer diesen Firmenkunden verwalten?
    Globaler Admin: jeden. firm_admin: nur den eigenen."""
    if is_global_admin(user):
        return True
    if is_firm_admin(user):
        return org_id is not None and getattr(user, "organization_id", None) == org_id
    return False


def assert_same_org(user, org_id: int | None) -> None:
    """403, wenn ein tenant-begrenzter Nutzer auf ein fremdes Unternehmen zugreift.
    Globale Admins passieren immer."""
    if is_global_admin(user):
        return
    own = getattr(user, "organization_id", None)
    if own is None or org_id is None or own != org_id:
        raise HTTPException(
            status_code=403, detail="Kein Zugriff auf ein anderes Unternehmen."
        )


def can_view_mediation(user, mediation) -> bool:
    """Ob ein (Nicht-Teilnehmer-)Nutzer den Fall qua Rolle/Tenant sehen darf.
    Globaler Admin: immer. firm_admin/Firmen-Mediator: nur Fälle der eigenen Org."""
    if is_global_admin(user):
        return True
    if is_tenant_scoped(user):
        return (
            mediation is not None
            and mediation.organization_id is not None
            and mediation.organization_id == getattr(user, "organization_id", None)
        )
    return False
