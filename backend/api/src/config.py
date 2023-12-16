from typing import List
from pydantic_settings import BaseSettings
from redis import asyncio as aioredis

from src.const import NAME_ENV_FILE


# environment
class Settings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    HOST: str
    PORT: str
    
    REDIS_HOST:str
    REDIS_PORT:str
    
    CORS_URL: List[str]

    class Config:
        env_file = NAME_ENV_FILE


settings = Settings()
# connections
REDIS_URL = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
RedisConnection = aioredis.from_url(REDIS_URL, encoding="utf8")