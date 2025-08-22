from pydantic import BaseModel
from datetime import date
from typing import Optional, List

# 📊 KPI Cards
class KPIMetrics(BaseModel):
    revenue: float
    profit: float
    cr: float   # Conversion Rate
    cac: float  # Customer Acquisition Cost

# 📈 График выручки
class RevenueItem(BaseModel):
    date: date
    revenue: float

# 📢 Рекламные кампании
class AdsPerformanceItem(BaseModel):
    report_date: date
    campaign_id: str
    impressions: float
    clicks: float
    conversions: float
    cost: float
    cpc: Optional[float] = None
    cpa: Optional[float] = None
    ctr: Optional[float] = None

# 🎯 Топ креативы
class TopCreativeItem(BaseModel):
    date: date
    creative_id: str
    campaign_id: str
    impressions: float
    clicks: float
    spend: float
    ctr: float
    cpc: float

# 📡 Эффективность каналов
class ChannelPerformanceItem(BaseModel):
    channel: str
    sessions: int
    conversions: int
    cost: float
    cr: Optional[float]
    cac: Optional[float]

# 📶 Использование устройств
class DeviceItem(BaseModel):
    device_category: str
    sessions: int
    users: int
    conversions: int
    conversion_rate: float

# 👤 Клиентская метрика
class CustomerMetricsItem(BaseModel):
    report_date: date
    new_customers: int
    returning_customers: int
    avg_check: float
    clv: float

# 📊 ROAS по кампаниям
class CampaignROASItem(BaseModel):
    campaign_id: str
    campaign_name: str
    spend: float
    revenue: float
    roas: float

# 🌐 Трафик по каналам
class TrafficItem(BaseModel):
    date: date
    channel: str
    total_sessions: int
    total_users: int
    new_users: int
    engaged_sessions: int
    avg_session_duration: float
    avg_bounce_rate: float
    avg_engagement_rate: float

# 🔍 AI-инсайты
class AIInsight(BaseModel):
    summary: str
    insights: List[str]
    recommendations: List[str]

# 🔮 Прогноз
class ForecastItem(BaseModel):
    metric: str
    value: float
    predicted_value: float
    delta: float

# 🧩 Воронка
class FunnelStep(BaseModel):
    step_name: str
    users: int
    conversion_rate: float

# 📈 Удержание
class RetentionCohort(BaseModel):
    cohort_week: str
    week_0: int
    week_1: Optional[int] = None
    week_2: Optional[int] = None
    week_3: Optional[int] = None
    week_4: Optional[int] = None