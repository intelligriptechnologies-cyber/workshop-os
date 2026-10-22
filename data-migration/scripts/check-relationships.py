"""Explicit inferred relationship audit; these are not declared SQLite FKs."""
import json,pathlib
R=pathlib.Path('data-migration')
rows=json.loads((R/'demo-data/runtime-initial-records.json').read_text(encoding='utf8'))
targets={'user_id':'users','actor_id':'users','advisor_id':'users','technician_id':'users','manager_id':'users','customer_id':'customers','vehicle_id':'vehicles','visit_id':'visits','job_card_id':'job_cards','booking_id':'bookings','checklist_cycle_id':'checklist_cycles','estimate_id':'estimates','task_list_item_id':'job_task_list_items','invoice_id':'invoices','material_row_id':'material_requests','purchase_id':'inward_purchases','item_id':'inventory','old_item_id':'inventory','new_item_id':'inventory','mapped_inventory_item_id':'inventory','revision_id':'inward_purchase_revisions','supplier_id':'suppliers','purchase_order_id':'purchase_orders','source_purchase_order_id':'purchase_orders','purchase_order_line_id':'purchase_order_lines','source_purchase_order_line_id':'purchase_order_lines','service_catalog_item_id':'service_catalog_items','approval_id':'material_approvals','material_request_id':'material_requests','local_purchase_id':'local_purchases','purchase_order_receipt_id':'purchase_order_receipts','quotation_id':'sales_quotations','lead_id':'sales_leads','department_id':'service_departments','service_department_id':'service_departments','brand_id':'service_brands','car_segment_id':'car_segments','ledger_id':'stock_ledger','inward_purchase_line_id':'inward_purchase_lines'}
schema=json.loads((R/'demo-data/runtime-initial-inventory.json').read_text())
checks=[];unmapped=[]
for table,info in schema['tables'].items():
 for col in info['columns']:
  name=col['name']
  if not name.endswith('_id'):continue
  if name not in targets:unmapped.append({'table':table,'column':name});continue
  parent=targets[name];ids={r['id']for r in rows[parent] if 'id'in r}
  missing=[];sentinels=0;nonempty=0
  for n,r in enumerate(rows[table]):
   value=r.get(name)
   if value in (None,0,''):sentinels+=1;continue
   nonempty+=1
   if value not in ids:missing.append({'row':r.get('id',n),'value':value})
  checks.append({'table':table,'column':name,'target':parent+'.id','nonempty_checked':nonempty,'null_zero_empty_excluded':sentinels,'missing':missing})
result={'basis':'Explicit column-to-table mapping inferred from schema/source entity names; review sentinel validity and domain-specific semantics separately. Not SQL constraints.','checks':checks,'unmapped':unmapped,'missing_count':sum(len(c['missing'])for c in checks)}
(R/'evidence/relationship-verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps({'checks':len(checks),'missing':result['missing_count'],'unmapped':unmapped}))
