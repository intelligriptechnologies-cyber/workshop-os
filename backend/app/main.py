from typing import Any
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_session
from app.auth import ScopedTenant, auth_error, session_payload
from app.tenancy import require_branch, require_mutation_allowed
from app.superadmin import router as superadmin_router
from app.tenant_admin import router as tenant_admin_router
from app.intake import router as intake_router
from app.jobs import router as jobs_router
from app.inventory import router as inventory_router
from app.materials import router as materials_router
from app.execution import router as execution_router
from app.finance import router as finance_router
from app.followups import router as followups_router
from app.sales_crm import router as sales_crm_router


app = FastAPI(title="WorkshopOS API", version="0.1.0")
app.include_router(superadmin_router)
app.include_router(tenant_admin_router)
app.include_router(intake_router)
app.include_router(jobs_router)
app.include_router(inventory_router)
app.include_router(materials_router)
app.include_router(execution_router)
app.include_router(finance_router)
app.include_router(followups_router)
app.include_router(sales_crm_router)


@app.exception_handler(HTTPException)
def workshop_http_error(_, error: HTTPException) -> JSONResponse:
    """Keep stable domain error codes at the JSON top level for the React client."""
    if isinstance(error.detail, dict) and "code" in error.detail:
        return JSONResponse(status_code=error.status_code, content=error.detail, headers=error.headers)
    return JSONResponse(status_code=error.status_code, content={"detail": error.detail}, headers=error.headers)


class SettingsUpdate(BaseModel):
    settings: dict[str, Any]


def require_permission(scope: ScopedTenant, permission: str) -> None:
    _, current = scope
    if current.actor_type == "support_emulation" and permission.endswith(".read"):
        return
    if permission not in current.permissions:
        raise auth_error("PERMISSION_DENIED", status.HTTP_403_FORBIDDEN)


def require_tenant_mutation(scope: ScopedTenant) -> None:
    _, current = scope
    try:
        require_mutation_allowed(current)
    except PermissionError as error:
        raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error


@app.get("/health", tags=["operations"])
def health(session: Session = Depends(get_session)) -> dict[str, str]:
    """Report readiness only after PostgreSQL accepts a query."""
    try:
        session.execute(text("SELECT 1"))
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database_unavailable",
        ) from error
    return {"status": "ok", "database": "postgresql", "environment": get_settings().environment}


@app.get("/api/v1/health", tags=["operations"])
def api_health(session: Session = Depends(get_session)) -> dict[str, str]:
    """Versioned API health endpoint used by integration clients."""
    return health(session)


@app.get("/api/v1/auth/config", tags=["authentication"])
def auth_config() -> dict[str, object]:
    """Expose only browser-safe sign-in configuration, never authorization scope."""
    settings = get_settings()
    if settings.auth_mode == "local":
        if not settings.demo_auth_enabled:
            raise auth_error("AUTH_CONFIGURATION_INVALID", status.HTTP_503_SERVICE_UNAVAILABLE)
        return {"mode": "local", "allowDemo": True}
    required = (
        settings.cognito_client_id,
        settings.cognito_authorization_endpoint,
        settings.cognito_token_endpoint,
        settings.cognito_logout_endpoint,
        settings.cognito_callback_uri,
        settings.cognito_logout_uri,
    )
    if not all(required):
        raise auth_error("AUTH_CONFIGURATION_INVALID", status.HTTP_503_SERVICE_UNAVAILABLE)
    return {
        "mode": "cognito",
        "clientId": settings.cognito_client_id,
        "authorizationEndpoint": str(settings.cognito_authorization_endpoint),
        "tokenEndpoint": str(settings.cognito_token_endpoint),
        "logoutEndpoint": str(settings.cognito_logout_endpoint),
        "callbackUri": str(settings.cognito_callback_uri),
        "logoutUri": str(settings.cognito_logout_uri),
        "scopes": ["openid", "email"],
    }


@app.get("/api/v1/session", tags=["authentication"])
def session(scope: ScopedTenant) -> dict[str, object]:
    """Return the server-resolved Tenant session used by the existing Cognito UI."""
    _, current = scope
    return session_payload(current)


@app.get("/api/v1/tenant/settings", tags=["tenant"])
def read_tenant_settings(scope: ScopedTenant) -> dict[str, object]:
    """A first Tenant-owned read proves that RLS is part of the API boundary."""
    session, current = scope
    require_permission(scope, "tenant.settings.read")
    row = session.execute(
        text("SELECT settings, updated_at FROM tenant_settings WHERE tenant_id = :tenant_id"),
        {"tenant_id": str(current.tenant_id)},
    ).mappings().one_or_none()
    return {"settings": dict(row["settings"]) if row else {}, "updatedAt": row["updated_at"].isoformat() if row else None}


@app.put("/api/v1/tenant/settings", tags=["tenant"])
def write_tenant_settings(input: SettingsUpdate, scope: ScopedTenant) -> dict[str, object]:
    """Write through the trusted Tenant context; caller-supplied tenant ids do not exist here."""
    session, current = scope
    require_permission(scope, "tenant.settings.write")
    require_tenant_mutation(scope)
    row = session.execute(
        text(
            """
            INSERT INTO tenant_settings (tenant_id, settings, updated_by)
            VALUES (:tenant_id, CAST(:settings AS jsonb), :actor_id)
            ON CONFLICT (tenant_id) DO UPDATE
            SET settings = EXCLUDED.settings, updated_by = EXCLUDED.updated_by, updated_at = now()
            RETURNING settings, updated_at
            """
        ),
        {"tenant_id": str(current.tenant_id), "settings": __import__("json").dumps(input.settings), "actor_id": str(current.actor_id)},
    ).mappings().one()
    return {"settings": dict(row["settings"]), "updatedAt": row["updated_at"].isoformat()}


@app.get("/api/v1/branches/{branch_id}/settings", tags=["tenant"])
def read_branch_settings(branch_id: UUID, scope: ScopedTenant) -> dict[str, object]:
    """Branch paths are narrowed against the server membership before querying RLS data."""
    session, current = scope
    require_permission(scope, "branch.settings.read")
    try:
        require_branch(current, branch_id)
    except PermissionError as error:
        raise auth_error("BRANCH_ACCESS_DENIED", status.HTTP_403_FORBIDDEN) from error
    row = session.execute(
        text("SELECT settings, updated_at FROM branch_settings WHERE tenant_id = :tenant_id AND branch_id = :branch_id"),
        {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id)},
    ).mappings().one_or_none()
    return {"settings": dict(row["settings"]) if row else {}, "updatedAt": row["updated_at"].isoformat() if row else None}
