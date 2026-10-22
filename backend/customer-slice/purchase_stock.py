"""Purchase and signed-stock parity. All mutations share the scoped command lock."""
import math,re
from uuid import uuid4
from datetime import datetime,timezone
from decimal import Decimal
from fastapi import APIRouter,Request
from pydantic import BaseModel,ConfigDict,Field
from sqlalchemy import text
from api import fail
from operations import command,row,mutable,insert,update_fields,reconcile_artifacts,history
router=APIRouter(prefix='/api/v1')
class StockCommand(BaseModel):
    model_config=ConfigDict(extra='forbid',allow_inf_nan=False)
    action:str
    id:int|None=None
    version:int|None=None
    values:dict=Field(default_factory=dict)
def now():return datetime.now(timezone.utc)
def rows(c,t,where='true',**args):return [dict(r) for r in c.execute(text(f'SELECT * FROM {t} WHERE {where} ORDER BY id'),args).mappings()]
def number(v,minimum=0,positive=False):
    try:n=float(v)
    except (ValueError,TypeError):fail('A numeric value is required.',422)
    if not math.isfinite(n) or n<minimum or positive and n==0:fail('Invalid quantity or amount.',422)
    return n
def clean(v):return str(v or '').strip()
def require(ok,message):
    if not ok:fail(message,422)
def role(u,*roles):
    if u['role'] not in roles:fail('This action is not permitted for your role.',403)
def dated(v):
    require(bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}',str(v))),'A valid date is required.')
    try:datetime.strptime(v,'%Y-%m-%d')
    except ValueError:fail('A valid date is required.',422)
    return v
def stamp(u):return dict(created_by=u['user_id'],updated_by=u['user_id'],created_at=now(),updated_at=now())
def change(c,u,t,id,**values):return dict(update_fields(c,t,id,values))
def item(c,id):
    r=row(c,'catalogue_items',id);require(not r['archived_at'],'Inventory item is archived.');return r
def balance(c,id):
    item(c,id)
    return float(c.scalar(text("SELECT coalesce(stock_qty,0)-coalesce((SELECT sum(qty) FROM stock_ledger WHERE item_id=:id),0)-coalesce((SELECT sum((values->>'qty')::numeric) FROM slice_historical_stock WHERE source_table='stock_ledger' AND (values->>'item_id')::bigint=:id),0) FROM catalogue_items WHERE id=:id"),{'id':id}))
def ledger(c,u,id,qty,kind,note,job=None,material=None,purchase_line=None):
    qty=float(qty)
    if not qty:return None
    require(balance(c,id)-qty>=-1e-9,'Insufficient stock; this operation would make stock negative.')
    change(c,u,'catalogue_items',id,updated_by=u['user_id'],updated_at=now())
    return insert(c,'stock_ledger',dict(item_id=id,quantity=-qty,qty=qty,entry_type='INWARD' if qty<0 else 'ISSUE',unit_cost=0,reason=note,actor_id=u['user_id'],created_at=now(),job_card_id=job,material_row_id=material,type=kind,by_user=u['profile_id'],at=now().isoformat(),note=note,inward_purchase_line_id=purchase_line))['id']
def movement(c,u,id,kind,qty,note,job=None):
    return insert(c,'legacy_material_movements',dict(job_card_id=job,item_id=id,direction=kind,qty=qty,note=note,created_at=now().isoformat()))
def supplier(c,id):
    s=row(c,'suppliers',id);require(s['status']=='Active','Select an active supplier.');return s
def inventory(c,u,v):
    fields={k:clean(v.get(k)) for k in ['sku','category','name','unit']}
    require(all(fields.values()),'SKU, category, name and unit are required.')
    fields.update(low_stock_qty=number(v.get('low_stock_qty',0)),selling_price=number(v.get('selling_price',0)))
    return fields
def new_item(c,u,v):
    f=inventory(c,u,v)
    require(not c.scalar(text('SELECT EXISTS(SELECT 1 FROM catalogue_items WHERE upper(sku)=upper(:s))'),{'s':f['sku']}),'SKU already exists.')
    return insert(c,'catalogue_items',dict(**f,stock_qty=number(v.get('stock_qty',0)),**stamp(u)))
def po_lines(c,id):return rows(c,'purchase_order_lines','purchase_order_id=:p AND archived_at IS NULL',p=id)
def po_status(c,u,p,status):
    native={'PO Request':'DRAFT','PO Request Approved':'DRAFT','PO Issued':'SENT','PO Received':'PARTIALLY_RECEIVED','PO Confirmation':'READY_TO_CLOSE','Closed':'CLOSED','Cancelled':'CANCELLED','Draft':'DRAFT','Sent':'SENT','Partially Received':'PARTIALLY_RECEIVED','Ready to Close':'READY_TO_CLOSE'}[status]
    return change(c,u,'purchase_orders',p['id'],ui_status=status,status=native,updated_by=u['user_id'],updated_at=now())
def po_ordinal(number):
    m=re.fullmatch(r'PO-WOS-([A-Z]+)-(\d{5})',number)
    if not m:return -1
    letters=0
    for letter in m[1]:letters=letters*26+ord(letter)-64
    return (letters-1)*99999+int(m[2])-1
def po_number(ordinal):
    value=ordinal//99999+1;letters=''
    while value:
        value-=1;letters=chr(65+value%26)+letters;value//=26
    return 'PO-WOS-'+letters+'-'+str(ordinal%99999+1).zfill(5)
def next_po(c):return po_number(max((po_ordinal(r['po_number']) for r in rows(c,'purchase_orders')),default=-1)+1)
def new_po(c,u,v,supplier_id=None,status='PO Request',number=None,creator=None,source=None):
    return insert(c,'purchase_orders',dict(supplier_id=supplier_id,po_number=number or next_po(c),order_date=dated(v['order_date']),notes=clean(v.get('notes')),status='DRAFT',ui_status=status,subtotal=0,discount_total=0,gst_total=0,total=0,**{**stamp(u),'created_by':creator or u['user_id']},source_purchase_order_id=source))
def line_values(v,qty_key='received_qty'):
    q=number(v.get(qty_key),positive=True);cost=number(v.get('unit_cost',0));discount=number(v.get('discount',0));gst=number(v.get('gst_rate',0))
    require(discount<=q*cost and gst<=100,'Invalid discount or GST.')
    subtotal=q*cost-discount
    return dict(unit_cost=cost,discount=discount,gst_rate=gst,subtotal=subtotal,gst_amount=subtotal*gst/100,total=subtotal*(1+gst/100))
def totals(c,u,t,id,lines):
    return change(c,u,t,id,subtotal=sum(float(l['subtotal']) for l in lines),discount_total=sum(float(l['discount']) for l in lines),gst_total=sum(float(l['gst_amount']) for l in lines),total=sum(float(l['total']) for l in lines))
def delivery(c,id):return float(c.scalar(text('SELECT coalesce(sum(delivered_qty),0) FROM purchase_order_delivery_receipt_lines WHERE purchase_order_line_id=:id'),{'id':id}))
def inward(c,u,id,qty,note,po=None,line=None,kind='manual-inward',purchase_line=None):
    lid=ledger(c,u,id,-qty,kind,note,purchase_line=purchase_line)
    r=insert(c,'stock_inwards',dict(item_id=id,qty=qty,unit_cost=0,note=note,purchase_order_id=po,purchase_order_line_id=line,ledger_id=lid,received_by=u['user_id'],received_at=now()))
    movement(c,u,id,'STOCK_IN',qty,note);return r

def purchase_command(c,u,b):
    v=b.values;action=b.action;p=row(c,'purchase_orders',b.id) if b.id else None
    role(u,'admin','store')
    if p:mutable(p,b.version)
    if action=='po-save':
        if p:
            require(p['ui_status']=='PO Request' and u['role']=='store' and p['created_by']==u['user_id'],'Only the requesting Store user can change an unreviewed request.')
            change(c,u,'purchase_orders',p['id'],order_date=dated(v['order_date']),notes=clean(v.get('notes')),updated_at=now(),updated_by=u['user_id'])
            for l in po_lines(c,p['id']):change(c,u,'purchase_order_lines',l['id'],archived_at=now())
        else:p=new_po(c,u,v)
        require(bool(v.get('lines')),'At least one line is required.')
        for n,l in enumerate(v['lines'],1):
            iid=l.get('item_id') or None
            if iid:item(c,iid)
            else:require(clean(l.get('item_name')) and clean(l.get('unit')),'New items need a name and unit.')
            insert(c,'purchase_order_lines',dict(purchase_order_id=p['id'],line_no=n+int(c.scalar(text('SELECT coalesce(max(line_no),0) FROM purchase_order_lines WHERE purchase_order_id=:id'),{'id':p['id']})),item_id=iid,item_name=clean(l.get('item_name')),unit=clean(l.get('unit')),ordered_qty=number(l.get('ordered_qty'),positive=True),unit_cost=0,discount=0,gst_rate=0,subtotal=0,gst_amount=0,total=0))
    elif action=='po-cancel':
        require(p['ui_status']=='PO Request' and u['role']=='store' and p['created_by']==u['user_id'],'Only the requesting Store user can cancel an unreviewed request.')
        po_status(c,u,p,'Cancelled')
    else:
        role(u,'admin');ls=po_lines(c,p['id']);status=p['ui_status']
        if action in ('po-legacy-cancel','po-legacy-close'):
            allowed=['Draft','Sent','Partially Received','Ready to Close'] if action=='po-legacy-cancel' else ['Sent','Partially Received','Ready to Close']
            require(status in allowed,'Invalid legacy PO transition.')
            po_status(c,u,p,'Cancelled' if action=='po-legacy-cancel' else 'Closed')
        elif action=='po-approve':
            require(status=='PO Request','Only unreviewed requests can be approved.')
            decisions=v.get('lines',[]);by={l['purchase_order_line_id']:l for l in decisions}
            require(len(by)==len(decisions)==len(ls) and set(by)=={l['id'] for l in ls},'Approval must cover every requested line exactly once.')
            groups={}
            for l in ls:
                d=by[l['id']];supplier(c,d['supplier_id']);cost=number(d.get('unit_cost'),positive=True)
                iid=l['item_id'] or new_item(c,u,{**d.get('inventory_item',{}),'sku':clean(d.get('inventory_item',{}).get('sku')).upper(),'stock_qty':0})['id']
                groups.setdefault(d['supplier_id'],[]).append((l,iid,cost))
            ids=[]
            for index,(sid,entries) in enumerate(groups.items()):
                target=p if index==0 else new_po(c,u,dict(order_date=str(p['order_date']),notes='Split from '+p['po_number']+(' ? '+p['notes'] if p['notes'] else '')),sid,'PO Request Approved',creator=p['created_by'],source=p['id'])
                ids.append(target['id'])
                for n,(l,iid,cost) in enumerate(entries,1):
                    f=dict(item_id=iid,unit_cost=cost,discount=0,gst_rate=0,subtotal=float(l['ordered_qty'])*cost,gst_amount=0,total=float(l['ordered_qty'])*cost)
                    if index==0:change(c,u,'purchase_order_lines',l['id'],**f)
                    else:
                        insert(c,'purchase_order_lines',dict(**f,purchase_order_id=target['id'],line_no=n,ordered_qty=l['ordered_qty'],item_name=l['item_name'],unit=l['unit'],source_purchase_order_line_id=l['id']))
                        change(c,u,'purchase_order_lines',l['id'],archived_at=now())
                change(c,u,'purchase_orders',target['id'],supplier_id=sid)
                po_status(c,u,target,'PO Request Approved');totals(c,u,'purchase_orders',target['id'],po_lines(c,target['id']))
            return dict(id=p['id'],ids=ids)
        elif action=='po-issue':
            require(status=='PO Request Approved','Approve before issuing.');supplier(c,p['supplier_id']);require(ls and all(l['item_id'] and l['unit_cost']>0 for l in ls),'Complete every item and price.');po_status(c,u,p,'PO Issued')
        elif action=='po-receive':
            require(status in ('PO Issued','PO Received'),'Only issued orders can receive deliveries.')
            given=v.get('lines',[]);by={l['purchase_order_line_id']:l for l in given}
            require(bool(given) and len(by)==len(given) and set(by)<={l['id'] for l in ls},'Invalid delivery lines.')
            receipt=insert(c,'purchase_order_delivery_receipts',dict(purchase_order_id=p['id'],request_key=str(uuid4()),note=clean(v.get('note')),received_by=u['user_id'],received_at=now()))
            for l in ls:
                if l['id'] not in by:continue
                qty=number(by[l['id']]['delivered_qty'],positive=True)
                require(delivery(c,l['id'])+qty<=float(l['ordered_qty']),'Delivered quantity cannot exceed ordered quantity.')
                insert(c,'purchase_order_delivery_receipt_lines',dict(receipt_id=receipt['id'],purchase_order_line_id=l['id'],delivered_qty=qty))
            po_status(c,u,p,'PO Received')
        elif action=='po-confirm':
            require(status=='PO Received','Only received orders can be confirmed.')
            given=v.get('lines',[]);by={l['purchase_order_line_id']:l for l in given}
            require(len(by)==len(given)==len(ls) and set(by)=={l['id'] for l in ls},'Confirmation must cover every line.')
            for l in ls:
                f={k:number(by[l['id']].get(k,0)) for k in ['accepted_qty','returned_qty','damaged_qty','wasted_qty']}
                require(sum(f.values())==delivery(c,l['id']),'Disposition quantities must equal delivery.')
                insert(c,'purchase_order_delivery_confirmations',dict(**f,purchase_order_id=p['id'],request_key=str(uuid4()),purchase_order_line_id=l['id'],rejected_qty=f['returned_qty']+f['damaged_qty']+f['wasted_qty'],rejection_reason='',confirmed_by=u['user_id'],confirmed_at=now()))
            po_status(c,u,p,'PO Confirmation')
        elif action=='po-close':
            if status=='Closed':return dict(id=p['id'])
            require(status=='PO Confirmation','Only fully confirmed orders can close.')
            confirmations=rows(c,'purchase_order_delivery_confirmations','purchase_order_id=:id',id=p['id']);by={l['purchase_order_line_id']:l for l in confirmations}
            require(ls and set(by)=={l['id'] for l in ls},'Every line must be confirmed.')
            for l in ls:
                qty=float(by[l['id']]['accepted_qty'])
                if qty:inward(c,u,l['item_id'],qty,'Accepted on PO closure: '+p['po_number'],p['id'],l['id'],'po-closure-inward')
            po_status(c,u,p,'Closed')
        elif action=='po-quote':
            require(status=='PO Request','Only an unreviewed request accepts quotations.')
            require(v.get('purchase_order_line_id') in {l['id'] for l in ls} and clean(v.get('supplier_name')),'Quotation line and supplier are required.')
            insert(c,'purchase_order_quotations',dict(purchase_order_id=p['id'],purchase_order_line_id=v['purchase_order_line_id'],supplier_name=clean(v['supplier_name']),quote_date=dated(v['quote_date']),quoted_qty=number(v['quoted_qty'],positive=True),unit_cost=number(v['unit_cost']),notes=clean(v.get('notes')),created_by=u['profile_id'],created_at=now().isoformat(),updated_at=now().isoformat()))
            change(c,u,'purchase_orders',p['id'],updated_at=now(),updated_by=u['user_id'])
        else:fail('Unsupported purchase command.',422)
    return dict(id=p['id'])

@router.post('/stock/command')
def stock_command(b:StockCommand,request:Request):
    with command(request,b.model_dump()) as (c,u,replay,save):
        if replay:return replay
        v=b.values;a=b.action
        if a=='new-material-request':
            j=row(c,'job_cards',v['job_id'])
            approvals=rows(c,'material_approvals','job_card_id=:id',id=j['id']);approval=approvals[-1]['status'] if approvals else None
            linked=u['role']=='service' and j['advisor_id']==u['user_id']
            require(not j['archived_at'] and approval!='Pending' and (u['role']=='admin' or linked) and (j['status']=='IN_PROGRESS' or linked and j['status']=='HOLD' and approval=='Rejected'),'Only the Owner or linked Advisor may request new material.')
            require(clean(v.get('item_name')) and clean(v.get('unit')),'Item name and unit are required.')
            r=insert(c,'material_purchase_requests',dict(job_card_id=j['id'],item_name=clean(v['item_name']),unit=clean(v['unit']),quantity=number(v['quantity'],positive=True),status='Pending',created_at=now().isoformat(),updated_at=now().isoformat()))
            return save(dict(id=r['id']))
        if a.startswith('po-'):return save(purchase_command(c,u,b))
        if a.startswith('material-'):return save(material_command(c,u,b))
        if a.startswith('inward-'):return save(inward_command(c,u,b))
        if a.startswith('supplier-'):
            role(u,'admin');s=row(c,'suppliers',b.id) if b.id else None
            if s:mutable(s,b.version)
            if a=='supplier-archive':return save(dict(id=change(c,u,'suppliers',s['id'],status='Archived',updated_at=now(),updated_by=u['user_id'])['id']))
            require(a=='supplier-save' and clean(v.get('name')),'Supplier name is required.')
            f={k:clean(v.get(k)) for k in ['name','contact_name','phone','email','gstin']};f['status']=v.get('status','Active');require(f['status'] in ('Active','On hold','Archived'),'Invalid supplier status.')
            if s:r=change(c,u,'suppliers',s['id'],**f,updated_at=now(),updated_by=u['user_id'])
            else:r=insert(c,'suppliers',dict(**f,mobile=f['phone'],address='',**stamp(u)))
            return save(dict(id=r['id']))
        role(u,'admin','store')
        if a=='inventory-create':
            role(u,'admin')
            r=new_item(c,u,v)
            if number(v.get('inward_qty',0)):inward(c,u,r['id'],number(v['inward_qty']),'Initial inward')
            return save(dict(id=r['id']))
        r=item(c,b.id);mutable(r,b.version)
        if a=='inventory-save':change(c,u,'catalogue_items',r['id'],**inventory(c,u,v),updated_by=u['user_id'],updated_at=now())
        elif a=='inventory-archive':
            require(clean(v.get('reason')),'An archive reason is required.');change(c,u,'catalogue_items',r['id'],archived_at=now(),archived_by=u['user_id'],archive_reason=clean(v['reason']),updated_by=u['user_id'],updated_at=now())
        elif a=='stock-adjust':
            qty=number(v.get('qty'));delta=balance(c,r['id'])-qty;ledger(c,u,r['id'],delta,'manual-adjustment',clean(v.get('note')) or 'Stock adjustment');movement(c,u,r['id'],'ADJUSTMENT',-delta,clean(v.get('note')) or 'Stock adjustment')
        elif a=='stock-in':
            qty=number(v.get('qty'),positive=True);line=None;p=None
            if v.get('purchase_order_line_id'):
                line=row(c,'purchase_order_lines',v['purchase_order_line_id']);p=row(c,'purchase_orders',line['purchase_order_id'])
                require(line['item_id']==r['id'] and p['ui_status'] in ('Sent','Partially Received','Ready to Close'),'Select an open legacy PO line; confirmed PO stock posts on closure.')
            inward(c,u,r['id'],qty,clean(v.get('note')) or 'Stock inward',p['id'] if p else None,line['id'] if line else None)
            if p:reconcile_po(c,u,p)
        else:fail('Unsupported stock command.',422)
        # Stock commands increment the catalogue version too, preventing stale absolute adjustments.
        if a in ('stock-in','stock-adjust'):change(c,u,'catalogue_items',r['id'],updated_by=u['user_id'],updated_at=now())
        return save(dict(id=r['id']))


def material_command(c,u,b):
    v=b.values;a=b.action;r=row(c,'material_requests',b.id) if b.id else None
    if r:mutable(r,b.version);require(not r['invoiced_in'],'Invoiced material is read-only.')
    j=row(c,'job_cards',r['job_card_id'] if r else v['job_id']);require(not j['archived_at'],'Job is archived.')
    approval=rows(c,'material_approvals','job_card_id=:id',id=j['id']);approval=approval[-1]['status'] if approval else None
    linked=u['role']=='service' and j['advisor_id']==u['user_id'];manager=u['role']=='admin' or linked
    if a=='material-release':
        role(u,'admin','store');require(j['status']=='IN_PROGRESS' and approval not in ('Pending','Rejected'),'Material issue requires an IN_PROGRESS job with no blocked approval.')
        require(r['status'] in ('Requested','Re-requested'),'Only requested material can be released.')
        qty=float(r['requested_qty']);ledger(c,u,r['item_id'],qty,'issue','Released to job',j['id'],r['id'])
        change(c,u,'material_requests',r['id'],issued_qty=qty,status='Issued',updated_at=now().isoformat())
        insert(c,'material_events',dict(job_card_id=j['id'],material_row_id=r['id'],kind='release',by_user=u['profile_id'],at=now().isoformat(),note='Released to job',new_item_id=r['item_id'],new_qty=qty))
    elif a=='material-edit-issued':
        require((manager or u['role']=='store') and j['status'] in ('IN_PROGRESS','HOLD','COMPLETED'),'Issued material editing is not permitted.')
        require(r['status']=='Issued' and clean(v.get('note')),'Issued status and a correction note are required.')
        iid=int(v['item_id']);item(c,iid);qty=number(v['qty'],positive=True);old=float(r['issued_qty'] or r['requested_qty']);note=clean(v['note'])
        require(iid!=r['item_id'] or qty!=old,'Nothing changed.')
        if iid==r['item_id']:ledger(c,u,iid,qty-old,'adjustment',note,j['id'],r['id'])
        else:
            ledger(c,u,r['item_id'],-old,'adjustment',note,j['id'],r['id']);ledger(c,u,iid,qty,'adjustment',note,j['id'],r['id'])
        change(c,u,'material_requests',r['id'],item_id=iid,requested_qty=qty,issued_qty=qty,updated_at=now().isoformat())
        insert(c,'material_events',dict(job_card_id=j['id'],material_row_id=r['id'],kind='issued-edit',by_user=u['profile_id'],at=now().isoformat(),note=note,old_item_id=r['item_id'],old_qty=old,new_item_id=iid,new_qty=qty))
    elif a=='material-reconcile':
        role(u,'admin','store');require(j['status'] not in ('CLOSED','CANCELLED') and approval not in ('Pending','Rejected'),'Material reconciliation is blocked.')
        used=number(v['used']);returned=number(v['returned']);wasted=number(v['wasted']);require(used+returned+wasted<=float(r['issued_qty']),'Reconciliation cannot exceed issued quantity.')
        delta=returned-float(r['returned_qty']);ledger(c,u,r['item_id'],-delta,'return-adjustment','Returned after job reconciliation',j['id'],r['id'])
        if delta:movement(c,u,r['item_id'],'RETURN',delta,'Return reconciliation',j['id'])
        if wasted!=float(r['wasted_qty']):movement(c,u,r['item_id'],'WASTAGE',wasted-float(r['wasted_qty']),'Wastage reconciliation',j['id'])
        change(c,u,'material_requests',r['id'],used_qty=used,returned_qty=returned,wasted_qty=wasted,updated_at=now().isoformat());history(c,j,'Material reconciled')
    else:
        require(manager and approval!='Pending' and (j['status']=='IN_PROGRESS' or linked and approval=='Rejected' and j['status']=='HOLD'),'Only the Owner or linked Advisor can manage active material rows.')
        if a in ('material-add','material-edit','material-re-request'):
            iid=int(v['item_id']);item(c,iid);qty=number(v['qty'],positive=True)
            if a=='material-add':r=insert(c,'material_requests',dict(job_card_id=j['id'],item_id=iid,requested_qty=qty,issued_qty=0,used_qty=0,returned_qty=0,wasted_qty=0,status='Draft',created_at=now().isoformat(),updated_at=now().isoformat()))
            else:
                require(r['status'] in (['Draft'] if a=='material-edit' else ['Requested','Re-requested']),'This row cannot be edited in its current status.')
                change(c,u,'material_requests',r['id'],item_id=iid,requested_qty=qty,status='Draft' if a=='material-edit' else 'Re-requested',updated_at=now().isoformat())
        elif a in ('material-request','material-delete','material-cancel'):
            require(r['status'] in (['Requested','Re-requested'] if a=='material-cancel' else ['Draft']),'Invalid material transition.')
            if a=='material-delete':change(c,u,'material_requests',r['id'],archived_at=now().isoformat(),archived_reason='Deleted draft')
            else:change(c,u,'material_requests',r['id'],status='Requested' if a=='material-request' else 'Cancelled',updated_at=now().isoformat())
        else:fail('Unsupported material command.',422)
        if a in ('material-request','material-re-request'):
            c.execute(text("UPDATE job_checklist_items SET checked_at=NULL,checked_by=NULL,completed_at=NULL,version=version+1 WHERE cycle_id=(SELECT max(id) FROM job_checklist_cycles WHERE job_card_id=:j) AND label='Material Issued'"),{'j':j['id']})
    reconcile_artifacts(c,u,j)
    return dict(id=r['id'])

def reconcile_po(c,u,p):
    if p['ui_status'] in ('Draft','Cancelled','Closed'):return
    ls=po_lines(c,p['id']);received={l['id']:float(c.scalar(text('SELECT coalesce(sum(qty),0) FROM stock_inwards WHERE purchase_order_line_id=:id'),{'id':l['id']})) for l in ls}
    status='Ready to Close' if ls and all(received[l['id']]>=float(l['ordered_qty']) for l in ls) else 'Partially Received' if any(received.values()) else 'Sent'
    po_status(c,u,p,status)

def inward_command(c,u,b):
    # Receipt uploads are stored as private bytes, never trusted external URLs.
    v=b.values;a=b.action;role(u,'admin','store');p=row(c,'inward_purchases',b.id) if b.id else None
    if p:mutable(p,b.version)
    if a=='inward-save':
        if p:require(p['status']=='Draft' and (u['role']=='admin' or p['created_by']==u['profile_id']),'Only the creator or Admin can edit a draft.')
        fields=dict(supplier_id=v.get('supplier_id') or None,supplier_invoice_no=clean(v.get('supplier_invoice_no')),invoice_date=v.get('invoice_date',''),po_number=clean(v.get('po_number')),updated_at=now().isoformat())
        if fields['supplier_id']:supplier(c,fields['supplier_id'])
        if p:change(c,u,'inward_purchases',p['id'],**fields)
        else:p=insert(c,'inward_purchases',dict(**fields,status='Draft',subtotal=0,discount_total=0,gst_total=0,total=0,created_by=u['profile_id'],created_at=now().isoformat()))
        replace_inward_lines(c,u,p,v.get('lines',[]))
        attachments(c,u,p,v.get('attachments',[]))
    elif a=='inward-send':
        require(p['status']=='Draft' and (u['role']=='admin' or p['created_by']==u['profile_id']),'Only a draft owned by this actor can be sent.')
        supplier(c,p['supplier_id']);ls=inward_lines(c,p['id']);require(bool(ls),'At least one line is required.')
        po=new_po(c,u,dict(order_date=now().date().isoformat(),notes='Linked inward purchase #'+str(p['id'])),p['supplier_id'],'Draft',p['po_number'] or 'PO-INW-'+str(p['id']))
        for n,l in enumerate(ls,1):
            pol=insert(c,'purchase_order_lines',dict(purchase_order_id=po['id'],line_no=n,item_id=l['item_id'],item_name='',unit='',ordered_qty=l['received_qty'],**line_values(l)))
            change(c,u,'inward_purchase_lines',l['id'],purchase_order_line_id=pol['id'])
        totals(c,u,'purchase_orders',po['id'],po_lines(c,po['id']));change(c,u,'inward_purchases',p['id'],po_number=po['po_number'],purchase_order_id=po['id'],status='Awaiting PO Approval',updated_at=now().isoformat())
        inward_event(c,u,p,'sent-for-po','Created PO '+po['po_number'])
    elif a=='inward-approve':
        role(u,'admin');require(p['status']=='Awaiting PO Approval' and p['purchase_order_id'],'Only purchases awaiting approval can be approved.')
        po_status(c,u,row(c,'purchase_orders',p['purchase_order_id']),'Sent');change(c,u,'inward_purchases',p['id'],status='Approved',approved_by=u['profile_id'],approved_at=now().isoformat(),updated_at=now().isoformat());inward_event(c,u,p,'approved','PO authorized and sent')
    elif a=='inward-receive':
        require(p['status']=='Approved' and p['purchase_order_id'],'Only approved purchases can be received.')
        ls=inward_lines(c,p['id']);given=v.get('lines',[]);by={l.get('purchase_order_line_id'):l for l in given}
        require(len(by)==len(given)==len(ls) and set(by)=={l['purchase_order_line_id'] for l in ls},'Receipt lines must exactly match linked PO lines.')
        for l in ls:
            x=by[l['purchase_order_line_id']];require(x['item_id']==l['item_id'],'Receipt item mismatch.');item(c,x['item_id'])
            change(c,u,'inward_purchase_lines',l['id'],received_qty=number(x['received_qty'],positive=True),**line_values(x))
        invoice=clean(v.get('supplier_invoice_no'));dated(v.get('invoice_date'));require(invoice,'Supplier invoice number is required.')
        require(not c.scalar(text("SELECT EXISTS(SELECT 1 FROM inward_purchases WHERE id<>:id AND supplier_id=:s AND supplier_invoice_no=:i AND status IN ('Submitted','Received'))"),{'id':p['id'],'s':p['supplier_id'],'i':invoice}),'Supplier invoice already received.')
        attachments(c,u,p,v.get('attachments',[]));require(bool(rows(c,'inward_purchase_attachments','purchase_id=:id',id=p['id'])),'At least one PDF or JPG invoice scan is required.')
        for l in inward_lines(c,p['id']):
            pol=row(c,'purchase_order_lines',l['purchase_order_line_id']);require(pol['purchase_order_id']==p['purchase_order_id'] and pol['item_id']==l['item_id'],'PO relationship mismatch.')
            inward(c,u,l['item_id'],float(l['received_qty']),'Inward receipt #'+str(p['id'])+' / '+invoice,p['purchase_order_id'],pol['id'],'inward',l['id'])
        change(c,u,'inward_purchases',p['id'],supplier_invoice_no=invoice,invoice_date=v['invoice_date'],status='Received',submitted_by=u['profile_id'],submitted_at=now().isoformat(),updated_at=now().isoformat())
        reconcile_po(c,u,row(c,'purchase_orders',p['purchase_order_id']));inward_event(c,u,p,'received','Posted linked PO receipt')
    elif a=='inward-revise':
        role(u,'admin');require(p['status'] in ('Received','Submitted') and clean(v.get('reason')),'Received purchase and correction reason required.')
        given=v.get('lines',[]);require(bool(given),'A revision needs lines.')
        revisions=rows(c,'inward_purchase_revisions','purchase_id=:id',id=p['id']);prior=rows(c,'inward_purchase_revision_lines','revision_id=:id',id=revisions[-1]['id']) if revisions else inward_lines(c,p['id'])
        require(len({l['item_id'] for l in prior})==len(prior),'Repeated historical item lines require reconciliation review before revision.')
        revision=insert(c,'inward_purchase_revisions',dict(purchase_id=p['id'],revision_no=len(revisions)+1,reason=clean(v['reason']),revised_by=u['profile_id'],revised_at=now().isoformat()))
        previous={l['item_id']:float(l['received_qty']) for l in prior};following={}
        for l in given:
            item(c,l['item_id']);qty=number(l['received_qty'],positive=True);following[l['item_id']]=following.get(l['item_id'],0)+qty
            insert(c,'inward_purchase_revision_lines',dict(revision_id=revision['id'],item_id=l['item_id'],received_qty=qty,**line_values(l)))
        for iid in sorted(set(previous)|set(following)):
            delta=following.get(iid,0)-previous.get(iid,0)
            if delta:ledger(c,u,iid,-delta,'inward-revision',clean(v['reason']));movement(c,u,iid,'INWARD_REVISION',delta,'Inward receipt revision '+str(revision['id']))
        inward_event(c,u,p,'revised',clean(v['reason']));change(c,u,'inward_purchases',p['id'],updated_at=now().isoformat())
    else:fail('Unsupported inward command.',422)
    return dict(id=p['id'])

def inward_lines(c,id):return rows(c,'inward_purchase_lines','purchase_id=:id AND archived_at IS NULL',id=id)
def replace_inward_lines(c,u,p,ls):
    for l in inward_lines(c,p['id']):change(c,u,'inward_purchase_lines',l['id'],archived_at=now())
    for l in ls:
        item(c,l['item_id']);insert(c,'inward_purchase_lines',dict(purchase_id=p['id'],item_id=l['item_id'],received_qty=number(l['received_qty'],positive=True),**line_values(l)))
    totals(c,u,'inward_purchases',p['id'],inward_lines(c,p['id']))
def inward_event(c,u,p,kind,note):return insert(c,'inward_purchase_events',dict(purchase_id=p['id'],kind=kind,note=note,actor_id=u['profile_id'],at=now().isoformat()))
def attachments(c,u,p,files):
    import base64,hashlib
    for f in files:
        mime=f.get('mime_type');require(mime in ('application/pdf','image/jpeg'),'Use PDF or JPG invoice scans.')
        try:header,encoded=f['document_url'].split(',',1);data=base64.b64decode(encoded,validate=True)
        except Exception:fail('Invalid invoice upload.',422)
        require(header=='data:'+mime+';base64' and 0<len(data)<=10*1024*1024 and len(data)==f['byte_size'],'Invalid invoice size or media type.')
        require(data.startswith(b'%PDF-') if mime=='application/pdf' else data.startswith(b'\xff\xd8\xff'),'Invalid file signature.')
        blob=insert(c,'slice_purchase_files',dict(content=data,mime_type=mime,sha256=hashlib.sha256(data).hexdigest(),purchase_id=p['id'],created_by=u['user_id']))
        insert(c,'inward_purchase_attachments',dict(purchase_id=p['id'],original_name=clean(f['original_name']),mime_type=mime,byte_size=len(data),storage_key=str(blob['id']),document_url='/api/v1/purchase-files/'+str(blob['id']),uploaded_by=u['profile_id'],uploaded_at=now().isoformat()))
@router.get('/purchase-files/{id}')
def purchase_file(id:int,request:Request):
    from api import business
    from fastapi.responses import Response
    with business(request) as (c,u):
        r=c.execute(text('SELECT content,mime_type FROM slice_purchase_files WHERE id=:id'),{'id':id}).mappings().first()
        if not r:fail('Original file unavailable.',404)
        return Response(bytes(r['content']),media_type=r['mime_type'],headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'"})
