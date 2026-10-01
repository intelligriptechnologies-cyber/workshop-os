from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_session


app = FastAPI(title="WorkshopOS API", version="0.1.0")


@app.get("/health", tags=["operations"])
def health(session: Session = Depends(get_session)) -> dict[str, str]:
    """Report ready only after PostgreSQL accepts a query."""
    try:
        session.execute(text("SELECT 1"))
    except SQLAlchemyError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="database_unavailable") from error
    return {"status": "ok", "database": "postgresql", "environment": get_settings().environment}


@app.get("/api/v1/health", tags=["operations"])
def api_health(session: Session = Depends(get_session)) -> dict[str, str]:
    return health(session)
