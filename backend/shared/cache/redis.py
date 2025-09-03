from typing import AsyncGenerator

import redis.asyncio as redis
from fastapi import HTTPException
from redis.asyncio import Redis

from shared.config import settings


async def get_redis_client() -> Redis:
    try:
        redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
            socket_timeout=25,
            socket_connect_timeout=25,
            retry_on_timeout=True,
        )
        if not await redis_client.ping():
            raise HTTPException(status_code=500, detail='Failed to connect to Redis')
        return redis_client
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f'Error connecting to Redis: {str(e)}'
        )


async def redis_connection() -> AsyncGenerator[Redis, None]:
    redis_client = await get_redis_client()
    try:
        yield redis_client
    finally:
        await redis_client.close()
