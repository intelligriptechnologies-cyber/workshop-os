"""Inspect the production image without starting a server or exposing fixtures."""
import io
import json
from pathlib import Path
import sqlite3
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parents[2]
blob = subprocess.check_output(['docker', 'run', '--rm', '--network', 'none', '--entrypoint',
                                'tar', 'workshopos-ci-frontend', '-C', '/app/dist', '-cf', '-', '.'])
with sqlite3.connect((ROOT / 'public/workshopos-demo.sqlite').as_uri() + '?mode=ro&immutable=1', uri=True) as db:
    passwords = [row[0].encode() for row in db.execute('SELECT DISTINCT password FROM users') if len(row[0]) >= 6]
with tarfile.open(fileobj=io.BytesIO(blob)) as archive:
    for member in archive:
        if not member.isfile():
            continue
        assert not member.name.endswith(('.sqlite', '.db', '.wasm', '.map', '.dump', '.env')), 'Forbidden production asset'
        if member.name.endswith('.js'):
            content = archive.extractfile(member).read()
            assert not any(password in content for password in passwords), 'Demo credential in production JavaScript'
    manifest = json.load(archive.extractfile('./.verification/postgres-runtime.json'))
    assert manifest == {'backend': 'postgresql', 'sqliteRuntimeModules': [], 'testMode': False}
print('Production image: PostgreSQL runtime, no SQLite/WASM/database assets or demo passwords')
