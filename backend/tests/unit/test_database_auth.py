from app.database_auth import hash_password, verify_password, _code
from fastapi import HTTPException
import pytest


def test_password_hash_is_salted_and_never_contains_password() -> None:
    first = hash_password("admin123")
    second = hash_password("admin123")
    assert first != second
    assert "admin123" not in first
    assert verify_password("admin123", first)
    assert not verify_password("wrong", first)
    assert not verify_password("admin123", "malformed")


def test_tenant_codes_are_normalized_and_reject_invalid_values() -> None:
    assert _code(" Demo ") == "demo"
    with pytest.raises(HTTPException):
        _code("../demo")
