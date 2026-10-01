from functools import lru_cache

import pytest

from app.config import Settings


def local_settings() -> Settings:
    return Settings(
        database_url="postgresql+psycopg://workshopos_admin:password@localhost:5432/workshopos",
        environment="local",
        auth_mode="local",
        allow_demo_auth=True,
    )


def test_local_demo_header_is_explicitly_development_only() -> None:
    assert local_settings().demo_auth_enabled is True
    assert local_settings().model_copy(update={"environment": "staging"}).demo_auth_enabled is False
    assert local_settings().model_copy(update={"allow_demo_auth": False}).demo_auth_enabled is False


def test_auth_config_returns_local_contract_only_for_local_mode(monkeypatch: pytest.MonkeyPatch) -> None:
    from app import main

    monkeypatch.setattr(main, "get_settings", local_settings)
    assert main.auth_config() == {"mode": "local", "allowDemo": True}


def test_auth_config_rejects_local_emulator_outside_local_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    from app import main

    monkeypatch.setattr(main, "get_settings", lambda: local_settings().model_copy(update={"environment": "production"}))
    with pytest.raises(Exception) as error:
        main.auth_config()
    assert getattr(error.value, "status_code", None) == 503
