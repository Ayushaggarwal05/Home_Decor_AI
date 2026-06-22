import time
import uuid
import logging
from contextvars import ContextVar
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

# ContextVar to store the current request's correlation ID across async chains
correlation_id_ctx = ContextVar("correlation_id", default="-")

logger = logging.getLogger("aura.request_logger")

class RequestTracingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that generates/extracts a Correlation ID for each request,
    traces execution timing, and provides structured logging outputs.
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        # 1. Resolve Correlation ID
        corr_id = request.headers.get("X-Correlation-ID")
        if not corr_id:
            corr_id = str(uuid.uuid4())
            
        token = correlation_id_ctx.set(corr_id)
        
        # 2. Timing the request
        start_time = time.perf_counter()
        
        try:
            response = await call_next(request)
            process_time = time.perf_counter() - start_time
            
            # Log successful requests
            logger.info(
                f"Method: {request.method} | Path: {request.url.path} | "
                f"Status: {response.status_code} | Latency: {process_time:.4f}s | "
                f"CID: {corr_id}"
            )
            
            # Inject Correlation ID into response headers
            response.headers["X-Correlation-ID"] = corr_id
            return response
            
        except Exception as exc:
            process_time = time.perf_counter() - start_time
            # Log failures with trace references
            logger.error(
                f"FAIL | Method: {request.method} | Path: {request.url.path} | "
                f"Latency: {process_time:.4f}s | CID: {corr_id} | Error: {str(exc)}",
                exc_info=True
            )
            raise exc
        finally:
            correlation_id_ctx.reset(token)
