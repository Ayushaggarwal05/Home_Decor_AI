import time
from fastapi import Request, HTTPException, status
import redis
from app.core.config import settings

# Establish central Redis connection pool
try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
except Exception:
    redis_client = None

class RateLimiter:
    """Redis-backed sliding-window rate limiter dependency."""
    
    def __init__(self, requests_limit: int = 30, window_seconds: int = 60):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds

    def __call__(self, request: Request) -> None:
        if settings.ENV == "testing" or redis_client is None:
            # Gracefully bypass rate limiter during testing or when Redis is not available
            return

        # Fetch request identifiers
        client_ip = request.client.host if request.client else "unknown_ip"
        route_path = request.url.path
        key = f"rate_limit:{client_ip}:{route_path}"

        current_time = time.time()
        
        try:
            pipe = redis_client.pipeline()

            # Remove items older than window limit
            pipe.zremrangebyscore(key, 0, current_time - self.window_seconds)
            # Count elements inside current window
            pipe.zcard(key)
            # Add current request timestamp
            pipe.zadd(key, {str(current_time): current_time})
            # Set dynamic expiration to ensure cleanup
            pipe.expire(key, self.window_seconds)

            # Run execution pipeline
            _, current_count, _, _ = pipe.execute()

            if current_count >= self.requests_limit:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Too many requests. Allowed {self.requests_limit} requests per {self.window_seconds} seconds."
                )
        except redis.RedisError:
            # Fallback gracefully if Redis goes offline in production
            return
