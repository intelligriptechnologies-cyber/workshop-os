"""PostgreSQL acceptance coverage for Superadmin Tenant management.

This deliberately exercises the HTTP and database boundaries together: only a
real PostgreSQL runtime role can prove that read-only support sessions cannot
write through row-level security.
"""

from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError

from app.tenancy import BranchScope, TenantScope, apply_rls_context


SUPERADMIN_SUBJECT = "platform-superadmin"


def _reset_database() -> None:
    from app.database import get_engine

    with get_engine().begin() as connection:
        # These are the two roots of all tenant-owned and identity-owned data.
        # CASCADE keeps this acceptance test independent from the order in which
        # the other integration tests execute as migrations add new tables.
        connection.execute(text("TRUNCATE TABLE tenants CASCADE"))
        connection.execute(text("TRUNCATE TABLE platform_users CASCADE"))
        connection.execute(
            text(
                "INSERT INTO platform_users (id, cognito_subject, display_name, email) "
                "VALUES (gen_random_uuid(), :subject, 'Platform Admin', 'platform@example.test')"
            ),
            {"subject": SUPERADMIN_SUBJECT},
        )
        connection.execute(
            text(
                "INSERT INTO superadmins (user_id) "
                "SELECT id FROM platform_users WHERE cognito_subject=:subject"
            ),
            {"subject": SUPERADMIN_SUBJECT},
        )


def _provision(client: TestClient) -> dict[str, object]:
    response = client.post(
        "/api/v1/superadmin/tenants",
        headers={"x-workshopos-identity": SUPERADMIN_SUBJECT},
        json={
            "tenant_name": "North Workshop",
            "primary_branch_name": "North Main",
            "tenant_admin_name": "North Owner",
            "tenant_admin_email": "owner@north.example.test",
            "plan": "Growth",
            "agreed_price": "2500.00",
            "currency": "INR",
            "billing_cycle": "monthly",
            "renewal_date": "2026-10-01",
            "due_date": "2026-10-05",
            "payment_status": "pending",
            "internal_notes": "Initial platform agreement",
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def _read_only_scope(tenant: dict[str, object], emulation_id: str) -> TenantScope:
    primary_branch = tenant["primaryBranch"]
    branch_id = UUID(str(primary_branch["id"]))
    return TenantScope(
        actor_id=UUID("00000000-0000-4000-8000-000000000051"),
        membership_id=UUID(emulation_id),
        tenant_id=UUID(str(tenant["id"])),
        tenant_name=str(tenant["name"]),
        display_name="Platform Admin",
        email="platform@example.test",
        branch_ids=(branch_id,),
        branches=(BranchScope(id=branch_id, name=str(primary_branch["name"])),),
        role_ids=(),
        roles=(),
        permissions=(),
        version=1,
        lifecycle_state="suspended",
        actor_type="support_emulation",
        emulation_id=UUID(emulation_id),
        read_only=True,
    )


@pytest.mark.integration
def test_superadmin_provisions_audited_read_only_tenant_control_plane() -> None:
    _reset_database()
    from app.database import get_engine
    from app.main import app

    with TestClient(app) as client:
        tenant = _provision(client)
        tenant_id = str(tenant["id"])

        assert tenant["lifecycleState"] == "trial"
        assert tenant["tenantAdminInvitation"] == {
            "id": tenant["tenantAdminInvitation"]["id"],
            "email": "owner@north.example.test",
            "status": "PENDING",
        }
        assert tenant["platformBilling"]["agreedPrice"] == 2500

        with get_engine().connect() as connection:
            assert connection.execute(
                text("SELECT count(*) FROM branches WHERE tenant_id=:tenant_id"),
                {"tenant_id": tenant_id},
            ).scalar_one() == 1
            assert connection.execute(
                text("SELECT count(*) FROM branches WHERE tenant_id=:tenant_id AND is_primary"),
                {"tenant_id": tenant_id},
            ).scalar_one() == 1
            assert connection.execute(
                text("SELECT count(*) FROM tenant_admin_invitations WHERE tenant_id=:tenant_id AND status='PENDING'"),
                {"tenant_id": tenant_id},
            ).scalar_one() == 1
            assert connection.execute(
                text(
                    "SELECT count(*) FROM membership_roles AS mr "
                    "JOIN tenant_roles AS tr ON tr.id=mr.role_id "
                    "WHERE mr.tenant_id=:tenant_id AND tr.system_key='owner_admin'"
                ),
                {"tenant_id": tenant_id},
            ).scalar_one() == 1
            assert connection.execute(
                text("SELECT settings->>'templateVersion' FROM tenant_settings WHERE tenant_id=:tenant_id"),
                {"tenant_id": tenant_id},
            ).scalar_one() == "1"
            assert connection.execute(
                text("SELECT count(*) FROM job_cards WHERE tenant_id=:tenant_id"),
                {"tenant_id": tenant_id},
            ).scalar_one() == 0
            assert connection.execute(
                text("SELECT count(*) FROM stock_ledger WHERE tenant_id=:tenant_id"),
                {"tenant_id": tenant_id},
            ).scalar_one() == 0

        billing = client.put(
            f"/api/v1/superadmin/tenants/{tenant_id}/billing",
            headers={"x-workshopos-identity": SUPERADMIN_SUBJECT},
            json={
                "plan": "Scale",
                "agreed_price": "3000.00",
                "currency": "INR",
                "billing_cycle": "annual",
                "renewal_date": "2027-10-01",
                "due_date": "2027-10-05",
                "payment_status": "paid",
                "internal_notes": "Annual agreement",
                "reason": "Annual renewal",
            },
        )
        assert billing.status_code == 200, billing.text
        assert billing.json()["platformBilling"]["plan"] == "Scale"

        suspended = client.post(
            f"/api/v1/superadmin/tenants/{tenant_id}/lifecycle",
            headers={"x-workshopos-identity": SUPERADMIN_SUBJECT},
            json={"lifecycle_state": "suspended", "reason": "Manual billing review"},
        )
        assert suspended.status_code == 200, suspended.text
        assert suspended.json()["lifecycleState"] == "suspended"

        emulation = client.post(
            f"/api/v1/superadmin/tenants/{tenant_id}/emulations",
            headers={"x-workshopos-identity": SUPERADMIN_SUBJECT},
            json={"reason": "Investigate settings"},
        )
        assert emulation.status_code == 201, emulation.text
        emulation_id = emulation.json()["id"]
        emulated_headers = {
            "x-workshopos-identity": SUPERADMIN_SUBJECT,
            "x-workshopos-emulation-id": emulation_id,
        }
        session = client.get("/api/v1/session", headers=emulated_headers)
        assert session.status_code == 200, session.text
        assert session.json()["membership"]["status"] == "READ_ONLY"
        assert session.json()["emulation"] == {"id": emulation_id, "readOnly": True}
        read = client.get("/api/v1/tenant/settings", headers=emulated_headers)
        assert read.status_code == 200, read.text
        write = client.put("/api/v1/tenant/settings", headers=emulated_headers, json={"settings": {"theme": "blocked"}})
        assert write.status_code == 403
        assert write.json()["code"] == "TENANT_READ_ONLY"

        ended = client.post(
            f"/api/v1/superadmin/emulations/{emulation_id}/end",
            headers={"x-workshopos-identity": SUPERADMIN_SUBJECT},
            json={"reason": "Investigation complete"},
        )
        assert ended.status_code == 200, ended.text

        audit = client.get(
            f"/api/v1/superadmin/tenants/{tenant_id}/audit-events",
            headers={"x-workshopos-identity": SUPERADMIN_SUBJECT},
        )
        assert audit.status_code == 200, audit.text
        assert {event["action"] for event in audit.json()["events"]} >= {
            "TENANT_PROVISIONED",
            "PLATFORM_BILLING_UPDATED",
            "TENANT_LIFECYCLE_CHANGED",
            "SUPPORT_EMULATION_STARTED",
            "SUPPORT_EMULATION_ENDED",
        }

    # The API guard above is not sufficient evidence by itself. The forced RLS
    # policy must also reject a direct runtime-role write for the same scope.
    with get_engine().connect() as connection:
        transaction = connection.begin()
        apply_rls_context(connection, _read_only_scope(tenant, emulation_id))
        with pytest.raises(ProgrammingError, match="row-level security"):
            connection.execute(
                text(
                    "UPDATE tenant_settings SET settings='{\"theme\": \"blocked\"}' "
                    "WHERE tenant_id=:tenant_id"
                ),
                {"tenant_id": tenant_id},
            )
        transaction.rollback()
