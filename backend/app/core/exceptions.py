from fastapi import Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

class AuraException(Exception):
    """Base exception class for all Aura AI applications."""
    def __init__(self, message: str, status_code: int = 400, details: dict = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ObjectNotFoundException(AuraException):
    def __init__(self, message: str = "Requested resource not found", details: dict = None):
        super().__init__(message=message, status_code=404, details=details)

class AuthenticationException(AuraException):
    def __init__(self, message: str = "Invalid credentials or session expired", details: dict = None):
        super().__init__(message=message, status_code=401, details=details)

class SpatialComputingException(AuraException):
    def __init__(self, message: str = "Failed to resolve room spatial geometry mappings", details: dict = None):
        super().__init__(message=message, status_code=422, details=details)

async def aura_exception_handler(request: Request, exc: AuraException) -> JSONResponse:
    """Capture Aura exceptions and format standardized JSON payloads."""
    logger.error(f"[Exception Intercepted] Path: {request.url.path} | Error: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.message,
                "code": exc.__class__.__name__,
                "details": exc.details
            }
        }
    )
