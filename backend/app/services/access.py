"""
Zugriffsregeln für einen einzelnen Fall – gemeinsam genutzt von allen Routern.

Hintergrund: Der Workspace listet Fälle über `GET /mediations/all`. Dort sehen
Mediatoren, Firmen-Admins und Admins auch Fälle, in denen sie selbst KEIN
`MediationParticipant` sind. Detail-Endpunkte, die nur auf einen Teilnehmer-
Eintrag prüfen, antworten diesen Nutzern dann mit 403, obwohl der Fall in der
Liste sichtbar ist – im UI sieht das aus wie "keine Daten vorhanden" statt wie
ein Rechteproblem (siehe Bug 2026-07-27: leere Schritt-Listen im FallDetail).

Deshalb gilt: lesende Endpunkte nutzen `require_read_access`, schreibende
Endpunkte, die eine echte Teilnehmer-ID brauchen (Notizen, Unterschriften,
Abstimmungen, Zahlungen), bleiben bei den strengen `_require_participant`-
Varianten des jeweiligen Routers.
"""
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.mediation import Mediation
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.services import billing, onboarding, tenancy

# Rollen, die einen Fall qua Plattform-Rolle betreuen können.
STAFF_ROLES = ("mediator", "admin", tenancy.FIRM_ADMIN_ROLE)


def staff_can_view(user: User, mediation: Optional[Mediation]) -> bool:
    """Darf dieser Nutzer den Fall qua Rolle sehen, ohne Teilnehmer zu sein?

    Spiegelt exakt die Sichtbarkeit von `GET /mediations/all`: globale Admins und
    Pool-Mediatoren (ohne organization_id) sehen alle Fälle, firm_admin und
    Firmen-Mediatoren nur die Fälle ihres eigenen Unternehmens. Wichtig: NICHT
    einfach `role in ("mediator", "admin")` prüfen – das würde das Tenant-Scoping
    aushebeln und Firmen-Rollen fremde B2C-Fälle zeigen.
    """
    if tenancy.role_of(user) not in STAFF_ROLES:
        return False
    if tenancy.is_tenant_scoped(user):
        return (
            mediation is not None
            and mediation.organization_id is not None
            and mediation.organization_id == getattr(user, "organization_id", None)
        )
    return True


def require_participant_or_staff(
    mediation_id: int, user: User, db: Session
) -> Optional[MediationParticipant]:
    """Zugriff für Teilnehmer ODER betreuenden Mediator/Firmen-Admin/Admin.

    Gibt den Teilnehmer-Eintrag zurück – oder `None`, wenn der Zugriff über die
    Plattform-Rolle läuft. Aufrufer, die eine Teilnehmer-ID brauchen, müssen
    diesen None-Fall behandeln.
    """
    # Harte Onboarding-Sperre, VOR jeder weiteren Prüfung: ohne abgeschlossenes
    # Nutzer-Onboarding wird kein Fall angefasst. Die Middleware im Frontend
    # leitet zwar auf /onboarding um, aber wer die API direkt anspricht, käme
    # sonst durch – genau der Fehler, der bei der Paywall schon einmal passiert
    # ist (siehe project_paywall_enforcement).
    #
    # Ausdrücklich AUCH für Mediatoren und Admins: auch sie haben Stammdaten,
    # und ein Onboarding, das man per Rolle überspringen kann, ist im Zweifel
    # gar keins. Wer das für Staff lockern will, tut es hier – nicht verstreut
    # in den Routern.
    onboarding.ensure_onboarded(user)

    participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )
    if participant is None:
        mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
        if not staff_can_view(user, mediation):
            raise HTTPException(status_code=403, detail="Not allowed")
    return participant


def require_read_access(
    mediation_id: int, user: User, db: Session
) -> Optional[MediationParticipant]:
    """`require_participant_or_staff` plus Paywall.

    Die Paywall gilt nur für echte Teilnehmer; betreuende Mediatoren/Admins ohne
    Teilnehmer-Eintrag sind ausgenommen (sie begleiten den Fall, sie zahlen nicht).
    Standard-Guard für alle LESENDEN Fall-Endpunkte.
    """
    participant = require_participant_or_staff(mediation_id, user, db)
    if participant is not None:
        mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
        if not mediation:
            raise HTTPException(status_code=404, detail="Mediation not found")
        billing.ensure_unlocked(mediation, participant, user, db)
    return participant
