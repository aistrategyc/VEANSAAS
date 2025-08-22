from datetime import date
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from ...schemas.dashboard import (
    ChannelStats,
    CreativeStats,
    DeviceStats,
    CrmStats,
    Insight,
    KpiMetrics,
    LineChartPoint,
    UtmPerformance,
)


async def get_channels(
    session: AsyncSession,
    from_date: date,
    to_date: date,
    limit: int = 100,
) -> List[ChannelStats]:
    """
    Возвращает статистику по каналам за заданный период.
    """
    sql = """
        SELECT date, source, medium, sessions, users, bounce_rate
        FROM analytics.mv_channel_traffic_daily
        WHERE date BETWEEN :from_date AND :to_date
        ORDER BY date DESC
        LIMIT :limit
    """
    result = await session.execute(
        text(sql),
        {"from_date": from_date, "to_date": to_date, "limit": limit},
    )
    return [ChannelStats(**row._mapping) for row in result.fetchall()]


async def get_creatives(
    session: AsyncSession,
    from_date: date,
    to_date: date,
    limit: int = 100,
) -> List[CreativeStats]:
    """
    Возвращает показатели по креативам за заданный период.
    """
    sql = """
        SELECT date, creative, impressions, clicks, ctr
        FROM analytics.mv_creative_performance
        WHERE date BETWEEN :from_date AND :to_date
        ORDER BY ctr DESC
        LIMIT :limit
    """
    result = await session.execute(
        text(sql),
        {"from_date": from_date, "to_date": to_date, "limit": limit},
    )
    return [CreativeStats(**row._mapping) for row in result.fetchall()]


async def get_devices(
    session: AsyncSession,
    from_date: date,
    to_date: date,
    limit: int = 100,
) -> List[DeviceStats]:
    """
    Возвращает использование устройств за заданный период.
    """
    sql = """
        SELECT date, device_type, sessions, users
        FROM analytics.mv_device_usage_daily
        WHERE date BETWEEN :from_date AND :to_date
        ORDER BY date DESC
        LIMIT :limit
    """
    result = await session.execute(
        text(sql),
        {"from_date": from_date, "to_date": to_date, "limit": limit},
    )
    return [DeviceStats(**row._mapping) for row in result.fetchall()]


async def get_crm(
    session: AsyncSession,
    from_date: date,
    to_date: date,
    limit: int = 100,
) -> List[CrmStats]:
    """
    Возвращает CRM-показатели по источникам за заданный период.
    """
    sql = """
        SELECT date, source, deals_started, deals_closed, revenue
        FROM analytics.mv_crm_by_source_daily
        WHERE date BETWEEN :from_date AND :to_date
        ORDER BY date DESC
        LIMIT :limit
    """
    result = await session.execute(
        text(sql),
        {"from_date": from_date, "to_date": to_date, "limit": limit},
    )
    return [CrmStats(**row._mapping) for row in result.fetchall()]


async def get_insights(
    session: AsyncSession,
    limit: int = 5,
) -> List[Insight]:
    """
    Возвращает последние AI-инсайты.
    """
    sql = """
        SELECT summary, insights, recommendations, agent_name, insight_date
        FROM ai.agent_insights
        ORDER BY created_at DESC
        LIMIT :limit
    """
    result = await session.execute(text(sql), {"limit": limit})
    return [Insight(**row._mapping) for row in result.fetchall()]


async def get_kpi(
    session: AsyncSession,
) -> KpiMetrics:
    """
    Возвращает сводные KPI-метрики: финансы и реклама.
    """
    rev_sql = """
        SELECT total_revenue, contracts_count, avg_contract_value
        FROM analytics.mv_daily_revenue
        ORDER BY date DESC
        LIMIT 1
    """
    ads_sql = """
        SELECT ctr, cpc, roas
        FROM analytics.mv_ads_overview_daily
        ORDER BY date DESC
        LIMIT 1
    """

    rev_res = await session.execute(text(rev_sql))
    ads_res = await session.execute(text(ads_sql))

    rev = rev_res.fetchone()
    ads = ads_res.fetchone()
    if rev is None or ads is None:
        raise ValueError("KPI data not found")

    return KpiMetrics(
        revenue=rev._mapping["total_revenue"],
        contracts_count=rev._mapping["contracts_count"],
        avg_check=rev._mapping["avg_contract_value"],
        ctr=ads._mapping["ctr"],
        cpc=ads._mapping["cpc"],
        roas=ads._mapping["roas"],
    )


async def get_linechart(
    session: AsyncSession,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
) -> List[LineChartPoint]:
    """
    Возвращает точки для линейного графика ROAS за период.
    """
    sql = """
        SELECT date, cost AS spend, revenue AS revenue_sum, roas
        FROM analytics.mv_ads_overview_daily
        WHERE (:from_date IS NULL OR date >= :from_date)
          AND (:to_date   IS NULL OR date <= :to_date)
        ORDER BY date ASC
    """
    params = {"from_date": from_date, "to_date": to_date}
    result = await session.execute(text(sql), params)
    return [LineChartPoint(**row._mapping) for row in result.fetchall()]


async def get_utm_performance(
    session: AsyncSession,
    limit: int = 100,
) -> List[UtmPerformance]:
    """
    Возвращает эффективность UTM-кампаний.
    """
    sql = """
        SELECT utm_campaign, total_conversions, total_revenue
        FROM analytics.mv_utm_performance
        ORDER BY total_conversions DESC
        LIMIT :limit
    """
    result = await session.execute(text(sql), {"limit": limit})
    return [UtmPerformance(**row._mapping) for row in result.fetchall()]