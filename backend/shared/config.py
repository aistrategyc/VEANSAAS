from pydantic_settings import BaseSettings


class Config(BaseSettings):
    DEBUG: bool = True
    SECRET_KEY: str = ''
    SECRET_KEY_SERVICE: str = ''
    ALGORITHM: str = 'HS256'
    POSTGRES_USER: str = 'postgres'
    POSTGRES_PASSWORD: str = 'postgres'
    POSTGRES_DB: str = 'database'
    POSTGRES_HOST: str = 'localhost'
    POSTGRES_PORT: int = 5432
    KONG_GATEWAY_URL: str = 'http://api-gateway:8000'
    API_BASE_PATH: str = '/api'
    API_DEFAULT_VERSION: str = 'v1'
    AUTH_SERVICE_ROUTE: str = '/auth'
    USER_SERVICE_ROUTE: str = '/users'
    COMPANY_UNITS_SERVICE_ROUTE: str = '/orgs'

    @property
    def DATABASE_URL(self):
        return f'postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}'

    @property
    def BASE_API_URL(self) -> str:
        return f'{self.KONG_GATEWAY_URL}{self.API_BASE_PATH}/{self.API_DEFAULT_VERSION}'

    @property
    def AUTH_SERVICE_URL(self) -> str:
        return f'{self.BASE_API_URL}{self.AUTH_SERVICE_ROUTE}'

    @property
    def USER_SERVICE_URL(self) -> str:
        return f'{self.BASE_API_URL}{self.USER_SERVICE_ROUTE}'

    @property
    def COMPANY_UNITS_SERVICE_URL(self) -> str:
        return f'{self.BASE_API_URL}{self.COMPANY_UNITS_SERVICE_ROUTE}'

    class Config:
        env_file = '../.env'
        case_sensitive = True
        extra = 'allow'


settings = Config()
