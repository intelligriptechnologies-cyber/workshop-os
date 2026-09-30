import os

import pytest
from fastapi.testclient import TestClient


@pytest.mark.integration
def test_versioned_health_endpoint_uses_postgresql() -> None:
    """The API readiness contract is backed by the Compose PostgreSQL service."""
    assert os.environ.get("WORKSHOPOS_DATABASE_URL", "").startswith("postgresql+")

    from app.main import app

    with TestClient(app) as client:
        response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "database": "postgresql",
        "environment": os.environ.get("WORKSHOPOS_ENVIRONMENT", "local"),
    }
