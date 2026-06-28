from datetime import datetime, timedelta, timezone
from typing import Any, Union
import jwt
import bcrypt
from app.core.config import settings

ALGORITHM = "HS256"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if plain password matches hashed signature."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), 
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Create hashed password representation."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """Generate signed JWT access token for authentication."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire, 
        "sub": str(subject),
        "iss": "aura-ai-backend"
    }
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Validate and decode JWT token payload."""
    try:
        decoded_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_payload
    except jwt.PyJWTError:
        return {}

def create_refresh_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """Generate signed JWT refresh token for session renewals."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=settings.REFRESH_TOKEN_EXPIRE_HOURS)
    
    to_encode = {
        "exp": expire, 
        "sub": str(subject),
        "type": "refresh",
        "iss": "aura-ai-backend"
    }
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_refresh_token(token: str) -> dict:
    """Validate and decode JWT refresh token payload."""
    try:
        decoded_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        if decoded_payload.get("type") != "refresh":
            return {}
        return decoded_payload
    except jwt.PyJWTError:
        return {}
