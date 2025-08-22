# ✅ Service — fetch_ads_analytics
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from liderix_api.schemas.ads import *
from datetime import date, timedelta
from typing import Optional

async def fetch_ads_analytics(
    db: AsyncSession,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None
) -> AdsAnalyticsResponse:
    try:
        today = date.today()
        yesterday = today - timedelta(days=1)

        from_dt = from_date or (yesterday - timedelta(days=6))
        to_dt = (to_date or yesterday) + timedelta(days=1)

        params = {
            "from": from_dt,
            "to": to_dt,
        }

        # 1. KPI по дням
        daily_query = await db.execute(text("""
            SELECT dt AS date, spend, clicks, impressions, ctr, cpc, cpm
            FROM dashboards.ads_campaigns_kpi_daily
            WHERE dt >= :from AND dt < :to
            ORDER BY dt
        """), params)
        daily = [AdsDailyItem(**row._mapping) for row in daily_query.fetchall()]

        # 2. Кампании
        campaigns_query = await db.execute(text("""
            SELECT campaign_id, campaign_key as campaign_name, spend, clicks, conversions, ctr, cpc, cpa
            FROM dashboards.ads_campaigns_daily
            WHERE dt >= :from AND dt < :to
        """), params)
        campaigns = [AdsCampaignItem(**row._mapping) for row in campaigns_query.fetchall()]

        # 3. AdGroups
        adgroups_query = await db.execute(text("""
            SELECT ad_group_id, ad_group_name, spend, clicks, conversions, ctr, cpc, cpa
            FROM dashboards.google_ads_adgroup_daily
            WHERE dt >= :from AND dt < :to
        """), params)
        adGroups = [AdsAdGroupItem(**row._mapping) for row in adgroups_query.fetchall()]

        # 4. Platforms
        platforms_query = await db.execute(text("""
            SELECT platform, spend, impressions, clicks, COALESCE(conversions, 0) as conversions, ctr, cpc, COALESCE(cpa, 0) as cpa
            FROM dashboards.ads_platform_daily
            WHERE dt >= :from AND dt < :to
        """), params)
        platforms = [AdsPlatformItem(**row._mapping) for row in platforms_query.fetchall()]

        # 5. UTM
        utm_query = await db.execute(text("""
            SELECT date, utm_source, utm_medium, utm_campaign, sessions, conversions, spend, conv_rate, cpa, cps
            FROM dashboards.ads_by_utm_daily
            WHERE date >= :from AND date < :to
        """), params)
        utm = [AdsUtmItem(**row._mapping) for row in utm_query.fetchall()]

        return AdsAnalyticsResponse(
            daily=daily,
            campaigns=campaigns,
            adGroups=adGroups,
            platforms=platforms,
            utm=utm
        )

    except Exception as e:
        print("[❌ ADS Service Error]:", e)
        return AdsAnalyticsResponse(
            daily=[], campaigns=[], adGroups=[], platforms=[], utm=[]
        )