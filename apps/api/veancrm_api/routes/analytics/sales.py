from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, date, timedelta
from typing import Optional

from liderix_api.db_client_itstep import get_client_async_session

router = APIRouter()

@router.get("/")
async def get_sales_analytics(
    from_date: Optional[datetime] = Query(None, alias="from"),
    to_date: Optional[datetime] = Query(None, alias="to"),
    session: AsyncSession = Depends(get_client_async_session),
):
    today = date.today()
    default_from = today - timedelta(days=6)
    default_to = today

    params = {
        "from": from_date.date() if from_date else default_from,
        "to": to_date.date() if to_date else default_to,
    }

    daily = await session.execute(text("""
        SELECT date, contract_count, total_revenue, total_first_sum
        FROM dashboards.mv_crm_sales_daily
        WHERE date BETWEEN :from AND :to
        ORDER BY date
    """), params)

    weekly = await session.execute(text("""
        SELECT week_start, total_revenue
        FROM dashboards.mv_crm_sales_by_week
        WHERE week_start BETWEEN :from AND :to
        ORDER BY week_start
    """), params)

    by_service = await session.execute(text("""
        SELECT service_id, service_name, contract_count, total_revenue, total_first_sum
        FROM dashboards.mv_crm_sales_by_service
    """))

    by_branch = await session.execute(text("""
        SELECT branch_sk, branch_name, contract_count, total_revenue, total_first_sum
        FROM dashboards.mv_crm_sales_by_branch
    """))

    by_utm = await session.execute(text("""
        SELECT utm_source, utm_medium, utm_campaign, contract_count, total_revenue, total_first_sum
        FROM dashboards.mv_crm_sales_by_utm
    """))

    return {
        "daily": [dict(row._mapping) for row in daily.fetchall()],
        "weekly": [dict(row._mapping) for row in weekly.fetchall()],
        "byService": [dict(row._mapping) for row in by_service.fetchall()],
        "byBranch": [dict(row._mapping) for row in by_branch.fetchall()],
        "byUtm": [dict(row._mapping) for row in by_utm.fetchall()],
    }