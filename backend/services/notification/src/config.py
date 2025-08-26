from pydantic_settings import BaseSettings


class NotificationConfig(BaseSettings):
    RESEND_API_KEY: str = ''

    class Config:
        env_file = '.env'
        case_sensitive = True
        extra = 'allow'


auth_settings = NotificationConfig()
