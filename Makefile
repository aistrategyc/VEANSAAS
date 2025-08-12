restart:
	docker compose down
	docker compose up -d

build:
	docker compose build --no-cache


migrate:
	docker compose exec backend-org alembic upgrade head

create-migration:
	docker compose exec backend-org alembic revision --autogenerate

history:
	docker compose exec backend-org alembic history
