import logging
import sys

class CorrelationIdFilter(logging.Filter):
    """Logging filter that injects the active request's correlation ID into the log record."""
    def filter(self, record):
        from app.core.middleware import correlation_id_ctx
        record.correlation_id = correlation_id_ctx.get()
        return True

def setup_logging() -> None:
    """Configure system logging formats and default streaming outputs."""
    handler = logging.StreamHandler(sys.stdout)
    handler.addFilter(CorrelationIdFilter())
    
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] [%(correlation_id)s] %(name)s: %(message)s",
        handlers=[handler]
    )
    
    # Optional: silence noisy dependencies
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
