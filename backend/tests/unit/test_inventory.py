from uuid import UUID
from pathlib import Path

import pytest
from fastapi import HTTPException

from app.inventory import StockAdjustmentInput, _adjustment_quantity, _permission
from app.tenancy import BranchScope, TenantScope


def _scope(*permissions: str, actor_type: str = "tenant_user"):
    branch = UUID("00000000-0000-4000-8000-000000000071")
    current = TenantScope(
        actor_id=UUID("00000000-0000-4000-8000-000000000072"), membership_id=UUID("00000000-0000-4000-8000-000000000073"),
        tenant_id=UUID("00000000-0000-4000-8000-000000000074"), tenant_name="Workshop", display_name="Store", email="store@example.test",
        branch_ids=(branch,), branches=(BranchScope(id=branch, name="Main"),), role_ids=(), roles=(), permissions=permissions, version=1, actor_type=actor_type,
    )
    return object(), current


def test_inventory_authority_is_explicit_and_support_is_read_only() -> None:
    assert _permission(_scope("page.stock.read"), mutation=False).display_name == "Store"
    assert _permission(_scope("page.inward-purchases.write"), mutation=True).display_name == "Store"
    with pytest.raises(HTTPException) as raised:
        _permission(_scope("page.customers.write"), mutation=True)
    assert raised.value.detail["code"] == "PERMISSION_DENIED"
    with pytest.raises(HTTPException) as raised:
        _permission(_scope("page.stock.write", actor_type="support_emulation"), mutation=True)
    assert raised.value.detail["code"] == "TENANT_READ_ONLY"


def test_stock_adjustment_input_requires_a_nonzero_quantity_at_command_boundary() -> None:
    parsed = StockAdjustmentInput(itemId=1, quantity=0, reason="Count correction")
    assert parsed.quantity == 0
    with pytest.raises(HTTPException) as raised:
        _adjustment_quantity(parsed.quantity)
    assert raised.value.detail["code"] == "STOCK_ADJUSTMENT_ZERO"


def test_runtime_role_has_only_the_po_line_delete_grant_needed_for_draft_replacement() -> None:
    migration = Path(__file__).parents[2] / "alembic" / "versions" / "20260929_0009_purchase_order_line_delete.py"
    sql = migration.read_text(encoding="utf-8")
    assert "GRANT DELETE ON purchase_order_lines TO workshopos_runtime" in sql
    assert "GRANT DELETE ON stock_ledger" not in sql
    assert "GRANT DELETE ON stock_inwards" not in sql
