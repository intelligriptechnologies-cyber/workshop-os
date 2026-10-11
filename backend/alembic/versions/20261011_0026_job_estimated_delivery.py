"""Add a calendar delivery date and archival guard to authoritative Job Cards.

Revision ID: 20261011_0026
Revises: 20261008_0025
"""

from alembic import op


revision = "20261011_0026"
down_revision = "20261008_0025"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE job_cards ADD COLUMN estimated_delivery date")
    op.execute("ALTER TABLE job_cards ADD COLUMN archived_at timestamptz")


def downgrade() -> None:
    op.execute("ALTER TABLE job_cards DROP COLUMN archived_at")
    op.execute("ALTER TABLE job_cards DROP COLUMN estimated_delivery")
