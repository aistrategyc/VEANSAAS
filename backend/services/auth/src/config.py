from pydantic_settings import BaseSettings


class AuthConfig(BaseSettings):
    SECRET_KEY: str = ''
    ALGORITHM: str = 'HS256'

    class Config:
        env_file = '.env'
        case_sensitive = True
        extra = 'allow'


auth_settings = AuthConfig()
