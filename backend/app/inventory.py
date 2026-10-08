"""Authenticated branch catalogue, purchasing, and stock-inward commands.

On-hand is a projection of the immutable ledger.  This module intentionally
does not expose a generic stock-quantity update: inwards and adjustments are
named, audited commands whose branch comes from the authenticated membership.
"""

from __future__ import annotations

from decimal import Decimal
from datetime import date
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Query, Response, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.intake import _branch, _clean, _require_any
from app.tenant_admin import _audit
from app.tenancy import TenantScope


router = APIRouter(prefix="/api/v1", tags=["inventory"])
PurchaseStatus = Literal["DRAFT", "SENT", "PARTIALLY_RECEIVED", "READY_TO_CLOSE", "CLOSED", "CANCELLED"]


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class CatalogueItemInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    sku: Annotated[str, Field(min_length=1, max_length=120)]
    category: Annotated[str, Field(max_length=200)] = ""
    name: Annotated[str, Field(min_length=1, max_length=500)]
    unit: Annotated[str, Field(min_length=1, max_length=80)]
    low_stock_qty: Annotated[float, Field(ge=0, le=100000000)] = Field(default=0, alias="lowStockQty")
    selling_price: Annotated[float, Field(ge=0, le=100000000)] = Field(default=0, alias="sellingPrice")


class SupplierInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    name: Annotated[str, Field(min_length=1, max_length=300)]
    mobile: Annotated[str, Field(max_length=80)] = ""
    email: Annotated[str, Field(max_length=320)] = ""
    address: Annotated[str, Field(max_length=2000)] = ""


class ArchiveInput(ApiModel):
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


class PurchaseLineInput(ApiModel):
    item_id: Annotated[int, Field(gt=0)] = Field(alias="itemId")
    ordered_qty: Annotated[float, Field(gt=0, le=100000000)] = Field(alias="orderedQty")
    unit_cost: Annotated[float, Field(ge=0, le=100000000)] = Field(alias="unitCost")
    discount: Annotated[float, Field(ge=0, le=100000000)] = 0
    gst_rate: Annotated[float, Field(ge=0, le=100)] = Field(default=0, alias="gstRate")


class PurchaseOrderInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    supplier_id: Annotated[int, Field(gt=0)] = Field(alias="supplierId")
    po_number: Annotated[str, Field(min_length=1, max_length=120)] = Field(alias="poNumber")
    order_date: date = Field(alias="orderDate")
    notes: Annotated[str, Field(max_length=4000)] = ""
    lines: Annotated[list[PurchaseLineInput], Field(min_length=1, max_length=250)]


class PurchaseOrderCommand(ApiModel):
    reason: Annotated[str, Field(max_length=1000)] = ""


class DeliveryReceiptLineInput(ApiModel):
    line_id: Annotated[int, Field(gt=0)] = Field(alias="lineId")
    delivered_qty: Annotated[float, Field(gt=0, le=100000000)] = Field(alias="deliveredQty")


class DeliveryReceiptInput(ApiModel):
    request_key: Annotated[str, Field(min_length=1, max_length=200)] = Field(alias="requestKey")
    note: Annotated[str, Field(max_length=4000)] = ""
    lines: Annotated[list[DeliveryReceiptLineInput], Field(min_length=1, max_length=250)]


class DeliveryConfirmationLineInput(ApiModel):
    line_id: Annotated[int, Field(gt=0)] = Field(alias="lineId")
    accepted_qty: Annotated[float, Field(ge=0, le=100000000)] = Field(alias="acceptedQty")
    rejected_qty: Annotated[float, Field(ge=0, le=100000000)] = Field(alias="rejectedQty")
    rejection_reason: Annotated[str, Field(max_length=1000)] = Field(default="", alias="rejectionReason")


class DeliveryConfirmationInput(ApiModel):
    request_key: Annotated[str, Field(min_length=1, max_length=200)] = Field(alias="requestKey")
    lines: Annotated[list[DeliveryConfirmationLineInput], Field(min_length=1, max_length=250)]


class StockInwardInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    item_id: Annotated[int, Field(gt=0)] = Field(alias="itemId")
    qty: Annotated[float, Field(gt=0, le=100000000)]
    unit_cost: Annotated[float, Field(ge=0, le=100000000)] = Field(default=0, alias="unitCost")
    note: Annotated[str, Field(max_length=4000)] = ""
    purchase_order_line_id: int | None = Field(default=None, alias="purchaseOrderLineId", gt=0)


class StockAdjustmentInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    item_id: Annotated[int, Field(gt=0)] = Field(alias="itemId")
    quantity: Annotated[float, Field(ge=-100000000, le=100000000)]
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:
    verb = "write" if mutation else "read"
    return _require_any(scope, (f"page.stock.{verb}", f"page.inward-purchases.{verb}"), mutation=mutation)


def _purchase_admin(scope: ScopedTenant) -> TenantScope:
    current = _permission(scope, mutation=True)
    if not any(name == "Owner/Admin" for _, name, _ in current.roles):
        raise auth_error("PURCHASE_DELIVERY_ADMIN_REQUIRED", status.HTTP_403_FORBIDDEN)
    return current


def _adjustment_quantity(quantity: float) -> float:
    if quantity == 0:
        raise auth_error("STOCK_ADJUSTMENT_ZERO", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return quantity


def _row_or_404(session, table: str, record_id: int, code: str) -> dict[str, object]:
    row = session.execute(text(f"SELECT * FROM {table} WHERE id=:id"), {"id": record_id}).mappings().one_or_none()
    if row is None:
        raise auth_error(code, status.HTTP_404_NOT_FOUND)
    return dict(row)


def _locked_purchase(session, purchase_id: int) -> dict[str, object]:
    row = session.execute(text("SELECT * FROM purchase_orders WHERE id=:id FOR UPDATE"), {"id": purchase_id}).mappings().one_or_none()
    if row is None:
        raise auth_error("PURCHASE_ORDER_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return dict(row)


def _catalogue(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "branchId": str(row["branch_id"]), "sku": row["sku"], "category": row["category"], "name": row["name"], "unit": row["unit"], "lowStockQty": float(row["low_stock_qty"]), "sellingPrice": float(row["selling_price"]), "onHand": float(row.get("on_hand") or 0), "archivedAt": row["archived_at"], "createdAt": row["created_at"], "updatedAt": row["updated_at"]}


def _supplier(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "branchId": str(row["branch_id"]), "name": row["name"], "mobile": row["mobile"], "email": row["email"], "address": row["address"], "archivedAt": row["archived_at"], "createdAt": row["created_at"], "updatedAt": row["updated_at"]}


def _line(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "itemId": row["item_id"], "lineNo": row["line_no"], "orderedQty": float(row["ordered_qty"]), "unitCost": float(row["unit_cost"]), "discount": float(row["discount"]), "gstRate": float(row["gst_rate"]), "receivedQty": float(row.get("received_qty") or 0), "deliveredQty": float(row.get("delivered_qty") or 0), "acceptedQty": float(row.get("accepted_qty") or 0), "rejectedQty": float(row.get("rejected_qty") or 0)}


def _purchase(row: dict[str, object], lines: list[dict[str, object]] | None = None) -> dict[str, object]:
    payload = {"id": row["id"], "branchId": str(row["branch_id"]), "supplierId": row["supplier_id"], "poNumber": row["po_number"], "orderDate": row["order_date"], "status": row["status"], "notes": row["notes"], "createdAt": row["created_at"], "updatedAt": row["updated_at"]}
    return {**payload, **({"lines": lines} if lines is not None else {})}


def _inward(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "branchId": str(row["branch_id"]), "itemId": row["item_id"], "purchaseOrderId": row["purchase_order_id"], "purchaseOrderLineId": row["purchase_order_line_id"], "qty": float(row["qty"]), "unitCost": float(row["unit_cost"]), "note": row["note"], "receivedBy": str(row["received_by"]), "receivedAt": row["received_at"]}


def _delivery_receipt(session, receipt_id: int) -> dict[str, object]:
    receipt = _row_or_404(session, "purchase_order_delivery_receipts", receipt_id, "PURCHASE_DELIVERY_RECEIPT_NOT_FOUND")
    lines = session.execute(text("SELECT * FROM purchase_order_delivery_receipt_lines WHERE receipt_id=:id ORDER BY id"), {"id": receipt_id}).mappings().all()
    return {"id": receipt["id"], "purchaseOrderId": receipt["purchase_order_id"], "requestKey": receipt["request_key"], "note": receipt["note"], "receivedAt": receipt["received_at"], "lines": [{"lineId": row["purchase_order_line_id"], "deliveredQty": float(row["delivered_qty"])} for row in lines]}


def _delivery_confirmations(session, purchase_id: int, request_key: str) -> list[dict[str, object]]:
    rows = session.execute(text("SELECT * FROM purchase_order_delivery_confirmations WHERE purchase_order_id=:purchase AND request_key=:key ORDER BY purchase_order_line_id"), {"purchase": purchase_id, "key": request_key}).mappings().all()
    return [{"id": row["id"], "lineId": row["purchase_order_line_id"], "acceptedQty": float(row["accepted_qty"]), "rejectedQty": float(row["rejected_qty"]), "rejectionReason": row["rejection_reason"], "confirmedAt": row["confirmed_at"]} for row in rows]


def _item_available(session, item_id: int, branch_id: UUID) -> dict[str, object]:
    row = _row_or_404(session, "catalogue_items", item_id, "CATALOGUE_ITEM_NOT_FOUND")
    if row["branch_id"] != branch_id or row["archived_at"] is not None:
        raise auth_error("CATALOGUE_ITEM_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return row


def _supplier_available(session, supplier_id: int, branch_id: UUID) -> dict[str, object]:
    row = _row_or_404(session, "suppliers", supplier_id, "SUPPLIER_NOT_FOUND")
    if row["branch_id"] != branch_id or row["archived_at"] is not None:
        raise auth_error("SUPPLIER_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return row


def _purchase_with_lines(session, purchase_id: int) -> dict[str, object]:
    purchase = _row_or_404(session, "purchase_orders", purchase_id, "PURCHASE_ORDER_NOT_FOUND")
    rows = session.execute(text("""SELECT line.*, COALESCE(inwards.received_qty, 0) AS received_qty,
            COALESCE(deliveries.delivered_qty, 0) AS delivered_qty, COALESCE(confirmations.accepted_qty, 0) AS accepted_qty,
            COALESCE(confirmations.rejected_qty, 0) AS rejected_qty
        FROM purchase_order_lines line
        LEFT JOIN LATERAL (SELECT SUM(qty) received_qty FROM stock_inwards WHERE purchase_order_line_id=line.id) inwards ON true
        LEFT JOIN LATERAL (SELECT SUM(receipt_line.delivered_qty) delivered_qty FROM purchase_order_delivery_receipt_lines receipt_line WHERE receipt_line.purchase_order_line_id=line.id) deliveries ON true
        LEFT JOIN LATERAL (SELECT SUM(accepted_qty) accepted_qty,SUM(rejected_qty) rejected_qty FROM purchase_order_delivery_confirmations WHERE purchase_order_line_id=line.id) confirmations ON true
        WHERE line.purchase_order_id=:id ORDER BY line.line_no"""), {"id": purchase_id}).mappings().all()
    return _purchase(purchase, [_line(dict(row)) for row in rows])


def _replace_lines(session, current: TenantScope, purchase_id: int, branch_id: UUID, lines: list[PurchaseLineInput]) -> None:
    seen: set[int] = set()
    for line in lines:
        if line.item_id in seen:
            raise auth_error("DUPLICATE_PURCHASE_ITEM", status.HTTP_422_UNPROCESSABLE_ENTITY)
        seen.add(line.item_id); _item_available(session, line.item_id, branch_id)
    session.execute(text("DELETE FROM purchase_order_lines WHERE purchase_order_id=:id"), {"id": purchase_id})
    for index, line in enumerate(lines, 1):
        session.execute(text("""INSERT INTO purchase_order_lines (tenant_id,branch_id,purchase_order_id,item_id,line_no,ordered_qty,unit_cost,discount,gst_rate)
            VALUES (:tenant_id,:branch_id,:purchase_order_id,:item_id,:line_no,:ordered_qty,:unit_cost,:discount,:gst_rate)"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "purchase_order_id": purchase_id, "item_id": line.item_id, "line_no": index, "ordered_qty": line.ordered_qty, "unit_cost": line.unit_cost, "discount": line.discount, "gst_rate": line.gst_rate})


def _reconcile_purchase(session, purchase_id: int) -> None:
    rows = session.execute(text("""SELECT line.ordered_qty, COALESCE(SUM(inward.qty),0) received
        FROM purchase_order_lines line LEFT JOIN stock_inwards inward ON inward.purchase_order_line_id=line.id
        WHERE line.purchase_order_id=:id GROUP BY line.id"""), {"id": purchase_id}).mappings().all()
    if not rows:
        return
    received = [float(row["received"]) for row in rows]
    ordered = [float(row["ordered_qty"]) for row in rows]
    next_status = "READY_TO_CLOSE" if all(got >= expected for got, expected in zip(received, ordered)) else "PARTIALLY_RECEIVED" if any(got > 0 for got in received) else "SENT"
    session.execute(text("UPDATE purchase_orders SET status=:status,updated_at=now() WHERE id=:id"), {"id": purchase_id, "status": next_status})


@router.get("/catalogue-items")
def list_catalogue(scope: ScopedTenant, q: str = "", archived: bool = False, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    clauses = ["item.archived_at IS NOT NULL" if archived else "item.archived_at IS NULL"]
    params: dict[str, object] = {}
    if branch_id is not None:
        clauses.append("item.branch_id=:branch_id")
        params["branch_id"] = str(branch_id)
    if needle := q.strip():
        clauses.append("(item.sku ILIKE :needle OR item.name ILIKE :needle OR item.category ILIKE :needle)")
        params["needle"] = f"%{needle}%"
    rows = session.execute(text(f"""SELECT item.*, COALESCE(SUM(ledger.quantity),0) on_hand FROM catalogue_items item
        LEFT JOIN stock_ledger ledger ON ledger.item_id=item.id WHERE {' AND '.join(clauses)}
        GROUP BY item.id ORDER BY item.name,item.id"""), params).mappings().all()
    return [_catalogue(dict(row)) for row in rows]


@router.post("/catalogue-items", status_code=status.HTTP_201_CREATED)
def create_catalogue(input: CatalogueItemInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id)
    row = session.execute(text("""INSERT INTO catalogue_items (tenant_id,branch_id,sku,category,name,unit,low_stock_qty,selling_price,created_by,updated_by)
        VALUES (:tenant_id,:branch_id,:sku,:category,:name,:unit,:low_stock_qty,:selling_price,:actor_id,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "sku": _clean(input.sku).upper(), "category": input.category.strip(), "name": _clean(input.name), "unit": _clean(input.unit), "low_stock_qty": input.low_stock_qty, "selling_price": input.selling_price, "actor_id": str(current.actor_id)}).mappings().one()
    payload = _catalogue(dict(row)); _audit(session, current, "CATALOGUE_ITEM_CREATED", "Catalogue item created", {}, payload); return payload


@router.put("/catalogue-items/{item_id}")
def update_catalogue(item_id: int, input: CatalogueItemInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "catalogue_items", item_id, "CATALOGUE_ITEM_NOT_FOUND"); branch_id = _branch(current, input.branch_id or before["branch_id"])
    if before["archived_at"] is not None or before["branch_id"] != branch_id: raise auth_error("CATALOGUE_ITEM_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE catalogue_items SET sku=:sku,category=:category,name=:name,unit=:unit,low_stock_qty=:low_stock_qty,selling_price=:selling_price,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *"""), {"id": item_id, "sku": _clean(input.sku).upper(), "category": input.category.strip(), "name": _clean(input.name), "unit": _clean(input.unit), "low_stock_qty": input.low_stock_qty, "selling_price": input.selling_price, "actor_id": str(current.actor_id)}).mappings().one()
    payload = _catalogue(dict(row)); _audit(session, current, "CATALOGUE_ITEM_UPDATED", "Catalogue item updated", _catalogue(before), payload); return payload


@router.post("/catalogue-items/{item_id}/archive")
def archive_catalogue(item_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "catalogue_items", item_id, "CATALOGUE_ITEM_NOT_FOUND")
    if before["archived_at"] is not None: raise auth_error("CATALOGUE_ITEM_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    linked = session.execute(text("SELECT 1 FROM purchase_order_lines WHERE item_id=:id LIMIT 1"), {"id": item_id}).scalar()
    if linked: raise auth_error("CATALOGUE_ITEM_HAS_PURCHASE_HISTORY", status.HTTP_409_CONFLICT)
    row = session.execute(text("UPDATE catalogue_items SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *"), {"id": item_id, "actor_id": str(current.actor_id), "reason": _clean(input.reason)}).mappings().one()
    payload = _catalogue(dict(row)); _audit(session, current, "CATALOGUE_ITEM_ARCHIVED", input.reason.strip(), _catalogue(before), payload); return payload


@router.get("/suppliers")
def list_suppliers(scope: ScopedTenant, q: str = "", archived: bool = False, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("SELECT * FROM suppliers WHERE (:archived=(archived_at IS NOT NULL)) AND (:branch_id IS NULL OR branch_id=:branch_id) AND (:q='' OR name ILIKE :needle OR mobile ILIKE :needle) ORDER BY name,id"), {"archived": archived, "branch_id": str(branch_id) if branch_id else None, "q": q.strip(), "needle": f"%{q.strip()}%"}).mappings().all()
    return [_supplier(dict(row)) for row in rows]


@router.post("/suppliers", status_code=status.HTTP_201_CREATED)
def create_supplier(input: SupplierInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id)
    row = session.execute(text("INSERT INTO suppliers (tenant_id,branch_id,name,mobile,email,address,created_by,updated_by) VALUES (:tenant_id,:branch_id,:name,:mobile,:email,:address,:actor_id,:actor_id) RETURNING *"), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "name": _clean(input.name), "mobile": input.mobile.strip(), "email": input.email.strip().lower(), "address": input.address.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _supplier(dict(row)); _audit(session, current, "SUPPLIER_CREATED", "Supplier created", {}, payload); return payload


@router.put("/suppliers/{supplier_id}")
def update_supplier(supplier_id: int, input: SupplierInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "suppliers", supplier_id, "SUPPLIER_NOT_FOUND"); branch_id = _branch(current, input.branch_id or before["branch_id"])
    if before["archived_at"] is not None or before["branch_id"] != branch_id: raise auth_error("SUPPLIER_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("UPDATE suppliers SET name=:name,mobile=:mobile,email=:email,address=:address,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *"), {"id": supplier_id, "name": _clean(input.name), "mobile": input.mobile.strip(), "email": input.email.strip().lower(), "address": input.address.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _supplier(dict(row)); _audit(session, current, "SUPPLIER_UPDATED", "Supplier updated", _supplier(before), payload); return payload


@router.post("/suppliers/{supplier_id}/archive")
def archive_supplier(supplier_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "suppliers", supplier_id, "SUPPLIER_NOT_FOUND")
    if before["archived_at"] is not None: raise auth_error("SUPPLIER_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    linked = session.execute(text("SELECT 1 FROM purchase_orders WHERE supplier_id=:id LIMIT 1"), {"id": supplier_id}).scalar()
    if linked: raise auth_error("SUPPLIER_HAS_PURCHASE_HISTORY", status.HTTP_409_CONFLICT)
    row = session.execute(text("UPDATE suppliers SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *"), {"id": supplier_id, "actor_id": str(current.actor_id), "reason": _clean(input.reason)}).mappings().one()
    payload = _supplier(dict(row)); _audit(session, current, "SUPPLIER_ARCHIVED", input.reason.strip(), _supplier(before), payload); return payload


@router.get("/purchase-orders")
def list_purchase_orders(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("SELECT * FROM purchase_orders" + (" WHERE branch_id=:branch_id" if branch_id else "") + " ORDER BY order_date DESC,id DESC"), {"branch_id": str(branch_id)} if branch_id else {}).mappings().all()
    return [_purchase_with_lines(session, int(row["id"])) for row in rows]


@router.post("/purchase-orders", status_code=status.HTTP_201_CREATED)
def create_purchase_order(input: PurchaseOrderInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _supplier_available(session, input.supplier_id, branch_id)
    row = session.execute(text("""INSERT INTO purchase_orders (tenant_id,branch_id,supplier_id,po_number,order_date,status,notes,created_by,updated_by)
        VALUES (:tenant_id,:branch_id,:supplier_id,:po_number,:order_date,'DRAFT',:notes,:actor_id,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "supplier_id": input.supplier_id, "po_number": _clean(input.po_number), "order_date": input.order_date, "notes": input.notes.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    _replace_lines(session, current, int(row["id"]), branch_id, input.lines); payload = _purchase_with_lines(session, int(row["id"])); _audit(session, current, "PURCHASE_ORDER_CREATED", "Purchase order drafted", {}, payload); return payload


@router.put("/purchase-orders/{purchase_id}")
def update_purchase_order(purchase_id: int, input: PurchaseOrderInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "purchase_orders", purchase_id, "PURCHASE_ORDER_NOT_FOUND"); branch_id = _branch(current, input.branch_id or before["branch_id"])
    if before["status"] != "DRAFT" or before["branch_id"] != branch_id: raise auth_error("PURCHASE_ORDER_NOT_EDITABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _supplier_available(session, input.supplier_id, branch_id)
    session.execute(text("UPDATE purchase_orders SET supplier_id=:supplier_id,po_number=:po_number,order_date=:order_date,notes=:notes,updated_by=:actor_id,updated_at=now() WHERE id=:id"), {"id": purchase_id, "supplier_id": input.supplier_id, "po_number": _clean(input.po_number), "order_date": input.order_date, "notes": input.notes.strip(), "actor_id": str(current.actor_id)})
    _replace_lines(session, current, purchase_id, branch_id, input.lines); payload = _purchase_with_lines(session, purchase_id); _audit(session, current, "PURCHASE_ORDER_UPDATED", "Purchase order draft updated", _purchase(before), payload); return payload


@router.post("/purchase-orders/{purchase_id}/commands/{command}")
def purchase_order_command(purchase_id: int, command: Literal["send", "cancel", "close"], input: PurchaseOrderCommand, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _locked_purchase(session, purchase_id) if command == "close" else _row_or_404(session, "purchase_orders", purchase_id, "PURCHASE_ORDER_NOT_FOUND")
    if command == "close" and before["status"] == "CLOSED":
        return _purchase_with_lines(session, purchase_id)
    transitions = {"send": {"DRAFT": "SENT"}, "cancel": {"DRAFT": "CANCELLED", "SENT": "CANCELLED", "PARTIALLY_RECEIVED": "CANCELLED", "READY_TO_CLOSE": "CANCELLED"}, "close": {"SENT": "CLOSED", "PARTIALLY_RECEIVED": "CLOSED", "READY_TO_CLOSE": "CLOSED"}}
    next_status = transitions[command].get(str(before["status"]))
    if not next_status: raise auth_error("INVALID_PURCHASE_ORDER_TRANSITION", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if command in {"cancel", "close"} and not input.reason.strip(): raise auth_error("PURCHASE_ORDER_REASON_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    deliveries = session.execute(text("SELECT 1 FROM purchase_order_delivery_receipts WHERE purchase_order_id=:id LIMIT 1"), {"id": purchase_id}).scalar()
    if command == "close" and deliveries:
        confirmations = session.execute(text("SELECT count(*) FROM purchase_order_delivery_confirmations WHERE purchase_order_id=:id"), {"id": purchase_id}).scalar_one()
        delivered_lines = session.execute(text("SELECT count(DISTINCT purchase_order_line_id) FROM purchase_order_delivery_receipt_lines WHERE receipt_id IN (SELECT id FROM purchase_order_delivery_receipts WHERE purchase_order_id=:id)"), {"id": purchase_id}).scalar_one()
        if before["status"] != "READY_TO_CLOSE" or confirmations != delivered_lines:
            raise auth_error("PURCHASE_DELIVERY_CONFIRMATION_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
        confirmed = session.execute(text("""SELECT confirmation.*, line.item_id, line.unit_cost
            FROM purchase_order_delivery_confirmations confirmation
            JOIN purchase_order_lines line ON line.id=confirmation.purchase_order_line_id
            WHERE confirmation.purchase_order_id=:id AND confirmation.accepted_qty > 0
            ORDER BY confirmation.purchase_order_line_id"""), {"id": purchase_id}).mappings().all()
        for confirmation in confirmed:
            inward = session.execute(text("""INSERT INTO stock_inwards (tenant_id,branch_id,item_id,purchase_order_id,purchase_order_line_id,delivery_confirmation_id,qty,unit_cost,note,received_by)
                VALUES (:tenant,:branch,:item,:purchase,:line,:confirmation,:qty,:cost,:note,:actor) RETURNING *"""), {"tenant": str(current.tenant_id), "branch": str(before["branch_id"]), "item": confirmation["item_id"], "purchase": purchase_id, "line": confirmation["purchase_order_line_id"], "confirmation": confirmation["id"], "qty": confirmation["accepted_qty"], "cost": confirmation["unit_cost"], "note": f"Accepted delivery confirmation #{confirmation['id']}", "actor": str(current.actor_id)}).mappings().one()
            session.execute(text("""INSERT INTO stock_ledger (tenant_id,branch_id,item_id,inward_id,entry_type,quantity,unit_cost,reason,actor_id)
                VALUES (:tenant,:branch,:item,:inward,'INWARD',:qty,:cost,:reason,:actor)"""), {"tenant": str(current.tenant_id), "branch": str(before["branch_id"]), "item": confirmation["item_id"], "inward": inward["id"], "qty": confirmation["accepted_qty"], "cost": confirmation["unit_cost"], "reason": f"Accepted delivery confirmation #{confirmation['id']}", "actor": str(current.actor_id)})
    session.execute(text("UPDATE purchase_orders SET status=:status,updated_by=:actor_id,updated_at=now() WHERE id=:id"), {"id": purchase_id, "status": next_status, "actor_id": str(current.actor_id)})
    payload = _purchase_with_lines(session, purchase_id); _audit(session, current, f"PURCHASE_ORDER_{command.upper()}", input.reason.strip() or "Purchase order sent", _purchase(before), payload); return payload


@router.post("/purchase-orders/{purchase_id}/delivery-receipts", status_code=status.HTTP_201_CREATED)
def record_delivery_receipt(purchase_id: int, input: DeliveryReceiptInput, response: Response, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _purchase_admin(scope); order = _locked_purchase(session, purchase_id)
    request_key = input.request_key.strip()
    existing = session.execute(text("SELECT id FROM purchase_order_delivery_receipts WHERE purchase_order_id=:purchase AND request_key=:key"), {"purchase": purchase_id, "key": request_key}).scalar_one_or_none()
    if existing is not None:
        response.status_code = status.HTTP_200_OK
        return _delivery_receipt(session, int(existing))
    if order["status"] not in {"SENT", "PARTIALLY_RECEIVED"}:
        raise auth_error("PURCHASE_ORDER_NOT_RECEIVABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    requested = {line.line_id: line for line in input.lines}
    if len(requested) != len(input.lines):
        raise auth_error("DUPLICATE_DELIVERY_LINE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    lines = [dict(row) for row in session.execute(text("SELECT * FROM purchase_order_lines WHERE purchase_order_id=:id"), {"id": purchase_id}).mappings()]
    available = {int(line["id"]): line for line in lines}
    if set(requested) - set(available):
        raise auth_error("PURCHASE_ORDER_LINE_MISMATCH", status.HTTP_422_UNPROCESSABLE_ENTITY)
    delivered = {int(row["purchase_order_line_id"]): float(row["qty"]) for row in session.execute(text("""SELECT receipt_line.purchase_order_line_id, SUM(receipt_line.delivered_qty) qty
        FROM purchase_order_delivery_receipt_lines receipt_line JOIN purchase_order_delivery_receipts receipt ON receipt.id=receipt_line.receipt_id
        WHERE receipt.purchase_order_id=:id GROUP BY receipt_line.purchase_order_line_id"""), {"id": purchase_id}).mappings()}
    for line_id, requested_line in requested.items():
        if delivered.get(line_id, 0) + requested_line.delivered_qty > float(available[line_id]["ordered_qty"]):
            raise auth_error("DELIVERY_EXCEEDS_PURCHASE_ORDER", status.HTTP_422_UNPROCESSABLE_ENTITY)
    receipt = session.execute(text("""INSERT INTO purchase_order_delivery_receipts(tenant_id,branch_id,purchase_order_id,request_key,note,received_by)
        VALUES(:tenant,:branch,:purchase,:key,:note,:actor) RETURNING id"""), {"tenant": str(current.tenant_id), "branch": str(order["branch_id"]), "purchase": purchase_id, "key": request_key, "note": input.note.strip(), "actor": str(current.actor_id)}).scalar_one()
    for line_id, requested_line in requested.items():
        session.execute(text("""INSERT INTO purchase_order_delivery_receipt_lines(tenant_id,branch_id,receipt_id,purchase_order_line_id,delivered_qty)
            VALUES(:tenant,:branch,:receipt,:line,:qty)"""), {"tenant": str(current.tenant_id), "branch": str(order["branch_id"]), "receipt": receipt, "line": line_id, "qty": requested_line.delivered_qty})
    session.execute(text("UPDATE purchase_orders SET status='PARTIALLY_RECEIVED',updated_by=:actor,updated_at=now() WHERE id=:id"), {"actor": str(current.actor_id), "id": purchase_id})
    payload = _delivery_receipt(session, int(receipt)); _audit(session, current, "PURCHASE_DELIVERY_RECEIVED", input.note.strip() or "Delivery received", {}, payload); return payload


@router.post("/purchase-orders/{purchase_id}/delivery-confirmations", status_code=status.HTTP_201_CREATED)
def confirm_delivery(purchase_id: int, input: DeliveryConfirmationInput, response: Response, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _purchase_admin(scope); order = _locked_purchase(session, purchase_id)
    request_key = input.request_key.strip()
    replay = _delivery_confirmations(session, purchase_id, request_key)
    if replay:
        response.status_code = status.HTTP_200_OK
        return {"purchaseOrderId": purchase_id, "requestKey": request_key, "confirmations": replay}
    if order["status"] != "PARTIALLY_RECEIVED":
        raise auth_error("PURCHASE_ORDER_NOT_CONFIRMABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    requested = {line.line_id: line for line in input.lines}
    if len(requested) != len(input.lines):
        raise auth_error("DUPLICATE_DELIVERY_LINE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    delivered = {int(row["purchase_order_line_id"]): float(row["qty"]) for row in session.execute(text("""SELECT receipt_line.purchase_order_line_id, SUM(receipt_line.delivered_qty) qty
        FROM purchase_order_delivery_receipt_lines receipt_line JOIN purchase_order_delivery_receipts receipt ON receipt.id=receipt_line.receipt_id
        WHERE receipt.purchase_order_id=:id GROUP BY receipt_line.purchase_order_line_id"""), {"id": purchase_id}).mappings()}
    if set(requested) != set(delivered):
        raise auth_error("DELIVERY_CONFIRMATION_INCOMPLETE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    for line_id, confirmation in requested.items():
        if Decimal(str(confirmation.accepted_qty)) + Decimal(str(confirmation.rejected_qty)) != Decimal(str(delivered[line_id])):
            raise auth_error("DELIVERY_ACCOUNTING_MISMATCH", status.HTTP_422_UNPROCESSABLE_ENTITY)
        if confirmation.rejected_qty > 0 and not confirmation.rejection_reason.strip():
            raise auth_error("DELIVERY_REJECTION_REASON_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    for line_id, confirmation in requested.items():
        session.execute(text("""INSERT INTO purchase_order_delivery_confirmations(tenant_id,branch_id,purchase_order_id,purchase_order_line_id,request_key,accepted_qty,rejected_qty,rejection_reason,confirmed_by)
            VALUES(:tenant,:branch,:purchase,:line,:key,:accepted,:rejected,:reason,:actor)"""), {"tenant": str(current.tenant_id), "branch": str(order["branch_id"]), "purchase": purchase_id, "line": line_id, "key": request_key, "accepted": confirmation.accepted_qty, "rejected": confirmation.rejected_qty, "reason": confirmation.rejection_reason.strip(), "actor": str(current.actor_id)})
    session.execute(text("UPDATE purchase_orders SET status='READY_TO_CLOSE',updated_by=:actor,updated_at=now() WHERE id=:id"), {"actor": str(current.actor_id), "id": purchase_id})
    payload = {"purchaseOrderId": purchase_id, "requestKey": request_key, "confirmations": _delivery_confirmations(session, purchase_id, request_key)}; _audit(session, current, "PURCHASE_DELIVERY_CONFIRMED", "Delivery accepted/rejected quantities confirmed", {}, payload); return payload


@router.get("/stock-inwards")
def list_stock_inwards(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("SELECT * FROM stock_inwards" + (" WHERE branch_id=:branch_id" if branch_id else "") + " ORDER BY received_at DESC,id DESC"), {"branch_id": str(branch_id)} if branch_id else {}).mappings().all()
    return [_inward(dict(row)) for row in rows]


@router.post("/stock-inwards", status_code=status.HTTP_201_CREATED)
def record_stock_inward(input: StockInwardInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _item_available(session, input.item_id, branch_id)
    order_id = None
    if input.purchase_order_line_id is not None:
        line = _row_or_404(session, "purchase_order_lines", input.purchase_order_line_id, "PURCHASE_ORDER_LINE_NOT_FOUND")
        if line["branch_id"] != branch_id or line["item_id"] != input.item_id: raise auth_error("PURCHASE_ORDER_LINE_MISMATCH", status.HTTP_422_UNPROCESSABLE_ENTITY)
        order = _row_or_404(session, "purchase_orders", int(line["purchase_order_id"]), "PURCHASE_ORDER_NOT_FOUND")
        if order["status"] not in {"SENT", "PARTIALLY_RECEIVED", "READY_TO_CLOSE"}: raise auth_error("PURCHASE_ORDER_NOT_RECEIVABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
        if session.execute(text("SELECT 1 FROM purchase_order_delivery_receipts WHERE purchase_order_id=:id LIMIT 1"), {"id": order["id"]}).scalar():
            raise auth_error("PURCHASE_ORDER_DELIVERY_MANAGED", status.HTTP_422_UNPROCESSABLE_ENTITY)
        order_id = int(order["id"])
    note = input.note.strip() or "Stock inward"
    inward = session.execute(text("""INSERT INTO stock_inwards (tenant_id,branch_id,item_id,purchase_order_id,purchase_order_line_id,qty,unit_cost,note,received_by)
        VALUES (:tenant_id,:branch_id,:item_id,:purchase_order_id,:line_id,:qty,:unit_cost,:note,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "item_id": input.item_id, "purchase_order_id": order_id, "line_id": input.purchase_order_line_id, "qty": input.qty, "unit_cost": input.unit_cost, "note": note, "actor_id": str(current.actor_id)}).mappings().one()
    ledger = session.execute(text("""INSERT INTO stock_ledger (tenant_id,branch_id,item_id,inward_id,entry_type,quantity,unit_cost,reason,actor_id)
        VALUES (:tenant_id,:branch_id,:item_id,:inward_id,'INWARD',:qty,:unit_cost,:reason,:actor_id) RETURNING id"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "item_id": input.item_id, "inward_id": inward["id"], "qty": input.qty, "unit_cost": input.unit_cost, "reason": note, "actor_id": str(current.actor_id)}).scalar_one()
    if order_id is not None: _reconcile_purchase(session, order_id)
    payload = {**_inward(dict(inward)), "ledgerId": ledger}; _audit(session, current, "STOCK_INWARD_RECORDED", note, {}, payload); return payload


@router.post("/stock-adjustments", status_code=status.HTTP_201_CREATED)
def adjust_stock(input: StockAdjustmentInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _item_available(session, input.item_id, branch_id); reason = _clean(input.reason)
    quantity = _adjustment_quantity(input.quantity)
    row = session.execute(text("""INSERT INTO stock_ledger (tenant_id,branch_id,item_id,entry_type,quantity,unit_cost,reason,actor_id)
        VALUES (:tenant_id,:branch_id,:item_id,'ADJUSTMENT',:quantity,0,:reason,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "item_id": input.item_id, "quantity": quantity, "reason": reason, "actor_id": str(current.actor_id)}).mappings().one()
    payload = {"id": row["id"], "itemId": row["item_id"], "quantity": float(row["quantity"]), "reason": row["reason"], "entryType": row["entry_type"], "createdAt": row["created_at"]}; _audit(session, current, "STOCK_ADJUSTED", reason, {}, payload); return payload


@router.get("/stock-ledger")
def list_stock_ledger(scope: ScopedTenant, item_id: int | None = Query(default=None, alias="itemId"), branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    filters, values = [], {}
    if branch_id is not None:
        filters.append("branch_id=:branch_id"); values["branch_id"] = str(branch_id)
    if item_id is not None:
        filters.append("item_id=:item_id"); values["item_id"] = item_id
    where = f" WHERE {' AND '.join(filters)}" if filters else ""
    rows = session.execute(text(f"SELECT * FROM stock_ledger{where} ORDER BY created_at DESC,id DESC"), values).mappings().all()
    return [{"id": row["id"], "branchId": str(row["branch_id"]), "itemId": row["item_id"], "inwardId": row["inward_id"], "entryType": row["entry_type"], "quantity": float(row["quantity"]), "unitCost": float(row["unit_cost"]), "reason": row["reason"], "actorId": str(row["actor_id"]), "createdAt": row["created_at"]} for row in rows]
