from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CourseCreate(BaseModel):
    course_code: str = Field(min_length=1, max_length=50)
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    instructor_id: UUID
    semester: str = Field(min_length=1, max_length=50)
    is_active: bool = True


class CourseUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    instructor_id: UUID | None = None
    semester: str | None = Field(default=None, min_length=1, max_length=50)
    is_active: bool | None = None


class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_code: str
    title: str
    description: str | None
    instructor_id: UUID
    semester: str
    is_active: bool


class EnrollmentCreate(BaseModel):
    student_id: UUID


class EnrollmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    student_id: UUID
    enrolled_at: datetime
    is_active: bool
