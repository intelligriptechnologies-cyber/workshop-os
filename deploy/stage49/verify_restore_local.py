"""Full restore into NEW local resources; never deletes/resets any database or volume."""
import hashlib
import json
import subprocess
import time
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
SOURCE='workshopos-stage49-local3-db-1'
TARGET='workshopos-stage49-restore-verified'
OWNER='stage4c_rehearsal_owner'
DATABASE='workshopos_staging'
IMAGE='postgres:17-alpine@sha256:6f30057d31f5861b66f3545d4821f987aacf1dd920765f0acadea0c58ff975b1'


def run(args, data=None):
    return subprocess.run(args,input=data,stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout


def sql(container, statement):
    return run(['docker','exec','-i',container,'psql','-X','-v','ON_ERROR_STOP=1','-U',OWNER,'-d',DATABASE,'-At'],statement.encode()).decode().strip()


def fingerprints(container):
    tables=sql(container,"SELECT table_schema||'.'||table_name FROM information_schema.tables WHERE table_schema IN ('public','import_custody') AND table_type='BASE TABLE' ORDER BY 1;").splitlines()
    queries=[]
    for name in tables:
        # Names originate in this application's validated schema, not operator text.
        assert all(c.isalnum() or c in '._' for c in name)
        queries.append(f"SELECT '{name}',count(*)||':'||md5(coalesce(string_agg(to_jsonb(t)::text,'' ORDER BY to_jsonb(t)::text),'')) FROM {name} t")
    return dict(line.split('|',1) for line in sql(container,' UNION ALL '.join(queries)+';').splitlines())


def main():
    endpoint=json.loads(run(['docker','context','inspect','--format','{{json .Endpoints.docker.Host}}']))
    if not endpoint.startswith('npipe:'):
        raise SystemExit('This rehearsal is restricted to local Windows Docker Desktop; never point it at SSH/TCP Docker.')
    if subprocess.run(['docker','container','inspect',TARGET],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0:
        raise SystemExit('Restore target exists; preserve it and choose a reviewed new target, never overwrite.')
    if subprocess.run(['docker','volume','inspect',TARGET+'-data'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0:
        raise SystemExit('Restore volume already exists; never reuse an unverified volume.')
    out=ROOT/'.scratch/stage49-restore-verified';out.mkdir(exist_ok=False)
    before=fingerprints(SOURCE)
    dump=run(['docker','exec',SOURCE,'pg_dump','-U',OWNER,'-d',DATABASE,'-Fc'])
    (out/'database.dump').write_bytes(dump)
    secrets=ROOT/'.scratch/stage49-local/secrets'
    run(['docker','run','-d','--name',TARGET,'--network','none','--memory','1g','--cpus','1','--pids-limit','128','--mount',f'type=bind,source={secrets.resolve()},target=/run/credentials,readonly','--mount',f'type=volume,source={TARGET}-data,target=/var/lib/postgresql/data','-e',f'POSTGRES_DB={DATABASE}','-e',f'POSTGRES_USER={OWNER}','-e','POSTGRES_PASSWORD_FILE=/run/credentials/owner_password',IMAGE])
    for _ in range(60):
        ready=subprocess.run(['docker','exec',TARGET,'pg_isready','-h','127.0.0.1','-U',OWNER,'-d',DATABASE],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        if ready.returncode==0:break
        time.sleep(1)
    else:raise RuntimeError('Restore database not ready')
    runtime=(secrets/'runtime_password').read_text().strip()
    assert len(runtime)>=32 and all(c in '0123456789abcdef' for c in runtime)
    sql(TARGET,"CREATE ROLE workshopos_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS; CREATE ROLE slice_auth LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS CONNECTION LIMIT 8 PASSWORD '"+runtime+"'; GRANT workshopos_runtime TO slice_auth;")
    run(['docker','exec','-i',TARGET,'pg_restore','-U',OWNER,'-d',DATABASE,'--no-owner','--exit-on-error'],dump)
    after=fingerprints(TARGET)
    assert before==after
    assert before==fingerprints(SOURCE),'Source changed during restore comparison'
    sequences="SELECT schemaname,sequencename,last_value FROM pg_sequences WHERE schemaname IN ('public','import_custody') ORDER BY 1,2;"
    assert sql(SOURCE,sequences)==sql(TARGET,sequences)
    assert sql(TARGET,"SELECT rolsuper OR rolcreatedb OR rolcreaterole OR rolbypassrls FROM pg_roles WHERE rolname='slice_auth';")=='f'
    result={'tables_exact':len(before),'all_row_hashes_exact':True,'sequence_values_exact':True,'media_and_document_tables_included':True,'restricted_runtime_role':True,'dump_bytes':len(dump),'dump_sha256':hashlib.sha256(dump).hexdigest(),'target':TARGET,'remote_changes':False,'fingerprints':before}
    (out/'result.json').write_text(json.dumps(result,indent=2),encoding='utf8')
    print(json.dumps({k:v for k,v in result.items() if k!='fingerprints'},indent=2))

if __name__=='__main__':main()
