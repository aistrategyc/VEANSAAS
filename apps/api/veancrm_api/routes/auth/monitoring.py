# apps/api/liderix_api/routes/auth/monitoring.py
from __future__ import annotations
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc, cast, Integer
from redis.asyncio import Redis
from liderix_api.db import get_async_session
from liderix_api.models.audit import EventLog
from liderix_api.models.users import User
from liderix_api.config.settings import settings  # Убедились, что именно core.config
# Зависимость админа: должна валидировать, что запрос от админа/супера
from liderix_api.services.auth import require_admin  # Изменили на services (по структуре проекта)

router = APIRouter(prefix="/auth/monitoring", tags=["Auth Monitoring"])

# Один клиент Redis на модуль
redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)

# -----------------------
# Helpers
# -----------------------
def now_utc() -> datetime:
    return datetime.now(timezone.utc)

async def _count_redis_keys(pattern: str, scan_count: int = 1000) -> int:
    c = 0
    async for _ in redis.scan_iter(match=pattern, count=scan_count):
        c += 1
    return c

# -----------------------
# /health/detailed
# -----------------------
@router.get("/health/detailed")
async def detailed_health_check(
    hours: int = Query(1, ge=1, le=24, description="Период для ошибки/запросов"),
    session: AsyncSession = Depends(get_async_session),
    _: None = Depends(require_admin),
):
    """
    Детальный health: проверка БД/Redis, базовые метрики по ошибкам и сессиям.
    """
    # DB latency
    db_t0 = datetime.now()
    await session.execute(select(1))
    db_latency = (datetime.now() - db_t0).total_seconds() * 1000

    # Redis latency
    red_t0 = datetime.now()
    await redis.ping()
    redis_latency = (datetime.now() - red_t0).total_seconds() * 1000

    # Ошибки за период
    since = now_utc() - timedelta(hours=hours)
    recent_errors = await session.scalar(
        select(func.count(EventLog.id)).where(
            and_(EventLog.success.is_(False), EventLog.created_at >= since)
        )
    )
    recent_total = await session.scalar(
        select(func.count(EventLog.id)).where(EventLog.created_at >= since)
    )
    recent_errors = recent_errors or 0
    recent_total = recent_total or 0
    error_rate = (recent_errors / recent_total * 100.0) if recent_total > 0 else 0.0

    # Активные refresh-сессии (по whitelist)
    active_sessions = await _count_redis_keys("refresh_whitelist:*:*")

    return {
        "status": "healthy",
        "timestamp": now_utc().isoformat(),
        "database": {"status": "connected", "latency_ms": round(db_latency, 2)},
        "redis": {"status": "connected", "latency_ms": round(redis_latency, 2)},
        "metrics": {
            "period_hours": hours,
            "active_sessions": active_sessions,
            "recent_requests": recent_total,
            "recent_errors": recent_errors,
            "error_rate_1h_pct": round(error_rate, 2) if hours == 1 else round(error_rate, 2),
        },
    }

# -----------------------
# /metrics/authentication
# -----------------------
@router.get("/metrics/authentication")
async def get_auth_metrics(
    hours: int = Query(24, ge=1, le=168, description="Период анализа (часов)"),
    session: AsyncSession = Depends(get_async_session),
    _: None = Depends(require_admin),
):
    """
    Агрегированные метрики по событиям аутентификации за период.
    """
    since = now_utc() - timedelta(hours=hours)

    # По типам событий
    rows = await session.execute(
        select(
            EventLog.event_type,
            func.count(EventLog.id).label("total"),
            func.sum(cast(EventLog.success, Integer)).label("successful"),
        )
        .where(EventLog.created_at >= since)
        .group_by(EventLog.event_type)
    )
    summary: Dict[str, Any] = {}
    for r in rows:
        total = int(r.total or 0)
        successful = int(r.successful or 0)
        summary[r.event_type] = {
            "total_attempts": total,
            "successful": successful,
            "failed": total - successful,
            "success_rate": round((successful / total * 100.0), 2) if total > 0 else 0.0,
        }

    # Почасовая динамика
    hourly_rows = await session.execute(
        select(
            func.date_trunc("hour", EventLog.created_at).label("hour"),
            func.count(EventLog.id).label("total"),
            func.sum(cast(EventLog.success, Integer)).label("successful"),
        )
        .where(EventLog.created_at >= since)
        .group_by(func.date_trunc("hour", EventLog.created_at))
        .order_by(func.date_trunc("hour", EventLog.created_at))
    )
    hourly_breakdown: List[Dict[str, Any]] = []
    for r in hourly_rows:
        total = int(r.total or 0)
        successful = int(r.successful or 0)
        hourly_breakdown.append(
            {
                "hour": r.hour.isoformat(),
                "total_requests": total,
                "successful": successful,
                "failed": total - successful,
                "success_rate": round((successful / total * 100.0), 2) if total > 0 else 0.0,
            }
        )

    return {
        "period_hours": hours,
        "summary": summary,
        "hourly_breakdown": hourly_breakdown,
        "generated_at": now_utc().isoformat(),
    }

# -----------------------
# /analytics/user-registrations
# -----------------------
@router.get("/analytics/user-registrations")
async def get_registration_analytics(
    days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_async_session),
    _: None = Depends(require_admin),
):
    """
    Тренды по регистрациям и верификациям.
    """
    since = now_utc() - timedelta(days=days)

    # Ежедневная агрегация
    rows = await session.execute(
        select(
            func.date(User.created_at).label("date"),
            func.count(User.id).label("registrations"),
            func.sum(cast(User.is_verified, Integer)).label("verified"),
        )
        .where(User.created_at >= since)
        .group_by(func.date(User.created_at))
        .order_by(func.date(User.created_at))
    )
    daily_data: List[Dict[str, Any]] = []
    total_reg = 0
    total_ver = 0
    for r in rows:
        reg = int(r.registrations or 0)
        ver = int(r.verified or 0)
        total_reg += reg
        total_ver += ver
        daily_data.append(
            {
                "date": r.date.isoformat(),
                "registrations": reg,
                "verified": ver,
                "verification_rate": round((ver / reg * 100.0), 2) if reg > 0 else 0.0,
            }
        )

    # Кол-во «успешных регистраций» по ивенту
    successful_reg_events = await session.scalar(
        select(func.count(EventLog.id)).where(
            and_(EventLog.event_type == "auth.register.success", EventLog.created_at >= since)
        )
    )
    successful_reg_events = int(successful_reg_events or 0)

    return {
        "period_days": days,
        "summary": {
            "total_registrations": total_reg,
            "total_verified": total_ver,
            "overall_verification_rate": round((total_ver / total_reg * 100.0), 2) if total_reg > 0 else 0.0,
            "successful_registration_events": successful_reg_events,
        },
        "daily_breakdown": daily_data,
        "generated_at": now_utc().isoformat(),
    }

# -----------------------
# /analytics/session-activity
# -----------------------
@router.get("/analytics/session-activity")
async def get_session_analytics(
    session: AsyncSession = Depends(get_async_session),
    _: None = Depends(require_admin),
):
    """
    Аналитика по активным refresh-сессиям в Redis.
    """
    # refresh_whitelist:<user_id>:<jti>
    pattern = "refresh_whitelist:*:*"
    session_count_by_user: Dict[str, int] = {}
    async for key in redis.scan_iter(match=pattern, count=1000):
        # ключ формата refresh_whitelist:<user_id>:<jti>
        parts = key.split(":")
        if len(parts) >= 3:
            user_id = parts[1]
            session_count_by_user[user_id] = session_count_by_user.get(user_id, 0) + 1

    total_active_sessions = sum(session_count_by_user.values())
    unique_active_users = len(session_count_by_user)
    avg_sessions_per_user = (total_active_sessions / unique_active_users) if unique_active_users > 0 else 0.0

    # За последние 24 часа — успешные логины
    since_24h = now_utc() - timedelta(hours=24)
    recent_login_count = await session.scalar(
        select(func.count(EventLog.id)).where(
            and_(EventLog.event_type == "auth.login.success", EventLog.created_at >= since_24h)
        )
    )
    recent_login_count = int(recent_login_count or 0)

    # Распределение по количеству сессий на пользователя
    session_distribution: Dict[int, int] = {}
    for _, cnt in session_count_by_user.items():
        session_distribution[cnt] = session_distribution.get(cnt, 0) + 1

    return {
        "active_sessions": {
            "total_sessions": total_active_sessions,
            "unique_users": unique_active_users,
            "average_sessions_per_user": round(avg_sessions_per_user, 2),
            "session_distribution": session_distribution,
        },
        "recent_activity": {"logins_last_24h": recent_login_count},
        "generated_at": now_utc().isoformat(),
    }

# -----------------------
# Rate limits introspection
# -----------------------
@router.get("/rate-limits/status")
async def get_rate_limit_status(
    ip: Optional[str] = Query(None, description="Посмотреть лимиты по конкретному IP"),
    _: None = Depends(require_admin),
):
    """
    Статус ключей rate-limit (регистрация/логин/ресенд и т.д.) в Redis.
    """
    if ip:
        patterns = [
            f"rate_limit:/auth/register:{ip}",
            f"rate_limit:/auth/login:{ip}",
            f"rate_limit:/auth/resend-verification:{ip}",
            f"login_fail:*:{ip}",
            f"rapid_fire:{ip}",
            f"suspicious_ip:{ip}",
        ]
        out: Dict[str, Dict[str, Any]] = {}
        for pat in patterns:
            if "*" in pat:
                async for key in redis.scan_iter(match=pat, count=200):
                    ttl = await redis.ttl(key)
                    val = await redis.get(key)
                    out[key] = {"value": val, "ttl": ttl}
            else:
                ttl = await redis.ttl(pat)
                val = await redis.get(pat)
                out[pat] = {"value": val, "ttl": ttl}
        return {"ip": ip, "rate_limits": out, "checked_at": now_utc().isoformat()}

    # Общая статистика по категориям
    categories = ["rate_limit:*", "login_fail:*", "rapid_fire:*", "suspicious_ip:*"]
    stats: Dict[str, int] = {}
    for pat in categories:
        stats[pat.replace("*", "").rstrip(":")] = await _count_redis_keys(pat)
    return {"rate_limit_statistics": stats, "generated_at": now_utc().isoformat()}

@router.post("/security/clear-rate-limits")
async def clear_rate_limits(
    ip: Optional[str] = Query(None, description="Очистить лимиты для конкретного IP"),
    pattern: Optional[str] = Query(None, description="Опасно: очистка по произвольному паттерну"),
    _: None = Depends(require_admin),
):
    """
    Админ-очистка rate-limit ключей. Требует явного IP или безопасного паттерна.
    """
    if not ip and not pattern:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Нужно указать ip или pattern"
        )
    cleared = 0
    if ip:
        patterns = [
            f"rate_limit:*:{ip}",
            f"login_fail:*:{ip}",
            f"rapid_fire:{ip}",
            f"suspicious_ip:{ip}",
            f"password_reset_rate:*:{ip}",
            f"resend_verification:{ip}*",
        ]
        for pat in patterns:
            async for key in redis.scan_iter(match=pat, count=1000):
                await redis.delete(key)
                cleared += 1
    else:
        # защита: разрешаем только известные префиксы
        allowed_prefixes = ("rate_limit:", "login_fail:", "rapid_fire:", "suspicious_ip:")
        if not any(pattern.startswith(p) for p in allowed_prefixes):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pattern должен начинаться с разрешённых префиксов",
            )
        async for key in redis.scan_iter(match=pattern, count=1000):
            await redis.delete(key)
            cleared += 1
    return {
        "message": f"Cleared {cleared} rate-limit entries",
        "ip": ip,
        "pattern": pattern,
        "cleared_at": now_utc().isoformat(),
    }

# -----------------------
# Audit export
# -----------------------
@router.get("/audit/export")
async def export_audit_logs(
    start_date: datetime = Query(..., description="UTC start"),
    end_date: datetime = Query(..., description="UTC end"),
    event_types: Optional[List[str]] = Query(None),
    user_id: Optional[str] = Query(None),
    limit: int = Query(10000, ge=1, le=50000),
    session: AsyncSession = Depends(get_async_session),
    _: None = Depends(require_admin),
):
    """
    Экспорт логов аудита для комплаенса/аналитики (в JSON).
    """
    q = select(EventLog).where(and_(EventLog.created_at >= start_date, EventLog.created_at <= end_date))
    if event_types:
        q = q.where(EventLog.event_type.in_(event_types))
    if user_id:
        q = q.where(EventLog.user_id == user_id)
    q = q.order_by(desc(EventLog.created_at)).limit(limit)
    res = await session.execute(q)
    items: List[Dict[str, Any]] = []
    for e in res.scalars():
        items.append(
            {
                "id": str(e.id),
                "timestamp": e.created_at.isoformat(),
                "event_type": e.event_type,
                "user_id": str(e.user_id) if e.user_id else None,
                "success": bool(e.success),
                "ip": e.ip,
                "user_agent": e.user_agent,
                "metadata": e.metadata,
            }
        )
    return {
        "export_info": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_records": len(items),
            "filters": {"event_types": event_types, "user_id": user_id},
        },
        "audit_logs": items,
        "exported_at": now_utc().isoformat(),
    }

# -----------------------
# Suspicious activity
# -----------------------
@router.get("/security/suspicious-activity")
async def get_suspicious_activity(
    hours: int = Query(24, ge=1, le=168),
    limit: int = Query(100, ge=1, le=1000),
    session: AsyncSession = Depends(get_async_session),
    _: None = Depends(require_admin),
):
    """
    Подозрительные события (частые фейлы логина, replay refresh и т.д.)
    """
    since = now_utc() - timedelta(hours=hours)
    suspicious_types = [
        "auth.login.failed",
        "auth.refresh.replay_detected",
        "auth.verify.wrong_token",
        "auth.password_reset.wrong_token",
        "auth.login.rate_limited",
        "auth.register.rate_limited",
    ]
    rows = await session.execute(
        select(EventLog)
        .where(and_(EventLog.created_at >= since, EventLog.event_type.in_(suspicious_types)))
        .order_by(desc(EventLog.created_at))
        .limit(limit)
    )
    suspicious: List[Dict[str, Any]] = []
    for ev in rows.scalars():
        suspicious.append(
            {
                "timestamp": ev.created_at.isoformat(),
                "event_type": ev.event_type,
                "user_id": str(ev.user_id) if ev.user_id else None,
                "ip": ev.ip,
                "user_agent": ev.user_agent,
                "success": bool(ev.success),
                "metadata": ev.metadata,
            }
        )

    # ТОП IP по кол-ву подозрительных событий
    ip_rows = await session.execute(
        select(EventLog.ip, func.count(EventLog.id).label("event_count"))
        .where(and_(EventLog.created_at >= since, EventLog.event_type.in_(suspicious_types)))
        .group_by(EventLog.ip)
        .order_by(desc(func.count(EventLog.id)))
        .limit(20)
    )
    top_ips = [{"ip": r.ip, "suspicious_events": int(r.event_count or 0)} for r in ip_rows]

    return {
        "period_hours": hours,
        "total_suspicious_events": len(suspicious),
        "suspicious_events": suspicious,
        "top_suspicious_ips": top_ips,
        "generated_at": now_utc().isoformat(),
    }