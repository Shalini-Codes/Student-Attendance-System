import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, verify_password
from app.models.user import User, UserStatus
from app.schemas.auth import (
    LoginRequest,
    RefreshTokenRequest,
    Token,
    TokenPayload,
    UserTokenInfo,
)
from app.schemas.user import UserOut


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)) -> Token:
    user = db.scalar(select(User).where(User.email == data.email))
    if user is None or user.status != UserStatus.ACTIVE or not verify_password(
        data.password, user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return Token(
        access_token=create_access_token(str(user.id), user.role.value),
        refresh_token=create_refresh_token(str(user.id)),
        user=UserTokenInfo.model_validate(user),
    )


@router.post("/refresh", response_model=Token)
def refresh(data: RefreshTokenRequest, db: Session = Depends(get_db)) -> Token:
    try:
        payload = jwt.decode(
            data.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_payload = TokenPayload.model_validate(payload)
        if token_payload.type != "refresh":
            raise ValueError
    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None

    user = db.scalar(
        select(User).where(User.id == token_payload.sub, User.status == UserStatus.ACTIVE)
    )
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not active")
    return Token(
        access_token=create_access_token(str(user.id), user.role.value),
        token_type="bearer",
    )


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
