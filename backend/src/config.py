from typing import List
from pydantic_settings import BaseSettings

from src.const import NAME_ENV_FILE


# environment
class Settings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    HOST: str
    PORT: str
    CORS_URL: List[str]

    class Config:
        env_file = NAME_ENV_FILE


settings = Settings()
