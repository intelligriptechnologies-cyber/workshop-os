"""Authentication and server-side membership resolution for WorkshopOS."""

from collections.abc import Generator
from typing import Annotated
from uuid import UUID

import jwt
from fastapi import Depends, Header, HTTPException, status
from jwt import InvalidTokenError, PyJWKClient
from jwt.exceptions import PyJWKClientError
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.database import get_session
from app.tenancy import BranchScope, TenantScope, apply_rls_context


def auth_error(code: str, status_code: int = status.HTTP_401_UNAUTHORIZED) -> HTTPException:
    return HTTPException(status_code=status_code, detail={"code": code})


def _cognito_subject(token: str, settings: Settings) -> str:
    if not settings.cognito_issuer or not settings.cognito_client_id or not settings.cognito_jwks_url:
        raise auth_error("AUTH_CONFIGURATION_INVALID", status.HTTP_503_SERVICE_UNAVAILABLE)
    try:
        key = PyJWKClient(str(settings.cognito_jwks_url)).get_signing_key_from_jwt(token).key
        claims = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.cognito_client_id,
            issuer=str(settings.cognito_issuer).rstrip("/"),
        )
    except (InvalidTokenError, PyJWKClientError) as error:
        raise auth_error("INVALID_ACCESS_TOKEN") from error
    if claims.get("token_use") != "access" or not isinstance(claims.get("sub"), str):
        raise auth_error("INVALID_ACCESS_TOKEN")
    return claims["sub"]


def authenticated_subject(
    authorization: Annotated[str | None, Header()] = None,
    demo_identity: Annotated[str | None, Header(alias="x-workshopos-identity")] = None,
    settings: Settings = Depends(get_settings),
) -> str:
    """Return a Cognito subject, or the deliberately local-only demo subject."""
    if settings.auth_mode == "cognito":
        if not authorization or not authorization.startswith("Bearer "):
            raise auth_error("AUTHENTICATION_REQUIRED")
        return _cognito_subject(authorization.removeprefix("Bearer ").strip(), settings)
    if not settings.demo_auth_enabled:
        raise auth_error("AUTH_CONFIGURATION_INVALID", status.HTTP_503_SERVICE_UNAVAILABLE)
    if not demo_identity or len(demo_identity) > 255:
        raise auth_error("AUTHENTICATION_REQUIRED")
    return demo_identity


def _rows(session: Session, statement: str, parameters: dict[str, object]) -> list[dict[str, object]]:
    return [dict(row) for row in session.execute(text(statement), parameters).mappings().all()]


def resolve_tenant_scope(session: Session, subject: str) -> TenantScope:
    """Resolve the one server-selected active membership for an authenticated subject."""
    membership = _rows(
        session,
        """
        SELECT u.id AS actor_id, u.display_name, u.email, m.id AS membership_id,
               m.tenant_id, m.version, t.name AS tenant_name, t.lifecycle_state
        FROM platform_users AS u
        JOIN tenant_memberships AS m ON m.id = u.active_membership_id AND m.user_id = u.id
        JOIN tenants AS t ON t.id = m.tenant_id
        WHERE u.cognito_subject = :subject
          AND u.status = 'ACTIVE'
          AND m.status = 'ACTIVE'
          AND t.lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended')
        """,
        {"subject": subject},
    )
    if len(membership) != 1:
        raise auth_error("TENANT_ACCESS_DENIED", status.HTTP_403_FORBIDDEN)
    current = membership[0]
    membership_id = UUID(str(current["membership_id"]))
    tenant_id = UUID(str(current["tenant_id"]))
    branches = _rows(
        session,
        """
        SELECT b.id, b.name
        FROM membership_branches AS mb
        JOIN branches AS b ON b.id = mb.branch_id AND b.tenant_id = :tenant_id
        WHERE mb.membership_id = :membership_id
        ORDER BY b.name, b.id
        """,
        {"membership_id": str(membership_id), "tenant_id": str(tenant_id)},
    )
    if not branches:
        raise auth_error("BRANCH_ACCESS_DENIED", status.HTTP_403_FORBIDDEN)
    roles = _rows(
        session,
        """
        SELECT r.id, r.name, COALESCE(array_agg(rp.permission ORDER BY rp.permission)
               FILTER (WHERE rp.permission IS NOT NULL), '{}') AS permissions
        FROM membership_roles AS mr
        JOIN tenant_roles AS r ON r.id = mr.role_id AND r.tenant_id = :tenant_id AND r.status = 'ACTIVE'
        LEFT JOIN role_permissions AS rp ON rp.role_id = r.id
        WHERE mr.membership_id = :membership_id
        GROUP BY r.id, r.name
        ORDER BY r.name, r.id
        """,
        {"membership_id": str(membership_id), "tenant_id": str(tenant_id)},
    )
    parsed_branches = tuple(BranchScope(id=UUID(str(row["id"])), name=str(row["name"])) for row in branches)
    parsed_roles = tuple(
        (UUID(str(row["id"])), str(row["name"]), tuple(row["permissions"] or ())) for row in roles
    )
    return TenantScope(
        actor_id=UUID(str(current["actor_id"])),
        membership_id=membership_id,
        tenant_id=tenant_id,
        tenant_name=str(current["tenant_name"]),
        display_name=str(current["display_name"]),
        email=str(current["email"]),
        branch_ids=tuple(branch.id for branch in parsed_branches),
        branches=parsed_branches,
        role_ids=tuple(role[0] for role in parsed_roles),
        roles=parsed_roles,
        permissions=tuple(sorted({permission for _, _, permissions in parsed_roles for permission in permissions})),
        version=int(current["version"]),
        lifecycle_state=str(current["lifecycle_state"]),
        read_only=str(current["lifecycle_state"]) == "suspended",
    )


def resolve_emulated_tenant_scope(session: Session, subject: str, emulation_id: UUID) -> TenantScope:
    """Resolve a Superadmin-owned, active, read-only support emulation."""
    records = _rows(
        session,
        """
        SELECT e.id AS emulation_id, e.tenant_id, u.id AS actor_id, u.display_name, u.email,
               t.name AS tenant_name, t.lifecycle_state, b.id AS branch_id, b.name AS branch_name
        FROM support_emulations AS e
        JOIN platform_users AS u ON u.id = e.superadmin_id
        JOIN superadmins AS sa ON sa.user_id = u.id
        JOIN tenants AS t ON t.id = e.tenant_id
        JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary
        WHERE e.id = :emulation_id
          AND u.cognito_subject = :subject
          AND u.status = 'ACTIVE'
          AND e.status = 'ACTIVE'
          AND t.lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended')
        """,
        {"emulation_id": str(emulation_id), "subject": subject},
    )
    if len(records) != 1:
        raise auth_error("EMULATION_ACCESS_DENIED", status.HTTP_403_FORBIDDEN)
    record = records[0]
    branch = BranchScope(id=UUID(str(record["branch_id"])), name=str(record["branch_name"]))
    return TenantScope(
        actor_id=UUID(str(record["actor_id"])),
        membership_id=UUID(str(record["emulation_id"])),
        tenant_id=UUID(str(record["tenant_id"])),
        tenant_name=str(record["tenant_name"]),
        display_name=str(record["display_name"]),
        email=str(record["email"]),
        branch_ids=(branch.id,),
        branches=(branch,),
        role_ids=(),
        roles=(),
        permissions=(),
        version=1,
        lifecycle_state=str(record["lifecycle_state"]),
        actor_type="support_emulation",
        emulation_id=UUID(str(record["emulation_id"])),
        read_only=True,
    )


def tenant_scope(
    subject: str = Depends(authenticated_subject),
    session: Session = Depends(get_session),
    emulation_id: Annotated[UUID | None, Header(alias="x-workshopos-emulation-id")] = None,
) -> Generator[tuple[Session, TenantScope], None, None]:
    """Open a transaction after authorization and install the trusted RLS scope."""
    with session.begin():
        scope = resolve_emulated_tenant_scope(session, subject, emulation_id) if emulation_id else resolve_tenant_scope(session, subject)
        apply_rls_context(session, scope)
        yield session, scope


ScopedTenant = Annotated[tuple[Session, TenantScope], Depends(tenant_scope)]


def session_payload(scope: TenantScope) -> dict[str, object]:
    return {
        "actorType": scope.actor_type,
        "membership": {
            "id": str(scope.membership_id),
            "displayName": scope.display_name,
            "email": scope.email,
            "status": "READ_ONLY" if scope.read_only else "ACTIVE",
            "roleIds": [str(role_id) for role_id in scope.role_ids],
            "roles": [
                {"id": str(role_id), "name": name, "permissions": list(permissions)}
                for role_id, name, permissions in scope.roles
            ],
            "branchIds": [str(branch_id) for branch_id in scope.branch_ids],
            "branches": [{"id": str(branch.id), "name": branch.name} for branch in scope.branches],
            "permissions": list(scope.permissions),
            "version": scope.version,
        },
        "tenant": {"id": str(scope.tenant_id), "name": scope.tenant_name, "lifecycleState": scope.lifecycle_state},
        "emulation": None if not scope.emulation_id else {"id": str(scope.emulation_id), "readOnly": True},
    }
