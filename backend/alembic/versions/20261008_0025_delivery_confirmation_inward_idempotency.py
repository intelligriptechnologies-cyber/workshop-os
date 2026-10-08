"""Tie delivery-confirmation stock postings to one immutable source.

Revision ID: 20261008_0025
Revises: 20261008_0024
"""

from alembic import op


revision = "20261008_0025"
down_revision = "20261008_0024"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE stock_inwards
        ADD COLUMN delivery_confirmation_id bigint UNIQUE
        REFERENCES purchase_order_delivery_confirmations(id) ON DELETE RESTRICT
    """)


def downgrade() -> None:
    op.execute("ALTER TABLE stock_inwards DROP COLUMN IF EXISTS delivery_confirmation_id")
