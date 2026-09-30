"""Docker/PostgreSQL acceptance coverage for the intake HTTP boundary."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        for table in ("job_events", "estimate_decisions", "estimate_lines", "estimates", "job_cards", "tenant_audit_events", "visits", "vehicles", "customers", "support_emulations", "tenant_admin_invitations", "platform_billing", "branch_settings", "tenant_settings", "membership_roles", "role_permissions", "tenant_roles", "membership_branches", "tenant_memberships", "superadmins", "branches", "platform_users", "tenants"):
            connection.execute(text(f"DELETE FROM {table}"))
        connection.execute(text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (gen_random_uuid(), 'platform-superadmin', 'Platform Admin', 'platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject = 'platform-superadmin'"))


def _provision(client: TestClient, name: str) -> dict[str, object]:
    response = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={"tenant_name": name, "primary_branch_name": f"{name} Main", "tenant_admin_name": "Tenant Admin", "tenant_admin_email": f"{name.lower()}@example.test", "plan": "Growth", "agreed_price": "2500.00", "currency": "INR", "billing_cycle": "monthly", "renewal_date": "2026-10-01", "due_date": "2026-10-05", "payment_status": "pending", "internal_notes": "test"})
    assert response.status_code == 201, response.text
    return response.json()


def _activate_reception(tenant_id: str, subject: str) -> None:
    """Promote the provisioned owner role for this narrow API/RLS acceptance test."""
    from app.database import get_engine
    with get_engine().begin() as connection:
        row = connection.execute(text("SELECT m.id AS membership_id, m.user_id FROM tenant_memberships m WHERE m.tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": row["membership_id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject, active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": row["membership_id"], "user_id": row["user_id"]})
        # Owner needs the three visible Reception pages for this test. Real role
        # assignments are exercised by tenant-admin integration coverage.
        connection.execute(text("INSERT INTO role_permissions (role_id, permission) SELECT r.id, p.permission FROM tenant_roles r CROSS JOIN (VALUES ('page.customers.read'), ('page.customers.write'), ('page.vehicles.read'), ('page.vehicles.write')) AS p(permission) WHERE r.tenant_id=:tenant_id AND r.name='Owner/Admin' ON CONFLICT DO NOTHING"), {"tenant_id": tenant_id})


@pytest.mark.integration
def test_intake_records_are_created_searched_archived_and_hidden_from_another_tenant() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north"), _provision(client, "south")
        _activate_reception(str(north["id"]), "north-user")
        _activate_reception(str(south["id"]), "south-user")
        headers = {"x-workshopos-identity": "north-user"}
        customer = client.post("/api/v1/customers", headers=headers, json={"name": "Anika", "mobile": "9000000001", "type": "Individual"})
        assert customer.status_code == 201, customer.text
        vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer.json()["id"], "number": "KA01AB1234", "make": "Honda", "model": "City", "km": 1200})
        assert vehicle.status_code == 201, vehicle.text
        visit = client.post("/api/v1/visits", headers=headers, json={"customerId": customer.json()["id"], "vehicleId": vehicle.json()["id"], "fuel": "3 bars", "odoReading": 1200, "requestedWork": "Service"})
        assert visit.status_code == 201, visit.text
        assert client.get("/api/v1/visits?q=Anika", headers=headers).json()[0]["id"] == visit.json()["id"]
        assert client.get("/api/v1/customers?q=Anika", headers={"x-workshopos-identity": "south-user"}).json() == []
        assert client.post(f"/api/v1/visits/{visit.json()['id']}/archive", headers=headers, json={"reason": "Duplicate"}).status_code == 200
        assert client.get("/api/v1/visits", headers=headers).json() == []
