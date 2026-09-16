from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "SREC Smart Campus"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Santhiram Engineering College (SREC) Autonomous, Nandyal - Smart Campus API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    # Database: SQLite for zero-config local dev, PostgreSQL+pgvector for Docker/production
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./srec_campus.db")

    # Security & JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "srec_super_secret_jwt_key_smart_campus_2026_engineering_nandyal")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # AI Configuration
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-1.5-flash")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "models/embedding-001")

    # Document upload directory
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./data/documents")
    MAX_UPLOAD_SIZE_MB: int = 25
    CHUNK_SIZE: int = 600
    CHUNK_OVERLAP: int = 100

    # Email Settings
    EMAIL_HOST: str = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    EMAIL_PORT: int = int(os.getenv("EMAIL_PORT", "587"))
    EMAIL_USERNAME: str = os.getenv("EMAIL_USERNAME", "")
    EMAIL_PASSWORD: str = os.getenv("EMAIL_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "admissions@srecnandyal.edu.in")
    EMAIL_FROM_NAME: str = os.getenv("EMAIL_FROM_NAME", "SREC Smart Campus")

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
