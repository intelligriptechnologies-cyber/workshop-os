"""PostgreSQL/RLS acceptance coverage for the branch stock slice."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        for table in (
            "stock_ledger", "stock_inwards", "purchase_order_lines", "purchase_orders", "suppliers", "catalogue_items",
            "tenant_audit_events", "visits", "vehicles", "customers", "support_emulations", "tenant_admin_invitations",
            "platform_billing", "branch_settings", "tenant_settings", "membership_roles", "role_permissions", "tenant_roles",
            "membership_branches", "tenant_memberships", "superadmins", "branches", "platform_users", "tenants",
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
    permissions = ("page.stock.read", "page.stock.write", "page.inward-purchases.read", "page.inward-purchases.write")
    with get_engine().begin() as connection:
        membership = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": membership["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": membership["id"], "user_id": membership["user_id"]})
        for permission in permissions:
            connection.execute(text("INSERT INTO role_permissions(role_id,permission) SELECT id,:permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin' ON CONFLICT DO NOTHING"), {"permission": permission, "tenant_id": tenant_id})


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
