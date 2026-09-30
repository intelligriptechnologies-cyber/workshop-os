import base64

import pytest
from fastapi import HTTPException

from app.execution import _decode_attachment


def test_decode_attachment_accepts_bounded_base64_payload() -> None:
    data = _decode_attachment(base64.b64encode(b"evidence").decode(), "image/jpeg")
    assert data == b"evidence"


@pytest.mark.parametrize("content_type,payload,code", [
    ("text/plain", base64.b64encode(b"evidence").decode(), "ATTACHMENT_CONTENT_TYPE_INVALID"),
    ("image/jpeg", "not-base64!", "ATTACHMENT_DATA_INVALID"),
])
def test_decode_attachment_rejects_untrusted_or_oversized_data(content_type: str, payload: str, code: str) -> None:
    with pytest.raises(HTTPException, match=code):
        _decode_attachment(payload, content_type)


def test_decode_attachment_rejects_oversized_data_without_allocating_a_large_fixture(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("app.execution.MAX_ATTACHMENT_BYTES", 3)
    with pytest.raises(HTTPException, match="ATTACHMENT_SIZE_INVALID"):
        _decode_attachment(base64.b64encode(b"four").decode(), "image/jpeg")
