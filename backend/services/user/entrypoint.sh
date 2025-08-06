#!/bin/sh

APP="services.user.src.main:app"

echo "Starting in DEVELOPMENT mode"

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
