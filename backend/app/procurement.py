"""API-authoritative Purchase Request review and Purchase Order issue workflow."""
from __future__ import annotations

from datetime import date
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Query, status
from pydantic import BaseModel, ConfigDict, Field, model_validator
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.intake import _branch, _clean, _require_any
from app.inventory import _purchase_with_lines, _supplier_available
from app.tenant_admin import _audit
from app.tenancy import TenantScope

router = APIRouter(prefix="/api/v1", tags=["procurement"])

class ApiModel(BaseModel): model_config = ConfigDict(populate_by_name=True)
class RequestLine(ApiModel):
    item_id: int | None = Field(default=None, alias="itemId", gt=0)
    new_item_name: str | None = Field(default=None, alias="newItemName", max_length=500)
    unit: str | None = Field(default=None, max_length=80)
    ordered_qty: Annotated[float, Field(gt=0, le=100000000)] = Field(alias="orderedQty")
    @model_validator(mode="after")
    def exactly_one_item(self):
        if (self.item_id is None) == (not bool((self.new_item_name or "").strip())): raise ValueError("exactly one of itemId or newItemName is required")
        return self
class PurchaseRequestInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    request_number: Annotated[str, Field(min_length=1, max_length=120)] = Field(alias="requestNumber")
    source_reference: Annotated[str, Field(max_length=500)] = Field(default="", alias="sourceReference")
    notes: Annotated[str, Field(max_length=4000)] = ""
    lines: Annotated[list[RequestLine], Field(min_length=1, max_length=250)]
class QuoteInput(ApiModel):
    line_id: Annotated[int, Field(gt=0)] = Field(alias="lineId")
    supplier_id: Annotated[int, Field(gt=0)] = Field(alias="supplierId")
    unit_cost: Annotated[float, Field(ge=0, le=100000000)] = Field(alias="unitCost")
    note: Annotated[str, Field(max_length=2000)] = ""
class NewItem(ApiModel):
    sku: Annotated[str, Field(min_length=1, max_length=120)]
    category: Annotated[str, Field(max_length=200)] = ""
    name: Annotated[str, Field(min_length=1, max_length=500)]
    unit: Annotated[str, Field(min_length=1, max_length=80)]
    low_stock_qty: Annotated[float, Field(ge=0)] = Field(default=0, alias="lowStockQty")
    selling_price: Annotated[float, Field(ge=0)] = Field(default=0, alias="sellingPrice")
class ApprovalLine(ApiModel):
    line_id: Annotated[int, Field(gt=0)] = Field(alias="lineId")
    supplier_id: Annotated[int, Field(gt=0)] = Field(alias="supplierId")
    unit_cost: Annotated[float, Field(ge=0)] = Field(alias="unitCost")
    inventory_item: NewItem | None = Field(default=None, alias="inventoryItem")
class ApprovalInput(ApiModel): lines: Annotated[list[ApprovalLine], Field(min_length=1, max_length=250)]
class EmptyCommand(ApiModel): reason: str = ""

def _page(scope: ScopedTenant, *, mutation: bool) -> TenantScope:
    return _require_any(scope, (f"page.inward-purchases.{'write' if mutation else 'read'}",), mutation=mutation)
def _admin(scope: ScopedTenant) -> TenantScope:
    current = _page(scope, mutation=True)
    if not any(name == "Owner/Admin" for _, name, _ in current.roles): raise auth_error("PURCHASE_REQUEST_ADMIN_REQUIRED", status.HTTP_403_FORBIDDEN)
    return current
def _row(session, table: str, ident: int, code: str) -> dict[str, object]:
    value = session.execute(text(f"SELECT * FROM {table} WHERE id=:id"), {"id": ident}).mappings().one_or_none()
    if value is None: raise auth_error(code, status.HTTP_404_NOT_FOUND)
    return dict(value)
def _line(row: dict[str, object]) -> dict[str, object]: return {"id": row["id"], "itemId": row["item_id"], "newItemName": row["new_item_name"], "unit": row["unit"], "orderedQty": float(row["ordered_qty"]), "lineNo": row["line_no"]}
def _request(session, request_id: int) -> dict[str, object]:
    row = _row(session, "purchase_requests", request_id, "PURCHASE_REQUEST_NOT_FOUND")
    lines = [_line(dict(line)) for line in session.execute(text("SELECT * FROM purchase_request_lines WHERE purchase_request_id=:id ORDER BY line_no"), {"id": request_id}).mappings()]
    orders = [_purchase_with_lines(session, int(value["purchase_order_id"])) for value in session.execute(text("SELECT purchase_order_id FROM purchase_request_purchase_orders WHERE purchase_request_id=:id ORDER BY purchase_order_id"), {"id": request_id}).mappings()]
    events = [{"command": value["command"], "reason": value["reason"], "actorId": str(value["actor_id"]), "at": value["created_at"]} for value in session.execute(text("SELECT * FROM purchase_request_events WHERE purchase_request_id=:id ORDER BY id"), {"id": request_id}).mappings()]
    return {"id": row["id"], "branchId": str(row["branch_id"]), "requestNumber": row["request_number"], "sourceReference": row["source_reference"], "notes": row["notes"], "status": row["status"], "requestedBy": str(row["requested_by"]), "lines": lines, "purchaseOrders": orders, "events": events, "createdAt": row["created_at"], "updatedAt": row["updated_at"]}
def _event(session, current: TenantScope, request_id: int, command: str, reason: str = "") -> None:
    session.execute(text("INSERT INTO purchase_request_events(tenant_id,branch_id,purchase_request_id,command,reason,actor_id) SELECT tenant_id,branch_id,id,:command,:reason,:actor FROM purchase_requests WHERE id=:id"), {"id": request_id, "command": command, "reason": reason, "actor": str(current.actor_id)})

@router.get("/purchase-requests")
def list_requests(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _page(scope, mutation=False)
    if branch_id: _branch(current, branch_id)
    rows = session.execute(text("SELECT id FROM purchase_requests WHERE (:branch IS NULL OR branch_id=:branch) ORDER BY created_at DESC,id DESC"), {"branch": str(branch_id) if branch_id else None}).mappings()
    return [_request(session, int(row["id"])) for row in rows]
@router.get("/purchase-requests/{request_id}")
def get_request(request_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, _ = scope; _page(scope, mutation=False); return _request(session, request_id)
@router.post("/purchase-requests", status_code=status.HTTP_201_CREATED)
def create_request(input: PurchaseRequestInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch = _branch(_page(scope, mutation=True), input.branch_id)
    result = session.execute(text("INSERT INTO purchase_requests(tenant_id,branch_id,request_number,source_reference,notes,status,requested_by) VALUES(:tenant,:branch,:number,:source,:notes,'REQUESTED',:actor) RETURNING id"), {"tenant": str(current.tenant_id), "branch": str(branch), "number": _clean(input.request_number), "source": input.source_reference.strip(), "notes": input.notes.strip(), "actor": str(current.actor_id)}).mappings().one(); request_id = int(result["id"])
    for number, line in enumerate(input.lines, 1):
        item = None
        if line.item_id:
            item = session.execute(text("SELECT name,unit FROM catalogue_items WHERE id=:id AND branch_id=:branch AND archived_at IS NULL"), {"id": line.item_id, "branch": str(branch)}).mappings().one_or_none()
            if item is None: raise auth_error("CATALOGUE_ITEM_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
        unit = (line.unit or (str(item["unit"]) if item else "")).strip()
        if not unit: raise auth_error("NEW_ITEM_UNIT_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
        session.execute(text("INSERT INTO purchase_request_lines(tenant_id,branch_id,purchase_request_id,line_no,item_id,new_item_name,unit,ordered_qty) VALUES(:tenant,:branch,:request,:number,:item,:name,:unit,:qty)"), {"tenant": str(current.tenant_id), "branch": str(branch), "request": request_id, "number": number, "item": line.item_id, "name": line.new_item_name.strip() if line.new_item_name else None, "unit": unit, "qty": line.ordered_qty})
    _event(session, current, request_id, "REQUESTED", input.source_reference.strip() or "Purchase Request created")
    payload = _request(session, request_id); _audit(session, current, "PURCHASE_REQUEST_CREATED", "Purchase Request created", {}, payload); return payload
@router.post("/purchase-requests/{request_id}/supplier-quotes", status_code=status.HTTP_201_CREATED)
def add_quote(request_id: int, input: QuoteInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _admin(scope); request = _row(session, "purchase_requests", request_id, "PURCHASE_REQUEST_NOT_FOUND")
    if request["status"] != "REQUESTED": raise auth_error("PURCHASE_REQUEST_NOT_REVIEWABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    line = _row(session, "purchase_request_lines", input.line_id, "PURCHASE_REQUEST_LINE_NOT_FOUND")
    if line["purchase_request_id"] != request_id: raise auth_error("PURCHASE_REQUEST_LINE_MISMATCH", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _supplier_available(session, input.supplier_id, request["branch_id"])
    row = session.execute(text("INSERT INTO purchase_request_quotes(tenant_id,branch_id,purchase_request_line_id,supplier_id,unit_cost,note,created_by) VALUES(:tenant,:branch,:line,:supplier,:cost,:note,:actor) ON CONFLICT(purchase_request_line_id,supplier_id) DO UPDATE SET unit_cost=EXCLUDED.unit_cost,note=EXCLUDED.note,created_by=EXCLUDED.created_by RETURNING *"), {"tenant": str(current.tenant_id), "branch": str(request["branch_id"]), "line": input.line_id, "supplier": input.supplier_id, "cost": input.unit_cost, "note": input.note.strip(), "actor": str(current.actor_id)}).mappings().one()
    return {"id": row["id"], "lineId": row["purchase_request_line_id"], "supplierId": row["supplier_id"], "unitCost": float(row["unit_cost"]), "note": row["note"]}
@router.get("/purchase-requests/{request_id}/supplier-comparison")
def comparison(request_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, _ = scope; _admin(scope); _row(session, "purchase_requests", request_id, "PURCHASE_REQUEST_NOT_FOUND")
    lines=[]
    for line in session.execute(text("SELECT * FROM purchase_request_lines WHERE purchase_request_id=:id ORDER BY line_no"), {"id": request_id}).mappings():
        quotes=[{"supplierId": value["supplier_id"], "supplierName": value["name"], "unitCost": float(value["unit_cost"]), "note": value["note"]} for value in session.execute(text("SELECT quote.*,supplier.name FROM purchase_request_quotes quote JOIN suppliers supplier ON supplier.id=quote.supplier_id WHERE quote.purchase_request_line_id=:id ORDER BY quote.unit_cost,quote.id"), {"id": line["id"]}).mappings()]
        lines.append({**_line(dict(line)), "quotes": quotes})
    return {"requestId": request_id, "lines": lines}
@router.post("/purchase-requests/{request_id}/approve")
def approve(request_id: int, input: ApprovalInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _admin(scope); request = _row(session, "purchase_requests", request_id, "PURCHASE_REQUEST_NOT_FOUND")
    if request["status"] != "REQUESTED": raise auth_error("INVALID_PURCHASE_REQUEST_TRANSITION", status.HTTP_422_UNPROCESSABLE_ENTITY)
    lines=[dict(value) for value in session.execute(text("SELECT * FROM purchase_request_lines WHERE purchase_request_id=:id ORDER BY line_no"), {"id": request_id}).mappings()]; choices={value.line_id:value for value in input.lines}
    if len(choices) != len(lines) or set(choices) != {int(value["id"]) for value in lines}: raise auth_error("PURCHASE_REQUEST_APPROVAL_INCOMPLETE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    groups: dict[int,list[tuple[dict[str,object],ApprovalLine,int]]] = {}
    for line in lines:
        choice=choices[int(line["id"])]; _supplier_available(session, choice.supplier_id, request["branch_id"]); item_id=line["item_id"]
        quote = session.execute(text("SELECT 1 FROM purchase_request_quotes WHERE purchase_request_line_id=:line AND supplier_id=:supplier AND unit_cost=:cost"), {"line": line["id"], "supplier": choice.supplier_id, "cost": choice.unit_cost}).scalar()
        if not quote: raise auth_error("SUPPLIER_QUOTE_SELECTION_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
        if item_id is None:
            item=choice.inventory_item
            if item is None: raise auth_error("NEW_ITEM_SKU_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
            duplicate = session.execute(text("SELECT 1 FROM catalogue_items WHERE branch_id=:branch AND upper(sku)=upper(:sku) AND archived_at IS NULL"), {"branch": str(request["branch_id"]), "sku": _clean(item.sku)}).scalar()
            if duplicate: raise auth_error("CATALOGUE_SKU_ALREADY_EXISTS", status.HTTP_422_UNPROCESSABLE_ENTITY)
            item_id=session.execute(text("INSERT INTO catalogue_items(tenant_id,branch_id,sku,category,name,unit,low_stock_qty,selling_price,created_by,updated_by) VALUES(:tenant,:branch,:sku,:category,:name,:unit,:low,:price,:actor,:actor) RETURNING id"), {"tenant": str(current.tenant_id), "branch": str(request["branch_id"]), "sku": _clean(item.sku).upper(), "category": item.category.strip(), "name": item.name.strip(), "unit": item.unit.strip(), "low": item.low_stock_qty, "price": item.selling_price, "actor": str(current.actor_id)}).scalar_one()
            session.execute(text("UPDATE purchase_request_lines SET item_id=:item,new_item_name=NULL WHERE id=:id"), {"item": item_id, "id": line["id"]})
        groups.setdefault(choice.supplier_id,[]).append((line,choice,int(item_id)))
    for supplier_id, entries in groups.items():
        number = f"{request['request_number']}-{supplier_id}"
        po=session.execute(text("INSERT INTO purchase_orders(tenant_id,branch_id,supplier_id,po_number,order_date,status,notes,created_by,updated_by) VALUES(:tenant,:branch,:supplier,:number,:date,'DRAFT',:notes,:actor,:actor) RETURNING id"), {"tenant": str(current.tenant_id), "branch": str(request["branch_id"]), "supplier": supplier_id, "number": number, "date": date.today(), "notes": f"Approved from Purchase Request {request['request_number']}", "actor": str(current.actor_id)}).scalar_one()
        for seq,(line,choice,item_id) in enumerate(entries,1): session.execute(text("INSERT INTO purchase_order_lines(tenant_id,branch_id,purchase_order_id,item_id,line_no,ordered_qty,unit_cost,discount,gst_rate) VALUES(:tenant,:branch,:po,:item,:seq,:qty,:cost,0,0)"), {"tenant": str(current.tenant_id), "branch": str(request["branch_id"]), "po": po, "item": item_id, "seq": seq, "qty": line["ordered_qty"], "cost": choice.unit_cost})
        session.execute(text("INSERT INTO purchase_request_purchase_orders(tenant_id,branch_id,purchase_request_id,purchase_order_id) VALUES(:tenant,:branch,:request,:po)"), {"tenant": str(current.tenant_id), "branch": str(request["branch_id"]), "request": request_id, "po": po})
    session.execute(text("UPDATE purchase_requests SET status='APPROVED',approved_by=:actor,updated_at=now() WHERE id=:id"), {"actor": str(current.actor_id), "id": request_id}); _event(session,current,request_id,"APPROVED","Supplier selections approved")
    payload=_request(session,request_id); _audit(session,current,"PURCHASE_REQUEST_APPROVED","Purchase Request approved",{},payload); return payload
@router.post("/purchase-requests/{request_id}/commands/{command}")
def command(request_id: int, command: Literal["issue"], input: EmptyCommand, scope: ScopedTenant) -> dict[str, object]:
    session,current=scope; _admin(scope); request=_row(session,"purchase_requests",request_id,"PURCHASE_REQUEST_NOT_FOUND")
    if request["status"] != "APPROVED": raise auth_error("INVALID_PURCHASE_REQUEST_TRANSITION", status.HTTP_422_UNPROCESSABLE_ENTITY)
    session.execute(text("UPDATE purchase_orders SET status='SENT',updated_by=:actor,updated_at=now() WHERE id IN (SELECT purchase_order_id FROM purchase_request_purchase_orders WHERE purchase_request_id=:request)"), {"actor": str(current.actor_id), "request": request_id})
    session.execute(text("UPDATE purchase_requests SET status='ISSUED',updated_at=now() WHERE id=:id"), {"id": request_id}); _event(session,current,request_id,"ISSUED",input.reason.strip() or "Purchase Orders issued")
    payload=_request(session,request_id); _audit(session,current,"PURCHASE_REQUEST_ISSUED","Approved Purchase Orders issued",{},payload); return payload
