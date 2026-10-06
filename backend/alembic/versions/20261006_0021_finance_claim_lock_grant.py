"""Allow the runtime role to lock active invoice claims.

Revision ID: 20261006_0021
Revises: 20261006_0020
"""

from alembic import op


revision = "20261006_0021"
down_revision = "20261006_0020"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # PostgreSQL requires UPDATE privilege for SELECT ... FOR UPDATE, even
    # though finance never mutates this claim row directly.
    op.execute("GRANT SELECT, INSERT, UPDATE, DELETE ON active_invoice_claims TO workshopos_runtime")
    # `_active_invoice` locks both relations in its join to serialize issuance.
    op.execute("GRANT UPDATE ON invoices TO workshopos_runtime")
    op.execute("GRANT UPDATE ON credit_notes TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE UPDATE ON active_invoice_claims FROM workshopos_runtime")
    op.execute("REVOKE UPDATE ON invoices FROM workshopos_runtime")
    op.execute("REVOKE UPDATE ON credit_notes FROM workshopos_runtime")
