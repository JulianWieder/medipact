from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.security import create_access_token, hash_password, verify_password


router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == str(payload.email)).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email ist bereits registriert")

    user = User(
        name=payload.name,
        email=str(payload.email),
        hashed_password=hash_password(payload.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(email=user.email)

    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == str(payload.email)).first()

    if not user:
        raise HTTPException(status_code=401, detail="Ungültige Zugangsdaten")

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Ungültige Zugangsdaten")

    #if not user.is_active:
    #    raise HTTPException(status_code=403, detail="User ist deaktiviert")

    token = create_access_token(email=user.email)

    return TokenResponse(access_token=token)