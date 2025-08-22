# apps/api/liderix_api/schemas/dashboard.py

from __future__ import annotations
from datetime import date
from pydantic import BaseModel

class ChannelStats(BaseModel):
    date: date
    source: str
    medium: str
    sessions: int
    users: int
    bounce_rate: float

class CreativeStats(BaseModel):
    date: date
    creative: str
    impressions: int
    clicks: int
    ctr: float

class DeviceStats(BaseModel):
    date: date
    device_type: str
    sessions: int
    users: int

class CrmStats(BaseModel):
    date: date
    source: str
    deals_started: int
    deals_closed: int
    revenue: float

class Insight(BaseModel):
    summary: str
    insights: str
    recommendations: str
    agent_name: str
    insight_date: date

class KpiMetrics(BaseModel):
    revenue: float
    contracts_count: int
    avg_check: float
    ctr: float
    cpc: float
    roas: float

class LineChartPoint(BaseModel):
    date: date
    spend: float
    revenue_sum: float
    roas: float

class UtmPerformance(BaseModel):
    utm_campaign: str
    total_conversions: int
    total_revenue: float