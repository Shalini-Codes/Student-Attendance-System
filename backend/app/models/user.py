from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"


class UserStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    ARCHIVED = "ARCHIVED"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), nullable=False)
    status: Mapped[UserStatus] = mapped_column(
        Enum(UserStatus, name="user_status"), nullable=False, default=UserStatus.ACTIVE
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("now()"), onupdate=text("now()")
    )

    teacher: Mapped[Teacher | None] = relationship(back_populates="user", uselist=False)
    student: Mapped[Student | None] = relationship(back_populates="user", uselist=False)
    audit_logs: Mapped[list[AuditLog]] = relationship(back_populates="actor")


class Teacher(Base):
    __tablename__ = "teachers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    employee_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    department: Mapped[str] = mapped_column(String(150), nullable=False)
    office_location: Mapped[str | None] = mapped_column(String(150))

    user: Mapped[User] = relationship(back_populates="teacher")
    courses: Mapped[list[Course]] = relationship(back_populates="instructor")
    attendance_sessions: Mapped[list[AttendanceSession]] = relationship(back_populates="instructor")


class Student(Base):
    __tablename__ = "students"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    roll_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    batch_year: Mapped[int] = mapped_column(nullable=False)
    department: Mapped[str] = mapped_column(String(150), nullable=False)

    user: Mapped[User] = relationship(back_populates="student")
    enrollments: Mapped[list[CourseEnrollment]] = relationship(back_populates="student")
    attendance_records: Mapped[list[AttendanceRecord]] = relationship(back_populates="student")


if TYPE_CHECKING:
    from app.models.audit import AuditLog
    from app.models.course import Course, CourseEnrollment
    from app.models.record import AttendanceRecord
    from app.models.session import AttendanceSession
