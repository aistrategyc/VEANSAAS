# apps/api/liderix_api/services/mailer.py
from __future__ import annotations

import logging
from typing import Optional, Sequence
from httpx import AsyncClient, HTTPError
from liderix_api.config.settings import settings

logger = logging.getLogger(__name__)

RESEND_URL = "https://api.resend.com/emails"

class Mailer:
    """Сервис для отправки email через Resend API."""
    def __init__(self):
        self.api_key = settings.RESEND_API_KEY
        self.from_email = settings.EMAIL_FROM

    async def send_email(
        self,
        to: Sequence[str] | str,
        subject: str,
        html: str,
        text: Optional[str] = None,
    ) -> bool:
        """Отправка письма. Возвращает True при успехе."""
        if not self.api_key:
            logger.warning("RESEND_API_KEY is missing — skipping send_email")
            return False

        if isinstance(to, str):
            to = [to]

        payload = {
            "from": self.from_email,
            "to": to,
            "subject": subject,
            "html": html,
        }
        if text:
            payload["text"] = text

        try:
            async with AsyncClient(timeout=15) as client:
                r = await client.post(
                    RESEND_URL,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                )
                r.raise_for_status()
            return True
        except HTTPError as e:
            body = getattr(e.response, "text", "")
            logger.error("Resend API error: %s | Body: %s", e, body)
            return False

    async def send_verification_email(self, to: str, username: str, token: str) -> bool:
        """Спец-шаблон для верификации email."""
        verify_url = f"{settings.FRONTEND_URL}/verify?token={token}&email={to}"
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Welcome to Liderix, {username}!</h2>
            <p>Please confirm your email to activate your account:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{verify_url}" style="background-color: #007bff; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none;">
                    Verify Email
                </a>
            </p>
            <p>If the button does not work, copy this link: <br> {verify_url}</p>
            <p style="color:#666;font-size:12px">This link will expire in 48 hours.</p>
        </div>
        """
        return await self.send_email(to, "Verify your Liderix account", html)