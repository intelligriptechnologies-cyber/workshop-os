"""Grant the one runtime deletion needed to replace editable draft PO lines.

Revision ID: 20260929_0009
Revises: 20260929_0008
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0009"
down_revision = "20260929_0008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # `_replace_lines` deletes only RLS-visible lines while editing a DRAFT PO.
    # Do not broaden DELETE to catalogue, inwards, or the immutable ledger.
    op.execute("GRANT DELETE ON purchase_order_lines TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE DELETE ON purchase_order_lines FROM workshopos_runtime")
