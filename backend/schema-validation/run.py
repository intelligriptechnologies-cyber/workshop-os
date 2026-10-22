"""Explicit isolated migration entry point; never used by application startup."""
import json
import hashlib
import os
from pathlib import Path
import sys

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url


def guarded_engine():
    manifest = json.loads(Path('/workspace/source-manifest.json').read_text())
    if manifest['revision'] != '50c8aab1766b61c914e2829b460bfd1697723ec2':
        raise RuntimeError('Wrong backend candidate image')
    for item in manifest['files']:
        if hashlib.sha256((Path('/workspace') / item['path']).read_bytes()).hexdigest() != item['sha256']:
            raise RuntimeError('Candidate source provenance mismatch')
    scope = os.environ.get('STAGE4B_SCOPE')
    if scope not in {'dev', 'test'} or os.environ.get('WORKSHOPOS_ENVIRONMENT') != 'stage4b':
        raise RuntimeError('Disposable Stage 4B scope required')
    url = make_url(os.environ['WORKSHOPOS_DATABASE_URL'])
    if (url.drivername, url.host, url.port, url.database, url.username) != (
        'postgresql+psycopg', f'schema-{scope}', 5432, f'stage4b_{scope}', f'stage4b_{scope}_owner'
    ) or url.query or not url.password:
        raise RuntimeError('Refusing non-disposable migration target')
    engine = create_engine(url, connect_args={'connect_timeout': 3})
    with engine.connect() as connection:
        if tuple(connection.execute(text('SELECT current_database(), current_user')).one()) != (
            f'stage4b_{scope}', f'stage4b_{scope}_owner'):
            raise RuntimeError('Disposable database identity mismatch')
    return engine


def configuration():
    cfg = Config('/workspace/alembic.ini')
    cfg.set_main_option('script_location', '/workspace/alembic')
    cfg.set_main_option('version_locations', '/workspace/alembic/versions /schema/versions')
    cfg.set_main_option('version_path_separator', 'space')
    return cfg


if __name__ == '__main__':
    engine = guarded_engine()
    cfg = configuration()
    if sys.argv[1] == 'baseline':
        command.upgrade(cfg, '20261018_0033')
    elif sys.argv[1] == 'rollback-addition':
        command.downgrade(cfg, '20261018_0033')
    elif sys.argv[1] == 'upgrade':
        command.upgrade(cfg, 'head')
        from tests.test_schema import catalog
        with engine.connect() as c:
            Path('/artifacts/' + os.environ['STAGE4B_SCOPE'] + '-catalog.json').write_text(json.dumps(catalog(c), indent=2, default=str))
    elif sys.argv[1] == 'validate':
        if os.environ['STAGE4B_SCOPE'] != 'test':
            raise RuntimeError('Validation writes allowed only in disposable test scope')
        import pytest
        raise SystemExit(pytest.main(['-q', '-p', 'no:cacheprovider', '--tb=short', '--junitxml=/artifacts/junit.xml', '/schema/tests']))
    else:
        raise RuntimeError('Unknown operation')
    with engine.connect() as c:
        print('Migration head:', c.scalar(text('SELECT version_num FROM alembic_version')))
        print('Public tables:', c.scalar(text("SELECT count(*) FROM information_schema.tables WHERE table_schema='public'")))
