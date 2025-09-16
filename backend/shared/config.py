from pydantic_settings import BaseSettings


class Config(BaseSettings):
    DEBUG: bool = True
    SECRET_KEY: str = ''
    SECRET_KEY_SERVICE: str = ''
    VERIFICATION_SECRET_KEY: str = ''
    ALGORITHM: str = 'HS256'
    RABBITMQ_URL: str = 'amqp://admin:admin@rabbitmq:5672/'
    POSTGRES_USER: str = 'postgres'
    POSTGRES_PASSWORD: str = 'postgres'
    POSTGRES_DB: str = 'database'
    POSTGRES_HOST: str = 'localhost'
    POSTGRES_PORT: int = 5432
    REDIS_HOST: str = 'localhost'
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str = ''
    KONG_GATEWAY_URL: str = 'http://api-gateway:8000'
    API_BASE_PATH: str = '/api'
    API_DEFAULT_VERSION: str = 'v1'
    AUTH_SERVICE_ROUTE: str = '/auth'
    USER_SERVICE_ROUTE: str = '/users'
    COMPANY_UNITS_SERVICE_ORGANIZATION_ROUTE: str = '/orgs'
    COMPANY_UNITS_SERVICE_STUDIO_ROUTE: str = '/studios'
    COMPANY_UNITS_SERVICE_INVITE_ROUTE: str = '/invites'
    CLIENT_URL: str = ''

    @property
    def REDIS_URL(self):
        if self.REDIS_PASSWORD:
            return f'redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}'
        return f'redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}'

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
    def COMPANY_UNITS_SERVICE_ORGANIZATION_URL(self) -> str:
        return f'{self.BASE_API_URL}{self.COMPANY_UNITS_SERVICE_ORGANIZATION_ROUTE}'

    @property
    def COMPANY_UNITS_SERVICE_STUDIO_URL(self) -> str:
        return f'{self.BASE_API_URL}{self.COMPANY_UNITS_SERVICE_STUDIO_ROUTE}'

    @property
    def COMPANY_UNITS_SERVICE_INVITE_URL(self) -> str:
        return f'{self.BASE_API_URL}{self.COMPANY_UNITS_SERVICE_INVITE_ROUTE}'

    class Config:
        env_file = '../.env'
        case_sensitive = True
        extra = 'allow'


settings = Config()
