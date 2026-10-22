import hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]; DOC=ROOT/'docs/backend-migration'; OUT=Path(__file__).parent/'artifacts'
manifest=json.loads((DOC/'stage2-protected-file-manifest.json.md').read_text(encoding='utf-8-sig'))
changed=[e['path'] for e in manifest['files'] if hashlib.sha256((ROOT/e['path']).read_bytes()).hexdigest()!=e['git_sha256']]
assert set(changed)=={'src/App.tsx','src/db.ts','vite.config.ts'},changed
old=json.loads((DOC/'stage4c-rehearsal-preflight.json.md').read_text(encoding='utf-8-sig'))
paths=[p for p in old['files'] if p.endswith('.sqlite') or (p.endswith('.png') and p!='public/car-damage-diagram.png')]
assert all(hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==old['files'][p] for p in paths)
head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip();assert head==manifest['revision']
def query(scope,sql):
 container,owner,db=('workshopos-import-unblock-03-rehearsal-db-1','stage4c_rehearsal_owner','stage4c_rehearsal') if scope=='original' else ('workshopos-customer-slice-slice-'+scope+'-1','slice_owner','slice_'+scope)
 return subprocess.check_output(['docker','exec',container,'psql','-U',owner,'-d',db,'-Atc',sql],text=True).strip()
tables=query('original',"SELECT table_schema||'.'||table_name FROM information_schema.tables WHERE table_schema IN ('public','import_custody') AND table_type='BASE TABLE' ORDER BY 1").splitlines()
exclude={'public.alembic_version','public.database_sessions','public.platform_users','public.tenant_memberships','public.workshop_user_profiles','public.customers'}
comparisons={}
for t in tables:
 if t in exclude:continue
 sql=f"SELECT count(*)||':'||md5(coalesce(string_agg(to_jsonb(x)::text,'' ORDER BY to_jsonb(x)::text),'')) FROM {t} x"
 original=query('original',sql); comparisons[t]={scope:query(scope,sql)==original for scope in ['dev','test']}
assert all(all(v.values()) for v in comparisons.values()),comparisons
assert query('dev','SELECT count(*) FROM customers')=='121'
assert int(query('test','SELECT count(*) FROM customer_changes WHERE customer_id=1 AND before_value IS NOT NULL'))>=2
result={'head':head,'protected_files':115,'unchanged_protected_files':112,'authorized_modified_files':changed,'screenshots_unchanged':sum(p.endswith('.png') for p in paths),'sqlite_copies_unchanged':sum(p.endswith('.sqlite') for p in paths),'development_customers':121,'original_table_comparisons':comparisons,'audited_imported_customer_edits':True}
(OUT/'protection-data.json').write_text(json.dumps(result,indent=2));print({k:v for k,v in result.items() if k!='original_table_comparisons'}); print(len(comparisons),'original tables unchanged in both clones, including all financial and custody tables')
