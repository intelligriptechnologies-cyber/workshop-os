from uuid import UUID

import pytest
from fastapi import HTTPException

from app.intake import _branch, _clean, _require_any
from app.tenancy import BranchScope, TenantScope


TENANT = UUID("00000000-0000-4000-8000-000000000061")
ACTOR = UUID("00000000-0000-4000-8000-000000000062")
BRANCH = UUID("00000000-0000-4000-8000-000000000063")
OTHER_BRANCH = UUID("00000000-0000-4000-8000-000000000064")


def _scope(*permissions: str, branches: tuple[UUID, ...] = (BRANCH,), actor_type: str = "tenant_user"):
    current = TenantScope(
        actor_id=ACTOR, membership_id=UUID("00000000-0000-4000-8000-000000000065"), tenant_id=TENANT,
        tenant_name="Workshop", display_name="Reception", email="reception@example.test", branch_ids=branches,
        branches=tuple(BranchScope(id=branch, name=str(branch)) for branch in branches), role_ids=(), roles=(),
        permissions=permissions, version=1, actor_type=actor_type,
    )
    return object(), current


def test_single_branch_is_selected_only_when_server_scope_is_unambiguous() -> None:
    assert _branch(_scope()[1], None) == BRANCH
    with pytest.raises(HTTPException) as raised:
        _branch(_scope(branches=(BRANCH, OTHER_BRANCH))[1], None)
    assert raised.value.detail["code"] == "BRANCH_REQUIRED"


def test_caller_cannot_select_branch_outside_membership() -> None:
    with pytest.raises(HTTPException) as raised:
        _branch(_scope()[1], OTHER_BRANCH)
    assert raised.value.detail["code"] == "BRANCH_ACCESS_DENIED"


def test_existing_service_queue_permission_allows_intake_but_not_unrelated_roles() -> None:
    assert _require_any(_scope("page.my-queue.write"), ("page.customers.write", "page.my-queue.write"), mutation=True).actor_id == ACTOR
    with pytest.raises(HTTPException) as raised:
        _require_any(_scope("page.stock.write"), ("page.customers.write", "page.my-queue.write"), mutation=True)
    assert raised.value.detail["code"] == "PERMISSION_DENIED"


def test_support_emulation_can_read_but_never_mutate() -> None:
    _require_any(_scope(actor_type="support_emulation"), ("page.customers.read",))
    with pytest.raises(HTTPException) as raised:
        _require_any(_scope(actor_type="support_emulation"), ("page.customers.write",), mutation=True)
    assert raised.value.detail["code"] == "TENANT_READ_ONLY"


def test_blank_input_has_a_stable_client_safe_error() -> None:
    with pytest.raises(HTTPException) as raised:
        _clean("   ")
    assert raised.value.detail["code"] == "INVALID_INTAKE_INPUT"
