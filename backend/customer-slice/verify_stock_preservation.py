"""Read-only reconciliation against the preserved import rehearsal and UI baseline."""
import hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];DOC=ROOT/'docs/backend-migration';OUT=Path(__file__).parent/'artifacts'
manifest=json.loads((DOC/'stage2-protected-file-manifest.json.md').read_text(encoding='utf-8-sig'))
changed=[e['path'] for e in manifest['files'] if hashlib.sha256((ROOT/e['path']).read_bytes()).hexdigest()!=e['git_sha256']]
assert set(changed)=={'src/App.tsx','src/db.ts','src/job-sheet-ui.tsx','vite.config.ts','src/document-snapshots.ts','src/materials-ui.tsx'},changed
old=json.loads((DOC/'stage4c-rehearsal-preflight.json.md').read_text(encoding='utf-8-sig'))
paths=[p for p in old['files'] if p.endswith('.sqlite') or (p.endswith('.png') and p!='public/car-damage-diagram.png')]
assert all(hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==old['files'][p] for p in paths)
def query(scope,sql):
    container,owner,db=('workshopos-import-unblock-03-rehearsal-db-1','stage4c_rehearsal_owner','stage4c_rehearsal') if scope=='original' else ('workshopos-customer-slice-slice-'+scope+'-1','slice_owner','slice_'+scope)
    return subprocess.run(['docker','exec','-i',container,'psql','-U',owner,'-d',db,'-At'],input=sql+';',capture_output=True,text=True,check=True).stdout.strip()
tables=query('original',"SELECT table_schema||'.'||table_name FROM information_schema.tables WHERE table_schema IN ('public','import_custody') AND table_type='BASE TABLE' ORDER BY 1").splitlines()
exclude={'public.alembic_version','public.database_sessions','public.platform_users','public.tenant_memberships','public.workshop_user_profiles'}
tables=[t for t in tables if t not in exclude]
sql=' UNION ALL '.join(f"SELECT '{t}',count(*)||':'||md5(coalesce(string_agg((to_jsonb(x)-'promised_text'-CASE WHEN '{t}' IN ('public.purchase_order_lines','public.inward_purchase_lines') THEN 'archived_at' ELSE '__none__' END)::text,'' ORDER BY (to_jsonb(x)-'promised_text'-CASE WHEN '{t}' IN ('public.purchase_order_lines','public.inward_purchase_lines') THEN 'archived_at' ELSE '__none__' END)::text),'')) FROM {t} x" for t in tables)
values={s:dict(line.split('|',1) for line in query(s,sql).splitlines()) for s in ['original','dev','test']}
assert values['dev']==values['original'],[t for t in tables if values['dev'][t]!=values['original'][t]]
mutable={'public.customers','public.vehicles','public.visits','public.job_cards','public.job_checklist_cycles','public.job_checklist_items','public.technician_tasks','public.qc_checks','public.job_media','public.legacy_job_status_history','public.advisor_attendance','public.estimates','public.estimate_lines','public.document_snapshots','public.estimate_decisions','public.material_approvals','public.material_approval_events'}
mutable.update({'public.suppliers','public.catalogue_items','public.purchase_orders','public.purchase_order_lines','public.purchase_order_delivery_receipts','public.purchase_order_delivery_receipt_lines','public.purchase_order_delivery_confirmations','public.purchase_order_quotations','public.stock_ledger','public.stock_inwards','public.material_requests','public.material_events','public.legacy_material_movements','public.material_purchase_requests','public.inward_purchases','public.inward_purchase_lines','public.inward_purchase_attachments','public.inward_purchase_events','public.inward_purchase_revisions','public.inward_purchase_revision_lines'})
assert all(values['test'][t]==values['original'][t] for t in tables if t not in mutable),[t for t in tables if t not in mutable and values['test'][t]!=values['original'][t]]
for scope in ('dev','test'):
    assert query(scope,"SELECT count(*) FROM estimates e LEFT JOIN job_cards j ON j.id=e.job_card_id AND j.tenant_id=e.tenant_id AND j.branch_id=e.branch_id WHERE j.id IS NULL")=='0'
    assert query(scope,"SELECT count(*) FROM estimate_lines l LEFT JOIN estimates e ON e.id=l.estimate_id AND e.tenant_id=l.tenant_id AND e.branch_id=l.branch_id WHERE e.id IS NULL")=='0'
    assert query(scope,"SELECT count(*) FROM job_cards j LEFT JOIN visits v ON v.id=j.visit_id LEFT JOIN customers c ON c.id=v.customer_id LEFT JOIN vehicles a ON a.id=v.vehicle_id WHERE v.id IS NULL OR c.id IS NULL OR a.id IS NULL")=='0'
    assert query(scope,"SELECT id||':'||job_no FROM job_cards WHERE id<=145 ORDER BY id")==query('original',"SELECT id||':'||job_no FROM job_cards ORDER BY id")
counts={t:int(query('dev',f'SELECT count(*) FROM {t}')) for t in ('customers','vehicles','job_cards','estimates','estimate_lines','job_media','invoices','payments','legacy_receipts','legacy_gate_passes','suppliers','catalogue_items','purchase_orders','purchase_order_lines','material_requests','inward_purchases')}
assert [counts[t] for t in ('customers','vehicles','job_cards','estimates','estimate_lines','job_media')]==[121,132,145,144,144,289]
result=dict(head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),baseline=manifest['revision'],unchanged_protected_files=len(manifest['files'])-len(changed),modified_protected_files=changed,screenshots_unchanged=sum(p.endswith('.png') for p in paths),sqlite_copies_unchanged=sum(p.endswith('.sqlite') for p in paths),development_counts=counts,development_original_tables_identical=len(tables),test_immutable_tables_identical=len(set(tables)-mutable),financial_and_custody_unchanged=True,missing_estimate_or_job_parents=0)
(OUT/'stock-preservation.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))

import sqlite3
source=sqlite3.connect('file:'+str(ROOT/'public/workshopos-demo.sqlite')+'?mode=ro',uri=True);source.row_factory=sqlite3.Row
legacy={table:[dict(r) for r in source.execute('SELECT * FROM '+table+' ORDER BY id')] for table in ['stock_ledger','stock_inwards']}
bridge=json.loads(query('dev',"SELECT json_agg(json_build_object('table',source_table,'values',values)) FROM slice_historical_stock"))
assert len(bridge)==7
for table in legacy:
 actual=sorted([r['values'] for r in bridge if r['table']==table],key=lambda r:r['id']);assert actual==legacy[table],table
expected={r['id']:r['stock_qty']-sum(l['qty'] for l in legacy['stock_ledger'] if l['item_id']==r['id']) for r in source.execute('SELECT * FROM inventory')}
actual=json.loads(query('dev',"SELECT json_object_agg(id,stock_qty-coalesce((SELECT sum((values->>'qty')::numeric) FROM slice_historical_stock WHERE source_table='stock_ledger' AND (values->>'item_id')::bigint=i.id),0)) FROM catalogue_items i"))
assert {int(k):v for k,v in actual.items()}==expected
result.update(historical_rows_exact=7,source_stock_on_hand=expected,quarantine_custody_unchanged=True)
(OUT/'stock-preservation.json').write_text(json.dumps(result,indent=2));print('All seven legacy stock rows and all four on-hand balances match the untouched SQLite source')
