from functools import lru_cache

from typing import Literal

from pydantic import AnyHttpUrl, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from explicit WorkshopOS environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_prefix="WORKSHOPOS_")

    database_url: PostgresDsn
    environment: str = "local"
    auth_mode: Literal["local", "cognito"] = "local"
    allow_demo_auth: bool = True
    superadmin_bootstrap_subjects: str = ""
    cognito_client_id: str | None = None
    cognito_issuer: AnyHttpUrl | None = None
    cognito_jwks_url: AnyHttpUrl | None = None
    cognito_authorization_endpoint: AnyHttpUrl | None = None
    cognito_token_endpoint: AnyHttpUrl | None = None
    cognito_logout_endpoint: AnyHttpUrl | None = None
    cognito_callback_uri: AnyHttpUrl | None = None
    cognito_logout_uri: AnyHttpUrl | None = None

    @property
    def demo_auth_enabled(self) -> bool:
        """The header-based emulator is deliberately unavailable outside local development."""
        return self.environment == "local" and self.auth_mode == "local" and self.allow_demo_auth

    @property
    def configured_superadmin_subjects(self) -> frozenset[str]:
        """Explicit, deployment-owned one-time Superadmin bootstrap allow-list."""
        return frozenset(value.strip() for value in self.superadmin_bootstrap_subjects.split(",") if value.strip())


@lru_cache
def get_settings() -> Settings:
    return Settings()
