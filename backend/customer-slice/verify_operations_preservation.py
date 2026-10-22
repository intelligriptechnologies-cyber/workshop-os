import hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]; DOC=ROOT/'docs/backend-migration'; OUT=Path(__file__).parent/'artifacts'
manifest=json.loads((DOC/'stage2-protected-file-manifest.json.md').read_text(encoding='utf-8-sig'))
changed=[e['path'] for e in manifest['files'] if hashlib.sha256((ROOT/e['path']).read_bytes()).hexdigest()!=e['git_sha256']]
assert set(changed)=={'src/App.tsx','src/db.ts','src/job-sheet-ui.tsx','vite.config.ts'},changed
old=json.loads((DOC/'stage4c-rehearsal-preflight.json.md').read_text(encoding='utf-8-sig'))
paths=[p for p in old['files'] if p.endswith('.sqlite') or (p.endswith('.png') and p!='public/car-damage-diagram.png')]
assert all(hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==old['files'][p] for p in paths)
head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip();assert head==manifest['revision']
def query(scope,sql):
 container,owner,db=('workshopos-import-unblock-03-rehearsal-db-1','stage4c_rehearsal_owner','stage4c_rehearsal') if scope=='original' else ('workshopos-customer-slice-slice-'+scope+'-1','slice_owner','slice_'+scope)
 return subprocess.check_output(['docker','exec',container,'psql','-U',owner,'-d',db,'-Atc',sql],text=True).strip()
tables=query('original',"SELECT table_schema||'.'||table_name FROM information_schema.tables WHERE table_schema IN ('public','import_custody') AND table_type='BASE TABLE' ORDER BY 1").splitlines()
exclude={'public.alembic_version','public.database_sessions','public.platform_users','public.tenant_memberships','public.workshop_user_profiles'}
tables=[t for t in tables if t not in exclude]
sql=' UNION ALL '.join(f"SELECT '{t}',count(*)||':'||md5(coalesce(string_agg((to_jsonb(x)-'promised_text')::text,'' ORDER BY (to_jsonb(x)-'promised_text')::text),'')) FROM {t} x" for t in tables)
values={s:dict(line.split('|',1) for line in query(s,sql).splitlines()) for s in ['original','dev','test']}
assert values['dev']==values['original'],[t for t in tables if values['dev'][t]!=values['original'][t]]
mutable={'public.customers','public.vehicles','public.visits','public.job_cards','public.job_checklist_cycles','public.job_checklist_items','public.technician_tasks','public.qc_checks','public.job_media','public.legacy_job_status_history','public.advisor_attendance'}
assert all(values['test'][t]==values['original'][t] for t in tables if t not in mutable)
for s in ['dev','test']:
 assert query(s,"SELECT count(*) FROM job_cards j LEFT JOIN visits r ON r.id=j.visit_id LEFT JOIN vehicles v ON v.id=r.vehicle_id LEFT JOIN customers c ON c.id=r.customer_id WHERE r.id IS NULL OR v.id IS NULL OR c.id IS NULL")=='0'
 original=query('original',"SELECT id||':'||job_no FROM job_cards ORDER BY id")
 assert query(s,"SELECT id||':'||job_no FROM job_cards WHERE id<=145 ORDER BY id")==original
counts=query('dev',"SELECT (SELECT count(*) FROM customers)||','||(SELECT count(*) FROM vehicles)||','||(SELECT count(*) FROM job_cards)")
assert counts=='121,132,145',counts
result={'head':head,'unchanged_protected_files':111,'authorized_modified_files':changed,'screenshots_unchanged':sum(p.endswith('.png') for p in paths),'sqlite_copies_unchanged':sum(p.endswith('.sqlite') for p in paths),'development_counts':counts,'development_original_tables_identical':len(tables),'test_immutable_tables_identical':len(set(tables)-mutable),'financial_and_custody_unchanged':True,'original_job_identifiers_unchanged':True,'missing_job_parents':0}
(OUT/'operations-preservation.json').write_text(json.dumps(result,indent=2));print(result)
