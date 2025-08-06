FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir uv && \
    uv pip install --system --no-cache-dir --upgrade pip setuptools wheel

COPY requirements.txt /tmp/common-requirements.txt
COPY services/auth/requirements.txt /tmp/local-requirements.txt

RUN uv pip install --system --no-cache-dir \
    -r /tmp/common-requirements.txt \
    -r /tmp/local-requirements.txt

COPY . .

ENV PYTHONPATH=/app/services/auth/src

RUN chmod +x /app/services/auth/entrypoint.sh
