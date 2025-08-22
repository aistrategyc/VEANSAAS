# apps/api/liderix_api/routes/dashboard/overview.py

from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from asyncpg import InsufficientPrivilegeError

from ...db_client_itstep import get_client_session_by_client_id
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

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
    responses={404: {"description": "Not found"}},
)

get_itstep_session = get_client_session_by_client_id(
    "abc2ac2e-d352-453f-85f9-b7d078549fa3"
)


@router.get("/channels", response_model=List[ChannelStats], summary="Трафик по каналам за период")
async def get_channels(
    from_date: date = Query(..., description="Дата начала, YYYY-MM-DD"),
    to_date: date   = Query(..., description="Дата окончания, YYYY-MM-DD"),
    limit:   int    = Query(100, ge=1, le=1000),
    session: AsyncSession = Depends(get_itstep_session),
):
    sql = """
        SELECT
          date,
          channel_name,
          utm_source   AS source,
          utm_medium   AS medium,
          COALESCE(total_sessions, 0)    AS sessions,
          COALESCE(total_new_users, 0)   AS users,
          COALESCE(avg_bounce_rate, 0.0) AS bounce_rate
        FROM analytics.mv_channel_traffic_daily
        WHERE date BETWEEN :from_date AND :to_date
        ORDER BY date DESC
        LIMIT :limit
    """
    res = await session.execute(text(sql), {
        "from_date": from_date,
        "to_date":   to_date,
        "limit":     limit,
    })
    return [ChannelStats(**r._mapping) for r in res.fetchall()]


@router.get("/creatives", response_model=List[CreativeStats], summary="Показатели по креативам за период")
async def get_creatives(
    from_date: date = Query(..., description="Дата начала, YYYY-MM-DD"),
    to_date: date   = Query(..., description="Дата окончания, YYYY-MM-DD"),
    limit:   int    = Query(100, ge=1, le=1000),
    session: AsyncSession = Depends(get_itstep_session),
):
    sql = """
        SELECT
          date,
          creative_id      AS creative,
          COALESCE(impressions, 0) AS impressions,
          COALESCE(clicks, 0)      AS clicks,
          COALESCE(ctr, 0.0)       AS ctr
        FROM analytics.mv_creative_performance
        WHERE date BETWEEN :from_date AND :to_date
        ORDER BY ctr DESC
        LIMIT :limit
    """
    res = await session.execute(text(sql), {
        "from_date": from_date,
        "to_date":   to_date,
        "limit":     limit,
    })
    return [CreativeStats(**r._mapping) for r in res.fetchall()]


@router.get("/devices", response_model=List[DeviceStats], summary="Использование устройств за период")
async def get_devices(
    from_date: date = Query(..., description="Дата начала, YYYY-MM-DD"),
    to_date: date   = Query(..., description="Дата окончания, YYYY-MM-DD"),
    limit:   int    = Query(100, ge=1, le=1000),
    session: AsyncSession = Depends(get_itstep_session),
):
    sql = """
        SELECT
          date,
          device_type,
          COALESCE(total_sessions, 0)    AS sessions,
          COALESCE(total_new_users, 0)   AS users,
          COALESCE(avg_bounce_rate, 0.0) AS bounce_rate
        FROM analytics.mv_device_usage_daily
        WHERE date BETWEEN :from_date AND :to_date
        ORDER BY date DESC
        LIMIT :limit
    """
    res = await session.execute(text(sql), {
        "from_date": from_date,
        "to_date":   to_date,
        "limit":     limit,
    })
    return [DeviceStats(**r._mapping) for r in res.fetchall()]


@router.get("/crm", response_model=List[CrmStats], summary="CRM-показатели по источникам за период")
async def get_crm(
    from_date: date = Query(..., description="Дата начала, YYYY-MM-DD"),
    to_date: date   = Query(..., description="Дата окончания, YYYY-MM-DD"),
    limit:   int    = Query(100, ge=1, le=1000),
    session: AsyncSession = Depends(get_itstep_session),
):
    sql = """
        SELECT
          date,
          source_key                       AS source,
          COALESCE(total_contracts, 0)::int AS deals_started,
          0                                 AS deals_closed,  -- нет данных
          COALESCE(total_revenue, 0)::numeric AS revenue
        FROM analytics.mv_crm_by_source_daily
        WHERE date BETWEEN :from_date AND :to_date
        ORDER BY date DESC
        LIMIT :limit
    """
    res = await session.execute(text(sql), {
        "from_date": from_date,
        "to_date":   to_date,
        "limit":     limit,
    })
    return [CrmStats(**r._mapping) for r in res.fetchall()]


@router.get("/insights", response_model=List[Insight], summary="Последние AI-инсайты")
async def get_insights(
    limit: int = Query(5, ge=1, le=50),
    session: AsyncSession = Depends(get_itstep_session),
):
    sql = """
        SELECT
          summary,
          insights,
          recommendations,
          agent_name,
          insight_date
        FROM ai.agent_insights
        ORDER BY created_at DESC
        LIMIT :limit
    """
    try:
        res = await session.execute(text(sql), {"limit": limit})
    except InsufficientPrivilegeError:
        # если нет прав на схему ai — просто вернём пустой список
        return []
    return [Insight(**r._mapping) for r in res.fetchall()]


@router.get("/kpi", response_model=KpiMetrics, summary="Сводные KPI-метрики (финансы + реклама)")
async def get_kpi(session: AsyncSession = Depends(get_itstep_session)):
    rev_sql = """
        SELECT
          COALESCE(total_revenue, 0)::numeric AS total_revenue,
          COALESCE(contracts_count, 0)::int  AS contracts_count,
          COALESCE(avg_contract_value, 0.0)::numeric AS avg_contract_value
        FROM analytics.mv_daily_revenue
        ORDER BY date DESC
        LIMIT 1
    """
    ads_sql = """
        SELECT
          COALESCE(ctr, 0.0)  AS ctr,
          COALESCE(cpc, 0.0)  AS cpc,
          COALESCE(roas,0.0)  AS roas
        FROM analytics.mv_ads_overview_daily
        ORDER BY date DESC
        LIMIT 1
    """
    rev_res = await session.execute(text(rev_sql))
    ads_res = await session.execute(text(ads_sql))

    rev = rev_res.fetchone()
    ads = ads_res.fetchone()
    if not rev or not ads:
        raise HTTPException(404, "KPI data not found")

    return KpiMetrics(
        revenue=rev._mapping["total_revenue"],
        contracts_count=rev._mapping["contracts_count"],
        avg_check=rev._mapping["avg_contract_value"],
        ctr=ads._mapping["ctr"],
        cpc=ads._mapping["cpc"],
        roas=ads._mapping["roas"],
    )


@router.get("/linechart", response_model=List[LineChartPoint], summary="ROAS по дням (линейный график)")
async def get_linechart(
    from_date: Optional[date] = Query(None, description="С фильтром от"),
    to_date:   Optional[date] = Query(None, description="С фильтром до"),
    session: AsyncSession    = Depends(get_itstep_session),
):
    sql = """
        SELECT
          date,
          cost    AS spend,
          revenue AS revenue_sum,
          roas
        FROM analytics.mv_ads_overview_daily
        WHERE (:from_date IS NULL OR date >= :from_date)
          AND   (:to_date   IS NULL OR date <= :to_date)
        ORDER BY date ASC
    """
    res = await session.execute(text(sql), {
        "from_date": from_date,
        "to_date":   to_date,
    })
    return [LineChartPoint(**r._mapping) for r in res.fetchall()]


@router.get("/utm", response_model=List[UtmPerformance], summary="UTM-связки и их эффективность")
async def get_utm_performance(
    limit: int = Query(100, ge=1, le=1000),
    session: AsyncSession = Depends(get_itstep_session),
):
    sql = """
        SELECT
          utm_campaign,
          COALESCE(total_conversions, 0)::int   AS total_conversions,
          COALESCE(total_revenue,     0.0)::numeric AS total_revenue
        FROM analytics.mv_utm_performance
        ORDER BY total_conversions DESC
        LIMIT :limit
    """
    res = await session.execute(text(sql), {"limit": limit})
    return [UtmPerformance(**r._mapping) for r in res.fetchall()]