"""Database credentials and revocable, same-origin browser sessions."""
from __future__ import annotations

import hashlib
import hmac
import re
import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, Request, Response, status
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.auth import auth_error
from app.config import get_settings
from app.database import get_session

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])
SESSION_COOKIE = "workshopos_session"
CSRF_COOKIE = "workshopos_csrf"
SESSION_SECONDS = 8 * 60 * 60
CODE_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]{1,62}$")


def hash_password(password: str, *, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 600_000)
    return f"pbkdf2_sha256$600000${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str | None) -> bool:
    try:
        scheme, rounds, salt, digest = (encoded or "").split("$")
        if scheme != "pbkdf2_sha256" or int(rounds) < 600_000:
            return False
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), int(rounds))
        return hmac.compare_digest(actual, bytes.fromhex(digest))
    except (ValueError, TypeError):
        return False


def _digest(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def _database_mode() -> None:
    if get_settings().auth_mode != "database":
        raise auth_error("AUTH_MODE_UNAVAILABLE", status.HTTP_404_NOT_FOUND)


def _code(code: str) -> str:
    code = code.strip().lower()
    if not CODE_PATTERN.fullmatch(code):
        raise auth_error("TENANT_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return code


class LoginInput(BaseModel):
    tenant_code: str = Field(alias="tenantCode")
    user_id: UUID = Field(alias="userId")
    password: str


@router.get("/workshops")
def list_login_workshops(session: Session = Depends(get_session)) -> list[dict[str, str]]:
    _database_mode()
    rows = session.execute(text("""
        SELECT DISTINCT t.code, t.name
        FROM tenants t
        JOIN tenant_memberships m ON m.tenant_id = t.id AND m.status = 'ACTIVE'
        JOIN platform_users u ON u.id = m.user_id AND u.status = 'ACTIVE'
        WHERE t.code IS NOT NULL AND t.lifecycle_state IN ('trial', 'active', 'payment_due')
          AND u.password_hash IS NOT NULL
        ORDER BY t.name, t.code
    """)).mappings()
    return [{"code": row["code"], "name": row["name"]} for row in rows]


@router.get("/tenants/{code}/users")
def list_login_users(code: str, session: Session = Depends(get_session)) -> list[dict[str, str]]:
    _database_mode()
    rows = session.execute(text("""
        SELECT u.id, u.display_name
        FROM tenants t
        JOIN tenant_memberships m ON m.tenant_id = t.id AND m.status = 'ACTIVE'
        JOIN platform_users u ON u.id = m.user_id AND u.status = 'ACTIVE'
        WHERE lower(t.code) = :code AND t.lifecycle_state IN ('trial', 'active', 'payment_due')
          AND u.password_hash IS NOT NULL
        ORDER BY u.display_name, u.id
    """), {"code": _code(code)}).mappings()
    return [{"id": str(row["id"]), "name": row["display_name"]} for row in rows]


@router.post("/login")
def login(input: LoginInput, response: Response, session: Session = Depends(get_session)) -> dict[str, str]:
    _database_mode()
    with session.begin():
        session.execute(text("DELETE FROM database_sessions WHERE expires_at <= now()"))
        row = session.execute(text("""
            SELECT t.id AS tenant_id, m.id AS membership_id, u.id AS user_id, u.password_hash
            FROM tenants t
            JOIN tenant_memberships m ON m.tenant_id = t.id AND m.status = 'ACTIVE'
            JOIN platform_users u ON u.id = m.user_id AND u.status = 'ACTIVE'
            WHERE lower(t.code) = :code AND u.id = :user_id
              AND t.lifecycle_state IN ('trial', 'active', 'payment_due')
        """), {"code": _code(input.tenant_code), "user_id": str(input.user_id)}).mappings().one_or_none()
        if not row or not verify_password(input.password, row["password_hash"]):
            raise auth_error("INVALID_CREDENTIALS")
        token, csrf = secrets.token_urlsafe(48), secrets.token_urlsafe(32)
        session.execute(text("""
            INSERT INTO database_sessions(token_hash, csrf_hash, tenant_id, user_id, membership_id, expires_at)
            VALUES (:token, :csrf, :tenant, :user, :membership, :expiry)
        """), {"token": _digest(token), "csrf": _digest(csrf), "tenant": str(row["tenant_id"]),
               "user": str(row["user_id"]), "membership": str(row["membership_id"]),
               "expiry": datetime.now(timezone.utc) + timedelta(seconds=SESSION_SECONDS)})
    secure = get_settings().environment != "local"
    response.set_cookie(SESSION_COOKIE, token, max_age=SESSION_SECONDS, httponly=True, secure=secure, samesite="lax", path="/")
    response.set_cookie(CSRF_COOKIE, csrf, max_age=SESSION_SECONDS, httponly=False, secure=secure, samesite="lax", path="/")
    return {"status": "ok"}


def database_identity(request: Request, session: Session) -> tuple[UUID, UUID, UUID]:
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        raise auth_error("AUTHENTICATION_REQUIRED")
    row = session.execute(text("""
        SELECT s.tenant_id, s.user_id, s.membership_id, s.csrf_hash
        FROM database_sessions s
        JOIN tenant_memberships m ON m.id = s.membership_id AND m.tenant_id = s.tenant_id AND m.user_id = s.user_id
        JOIN platform_users u ON u.id = s.user_id
        JOIN tenants t ON t.id = s.tenant_id
        WHERE s.token_hash = :token AND s.expires_at > now()
          AND m.status = 'ACTIVE' AND u.status = 'ACTIVE'
          AND t.lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended')
    """), {"token": _digest(token)}).mappings().one_or_none()
    if not row:
        raise auth_error("AUTHENTICATION_REQUIRED")
    if request.method not in ("GET", "HEAD", "OPTIONS"):
        csrf = request.headers.get("x-workshopos-csrf", "")
        if not csrf or not hmac.compare_digest(_digest(csrf), row["csrf_hash"]):
            raise auth_error("CSRF_INVALID", status.HTTP_403_FORBIDDEN)
    return UUID(str(row["user_id"])), UUID(str(row["tenant_id"])), UUID(str(row["membership_id"]))


@router.post("/logout")
def logout(request: Request, response: Response, session: Session = Depends(get_session)) -> dict[str, str]:
    _database_mode()
    database_identity(request, session)
    session.execute(text("DELETE FROM database_sessions WHERE token_hash = :token"),
                    {"token": _digest(request.cookies[SESSION_COOKIE])})
    session.commit()
    response.delete_cookie(SESSION_COOKIE, path="/")
    response.delete_cookie(CSRF_COOKIE, path="/")
    return {"status": "ok"}
