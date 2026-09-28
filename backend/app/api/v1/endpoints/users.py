from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_roles
from app.core.security import get_password_hash
from app.models.user import Student, Teacher, User, UserRole, UserStatus
from app.schemas.user import StudentCreate, TeacherCreate, UserOut


router = APIRouter(prefix="/users", tags=["users"])


def duplicate_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Email or profile identifier already exists",
    )


@router.post("/students", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_student(
    data: StudentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(["ADMIN"])),
) -> User:
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        role=UserRole.STUDENT,
        status=UserStatus.ACTIVE,
    )
    db.add(user)
    try:
        db.flush()
        db.add(
            Student(
                id=user.id,
                roll_number=data.roll_number,
                batch_year=data.batch_year,
                department=data.department,
            )
        )
        db.commit()
    except IntegrityError:
        db.rollback()
        raise duplicate_error() from None
    db.refresh(user)
    return user


@router.post("/teachers", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_teacher(
    data: TeacherCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(["ADMIN"])),
) -> User:
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        role=UserRole.TEACHER,
        status=UserStatus.ACTIVE,
    )
    db.add(user)
    try:
        db.flush()
        db.add(
            Teacher(
                id=user.id,
                employee_id=data.employee_id,
                department=data.department,
                office_location=data.office_location,
            )
        )
        db.commit()
    except IntegrityError:
        db.rollback()
        raise duplicate_error() from None
    db.refresh(user)
    return user


@router.get("", response_model=list[UserOut])
def list_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    role: UserRole | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(["ADMIN"])),
) -> list[User]:
    query = select(User).order_by(User.created_at.desc()).offset(skip).limit(limit)
    if role is not None:
        query = query.where(User.role == role)
    return list(db.scalars(query).all())


@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "TEACHER", "STUDENT"])),
) -> User:
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    user = db.scalar(select(User).where(User.id == user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
