from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def _create_token(
    subject: str,
    token_type: str,
    expires_delta: timedelta,
    role: str | None = None,
) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    if role is not None:
        payload["role"] = role
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(
    subject: str, role: str, expires_delta: timedelta | None = None
) -> str:
    return _create_token(
        subject,
        "access",
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        role,
    )


def create_refresh_token(
    subject: str, expires_delta: timedelta | None = None
) -> str:
    return _create_token(
        subject,
        "refresh",
        expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
