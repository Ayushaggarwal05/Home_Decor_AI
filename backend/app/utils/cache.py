import json
import functools
import logging
import inspect
from typing import Callable, Any
from fastapi import Request
import redis
from app.core.config import settings

logger = logging.getLogger(__name__)

try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
except Exception as e:
    redis_client = None
    logger.warning(f"Could not connect to Redis for caching: {e}")

def cache_response(expire_seconds: int = 300):
    """
    FastAPI response caching decorator using Redis.
    Works for both async and sync endpoint route handlers.
    """
    def decorator(func: Callable[..., Any]):
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            if settings.ENV == "testing" or redis_client is None:
                return await func(*args, **kwargs)

            request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if not request:
                for val in kwargs.values():
                    if isinstance(val, Request):
                        request = val
                        break

            if not request:
                cache_key = f"cache:{func.__name__}:{str(args)}:{str(kwargs)}"
            else:
                cache_key = f"cache:api:{request.url.path}:{request.url.query}"

            try:
                cached_data = redis_client.get(cache_key)
                if cached_data:
                    logger.info(f"Cache hit for key: {cache_key}")
                    return json.loads(cached_data)
            except redis.RedisError as e:
                logger.error(f"Redis cache fetch error: {e}")

            response_data = await func(*args, **kwargs)

            try:
                redis_client.setex(cache_key, expire_seconds, json.dumps(response_data))
                logger.info(f"Cache write for key: {cache_key}")
            except redis.RedisError as e:
                logger.error(f"Redis cache write error: {e}")

            return response_data

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            if settings.ENV == "testing" or redis_client is None:
                return func(*args, **kwargs)

            request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if not request:
                for val in kwargs.values():
                    if isinstance(val, Request):
                        request = val
                        break

            if not request:
                cache_key = f"cache:{func.__name__}:{str(args)}:{str(kwargs)}"
            else:
                cache_key = f"cache:api:{request.url.path}:{request.url.query}"

            try:
                cached_data = redis_client.get(cache_key)
                if cached_data:
                    logger.info(f"Cache hit for key: {cache_key}")
                    return json.loads(cached_data)
            except redis.RedisError as e:
                logger.error(f"Redis cache fetch error: {e}")

            response_data = func(*args, **kwargs)

            try:
                redis_client.setex(cache_key, expire_seconds, json.dumps(response_data))
                logger.info(f"Cache write for key: {cache_key}")
            except redis.RedisError as e:
                logger.error(f"Redis cache write error: {e}")

            return response_data

        if inspect.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator
