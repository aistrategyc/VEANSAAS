import resend
from config import notification_settings

from shared.logger import logger


async def send_email(
    subject: str,
    email_to: str,
    html: str,
    email_from: str = 'onboarding@resend.dev',
):
    try:
        resend.api_key = notification_settings.RESEND_API_KEY

        email_payload = {
            'from': email_from,
            'to': email_to,
            'subject': subject,
            'html': html,
        }
        response = resend.Emails.send(email_payload)
        logger.info(f'Email sent successfully.: {response.get("id")}')
        return response
    except Exception as e:
        logger.error(f'Email sent successfully.: {str(e)}')
        raise Exception(f'Failed to send email: {str(e)}')
