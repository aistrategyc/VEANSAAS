from __future__ import annotations

"""
This package aggregates route modules but does NOT register routers itself.
Routers are included explicitly in `main.py` with a common API prefix to avoid
accidental double-prefixing like `/api/api/...` and duplicate endpoints.

Keep this file side‑effect free: no APIRouter instances, no include_router calls,
no health/ping here. Import concrete modules directly from `liderix_api.routes`.
Example in main.py:

    from liderix_api.routes import users as users_router
    app.include_router(users_router.router, prefix=PREFIX, tags=["Users"])

"""

# Re-export subpackages/modules for convenience (optional)
__all__ = [
    "auth",
    "users",
    "projects",
    "tasks",
    "org_structure",
    "clients",
    "kpis",
    "okrs",
    "analytics",
]