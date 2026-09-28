from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole, UserStatus


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    role: UserRole


class UserUpdate(BaseModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    last_name: str | None = Field(default=None, min_length=1, max_length=100)
    status: UserStatus | None = None
    password: str | None = Field(default=None, min_length=8)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole
    status: UserStatus


class StudentCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    roll_number: str = Field(min_length=1, max_length=50)
    batch_year: int
    department: str = Field(min_length=1, max_length=150)


class TeacherCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    employee_id: str = Field(min_length=1, max_length=50)
    department: str = Field(min_length=1, max_length=150)
    office_location: str | None = Field(default=None, max_length=150)
