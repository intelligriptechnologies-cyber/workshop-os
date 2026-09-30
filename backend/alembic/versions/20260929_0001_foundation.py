"""Create the WorkshopOS migration baseline.

Revision ID: 20260929_0001
Revises:
Create Date: 2026-09-29
"""

from typing import Sequence, Union


revision: str = "20260929_0001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # The first domain migration owns Tenant and Branch tables. Keeping this
    # baseline empty lets that vertical slice define the domain boundary.
    pass


def downgrade() -> None:
    pass
