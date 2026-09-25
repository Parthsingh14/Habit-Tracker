"""
Central application configuration.

All values are loaded from environment variables (see .env.example).
Nothing here should be hardcoded per the project requirements.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017"
    database_name: str = "personal_tracker"

    # CORS - comma separated list of allowed frontend origins
    cors_origins: str = "http://localhost:3000"

    # App
    app_name: str = "Personal Tracker API"
    api_prefix: str = "/api"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance so the .env file is only parsed once."""
    return Settings()
