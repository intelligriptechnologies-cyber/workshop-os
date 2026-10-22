"""Apply additive slice migrations only; never restore, seed or replace data."""
import os
import sys
from alembic import command
from alembic.config import Config
from app.config import get_settings

scope = sys.argv[1]
if scope not in ('test', 'dev'):
    raise SystemExit('Only isolated test/dev slice databases are supported')
os.environ['WORKSHOPOS_DATABASE_URL'] = f"postgresql+psycopg://slice_owner:{os.environ['OWNER_PASSWORD']}@slice-{scope}:5432/slice_{scope}"
get_settings.cache_clear()
cfg = Config('/workspace/alembic.ini')
cfg.set_main_option('script_location', '/workspace/alembic')
cfg.set_main_option('version_locations', '/workspace/alembic/versions /schema/versions /rehearsal/versions /slice/versions')
cfg.set_main_option('version_path_separator', 'space')
command.upgrade(cfg, 'head')
