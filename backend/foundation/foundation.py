"""Stage 4A harness. Candidate business modules remain byte-identical."""
import json
import logging
import os
import time
from uuid import uuid4

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session


def validate_environment(environ):
    scope = environ.get("STAGE4A_SCOPE")
    if scope not in {"dev", "test"}:
        raise RuntimeError("STAGE4A_SCOPE must be dev or test")
    if environ.get("WORKSHOPOS_ENVIRONMENT") != "stage4a":
        raise RuntimeError("Stage 4A environment required")
    if environ.get("WORKSHOPOS_AUTH_MODE") != "database" or environ.get("WORKSHOPOS_ALLOW_DEMO_AUTH") != "false":
        raise RuntimeError("Shared database authentication without header bypass required")
    try:
        url = make_url(environ["WORKSHOPOS_DATABASE_URL"])
    except Exception:
        raise RuntimeError("Invalid Stage 4A database configuration") from None
    if (url.drivername, url.host, url.port, url.database, url.username) != (
        "postgresql+psycopg", f"db-{scope}", 5432, f"stage4a_{scope}", f"stage4a_{scope}_runtime"
    ) or url.query or not url.password:
        raise RuntimeError("Database must be the isolated scoped runtime target")
    return scope, url


SCOPE, URL = validate_environment(os.environ)
from app.main import app  # noqa: E402
from app.database import get_session  # noqa: E402

BASELINE_ROUTES = {(method, route.path) for route in app.routes for method in getattr(route, "methods", set())}
BASELINE_OPENAPI = app.openapi()
engine = create_engine(URL, pool_pre_ping=True, connect_args={"connect_timeout": 3})
logger = logging.getLogger("stage4a.requests")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(message)s"))
logger.addHandler(handler)
logger.propagate = False


def isolated_session():
    with Session(engine, autoflush=False) as session:
        yield session


app.dependency_overrides[get_session] = isolated_session


@app.middleware("http")
async def structured_request(request: Request, call_next):
    request_id = str(uuid4())
    start = time.monotonic()
    try:
        response = await call_next(request)
    except Exception:
        # Never serialize exceptions/DSNs/SQL, bodies, query strings or credentials.
        response = JSONResponse(status_code=500, content={"code": "INTERNAL_ERROR", "requestId": request_id})
    response.headers["X-Request-ID"] = request_id
    logger.info(json.dumps({"event": "request", "requestId": request_id, "method": request.method,
                            "route": getattr(request.scope.get("route"), "path", "unmatched"),
                            "status": response.status_code, "durationMs": round((time.monotonic() - start) * 1000)}))
    return response


@app.exception_handler(RequestValidationError)
async def safe_validation(_, error):
    # Preserve 422/detail/loc/msg/type without echoing submitted passwords in input/ctx.
    return JSONResponse(status_code=422, content={"detail": [
        {key: item[key] for key in ("loc", "msg", "type") if key in item} for item in error.errors()
    ]})


@app.get("/livez", tags=["foundation"])
def live():
    return {"status": "ok", "scope": SCOPE}


@app.get("/readyz", tags=["foundation"])
def ready():
    try:
        with engine.connect() as connection:
            row = connection.execute(text("SELECT current_database(), current_user, rolsuper, rolbypassrls FROM pg_roles WHERE rolname=current_user")).one()
        if row[0] != f"stage4a_{SCOPE}" or row[1] != f"stage4a_{SCOPE}_runtime" or row[2] or row[3]:
            raise RuntimeError("scope mismatch")
    except (SQLAlchemyError, RuntimeError):
        return JSONResponse(status_code=503, content={"code": "DATABASE_NOT_READY"})
    return {"status": "ready", "database": "postgresql", "scope": SCOPE, "schema": "not_applied"}


# Force inclusion of the two new operational endpoints in generated documentation.
app.openapi_schema = None
