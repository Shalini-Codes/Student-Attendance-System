from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class AttendanceSessionStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class AttendanceSession(Base):
    __tablename__ = "attendance_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    course_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    instructor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    session_secret: Mapped[str] = mapped_column(String(255), nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    token_ttl_seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=15, server_default=text("15"))
    status: Mapped[AttendanceSessionStatus] = mapped_column(
        Enum(AttendanceSessionStatus, name="attendance_session_status"),
        nullable=False,
        default=AttendanceSessionStatus.SCHEDULED,
    )
    geo_latitude: Mapped[float | None] = mapped_column()
    geo_longitude: Mapped[float | None] = mapped_column()
    geo_radius_meters: Mapped[float | None] = mapped_column()

    course: Mapped[Course] = relationship(back_populates="attendance_sessions")
    instructor: Mapped[Teacher] = relationship(back_populates="attendance_sessions")
    qr_tokens: Mapped[list[QrToken]] = relationship(back_populates="session", cascade="all, delete-orphan")
    attendance_records: Mapped[list[AttendanceRecord]] = relationship(back_populates="session")


class QrToken(Base):
    __tablename__ = "qr_tokens"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("attendance_sessions.id", ondelete="CASCADE"), nullable=False
    )
    token_nonce: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=text("now()"))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_revoked: Mapped[bool] = mapped_column(nullable=False, default=False)

    session: Mapped[AttendanceSession] = relationship(back_populates="qr_tokens")
    attendance_records: Mapped[list[AttendanceRecord]] = relationship(back_populates="qr_token")


if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.record import AttendanceRecord
    from app.models.user import Teacher
