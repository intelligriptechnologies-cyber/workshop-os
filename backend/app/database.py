from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings


def get_engine() -> Engine:
    """Create a process-local engine from the current settings."""
    return create_engine(
        str(get_settings().database_url),
        pool_pre_ping=True,
        connect_args={"connect_timeout": 3},
    )


def get_session() -> Generator[Session, None, None]:
    session_factory = sessionmaker(bind=get_engine(), autoflush=False, autocommit=False)
    with session_factory() as session:
        yield session
