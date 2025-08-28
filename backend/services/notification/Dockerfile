FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir uv && \
    uv pip install --system --no-cache-dir --upgrade pip setuptools wheel

COPY requirements.txt /tmp/common-requirements.txt

RUN uv pip install --system --no-cache-dir \
    -r /tmp/common-requirements.txt

COPY . .

ENV PYTHONPATH=/app/services/notification/src

RUN chmod +x /app/services/notification/entrypoint.sh
