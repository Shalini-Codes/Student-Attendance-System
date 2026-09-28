from __future__ import annotations

from passlib.context import CryptContext
from sqlalchemy import select

from app.db.session import Base, SessionLocal, engine
from app.models import Course, CourseEnrollment, Student, Teacher, User, UserRole, UserStatus


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_database() -> None:
    """Create the schema and insert the standard local development dataset."""
    Base.metadata.create_all(bind=engine)
    with SessionLocal.begin() as db:
        if db.scalar(select(User.id).limit(1)) is not None:
            return

        password_hash = pwd_context.hash("ChangeMe123!")
        admin = User(
            email="admin@attendance.local",
            hashed_password=password_hash,
            first_name="System",
            last_name="Administrator",
            role=UserRole.ADMIN,
            status=UserStatus.ACTIVE,
        )
        teacher_users = [
            User(
                email=f"teacher{number}@attendance.local",
                hashed_password=password_hash,
                first_name=f"Teacher {number}",
                last_name="User",
                role=UserRole.TEACHER,
                status=UserStatus.ACTIVE,
            )
            for number in (1, 2)
        ]
        student_users = [
            User(
                email=f"student{number}@attendance.local",
                hashed_password=password_hash,
                first_name=f"Student {number}",
                last_name="User",
                role=UserRole.STUDENT,
                status=UserStatus.ACTIVE,
            )
            for number in range(1, 11)
        ]
        db.add_all([admin, *teacher_users, *student_users])
        db.flush()

        teachers = [
            Teacher(
                id=user.id,
                employee_id=f"EMP-{number:03d}",
                department="Computer Science",
                office_location=f"Block A-{number}",
            )
            for number, user in enumerate(teacher_users, 1)
        ]
        students = [
            Student(
                id=user.id,
                roll_number=f"STU-{number:03d}",
                batch_year=2026,
                department="Computer Science",
            )
            for number, user in enumerate(student_users, 1)
        ]
        db.add_all([*teachers, *students])
        db.flush()

        courses = [
            Course(
                course_code="CS101",
                title="Introduction to Computer Science",
                description="Core computing concepts and problem solving.",
                instructor_id=teachers[0].id,
                semester="Fall 2026",
            ),
            Course(
                course_code="CS202",
                title="Database Systems",
                description="Relational modeling, SQL, and database design.",
                instructor_id=teachers[1].id,
                semester="Fall 2026",
            ),
        ]
        db.add_all(courses)
        db.flush()
        db.add_all(
            CourseEnrollment(course_id=course.id, student_id=student.id)
            for course in courses
            for student in students
        )


if __name__ == "__main__":
    seed_database()
