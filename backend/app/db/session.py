"""Database engine, session management, and connectivity diagnostics."""

from typing import Generator, Optional, Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from app.core.config import settings
from app.core.logging import logger

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif "postgresql" in settings.DATABASE_URL:
    connect_args = {"connect_timeout": 3}

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a SQLAlchemy database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> Tuple[bool, Optional[str]]:
    """Test connection to the configured database. Returns (is_healthy, error_message)."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True, None
    except OperationalError as exc:
        msg = (
            f"Cannot connect to database at {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'configured URL'}. "
            f"Please ensure PostgreSQL service is running and credentials in .env are correct. Detail: {str(exc)}"
        )
        logger.error(msg)
        return False, msg
    except SQLAlchemyError as exc:
        msg = f"Database error during connectivity test: {str(exc)}"
        logger.error(msg)
        return False, msg
    except Exception as exc:
        msg = f"Unexpected error connecting to database: {str(exc)}"
        logger.error(msg)
        return False, msg
