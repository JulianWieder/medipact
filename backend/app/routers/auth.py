import secrets

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.email import send_verification_email
from app.models.user import User
from app.rate_limit import auth_limiter
from app.security import create_access_token, hash_password, verify_password


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
    token_type: str = "bearer"
    user: UserOut


class RegisterResponse(BaseModel):
    message: str
    email: str


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

    return TokenResponse(
        access_token=access_token,
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

    return TokenResponse(
        access_token=access_token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        },
    )
