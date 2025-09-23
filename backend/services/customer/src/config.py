from pydantic_settings import BaseSettings


class CustomerConfig(BaseSettings):
    POSTGRES_USER: str = 'postgres'
    POSTGRES_PASSWORD: str = 'postgres'
    POSTGRES_DB: str = 'database_customer'
    POSTGRES_HOST: str = 'localhost'
    POSTGRES_PORT: int = 5432

    class Config:
        env_file = '.env'
        case_sensitive = True
        extra = 'allow'

    @property
    def DATABASE_URL(self):
        return f'postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}'


customer_settings = CustomerConfig()
