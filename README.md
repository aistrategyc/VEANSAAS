# VEANCRM - CRM для студий красоты

![VEANCRM Logo](https://img.shields.io/badge/VEANCRM-v1.0.0-purple?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiI+PHBhdGggZD0iTTMgMTNoOFYzSDl2Nkg3VjNoLTJ2Nkg0djR6bTEwLTZoOHYxMGgtOFY3eiIvPjwvc3ZnPg==)

Современная CRM-система для управления студиями красоты: тату-салонами, пирсинг-студиями, барбершопами и beauty-студиями.

## 🚀 Быстрый старт

### Требования

- **Docker & Docker Compose** (рекомендуется)
- **Node.js 18+** (для локальной разработки)
- **Python 3.11+** (для локальной разработки API)
- **PostgreSQL 14+** (если запускаете без Docker)
- **Redis 7+** (если запускаете без Docker)

### 📦 Запуск с Docker (Рекомендуется)

1. **Клонируйте репозиторий:**
```bash
git clone <your-repository>
cd VEANSAASv1
```

2. **Запустите все сервисы:**
```bash
docker-compose up -d --build
```

3. **Доступ к приложению:**
- **Frontend (VEANCRM)**: http://localhost:3001
- **API Documentation**: http://localhost:8002/docs
- **PostgreSQL**: `localhost:5433`
- **Redis**: `localhost:6380`

### 🛠 Локальная разработка

#### Настройка базы данных

```bash
# Запустите только PostgreSQL и Redis
docker-compose up -d postgres redis

# Или установите их локально:
# PostgreSQL на порт 5433
# Redis на порт 6380
```

#### Запуск Backend (FastAPI)

```bash
cd apps/api

# Создайте виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

# Установите зависимости
pip install -r requirements.txt

# Скопируйте файл окружения
cp .env.development .env

# Запустите миграции
alembic upgrade head

# Запустите сервер разработки
uvicorn veancrm_api.main:app --reload --host 127.0.0.1 --port 8002
```

#### Запуск Frontend (Next.js)

```bash
cd apps/web-crm

# Установите зависимости
npm install
# или
pnpm install

# Скопируйте файл окружения
cp .env.example .env.local

# Обновите .env.local с правильными URL:
echo "NEXT_PUBLIC_API_URL=http://localhost:8002/api" >> .env.local

# Запустите сервер разработки
npm run dev
# или
pnpm dev
```

Откройте http://localhost:3000

## 🏗 Архитектура

```
VEANSAASv1/
├── apps/
│   ├── api/                 # FastAPI Backend
│   │   ├── veancrm_api/     # Основное приложение
│   │   ├── alembic/         # Миграции базы данных
│   │   └── requirements.txt # Python зависимости
│   └── web-crm/            # Next.js Frontend
│       ├── src/            # Исходный код
│       ├── public/         # Статические файлы
│       └── package.json    # Node.js зависимости
├── docker-compose.yml      # Конфигурация Docker
└── README.md              # Этот файл
```

## 🔧 Конфигурация портов

| Сервис    | Локальный порт | Docker порт | Описание |
|-----------|---------------|-------------|----------|
| Frontend  | 3000          | 3001        | VEANCRM Web App |
| API       | 8002          | 8002        | FastAPI Backend |
| PostgreSQL| 5433          | 5433        | База данных |
| Redis     | 6380          | 6380        | Кэш и сессии |

## 🌟 Основные функции

### 👥 Управление клиентами
- База данных клиентов с полной историей
- VIP-статусы и система лояльности
- Фото портфолио работ
- SMS уведомления

### 📅 Запись и расписание
- Онлайн-запись через виджет
- Управление расписанием мастеров
- Календарная сетка с цветовым кодированием
- Статусы записей (ожидает, подтвержден, выполнен)

### 👨‍💼 Управление сотрудниками
- Роли: владелец, менеджер, администратор, мастер
- Система комиссий и зарплат
- Отчеты по эффективности
- График работы и смены

### 💰 Финансовая аналитика
- Отчеты по доходам и расходам
- Анализ эффективности услуг
- Комиссии мастеров
- Экспорт в Excel/PDF

### 🎨 Каталог услуг
- Категории услуг по типам студий
- Ценообразование и длительность
- Привязка к мастерам
- Статистика популярности

## 🚀 Деплой в продакшн

### Docker Compose (Рекомендуется)

```bash
# Создайте .env файлы для продакшна
cp .env.postgres .env.postgres.prod
cp apps/api/.env.docker apps/api/.env.prod
cp apps/web-crm/.env.local apps/web-crm/.env.prod

# Обновите настройки для продакшна
# Измените пароли, секретные ключи, URL

# Запустите в продакшн режиме
docker-compose -f docker-compose.prod.yml up -d --build
```

### Переменные окружения

#### Backend (.env.docker)
- `VEANCRM_DB_URL` - URL подключения к PostgreSQL
- `ACCESS_TOKEN_SECRET` - Секрет для JWT токенов
- `CORS_ALLOW_ORIGINS` - Разрешенные домены для CORS

#### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - URL API сервера
- `NODE_ENV` - Режим работы (development/production)

## 🔐 Безопасность

- JWT аутентификация
- Хеширование паролей с bcrypt
- CORS настройки
- Rate limiting
- SQL injection защита через SQLAlchemy ORM

## 📊 API Documentation

После запуска API, документация доступна по адресам:
- **Swagger UI**: http://localhost:8002/docs
- **ReDoc**: http://localhost:8002/redoc
- **OpenAPI JSON**: http://localhost:8002/openapi.json

## 🧪 Тестирование

```bash
# Backend тесты
cd apps/api
pytest

# Frontend тесты
cd apps/web-crm
npm test
```

## 🤝 Contributing

1. Форкните проект
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект разработан для студий красоты. Все права защищены.

## 📞 Поддержка

- **Email**: support@veancrm.ru
- **Telegram**: @veancrm_support
- **Документация**: [docs.veancrm.ru](https://docs.veancrm.ru)

---

**Made with 💜 for beauty studios**
