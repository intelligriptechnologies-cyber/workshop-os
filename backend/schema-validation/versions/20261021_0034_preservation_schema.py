"""Add reviewed preservation schema; no source data import or value conversion."""
from pathlib import Path
import json
from alembic import op
import sqlalchemy as sa

revision = '20261021_0034'
down_revision = '20261018_0033'
branch_labels = None
depends_on = None
HERE = Path(__file__).parent


def upgrade():
    op.execute((HERE / '0034_expand.sql').read_text())
    op.execute((HERE / '0034_metadata.sql').read_text())


def downgrade():
    # Contracting columns or numeric precision must never discard stored records.
    # Scope is deliberately stricter than required: populated affected databases
    # need forward repair or a separately reviewed data-preserving rollback.
    contract = json.loads((HERE.parent / 'schema-contract.json').read_text())
    tables = set(contract['new_tables']) | {c['table'] for c in contract['columns']}
    for table in sorted(tables):
        if op.get_bind().scalar(sa.text(f'SELECT EXISTS (SELECT 1 FROM "{table}")')):
            raise RuntimeError('Rollback refused: affected tables contain records')
    op.execute((HERE / '0034_metadata_down.sql').read_text())
    op.execute((HERE / '0034_contract.sql').read_text())
