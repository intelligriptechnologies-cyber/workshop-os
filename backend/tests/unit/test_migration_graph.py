from pathlib import Path

from alembic.config import Config
from alembic.script import ScriptDirectory


def test_active_migration_graph_has_one_head() -> None:
    """A fresh Compose database can upgrade with Alembic's unambiguous `head`."""
    backend_root = Path(__file__).parents[2]
    config = Config(str(backend_root / "alembic.ini"))
    config.set_main_option("script_location", str(backend_root / "alembic"))

    assert len(ScriptDirectory.from_config(config).get_heads()) == 1
