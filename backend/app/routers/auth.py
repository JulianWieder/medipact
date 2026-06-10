import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.email import send_verification_email, send_password_reset_email
from app.models.user import User
from app.rate_limit import auth_limiter
from app.security import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    hash_password,
    verify_password,
    verify_refresh_token,
)


router = APIRouter(prefix="/auth", tags=["auth"])


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
        "is_admin": user.role in ("mediator", "admin"),
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
    """Alle registrierten Nutzer - nur fuer Mediatoren und Admins."""
    current = db.query(User).filter(User.email == current_user_email).first()
    if not current or current.role not in ("mediator", "admin"):
        raise HTTPException(status_code=403, detail="Nur fuer Mediatoren und Admins")

    users = db.query(User).order_by(User.name).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "is_verified": u.is_verified,
        }
        for u in users
    ]
