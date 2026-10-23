"""Read-only remote reconciliation and restore to a NEW local isolated volume."""
import importlib.util
import subprocess
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
SSH=['ssh','-T','-i',str(Path.home()/'.ssh/id_ed25519'),'-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','prem@89.167.40.86']
SOURCE='workshopos-stage51-db-1'
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
restore=load('restore50',ROOT/'deploy/stage50/verify_restore_local.py')
original=restore.run
def run(args,data=None):
    if args[:2]==['docker','exec'] and SOURCE in args:
        import shlex
        return original(SSH+[shlex.join(args)],data)
    return original(args,data)
restore.run=run
restore.SOURCE=SOURCE
restore.TARGET='workshopos-stage51-restore-verified'
# Keep proven verifier logic; change only artifact directory, not assertions.
source=(ROOT/'deploy/stage50/verify_restore_local.py').read_text().replace("ROOT/'.scratch/stage50/restore-verified'","ROOT/'.scratch/stage51/restore-verified'")
namespace=restore.__dict__
exec(compile(source[source.index('def main():'):source.index("if __name__")],str(__file__),'exec'),namespace)
if __name__=='__main__':
    if sys.argv[1] in ('restore','permissions'):
        if sys.argv[1]=='restore':restore.main()
        import json
        queries=[
            "SELECT grantee,table_schema,table_name,privilege_type FROM information_schema.role_table_grants WHERE grantee IN ('slice_auth','workshopos_runtime') ORDER BY 1,2,3,4;",
            "SELECT grantee,routine_schema,routine_name,privilege_type FROM information_schema.routine_privileges WHERE grantee IN ('slice_auth','workshopos_runtime') ORDER BY 1,2,3,4;",
            "SELECT n.nspname,coalesce(grantee.rolname,'PUBLIC'),grantor.rolname,a.privilege_type,a.is_grantable FROM pg_namespace n CROSS JOIN LATERAL aclexplode(coalesce(n.nspacl,acldefault('n',n.nspowner))) a LEFT JOIN pg_roles grantee ON grantee.oid=a.grantee JOIN pg_roles grantor ON grantor.oid=a.grantor WHERE n.nspname IN ('public','import_custody') ORDER BY 1,2,3,4,5;",
            "SELECT rolname,rolsuper,rolinherit,rolcreaterole,rolcreatedb,rolcanlogin,rolconnlimit,rolbypassrls FROM pg_roles WHERE rolname IN ('slice_auth','workshopos_runtime') ORDER BY 1;"
        ]
        for query in queries:
            assert restore.sql(SOURCE,query)==restore.sql(restore.TARGET,query),'Recovery permissions differ'
        result=ROOT/'.scratch/stage51/restore-verified/result.json'
        report=json.loads(result.read_text());report['runtime_table_routine_schema_grants_exact']=True;report['runtime_role_attributes_exact']=True
        result.write_text(json.dumps(report,indent=2))
        print('Recovered runtime grants, schema ACLs and role attributes match source.')
    else:
        sys.modules['verify_restore_local']=restore
        data=load('data50',ROOT/'deploy/stage50/verify_data_local.py')
        source=(ROOT/'deploy/stage50/verify_data_local.py').read_text().replace("ROOT/'.scratch/stage50/data.json'","ROOT/'.scratch/stage51/data.json'")
        exec(compile(source[source.index('def main():'):source.index("if __name__")],str(__file__),'exec'),data.__dict__)
        data.main()
