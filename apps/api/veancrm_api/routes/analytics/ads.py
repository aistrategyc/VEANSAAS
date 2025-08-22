from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timedelta, date
from liderix_api.db_client_itstep import get_client_session_by_client_id

router = APIRouter()
get_session = get_client_session_by_client_id("abc2ac2e-d352-453f-85f9-b7d078549fa3")

@router.get("")
async def get_ads_analytics(
    session: AsyncSession = Depends(get_session),
    from_: str = None,
    to: str = None
):
    try:
        today = date.today()
        yesterday = today - timedelta(days=1)

        from_date = datetime.strptime(from_, "%Y-%m-%d").date() if from_ else yesterday - timedelta(days=6)
        parsed_to = datetime.strptime(to, "%Y-%m-%d").date() if to else yesterday
        to_date = min(parsed_to, yesterday) + timedelta(days=1)

        print(f"[🔍] Date range: {from_date} → {to_date} (excluding upper bound)")

        result = {}

        # 1. 📊 Daily KPI
        daily = await session.execute(text("""
            SELECT dt AS date, spend, clicks, impressions, ctr, cpc, cpm
            FROM dashboards.ads_campaigns_kpi_daily
            WHERE dt >= :from AND dt < :to
            ORDER BY dt
        """), {"from": from_date, "to": to_date})
        result["daily"] = [dict(row._mapping) for row in daily.fetchall()]

        # 2. 🎯 Campaigns
        campaigns = await session.execute(text("""
            SELECT campaign_id, campaign_key AS campaign_name, spend, clicks, conversions, ctr, cpc, cpa
            FROM dashboards.ads_campaigns_daily
            WHERE dt >= :from AND dt < :to
        """), {"from": from_date, "to": to_date})
        result["campaigns"] = [dict(row._mapping) for row in campaigns.fetchall()]

        # 3. 🧩 Ad Groups
        adgroups = await session.execute(text("""
            SELECT ad_group_id, ad_group_name, spend, clicks, conversions, ctr, cpc, cpa
            FROM dashboards.google_ads_adgroup_daily
            WHERE dt >= :from AND dt < :to
        """), {"from": from_date, "to": to_date})
        result["adGroups"] = [dict(row._mapping) for row in adgroups.fetchall()]

        # 4. 🛰 Platforms
        platforms = await session.execute(text("""
            SELECT
                platform,
                spend,
                impressions,
                clicks,
                0 AS conversions,
                ctr,
                cpc,
                NULL AS cpa
            FROM dashboards.ads_platform_daily
            WHERE dt >= :from AND dt < :to
        """), {"from": from_date, "to": to_date})
        result["platforms"] = [dict(row._mapping) for row in platforms.fetchall()]

        # 5. 🔗 UTM Breakdown
        utm = await session.execute(text("""
            SELECT date, utm_source, utm_medium, utm_campaign, sessions, conversions, spend, conv_rate, cpa, cps
            FROM dashboards.ads_by_utm_daily
            WHERE date >= :from AND date < :to
        """), {"from": from_date, "to": to_date})
        result["utm"] = [dict(row._mapping) for row in utm.fetchall()]

        return result

    except Exception as e:
        print("[❌] Error in get_ads_analytics:", str(e))
        raise HTTPException(status_code=500, detail="Ошибка при получении аналитики")