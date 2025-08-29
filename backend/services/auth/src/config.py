from pydantic_settings import BaseSettings


class AuthConfig(BaseSettings):
    SECRET_KEY: str = ''
    VERIFICATION_SECRET_KEY: str = ''
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_HOURS: int = 8

    class Config:
        env_file = '.env'
        case_sensitive = True
        extra = 'allow'


auth_settings = AuthConfig()
