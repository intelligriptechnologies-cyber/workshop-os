"""Tenant-scoped user, role, and branch-assignment administration.

The browser's Admin Console is a convenience surface only.  This router keeps
the authority boundary on the server: the authenticated membership selects the
Tenant, and every target record is constrained to that Tenant before mutation.
"""

from collections.abc import Iterable
from typing import Annotated, Literal
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.tenancy import TenantScope, require_mutation_allowed


router = APIRouter(prefix="/api/v1/admin", tags=["tenant administration"])

PageKey = Literal[
    "receive-vehicle", "today-queue", "customers", "vehicles", "search", "my-queue", "job-card",
    "estimate", "follow-ups", "media", "material-requests", "issue-material", "reconcile", "stock",
    "approvals", "inward-purchases", "my-tasks", "work-update", "qc-prep", "ready-to-invoice",
    "invoice", "payment", "delivery", "dashboard", "data-flow", "jobs", "manage", "admin-console",
]

UI_ROLE_PAGES: dict[str, tuple[PageKey, ...]] = {
    "Owner/Admin": (
        "dashboard", "approvals", "data-flow", "jobs", "media", "inward-purchases", "manage", "search",
        "admin-console", "material-requests", "issue-material", "reconcile", "stock", "estimate", "follow-ups",
    ),
    "Service Advisor": ("my-queue", "job-card", "estimate", "follow-ups", "media", "search"),
    "Reception": ("today-queue", "customers", "vehicles", "follow-ups", "search"),
    "Accounts": ("ready-to-invoice", "invoice", "payment", "delivery", "search"),
    "Store": ("material-requests", "issue-material", "reconcile", "stock", "inward-purchases", "search"),
    "Technician": ("my-tasks", "work-update", "qc-prep", "search"),
}

SYSTEM_ROLE_KEYS = {
    "Owner/Admin": "admin",
    "Service Advisor": "service",
    "Reception": "reception",
    "Accounts": "accounts",
    "Store": "store",
    "Technician": "tech",
}

BASE_PERMISSION_SET = frozenset({
    "tenant.settings.read", "tenant.settings.write", "branch.settings.read", "branch.settings.write",
    "tenant.users.read", "tenant.users.manage",
})
PAGE_PERMISSION_SET = frozenset(
    f"page.{page}.{verb}" for pages in UI_ROLE_PAGES.values() for page in pages for verb in ("read", "write")
)
OPERATIONAL_PERMISSION_SET = BASE_PERMISSION_SET | PAGE_PERMISSION_SET


def _page_permissions(pages: Iterable[PageKey], *, write: bool) -> tuple[str, ...]:
    permissions = {f"page.{page}.read" for page in pages}
    if write:
        permissions |= {f"page.{page}.write" for page in pages}
    return tuple(sorted(permissions))


DEFAULT_ROLE_PERMISSIONS: dict[str, tuple[str, ...]] = {
    name: tuple(sorted(set(_page_permissions(pages, write=True)) | (
        BASE_PERMISSION_SET if name == "Owner/Admin" else set()
    )))
    for name, pages in UI_ROLE_PAGES.items()
}
DEFAULT_TENANT_ADMIN_PERMISSIONS = DEFAULT_ROLE_PERMISSIONS["Owner/Admin"]


class AssignmentError(ValueError):
    """A stable, client-safe code for invalid role or branch assignment input."""


def validate_assignment(role_ids: tuple[UUID, ...], branch_ids: tuple[UUID, ...]) -> tuple[tuple[UUID, ...], tuple[UUID, ...]]:
    if not role_ids:
        raise AssignmentError("ROLE_ASSIGNMENT_REQUIRED")
    if not branch_ids:
        raise AssignmentError("BRANCH_ASSIGNMENT_REQUIRED")
    if len(set(role_ids)) != len(role_ids):
        raise AssignmentError("DUPLICATE_ROLE_ASSIGNMENT")
    if len(set(branch_ids)) != len(branch_ids):
        raise AssignmentError("DUPLICATE_BRANCH_ASSIGNMENT")
    return tuple(role_ids), tuple(branch_ids)


def validate_permissions(permissions: tuple[str, ...]) -> tuple[str, ...]:
    cleaned = tuple(sorted({permission.strip() for permission in permissions if permission.strip()}))
    if any(permission not in OPERATIONAL_PERMISSION_SET for permission in cleaned):
        raise AssignmentError("INVALID_PERMISSION")
    return cleaned


def require_distinct_membership(actor_id: UUID, target_user_id: UUID) -> None:
    if actor_id == target_user_id:
        raise AssignmentError("CANNOT_ARCHIVE_SELF")


def require_manager_remaining(manager_count: int) -> None:
    if manager_count == 0:
        raise AssignmentError("LAST_TENANT_ADMIN")


def require_owner_permissions(permissions: tuple[str, ...]) -> None:
    if not set(DEFAULT_TENANT_ADMIN_PERMISSIONS) <= set(permissions):
        raise AssignmentError("SYSTEM_ROLE_PERMISSION_REQUIRED")


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class UserCreate(ApiModel):
    name: Annotated[str, Field(min_length=1, max_length=200)]
    email: Annotated[str, Field(min_length=3, max_length=320)]
    role_ids: tuple[UUID, ...] = Field(alias="roleIds")
    branch_ids: tuple[UUID, ...] = Field(alias="branchIds")


class UserUpdate(ApiModel):
    name: Annotated[str, Field(min_length=1, max_length=200)]
    role_ids: tuple[UUID, ...] = Field(alias="roleIds")
    branch_ids: tuple[UUID, ...] = Field(alias="branchIds")
    version: Annotated[int, Field(ge=1)]


class ArchiveUser(ApiModel):
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


class RoleCreate(ApiModel):
    name: Annotated[str, Field(min_length=1, max_length=100)]
    description: Annotated[str, Field(max_length=1000)] = ""
    permissions: tuple[str, ...]


class RoleUpdate(RoleCreate):
    version: Annotated[int, Field(ge=1)]


def _clean(value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise AssignmentError("BLANK_VALUE")
    return cleaned


def _rows(session, statement: str, parameters: dict[str, object]) -> list[dict[str, object]]:
    return [dict(row) for row in session.execute(text(statement), parameters).mappings().all()]


def _require(scope: ScopedTenant, permission: str, *, mutation: bool = False) -> TenantScope:
    _, current = scope
    if current.actor_type == "support_emulation":
        if mutation:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN)
        return current
    if permission not in current.permissions:
        raise auth_error("PERMISSION_DENIED", status.HTTP_403_FORBIDDEN)
    if mutation:
        try:
            require_mutation_allowed(current)
        except PermissionError as error:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
    return current


def _audit(session, current: TenantScope, action: str, reason: str, before: object, after: object) -> None:
    session.execute(
        text("""
            INSERT INTO tenant_audit_events (id, tenant_id, actor_id, action, reason, before_value, after_value)
            VALUES (:id, :tenant_id, :actor_id, :action, :reason, CAST(:before AS jsonb), CAST(:after AS jsonb))
        """),
        {
            "id": str(uuid4()), "tenant_id": str(current.tenant_id), "actor_id": str(current.actor_id),
            "action": action, "reason": reason,
            "before": __import__("json").dumps(before, default=str), "after": __import__("json").dumps(after, default=str),
        },
    )


def _roles(session, tenant_id: UUID) -> list[dict[str, object]]:
    rows = _rows(session, """
        SELECT r.id, r.name, r.description, r.status, r.version, r.system_key, r.created_at, r.updated_at,
               COALESCE(array_agg(rp.permission ORDER BY rp.permission) FILTER (WHERE rp.permission IS NOT NULL), '{}') AS permissions
        FROM tenant_roles AS r LEFT JOIN role_permissions AS rp ON rp.role_id = r.id
        WHERE r.tenant_id = :tenant_id GROUP BY r.id ORDER BY r.name, r.id
    """, {"tenant_id": str(tenant_id)})
    return [{
        "id": str(row["id"]), "name": row["name"], "description": row["description"], "status": row["status"],
        "version": row["version"], "systemKey": row["system_key"], "permissions": list(row["permissions"] or ()),
        "createdAt": row["created_at"], "updatedAt": row["updated_at"],
    } for row in rows]


def _branches(session, tenant_id: UUID) -> list[dict[str, object]]:
    return [{"id": str(row["id"]), "name": row["name"]} for row in _rows(
        session, "SELECT id, name FROM branches WHERE tenant_id = :tenant_id ORDER BY name, id", {"tenant_id": str(tenant_id)}
    )]


def _membership_or_404(session, tenant_id: UUID, membership_id: UUID) -> dict[str, object]:
    rows = _rows(session, """
        SELECT m.id AS membership_id, m.tenant_id, m.user_id, m.status, m.version, m.created_at, m.updated_at,
               u.display_name, u.email, i.created_at AS invited_at, i.last_sent_at
        FROM tenant_memberships AS m JOIN platform_users AS u ON u.id = m.user_id
        LEFT JOIN tenant_admin_invitations AS i ON i.membership_id = m.id
        WHERE m.id = :membership_id AND m.tenant_id = :tenant_id
    """, {"membership_id": str(membership_id), "tenant_id": str(tenant_id)})
    if len(rows) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "USER_NOT_FOUND"})
    return rows[0]


def _user_payload(session, tenant_id: UUID, row: dict[str, object]) -> dict[str, object]:
    membership_id = str(row["membership_id"])
    role_rows = _rows(session, """
        SELECT r.id, r.name, COALESCE(array_agg(rp.permission ORDER BY rp.permission) FILTER (WHERE rp.permission IS NOT NULL), '{}') AS permissions
        FROM membership_roles AS mr JOIN tenant_roles AS r ON r.id = mr.role_id
        LEFT JOIN role_permissions AS rp ON rp.role_id = r.id
        WHERE mr.membership_id = :membership_id AND mr.tenant_id = :tenant_id
        GROUP BY r.id ORDER BY r.name, r.id
    """, {"membership_id": membership_id, "tenant_id": str(tenant_id)})
    branch_rows = _rows(session, """
        SELECT b.id, b.name FROM membership_branches AS mb JOIN branches AS b ON b.id = mb.branch_id
        WHERE mb.membership_id = :membership_id AND mb.tenant_id = :tenant_id ORDER BY b.name, b.id
    """, {"membership_id": membership_id, "tenant_id": str(tenant_id)})
    roles = [{"id": str(item["id"]), "name": item["name"], "permissions": list(item["permissions"] or ())} for item in role_rows]
    branches = [{"id": str(item["id"]), "name": item["name"]} for item in branch_rows]
    return {
        "id": membership_id, "name": row["display_name"], "email": row["email"], "status": row["status"],
        "roleIds": [item["id"] for item in roles], "roles": roles,
        "branchIds": [item["id"] for item in branches], "branches": branches,
        "version": row["version"], "invitedAt": row["invited_at"], "lastInvitedAt": row["last_sent_at"],
        "createdAt": row["created_at"], "updatedAt": row["updated_at"],
    }


def _directory(session, tenant_id: UUID) -> dict[str, object]:
    memberships = _rows(session, """
        SELECT m.id AS membership_id, m.tenant_id, m.user_id, m.status, m.version, m.created_at, m.updated_at,
               u.display_name, u.email, i.created_at AS invited_at, i.last_sent_at
        FROM tenant_memberships AS m JOIN platform_users AS u ON u.id = m.user_id
        LEFT JOIN tenant_admin_invitations AS i ON i.membership_id = m.id
        WHERE m.tenant_id = :tenant_id ORDER BY u.display_name, m.id
    """, {"tenant_id": str(tenant_id)})
    return {"users": [_user_payload(session, tenant_id, row) for row in memberships], "roles": _roles(session, tenant_id), "branches": _branches(session, tenant_id)}


def _assert_assignments_belong_to_tenant(session, tenant_id: UUID, role_ids: tuple[UUID, ...], branch_ids: tuple[UUID, ...]) -> None:
    known_roles = {UUID(str(row["id"])) for row in _rows(session, "SELECT id FROM tenant_roles WHERE tenant_id = :tenant_id AND status = 'ACTIVE'", {"tenant_id": str(tenant_id)})}
    known_branches = {UUID(str(row["id"])) for row in _rows(session, "SELECT id FROM branches WHERE tenant_id = :tenant_id", {"tenant_id": str(tenant_id)})}
    if not set(role_ids) <= known_roles:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": "ROLE_NOT_IN_TENANT"})
    if not set(branch_ids) <= known_branches:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": "BRANCH_NOT_IN_TENANT"})


def _replace_assignments(session, tenant_id: UUID, membership_id: UUID, role_ids: tuple[UUID, ...], branch_ids: tuple[UUID, ...]) -> None:
    session.execute(text("DELETE FROM membership_roles WHERE membership_id = :membership_id AND tenant_id = :tenant_id"), {"membership_id": str(membership_id), "tenant_id": str(tenant_id)})
    session.execute(text("DELETE FROM membership_branches WHERE membership_id = :membership_id AND tenant_id = :tenant_id"), {"membership_id": str(membership_id), "tenant_id": str(tenant_id)})
    for role_id in role_ids:
        session.execute(text("INSERT INTO membership_roles (membership_id, role_id, tenant_id) VALUES (:membership_id, :role_id, :tenant_id)"), {"membership_id": str(membership_id), "role_id": str(role_id), "tenant_id": str(tenant_id)})
    for branch_id in branch_ids:
        session.execute(text("INSERT INTO membership_branches (membership_id, branch_id, tenant_id) VALUES (:membership_id, :branch_id, :tenant_id)"), {"membership_id": str(membership_id), "branch_id": str(branch_id), "tenant_id": str(tenant_id)})


def _assert_manager_remains(session, tenant_id: UUID) -> None:
    count = session.execute(text("""
        SELECT count(DISTINCT m.id) FROM tenant_memberships AS m
        JOIN membership_roles AS mr ON mr.membership_id = m.id AND mr.tenant_id = m.tenant_id
        JOIN role_permissions AS rp ON rp.role_id = mr.role_id AND rp.permission = 'tenant.users.manage'
        WHERE m.tenant_id = :tenant_id AND m.status IN ('ACTIVE', 'INVITED')
    """), {"tenant_id": str(tenant_id)}).scalar_one()
    try:
        require_manager_remaining(count)
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": str(error)}) from error


@router.get("/users")
def list_users(scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.read")
    return _directory(session, current.tenant_id)


@router.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(input: UserCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    try:
        role_ids, branch_ids = validate_assignment(input.role_ids, input.branch_ids)
        name, email = _clean(input.name), _clean(input.email).lower()
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    _assert_assignments_belong_to_tenant(session, current.tenant_id, role_ids, branch_ids)
    existing = _rows(session, "SELECT id FROM platform_users WHERE lower(email) = :email", {"email": email})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "EMAIL_ALREADY_REGISTERED"})
    user_id, membership_id, invitation_id = uuid4(), uuid4(), uuid4()
    session.execute(text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, NULL, :name, :email)"), {"id": str(user_id), "name": name, "email": email})
    session.execute(text("INSERT INTO tenant_memberships (id, tenant_id, user_id, status) VALUES (:id, :tenant_id, :user_id, 'INVITED')"), {"id": str(membership_id), "tenant_id": str(current.tenant_id), "user_id": str(user_id)})
    _replace_assignments(session, current.tenant_id, membership_id, role_ids, branch_ids)
    session.execute(text("INSERT INTO tenant_admin_invitations (id, tenant_id, membership_id, email, status, last_sent_at) VALUES (:id, :tenant_id, :membership_id, :email, 'PENDING', now())"), {"id": str(invitation_id), "tenant_id": str(current.tenant_id), "membership_id": str(membership_id), "email": email})
    row = _membership_or_404(session, current.tenant_id, membership_id)
    payload = _user_payload(session, current.tenant_id, row)
    _audit(session, current, "TENANT_USER_INVITED", "Tenant user invited", {}, {"membershipId": payload["id"], "roleIds": payload["roleIds"], "branchIds": payload["branchIds"]})
    return {"user": payload}


@router.patch("/users/{membership_id}")
def update_user(membership_id: UUID, input: UserUpdate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    try:
        role_ids, branch_ids = validate_assignment(input.role_ids, input.branch_ids)
        name = _clean(input.name)
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    _assert_assignments_belong_to_tenant(session, current.tenant_id, role_ids, branch_ids)
    before = _membership_or_404(session, current.tenant_id, membership_id)
    updated = session.execute(text("""
        UPDATE tenant_memberships SET version = version + 1, updated_at = now()
        WHERE id = :membership_id AND tenant_id = :tenant_id AND version = :version
    """), {"membership_id": str(membership_id), "tenant_id": str(current.tenant_id), "version": input.version})
    if updated.rowcount != 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "VERSION_CONFLICT"})
    session.execute(text("UPDATE platform_users SET display_name = :name, updated_at = now() WHERE id = :user_id"), {"name": name, "user_id": str(before["user_id"])})
    _replace_assignments(session, current.tenant_id, membership_id, role_ids, branch_ids)
    _assert_manager_remains(session, current.tenant_id)
    row = _membership_or_404(session, current.tenant_id, membership_id)
    payload = _user_payload(session, current.tenant_id, row)
    _audit(session, current, "TENANT_USER_UPDATED", "Tenant user assignments updated", {"membershipId": str(membership_id), "version": before["version"]}, {"roleIds": payload["roleIds"], "branchIds": payload["branchIds"], "version": payload["version"]})
    return {"user": payload}


@router.post("/users/{membership_id}/archive")
def archive_user(membership_id: UUID, input: ArchiveUser, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    before = _membership_or_404(session, current.tenant_id, membership_id)
    try:
        require_distinct_membership(current.actor_id, UUID(str(before["user_id"])))
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    if before["status"] == "ARCHIVED":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "USER_ALREADY_ARCHIVED"})
    session.execute(text("UPDATE tenant_memberships SET status = 'ARCHIVED', version = version + 1, updated_at = now() WHERE id = :membership_id AND tenant_id = :tenant_id"), {"membership_id": str(membership_id), "tenant_id": str(current.tenant_id)})
    session.execute(text("UPDATE platform_users SET active_membership_id = NULL, updated_at = now() WHERE id = :user_id AND active_membership_id = :membership_id"), {"user_id": str(before["user_id"]), "membership_id": str(membership_id)})
    _assert_manager_remains(session, current.tenant_id)
    row = _membership_or_404(session, current.tenant_id, membership_id)
    payload = _user_payload(session, current.tenant_id, row)
    _audit(session, current, "TENANT_USER_ARCHIVED", input.reason.strip(), {"membershipId": str(membership_id), "status": before["status"]}, {"status": "ARCHIVED"})
    return {"user": payload}


@router.post("/users/{membership_id}/resend-invite")
def resend_invite(membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    before = _membership_or_404(session, current.tenant_id, membership_id)
    if before["status"] != "INVITED":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "INVITATION_NOT_PENDING"})
    result = session.execute(text("UPDATE tenant_admin_invitations SET last_sent_at = now() WHERE membership_id = :membership_id AND tenant_id = :tenant_id AND status = 'PENDING'"), {"membership_id": str(membership_id), "tenant_id": str(current.tenant_id)})
    if result.rowcount != 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "INVITATION_NOT_PENDING"})
    row = _membership_or_404(session, current.tenant_id, membership_id)
    payload = _user_payload(session, current.tenant_id, row)
    _audit(session, current, "TENANT_USER_INVITATION_RESENT", "Tenant user invitation resent", {"membershipId": str(membership_id)}, {"lastInvitedAt": payload["lastInvitedAt"]})
    return {"user": payload}


@router.get("/roles")
def list_roles(scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.read")
    return {"roles": _roles(session, current.tenant_id)}


@router.post("/roles", status_code=status.HTTP_201_CREATED)
def create_role(input: RoleCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    try:
        name, description, permissions = _clean(input.name), input.description.strip(), validate_permissions(input.permissions)
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    if _rows(session, "SELECT id FROM tenant_roles WHERE tenant_id = :tenant_id AND name = :name", {"tenant_id": str(current.tenant_id), "name": name}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "ROLE_NAME_CONFLICT"})
    role_id = uuid4()
    session.execute(text("INSERT INTO tenant_roles (id, tenant_id, name, description) VALUES (:id, :tenant_id, :name, :description)"), {"id": str(role_id), "tenant_id": str(current.tenant_id), "name": name, "description": description})
    for permission in permissions:
        session.execute(text("INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)"), {"role_id": str(role_id), "permission": permission})
    role = next(role for role in _roles(session, current.tenant_id) if role["id"] == str(role_id))
    _audit(session, current, "TENANT_ROLE_CREATED", "Tenant role created", {}, {"roleId": role["id"], "permissions": role["permissions"]})
    return {"role": role}


@router.patch("/roles/{role_id}")
def update_role(role_id: UUID, input: RoleUpdate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    try:
        name, description, permissions = _clean(input.name), input.description.strip(), validate_permissions(input.permissions)
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    rows = _rows(session, "SELECT id, system_key, version FROM tenant_roles WHERE id = :role_id AND tenant_id = :tenant_id", {"role_id": str(role_id), "tenant_id": str(current.tenant_id)})
    if len(rows) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "ROLE_NOT_FOUND"})
    if rows[0]["system_key"] == "admin":
        try:
            require_owner_permissions(permissions)
        except AssignmentError as error:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    changed = session.execute(text("""
        UPDATE tenant_roles SET name = :name, description = :description, version = version + 1, updated_at = now()
        WHERE id = :role_id AND tenant_id = :tenant_id AND version = :version
    """), {"name": name, "description": description, "role_id": str(role_id), "tenant_id": str(current.tenant_id), "version": input.version})
    if changed.rowcount != 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "VERSION_CONFLICT"})
    session.execute(text("DELETE FROM role_permissions WHERE role_id = :role_id"), {"role_id": str(role_id)})
    for permission in permissions:
        session.execute(text("INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)"), {"role_id": str(role_id), "permission": permission})
    _assert_manager_remains(session, current.tenant_id)
    role = next(role for role in _roles(session, current.tenant_id) if role["id"] == str(role_id))
    _audit(session, current, "TENANT_ROLE_UPDATED", "Tenant role permissions updated", {"roleId": str(role_id)}, {"permissions": role["permissions"], "version": role["version"]})
    return {"role": role}


@router.post("/roles/{role_id}/archive")
def archive_role(role_id: UUID, input: ArchiveUser, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    rows = _rows(session, "SELECT id, name, system_key, status FROM tenant_roles WHERE id = :role_id AND tenant_id = :tenant_id", {"role_id": str(role_id), "tenant_id": str(current.tenant_id)})
    if len(rows) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "ROLE_NOT_FOUND"})
    role = rows[0]
    if role["system_key"] == "admin":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "SYSTEM_ROLE_PROTECTED"})
    if role["status"] == "ARCHIVED":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "ROLE_ALREADY_ARCHIVED"})
    assigned = session.execute(text("SELECT count(*) FROM membership_roles WHERE role_id = :role_id AND tenant_id = :tenant_id"), {"role_id": str(role_id), "tenant_id": str(current.tenant_id)}).scalar_one()
    if assigned:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "ROLE_IN_USE"})
    session.execute(text("UPDATE tenant_roles SET status = 'ARCHIVED', version = version + 1, updated_at = now() WHERE id = :role_id AND tenant_id = :tenant_id"), {"role_id": str(role_id), "tenant_id": str(current.tenant_id)})
    archived = next(item for item in _roles(session, current.tenant_id) if item["id"] == str(role_id))
    _audit(session, current, "TENANT_ROLE_ARCHIVED", input.reason.strip(), {"roleId": str(role_id), "name": role["name"]}, {"status": "ARCHIVED"})
    return {"role": archived}
