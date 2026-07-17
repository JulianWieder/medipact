import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.email import send_verification_email, send_password_reset_email
from app.models.organization import Organization
from app.models.user import User
from app.rate_limit import auth_limiter
from app.services import tenancy
from app import pricing
from app.security import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    hash_password,
    verify_password,
    verify_refresh_token,
)


router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/plans")
def public_business_plans():
    """Öffentliche Liste der Business-Abo-Pläne inkl. Konditionen – für die
    Tarif-Auswahl in der Unternehmens-Registrierung (kein Login nötig)."""
    return pricing.abo_plan_options()


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Passwort muss mindestens 8 Zeichen lang sein")
        return v

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name darf nicht leer sein")
        return v.strip()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class RefreshRequest(BaseModel):
    refresh_token: str


class RefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RegisterResponse(BaseModel):
    message: str
    email: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Passwort muss mindestens 8 Zeichen lang sein")
        return v


class ResetPasswordResponse(BaseModel):
    message: str


@router.post("/register", response_model=RegisterResponse)
def register(request: Request, payload: RegisterRequest, db: Session = Depends(get_db)):
    auth_limiter.check(request)

    existing_user = db.query(User).filter(User.email == str(payload.email)).first()

    if existing_user:
        if existing_user.is_verified:
            raise HTTPException(status_code=400, detail="Email ist bereits registriert")
        # Nicht-verifizierter Account: neuen Token generieren und E-Mail erneut senden
        token = secrets.token_urlsafe(32)
        existing_user.verification_token = token
        db.commit()
        try:
            send_verification_email(str(payload.email), existing_user.name, token)
        except Exception as exc:
            print(f"[EMAIL ERROR] {exc}")
        return RegisterResponse(
            message="Bestätigungs-E-Mail wurde erneut gesendet. Bitte überprüfe dein Postfach.",
            email=str(payload.email),
        )

    # Sicheren Verifizierungstoken generieren
    token = secrets.token_urlsafe(32)

    user = User(
        name=payload.name,
        email=str(payload.email),
        hashed_password=hash_password(payload.password),
        role="party",
        is_verified=False,
        verification_token=token,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Bestätigungs-E-Mail senden (Fehler loggen, aber Registrierung nicht abbrechen)
    try:
        send_verification_email(str(payload.email), payload.name, token)
    except Exception as exc:
        print(f"[EMAIL ERROR] {exc}")

    return RegisterResponse(
        message="Registrierung erfolgreich. Bitte bestätige deine E-Mail-Adresse.",
        email=str(payload.email),
    )


@router.get("/verify-email", response_model=TokenResponse)
def verify_email(token: str, db: Session = Depends(get_db)):
    """
    Wird aufgerufen, wenn der Nutzer auf den Link in der Bestätigungs-E-Mail klickt.
    Markiert den Account als verifiziert und gibt ein JWT zurück.
    """
    user = db.query(User).filter(User.verification_token == token).first()

    if not user:
        raise HTTPException(status_code=400, detail="Ungültiger oder abgelaufener Bestätigungslink")

    if user.is_verified:
        raise HTTPException(status_code=400, detail="E-Mail-Adresse wurde bereits bestätigt")

    user.is_verified = True
    user.verification_token = None  # Token nach Verwendung invalidieren
    db.commit()
    db.refresh(user)

    access_token = create_access_token(email=user.email)
    refresh_token = create_refresh_token(email=user.email)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        },
    )


@router.post("/login", response_model=TokenResponse)
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    auth_limiter.check(request)

    user = db.query(User).filter(User.email == str(payload.email)).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Ungültige Zugangsdaten")

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="E-Mail-Adresse noch nicht bestätigt. Bitte prüfe dein Postfach.",
        )

    access_token = create_access_token(email=user.email)
    refresh_token = create_refresh_token(email=user.email)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        },
    )


@router.post("/refresh", response_model=RefreshResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    """
    Tauscht ein gültiges Refresh-Token gegen ein neues Access-Token (+ rotiertes
    Refresh-Token) ein. Wird vom Frontend aufgerufen, kurz bevor das Access-Token
    abläuft, damit Nutzer nicht stündlich neu einloggen müssen.
    """
    email = verify_refresh_token(payload.refresh_token)

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Ungültiges Refresh-Token")

    access_token = create_access_token(email=user.email)
    new_refresh_token = create_refresh_token(email=user.email)

    return RefreshResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
    )


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(request: Request, payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiiert einen Passwort-Reset-Prozess.
    Sendet einen Reset-Link per E-Mail, wenn der Account existiert.
    """
    auth_limiter.check(request)

    user = db.query(User).filter(User.email == str(payload.email)).first()

    # Wir antworten gleich, egal ob der Account existiert oder nicht (Sicherheit!)
    if not user:
        # Kein Account mit dieser E-Mail → trotzdem erfolgreiche Antwort geben
        return ForgotPasswordResponse(
            message="Falls ein Account mit dieser E-Mail existiert, erhältst du einen Reset-Link.",
            email=str(payload.email),
        )

    # Token generieren und speichern (1 Stunde Gültigkeit)
    token = secrets.token_urlsafe(32)
    user.password_reset_token = token
    user.password_reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.commit()

    # Reset-E-Mail senden (Fehler loggen, aber nicht abbrechen)
    try:
        send_password_reset_email(str(payload.email), user.name, token)
    except Exception as exc:
        print(f"[EMAIL ERROR] {exc}")

    return ForgotPasswordResponse(
        message="Falls ein Account mit dieser E-Mail existiert, erhältst du einen Reset-Link.",
        email=str(payload.email),
    )


@router.get("/me/role")
def get_my_role(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    """Gibt Rolle und Admin-Status des aktuellen Nutzers zurück."""
    user = db.query(User).filter(User.email == current_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "role": user.role,
        # is_admin = Workspace-Zugang (Fälle/Workflows verwalten): Mediatoren,
        # Firmen-Admins und globale Admins.
        "is_admin": user.role in ("mediator", "admin", "firm_admin"),
        # is_superadmin ist bewusst strenger als is_admin: nur echte
        # Administratoren (role == "admin") erhalten Zugriff auf den globalen
        # Admin-Bereich (alle Firmen). Mediatoren/Firmen-Admins nicht.
        "is_superadmin": user.role == "admin",
        # Firmen-Admin: eingeschränkter, auf das eigene Unternehmen begrenzter
        # Zugriff (eigene Fälle + org-scoped Benutzermanager).
        "is_firm_admin": user.role == "firm_admin",
        "organization_id": user.organization_id,
        "email": user.email,
        "name": user.name,
    }


@router.post("/reset-password", response_model=ResetPasswordResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Setzt das Passwort zurück, wenn ein gültiger Token vorhanden ist.
    """
    user = db.query(User).filter(User.password_reset_token == payload.token).first()

    if not user:
        raise HTTPException(status_code=400, detail="Ungültiger oder abgelaufener Reset-Link")

    # Token-Gültigkeit überprüfen
    if user.password_reset_token_expires is None or user.password_reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset-Link ist abgelaufen")

    # Passwort aktualisieren
    user.hashed_password = hash_password(payload.password)
    user.password_reset_token = None
    user.password_reset_token_expires = None
    db.commit()

    return ResetPasswordResponse(
        message="Passwort erfolgreich geändert. Du kannst dich jetzt anmelden."
    )


@router.get("/users/all")
def get_all_users(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    """Registrierte Nutzer - fuer Mediatoren, Firmen-Admins und Admins.

    Tenant-Scoping: firm_admin und Firmen-Mediatoren sehen nur die Nutzer ihres
    eigenen Unternehmens. Globale Admins und Pool-Mediatoren sehen alle."""
    current = db.query(User).filter(User.email == current_user_email).first()
    if not current or current.role not in ("mediator", "admin", "firm_admin"):
        raise HTTPException(status_code=403, detail="Nur fuer Mediatoren, Firmen-Admins und Admins")
    query = db.query(User)
    if tenancy.is_tenant_scoped(current):
        # Firmen-Admin/Firmen-Mediator ohne Unternehmen sieht keine Nutzer.
        if current.organization_id is None:
            return []
        query = query.filter(User.organization_id == current.organization_id)
    users = query.order_by(User.name).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "is_verified": u.is_verified,
            "organization_id": u.organization_id,
        }
        for u in users
    ]


@router.get("/users/overview")
def get_users_overview(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    """Nutzer inkl. ihrer Fälle in EINER Antwort – für den Benutzer-Bereich im
    Workspace. Ersetzt die frühere N+1-Ladelogik im Frontend (Teilnehmer pro
    Fall einzeln laden).

    Scoping wie /users/all bzw. /mediations/all: firm_admin und Firmen-
    Mediatoren sehen nur Nutzer + Fälle des eigenen Unternehmens, globale
    Admins und Pool-Mediatoren alles."""
    from app.models.mediation import Mediation
    from app.models.mediation_participant import MediationParticipant

    current = db.query(User).filter(User.email == current_user_email).first()
    if not current or current.role not in ("mediator", "admin", "firm_admin"):
        raise HTTPException(status_code=403, detail="Nur fuer Mediatoren, Firmen-Admins und Admins")

    user_query = db.query(User)
    mediation_query = db.query(Mediation)
    if tenancy.is_tenant_scoped(current):
        if current.organization_id is None:
            return []
        user_query = user_query.filter(User.organization_id == current.organization_id)
        mediation_query = mediation_query.filter(
            Mediation.organization_id == current.organization_id
        )

    users = user_query.order_by(User.name).all()
    mediations = {m.id: m for m in mediation_query.all()}

    # Alle Teilnahmen der sichtbaren Fälle in einer Abfrage.
    participants = (
        db.query(MediationParticipant)
        .filter(MediationParticipant.mediation_id.in_(mediations.keys()))
        .all()
        if mediations
        else []
    )

    # Mediator je Fall (Teilnehmer mit Rolle owner/mediator) für die Anzeige
    # „wer leitet den Fall". Nutzer-Namen für die Auflösung vorab laden.
    user_by_id = {u.id: u for u in users}
    missing_ids = {p.user_id for p in participants} - set(user_by_id)
    if missing_ids:
        for u in db.query(User).filter(User.id.in_(missing_ids)).all():
            user_by_id[u.id] = u

    mediator_name_by_case: dict[int, str | None] = {}
    for p in participants:
        if p.role in ("owner", "mediator"):
            leader = user_by_id.get(p.user_id)
            mediator_name_by_case.setdefault(p.mediation_id, leader.name if leader else None)

    cases_by_user: dict[int, list[dict]] = {}
    for p in participants:
        m = mediations.get(p.mediation_id)
        if not m:
            continue
        is_leader = p.role in ("owner", "mediator")
        cases_by_user.setdefault(p.user_id, []).append(
            {
                "mediation_id": m.id,
                "title": m.title,
                "mediation_type": m.mediation_type,
                "status": m.status,
                "phase": m.phase,
                "participant_role": p.role,
                "invitation_status": "accepted",
                "mediator_name": None if is_leader else mediator_name_by_case.get(m.id),
            }
        )

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "is_verified": u.is_verified,
            "organization_id": u.organization_id,
            "cases": cases_by_user.get(u.id, []),
        }
        for u in users
    ]


# ── Benutzermanager (nur echte Admins, role == "admin") ────────────────────
#
# Getrennt von der Mediator-Berechtigung: Mediatoren dürfen Fälle/Workflows
# verwalten, aber NICHT Rollen anderer Nutzer ändern oder Nutzer löschen.

ALLOWED_ROLES = ("party", "mediator", "admin", "firm_admin")
# Rollen, die ein Firmen-Admin innerhalb seines Unternehmens vergeben darf.
FIRM_ADMIN_ASSIGNABLE_ROLES = ("party", "mediator")

# Anzeige-Labels aller bekannten Rollen – SINGLE SOURCE fürs Frontend-Dropdown
# (siehe GET /auth/roles). Neue Rolle hier + in ALLOWED_ROLES eintragen, dann
# erscheint sie automatisch im Benutzermanager.
ROLE_LABELS = {
    "party": "Partei",
    "mediator": "Mediator",
    "firm_admin": "Firmen-Admin",
    "admin": "Administrator",
}


class UpdateUserRoleRequest(BaseModel):
    role: str

    @field_validator("role")
    @classmethod
    def role_valid(cls, v: str) -> str:
        if v not in ALLOWED_ROLES:
            raise ValueError(f"Ungültige Rolle. Erlaubt: {', '.join(ALLOWED_ROLES)}")
        return v


def _require_admin(db: Session, current_user_email: str) -> User:
    """Stellt sicher, dass der aufrufende Nutzer ein echter (globaler) Admin ist."""
    current = db.query(User).filter(User.email == current_user_email).first()
    if not current or current.role != "admin":
        raise HTTPException(status_code=403, detail="Nur für Administratoren")
    return current


def _require_user_manager(db: Session, current_user_email: str) -> User:
    """Nutzerverwaltung: globaler Admin ODER Firmen-Admin (org-begrenzt)."""
    current = db.query(User).filter(User.email == current_user_email).first()
    if not current or current.role not in ("admin", "firm_admin"):
        raise HTTPException(status_code=403, detail="Nur für Administratoren")
    return current


def _assert_can_manage_target(manager: User, target: User) -> None:
    """Firmen-Admin darf nur Nutzer der eigenen Org verwalten und keine (globalen/
    Firmen-)Admins anfassen. Globaler Admin darf alles."""
    if tenancy.is_global_admin(manager):
        return
    if target.organization_id != manager.organization_id or manager.organization_id is None:
        raise HTTPException(status_code=403, detail="Kein Zugriff auf Nutzer eines anderen Unternehmens.")
    if target.role in ("admin", "firm_admin"):
        raise HTTPException(status_code=403, detail="Firmen-Admins können keine Administratoren verwalten.")


@router.get("/roles")
def list_assignable_roles(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    """Rollen fürs Benutzermanager-Dropdown – dynamisch je nach Rolle des
    Aufrufers. Globaler Admin: alle Rollen; Firmen-Admin: nur party/mediator.
    ``labels`` liefert Anzeige-Labels aller bekannten Rollen (auch fremde)."""
    manager = _require_user_manager(db, current_user_email)
    if tenancy.is_global_admin(manager):
        assignable = list(ALLOWED_ROLES)
    else:  # firm_admin
        assignable = list(FIRM_ADMIN_ASSIGNABLE_ROLES)
    return {
        "assignable": [{"id": r, "label": ROLE_LABELS.get(r, r)} for r in assignable],
        "labels": ROLE_LABELS,
    }


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    payload: UpdateUserRoleRequest,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    """Ändert die Rolle eines Nutzers. Globaler Admin: jede Rolle, jeden Nutzer.
    Firmen-Admin: nur Nutzer der eigenen Org, nur Rollen party/mediator."""
    manager = _require_user_manager(db, current_user_email)

    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")

    _assert_can_manage_target(manager, target)

    if not tenancy.is_global_admin(manager) and payload.role not in FIRM_ADMIN_ASSIGNABLE_ROLES:
        raise HTTPException(
            status_code=403,
            detail=f"Firmen-Admins können nur folgende Rollen vergeben: {', '.join(FIRM_ADMIN_ASSIGNABLE_ROLES)}.",
        )

    if target.id == manager.id and payload.role != manager.role:
        raise HTTPException(
            status_code=400,
            detail="Du kannst deine eigene Rolle hier nicht ändern.",
        )

    target.role = payload.role
    db.commit()
    return {
        "id": target.id,
        "name": target.name,
        "email": target.email,
        "role": target.role,
        "is_verified": target.is_verified,
        "organization_id": target.organization_id,
    }


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    """Löscht einen Nutzer. Globaler Admin: jeden. Firmen-Admin: nur eigene Org."""
    manager = _require_user_manager(db, current_user_email)

    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Nutzer nicht gefunden")

    if target.id == manager.id:
        raise HTTPException(
            status_code=400, detail="Du kannst deinen eigenen Account nicht löschen."
        )

    _assert_can_manage_target(manager, target)

    db.delete(target)
    db.commit()
    return {"deleted": True, "id": user_id}


# ── Firmen-Mitglieder anlegen (Firmen-Admin / globaler Admin) ───────────────
#
# Ein Firmen-Admin legt Firmen-Mediatoren und Mitarbeiter (Beteiligte) in seinem
# Unternehmen an. Der neue Nutzer bekommt die organization_id des Firmen-Admins
# und setzt sein Passwort über die zugesandte "Passwort setzen"-Mail selbst.

class OrgMemberCreateRequest(BaseModel):
    name: str
    email: EmailStr
    role: str = "party"
    organization_id: int | None = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name darf nicht leer sein")
        return v.strip()

    @field_validator("role")
    @classmethod
    def role_valid(cls, v: str) -> str:
        # Alle bekannten Rollen zulassen; die engere Firmen-Admin-Beschränkung
        # (nur party/mediator) prüft der Handler rollenabhängig.
        if v not in ALLOWED_ROLES:
            raise ValueError(f"Ungültige Rolle. Erlaubt: {', '.join(ALLOWED_ROLES)}")
        return v


@router.post("/org-members", status_code=201)
def create_org_member(
    payload: OrgMemberCreateRequest,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    manager = _require_user_manager(db, current_user_email)

    if tenancy.is_global_admin(manager):
        # Globaler Admin: Unternehmen optional (None = Pool-Nutzer ohne Org),
        # jede Rolle erlaubt.
        org_id = payload.organization_id
    else:
        if payload.role not in FIRM_ADMIN_ASSIGNABLE_ROLES:
            raise HTTPException(
                status_code=403,
                detail=f"Firmen-Admins können nur folgende Rollen vergeben: {', '.join(FIRM_ADMIN_ASSIGNABLE_ROLES)}.",
            )
        org_id = manager.organization_id
        if org_id is None:
            raise HTTPException(status_code=400, detail="Dein Account ist keinem Unternehmen zugeordnet.")

    if org_id is not None:
        org = db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            raise HTTPException(status_code=404, detail="Unternehmen nicht gefunden")

    existing = db.query(User).filter(User.email == str(payload.email)).first()
    if existing:
        if existing.organization_id not in (None, org_id) and not tenancy.is_global_admin(manager):
            raise HTTPException(status_code=409, detail="Nutzer gehört bereits zu einem anderen Unternehmen.")
        if org_id is not None:
            existing.organization_id = org_id
        if existing.role == "party":
            existing.role = payload.role
        db.commit()
        db.refresh(existing)
        return {
            "id": existing.id, "name": existing.name, "email": existing.email,
            "role": existing.role, "is_verified": existing.is_verified,
            "organization_id": existing.organization_id, "invited": False,
        }

    reset_token = secrets.token_urlsafe(32)
    user = User(
        name=payload.name,
        email=str(payload.email),
        hashed_password=hash_password(secrets.token_urlsafe(24)),
        role=payload.role,
        organization_id=org_id,
        is_verified=True,
        password_reset_token=reset_token,
        password_reset_token_expires=datetime.utcnow() + timedelta(days=7),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        send_password_reset_email(str(payload.email), payload.name, reset_token)
    except Exception as exc:
        print(f"[EMAIL ERROR] {exc}")

    return {
        "id": user.id, "name": user.name, "email": user.email, "role": user.role,
        "is_verified": user.is_verified, "organization_id": user.organization_id,
        "invited": True,
    }


# ── Firmenkunden-Onboarding: Self-Service-Registrierung ─────────────────────
#
# Legt in einem Schritt das Unternehmen an und macht den registrierenden Nutzer
# zum Firmen-Admin. Bestätigung per E-Mail wie bei /register.

class RegisterCompanyRequest(BaseModel):
    company_name: str
    name: str
    email: EmailStr
    password: str
    # Granulare Firmendaten (Schritt Firma + Ansprechpartner + Tarif).
    plan: str = pricing.DEFAULT_ABO_PLAN
    billing_email: str | None = None
    # Position des Ansprechpartners (nur informativ, aktuell nicht persistiert).
    position: str | None = None

    @field_validator("company_name", "name")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Darf nicht leer sein")
        return v.strip()

    @field_validator("plan")
    @classmethod
    def plan_valid(cls, v: str) -> str:
        return pricing.normalize_abo_plan(v)

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Passwort muss mindestens 8 Zeichen lang sein")
        return v


@router.post("/register-company", response_model=RegisterResponse)
def register_company(
    request: Request, payload: RegisterCompanyRequest, db: Session = Depends(get_db)
):
    auth_limiter.check(request)

    if db.query(User).filter(User.email == str(payload.email)).first():
        raise HTTPException(status_code=400, detail="Email ist bereits registriert")
    if db.query(Organization).filter(Organization.name == payload.company_name).first():
        raise HTTPException(status_code=409, detail="Ein Unternehmen mit diesem Namen existiert bereits.")

    org = Organization(
        name=payload.company_name,
        plan=payload.plan,
        billing_email=(payload.billing_email.strip() if payload.billing_email else None) or None,
    )
    db.add(org)
    db.commit()
    db.refresh(org)

    token = secrets.token_urlsafe(32)
    user = User(
        name=payload.name,
        email=str(payload.email),
        hashed_password=hash_password(payload.password),
        role="firm_admin",
        organization_id=org.id,
        is_verified=False,
        verification_token=token,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        send_verification_email(str(payload.email), payload.name, token)
    except Exception as exc:
        print(f"[EMAIL ERROR] {exc}")

    return RegisterResponse(
        message="Unternehmen registriert. Bitte bestätige deine E-Mail-Adresse.",
        email=str(payload.email),
    )
