from datetime import date
from decimal import Decimal
from uuid import UUID

import pytest
from fastapi import HTTPException

from app.auth import session_payload
from app.superadmin import (
    DEFAULT_BRANCH_SETTINGS,
    DEFAULT_TENANT_ADMIN_PERMISSIONS,
    DEFAULT_TENANT_SETTINGS,
    ProvisionTenant,
    can_transition_lifecycle,
)
from app.tenancy import BranchScope, TenantScope, require_mutation_allowed


def test_provisioning_defaults_are_product_configuration_not_demo_records() -> None:
    prohibited = {"customers", "vehicles", "visits", "jobCards", "estimates", "invoices", "payments", "stock", "attachments"}
    assert DEFAULT_TENANT_SETTINGS["templateVersion"] == 1
    assert DEFAULT_TENANT_SETTINGS["integrations"] == {
        "messaging": "not_connected", "payments": "not_connected", "accounting": "not_connected"
    }
    assert not (set(DEFAULT_TENANT_SETTINGS) | set(DEFAULT_BRANCH_SETTINGS)) & prohibited
    assert "tenant.settings.write" in DEFAULT_TENANT_ADMIN_PERMISSIONS


def test_provision_request_requires_manual_billing_data() -> None:
    request = ProvisionTenant(
        tenant_name="North Workshop",
        primary_branch_name="North Main",
        tenant_admin_name="Asha Admin",
        tenant_admin_email="asha@example.test",
        plan="Growth",
        agreed_price=Decimal("2500.00"),
        billing_cycle="monthly",
        renewal_date=date(2026, 10, 1),
        due_date=date(2026, 10, 5),
        payment_status="pending",
    )
    assert request.lifecycle_state == "trial"
    assert request.agreed_price == Decimal("2500.00")


@pytest.mark.parametrize(
    ("current", "target", "expected"),
    [
        ("trial", "active", True),
        ("active", "payment_due", True),
        ("payment_due", "active", True),
        ("suspended", "active", True),
        ("closed", "active", False),
        ("active", "trial", False),
    ],
)
def test_lifecycle_transition_rules_preserve_closed_as_terminal(current: str, target: str, expected: bool) -> None:
    assert can_transition_lifecycle(current, target) is expected


def test_support_emulation_payload_is_visible_and_cannot_mutate() -> None:
    tenant_id = UUID("00000000-0000-4000-8000-000000000001")
    branch_id = UUID("00000000-0000-4000-8000-000000000011")
    emulation_id = UUID("00000000-0000-4000-8000-000000000099")
    scope = TenantScope(
        actor_id=UUID("00000000-0000-4000-8000-000000000021"),
        membership_id=emulation_id,
        tenant_id=tenant_id,
        tenant_name="North Workshop",
        display_name="Platform Support",
        email="support@example.test",
        branch_ids=(branch_id,),
        branches=(BranchScope(id=branch_id, name="North Main"),),
        role_ids=(), roles=(), permissions=(), version=1,
        actor_type="support_emulation", emulation_id=emulation_id, read_only=True,
    )
    payload = session_payload(scope)
    assert payload["actorType"] == "support_emulation"
    assert payload["emulation"] == {"id": str(emulation_id), "readOnly": True}
    assert payload["membership"]["status"] == "READ_ONLY"
    with pytest.raises(PermissionError, match="TENANT_READ_ONLY"):
        require_mutation_allowed(scope)
