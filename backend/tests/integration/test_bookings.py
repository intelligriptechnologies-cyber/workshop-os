"""PostgreSQL acceptance coverage for the Booking-to-Job Card command."""

from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        for table in (
            "job_assignment_history", "bookings", "booking_capacity_limits", "job_events", "estimate_decisions",
            "estimate_lines", "estimates", "job_cards", "visits", "vehicles", "customers", "service_advisor_teams",
            "service_department_managers", "service_departments", "tenant_audit_events", "support_emulations",
            "tenant_admin_invitations", "platform_billing", "branch_settings", "tenant_settings", "membership_roles",
            "role_permissions", "tenant_roles", "membership_branches", "tenant_memberships", "superadmins", "branches",
            "platform_users", "tenants",
        ):
            connection.execute(text(f"DELETE FROM {table}"))
        connection.execute(text("INSERT INTO platform_users (id,cognito_subject,display_name,email) VALUES (gen_random_uuid(),'platform-superadmin','Platform Admin','platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject='platform-superadmin'"))


def _provision(client: TestClient, name: str) -> dict[str, object]:
    response = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={
        "tenant_name": name, "primary_branch_name": f"{name} Main", "tenant_admin_name": "Tenant Admin",
        "tenant_admin_email": f"{name}@example.test", "plan": "Growth", "agreed_price": "2500.00", "currency": "INR",
        "billing_cycle": "monthly", "renewal_date": "2026-10-01", "due_date": "2026-10-05", "payment_status": "pending", "internal_notes": "booking test",
    })
    assert response.status_code == 201, response.text
    return response.json()


def _activate_and_route(tenant_id: str, subject: str) -> dict[str, str]:
    from app.database import get_engine
    with get_engine().begin() as connection:
        member = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        branch_id = connection.execute(text("SELECT id FROM branches WHERE tenant_id=:tenant_id AND is_primary"), {"tenant_id": tenant_id}).scalar_one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": member["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": member["id"], "user_id": member["user_id"]})
        for permission in ("page.customers.read", "page.customers.write", "page.vehicles.read", "page.vehicles.write", "page.receive-vehicle.read", "page.receive-vehicle.write", "page.job-card.read", "page.job-card.write"):
            connection.execute(text("INSERT INTO role_permissions (role_id,permission) SELECT id,:permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin' ON CONFLICT DO NOTHING"), {"tenant_id": tenant_id, "permission": permission})
        connection.execute(text("INSERT INTO membership_roles (membership_id,tenant_id,role_id) SELECT :membership_id,:tenant_id,id FROM tenant_roles WHERE tenant_id=:tenant_id AND system_key='service_manager' ON CONFLICT DO NOTHING"), {"membership_id": str(member["id"]), "tenant_id": tenant_id})
        department_id = uuid4()
        connection.execute(text("INSERT INTO service_departments (id,tenant_id,branch_id,name,created_by,updated_by) VALUES (:id,:tenant_id,:branch_id,'Mechanical',:user_id,:user_id)"), {"id": str(department_id), "tenant_id": tenant_id, "branch_id": str(branch_id), "user_id": str(member["user_id"])})
        connection.execute(text("INSERT INTO service_department_managers (tenant_id,branch_id,department_id,manager_membership_id,appointed_by) VALUES (:tenant_id,:branch_id,:department_id,:membership_id,:user_id)"), {"tenant_id": tenant_id, "branch_id": str(branch_id), "department_id": str(department_id), "membership_id": str(member["id"]), "user_id": str(member["user_id"])})
        return {"branch": str(branch_id), "department": str(department_id), "manager": str(member["user_id"])}


def _customer_and_vehicle(client: TestClient, headers: dict[str, str]) -> tuple[int, int]:
    customer = client.post("/api/v1/customers", headers=headers, json={"name": "Anika", "mobile": "9000000001", "type": "Individual"})
    assert customer.status_code == 201, customer.text
    vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer.json()["id"], "number": "KA01AB1234", "make": "Honda", "model": "City", "km": 1200})
    assert vehicle.status_code == 201, vehicle.text
    return customer.json()["id"], vehicle.json()["id"]


@pytest.mark.integration
def test_booking_check_in_creates_persisted_visit_and_job_and_isolation_holds() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north"), _provision(client, "south")
        north_route = _activate_and_route(str(north["id"]), "north-user")
        _activate_and_route(str(south["id"]), "south-user")
        north_headers, south_headers = {"x-workshopos-identity": "north-user"}, {"x-workshopos-identity": "south-user"}
        customer_id, vehicle_id = _customer_and_vehicle(client, north_headers)
        booking = client.post("/api/v1/bookings", headers=north_headers, json={"customerId": customer_id, "vehicleId": vehicle_id, "bookingDate": "2026-10-10", "serviceType": "Service Work", "arrivalWindow": "Morning", "requestedWork": "Annual service"})
        assert booking.status_code == 201, booking.text
        booking_id = booking.json()["id"]
        assert client.get("/api/v1/bookings?bookingDate=2026-10-10", headers=south_headers).json() == []
        checked_in = client.post(f"/api/v1/bookings/{booking_id}/check-in", headers=north_headers, json={"departmentId": north_route["department"], "responsibleManagerId": north_route["manager"], "fuel": "3 bars", "odoReading": 1250, "fuelLevelValue": "3", "fuelLevelUnit": "bars", "keys": "one key", "accessories": "mat", "requestedWork": "Annual service", "photosNote": "No visible damage"})
        assert checked_in.status_code == 200, checked_in.text
        payload = checked_in.json()
        assert payload["booking"]["status"] == "ARRIVED"
        assert payload["visit"]["odoReading"] == 1250
        assert payload["visit"]["keys"] == "one key"
        assert payload["job"]["visitId"] == payload["visit"]["id"]
        assert payload["job"]["workList"] == "Annual service"
        assert client.get(f"/api/v1/bookings/{booking_id}", headers=south_headers).status_code == 404
        repeated = client.post(f"/api/v1/bookings/{booking_id}/check-in", headers=north_headers, json={"departmentId": north_route["department"], "responsibleManagerId": north_route["manager"], "fuel": "3 bars", "odoReading": 1250, "requestedWork": "Annual service"})
        assert repeated.status_code == 422 and repeated.json()["code"] == "BOOKING_CHECK_IN_NOT_ALLOWED"


@pytest.mark.integration
def test_booking_capacity_rejects_the_next_active_reservation() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north = _provision(client, "north")
        route = _activate_and_route(str(north["id"]), "north-user")
        headers = {"x-workshopos-identity": "north-user"}
        customer_id, vehicle_id = _customer_and_vehicle(client, headers)
        from app.database import get_engine
        with get_engine().begin() as connection:
            connection.execute(text("INSERT INTO booking_capacity_limits (tenant_id,branch_id,booking_date,service_work_capacity,general_checkup_followup_capacity,updated_by) VALUES (:tenant_id,:branch_id,'2026-10-10',1,10,:actor_id)"), {"tenant_id": str(north["id"]), "branch_id": route["branch"], "actor_id": route["manager"]})
        body = {"customerId": customer_id, "vehicleId": vehicle_id, "bookingDate": "2026-10-10", "serviceType": "Service Work", "requestedWork": "Annual service"}
        assert client.post("/api/v1/bookings", headers=headers, json=body).status_code == 201
        exhausted = client.post("/api/v1/bookings", headers=headers, json=body)
        assert exhausted.status_code == 422 and exhausted.json()["code"] == "BOOKING_CAPACITY_EXHAUSTED"
