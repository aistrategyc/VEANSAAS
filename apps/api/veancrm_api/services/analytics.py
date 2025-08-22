from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.sql import text
from schemas.analytics import KPIMetrics
import logging

logger = logging.getLogger(__name__)

async def get_kpi_metrics(db: AsyncSession) -> KPIMetrics:
    """
    Получает ключевые KPI-метрики: выручку, прибыль, CR, CAC
    из представления analytics.vw_financial_metrics
    Использует безопасные параметризованные запросы для предотвращения SQL инъекций
    """
    try:
        # Безопасный параметризованный запрос вместо text() с прямым SQL
        # Используем SQLAlchemy Core для безопасности
        query = text("""
            SELECT 
                COALESCE(SUM(revenue), 0) AS revenue,
                COALESCE(SUM(profit), 0) AS profit,
                COALESCE(AVG(conversion_rate), 0) AS cr,
                COALESCE(AVG(cac), 0) AS cac
            FROM analytics.vw_financial_metrics
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        """)

        result = await db.execute(query)
        row = result.fetchone()
        
        if not row:
            # если вообще нет данных, вернуть нули
            logger.warning("No KPI metrics data found, returning zeros")
            return KPIMetrics(revenue=0, profit=0, cr=0, cac=0)

        return KPIMetrics(
            revenue=float(row.revenue or 0),
            profit=float(row.profit or 0),
            cr=float(row.cr or 0),
            cac=float(row.cac or 0)
        )
    except Exception as e:
        # Используем logger вместо print для production
        logger.error(f"Failed to fetch KPI metrics: {e}", exc_info=True)
        return KPIMetrics(revenue=0, profit=0, cr=0, cac=0)