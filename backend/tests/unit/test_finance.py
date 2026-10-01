from datetime import datetime, timezone

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
