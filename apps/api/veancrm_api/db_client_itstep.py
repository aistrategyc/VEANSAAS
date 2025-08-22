# apps/api/liderix_api/db_client_itstep.py
from typing import AsyncGenerator, Callable
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import logging

from liderix_api.config.settings import settings

logger = logging.getLogger("uvicorn.error")

# 🎓 Базовый класс моделей
class ClientBase(DeclarativeBase):
    pass

# 🔧 Движок и сессия (ITStep client DB) — опционально
engine_itstep: AsyncEngine | None = None
SessionItstep: sessionmaker | None = None

if settings.ITSTEP_DB_URL:
    engine_itstep = create_async_engine(settings.ITSTEP_DB_URL, echo=False, pool_pre_ping=True)
    SessionItstep = sessionmaker(engine_itstep, class_=AsyncSession, expire_on_commit=False)
else:
    logger.warning("ITSTEP_DB_URL is not set — client analytics deps will return 503.")

# 📦 Dependency — стандартное подключение
async def get_client_async_session() -> AsyncGenerator[AsyncSession, None]:
    if SessionItstep is None:
        raise HTTPException(status_code=503, detail="Client DB is not configured")
    async with SessionItstep() as session:
        yield session

# 📦 Dependency по client_id (на будущее)
def get_client_session_by_client_id(client_id: str) -> Callable[[], AsyncGenerator[AsyncSession, None]]:
    async def _get_session() -> AsyncGenerator[AsyncSession, None]:
        if SessionItstep is None:
            raise HTTPException(status_code=503, detail="Client DB is not configured")
        async with SessionItstep() as session:
            yield session
    return _get_session