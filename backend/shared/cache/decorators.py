import hashlib
import json
from functools import wraps
from typing import Any, Awaitable, Callable, List

from fastapi.encoders import jsonable_encoder

from shared.cache.redis import get_redis_client
from shared.logger import logger


def redis_cache(
    expire: int = 60,
    key_builder=lambda *args, **kwargs: None,
    use_kwargs: List[str] = [],
):
    def decorator(func: Callable[..., Awaitable[Any]]):
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            redis_client = await get_redis_client()
            try:
                cache_key = key_builder(*args, **kwargs)
                if not cache_key:
                    key_parts = []
                    for key in use_kwargs:
                        value = kwargs.get(key)
                        key_parts.append(f'{key}:{value}')
                    sorted_parts = sorted(key_parts)
                    raw_key = f'{func.__name__}:{":".join(sorted_parts)}'
                    cache_key = hashlib.sha256(raw_key.encode()).hexdigest()

                cached = await redis_client.get(cache_key)
                if cached is not None:
                    logger.info(f'[CACHE HIT] key={cache_key}')

                    return json.loads(cached)
                logger.warning(f'[CACHE MISS] key={cache_key}')

                result = await func(*args, **kwargs)

                await redis_client.setex(
                    cache_key, expire, json.dumps(jsonable_encoder(result))
                )
                return result
            finally:
                await redis_client.close()

        return wrapper

    return decorator
