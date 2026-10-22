"""Create fresh, named local resources; copy the verified rehearsal without changing it."""
import hashlib,json,secrets,sqlite3,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
GENERATED=HERE/'.generated'; GENERATED.mkdir(exist_ok=True)
(HERE/'artifacts').mkdir(exist_ok=True)
env=HERE/'.local.env'
if not env.exists(): env.write_text('OWNER_PASSWORD='+secrets.token_hex(24)+'\nRUNTIME_PASSWORD='+secrets.token_hex(24)+'\n')
source=ROOT/'public/workshopos-demo.sqlite'
assert hashlib.sha256(source.read_bytes()).hexdigest()=='04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae'
with sqlite3.connect(source.as_uri()+'?mode=ro&immutable=1',uri=True) as db:
    db.row_factory=sqlite3.Row
    users=[dict(r) for r in db.execute('SELECT id,name,email,role,password FROM users')]
(GENERATED/'accounts.json').write_text(json.dumps(users))
(GENERATED/'demo-credentials.ts').write_text('export default '+json.dumps({u['email']:u['password'] for u in users})+' as Record<string,string>;\n')
compose=['docker','compose','--env-file',str(env),'-f',str(HERE/'compose.yaml')]
subprocess.run(compose+['up','-d','--wait','slice-dev','slice-test'],check=True)
backup=GENERATED/'rehearsal-original.dump'
if not backup.exists():
    result=subprocess.run(['docker','exec','workshopos-import-unblock-03-rehearsal-db-1','pg_dump','-U','stage4c_rehearsal_owner','-d','stage4c_rehearsal','-Fc'],check=True,stdout=subprocess.PIPE)
    backup.write_bytes(result.stdout)
for scope in ('dev','test'):
    container='workshopos-customer-slice-slice-'+scope+'-1'
    def psql(sql):
        return subprocess.check_output(['docker','exec',container,'psql','-U','slice_owner','-d','slice_'+scope,'-Atc',sql],text=True).strip()
    if psql("SELECT count(*) FROM pg_tables WHERE schemaname='public'")=='0':
        psql('CREATE ROLE workshopos_runtime NOLOGIN NOBYPASSRLS')
        subprocess.run(['docker','exec','-i',container,'pg_restore','-U','slice_owner','-d','slice_'+scope,'--no-owner','--no-acl','--exit-on-error'],input=backup.read_bytes(),check=True)
subprocess.run(compose+['run','--rm','-T','setup'],check=True)
subprocess.run(compose+['up','-d','api','api-test'],check=True)
print('Local slice APIs ready on loopback ports 18284 (development), 18285 (tests).')
