"""Trusted request scope and PostgreSQL RLS transaction helpers.

The values in this module are derived from a server-side membership.  They are
never accepted from an API path, query string, or request body.
"""

from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.orm import Session


@dataclass(frozen=True)
class BranchScope:
    id: UUID
    name: str


@dataclass(frozen=True)
class TenantScope:
    actor_id: UUID
    membership_id: UUID
    tenant_id: UUID
    tenant_name: str
    display_name: str
    email: str
    branch_ids: tuple[UUID, ...]
    branches: tuple[BranchScope, ...]
    role_ids: tuple[UUID, ...]
    roles: tuple[tuple[UUID, str, tuple[str, ...]], ...]
    permissions: tuple[str, ...]
    version: int
    lifecycle_state: str = "active"
    actor_type: str = "tenant_user"
    emulation_id: UUID | None = None
    read_only: bool = False


def branch_array_literal(branch_ids: tuple[UUID, ...]) -> str:
    """Return a PostgreSQL UUID array literal composed only from server UUIDs."""
    return "{" + ",".join(str(branch_id) for branch_id in branch_ids) + "}"


def apply_rls_context(session: Session, scope: TenantScope) -> None:
    """Set transaction-local, trusted RLS settings before any Tenant query runs."""
    # Migrations use the admin role, but request queries must never run as a
    # table owner or BYPASSRLS role.  The fixed role is created and granted the
    # minimum Tenant-table privileges by the tenancy migration.
    session.execute(text("SET LOCAL ROLE workshopos_runtime"))
    session.execute(
        text(
            "SELECT "
            "set_config('workshopos.actor_id', :actor_id, true), "
            "set_config('workshopos.tenant_id', :tenant_id, true), "
            "set_config('workshopos.branch_ids', :branch_ids, true), "
            "set_config('workshopos.read_only', :read_only, true)"
        ),
        {
            "actor_id": str(scope.actor_id),
            "tenant_id": str(scope.tenant_id),
            "branch_ids": branch_array_literal(scope.branch_ids),
            "read_only": "true" if scope.read_only else "false",
        },
    )


def require_branch(scope: TenantScope, branch_id: UUID) -> None:
    if branch_id not in scope.branch_ids:
        raise PermissionError("BRANCH_ACCESS_DENIED")


def require_mutation_allowed(scope: TenantScope) -> None:
    """Reject tenant writes for suspended tenants and support emulation."""
    if scope.read_only:
        raise PermissionError("TENANT_READ_ONLY")
