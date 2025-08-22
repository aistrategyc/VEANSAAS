from pydantic import BaseModel
from datetime import date
from typing import Optional, List


# 📆 Продажи по дням
class SalesDailyItem(BaseModel):
    date: date
    contract_count: int
    total_revenue: float
    total_first_sum: float


# 📅 Продажи по неделям
class SalesWeeklyItem(BaseModel):
    week_start: date
    total_revenue: float


# 🧾 Продажи по услугам
class SalesByServiceItem(BaseModel):
    service_id: int
    service_name: str
    contract_count: int
    total_revenue: Optional[float] = None
    total_first_sum: Optional[float] = None


# 🏢 Продажи по филиалам
class SalesByBranchItem(BaseModel):
    branch_sk: int
    branch_name: str
    contract_count: int
    total_revenue: Optional[float] = None
    total_first_sum: Optional[float] = None


# 🌐 Продажи по UTM-меткам
class SalesByUtmItem(BaseModel):
    utm_source: str
    utm_medium: str
    utm_campaign: str
    contract_count: int
    total_revenue: Optional[float] = None
    total_first_sum: Optional[float] = None


# 📦 Основной ответ
class SalesAnalyticsResponse(BaseModel):
    daily: List[SalesDailyItem]
    weekly: List[SalesWeeklyItem]
    byService: List[SalesByServiceItem]
    byBranch: List[SalesByBranchItem]
    byUtm: List[SalesByUtmItem]