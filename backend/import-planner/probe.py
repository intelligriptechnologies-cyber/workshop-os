"""Run only in the guarded Stage 4B container; PostgreSQL reads only."""
import json
from sqlalchemy import inspect, text
from run import guarded_engine
from tests.test_schema import catalog

engine = guarded_engine()
with engine.connect() as c:
    c.exec_driver_sql('SET TRANSACTION READ ONLY')
    if c.scalar(text('SHOW transaction_read_only')) != 'on':
        raise RuntimeError('Read-only transaction required')
    head = c.scalar(text('SELECT version_num FROM alembic_version'))
    if head != '20261021_0035':
        raise RuntimeError('Unexpected target head')
    result = {'head': head, 'transaction_read_only': True,
              'database': c.scalar(text('SELECT current_database()')),
              'catalog': catalog(c),
              'counts': {t: c.scalar(text('SELECT count(*) FROM "'+t+'"')) for t in sorted(inspect(c).get_table_names())}}
    c.rollback()
print(json.dumps(result, indent=2, default=str))
