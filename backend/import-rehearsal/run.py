"""Fresh disposable rehearsal: replay migrations, import, then verify."""
import json
from pathlib import Path
from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import inspect, text
import pytest
from importer import guarded_engine, run_import, decode
from planner import financial


def configuration():
    cfg = Config('/workspace/alembic.ini')
    cfg.set_main_option('script_location','/workspace/alembic')
    cfg.set_main_option('version_locations','/workspace/alembic/versions /schema/versions /rehearsal/versions')
    cfg.set_main_option('version_path_separator','space')
    return cfg


def export_reports(engine):
    with engine.connect() as c:
        c.execute(text('SET TRANSACTION READ ONLY'))
        ledger=[dict(r) for r in c.execute(text('''SELECT source_table,source_key,target_table,
            target_key,disposition,reasons FROM import_custody.records ORDER BY source_table,source_key''')).mappings()]
        history={t:[decode(p) for p in c.scalars(text('SELECT payload FROM import_custody.records WHERE source_table=:t'),{'t':t})]
                 for t in ('invoices','invoice_items','payments')}
        Path('/artifacts/record-ledger.json').write_text(json.dumps(ledger,indent=2))
        Path('/artifacts/financial-preservation.json').write_text(json.dumps(sorted(financial(history),key=lambda r:r['id']),indent=2))
        c.rollback()


if __name__ == '__main__':
    engine = guarded_engine()
    cfg = configuration()
    script = ScriptDirectory.from_config(cfg)
    assert script.get_heads()==['20261021_0037']
    assert len(list(script.walk_revisions()))==38
    with engine.connect() as c:
        fresh = not inspect(c).has_table('alembic_version')
    command.upgrade(cfg,'head')
    if fresh:
        command.downgrade(cfg,'20261021_0035')
        command.upgrade(cfg,'head')
    command.upgrade(cfg,'head')
    result = run_import(engine)
    retry = run_import(engine)
    assert retry['idempotent_replay']
    assert result['business_records']+result['quarantined_records']==3241
    with engine.connect() as c:
        result['public_tables']=len(inspect(c).get_table_names(schema='public'))
        result['custody_tables']=len(inspect(c).get_table_names(schema='import_custody'))
        result['populated_business_tables']={name:c.scalar(text(f'SELECT count(*) FROM "{name}"'))
            for name in sorted({x['target_table'] for x in result['by_table'] if x['disposition']=='BUSINESS'})}
    result['migration_replay_from_empty']=fresh
    result['migration_head']='20261021_0037'
    result['migration_revisions']=38
    result['idempotency_verified']=True
    Path('/artifacts/reconciliation.json').write_text(json.dumps(result,indent=2))
    export_reports(engine)
    print(json.dumps({k:v for k,v in result.items() if k not in {'by_table','reasons'}},indent=2),flush=True)
    raise SystemExit(pytest.main(['-q','-p','no:cacheprovider','--tb=short',
                                 '--junitxml=/artifacts/tests.xml','/rehearsal/test_rehearsal.py','/rehearsal/test_business_coverage.py']))
