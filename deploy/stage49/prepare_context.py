"""Allowlisted local build contexts. Never copies databases or generated credentials."""
import hashlib
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
DEST = ROOT / '.scratch/stage49-context'
PIN = '50c8aab1766b61c914e2829b460bfd1697723ec2'


def copy(source, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)


def main():
    if DEST.exists():
        raise SystemExit('Context already exists; use the preserved context or review it before rebuilding. Never merge unknown files into a release context.')
    front, api = DEST/'frontend', DEST/'api'
    for name in ['package.json','package-lock.json','index.html','vite.config.ts']:
        copy(ROOT/name, front/name)
    for p in ROOT.glob('tsconfig*.json'): copy(p,front/p.name)
    for directory in ['src','public']:
        for p in (ROOT/directory).rglob('*'):
            if p.is_file() and p.suffix.lower() not in ('.sqlite','.db','.map'):
                copy(p,front/p.relative_to(ROOT))
    copy(HERE/'nginx.conf',front/'nginx.conf')
    copy(HERE/'Dockerfile.frontend',front/'Dockerfile')
    copy(HERE/'Dockerfile.api',api/'Dockerfile')
    copy(ROOT/'backend/foundation/requirements.lock',api/'requirements.lock')
    for name in subprocess.check_output(['git','ls-tree','-r','--name-only',PIN,'backend'],cwd=ROOT,text=True).splitlines():
        if ((name.startswith(('backend/app/','backend/alembic/')) and name.endswith('.py')) or name=='backend/alembic.ini'):
            p=api/'workspace'/Path(name).relative_to('backend');p.parent.mkdir(parents=True,exist_ok=True)
            p.write_bytes(subprocess.check_output(['git','show',f'{PIN}:{name}'],cwd=ROOT))
    modules=['api','runtime_config','operations','estimate_documents','purchase_stock','financial_workflows','bookings','execution_workflows','administration','configuration','catalog_workflows','sales_workflows']
    for name in modules: copy(ROOT/f'backend/customer-slice/{name}.py',api/f'slice/{name}.py')
    for p in (ROOT/'backend/customer-slice').glob('*.json'): copy(p,api/'slice'/p.name)
    for source,destination in [('backend/customer-slice/versions','slice/versions'),('backend/schema-validation/versions','schema/versions'),('backend/import-rehearsal/versions','rehearsal/versions')]:
        for p in (ROOT/source).iterdir():
            if p.is_file() and p.suffix in ('.py','.sql'): copy(p,api/destination/p.name)
    copy(ROOT/'backend/schema-validation/schema-contract.json',api/'schema/schema-contract.json')
    for name in ['importer.py','history_policy.py']: copy(ROOT/'backend/import-rehearsal'/name,api/'rehearsal'/name)
    copy(ROOT/'backend/import-planner/planner.py',api/'planner/planner.py')
    copy(ROOT/'docs/backend-migration/stage3-schema-mapping.json.md',api/'evidence/stage3-schema-mapping.json.md')
    for p in HERE.glob('*.py'): copy(p,api/'deployment'/p.name)
    manifest={str(p.relative_to(DEST)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in DEST.rglob('*') if p.is_file()}
    (DEST/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
    print(f'Prepared {len(manifest)} allowlisted files; no source databases or recovery artifacts copied.')

if __name__=='__main__': main()
