"""PostgreSQL/RLS acceptance coverage for the branch stock slice."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from uuid import uuid4


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        connection.execute(text("TRUNCATE TABLE tenants, platform_users RESTART IDENTITY CASCADE"))
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
    permissions = ("page.stock.read", "page.stock.write", "page.inward-purchases.read", "page.inward-purchases.write")
    with get_engine().begin() as connection:
        membership = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": membership["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": membership["id"], "user_id": membership["user_id"]})
        for permission in permissions:
            connection.execute(text("INSERT INTO role_permissions(role_id,permission) SELECT id,:permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin' ON CONFLICT DO NOTHING"), {"permission": permission, "tenant_id": tenant_id})


def _activate_store(tenant_id: str, subject: str) -> None:
    """Provision an active Store member with only its normal purchasing page access."""
    from app.database import get_engine
    with get_engine().begin() as connection:
        user_id, membership_id = uuid4(), uuid4()
        branch_id = connection.execute(text("SELECT id FROM branches WHERE tenant_id=:tenant_id AND is_primary"), {"tenant_id": tenant_id}).scalar_one()
        connection.execute(text("INSERT INTO platform_users(id,cognito_subject,display_name,email) VALUES (:id,:subject,'Store user',:email)"), {"id": str(user_id), "subject": subject, "email": f"{subject}@example.test"})
        connection.execute(text("INSERT INTO tenant_memberships(id,tenant_id,user_id,status) VALUES (:id,:tenant_id,:user_id,'ACTIVE')"), {"id": str(membership_id), "tenant_id": tenant_id, "user_id": str(user_id)})
        connection.execute(text("UPDATE platform_users SET active_membership_id=:membership_id WHERE id=:user_id"), {"membership_id": str(membership_id), "user_id": str(user_id)})
        connection.execute(text("INSERT INTO membership_branches(membership_id,tenant_id,branch_id) VALUES (:membership_id,:tenant_id,:branch_id)"), {"membership_id": str(membership_id), "tenant_id": tenant_id, "branch_id": str(branch_id)})
        connection.execute(text("INSERT INTO membership_roles(membership_id,tenant_id,role_id) SELECT :membership_id,:tenant_id,id FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Store'"), {"membership_id": str(membership_id), "tenant_id": tenant_id})


@pytest.mark.integration
def test_catalogue_purchase_inward_and_ledger_are_branch_scoped_and_audited() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north-stock"), _provision(client, "south-stock")
        _activate(str(north["id"]), "north-stock-user"); _activate(str(south["id"]), "south-stock-user")
        headers = {"x-workshopos-identity": "north-stock-user"}
        item = client.post("/api/v1/catalogue-items", headers=headers, json={"sku": "OIL-5W30", "name": "5W30 oil", "unit": "L", "lowStockQty": 2, "sellingPrice": 900})
        assert item.status_code == 201, item.text
        supplier = client.post("/api/v1/suppliers", headers=headers, json={"name": "Parts Co"})
        assert supplier.status_code == 201, supplier.text
        po = client.post("/api/v1/purchase-orders", headers=headers, json={"supplierId": supplier.json()["id"], "poNumber": "PO-001", "orderDate": "2026-09-29", "lines": [{"itemId": item.json()["id"], "orderedQty": 5, "unitCost": 500}]})
        assert po.status_code == 201, po.text
        # Updating a DRAFT deliberately replaces its lines; this exercises the
        # runtime DELETE grant added in migration 0008 under real RLS.
        po = client.put(f"/api/v1/purchase-orders/{po.json()['id']}", headers=headers, json={"supplierId": supplier.json()["id"], "poNumber": "PO-001", "orderDate": "2026-09-29", "lines": [{"itemId": item.json()["id"], "orderedQty": 5, "unitCost": 500}]})
        assert po.status_code == 200, po.text
        assert client.post(f"/api/v1/purchase-orders/{po.json()['id']}/commands/send", headers=headers, json={}).status_code == 200
        inward = client.post("/api/v1/stock-inwards", headers=headers, json={"itemId": item.json()["id"], "qty": 5, "unitCost": 500, "note": "GRN-1", "purchaseOrderLineId": po.json()["lines"][0]["id"]})
        assert inward.status_code == 201, inward.text
        assert client.get("/api/v1/catalogue-items", headers=headers).json()[0]["onHand"] == 5
        assert client.get("/api/v1/catalogue-items", headers={"x-workshopos-identity": "south-stock-user"}).json() == []
        negative = client.post("/api/v1/stock-adjustments", headers=headers, json={"itemId": item.json()["id"], "quantity": -1, "reason": "Cycle count"})
        assert negative.status_code == 201, negative.text
        assert len(client.get("/api/v1/stock-ledger", headers=headers).json()) == 2


@pytest.mark.integration
def test_store_purchase_request_is_approved_and_issued_by_admin_with_durable_supplier_comparison() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        tenant = _provision(client, "procurement-flow")
    _activate(str(tenant["id"]), "procurement-admin")
    _activate_store(str(tenant["id"]), "procurement-store")
    with TestClient(app) as client:
        admin, store = {"x-workshopos-identity": "procurement-admin"}, {"x-workshopos-identity": "procurement-store"}
        item = client.post("/api/v1/catalogue-items", headers=admin, json={"sku": "FILTER", "name": "Oil filter", "unit": "each"}).json()
        supplier_a = client.post("/api/v1/suppliers", headers=admin, json={"name": "Budget Parts"}).json()
        supplier_b = client.post("/api/v1/suppliers", headers=admin, json={"name": "Reliable Parts"}).json()
        request = client.post("/api/v1/purchase-requests", headers=store, json={"requestNumber": "PR-100", "sourceReference": "shortage:reservation-7", "lines": [{"itemId": item["id"], "orderedQty": 3}, {"newItemName": "Brake cleaner", "unit": "can", "orderedQty": 2}]})
        assert request.status_code == 201, request.text
        request_id = request.json()["id"]
        assert request.json()["status"] == "REQUESTED"
        first_line, new_line = request.json()["lines"]
        assert client.post(f"/api/v1/purchase-requests/{request_id}/approve", headers=store, json={"lines": [{"lineId": first_line["id"], "supplierId": supplier_a["id"], "unitCost": 100}]}).status_code == 403
        for supplier, cost in ((supplier_a, 100), (supplier_b, 120)):
            response = client.post(f"/api/v1/purchase-requests/{request_id}/supplier-quotes", headers=admin, json={"lineId": first_line["id"], "supplierId": supplier["id"], "unitCost": cost})
            assert response.status_code == 201, response.text
        assert client.post(f"/api/v1/purchase-requests/{request_id}/supplier-quotes", headers=admin, json={"lineId": new_line["id"], "supplierId": supplier_b["id"], "unitCost": 50}).status_code == 201
        comparison = client.get(f"/api/v1/purchase-requests/{request_id}/supplier-comparison", headers=admin)
        assert comparison.status_code == 200 and [quote["unitCost"] for quote in comparison.json()["lines"][0]["quotes"]] == [100.0, 120.0]
        approval = client.post(f"/api/v1/purchase-requests/{request_id}/approve", headers=admin, json={"lines": [{"lineId": first_line["id"], "supplierId": supplier_a["id"], "unitCost": 100}, {"lineId": new_line["id"], "supplierId": supplier_b["id"], "unitCost": 50, "inventoryItem": {"sku": "BRAKE-CLEAN", "category": "Chemicals", "name": "Brake cleaner", "unit": "can", "lowStockQty": 1, "sellingPrice": 90}}]})
        assert approval.status_code == 200, approval.text
        assert approval.json()["status"] == "APPROVED"
        assert len(approval.json()["purchaseOrders"]) == 2
        issued = client.post(f"/api/v1/purchase-requests/{request_id}/commands/issue", headers=admin, json={})
        assert issued.status_code == 200, issued.text
        assert issued.json()["status"] == "ISSUED"
        assert {order["status"] for order in issued.json()["purchaseOrders"]} == {"SENT"}
        refreshed = client.get(f"/api/v1/purchase-requests/{request_id}", headers=admin)
        assert refreshed.status_code == 200 and [event["command"] for event in refreshed.json()["events"]] == ["REQUESTED", "APPROVED", "ISSUED"]
