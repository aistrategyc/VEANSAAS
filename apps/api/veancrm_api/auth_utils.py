from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

load_dotenv()  # Загружаем .env при запуске (если ты его используешь)

# 🔐 JWT Конфигурация
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "changeme_in_prod")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 60 * 24))  # по умолчанию: 1 день

# 🔐 Контекст шифрования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ Проверка пароля
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ✅ Хеширование пароля
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# ✅ Создание JWT
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt