from pydantic_settings import BaseSettings


class NotificationConfig(BaseSettings):
    RESEND_API_KEY: str = ''
    CLIENT_URL: str = ''

    class Config:
        env_file = '.env'
        case_sensitive = True
        extra = 'allow'


notification_settings = NotificationConfig()
