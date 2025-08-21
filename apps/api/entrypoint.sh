#!/usr/bin/env bash
set -e
echo "Running Alembic migrations..."
poetry run alembic upgrade head || alembic upgrade head || true
echo "Starting Uvicorn..."
exec uvicorn liderix_api.main:app --host 0.0.0.0 --port 8001 --log-level info