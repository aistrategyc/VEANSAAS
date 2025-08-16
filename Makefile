restart:
	docker compose down
	docker compose up -d

build:
	docker compose build --no-cache


migrate:
	docker compose exec admin-panel alembic upgrade head

create-migration:
	docker compose exec admin-panel alembic revision --autogenerate

history:
	docker compose exec admin-panel alembic history
