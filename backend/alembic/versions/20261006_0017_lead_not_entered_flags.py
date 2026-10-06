"""Persist explicit company and email not-entered lead states.

Revision ID: 20261006_0017
Revises: 20261002_0016
"""

from alembic import op


revision = "20261006_0017"
down_revision = "20261002_0016"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE sales_leads
            ADD COLUMN company_not_entered boolean NOT NULL DEFAULT false,
            ADD COLUMN email_not_entered boolean NOT NULL DEFAULT false;
    """)


def downgrade() -> None:
    op.execute("""
        ALTER TABLE sales_leads
            DROP COLUMN email_not_entered,
            DROP COLUMN company_not_entered;
    """)
