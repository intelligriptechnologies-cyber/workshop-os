from functools import lru_cache

from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from explicit WorkshopOS environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_prefix="WORKSHOPOS_")

    database_url: PostgresDsn
    environment: str = "local"


@lru_cache
def get_settings() -> Settings:
    return Settings()
