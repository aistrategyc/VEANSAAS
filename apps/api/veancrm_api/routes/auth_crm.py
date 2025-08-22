"""
Auth endpoints для VEANCRM согласно ТЗ
"""
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

from ..models import CrmUser, Organization, Studio, Employee
from ..schemas.crm_schemas import UserRegister, UserLogin, UserResponse
from ..config.settings import settings
from ..db import get_async_session


router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict):
    """Создание JWT токена"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=settings.ACCESS_TTL_SEC)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля"""
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/register", response_model=dict)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Первичная регистрация (выбор роли Owner или MasterOwner)
    
    Side-effects:
    - если role=Owner → создаётся Organization (пустая) и базовая Studio по визарду
    - если role=MasterOwner → создаётся Organization(type=single_studio) и одна Studio
    """
    
    # Проверяем, что пользователь не существует
    result = await db.execute(select(CrmUser).where(CrmUser.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Создаем пользователя
    hashed_password = hash_password(user_data.password)
    user = CrmUser(
        email=user_data.email,
        password_hash=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        is_verified=True  # для упрощения
    )
    
    db.add(user)
    await db.flush()  # получаем ID пользователя
    
    organization = None
    studio = None
    
    if user_data.role == "Owner":
        # Создаем пустую организацию
        organization = Organization(
            name=f"{user_data.first_name or 'Owner'}'s Organization",
            type="multi_studio"
        )
        db.add(organization)
        await db.flush()
        
        # Опционально создаем базовую студию
        studio = Studio(
            organization_id=organization.id,
            name="Main Studio",
            tz="UTC"
        )
        db.add(studio)
        
    elif user_data.role == "MasterOwner":
        # Создаем single_studio организацию
        organization = Organization(
            name=f"{user_data.first_name or 'Master'}'s Studio",
            type="single_studio"
        )
        db.add(organization)
        await db.flush()
        
        # Создаем единственную студию
        studio = Studio(
            organization_id=organization.id,
            name=f"{user_data.first_name or 'Master'}'s Studio",
            tz="UTC"
        )
        db.add(studio)
        await db.flush()
        
        # Создаем Employee запись для владельца
        employee = Employee(
            user_id=user.id,
            studio_id=studio.id,
            role_in_studio="MasterOwner",
            salary_scheme={}
        )
        db.add(employee)
    
    await db.commit()
    
    # Создаем токен
    access_token = create_access_token({"user_id": str(user.id), "email": user.email})
    
    response_data = {
        "access_token": access_token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }
    
    if organization:
        response_data["organization"] = {
            "id": str(organization.id),
            "name": organization.name,
            "type": organization.type
        }
    
    if studio:
        response_data["studio"] = {
            "id": str(studio.id),
            "name": studio.name
        }
    
    return response_data


@router.post("/login", response_model=dict)
async def login(
    user_data: UserLogin,
    response: Response,
    db: AsyncSession = Depends(get_async_session)
):
    """Логин пользователя"""
    
    # Находим пользователя
    result = await db.execute(select(CrmUser).where(CrmUser.email == user_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Обновляем последний вход
    user.last_login_at = datetime.utcnow()
    await db.commit()
    
    # Создаем токены
    access_token = create_access_token({"user_id": str(user.id), "email": user.email})
    
    # Устанавливаем refresh cookie (упрощенная версия)
    response.set_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        value=access_token,  # в реальности должен быть отдельный refresh token
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.REFRESH_TTL_SEC
    )
    
    return {
        "access_token": access_token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }


@router.post("/refresh", response_model=dict)
async def refresh(request: Request):
    """Обновление токена"""
    
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)
    
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token not found")
    
    try:
        # В реальности нужна отдельная логика для refresh токенов
        payload = jwt.decode(
            refresh_token, 
            settings.SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id = payload.get("user_id")
        email = payload.get("email")
        
        # Создаем новый access token
        access_token = create_access_token({"user_id": user_id, "email": email})
        
        return {"access_token": access_token}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.post("/logout", status_code=204)
async def logout(response: Response):
    """Логаут пользователя"""
    
    response.delete_cookie(settings.REFRESH_COOKIE_NAME)
    return None