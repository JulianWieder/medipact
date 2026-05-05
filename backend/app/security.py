from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.config import settings
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Security, HTTPException, Depends
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.mediation import Mediation
from app.models.mediation_participant import MediationParticipant

security = HTTPBearer()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

    
def create_access_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": email,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def verify_access_token(token: str) -> str:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        email = payload.get("sub")

        if not isinstance(email, str) or not email:
            raise HTTPException(status_code=401, detail="Ungültiger Token")

        return email

    except JWTError:
        raise HTTPException(status_code=401, detail="Token ungültig oder abgelaufen")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    ) -> str:
    return verify_access_token(credentials.credentials)


def get_current_db_user(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
    ) -> User:
    user = db.query(User).filter(User.email == current_user_email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def require_mediation_access(
    mediation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> Mediation:
    mediation = (
        db.query(Mediation)
        .join(MediationParticipant)
        .filter(
            Mediation.id == mediation_id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )

    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    return mediation