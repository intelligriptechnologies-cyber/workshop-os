from uuid import UUID

import pytest

from app.auth import session_payload
from app.tenancy import BranchScope, TenantScope, branch_array_literal, require_branch


def scope() -> TenantScope:
    tenant_id = UUID("00000000-0000-4000-8000-000000000001")
    branch_id = UUID("00000000-0000-4000-8000-000000000011")
    role_id = UUID("00000000-0000-4000-8000-000000000031")
    return TenantScope(
        actor_id=UUID("00000000-0000-4000-8000-000000000021"),
        membership_id=UUID("00000000-0000-4000-8000-000000000041"),
        tenant_id=tenant_id,
        tenant_name="North Workshop",
        display_name="Reception User",
        email="reception@north.example",
        branch_ids=(branch_id,),
        branches=(BranchScope(id=branch_id, name="North Main"),),
        role_ids=(role_id,),
        roles=((role_id, "Reception", ("tenant.settings.read",)),),
        permissions=("tenant.settings.read",),
        version=3,
    )


def test_session_payload_contains_only_server_resolved_scope() -> None:
    payload = session_payload(scope())

    assert payload["actorType"] == "tenant_user"
    assert payload["tenant"] == {
        "id": "00000000-0000-4000-8000-000000000001",
        "name": "North Workshop",
        "lifecycleState": "active",
    }
    assert payload["membership"]["branchIds"] == ["00000000-0000-4000-8000-000000000011"]
    assert payload["membership"]["permissions"] == ["tenant.settings.read"]
    assert payload["emulation"] is None


def test_branch_scope_is_postgresql_safe_and_rejects_unassigned_branch() -> None:
    current = scope()
    assert branch_array_literal(current.branch_ids) == "{00000000-0000-4000-8000-000000000011}"
    require_branch(current, current.branch_ids[0])

    with pytest.raises(PermissionError, match="BRANCH_ACCESS_DENIED"):
        require_branch(current, UUID("00000000-0000-4000-8000-000000000012"))
