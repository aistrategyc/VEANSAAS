# apps/api/liderix_api/config/settings.py

from __future__ import annotations
import os
import logging
import secrets
import re
from typing import List, Optional
from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # ── Общие ────────────────────────────────────────────────────────────────────
    PROJECT_NAME: str = "Liderix API"
    PROJECT_VERSION: str = "0.2.0"
    API_PREFIX: str = "/api"
    LOG_LEVEL: str = "info"
    DEBUG: bool = False

    # ── БД ──────────────────────────────────────────────────────────────────────
    # 🎯 ВАЖНО: По умолчанию async URL для FastAPI, env.py автоматически преобразует в sync
    # 🔒 БЕЗОПАСНОСТЬ: Никогда не указывать пароли в коде! Только через переменные окружения
    LIDERIX_DB_URL: Optional[str] = None  # ОБЯЗАТЕЛЬНО через .env файл
    POSTGRES_URL: Optional[str] = None  # для совместимости
    ITSTEP_DB_URL: Optional[str] = None  # клиентская БД

    # ── JWT / Security ─────────────────────────────────────────────────────────
    SECRET_KEY: str = Field(..., min_length=64, description="Минимум 64 символа для безопасности")
    JWT_ALGORITHM: str = "HS256"
    JWT_ISSUER: str = "liderix"
    JWT_AUDIENCE: str = "liderix-clients"
    ACCESS_TTL_SEC: int = 15 * 60
    REFRESH_TTL_SEC: int = 30 * 24 * 60 * 60
    ACCESS_TOKEN_EXPIRE_MINUTES: Optional[int] = None
    REFRESH_COOKIE_NAME: str = "lrx_refresh"

    # ── Dev helpers ─────────────────────────────────────────────────────────────
    DEV_AUTO_VERIFY: bool = False

    # ── Cookies ─────────────────────────────────────────────────────────────────
    COOKIE_DOMAIN: Optional[str] = None
    # 🔒 Автоматическое определение безопасных настроек cookies
    COOKIE_SECURE: bool = Field(default_factory=lambda: os.getenv("ENVIRONMENT", "development") == "production")
    COOKIE_SAMESITE: str = Field(default_factory=lambda: "strict" if os.getenv("ENVIRONMENT", "development") == "production" else "lax")
    
    # ── CORS ────────────────────────────────────────────────────────────────────
    CORS_ALLOW_ORIGINS: List[str] = Field(default_factory=lambda: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://app.planerix.com",
        "https://www.planerix.com"
    ])
    CORS_ALLOW_CREDENTIALS: bool = True
    # 🔒 Ограничиваем CORS методы и заголовки для безопасности
    CORS_ALLOW_METHODS: List[str] = Field(default_factory=lambda: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
    CORS_ALLOW_HEADERS: List[str] = Field(default_factory=lambda: [
        "Accept", "Accept-Language", "Content-Type", "Content-Language", 
        "Authorization", "X-Requested-With", "X-CSRF-Token"
    ])

    # ── Email / Frontend ────────────────────────────────────────────────────────
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "no-reply@planerix.com"
    FRONTEND_URL: str = "https://app.planerix.com"
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── Misc ────────────────────────────────────────────────────────────────────
    SENTRY_DSN: Optional[str] = None
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10

    # ── Настройки pydantic-settings ────────────────────────────────────────────
    model_config = SettingsConfigDict(
        env_file=os.getenv("ENV_FILE", ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @model_validator(mode="before")
    @classmethod
    def _backward_compat(cls, values: dict):
        if not values.get("LIDERIX_DB_URL") and values.get("POSTGRES_URL"):
            values["LIDERIX_DB_URL"] = values["POSTGRES_URL"]
        if values.get("ACCESS_TOKEN_EXPIRE_MINUTES"):
            try:
                values["ACCESS_TTL_SEC"] = int(values["ACCESS_TOKEN_EXPIRE_MINUTES"]) * 60
            except ValueError:
                logger.warning("Invalid ACCESS_TOKEN_EXPIRE_MINUTES; ignoring.")
        return values

    @field_validator("SECRET_KEY")
    @classmethod
    def _validate_secret_key(cls, v):
        """Валидация SECRET_KEY на достаточную энтропию и длину"""
        if len(v) < 64:
            raise ValueError("SECRET_KEY должен быть минимум 64 символа для безопасности")
        
        # Проверка на разнообразие символов (базовая проверка энтропии)
        if len(set(v)) < 16:
            logger.warning("SECRET_KEY имеет низкое разнообразие символов. Рекомендуется использовать более случайный ключ.")
        
        # Предупреждение о слабых ключах
        weak_patterns = [r'12345', r'qwerty', r'password', r'secret', r'(.)\1{5,}']
        for pattern in weak_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError(f"SECRET_KEY содержит слабый паттерн. Используйте криптографически стойкий случайный ключ.")
        
        return v
    
    @field_validator("LIDERIX_DB_URL")
    @classmethod 
    def _validate_db_url(cls, v):
        """Проверка что URL БД не содержит пароль в открытом виде"""
        if v and "://" in v and ":" in v.split("://")[1].split("@")[0]:
            # Если URL содержит пароль, но мы в разработке - предупреждаем
            if os.getenv("ENVIRONMENT", "development") == "development":
                logger.warning("БД URL содержит пароль. В продакшене используйте переменные окружения.")
            elif os.getenv("ENVIRONMENT") == "production":
                raise ValueError("В продакшене БД URL не должен содержать пароль в открытом виде")
        return v

    @field_validator("CORS_ALLOW_ORIGINS", mode="before")
    @classmethod
    def _parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [s.strip() for s in v.split(",") if s.strip()]
        return v

settings = Settings()

def get_settings() -> Settings:
    return settings