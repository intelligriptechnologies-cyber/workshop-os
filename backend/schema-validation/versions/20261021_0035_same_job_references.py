"""Constrain compatibility references to the same job when both links are present."""
import hashlib
from alembic import op
import sqlalchemy as sa

revision = '20261021_0035'
down_revision = '20261021_0034'
branch_labels = None
depends_on = None

REFERENCES = [
    ('legacy_gate_passes', 'invoice_id', 'invoices'),
    ('legacy_invoice_events', 'invoice_id', 'invoices'),
    ('material_approval_events', 'approval_id', 'material_approvals'),
    ('material_events', 'material_row_id', 'material_requests'),
    ('material_purchase_requests', 'material_request_id', 'material_requests'),
    ('material_purchase_requests', 'local_purchase_id', 'local_purchases'),
    ('material_requests', 'invoiced_in', 'invoices'),
    ('legacy_receipts', 'invoice_id', 'invoices'),
    ('stock_ledger', 'material_row_id', 'material_requests'),
]
PARENTS = sorted({parent for _, _, parent in REFERENCES})


def key(table, column):
    return 's4b_job_' + hashlib.sha256(f'{table}.{column}'.encode()).hexdigest()[:20]


def upgrade():
    for parent in PARENTS:
        op.create_unique_constraint(key(parent, 'parent'), parent, ['tenant_id','branch_id','job_card_id','id'])
    for table, column, parent in REFERENCES:
        cols = ['tenant_id','branch_id','job_card_id',column]
        op.create_foreign_key(key(table,column), table, parent, cols,
                              ['tenant_id','branch_id','job_card_id','id'], ondelete='RESTRICT', onupdate='NO ACTION')
        op.create_index(key(table,column)+'_ix', table, cols)


def downgrade():
    for table in sorted({t for t,_,_ in REFERENCES} | set(PARENTS)):
        if op.get_bind().scalar(sa.text(f'SELECT EXISTS (SELECT 1 FROM "{table}")')):
            raise RuntimeError('Rollback refused: affected tables contain records')
    for table,column,parent in reversed(REFERENCES):
        op.drop_index(key(table,column)+'_ix', table_name=table)
        op.drop_constraint(key(table,column), table, type_='foreignkey')
    for parent in reversed(PARENTS):
        op.drop_constraint(key(parent,'parent'), parent, type_='unique')
