"""Inspect local built images and rendered configuration without starting services."""
import hashlib
import io
import json
import sqlite3
import subprocess
import tarfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]


def main():
    config=json.loads(subprocess.check_output(['docker','compose','--env-file','.scratch/stage49-local/local.env','-p','workshopos-stage49-local3','-f','deploy/stage49/compose.yaml','-f','deploy/stage49/compose.initialize.yaml','config','--format','json'],cwd=ROOT))
    services=config['services']
    for name,s in services.items():
        assert not s.get('ports') and not s.get('privileged'),name
        assert s.get('mem_limit') and s.get('cpus') and s.get('pids_limit'),name
    assert set(services['api']['networks'])=={'app','database'}
    assert set(services['db']['networks'])=={'database'}
    assert config['networks']['database']['internal']
    assert services['api']['environment']['SLICE_PREFILL']=='false'
    assert 'workshopos-frontend' not in services['frontend']['networks']['proxy']['aliases']
    deps=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
    assert 'sql.js' not in deps['dependencies'] and 'sql.js' in deps['devDependencies']
    image='workshopos-stage49-frontend:local'
    blob=subprocess.check_output(['docker','run','--rm','--network','none','--entrypoint','tar',image,'-C','/app/dist','-cf','-','.'])
    source=ROOT/'public/workshopos-demo.sqlite'
    with sqlite3.connect(source.as_uri()+'?mode=ro&immutable=1',uri=True) as db:
        passwords={r[0].encode() for r in db.execute('SELECT DISTINCT password FROM users') if len(r[0])>=6}
    with tarfile.open(fileobj=io.BytesIO(blob)) as archive:
        names=[m.name for m in archive if m.isfile()]
        assert not any(n.endswith(('.sqlite','.db','.wasm','.map','.dump','.env')) for n in names)
        for member in archive:
            if member.isfile() and member.name.endswith('.js'):
                content=archive.extractfile(member).read()
                assert not any(password in content for password in passwords),'Demo password literal in production JS'
        metadata=json.loads(archive.extractfile('./.verification/postgres-runtime.json').read())
        assert metadata=={'backend':'postgresql','sqliteRuntimeModules':[],'testMode':False}
    images={name:subprocess.check_output(['docker','image','inspect','--format','{{.Id}}',name],text=True).strip() for name in ['workshopos-stage49-api:local',image]}
    result={'compose_no_published_ports':True,'isolated_database':True,'no_legacy_proxy_alias':True,'resource_limits':True,'production_demo_literals_absent':True,'production_sqlite_wasm_absent':True,'sqljs_dev_only':True,'runtime_manifest':metadata,'images':images,'source_sqlite_sha256':hashlib.sha256(source.read_bytes()).hexdigest()}
    (ROOT/'.scratch/stage49-package.json').write_text(json.dumps(result,indent=2),encoding='utf8')
    print(json.dumps(result,indent=2))

if __name__=='__main__':main()
