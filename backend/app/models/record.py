from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class AttendanceRecordStatus(str, enum.Enum):
    PRESENT = "PRESENT"
    LATE = "LATE"
    EXCUSED = "EXCUSED"
    INVALIDATED = "INVALIDATED"


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    __table_args__ = (
        UniqueConstraint("session_id", "student_id", name="uq_session_student"),
        UniqueConstraint("session_id", "device_signature_hash", name="uq_session_device"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("attendance_sessions.id", ondelete="CASCADE"), nullable=False
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False
    )
    qr_token_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("qr_tokens.id"), nullable=True
    )
    marked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("now()")
    )
    device_signature_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(45))
    status: Mapped[AttendanceRecordStatus] = mapped_column(
        Enum(AttendanceRecordStatus, name="attendance_record_status"),
        nullable=False,
        default=AttendanceRecordStatus.PRESENT,
    )
    validation_latency_ms: Mapped[int | None] = mapped_column(Integer)

    session: Mapped[AttendanceSession] = relationship(back_populates="attendance_records")
    student: Mapped[Student] = relationship(back_populates="attendance_records")
    qr_token: Mapped[QrToken | None] = relationship(back_populates="attendance_records")


if TYPE_CHECKING:
    from app.models.session import AttendanceSession, QrToken
    from app.models.user import Student
