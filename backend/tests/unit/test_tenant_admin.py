from uuid import UUID

import pytest

from app.tenancy import BranchScope, TenantScope
from app.tenant_admin import (
    DEFAULT_ROLE_PERMISSIONS,
    AssignmentError,
    require_distinct_membership,
    require_manager_remaining,
    require_owner_permissions,
    validate_assignment,
    validate_permissions,
)


def test_assignments_require_a_role_and_branch() -> None:
    role_id = UUID("00000000-0000-4000-8000-000000000031")
    branch_id = UUID("00000000-0000-4000-8000-000000000011")

    assert validate_assignment((role_id,), (branch_id,)) == ((role_id,), (branch_id,))
    with pytest.raises(AssignmentError, match="ROLE_ASSIGNMENT_REQUIRED"):
        validate_assignment((), (branch_id,))
    with pytest.raises(AssignmentError, match="BRANCH_ASSIGNMENT_REQUIRED"):
        validate_assignment((role_id,), ())


def test_only_declared_operational_permissions_can_be_assigned() -> None:
    assert validate_permissions(("tenant.users.read", "page.customers.read")) == (
        "page.customers.read",
        "tenant.users.read",
    )
    with pytest.raises(AssignmentError, match="INVALID_PERMISSION"):
        validate_permissions(("postgres.superuser",))
    assert validate_permissions(()) == ()


def test_assignment_rejects_duplicate_ids() -> None:
    role_id = UUID("00000000-0000-4000-8000-000000000031")
    branch_id = UUID("00000000-0000-4000-8000-000000000011")

    with pytest.raises(AssignmentError, match="DUPLICATE_ROLE_ASSIGNMENT"):
        validate_assignment((role_id, role_id), (branch_id,))
    with pytest.raises(AssignmentError, match="DUPLICATE_BRANCH_ASSIGNMENT"):
        validate_assignment((role_id,), (branch_id, branch_id))


def test_bootstrap_roles_match_the_existing_operational_role_labels() -> None:
    assert set(DEFAULT_ROLE_PERMISSIONS) == {
        "Owner/Admin", "Service Advisor", "Reception", "Accounts", "Store", "Technician",
    }
    assert "tenant.users.manage" in DEFAULT_ROLE_PERMISSIONS["Owner/Admin"]
    assert "page.work-update.write" in DEFAULT_ROLE_PERMISSIONS["Technician"]
    assert "page.follow-ups.write" in DEFAULT_ROLE_PERMISSIONS["Reception"]
    assert "page.follow-ups.write" in DEFAULT_ROLE_PERMISSIONS["Service Advisor"]
    assert "tenant.users.manage" not in DEFAULT_ROLE_PERMISSIONS["Service Advisor"]


def test_self_archive_and_final_tenant_admin_guards_fail_closed() -> None:
    actor_id = UUID("00000000-0000-4000-8000-000000000021")
    with pytest.raises(AssignmentError, match="CANNOT_ARCHIVE_SELF"):
        require_distinct_membership(actor_id, actor_id)
    require_distinct_membership(actor_id, UUID("00000000-0000-4000-8000-000000000022"))
    with pytest.raises(AssignmentError, match="LAST_TENANT_ADMIN"):
        require_manager_remaining(0)
    require_manager_remaining(1)


def test_owner_role_update_cannot_drop_tenant_admin_capabilities() -> None:
    require_owner_permissions(DEFAULT_ROLE_PERMISSIONS["Owner/Admin"])
    with pytest.raises(AssignmentError, match="SYSTEM_ROLE_PERMISSION_REQUIRED"):
        require_owner_permissions(("page.admin-console.read", "page.admin-console.write"))
