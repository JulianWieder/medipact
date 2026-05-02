from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.config import settings
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Security, HTTPException, Depends
from passlib.context import CryptContext


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