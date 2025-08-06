from pydantic_settings import BaseSettings


class Config(BaseSettings):
    DEBUG: bool = True
    POSTGRES_USER: str = 'postgres'
    POSTGRES_PASSWORD: str = 'postgres'
    POSTGRES_DB: str = 'database'
    POSTGRES_HOST: str = 'localhost'
    POSTGRES_PORT: int = 5432

    @property
    def DATABASE_URL(self):
        return f'postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}'

    class Config:
        env_file = '../.env'
        case_sensitive = True
        extra = 'allow'


settings = Config()
