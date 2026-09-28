# Secure Dynamic QR Attendance System

Backend foundation for a secure, role-aware attendance platform built with FastAPI, PostgreSQL, and SQLAlchemy 2.0.

## Implemented Scope

This backend currently includes:

- PostgreSQL database configuration with SQLAlchemy 2.0
- Typed declarative ORM models
- UUID primary keys backed by `gen_random_uuid()`
- User, teacher, student, course, enrollment, attendance, QR token, and audit log tables
- Password hashing with Passlib and bcrypt
- JWT access and refresh tokens
- Pydantic request and response schemas
- FastAPI authentication dependencies
- Role-based access control for `ADMIN`, `TEACHER`, and `STUDENT`
- Authentication endpoints
- User administration endpoints
- Course and enrollment endpoints
- CORS configuration
- Health check endpoint
- Database seed script with development users, courses, and enrollments

## Technology Stack

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy 2.0
- Alembic
- Pydantic Settings
- PyJWT
- Passlib with bcrypt
- Psycopg 3

## Project Structure

```text
backend/
├── app/
│   ├── api/
│   │   ├── deps.py
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py
│   │       │   ├── courses.py
│   │       │   └── users.py
│   │       └── router.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── seed.py
│   │   └── session.py
│   ├── models/
│   │   ├── audit.py
│   │   ├── course.py
│   │   ├── record.py
│   │   ├── session.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── course.py
│   │   └── user.py
│   └── main.py
├── requirements.txt
└── README.md
```

## Prerequisites

- Python 3.11 or newer
- PostgreSQL 14 or newer
- PostgreSQL `pgcrypto` extension enabled

The UUID defaults use PostgreSQL's `gen_random_uuid()` function. Enable the extension in the target database if it is not already available:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## Installation

From the `backend` directory:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

## Configuration

The application reads settings from environment variables and an optional `.env` file.

Example `.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/secure_qr_attendance
PROJECT_NAME=Secure Dynamic QR Attendance System
API_V1_STR=/api/v1
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Important configuration notes

- Set a strong, randomly generated `SECRET_KEY` outside local development.
- `DATABASE_URL` is consumed by [app/db/session.py](./app/db/session.py).
- `CORS_ORIGINS` accepts a comma-separated string or a settings list.
- Access tokens expire after 15 minutes by default.
- Refresh tokens expire after 7 days by default.

The development fallback database URL is:

```text
postgresql+psycopg://postgres:postgres@localhost:5432/secure_qr_attendance
```

## Database Models

### Users and profiles

- `users`
  - UUID primary key
  - Unique email
  - Bcrypt password hash
  - Role: `ADMIN`, `TEACHER`, or `STUDENT`
  - Status: `ACTIVE`, `SUSPENDED`, or `ARCHIVED`
  - Creation and update timestamps
- `teachers`
  - Primary key and foreign key to `users.id`
  - Unique employee ID
  - Department and office location
- `students`
  - Primary key and foreign key to `users.id`
  - Unique roll number
  - Batch year and department

### Courses and enrollment

- `courses`
  - UUID primary key
  - Unique course code
  - Course title, description, semester, and active flag
  - Instructor foreign key to `teachers.id`
- `course_enrollments`
  - UUID primary key
  - Course and student foreign keys
  - Enrollment timestamp and active flag
  - Unique `(course_id, student_id)` constraint

### Attendance and QR tokens

- `attendance_sessions`
  - Course and instructor references
  - Session secret and start/end timestamps
  - Token TTL, status, and optional geolocation restrictions
- `qr_tokens`
  - Session reference
  - Unique token nonce
  - Issue and expiry timestamps
  - Revocation flag
- `attendance_records`
  - Session and student references
  - Optional QR token reference
  - Device signature hash, IP address, status, and validation latency
  - Unique `(session_id, student_id)` constraint
  - Unique `(session_id, device_signature_hash)` constraint

### Audit logging

- `audit_logs`
  - Optional actor reference to `users`
  - Action, resource type, resource ID, payload, IP address, user agent, and timestamp
  - Audit payload is stored as JSON

All ORM models are exported from [app/models/__init__.py](./app/models/__init__.py), allowing Alembic metadata discovery through `Base.metadata`.

## Database Initialization and Seeding

The seed script creates the declared tables and inserts a development dataset when the database is empty:

- 1 administrator
- 2 teachers
- 10 students
- 2 courses
- Active enrollments for all 10 students in both courses

Run it with:

```powershell
python -m app.db.seed
```

Development users use the password:

```text
ChangeMe123!
```

Example seed accounts:

```text
admin@attendance.local
teacher1@attendance.local
teacher2@attendance.local
student1@attendance.local
student2@attendance.local
```

Change or remove these development credentials before using the application outside local development.

## Running the API

From the `backend` directory:

```powershell
uvicorn app.main:app --reload
```

The API is then available at:

- Application: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- OpenAPI JSON: `http://127.0.0.1:8000/openapi.json`
- Health check: `http://127.0.0.1:8000/health`

## Authentication

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "admin@attendance.local",
  "password": "ChangeMe123!"
}
```

Response:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "user": {
    "id": "<uuid>",
    "email": "admin@attendance.local",
    "role": "ADMIN",
    "first_name": "System",
    "last_name": "Administrator"
  }
}
```

Use the access token for protected endpoints:

```http
Authorization: Bearer <access-token>
```

### Refresh

```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

Request:

```json
{
  "refresh_token": "<refresh-jwt>"
}
```

### Current user

```http
GET /api/v1/auth/me
Authorization: Bearer <access-token>
```

Only access tokens can authenticate protected API requests. Refresh tokens are validated separately and cannot be used as access tokens.

## API Endpoints

All application endpoints are mounted under `/api/v1`.

### Authentication

| Method | Path | Access |
|---|---|---|
| `POST` | `/auth/login` | Public |
| `POST` | `/auth/refresh` | Public with valid refresh token |
| `GET` | `/auth/me` | Authenticated users |

### User administration

| Method | Path | Access |
|---|---|---|
| `POST` | `/users/students` | Admin |
| `POST` | `/users/teachers` | Admin |
| `GET` | `/users` | Admin |
| `GET` | `/users/{user_id}` | Admin or the requested user |

`GET /users` supports:

- `skip`: pagination offset, default `0`
- `limit`: page size, default `100`, maximum `100`
- `role`: optional `ADMIN`, `TEACHER`, or `STUDENT` filter

### Course management

| Method | Path | Access |
|---|---|---|
| `POST` | `/courses` | Admin |
| `GET` | `/courses` | Admin, teacher, or student |
| `POST` | `/courses/{course_id}/enroll` | Admin or assigned teacher |
| `GET` | `/courses/{course_id}/students` | Authenticated users |

Course listing behavior:

- Admins receive all courses.
- Teachers receive courses assigned to their teacher profile.
- Students receive courses with an active enrollment for their student profile.

Enrollment behavior:

- Admins can enroll a student in any course.
- Teachers can enroll students only in courses they instruct.
- Re-enrolling an inactive enrollment reactivates it.
- Active duplicate enrollments return `409 Conflict`.

## Role-Based Access Control

Role enforcement is implemented by `require_roles` in [app/api/deps.py](./app/api/deps.py).

Supported roles:

```text
ADMIN
TEACHER
STUDENT
```

The dependency:

1. Extracts the Bearer token.
2. Verifies the JWT signature and expiration.
3. Requires an access-token claim.
4. Loads the user from PostgreSQL.
5. Requires the user to have `ACTIVE` status.
6. Checks the user's role against the endpoint's allowed roles.

Invalid or expired credentials return `401 Unauthorized`. Valid credentials with insufficient permissions return `403 Forbidden`.

## Error Behavior

The API uses standard HTTP status codes:

- `401 Unauthorized`: missing, invalid, expired, or inactive authentication
- `403 Forbidden`: authenticated user lacks the required role or ownership
- `404 Not Found`: requested user, course, instructor, or student does not exist
- `409 Conflict`: duplicate email, profile identifier, course code, or enrollment
- `422 Unprocessable Entity`: request validation failure

## Alembic Integration

The models are ready for Alembic because they share the declarative `Base` in [app/db/session.py](./app/db/session.py), and all models are imported through [app/models/__init__.py](./app/models/__init__.py).

When adding an Alembic environment, configure `target_metadata` as:

```python
from app.db.session import Base
import app.models

target_metadata = Base.metadata
```

Then generate and apply migrations with:

```powershell
alembic revision --autogenerate -m "create attendance schema"
alembic upgrade head
```

Use Alembic migrations for shared, staged, or production databases instead of relying on `Base.metadata.create_all()`.

## Validation Commands

Compile all Python modules:

```powershell
python -m compileall -q app
```

Validate application import and route generation:

```powershell
python -c "from app.main import app; print(sorted(app.openapi()['paths']))"
```

Validate the development seed:

```powershell
python -m app.db.seed
```

## Production Considerations

Before production deployment:

- Replace the default `SECRET_KEY`.
- Replace or remove seeded development accounts.
- Run Alembic migrations instead of automatic table creation.
- Use a managed PostgreSQL database with backups and TLS.
- Store secrets in a secret manager or deployment environment.
- Restrict `CORS_ORIGINS` to trusted frontend domains.
- Configure structured logging and centralized error monitoring.
- Add rate limiting and account lockout protection to login flows.
- Use HTTPS so access and refresh tokens are not exposed in transit.
- Consider refresh-token rotation and revocation storage for higher-security deployments.
