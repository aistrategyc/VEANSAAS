# apps/api/Dockerfile
FROM python:3.10-slim

WORKDIR /app

ENV POETRY_VERSION=1.4.2
ENV POETRY_VIRTUALENVS_CREATE=false
ENV POETRY_CACHE_DIR='/var/cache/pypoetry'
ENV PYTHONUNBUFFERED=1
ENV FASTAPI_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# 1) Копируем только мета-файлы проекта
COPY pyproject.toml poetry.lock /app/

# 2) Устанавливаем Poetry и зависимости (без dev, без установки самого пакета)
RUN pip install --no-cache-dir "poetry==$POETRY_VERSION" \
 && poetry install --no-interaction --no-ansi --without dev --no-root

# 3) Копируем весь исходный код
COPY . /app

# 4) Открываем порт
EXPOSE 8001

# 5) Стартуем приложение напрямую с uvicorn
CMD ["uvicorn", "veancrm_api.main:app", "--host", "0.0.0.0", "--port", "8001", "--log-level", "info"]