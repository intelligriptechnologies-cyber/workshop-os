"""Invalidate stale authorization when membership version changes."""
from alembic import op
revision='20261021_0039'
down_revision='20261021_0038'
branch_labels=depends_on=None

def upgrade():
    op.execute('ALTER TABLE database_sessions ADD COLUMN membership_version integer NOT NULL DEFAULT 0')

def downgrade():
    op.execute('ALTER TABLE database_sessions DROP COLUMN membership_version')
