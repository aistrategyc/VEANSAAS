restart:
	docker compose down
	docker compose up -d

build:
	docker compose build --no-cache


migrate:
	docker compose exec backend-auth alembic upgrade head

create-migration:
	docker compose exec backend-auth alembic revision --autogenerate
