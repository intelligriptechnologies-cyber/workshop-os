"""Admin-only, tenant/branch-scoped sales leads and quotations."""
from __future__ import annotations

import json
from datetime import date
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.intake import _branch
from app.tenancy import require_mutation_allowed
from app.tenant_admin import _audit

router = APIRouter(prefix="/api/v1/sales", tags=["sales-crm"])
LeadStage = Literal["NEW", "QUALIFIED", "QUOTATION_SENT", "WON", "LOST"]
Temperature = Literal["HOT", "WARM", "COLD"]
QuotationStatus = Literal["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]


class ApiModel(BaseModel): model_config = ConfigDict(populate_by_name=True)
class LeadInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    display_name: Annotated[str, Field(min_length=1, max_length=300)] = Field(alias="displayName")
    phone: Annotated[str, Field(min_length=1, max_length=80)]
    company: Annotated[str, Field(max_length=300)] = ""
    email: Annotated[str, Field(max_length=320)] = ""
    address: Annotated[str, Field(max_length=2000)] = ""
    service_interest: Annotated[str, Field(max_length=1000)] = Field(default="", alias="serviceInterest")
    notes: Annotated[str, Field(max_length=4000)] = ""
    stage: LeadStage = "NEW"; temperature: Temperature = "WARM"
    follow_up_due: date | None = Field(default=None, alias="followUpDue")
    site_visit_completed: bool = Field(default=False, alias="siteVisitCompleted")
    site_visit_date: date | None = Field(default=None, alias="siteVisitDate")
class QuotationLine(ApiModel):
    kind: Annotated[str, Field(min_length=1, max_length=80)] = "Service"
    description: Annotated[str, Field(min_length=1, max_length=1000)]
    quantity: Annotated[float, Field(gt=0, le=100000)]
    rate: Annotated[float, Field(ge=0, le=100000000)]
    gst_rate: Annotated[float, Field(ge=0, le=100)] = Field(default=18, alias="gstRate")
class QuotationInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    lead_id: Annotated[int, Field(gt=0)] = Field(alias="leadId")
    valid_until: date | None = Field(default=None, alias="validUntil")
    customer_notes: Annotated[str, Field(max_length=4000)] = Field(default="", alias="customerNotes")
    discount: Annotated[float, Field(ge=0, le=100000000)] = 0
    template_id: Annotated[str, Field(min_length=1, max_length=200)] = Field(alias="templateId")
    template_html: Annotated[str, Field(min_length=1, max_length=100000)] = Field(alias="templateHtml")
    lines: Annotated[list[QuotationLine], Field(min_length=1, max_length=250)]
class StatusInput(ApiModel): status: QuotationStatus


def _admin(scope: ScopedTenant, mutation: bool = False):
    _, current = scope
    if current.actor_type == "support_emulation":
        if mutation: raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN)
        return current
    if not any(name == "Owner/Admin" for _, name, _ in current.roles):
        raise auth_error("SALES_CRM_ADMIN_REQUIRED", status.HTTP_403_FORBIDDEN)
    if mutation:
        try: require_mutation_allowed(current)
        except PermissionError as error: raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
    return current

def _lead(row):
    return {"id": row["id"], "branchId": str(row["branch_id"]), "displayName": row["display_name"], "phone": row["phone"], "company": row["company"], "email": row["email"], "address": row["address"], "serviceInterest": row["service_interest"], "notes": row["notes"], "stage": row["stage"], "temperature": row["temperature"], "followUpDue": row["follow_up_due"], "siteVisitCompleted": row["site_visit_completed"], "siteVisitDate": row["site_visit_date"], "createdAt": row["created_at"], "updatedAt": row["updated_at"]}
def _quotation(session, row):
    lines = [{"id": x["id"], "kind": x["kind"], "description": x["description"], "quantity": float(x["quantity"]), "rate": float(x["rate"]), "gstRate": float(x["gst_rate"])} for x in session.execute(text("SELECT * FROM quotation_lines WHERE quotation_id=:id ORDER BY line_no"), {"id": row["id"]}).mappings()]
    return {"id": row["id"], "branchId": str(row["branch_id"]), "leadId": row["lead_id"], "quotationNo": row["quotation_no"], "status": row["status"], "validUntil": row["valid_until"], "customerNotes": row["customer_notes"], "discount": float(row["discount"]), "subtotal": float(row["subtotal"]), "gstAmount": float(row["gst_amount"]), "total": float(row["total"]), "templateId": row["template_id"], "createdAt": row["created_at"], "updatedAt": row["updated_at"], "lines": lines}
def _totals(lines, discount):
    subtotal = sum(line.quantity * line.rate for line in lines); net = max(0, subtotal - discount)
    gst = sum(max(0, line.quantity * line.rate - (discount * (line.quantity * line.rate / subtotal) if subtotal else 0)) * line.gst_rate / 100 for line in lines)
    return subtotal, gst, net + gst
def _snapshot(input, lead, subtotal, gst, total):
    return json.dumps({"templateId": input.template_id, "templateHtml": input.template_html, "leadName": lead["display_name"], "phone": lead["phone"], "validUntil": str(input.valid_until) if input.valid_until else None, "customerNotes": input.customer_notes.strip(), "discount": input.discount, "subtotal": subtotal, "gstAmount": gst, "total": total, "lines": [{"kind": line.kind, "description": line.description, "quantity": line.quantity, "rate": line.rate, "gstRate": line.gst_rate} for line in input.lines]})

@router.get("/leads")
def list_leads(scope: ScopedTenant, q: str = "", stage: LeadStage | None = None, temperature: Temperature | None = None, exact_date: date | None = Query(None, alias="exactDate"), month: str | None = None, branch_id: UUID | None = Query(None, alias="branchId")):
    current = _admin(scope); branch = _branch(current, branch_id) if branch_id else None
    rows = scope[0].execute(text("""SELECT * FROM sales_leads WHERE (:branch IS NULL OR branch_id=:branch) AND (:stage IS NULL OR stage=:stage) AND (:temperature IS NULL OR temperature=:temperature) AND (:exact IS NULL OR follow_up_due=:exact) AND (:exact IS NOT NULL OR :month IS NULL OR to_char(follow_up_due,'YYYY-MM')=:month) AND (:q='' OR display_name ILIKE :like OR company ILIKE :like OR phone ILIKE :like) ORDER BY created_at DESC"""), {"branch":str(branch) if branch else None,"stage":stage,"temperature":temperature,"exact":exact_date,"month":month,"q":q.strip(),"like":f"%{q.strip()}%"}).mappings()
    return [_lead(row) for row in rows]
@router.post("/leads", status_code=status.HTTP_201_CREATED)
def create_lead(input: LeadInput, scope: ScopedTenant):
    session,current=scope; branch=_branch(_admin(scope, True), input.branch_id)
    row=session.execute(text("""INSERT INTO sales_leads(tenant_id,branch_id,display_name,phone,company,email,address,service_interest,notes,stage,temperature,follow_up_due,site_visit_completed,site_visit_date,created_by,updated_by) VALUES (:tenant,:branch,:name,:phone,:company,:email,:address,:interest,:notes,:stage,:temperature,:due,:visited,:visit_date,:actor,:actor) RETURNING *"""), {"tenant":str(current.tenant_id),"branch":str(branch),"name":input.display_name.strip(),"phone":input.phone.strip(),"company":input.company.strip(),"email":input.email.strip(),"address":input.address.strip(),"interest":input.service_interest.strip(),"notes":input.notes.strip(),"stage":input.stage,"temperature":input.temperature,"due":input.follow_up_due,"visited":input.site_visit_completed,"visit_date":input.site_visit_date,"actor":str(current.actor_id)}).mappings().one()
    payload=_lead(row); _audit(session,current,"SALES_LEAD_CREATED","Sales lead created",{},payload); return payload
@router.put("/leads/{lead_id}")
def update_lead(lead_id:int,input:LeadInput,scope:ScopedTenant):
    session,current=scope; branch=_branch(_admin(scope, True),input.branch_id); before=session.execute(text("SELECT * FROM sales_leads WHERE id=:id"),{"id":lead_id}).mappings().one_or_none()
    if not before: raise auth_error("LEAD_NOT_FOUND",404)
    row=session.execute(text("""UPDATE sales_leads SET branch_id=:branch,display_name=:name,phone=:phone,company=:company,email=:email,address=:address,service_interest=:interest,notes=:notes,stage=:stage,temperature=:temperature,follow_up_due=:due,site_visit_completed=:visited,site_visit_date=:visit_date,updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *"""), {"id":lead_id,"branch":str(branch),"name":input.display_name.strip(),"phone":input.phone.strip(),"company":input.company.strip(),"email":input.email.strip(),"address":input.address.strip(),"interest":input.service_interest.strip(),"notes":input.notes.strip(),"stage":input.stage,"temperature":input.temperature,"due":input.follow_up_due,"visited":input.site_visit_completed,"visit_date":input.site_visit_date,"actor":str(current.actor_id)}).mappings().one(); payload=_lead(row); _audit(session,current,"SALES_LEAD_UPDATED","Sales lead updated",_lead(before),payload); return payload

@router.get("/quotations")
def list_quotations(scope:ScopedTenant,q:str="",quotation_status:QuotationStatus|None=Query(None,alias="status"),exact_date:date|None=Query(None,alias="exactDate"),month:str|None=None,branch_id:UUID|None=Query(None,alias="branchId")):
    current=_admin(scope); branch=_branch(current,branch_id) if branch_id else None
    rows=scope[0].execute(text("""SELECT q.* FROM quotations q JOIN sales_leads l ON l.id=q.lead_id WHERE (:branch IS NULL OR q.branch_id=:branch) AND (:status IS NULL OR q.status=:status) AND (:exact IS NULL OR q.valid_until=:exact) AND (:exact IS NOT NULL OR :month IS NULL OR to_char(q.valid_until,'YYYY-MM')=:month) AND (:q='' OR q.quotation_no ILIKE :like OR l.display_name ILIKE :like OR l.company ILIKE :like) ORDER BY q.created_at DESC"""),{"branch":str(branch) if branch else None,"status":quotation_status,"exact":exact_date,"month":month,"q":q.strip(),"like":f"%{q.strip()}%"}).mappings(); return [_quotation(scope[0],row) for row in rows]
@router.post("/quotations",status_code=status.HTTP_201_CREATED)
def create_quotation(input:QuotationInput,scope:ScopedTenant):
    session,current=scope; branch=_branch(_admin(scope,True),input.branch_id); lead=session.execute(text("SELECT * FROM sales_leads WHERE id=:id"),{"id":input.lead_id}).mappings().one_or_none()
    if not lead or str(lead["branch_id"])!=str(branch): raise auth_error("LEAD_NOT_AVAILABLE",422)
    subtotal,gst,total=_totals(input.lines,input.discount)
    row=session.execute(text("""INSERT INTO quotations(tenant_id,branch_id,lead_id,quotation_no,valid_until,customer_notes,discount,subtotal,gst_amount,total,template_id,template_html,document_snapshot,created_by,updated_by) VALUES (:tenant,:branch,:lead,'PENDING',:valid,:notes,:discount,:subtotal,:gst,:total,:template_id,:template_html,CAST(:snapshot AS jsonb),:actor,:actor) RETURNING *"""),{"tenant":str(current.tenant_id),"branch":str(branch),"lead":input.lead_id,"valid":input.valid_until,"notes":input.customer_notes.strip(),"discount":input.discount,"subtotal":subtotal,"gst":gst,"total":total,"template_id":input.template_id,"template_html":input.template_html,"snapshot":_snapshot(input,lead,subtotal,gst,total),"actor":str(current.actor_id)}).mappings().one()
    row=session.execute(text("UPDATE quotations SET quotation_no=:number WHERE id=:id RETURNING *"),{"id":row["id"],"number":f"QT-{int(row['id']):06d}"}).mappings().one()
    for no,line in enumerate(input.lines,1): session.execute(text("INSERT INTO quotation_lines(tenant_id,branch_id,quotation_id,line_no,kind,description,quantity,rate,gst_rate) VALUES (:tenant,:branch,:quotation,:no,:kind,:description,:quantity,:rate,:gst)"),{"tenant":str(current.tenant_id),"branch":str(branch),"quotation":row["id"],"no":no,"kind":line.kind.strip(),"description":line.description.strip(),"quantity":line.quantity,"rate":line.rate,"gst":line.gst_rate})
    session.execute(text("UPDATE sales_leads SET stage='QUOTATION_SENT',updated_by=:actor,updated_at=now() WHERE id=:id"),{"id":input.lead_id,"actor":str(current.actor_id)})
    payload=_quotation(session,row); _audit(session,current,"QUOTATION_CREATED",f"Quotation {row['quotation_no']} created",{},payload); return payload
@router.put("/quotations/{quotation_id}")
def update_quotation(quotation_id:int,input:QuotationInput,scope:ScopedTenant):
    """Only a draft may be amended; regenerated values remain a fresh frozen snapshot."""
    session,current=scope; branch=_branch(_admin(scope,True),input.branch_id); before=session.execute(text("SELECT * FROM quotations WHERE id=:id"),{"id":quotation_id}).mappings().one_or_none()
    if not before: raise auth_error("QUOTATION_NOT_FOUND",404)
    if before["status"] != "DRAFT": raise auth_error("QUOTATION_NOT_EDITABLE",422)
    before_payload = _quotation(session, before)
    lead=session.execute(text("SELECT * FROM sales_leads WHERE id=:id"),{"id":input.lead_id}).mappings().one_or_none()
    if not lead or str(lead["branch_id"]) != str(branch): raise auth_error("LEAD_NOT_AVAILABLE",422)
    subtotal,gst,total=_totals(input.lines,input.discount)
    row=session.execute(text("""UPDATE quotations SET branch_id=:branch,lead_id=:lead,valid_until=:valid,customer_notes=:notes,discount=:discount,subtotal=:subtotal,gst_amount=:gst,total=:total,template_id=:template_id,template_html=:template_html,document_snapshot=CAST(:snapshot AS jsonb),updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *"""),{"id":quotation_id,"branch":str(branch),"lead":input.lead_id,"valid":input.valid_until,"notes":input.customer_notes.strip(),"discount":input.discount,"subtotal":subtotal,"gst":gst,"total":total,"template_id":input.template_id,"template_html":input.template_html,"snapshot":_snapshot(input,lead,subtotal,gst,total),"actor":str(current.actor_id)}).mappings().one()
    session.execute(text("DELETE FROM quotation_lines WHERE quotation_id=:id"),{"id":quotation_id})
    for no,line in enumerate(input.lines,1): session.execute(text("INSERT INTO quotation_lines(tenant_id,branch_id,quotation_id,line_no,kind,description,quantity,rate,gst_rate) VALUES (:tenant,:branch,:quotation,:no,:kind,:description,:quantity,:rate,:gst)"),{"tenant":str(current.tenant_id),"branch":str(branch),"quotation":quotation_id,"no":no,"kind":line.kind.strip(),"description":line.description.strip(),"quantity":line.quantity,"rate":line.rate,"gst":line.gst_rate})
    payload=_quotation(session,row); _audit(session,current,"QUOTATION_UPDATED",f"Quotation {row['quotation_no']} updated",before_payload,payload); return payload
@router.post("/quotations/{quotation_id}/status")
def change_status(quotation_id:int,input:StatusInput,scope:ScopedTenant):
    session,current=scope; _admin(scope,True); row=session.execute(text("SELECT * FROM quotations WHERE id=:id"),{"id":quotation_id}).mappings().one_or_none()
    if not row: raise auth_error("QUOTATION_NOT_FOUND",404)
    if row["status"] in ("ACCEPTED","REJECTED","EXPIRED") and row["status"] != input.status: raise auth_error("QUOTATION_FINAL",422)
    changed=session.execute(text("UPDATE quotations SET status=:status,updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *"),{"id":quotation_id,"status":input.status,"actor":str(current.actor_id)}).mappings().one()
    if input.status=="ACCEPTED": session.execute(text("UPDATE sales_leads SET stage='WON',updated_by=:actor,updated_at=now() WHERE id=:id"),{"id":row["lead_id"],"actor":str(current.actor_id)})
    return _quotation(session,changed)
@router.get("/quotations/{quotation_id}/document")
def quotation_document(quotation_id:int,scope:ScopedTenant):
    session, _ = scope; _admin(scope); row=session.execute(text("SELECT document_snapshot,quotation_no FROM quotations WHERE id=:id"),{"id":quotation_id}).mappings().one_or_none()
    if not row: raise auth_error("QUOTATION_NOT_FOUND",404)
    return {"quotationNo":row["quotation_no"],"snapshot":dict(row["document_snapshot"])}
