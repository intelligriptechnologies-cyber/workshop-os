# Candidate branch source evidence

Read using git show at 50c8aab1766b61c914e2829b460bfd1697723ec2; not checked out or executed. Committed example credential values/DSNs are redacted; live environment values were not exported.

## backend/app/database_auth.py

```text
"""Database credentials and revocable, same-origin browser sessions."""
from __future__ import annotations

import hashlib
import hmac
import re
import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, Request, Response, status
from pydantic import BaseModel, Field, model_validator
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.auth import auth_error
from app.config import get_settings
from app.database import get_session

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])
SESSION_COOKIE = "workshopos_session"
CSRF_COOKIE = "workshopos_csrf"
SESSION_SECONDS = 8 * 60 * 60
CODE_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]{1,62}$")


def hash_password(password: str, *, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 600_000)
    return f"pbkdf2_sha256$600000${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str | None) -> bool:
    try:
        scheme, rounds, salt, digest = (encoded or "").split("$")
        if scheme != "pbkdf2_sha256" or int(rounds) < 600_000:
            return False
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), int(rounds))
        return hmac.compare_digest(actual, bytes.fromhex(digest))
    except (ValueError, TypeError):
        return False


def _digest(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def _database_mode() -> None:
    if get_settings().auth_mode != "database":
        raise auth_error("AUTH_MODE_UNAVAILABLE", status.HTTP_404_NOT_FOUND)


def _code(code: str) -> str:
    code = code.strip().lower()
    if not CODE_PATTERN.fullmatch(code):
        raise auth_error("TENANT_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return code


class LoginInput(BaseModel):
    tenant_code: str | None = Field(default=None, alias="tenantCode")
    user_id: UUID | None = Field(default=None, alias="userId")
    email: str | None = None
    password: str

    @model_validator(mode="after")
    def require_one_identity(self):
        if (self.user_id is None) == (self.email is None):
            raise ValueError("Provide email or userId")
        if self.email is not None:
            self.email = self.email.strip().lower()
            if not self.email:
                raise ValueError("Email is required")
        return self


@router.get("/workshops")
def list_login_workshops(session: Session = Depends(get_session)) -> list[dict[str, str]]:
    _database_mode()
    rows = session.execute(text("""
        SELECT DISTINCT t.code, t.name
        FROM tenants t
        JOIN tenant_memberships m ON m.tenant_id = t.id AND m.status = 'ACTIVE'
        JOIN platform_users u ON u.id = m.user_id AND u.status = 'ACTIVE'
        WHERE t.code IS NOT NULL AND t.lifecycle_state IN ('trial', 'active', 'payment_due')
          AND u.password_hash IS NOT NULL
        ORDER BY t.name, t.code
    """)).mappings()
    return [{"code": row["code"], "name": row["name"]} for row in rows]


@router.get("/tenants/{code}/users")
def list_login_users(code: str, session: Session = Depends(get_session)) -> list[dict[str, str]]:
    _database_mode()
    rows = session.execute(text("""
        SELECT u.id, u.display_name
        FROM tenants t
        JOIN tenant_memberships m ON m.tenant_id = t.id AND m.status = 'ACTIVE'
        JOIN platform_users u ON u.id = m.user_id AND u.status = 'ACTIVE'
        WHERE lower(t.code) = :code AND t.lifecycle_state IN ('trial', 'active', 'payment_due')
          AND u.password_hash IS NOT NULL
        ORDER BY u.display_name, u.id
    """), {"code": _code(code)}).mappings()
    return [{"id": str(row["id"]), "name": row["display_name"]} for row in rows]


@router.post("/login")
def login(input: LoginInput, response: Response, session: Session = Depends(get_session)) -> dict[str, str]:
    _database_mode()
    configured_tenant = get_settings().database_tenant_code
    # Email sign-in is deployment scoped. A browser cannot choose its tenant.
    if input.email is not None:
        if not configured_tenant:
            raise auth_error("AUTH_CONFIGURATION_INVALID", status.HTTP_503_SERVICE_UNAVAILABLE)
        tenant_code = _code(configured_tenant)
        if input.tenant_code is not None and _code(input.tenant_code) != tenant_code:
            raise auth_error("INVALID_CREDENTIALS")
    else:
        tenant_code = _code(input.tenant_code or configured_tenant or "")
    identity_clause = "lower(u.email) = :identity" if input.email is not None else "u.id = CAST(:identity AS uuid)"
    with session.begin():
        session.execute(text("DELETE FROM database_sessions WHERE expires_at <= now()"))
        matches = session.execute(text(f"""
            SELECT t.id AS tenant_id, m.id AS membership_id, u.id AS user_id, u.password_hash
            FROM tenants t
            JOIN tenant_memberships m ON m.tenant_id = t.id AND m.status = 'ACTIVE'
            JOIN platform_users u ON u.id = m.user_id AND u.status = 'ACTIVE'
            WHERE lower(t.code) = :code AND {identity_clause}
              AND t.lifecycle_state IN ('trial', 'active', 'payment_due')
        """), {"code": tenant_code, "identity": input.email if input.email is not None else str(input.user_id)}).mappings().all()
        # Ambiguous imported identities must never choose an arbitrary account.
        row = matches[0] if len(matches) == 1 else None
        if not row or not verify_password(input.password, row["password_hash"]):
            raise auth_error("INVALID_CREDENTIALS")
        token, csrf = secrets.token_urlsafe(48), secrets.token_urlsafe(32)
        session.execute(text("""
            INSERT INTO database_sessions(token_hash, csrf_hash, tenant_id, user_id, membership_id, expires_at)
            VALUES (:token, :csrf, :tenant, :user, :membership, :expiry)
        """), {"token": _digest(token), "csrf": _digest(csrf), "tenant": str(row["tenant_id"]),
               "user": str(row["user_id"]), "membership": str(row["membership_id"]),
               "expiry": datetime.now(timezone.utc) + timedelta(seconds=SESSION_SECONDS)})
    secure = get_settings().environment != "local"
    response.set_cookie(SESSION_COOKIE, token, max_age=SESSION_SECONDS, httponly=True, secure=secure, samesite="lax", path="/")
    response.set_cookie(CSRF_COOKIE, csrf, max_age=SESSION_SECONDS, httponly=False, secure=secure, samesite="lax", path="/")
    return {"status": "ok"}


def database_identity(request: Request, session: Session) -> tuple[UUID, UUID, UUID]:
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        raise auth_error("AUTHENTICATION_REQUIRED")
    row = session.execute(text("""
        SELECT s.tenant_id, s.user_id, s.membership_id, s.csrf_hash
        FROM database_sessions s
        JOIN tenant_memberships m ON m.id = s.membership_id AND m.tenant_id = s.tenant_id AND m.user_id = s.user_id
        JOIN platform_users u ON u.id = s.user_id
        JOIN tenants t ON t.id = s.tenant_id
        WHERE s.token_hash = :token AND s.expires_at > now()
          AND m.status = 'ACTIVE' AND u.status = 'ACTIVE'
          AND t.lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended')
    """), {"token": _digest(token)}).mappings().one_or_none()
    if not row:
        raise auth_error("AUTHENTICATION_REQUIRED")
    if request.method not in ("GET", "HEAD", "OPTIONS"):
        csrf = request.headers.get("x-workshopos-csrf", "")
        if not csrf or not hmac.compare_digest(_digest(csrf), row["csrf_hash"]):
            raise auth_error("CSRF_INVALID", status.HTTP_403_FORBIDDEN)
    return UUID(str(row["user_id"])), UUID(str(row["tenant_id"])), UUID(str(row["membership_id"]))


@router.post("/logout")
def logout(request: Request, response: Response, session: Session = Depends(get_session)) -> dict[str, str]:
    _database_mode()
    database_identity(request, session)
    session.execute(text("DELETE FROM database_sessions WHERE token_hash = :token"),
                    {"token": _digest(request.cookies[SESSION_COOKIE])})
    session.commit()
    response.delete_cookie(SESSION_COOKIE, path="/")
    response.delete_cookie(CSRF_COOKIE, path="/")
    return {"status": "ok"}

```

## backend/app/media.py

```text
"""Shared media attached to tenant and branch job cards."""
from __future__ import annotations

import re
from typing import Annotated

from fastapi import APIRouter, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.tenancy import require_mutation_allowed

router = APIRouter(prefix="/api/v1/media", tags=["media"])
SAFE_SOURCE = re.compile(r"^data:image/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$")


class MediaInput(BaseModel):
    jobId: int = Field(gt=0)
    label: Annotated[str, Field(max_length=300)] = ""
    category: Annotated[str, Field(max_length=100)] = ""
    src: Annotated[str, Field(max_length=14_000_000)]


class MediaUpdate(BaseModel):
    label: Annotated[str, Field(max_length=300)]
    category: Annotated[str, Field(max_length=100)]


class ArchiveInput(BaseModel):
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


def _require(scope: ScopedTenant, write: bool = False) -> None:
    current = scope[1]
    if write:
        try:
            require_mutation_allowed(current)
        except PermissionError as error:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
    if current.actor_type == "support_emulation" and not write:
        return
    if f"page.media.{'write' if write else 'read'}" not in current.permissions:
        raise auth_error("PERMISSION_DENIED", status.HTTP_403_FORBIDDEN)


def _row(session, media_id: int):
    return session.execute(text("""
        SELECT m.*, j.job_no, v.number AS vehicle_no
        FROM job_media m JOIN job_cards j ON j.id=m.job_card_id
        JOIN visits i ON i.id=j.visit_id JOIN vehicles v ON v.id=i.vehicle_id
        WHERE m.id=:id
    """), {"id": media_id}).mappings().one_or_none()


def _payload(row):
    return {"id": row["id"], "jobId": row["job_card_id"], "jobNo": row["job_no"],
            "vehicleNo": row["vehicle_no"], "branchId": str(row["branch_id"]), "label": row["label"],
            "category": row["category"], "src": row["src"], "archivedAt": row["archived_at"],
            "createdAt": row["created_at"], "updatedAt": row["updated_at"]}


@router.get("")
def list_media(scope: ScopedTenant, job_id: int | None = Query(None, alias="jobId")):
    _require(scope)
    rows = scope[0].execute(text("""
        SELECT m.id FROM job_media m WHERE m.archived_at IS NULL
          AND (CAST(:job AS bigint) IS NULL OR m.job_card_id=:job)
        ORDER BY m.created_at DESC, m.id DESC
    """), {"job": job_id}).mappings()
    return [_payload(_row(scope[0], int(row["id"]))) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_media(input: MediaInput, scope: ScopedTenant):
    _require(scope, True)
    session, current = scope
    if not SAFE_SOURCE.fullmatch(input.src) and input.src != "/media-placeholder.svg":
        raise auth_error("INVALID_MEDIA_SOURCE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    job = session.execute(text("SELECT id,branch_id FROM job_cards WHERE id=:id AND archived_at IS NULL"),
                          {"id": input.jobId}).mappings().one_or_none()
    if not job:
        raise auth_error("JOB_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    media_id = session.execute(text("""INSERT INTO job_media(tenant_id,branch_id,job_card_id,label,category,src,created_by,updated_by)
        VALUES (:tenant,:branch,:job,:label,:category,:src,:actor,:actor) RETURNING id"""),
        {"tenant": str(current.tenant_id), "branch": str(job["branch_id"]), "job": input.jobId,
         "label": input.label.strip(), "category": input.category.strip(), "src": input.src,
         "actor": str(current.actor_id)}).scalar_one()
    return _payload(_row(session, media_id))


@router.put("/{media_id}")
def update_media(media_id: int, input: MediaUpdate, scope: ScopedTenant):
    _require(scope, True)
    row = scope[0].execute(text("""UPDATE job_media SET label=:label, category=:category, updated_by=:actor, updated_at=now()
        WHERE id=:id AND archived_at IS NULL RETURNING id"""),
        {"id": media_id, "label": input.label.strip(), "category": input.category.strip(),
         "actor": str(scope[1].actor_id)}).scalar_one_or_none()
    if row is None:
        raise auth_error("MEDIA_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return _payload(_row(scope[0], media_id))


@router.post("/{media_id}/archive")
def archive_media(media_id: int, input: ArchiveInput, scope: ScopedTenant):
    _require(scope, True)
    row = scope[0].execute(text("""UPDATE job_media SET archived_at=now(), archive_reason=:reason, updated_by=:actor, updated_at=now()
        WHERE id=:id AND archived_at IS NULL RETURNING id"""),
        {"id": media_id, "reason": input.reason.strip(), "actor": str(scope[1].actor_id)}).scalar_one_or_none()
    if row is None:
        raise auth_error("MEDIA_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return _payload(_row(scope[0], media_id))

```

## backend/app/procurement.py

```text
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
    material_shortage_id: int | None = Field(default=None, alias="materialShortageId", gt=0)
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
def _line(row: dict[str, object]) -> dict[str, object]: return {"id": row["id"], "itemId": row["item_id"], "newItemName": row["new_item_name"], "unit": row["unit"], "orderedQty": float(row["ordered_qty"]), "lineNo": row["line_no"], "materialShortageId": row.get("material_shortage_id")}
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
    rows = session.execute(text("SELECT id FROM purchase_requests WHERE (CAST(:branch AS uuid) IS NULL OR branch_id=:branch) ORDER BY created_at DESC,id DESC"), {"branch": str(branch_id) if branch_id else None}).mappings()
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
        if line.material_shortage_id:
            shortage = session.execute(text("SELECT * FROM material_shortages WHERE id=:id AND status='OPEN'"), {"id": line.material_shortage_id}).mappings().one_or_none()
            if shortage is None or int(shortage["item_id"]) != line.item_id or line.ordered_qty > float(shortage["shortage_qty"]): raise auth_error("MATERIAL_SHORTAGE_NOT_AUTHORIZED", status.HTTP_422_UNPROCESSABLE_ENTITY)
        unit = (line.unit or (str(item["unit"]) if item else "")).strip()
        if not unit: raise auth_error("NEW_ITEM_UNIT_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
        session.execute(text("INSERT INTO purchase_request_lines(tenant_id,branch_id,purchase_request_id,line_no,item_id,new_item_name,unit,ordered_qty,material_shortage_id) VALUES(:tenant,:branch,:request,:number,:item,:name,:unit,:qty,:shortage)"), {"tenant": str(current.tenant_id), "branch": str(branch), "request": request_id, "number": number, "item": line.item_id, "name": line.new_item_name.strip() if line.new_item_name else None, "unit": unit, "qty": line.ordered_qty, "shortage": line.material_shortage_id})
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
    session.execute(text("UPDATE material_shortages SET status='PROCURED',updated_at=now() WHERE id IN (SELECT material_shortage_id FROM purchase_request_lines WHERE purchase_request_id=:id AND material_shortage_id IS NOT NULL)"), {"id": request_id})
    payload=_request(session,request_id); _audit(session,current,"PURCHASE_REQUEST_APPROVED","Purchase Request approved",{},payload); return payload
@router.post("/purchase-requests/{request_id}/commands/{command}")
def command(request_id: int, command: Literal["issue"], input: EmptyCommand, scope: ScopedTenant) -> dict[str, object]:
    session,current=scope; _admin(scope); request=_row(session,"purchase_requests",request_id,"PURCHASE_REQUEST_NOT_FOUND")
    if request["status"] != "APPROVED": raise auth_error("INVALID_PURCHASE_REQUEST_TRANSITION", status.HTTP_422_UNPROCESSABLE_ENTITY)
    session.execute(text("UPDATE purchase_orders SET status='SENT',updated_by=:actor,updated_at=now() WHERE id IN (SELECT purchase_order_id FROM purchase_request_purchase_orders WHERE purchase_request_id=:request)"), {"actor": str(current.actor_id), "request": request_id})
    session.execute(text("UPDATE purchase_requests SET status='ISSUED',updated_at=now() WHERE id=:id"), {"id": request_id}); _event(session,current,request_id,"ISSUED",input.reason.strip() or "Purchase Orders issued")
    payload=_request(session,request_id); _audit(session,current,"PURCHASE_REQUEST_ISSUED","Approved Purchase Orders issued",{},payload); return payload

```

## deploy/compose.staging.yaml

```text
name: workshopos-staging

# Caddy is the sole public ingress. It reaches frontend:80 through the external
# workshopos-staging-proxy network; api and db deliberately have no host ports.
services:
  frontend:
    build:
      context: ..
      dockerfile: deploy/Dockerfile.staging
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    networks:
      workshopos-staging-proxy:
        aliases:
          - workshopos-frontend
      workshopos-staging-private:
    labels:
      com.workshopos.stack: staging
      com.workshopos.service: frontend

  api:
    build:
      context: ..
      dockerfile: Dockerfile.local
    restart: unless-stopped
    # This file is owned by the deployment operator and must never be committed.
    # It supplies only the WORKSHOPOS_* Cognito and database values.
    env_file:
      - path: ${WORKSHOPOS_STAGING_API_ENV_FILE:-/opt/workshop/staging/secrets/workshopos-api.env}
        required: true
    environment:
      WORKSHOPOS_ENVIRONMENT: staging
      WORKSHOPOS_AUTH_MODE: cognito
      WORKSHOPOS_ALLOW_DEMO_AUTH: "false"
    depends_on:
      db:
        condition: service_healthy
    networks:
      workshopos-staging-private:
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=2)"]
      interval: 10s
      timeout: 5s
      retries: 12
      start_period: 30s
    labels:
      com.workshopos.stack: staging
      com.workshopos.service: api

  db:
    image: postgres:17-alpine
    restart: unless-stopped
    env_file:
      # Keep database bootstrap credentials out of the API/Cognito environment.
      - path: ${WORKSHOPOS_STAGING_DB_ENV_FILE:-/opt/workshop/staging/secrets/workshopos-db.env}
        required: true
    volumes:
      - workshopos-staging-postgres:/var/lib/postgresql/data
    networks:
      workshopos-staging-private:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \"$$POSTGRES_USER\" -d \"$$POSTGRES_DB\""]
      interval: 5s
      timeout: 5s
      retries: 20
    labels:
      com.workshopos.stack: staging
      com.workshopos.service: db

volumes:
  workshopos-staging-postgres:
    name: workshopos-staging-postgres-data
    labels:
      com.workshopos.stack: staging

networks:
  # Managed by the existing Caddy deployment. Only frontend joins it.
  workshopos-staging-proxy:
    external: true
    name: workshopos-staging-proxy
  # Project-private traffic between frontend, API, and PostgreSQL. It has no
  # host-published services; API retains outbound access required for Cognito
  # token/JWKS validation.
  workshopos-staging-private:
    name: workshopos-staging-private

```

## deploy/nginx.staging.conf

```text
server {
    listen 80;
    listen [::]:80;

    root /app/dist;
    index index.html;

    location = /sw.js {
        add_header Cache-Control "no-cache" always;
        try_files $uri =404;
    }

    # Browser-safe auth configuration and all API requests are served by the
    # private FastAPI container. Demo auth is unavailable in staging.
    location /api/ {
        proxy_pass http://api:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /health {
        proxy_pass http://api:8000/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}

```

## deploy/compose.database-auth.yaml

```text
# Opt-in cutover overlay. Keep compose.staging.yaml on Cognito until the
# bundled import has been verified and an operator chooses the cutover window.
services:
  api:
    environment:
      WORKSHOPOS_AUTH_MODE: database

```

## deploy/DATABASE_AUTH_CUTOVER.md

```text
# Database login cutover

The staging frontend already proxies `/api/` to FastAPI on the same origin.
`compose.staging.yaml` continues to use Cognito. This overlay is an explicit
cutover choice and does not change an existing deployment on its own.
Database authentication applies to the entire API instance. Before selecting
the overlay, assign codes and password hashes to every existing tenant/user
who must retain login access. Cognito users without hashes cannot use database
login. Keep the original Compose mode if that preparation is incomplete.

Before switching, deploy the code, let Alembic reach `head`, and retain a
database backup. Run these commands on the selected host with its configured
staging environment files. Restrict the backup directory to the operator.

```sh
set -eu
export WORKSHOPOS_STAGING_API_ENV_FILE=/opt/workshop/staging/secrets/workshopos-api.env
export WORKSHOPOS_STAGING_DB_ENV_FILE=/opt/workshop/staging/secrets/workshopos-db.env
install -d -m 700 /opt/workshop/staging/backups
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging up -d --build
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging exec -T db \
  sh -c 'pg_dump -Fc -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
  > /opt/workshop/staging/backups/before-database-auth.dump
chmod 600 /opt/workshop/staging/backups/before-database-auth.dump
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging run --rm --no-deps -T \
  -v "$PWD/public/workshopos-demo.sqlite:/app/public/workshopos-demo.sqlite:ro" api \
  python scripts/import_bundled_demo.py
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging run --rm --no-deps -T \
  -v "$PWD/public/workshopos-demo.sqlite:/app/public/workshopos-demo.sqlite:ro" api \
  python scripts/import_bundled_demo.py --apply
docker compose -f deploy/compose.staging.yaml -f deploy/compose.database-auth.yaml \
  --project-name workshopos-staging up -d --build
```

The importer refuses to merge into an existing `demo` tenant with a different
checksum, and a repeat import of the same bundled file changes nothing. Check
the dry-run relationship errors, archive-only counts, and legacy invoice
discrepancies before applying. Other tenants are never imported into. The
SQLite source is mounted read-only only for these one-off commands; it is not
included in the API image.

The 2026-10-19 rehearsal used source SHA-256
`04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae`
in a separate PostgreSQL database. The [reconciliation report](reports/bundled-demo-rehearsal-20261019.json)
checks all 60 source tables, 16 losslessly archived rows, mapped operational
records, representative key fields, stock balances, and relationships. It
passed. The source has 51 legacy invoice subtotal/line discrepancies; review
their immutable imported document snapshots before any production cutover.

The local development database currently contains an older `demo` import with
a different source checksum. The importer deliberately leaves it untouched.
Replacing it needs a tenant-scoped transactional replacement after UI parity
and a fresh backup; do not use a whole-database truncate because other tenants
may exist.

After cutover, verify `/api/v1/auth/config` reports `database`, list the
`demo` users, sign in, create and refresh a lead in two browsers, and verify
logout ends API access. Keep the backup until operational data is reconciled.

To switch authentication back to Cognito, start only the original Compose
file. This changes the API mode without restoring the database. If a database
restore is needed, take a separate backup of post-cutover writes first and
restore the earlier dump during a maintenance window; restoring it discards
those writes.

```

## backend/alembic/archive/pre_merge_backend_lineage/README.md

```text
# Pre-merge migration lineage archive

These revision files are retained as historical evidence of the backend
lineage that existed before the `Prem-dev-fbb` merge. They are intentionally
outside Alembic's active `versions` location.

The merged application uses the `20261001_0002` execution/QC lineage and its
successors. The archived September execution, finance, and follow-up lineage
creates the same domain tables through incompatible revisions, so loading both
lineages would create duplicate tables on a fresh database. The archived
October foundation also duplicated the active September foundation revision
identifier after the merge.

The archived `20261002_0013` finance-corrections revision duplicates the
active `20261001_0006` finance-corrections migration. Service-department
routing now follows the active revision directly, so a clean database does
not attempt to remove the same finance constraint twice.

Keeping these files out of the active graph preserves the merge history while
leaving one executable migration path for new Compose and staging databases.
This repository's agreed cutover assumption is a fresh, disposable staging
database; a database stamped at an archived revision needs a separately
planned reconciliation before it can be upgraded.

```

## .github/workflows/deploy-staging.yml

```text
name: Deploy staging

on:
  push:
    branches:
      - Prem-dev-fbb
      - prem-dev-fbb-backend
  workflow_dispatch:

concurrency:
  group: workshopos-staging
  cancel-in-progress: false

permissions:
  contents: read

jobs:
  verify:
    uses: ./.github/workflows/verify.yml

  deploy:
    needs: verify
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          ref: ${{ github.sha }}

      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
        with:
          node-version: 20
          cache: npm

      - name: Install and build
        run: |
          npm ci
          npm run build

      - name: Validate staging environment secrets
        env:
          WORKSHOPOS_STAGING_API_ENV: ${{ secrets.WORKSHOPOS_STAGING_API_ENV }}
          WORKSHOPOS_STAGING_DB_ENV: ${{ secrets.WORKSHOPOS_STAGING_DB_ENV }}
        run: |
          set -euo pipefail
          if [[ -z "$WORKSHOPOS_STAGING_API_ENV" || -z "$WORKSHOPOS_STAGING_DB_ENV" ]]; then
            echo "Required staging environment secrets are missing or empty."
            exit 1
          fi
          if [[ "$WORKSHOPOS_STAGING_API_ENV" == *REPLACE_WITH_* || "$WORKSHOPOS_STAGING_DB_ENV" == *REPLACE_WITH_* ]]; then
            echo "Staging environment secrets still contain template placeholders."
            exit 1
          fi
          python3 - <<'PY'
          import os
          from urllib.parse import unquote, urlsplit

          def assignment(contents: str, name: str) -> str:
              for line in contents.splitlines():
                  if line.startswith(f"{name}="):
                      return line.split("=", 1)[1]
              raise SystemExit("Staging environment secrets are missing required database credentials.")

          database_url = assignment(os.environ["WORKSHOPOS_STAGING_API_ENV"], "WORKSHOPOS_DATABASE_URL")
          postgres_password = assignment(os.environ["WORKSHOPOS_STAGING_DB_ENV"], "POSTGRES_PASSWORD")
          api_password = unquote(urlsplit(database_url).password or "")
          if not api_password or not postgres_password:
              raise SystemExit("Staging environment secrets must contain non-empty database passwords.")
          if api_password != postgres_password:
              raise SystemExit("Staging API and database secrets use different database passwords.")
          PY

      - name: Configure SSH
        env:
          HETZNER_DEPLOY_KEY: ${{ secrets.HETZNER_DEPLOY_KEY }}
          HETZNER_KNOWN_HOSTS: ${{ secrets.HETZNER_KNOWN_HOSTS }}
        run: |
          install -d -m 700 ~/.ssh
          printf '%s\n' "$HETZNER_DEPLOY_KEY" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          printf '%s\n' "$HETZNER_KNOWN_HOSTS" > ~/.ssh/known_hosts
          chmod 644 ~/.ssh/known_hosts

      - name: Provision staging Compose environment files
        env:
          HETZNER_HOST: ${{ secrets.HETZNER_HOST }}
          HETZNER_USER: ${{ secrets.HETZNER_USER }}
          WORKSHOPOS_STAGING_API_ENV: ${{ secrets.WORKSHOPOS_STAGING_API_ENV }}
          WORKSHOPOS_STAGING_DB_ENV: ${{ secrets.WORKSHOPOS_STAGING_DB_ENV }}
        run: |
          set -euo pipefail
          write_secret() {
            local contents="$1"
            local target="$2"
            printf '%s' "$contents" | ssh -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519 "$HETZNER_USER@$HETZNER_HOST" "
              set -euo pipefail
              install -d -m 700 /opt/workshop/staging/secrets
              umask 077
              temporary=\$(mktemp /opt/workshop/staging/secrets/.${target}.XXXXXX)
              trap 'rm -f \"\$temporary\"' EXIT
              cat > \"\$temporary\"
              chmod 600 \"\$temporary\"
              mv -f \"\$temporary\" /opt/workshop/staging/secrets/${target}
              trap - EXIT
            "
          }
          write_secret "$WORKSHOPOS_STAGING_API_ENV" workshopos-api.env
          write_secret "$WORKSHOPOS_STAGING_DB_ENV" workshopos-db.env

      - name: Deploy staging source
        env:
          HETZNER_HOST: ${{ secrets.HETZNER_HOST }}
          HETZNER_USER: ${{ secrets.HETZNER_USER }}
        run: |
          ssh -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519 "$HETZNER_USER@$HETZNER_HOST" <<'REMOTE'
            set -euo pipefail
            cd /opt/workshop/staging/source
            git fetch origin Prem-dev-fbb
            git checkout --detach '${{ github.sha }}'
            WORKSHOPOS_STAGING_API_ENV_FILE=/opt/workshop/staging/secrets/workshopos-api.env \
            WORKSHOPOS_STAGING_DB_ENV_FILE=/opt/workshop/staging/secrets/workshopos-db.env \
              docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging config --quiet
            docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging up -d --build
            docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging ps
          REMOTE

```

## Dockerfile.local

```text
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app

EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

```

## compose.yaml

```text
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: workshopos
      POSTGRES_USER: workshopos_admin
      POSTGRES_PASSWORD: <REDACTED>
    # The database is reachable from this development machine only. Containers
    # use the private Compose network and address it as `db`.
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - workshopos_postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U workshopos_admin -d workshopos"]
      interval: 2s
      timeout: 5s
      retries: 20

  api:
    build:
      context: .
      dockerfile: Dockerfile.local
    environment:
      WORKSHOPOS_DATABASE_URL: <REDACTED DSN>
      WORKSHOPOS_ENVIRONMENT: local
      WORKSHOPOS_AUTH_MODE: database
      WORKSHOPOS_DATABASE_TENANT_CODE: demo
    ports:
      - "127.0.0.1:8000:8000"
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=2)"]
      interval: 3s
      timeout: 5s
      retries: 30

volumes:
  workshopos_postgres:

```
