import json
import os
from pathlib import Path
import subprocess

from fastapi import HTTPException
from fastapi.testclient import TestClient
import pytest
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

import foundation as f


@pytest.fixture
def client():
    with TestClient(f.app, raise_server_exceptions=False) as value:
        yield value


def test_isolated_test_database_and_restricted_role():
    assert f.SCOPE == "test"
    with f.engine.connect() as connection:
        row = connection.execute(text("SELECT current_database(), current_user, rolsuper, rolbypassrls FROM pg_roles WHERE rolname=current_user")).one()
        assert tuple(row) == ("stage4a_test", "stage4a_test_runtime", False, False)
        assert connection.scalar(text("SELECT count(*) FROM information_schema.tables WHERE table_schema='public'")) == 0


@pytest.mark.parametrize("key,value", [
    ("STAGE4A_SCOPE", "production"),
    ("WORKSHOPOS_ENVIRONMENT", "production"),
    ("WORKSHOPOS_AUTH_MODE", "local"),
    ("WORKSHOPOS_ALLOW_DEMO_AUTH", "true"),
    ("WORKSHOPOS_DATABASE_URL", "postgresql+psycopg://a:b@db-dev:5432/stage4a_dev"),
    ("WORKSHOPOS_DATABASE_URL", "postgresql+psycopg://a:b@external.example:5432/production"),
    ("WORKSHOPOS_DATABASE_URL", "postgresql+psycopg://a:b@db-test:5432/stage4a_test?host=external.example"),
    ("WORKSHOPOS_DATABASE_URL", "invalid"),
])
def test_environment_fails_closed(key, value):
    environ = dict(os.environ)
    environ[key] = value
    with pytest.raises(RuntimeError):
        f.validate_environment(environ)


@pytest.mark.parametrize("path", ["/health", "/api/v1/health", "/livez", "/readyz"])
def test_operational_contracts(client, path):
    response = client.get(path)
    assert response.status_code == 200
    assert response.json()["status"] in {"ok", "ready"}
    assert response.headers["x-request-id"]
    if path == "/readyz":
        assert response.json() == {"status": "ready", "database": "postgresql", "scope": "test", "schema": "not_applied"}


def test_readiness_failure_redacts_details(client, monkeypatch):
    def unavailable():
        raise OperationalError("SELECT secret", {}, Exception("secret-password"))
    monkeypatch.setattr(f.engine, "connect", unavailable)
    response = client.get("/readyz")
    assert response.status_code == 503
    assert response.json() == {"code": "DATABASE_NOT_READY"}
    assert client.get("/livez").status_code == 200


def test_candidate_routes_and_openapi_unchanged(client):
    expected = {tuple(row) for row in json.loads(Path("foundation_tests/candidate-routes.json").read_text())}
    actual = {(m, r.path) for r in f.app.routes for m in getattr(r, "methods", ())}
    assert len(expected) == 152
    assert expected <= f.BASELINE_ROUTES <= actual
    assert actual - f.BASELINE_ROUTES == {("GET", "/livez"), ("GET", "/readyz")}
    current = client.get("/openapi.json").json()
    for path, contract in f.BASELINE_OPENAPI["paths"].items():
        assert current["paths"][path] == contract


def test_common_authentication_config_no_credentials(client):
    assert client.get("/api/v1/auth/config").json() == {"mode": "database", "allowDemo": False}


@pytest.mark.parametrize("path", ["/api/v1/session", "/api/v1/jobs", "/api/v1/customers"])
def test_missing_session_denied_without_local_bypass(client, path):
    response = client.get(path, headers={"x-workshopos-identity": "admin@example.com"})
    assert response.status_code == 401
    assert response.json() == {"code": "AUTHENTICATION_REQUIRED"}


def test_login_validation_does_not_echo_credentials(client):
    response = client.post("/api/v1/auth/login", json={"password": {"secret": "do-not-echo"}})
    assert response.status_code == 422
    assert "do-not-echo" not in response.text
    assert all("input" not in error for error in response.json()["detail"])


def test_password_hash_primitive():
    from app.database_auth import hash_password, verify_password
    encoded = hash_password("disposable-contract-value")
    assert "disposable-contract-value" not in encoded
    assert verify_password("disposable-contract-value", encoded)
    assert not verify_password("incorrect", encoded)


def test_domain_errors_keep_existing_contract(client):
    from app.main import workshop_http_error
    response = workshop_http_error(None, HTTPException(409, {"code": "STATE_CONFLICT"}))
    assert response.status_code == 409
    assert json.loads(response.body) == {"code": "STATE_CONFLICT"}


def test_structured_logging_does_not_log_request_secrets(client, capsys):
    # Capture the handler rather than allow a logger to serialize query/body data.
    import io
    output = io.StringIO()
    previous = f.handler.setStream(output)
    try:
        response = client.get("/livez?password=not-for-logs", headers={"authorization": "not-for-logs"})
    finally:
        f.handler.setStream(previous)
    event = json.loads(output.getvalue().strip())
    assert event["requestId"] == response.headers["x-request-id"]
    assert event["route"] == "/livez"
    assert "not-for-logs" not in output.getvalue()


def test_unexpected_errors_are_sanitized(client):
    # Test-only route, removed immediately; never part of the served image's route registration.
    def broken():
        raise RuntimeError("private-dsn-password")
    before = list(f.app.router.routes)
    f.app.add_api_route("/__contract_error", broken, methods=["GET"])
    try:
        response = client.get("/__contract_error")
        assert response.status_code == 500
        assert response.json()["code"] == "INTERNAL_ERROR"
        assert "private-dsn-password" not in response.text
    finally:
        f.app.router.routes[:] = before
        f.app.openapi_schema = None


def test_alembic_lineage_and_connection():
    from alembic.config import Config
    from alembic.script import ScriptDirectory
    scripts = ScriptDirectory.from_config(Config("alembic.ini"))
    assert scripts.get_heads() == ["20261018_0033"]
    assert len(list(scripts.walk_revisions())) == 34
    result = subprocess.run(["alembic", "current"], capture_output=True, text=True)
    assert result.returncode == 0, "Alembic could not connect to the disposable database"
    assert result.stdout.strip() == ""


def test_offline_migration_plan_without_execution():
    result = subprocess.run(["alembic", "upgrade", "head", "--sql"], capture_output=True, text=True)
    assert result.returncode == 0, "Candidate offline migration generation failed"
    assert "20261018_0033" in result.stdout
    with f.engine.connect() as connection:
        assert connection.scalar(text("SELECT count(*) FROM information_schema.tables WHERE table_schema='public'")) == 0
