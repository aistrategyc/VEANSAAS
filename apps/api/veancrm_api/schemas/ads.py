from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class AdsDailyItem(BaseModel):
    date: date
    spend: float
    clicks: int
    impressions: int
    ctr: float
    cpc: float
    cpm: float


class AdsCampaignItem(BaseModel):
    campaign_id: str
    campaign_name: Optional[str]
    spend: float
    clicks: int
    conversions: int
    ctr: float
    cpc: float
    cpa: float


class AdsAdGroupItem(BaseModel):
    ad_group_id: str
    ad_group_name: str
    spend: float
    clicks: int
    conversions: int
    ctr: float
    cpc: float
    cpa: float


class AdsPlatformItem(BaseModel):
    platform: str
    spend: float
    impressions: int
    clicks: int
    conversions: int
    ctr: float
    cpc: float
    cpa: float


class AdsUtmItem(BaseModel):
    date: date
    utm_source: str
    utm_medium: str
    utm_campaign: str
    sessions: int
    conversions: int
    spend: float
    conv_rate: float
    cpa: Optional[float]
    cps: Optional[float]


class AdsAnalyticsResponse(BaseModel):
    daily: List[AdsDailyItem]
    campaigns: List[AdsCampaignItem]
    adGroups: List[AdsAdGroupItem]
    platforms: List[AdsPlatformItem]
    utm: List[AdsUtmItem]