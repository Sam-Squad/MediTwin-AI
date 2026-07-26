import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediTwin AI"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "meditwin-super-secret-jwt-key-2026-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "meditwin_db")

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@meditwin.ai")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "adminpassword123")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
