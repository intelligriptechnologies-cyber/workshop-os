from datetime import datetime, timezone
from pathlib import Path

from app.finance import _fiscal_year, _render_html


def test_fiscal_year_rolls_over_on_indian_financial_year_boundary() -> None:
    assert _fiscal_year(datetime(2026, 3, 31, tzinfo=timezone.utc)) == "FY2025-26"
    assert _fiscal_year(datetime(2026, 4, 1, tzinfo=timezone.utc)) == "FY2026-27"


def test_rendered_snapshot_is_deterministic_and_contains_document_identity() -> None:
    rendered = _render_html("INV-FY2026-27-00001", "INVOICE", {"totalPaise": 11800, "currency": "INR"})
    assert "INV-FY2026-27-00001" in rendered
    assert '"totalPaise":11800' in rendered


def test_issued_document_html_escapes_untrusted_snapshot_content() -> None:
    rendered = _render_html('INV-<unsafe>', 'INVOICE', {'description': '<script>alert(1)</script>'})
    assert '<script>' not in rendered
    assert '&lt;script&gt;alert(1)&lt;/script&gt;' in rendered
    assert 'INV-&lt;unsafe&gt;' in rendered


def test_runtime_role_can_lock_the_active_invoice_claim_before_issuing() -> None:
    migration = Path(__file__).parents[2] / "alembic" / "versions" / "20261006_0021_finance_claim_lock_grant.py"
    sql = migration.read_text(encoding="utf-8")
    assert "GRANT SELECT, INSERT, UPDATE, DELETE ON active_invoice_claims TO workshopos_runtime" in sql
    assert "GRANT UPDATE ON invoices TO workshopos_runtime" in sql
    assert "GRANT UPDATE ON credit_notes TO workshopos_runtime" in sql
