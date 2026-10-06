"""Make material-reservation retries durable and replay-safe.

Revision ID: 20261006_0020
Revises: 20261006_0019
"""

from alembic import op


revision = "20261006_0020"
down_revision = "20261006_0019"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE material_reservations ADD COLUMN request_key text")
    op.execute("""CREATE UNIQUE INDEX material_reservations_idempotency_key
        ON material_reservations (tenant_id, job_card_id, request_key)
        WHERE request_key IS NOT NULL""")


def downgrade() -> None:
    op.execute("DROP INDEX material_reservations_idempotency_key")
    op.execute("ALTER TABLE material_reservations DROP COLUMN request_key")
