from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from fastapi import Depends
from typing import AsyncGenerator

from liderix_api.config.settings import settings

# 🎯 Основной URL БД загружается из .env
DATABASE_URL = settings.LIDERIX_DB_URL

# 🎯 Базовый класс для core-моделей
class Base(DeclarativeBase):
    pass

# ⚙️ Создание движка и асинхронной сессии
def get_async_engine():
    return create_async_engine(settings.LIDERIX_DB_URL, echo=False, pool_pre_ping=True)

def get_main_async_session():
    engine = get_async_engine()
    return sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# 📥 Зависимость FastAPI
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with MainAsyncSession() as session:
        yield session
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator
from liderix_api.config.settings import settings

# 🎯 Основной URL БД загружается из .env
# Формат для asyncpg: postgresql+asyncpg://user:password@host:port/database
LIDERIX_DB_URL = settings.LIDERIX_DB_URL

# 🎯 Базовый класс для core-моделей
class Base(DeclarativeBase):
    pass

# ⚙️ Создание асинхронного движка SQLAlchemy
async_engine = create_async_engine(
    LIDERIX_DB_URL,
    echo=False,
    pool_pre_ping=True,
)

# ⚙️ Создание асинхронной фабрики сессий
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 📥 Зависимость для FastAPI — асинхронная сессия
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session