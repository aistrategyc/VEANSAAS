from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from liderix_api.schemas.sales import SalesAnalyticsResponse, SalesDailyItem, SalesWeeklyItem, SalesByServiceItem, SalesByBranchItem, SalesByUtmItem
from datetime import date
from typing import Optional


async def fetch_sales_analytics(
    db: AsyncSession,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None
) -> SalesAnalyticsResponse:
    try:
        params = {
            "from": from_date.isoformat() if from_date else "2020-01-01",
            "to": to_date.isoformat() if to_date else "2100-01-01",
        }

        # 📆 По дням
        daily_query = await db.execute(text("""
            SELECT date, contract_count, total_revenue, total_first_sum
            FROM dashboards.mv_crm_sales_daily
            WHERE date BETWEEN :from AND :to
            ORDER BY date
        """), params)
        daily = [SalesDailyItem(**row._mapping) for row in daily_query.fetchall()]

        # 📅 По неделям
        weekly_query = await db.execute(text("""
            SELECT week_start, total_revenue
            FROM dashboards.mv_crm_sales_by_week
            WHERE week_start BETWEEN :from AND :to
            ORDER BY week_start
        """), params)
        weekly = [SalesWeeklyItem(**row._mapping) for row in weekly_query.fetchall()]

        # 🧾 По услугам
        by_service_query = await db.execute(text("""
            SELECT service_id, service_name, contract_count, total_revenue, total_first_sum
            FROM dashboards.mv_crm_sales_by_service
        """))
        by_service = [SalesByServiceItem(**row._mapping) for row in by_service_query.fetchall()]

        # 🏢 По филиалам
        by_branch_query = await db.execute(text("""
            SELECT branch_sk, branch_name, contract_count, total_revenue, total_first_sum
            FROM dashboards.mv_crm_sales_by_branch
        """))
        by_branch = [SalesByBranchItem(**row._mapping) for row in by_branch_query.fetchall()]

        # 🌐 По UTM
        by_utm_query = await db.execute(text("""
            SELECT utm_source, utm_medium, utm_campaign, contract_count, total_revenue, total_first_sum
            FROM dashboards.mv_crm_sales_by_utm
        """))
        by_utm = [SalesByUtmItem(**row._mapping) for row in by_utm_query.fetchall()]

        return SalesAnalyticsResponse(
            daily=daily,
            weekly=weekly,
            byService=by_service,
            byBranch=by_branch,
            byUtm=by_utm
        )

    except Exception as e:
        print(f"[ERROR] Failed to fetch sales analytics: {e}")
        # Вернуть пустую структуру на случай сбоя
        return SalesAnalyticsResponse(
            daily=[], weekly=[], byService=[], byBranch=[], byUtm=[]
        )