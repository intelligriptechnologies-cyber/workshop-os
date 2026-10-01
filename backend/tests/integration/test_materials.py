"""PostgreSQL/RLS acceptance coverage for the job material ledger slice."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        for table in (
            "stock_ledger", "material_ledger", "material_reservations", "stock_inwards", "purchase_order_lines", "purchase_orders", "suppliers", "catalogue_items",
            "job_events", "estimate_decisions", "estimate_lines", "estimates", "job_cards", "tenant_audit_events", "visits", "vehicles", "customers",
            "support_emulations", "tenant_admin_invitations", "platform_billing", "branch_settings", "tenant_settings", "membership_roles", "role_permissions",
            "tenant_roles", "membership_branches", "tenant_memberships", "superadmins", "branches", "platform_users", "tenants",
        ):
            connection.execute(text(f"DELETE FROM {table}"))
        connection.execute(text("INSERT INTO platform_users (id,cognito_subject,display_name,email) VALUES (gen_random_uuid(),'platform-superadmin','Platform','platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject='platform-superadmin'"))


def _provision(client: TestClient, name: str) -> dict[str, object]:
    response = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={
        "tenant_name": name, "primary_branch_name": "Main", "tenant_admin_name": "Owner", "tenant_admin_email": f"{name}@example.test",
        "plan": "Growth", "agreed_price": "1.00", "currency": "INR", "billing_cycle": "monthly", "renewal_date": "2026-10-01", "due_date": "2026-10-01", "payment_status": "pending", "internal_notes": "",
    })
    assert response.status_code == 201, response.text
    return response.json()


def _activate(tenant_id: str, subject: str) -> None:
    from app.database import get_engine
    permissions = (
        "page.customers.read", "page.customers.write", "page.vehicles.read", "page.vehicles.write", "page.receive-vehicle.read", "page.receive-vehicle.write",
        "page.job-card.read", "page.job-card.write", "page.estimate.read", "page.estimate.write", "page.material-requests.read", "page.material-requests.write",
        "page.issue-material.read", "page.issue-material.write", "page.reconcile.read", "page.reconcile.write", "page.stock.read", "page.stock.write",
    )
    with get_engine().begin() as connection:
        member = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": member["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": member["id"], "user_id": member["user_id"]})
        for permission in permissions:
            connection.execute(text("INSERT INTO role_permissions(role_id,permission) SELECT id,:permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin' ON CONFLICT DO NOTHING"), {"permission": permission, "tenant_id": tenant_id})


def _approved_job(client: TestClient, headers: dict[str, str]) -> int:
    customer = client.post("/api/v1/customers", headers=headers, json={"name": "Asha", "mobile": "9000000000", "type": "Individual"}).json()
    vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer["id"], "number": "KA01AB1234", "make": "Honda", "model": "City", "km": 100}).json()
    visit = client.post("/api/v1/visits", headers=headers, json={"customerId": customer["id"], "vehicleId": vehicle["id"], "fuel": "half", "odoReading": 100, "requestedWork": "Service"}).json()
    job = client.post("/api/v1/jobs", headers=headers, json={"visitId": visit["id"]}).json()
    estimate = client.post(f"/api/v1/jobs/{job['id']}/estimates", headers=headers, json={"lines": [{"kind": "labour", "description": "Service", "quantity": 1, "rate": 1000}]}).json()
    assert client.post(f"/api/v1/estimates/{estimate['id']}/decision", headers=headers, json={"outcome": "approved", "channel": "phone", "decidedAt": "2026-09-29T10:00:00Z"}).status_code == 200
    assert client.post(f"/api/v1/jobs/{job['id']}/commands/start-work", headers=headers, json={}).status_code == 200
    return job["id"]


@pytest.mark.integration
def test_reservation_issue_return_waste_are_scoped_and_never_overdraw_stock() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north-material"), _provision(client, "south-material")
        _activate(str(north["id"]), "north-material-user"); _activate(str(south["id"]), "south-material-user")
        headers = {"x-workshopos-identity": "north-material-user"}
        job_id = _approved_job(client, headers)
        item = client.post("/api/v1/catalogue-items", headers=headers, json={"sku": "OIL", "name": "Engine oil", "unit": "L"})
        assert item.status_code == 201, item.text
        assert client.post("/api/v1/stock-inwards", headers=headers, json={"itemId": item.json()["id"], "qty": 5, "note": "GRN-1"}).status_code == 201
        reservation = client.post("/api/v1/material-reservations", headers=headers, json={"jobId": job_id, "itemId": item.json()["id"], "quantity": 4, "note": "Approved service"})
        assert reservation.status_code == 201, reservation.text
        issue = client.post(f"/api/v1/material-reservations/{reservation.json()['id']}/commands/issue", headers=headers, json={"quantity": 3})
        assert issue.status_code == 200 and issue.json()["reservation"]["onJobQty"] == 3, issue.text
        assert client.get("/api/v1/catalogue-items", headers=headers).json()[0]["onHand"] == 2
        assert client.post(f"/api/v1/material-reservations/{reservation.json()['id']}/commands/issue", headers=headers, json={"quantity": 2}).status_code == 409
        assert client.post(f"/api/v1/material-reservations/{reservation.json()['id']}/commands/return", headers=headers, json={"quantity": 1}).status_code == 200
        assert client.post(f"/api/v1/material-reservations/{reservation.json()['id']}/commands/waste", headers=headers, json={"quantity": 2, "reason": "Spillage"}).status_code == 200
        # Waste settles stock already issued to the job. It must not subtract
        # the same physical quantity a second time from the Store balance.
        assert client.get("/api/v1/catalogue-items", headers=headers).json()[0]["onHand"] == 3
        entries = client.get("/api/v1/material-ledger", headers=headers).json()
        assert {entry["entryType"] for entry in entries} >= {"RESERVE", "ISSUE", "RETURN", "WASTE"}
        stock_entries = client.get("/api/v1/stock-ledger", headers=headers).json()
        assert {entry["entryType"] for entry in stock_entries} >= {"INWARD", "ISSUE", "RETURN"}
        assert all(entry["entryType"] != "WASTE" for entry in stock_entries)
        assert client.get("/api/v1/material-reservations", headers={"x-workshopos-identity": "south-material-user"}).json() == []
