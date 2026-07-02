from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, PostgresDsn, field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "Aura AI Spatial Intelligence API"
    ENV: str = "development"
    
    # JWT security parameters
    SECRET_KEY: str = Field(default="aura_secret_orchestration_development_key_default")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_HOURS: int = 12
    
    # Database configurations
    POSTGRES_USER: str = "homedecor_user"
    POSTGRES_PASSWORD: str = "homedecor_password"
    POSTGRES_SERVER: str = "db"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "homedecor_db"
    DATABASE_URL: Optional[str] = None

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info) -> str:
        if isinstance(v, str) and v:
            return v
        
        # Assemble connection URL dynamically from components
        data = info.data
        user = data.get("POSTGRES_USER")
        password = data.get("POSTGRES_PASSWORD")
        server = data.get("POSTGRES_SERVER")
        port = data.get("POSTGRES_PORT")
        db = data.get("POSTGRES_DB")
        
        return f"postgresql://{user}:{password}@{server}:{port}/{db}"

    # Redis connection configurations
    REDIS_URL: str = "redis://redis:6379/0"
    CELERY_ALWAYS_EAGER: bool = False
    HF_TOKEN: Optional[str] = None
    DINO_API_MODEL: str = "google/owlv2-base-patch16-ensemble"

    # Storage integrations
    CLOUDINARY_CLOUD_NAME: str = "aura_spatial_cloud"
    CLOUDINARY_API_KEY: str = "123456789012345"
    CLOUDINARY_API_SECRET: str = "abcdefghijklmnopqrstuvwxyz12"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
