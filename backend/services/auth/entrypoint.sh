#!/bin/sh

APP="services.auth.src.main:app"

run_migrations() {
    echo "Applying database migrations..."
    alembic upgrade head
    if [ $? -ne 0 ]; then
        echo "Failed to apply migrations!"
        exit 1
    fi
    echo "Migrations applied successfully"
}


if [ "$DEBUG" = "True" ] || [ "$DEBUG" = "true" ] || [ "$DEBUG" = "1" ]; then
    echo "Starting in DEVELOPMENT mode"
    exec uvicorn $APP --host $HOST --port $PORT --reload --use-colors
else
    echo "Starting in PRODUCTION mode"
    run_migrations
    exec uvicorn $APP --host $HOST --port $PORT \
        --workers $(nproc --all) \
        --no-access-log \
        --use-colors \
        --timeout-keep-alive 60 \
        --forwarded-allow-ips='*' \
        --proxy-headers
fi
