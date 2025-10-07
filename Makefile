restart:
	docker compose down
	docker compose up -d

build:
	docker compose build --no-cache


migrate:
	docker compose exec admin-panel alembic upgrade head

migrate-customer:
	docker compose exec -w /app/services/customer backend-customer alembic upgrade head

create-migration-customer:
	docker compose exec -w /app/services/customer backend-customer alembic revision --autogenerate

create-migration:
	docker compose exec admin-panel alembic revision --autogenerate


downgrade:
	docker compose exec admin-panel alembic downgrade -1


history:
	docker compose exec admin-panel alembic history
