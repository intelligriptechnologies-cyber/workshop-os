"""Platform-only Tenant provisioning, billing, and support-emulation API.

This module deliberately has no caller-supplied tenant authority.  A Tenant id
only identifies a record after the authenticated actor has been resolved as a
Superadmin by the server.
"""

from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import Annotated, Literal
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.auth import authenticated_subject, auth_error
from app.config import get_settings
from app.database import get_session
from app.tenant_admin import DEFAULT_ROLE_PERMISSIONS, DEFAULT_TENANT_ADMIN_PERMISSIONS, SYSTEM_ROLE_KEYS


router = APIRouter(prefix="/api/v1/superadmin", tags=["superadmin"])

LifecycleState = Literal["trial", "active", "payment_due", "suspended", "closed"]
BillingCycle = Literal["monthly", "quarterly", "annual"]
PaymentStatus = Literal["pending", "paid", "overdue", "waived"]

DEFAULT_TENANT_SETTINGS = {
    "templateVersion": 1,
    "business": {},
    "tax": {"mode": "gst", "defaultRate": 18},
    "fiscalYear": {"startMonth": 4},
    "numbering": {},
    "documentTemplates": {},
    "lifecycle": {},
    "checklists": {},
    "integrations": {"messaging": "not_connected", "payments": "not_connected", "accounting": "not_connected"},
}

DEFAULT_BRANCH_SETTINGS = {"templateVersion": 1, "operatingHours": {}, "checklists": {}}
ALLOWED_LIFECYCLE_TRANSITIONS: dict[str, frozenset[str]] = {
    "trial": frozenset({"active", "payment_due", "suspended", "closed"}),
    "active": frozenset({"payment_due", "suspended", "closed"}),
    "payment_due": frozenset({"active", "suspended", "closed"}),
    "suspended": frozenset({"active", "payment_due", "closed"}),
    "closed": frozenset(),
}


@dataclass(frozen=True)
class SuperadminScope:
    actor_id: UUID
    display_name: str
    email: str


class BillingFields(BaseModel):
    plan: Annotated[str, Field(min_length=1, max_length=100)]
    agreed_price: Annotated[Decimal, Field(ge=0, max_digits=12, decimal_places=2)]
    currency: Annotated[str, Field(min_length=3, max_length=3)] = "INR"
    billing_cycle: BillingCycle
    renewal_date: date
    due_date: date
    payment_status: PaymentStatus
    internal_notes: Annotated[str, Field(max_length=4000)] = ""


class ProvisionTenant(BillingFields):
    tenant_name: Annotated[str, Field(min_length=1, max_length=200)]
    primary_branch_name: Annotated[str, Field(min_length=1, max_length=200)]
    tenant_admin_name: Annotated[str, Field(min_length=1, max_length=200)]
    tenant_admin_email: Annotated[str, Field(min_length=3, max_length=320)]
    lifecycle_state: LifecycleState = "trial"


class UpdateBilling(BillingFields):
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


class UpdateLifecycle(BaseModel):
    lifecycle_state: LifecycleState
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


class StartEmulation(BaseModel):
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


class EndEmulation(BaseModel):
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


def _clean(value: str) -> str:
    value = value.strip()
    if not value:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="blank value")
    return value


def _rows(session: Session, statement: str, parameters: dict[str, object]) -> list[dict[str, object]]:
    return [dict(row) for row in session.execute(text(statement), parameters).mappings().all()]


def resolve_superadmin_scope(session: Session, subject: str) -> SuperadminScope:
    rows = _rows(
        session,
        """
        SELECT u.id, u.display_name, u.email
        FROM platform_users AS u
        JOIN superadmins AS sa ON sa.user_id = u.id
        WHERE u.cognito_subject = :subject AND u.status = 'ACTIVE'
        """,
        {"subject": subject},
    )
    if not rows and subject in get_settings().configured_superadmin_subjects:
        actor_id = uuid4()
        email = f"bootstrap-{actor_id}@platform.invalid"
        session.execute(
            text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, :subject, 'Platform Superadmin', :email)"),
            {"id": str(actor_id), "subject": subject, "email": email},
        )
        session.execute(text("INSERT INTO superadmins (user_id) VALUES (:id)"), {"id": str(actor_id)})
        return SuperadminScope(actor_id, "Platform Superadmin", email)
    if len(rows) != 1:
        raise auth_error("SUPERADMIN_ACCESS_DENIED", status.HTTP_403_FORBIDDEN)
    row = rows[0]
    return SuperadminScope(UUID(str(row["id"])), str(row["display_name"]), str(row["email"]))


def superadmin_scope(
    subject: str = Depends(authenticated_subject), session: Session = Depends(get_session)
):
    """Open a platform transaction only for a server-resolved Superadmin."""
    with session.begin():
        yield session, resolve_superadmin_scope(session, subject)


ScopedSuperadmin = Annotated[tuple[Session, SuperadminScope], Depends(superadmin_scope)]


def can_transition_lifecycle(current: str, target: str) -> bool:
    return target in ALLOWED_LIFECYCLE_TRANSITIONS.get(current, frozenset())


def _audit(
    session: Session,
    *,
    tenant_id: UUID,
    actor_id: UUID,
    action: str,
    reason: str,
    before: object,
    after: object,
) -> None:
    session.execute(
        text(
            """
            INSERT INTO tenant_audit_events (id, tenant_id, actor_id, action, reason, before_value, after_value)
            VALUES (:id, :tenant_id, :actor_id, :action, :reason, CAST(:before AS jsonb), CAST(:after AS jsonb))
            """
        ),
        {
            "id": str(uuid4()),
            "tenant_id": str(tenant_id),
            "actor_id": str(actor_id),
            "action": action,
            "reason": reason,
            "before": __import__("json").dumps(before, default=str),
            "after": __import__("json").dumps(after, default=str),
        },
    )


def _tenant_or_404(session: Session, tenant_id: UUID) -> dict[str, object]:
    rows = _rows(
        session,
        """
        SELECT t.id, t.name, t.lifecycle_state, t.created_at,
               b.id AS primary_branch_id, b.name AS primary_branch_name,
               pb.plan, pb.agreed_price, pb.currency, pb.billing_cycle, pb.renewal_date,
               pb.due_date, pb.payment_status, pb.internal_notes, pb.updated_at AS billing_updated_at
        FROM tenants AS t
        JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary
        LEFT JOIN platform_billing AS pb ON pb.tenant_id = t.id
        WHERE t.id = :tenant_id
        """,
        {"tenant_id": str(tenant_id)},
    )
    if len(rows) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "TENANT_NOT_FOUND"})
    return rows[0]


def _tenant_payload(row: dict[str, object]) -> dict[str, object]:
    billing = None
    if row["plan"] is not None:
        billing = {
            "plan": row["plan"], "agreedPrice": row["agreed_price"], "currency": row["currency"],
            "billingCycle": row["billing_cycle"], "renewalDate": row["renewal_date"], "dueDate": row["due_date"],
            "paymentStatus": row["payment_status"], "internalNotes": row["internal_notes"],
            "updatedAt": row["billing_updated_at"],
        }
    return {
        "id": str(row["id"]), "name": row["name"], "lifecycleState": row["lifecycle_state"],
        "createdAt": row["created_at"],
        "primaryBranch": {"id": str(row["primary_branch_id"]), "name": row["primary_branch_name"]},
        "platformBilling": billing,
    }


def _create_scoped_defaults(session: Session, tenant_id: UUID, branch_id: UUID, actor_id: UUID) -> None:
    """Insert baseline configuration through the same forced-RLS role as tenant APIs."""
    session.execute(text("SET LOCAL ROLE workshopos_runtime"))
    session.execute(
        text(
            "SELECT set_config('workshopos.tenant_id', :tenant_id, true), "
            "set_config('workshopos.branch_ids', :branch_ids, true), "
            "set_config('workshopos.read_only', 'false', true)"
        ),
        {"tenant_id": str(tenant_id), "branch_ids": "{" + str(branch_id) + "}"},
    )
    session.execute(
        text("INSERT INTO tenant_settings (tenant_id, settings, updated_by) VALUES (:tenant_id, CAST(:settings AS jsonb), :actor_id)"),
        {"tenant_id": str(tenant_id), "settings": __import__("json").dumps(DEFAULT_TENANT_SETTINGS), "actor_id": str(actor_id)},
    )
    session.execute(
        text("INSERT INTO branch_settings (tenant_id, branch_id, settings, updated_by) VALUES (:tenant_id, :branch_id, CAST(:settings AS jsonb), :actor_id)"),
        {"tenant_id": str(tenant_id), "branch_id": str(branch_id), "settings": __import__("json").dumps(DEFAULT_BRANCH_SETTINGS), "actor_id": str(actor_id)},
    )
    session.execute(text("RESET ROLE"))


@router.get("/tenants")
def list_tenants(scope: ScopedSuperadmin) -> dict[str, object]:
    session, _ = scope
    rows = _rows(
        session,
        """
        SELECT t.id, t.name, t.lifecycle_state, t.created_at, b.id AS primary_branch_id, b.name AS primary_branch_name,
               pb.plan, pb.agreed_price, pb.currency, pb.billing_cycle, pb.renewal_date, pb.due_date,
               pb.payment_status, pb.internal_notes, pb.updated_at AS billing_updated_at
        FROM tenants AS t JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary
        LEFT JOIN platform_billing AS pb ON pb.tenant_id = t.id
        ORDER BY t.created_at DESC, t.id DESC
        """,
        {},
    )
    return {"tenants": [_tenant_payload(row) for row in rows]}


@router.post("/tenants", status_code=status.HTTP_201_CREATED)
def provision_tenant(input: ProvisionTenant, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    tenant_id, branch_id, admin_id, membership_id, invitation_id = (uuid4() for _ in range(5))
    role_ids = {name: uuid4() for name in DEFAULT_ROLE_PERMISSIONS}
    tenant_name, branch_name = _clean(input.tenant_name), _clean(input.primary_branch_name)
    admin_name, admin_email = _clean(input.tenant_admin_name), _clean(input.tenant_admin_email).lower()
    session.execute(text("INSERT INTO tenants (id, name, lifecycle_state) VALUES (:id, :name, :state)"), {"id": str(tenant_id), "name": tenant_name, "state": input.lifecycle_state})
    session.execute(text("INSERT INTO branches (id, tenant_id, name, is_primary) VALUES (:id, :tenant_id, :name, true)"), {"id": str(branch_id), "tenant_id": str(tenant_id), "name": branch_name})
    session.execute(text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, NULL, :name, :email)"), {"id": str(admin_id), "name": admin_name, "email": admin_email})
    session.execute(text("INSERT INTO tenant_memberships (id, tenant_id, user_id, status) VALUES (:id, :tenant_id, :user_id, 'INVITED')"), {"id": str(membership_id), "tenant_id": str(tenant_id), "user_id": str(admin_id)})
    session.execute(text("INSERT INTO membership_branches (membership_id, branch_id, tenant_id) VALUES (:membership_id, :branch_id, :tenant_id)"), {"membership_id": str(membership_id), "branch_id": str(branch_id), "tenant_id": str(tenant_id)})
    for role_name, permissions in DEFAULT_ROLE_PERMISSIONS.items():
        role_id = role_ids[role_name]
        session.execute(
            text("INSERT INTO tenant_roles (id, tenant_id, name, description, system_key) VALUES (:id, :tenant_id, :name, :description, :system_key)"),
            {"id": str(role_id), "tenant_id": str(tenant_id), "name": role_name, "description": f"{role_name} workspace access", "system_key": SYSTEM_ROLE_KEYS[role_name]},
        )
        for permission in permissions:
            session.execute(text("INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)"), {"role_id": str(role_id), "permission": permission})
    session.execute(text("INSERT INTO membership_roles (membership_id, role_id, tenant_id) VALUES (:membership_id, :role_id, :tenant_id)"), {"membership_id": str(membership_id), "role_id": str(role_ids['Owner/Admin']), "tenant_id": str(tenant_id)})
    session.execute(text("INSERT INTO tenant_admin_invitations (id, tenant_id, membership_id, email, status, last_sent_at) VALUES (:id, :tenant_id, :membership_id, :email, 'PENDING', now())"), {"id": str(invitation_id), "tenant_id": str(tenant_id), "membership_id": str(membership_id), "email": admin_email})
    _create_scoped_defaults(session, tenant_id, branch_id, actor.actor_id)
    session.execute(text("INSERT INTO platform_billing (tenant_id, plan, agreed_price, currency, billing_cycle, renewal_date, due_date, payment_status, internal_notes, updated_by) VALUES (:tenant_id, :plan, :agreed_price, :currency, :billing_cycle, :renewal_date, :due_date, :payment_status, :internal_notes, :actor_id)"), {"tenant_id": str(tenant_id), **input.model_dump(include={"plan", "agreed_price", "currency", "billing_cycle", "renewal_date", "due_date", "payment_status", "internal_notes"}), "actor_id": str(actor.actor_id)})
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="TENANT_PROVISIONED", reason="Tenant provisioned", before={}, after={"primaryBranchId": str(branch_id), "tenantAdminInvitationId": str(invitation_id), "defaultsVersion": 1, "operationalDataCopied": False})
    payload = _tenant_payload(_tenant_or_404(session, tenant_id))
    payload["tenantAdminInvitation"] = {"id": str(invitation_id), "email": admin_email, "status": "PENDING"}
    return payload


@router.get("/tenants/{tenant_id}")
def get_tenant(tenant_id: UUID, scope: ScopedSuperadmin) -> dict[str, object]:
    session, _ = scope
    return _tenant_payload(_tenant_or_404(session, tenant_id))


@router.put("/tenants/{tenant_id}/billing")
def update_billing(tenant_id: UUID, input: UpdateBilling, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    before = _tenant_or_404(session, tenant_id)
    session.execute(text("UPDATE platform_billing SET plan=:plan, agreed_price=:agreed_price, currency=:currency, billing_cycle=:billing_cycle, renewal_date=:renewal_date, due_date=:due_date, payment_status=:payment_status, internal_notes=:internal_notes, updated_by=:actor_id, updated_at=now() WHERE tenant_id=:tenant_id"), {"tenant_id": str(tenant_id), "actor_id": str(actor.actor_id), **input.model_dump(exclude={"reason"})})
    after = _tenant_or_404(session, tenant_id)
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="PLATFORM_BILLING_UPDATED", reason=_clean(input.reason), before=_tenant_payload(before)["platformBilling"], after=_tenant_payload(after)["platformBilling"])
    return _tenant_payload(after)


@router.post("/tenants/{tenant_id}/lifecycle")
def update_lifecycle(tenant_id: UUID, input: UpdateLifecycle, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    before = _tenant_or_404(session, tenant_id)
    current = str(before["lifecycle_state"])
    if not can_transition_lifecycle(current, input.lifecycle_state):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "INVALID_LIFECYCLE_TRANSITION"})
    session.execute(text("UPDATE tenants SET lifecycle_state = :state WHERE id = :tenant_id"), {"state": input.lifecycle_state, "tenant_id": str(tenant_id)})
    after = _tenant_or_404(session, tenant_id)
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="TENANT_LIFECYCLE_CHANGED", reason=_clean(input.reason), before={"lifecycleState": current}, after={"lifecycleState": input.lifecycle_state})
    return _tenant_payload(after)


@router.post("/tenants/{tenant_id}/emulations", status_code=status.HTTP_201_CREATED)
def start_emulation(tenant_id: UUID, input: StartEmulation, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    tenant = _tenant_or_404(session, tenant_id)
    if tenant["lifecycle_state"] == "closed":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "EMULATION_CLOSED_TENANT"})
    existing = _rows(session, "SELECT id FROM support_emulations WHERE superadmin_id=:actor_id AND tenant_id=:tenant_id AND status='ACTIVE'", {"actor_id": str(actor.actor_id), "tenant_id": str(tenant_id)})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "EMULATION_ALREADY_ACTIVE"})
    emulation_id = uuid4()
    reason = _clean(input.reason)
    session.execute(text("INSERT INTO support_emulations (id, superadmin_id, tenant_id, status, reason) VALUES (:id, :actor_id, :tenant_id, 'ACTIVE', :reason)"), {"id": str(emulation_id), "actor_id": str(actor.actor_id), "tenant_id": str(tenant_id), "reason": reason})
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="SUPPORT_EMULATION_STARTED", reason=reason, before={}, after={"emulationId": str(emulation_id), "readOnly": True})
    return {"id": str(emulation_id), "tenantId": str(tenant_id), "status": "ACTIVE", "readOnly": True}


@router.post("/emulations/{emulation_id}/end")
def end_emulation(emulation_id: UUID, input: EndEmulation, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    rows = _rows(session, "SELECT tenant_id FROM support_emulations WHERE id=:id AND superadmin_id=:actor_id AND status='ACTIVE'", {"id": str(emulation_id), "actor_id": str(actor.actor_id)})
    if len(rows) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "ACTIVE_EMULATION_NOT_FOUND"})
    tenant_id = UUID(str(rows[0]["tenant_id"]))
    reason = _clean(input.reason)
    session.execute(text("UPDATE support_emulations SET status='ENDED', ended_at=now(), ended_reason=:reason WHERE id=:id"), {"id": str(emulation_id), "reason": reason})
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="SUPPORT_EMULATION_ENDED", reason=reason, before={"emulationId": str(emulation_id), "status": "ACTIVE"}, after={"emulationId": str(emulation_id), "status": "ENDED"})
    return {"id": str(emulation_id), "status": "ENDED"}


@router.get("/tenants/{tenant_id}/audit-events")
def list_audit_events(tenant_id: UUID, scope: ScopedSuperadmin) -> dict[str, object]:
    session, _ = scope
    _tenant_or_404(session, tenant_id)
    rows = _rows(session, "SELECT id, action, reason, before_value, after_value, created_at FROM tenant_audit_events WHERE tenant_id=:tenant_id ORDER BY created_at DESC, id DESC", {"tenant_id": str(tenant_id)})
    return {"events": [{"id": str(row["id"]), "action": row["action"], "reason": row["reason"], "before": row["before_value"], "after": row["after_value"], "createdAt": row["created_at"]} for row in rows]}
