"""Authenticated estimated-delivery behavior at the PostgreSQL API boundary."""

from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset():
    from app.database import get_engine
    with get_engine().begin() as connection:
        tables = connection.execute(text("SELECT quote_ident(tablename) FROM pg_tables WHERE schemaname='public' AND tablename <> 'alembic_version'")).scalars().all()
        connection.execute(text(f"TRUNCATE TABLE {', '.join(tables)} RESTART IDENTITY CASCADE"))
        connection.execute(text("INSERT INTO platform_users (id,cognito_subject,display_name,email) VALUES (gen_random_uuid(),'platform-superadmin','Platform','platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject='platform-superadmin'"))


def _tenant(client, name):
    response = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={
        "tenant_name": name, "primary_branch_name": "Main", "tenant_admin_name": "Owner", "tenant_admin_email": f"{name}@example.test",
        "plan": "Growth", "agreed_price": "1.00", "currency": "INR", "billing_cycle": "monthly",
        "renewal_date": "2026-10-01", "due_date": "2026-10-01", "payment_status": "pending", "internal_notes": "",
    })
    assert response.status_code == 201, response.text
    return response.json()


def _owner(tenant_id, subject):
    from app.database import get_engine
    with get_engine().begin() as connection:
        membership = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": membership["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:id"), {"subject": subject, "membership_id": membership["id"], "id": membership["user_id"]})
        for permission in ("page.customers.write", "page.vehicles.write", "page.receive-vehicle.write", "page.job-card.read", "page.job-card.write", "page.jobs.read", "page.jobs.write"):
            connection.execute(text("INSERT INTO role_permissions(role_id,permission) SELECT id,:permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin' ON CONFLICT DO NOTHING"), {"permission": permission, "tenant_id": tenant_id})
    return str(membership["user_id"])


def _job(client, subject, suffix):
    headers = {"x-workshopos-identity": subject}
    customer = client.post("/api/v1/customers", headers=headers, json={"name": "Asha", "mobile": f"900000{suffix:04d}", "type": "Individual"})
    assert customer.status_code == 201, customer.text
    vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer.json()["id"], "number": f"KA01AB{suffix:04d}", "make": "Honda", "model": "City", "km": 100})
    assert vehicle.status_code == 201, vehicle.text
    visit = client.post("/api/v1/visits", headers=headers, json={"customerId": customer.json()["id"], "vehicleId": vehicle.json()["id"], "fuel": "half", "odoReading": 100, "requestedWork": "Service"})
    assert visit.status_code == 201, visit.text
    from app.database import get_engine
    with get_engine().begin() as connection:
        return int(connection.execute(text("""
            INSERT INTO job_cards(tenant_id,branch_id,job_no,visit_id,status,work_list,promised_at,created_by,updated_by)
            SELECT v.tenant_id,v.branch_id,:job_no,v.id,'NEW','Service','2026-10-11T09:00:00Z',u.id,u.id
            FROM visits v CROSS JOIN platform_users u WHERE v.id=:visit_id AND u.cognito_subject=:subject RETURNING id
        """), {"job_no": f"JC-{suffix}", "visit_id": visit.json()["id"], "subject": subject}).scalar_one())


def _member(tenant_id, branch_id, subject, role):
    from app.database import get_engine
    user_id, membership_id = str(uuid4()), str(uuid4())
    with get_engine().begin() as connection:
        connection.execute(text("INSERT INTO platform_users(id,cognito_subject,display_name,email) VALUES (:id,:subject,:subject,:email)"), {"id": user_id, "subject": subject, "email": f"{subject}@example.test"})
        connection.execute(text("INSERT INTO tenant_memberships(id,tenant_id,user_id,status) VALUES (:id,:tenant_id,:user_id,'ACTIVE')"), {"id": membership_id, "tenant_id": tenant_id, "user_id": user_id})
        connection.execute(text("UPDATE platform_users SET active_membership_id=:membership_id WHERE id=:user_id"), {"membership_id": membership_id, "user_id": user_id})
        connection.execute(text("INSERT INTO membership_branches(membership_id,branch_id,tenant_id) VALUES (:membership_id,:branch_id,:tenant_id)"), {"membership_id": membership_id, "branch_id": branch_id, "tenant_id": tenant_id})
        connection.execute(text("INSERT INTO membership_roles(membership_id,role_id,tenant_id) SELECT :membership_id,id,:tenant_id FROM tenant_roles WHERE tenant_id=:tenant_id AND name=:role"), {"membership_id": membership_id, "tenant_id": tenant_id, "role": role})
    return user_id


@pytest.mark.integration
def test_estimated_delivery_saves_clears_and_audits_without_changing_promised_at():
    _reset()
    from app.main import app
    with TestClient(app) as client:
        north = _tenant(client, "north-delivery")
        actor = _owner(str(north["id"]), "north-owner")
        job_id = _job(client, "north-owner", 1)
        headers = {"x-workshopos-identity": "north-owner"}
        path = f"/api/v1/jobs/{job_id}/estimated-delivery"
        assert client.get(f"/api/v1/jobs/{job_id}", headers=headers).json()["estimatedDelivery"] is None
        saved = client.put(path, headers=headers, json={"estimatedDelivery": "2026-10-20"})
        assert saved.status_code == 200, saved.text
        assert saved.json()["estimatedDelivery"] == "2026-10-20"
        assert saved.json()["promisedAt"].startswith("2026-10-11")
        assert client.get("/api/v1/jobs", headers=headers).json()[0]["estimatedDelivery"] == "2026-10-20"
        assert client.get(f"/api/v1/jobs/{job_id}", headers=headers).json()["estimatedDelivery"] == "2026-10-20"
        assert client.put(path, headers=headers, json={"estimatedDelivery": "2026-02-30"}).status_code == 422
        assert client.put(path, headers=headers, json={"estimatedDelivery": "2026-10-20T00:00:00Z"}).status_code == 422
        cleared = client.put(path, headers=headers, json={"estimatedDelivery": None})
        assert cleared.status_code == 200 and cleared.json()["estimatedDelivery"] is None
        assert client.get(f"/api/v1/jobs/{job_id}", headers=headers).json()["estimatedDelivery"] is None
        from app.database import get_engine
        with get_engine().begin() as connection:
            events = connection.execute(text("SELECT actor_id,before_value,after_value FROM tenant_audit_events WHERE action='JOB_ESTIMATED_DELIVERY_UPDATED' ORDER BY created_at,id")).mappings().all()
        assert [(str(item["actor_id"]), item["before_value"], item["after_value"]) for item in events] == [
            (actor, {"estimatedDelivery": None}, {"estimatedDelivery": "2026-10-20"}),
            (actor, {"estimatedDelivery": "2026-10-20"}, {"estimatedDelivery": None}),
        ]


@pytest.mark.integration
def test_estimated_delivery_denies_unlinked_roles_other_tenants_branches_and_terminal_jobs():
    _reset()
    from app.main import app
    with TestClient(app) as client:
        north, south = _tenant(client, "north-access"), _tenant(client, "south-access")
        _owner(str(north["id"]), "north-owner")
        _owner(str(south["id"]), "south-owner")
        job_id = _job(client, "north-owner", 2)
        path = f"/api/v1/jobs/{job_id}/estimated-delivery"
        north_headers = {"x-workshopos-identity": "north-owner"}
        from app.database import get_engine
        with get_engine().begin() as connection:
            branch_id = str(connection.execute(text("SELECT id FROM branches WHERE tenant_id=:id AND is_primary"), {"id": str(north["id"])}).scalar_one())
        advisor_id = _member(str(north["id"]), branch_id, "linked-advisor", "Service Advisor")
        _member(str(north["id"]), branch_id, "other-advisor", "Service Advisor")
        _member(str(north["id"]), branch_id, "north-technician", "Technician")
        with get_engine().begin() as connection:
            connection.execute(text("UPDATE job_cards SET advisor_id=:advisor_id WHERE id=:id"), {"advisor_id": advisor_id, "id": job_id})
        payload = {"estimatedDelivery": "2026-10-21"}
        assert client.put(path, headers={"x-workshopos-identity": "linked-advisor"}, json=payload).status_code == 200
        assert client.put(path, headers={"x-workshopos-identity": "other-advisor"}, json=payload).status_code == 403
        assert client.put(path, headers={"x-workshopos-identity": "north-technician"}, json=payload).status_code == 403
        assert client.put(path, headers={"x-workshopos-identity": "south-owner"}, json=payload).status_code == 404
        with get_engine().begin() as connection:
            second_branch = str(uuid4())
            connection.execute(text("INSERT INTO branches(id,tenant_id,name,is_primary) VALUES (:id,:tenant_id,'Other',false)"), {"id": second_branch, "tenant_id": str(north["id"])})
            connection.execute(text("UPDATE job_cards SET branch_id=:branch_id WHERE id=:id"), {"branch_id": second_branch, "id": job_id})
        assert client.put(path, headers=north_headers, json=payload).status_code == 404
        with get_engine().begin() as connection:
            connection.execute(text("UPDATE job_cards SET branch_id=:branch_id,status='CLOSED' WHERE id=:id"), {"branch_id": branch_id, "id": job_id})
        assert client.put(path, headers=north_headers, json=payload).status_code == 422
        with get_engine().begin() as connection:
            connection.execute(text("UPDATE job_cards SET status='NEW',archived_at=now() WHERE id=:id"), {"id": job_id})
        assert client.put(path, headers=north_headers, json=payload).status_code == 422
        assert client.get(f"/api/v1/jobs/{job_id}", headers=north_headers).json()["estimatedDelivery"] == "2026-10-21"
