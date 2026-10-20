"""Run against a restored demo clone, never the operational database."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


@pytest.mark.integration
def test_email_login_sessions_and_legacy_identity(monkeypatch):
    from app.config import get_settings
    from app.database import get_engine
    from app.main import app

    settings = get_settings()
    if not str(settings.database_url).endswith("/workshopos_restoration_test"):
        pytest.skip("Requires disposable workshopos_restoration_test database")
    monkeypatch.setattr(settings, "auth_mode", "database")
    monkeypatch.setattr(settings, "database_tenant_code", "demo")
    with get_engine().connect() as connection:
        user_id = str(connection.execute(text("""
            SELECT u.id FROM platform_users u
            JOIN tenant_memberships m ON m.user_id=u.id
            JOIN tenants t ON t.id=m.tenant_id
            WHERE t.code='demo' AND u.email='admin@example.com'
        """)).scalar_one())
    with TestClient(app) as client:
        assert client.post("/api/v1/auth/login", json={
            "email": "admin@example.com", "password": "wrong",
        }).status_code == 401
        assert client.post("/api/v1/auth/login", json={
            "tenantCode": "other", "email": "admin@example.com", "password": "admin123",
        }).status_code == 401
        response = client.post("/api/v1/auth/login", json={
            "email": " ADMIN@example.com ", "password": "admin123",
        })
        assert response.status_code == 200, response.text
        assert "HttpOnly" in response.headers["set-cookie"]
        session = client.get("/api/v1/session")
        assert session.status_code == 200, session.text
        assert session.json()["membership"]["email"] == "admin@example.com"
        token = client.cookies.get("workshopos_session")
        csrf = client.cookies.get("workshopos_csrf")
        # A separate browser with the confirmed cookie can restore the session.
        with TestClient(app) as second:
            second.cookies.set("workshopos_session", token)
            assert second.get("/api/v1/session").status_code == 200
            assert client.post("/api/v1/auth/logout", headers={"x-workshopos-csrf": csrf}).status_code == 200
            assert second.get("/api/v1/session").status_code == 401
        assert client.post("/api/v1/auth/login", json={
            "tenantCode": "demo", "userId": user_id, "password": "admin123",
        }).status_code == 200
        assert client.post("/api/v1/auth/login", json={
            "userId": user_id, "email": "admin@example.com", "password": "admin123",
        }).status_code == 422
        monkeypatch.setattr(settings, "database_tenant_code", None)
        assert client.post("/api/v1/auth/login", json={
            "email": "admin@example.com", "password": "admin123",
        }).status_code == 503

