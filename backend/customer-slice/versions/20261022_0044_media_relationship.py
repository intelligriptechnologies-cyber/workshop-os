"""Bind immutable content to the exact tenant/branch/job of its media metadata."""
from alembic import op
revision='20261022_0044'
down_revision='20261022_0043'
branch_labels=depends_on=None

def upgrade():
    op.execute('ALTER TABLE job_media ADD CONSTRAINT slice_media_scope_identity UNIQUE(tenant_id,branch_id,job_card_id,id)')
    op.execute('''ALTER TABLE slice_media_content ADD CONSTRAINT slice_media_content_same_job
      FOREIGN KEY(tenant_id,branch_id,job_card_id,media_id)
      REFERENCES job_media(tenant_id,branch_id,job_card_id,id) ON DELETE RESTRICT''')

def downgrade():
    raise RuntimeError('Restore into a separate disposable clone; do not weaken verified media relationships')
