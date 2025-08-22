from fastapi import APIRouter, Request
from typing import List, Dict
from liderix_api.db_client_itstep import SessionItstep
from sqlalchemy import text  # ✅ ВАЖНО: для явного SQL-запроса

router = APIRouter()

@router.get("/")  # ✅ Оставляем пустой путь, чтобы был /api/insights/sales
async def get_sales_insights(request: Request):
    client_id = request.query_params.get("client_id")
    if not client_id:
        return []

    async with SessionItstep() as session:
        result = await session.execute(
            text("""
                SELECT summary, insights::jsonb, recommendations::jsonb
                FROM ai.agent_insights
                WHERE client_id = :client_id AND agent_name = 'sales_insights_agent'
                ORDER BY created_at DESC
                LIMIT 1
            """),
            {"client_id": client_id}
        )

        row = result.first()
        if not row:
            return []

        insights: Dict[str, List[str]] = row.insights
        recommendations: List[Dict[str, str]] = row.recommendations

        mapped = []
        for key, value in insights.items():
            mapped.append({
                "topic": map_key_to_topic(key),
                "summary": " ".join(value) if isinstance(value, list) else "",
                "insights": value if isinstance(value, list) else [],
                "recommendations": filter_recommendations(key, recommendations)
            })

        return mapped


def map_key_to_topic(key: str) -> str:
    mapping = {
        "crm_sales_by_week": "weekly",
        "crm_sales_daily": "daily",
        "crm_sales_by_utm": "utm",
        "crm_sales_by_channel": "channels",
        "crm_sales_by_creative": "services",
    }
    return mapping.get(key, "sales")


def filter_recommendations(key: str, recommendations: List[Dict[str, str]]) -> List[Dict[str, str]]:
    if not isinstance(recommendations, list):
        return []

    keyword = {
        "crm_sales_by_week": "недел",
        "crm_sales_daily": "день",
        "crm_sales_by_utm": "utm",
        "crm_sales_by_channel": "канал",
        "crm_sales_by_creative": "креатив",
    }.get(key, "")

    return [r for r in recommendations if keyword.lower() in r["text"].lower()]