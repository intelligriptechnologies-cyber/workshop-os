"""Do not round approved fractional stock quantities at the native ledger boundary."""
from alembic import op
revision='20261022_0046'
down_revision='20261022_0045'
branch_labels=depends_on=None

def upgrade():
    op.execute('ALTER TABLE stock_ledger ALTER COLUMN quantity TYPE numeric')
    op.execute('ALTER TABLE purchase_order_delivery_confirmations ALTER COLUMN rejected_qty TYPE numeric')

def downgrade():
    raise RuntimeError('Do not narrow recorded stock precision; restore a separate checkpoint if required')
