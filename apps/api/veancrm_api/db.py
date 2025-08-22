from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator
from veancrm_api.config.settings import settings

# 🎯 VEANCRM БД URL загружается из .env
# Формат для asyncpg: postgresql+asyncpg://user:password@host:port/database
VEANCRM_DB_URL = settings.VEANCRM_DB_URL

# 🎯 Базовый класс для CRM моделей
class Base(DeclarativeBase):
    pass

# ⚙️ Создание асинхронного движка SQLAlchemy
async_engine = create_async_engine(
    VEANCRM_DB_URL,
    echo=False,
    pool_pre_ping=True,
)

# ⚙️ Создание асинхронной фабрики сессий
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 📥 Зависимость для FastAPI — асинхронная сессия VEANCRM
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session