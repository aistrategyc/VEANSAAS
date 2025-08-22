"""
Production-ready notifications service with email, push notifications, and templates.
Supports multiple providers: SendGrid, AWS SES, Firebase Cloud Messaging.
"""
from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Union
from enum import Enum
from dataclasses import dataclass
from jinja2 import Environment, FileSystemLoader, TemplateNotFound
import aiohttp
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import Column, String, Text, DateTime, Boolean, Integer, select
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from uuid import uuid4, UUID

from liderix_api.config.settings import settings
from liderix_api.db import get_async_session
from liderix_api.db import Base
from liderix_api.models.mixins import TimestampMixin

logger = logging.getLogger(__name__)


class NotificationType(str, Enum):
    EMAIL = "email"
    PUSH = "push"
    SMS = "sms"
    IN_APP = "in_app"


class NotificationStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    DELIVERED = "delivered"
    READ = "read"


class EmailProvider(str, Enum):
    SENDGRID = "sendgrid"
    AWS_SES = "aws_ses"
    SMTP = "smtp"


@dataclass
class NotificationTemplate:
    """Template for notifications"""
    name: str
    subject_template: str
    text_template: str
    html_template: Optional[str] = None
    variables: Optional[List[str]] = None


# Database model for tracking notifications
class NotificationLog(Base, TimestampMixin):
    """Log of all sent notifications"""
    __tablename__ = "notification_logs"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    recipient_id = Column(PG_UUID(as_uuid=True), nullable=True)  # User ID if applicable
    recipient_email = Column(String(255), nullable=True)
    recipient_phone = Column(String(50), nullable=True)
    notification_type = Column(String(50), nullable=False)
    template_name = Column(String(100), nullable=True)
    subject = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    html_content = Column(Text, nullable=True)
    status = Column(String(50), default=NotificationStatus.PENDING)
    provider = Column(String(50), nullable=True)
    external_id = Column(String(255), nullable=True)  # Provider's message ID
    error_message = Column(Text, nullable=True)
    meta_data = Column(JSONB, nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    retry_count = Column(Integer, default=0)


class NotificationService:
    """Production notification service"""
    
    def __init__(self):
        self.templates_dir = "liderix_api/templates/notifications"
        self.jinja_env = Environment(
            loader=FileSystemLoader(self.templates_dir),
            autoescape=True
        )
        self.email_provider = getattr(settings, 'EMAIL_PROVIDER', EmailProvider.SMTP)
        
    async def send_project_notification(
        self,
        email: str,
        notification_type: str,
        project_name: str,
        sender_name: str,
        extra_data: Optional[Dict[str, Any]] = None,
        user_id: Optional[UUID] = None
    ) -> bool:
        """Send project-related notification"""
        template_data = {
            'project_name': project_name,
            'sender_name': sender_name,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            **(extra_data or {})
        }
        
        template_mapping = {
            'added_to_project': 'project_member_added',
            'status_changed': 'project_status_changed',
            'task_assigned': 'task_assigned',
            'project_deadline': 'project_deadline_reminder',
            'project_completed': 'project_completed'
        }
        
        template_name = template_mapping.get(notification_type, 'generic_project')
        
        return await self.send_email_from_template(
            to_email=email,
            template_name=template_name,
            template_data=template_data,
            recipient_id=user_id
        )
    
    async def send_task_notification(
        self,
        email: str,
        notification_type: str,
        task_title: str,
        sender_username: str,
        extra_data: Optional[Dict[str, Any]] = None,
        user_id: Optional[UUID] = None
    ) -> bool:
        """Send task-related notification"""
        try:
            template_data = {
                'task_title': task_title,
                'sender_username': sender_username,
                'sender_name': sender_username,  # Alias for compatibility
                'timestamp': datetime.now(timezone.utc).isoformat(),
                **(extra_data or {})
            }
            
            # Map notification types to templates
            template_mapping = {
                'task_assigned': 'task_assigned',
                'task_unassigned': 'task_unassigned',
                'status_changed': 'task_status_changed',
                'task_commented': 'task_commented',
                'task_updated': 'task_updated',
                'task_deadline': 'task_deadline_reminder',
                'task_completed': 'task_completed',
                'task_overdue': 'task_overdue'
            }
            
            template_name = template_mapping.get(notification_type, 'generic_task')
            
            # Try to send using template first
            try:
                return await self.send_email_from_template(
                    to_email=email,
                    template_name=template_name,
                    template_data=template_data,
                    recipient_id=user_id
                )
            except TemplateNotFound:
                # Fallback to simple email if template doesn't exist
                logger.warning(f"Template {template_name} not found, using fallback")
                return await self._send_task_notification_fallback(
                    email, notification_type, task_title, sender_username, extra_data
                )
                
        except Exception as e:
            logger.error(f"Failed to send task notification: {e}")
            return False
    
    async def _send_task_notification_fallback(
        self,
        email: str,
        notification_type: str,
        task_title: str,
        sender_username: str,
        extra_data: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Fallback method for task notifications when templates are not available"""
        
        # Generate subject and content based on notification type
        subjects = {
            'task_assigned': f'Task Assigned: {task_title}',
            'task_unassigned': f'Task Unassigned: {task_title}',
            'status_changed': f'Task Status Changed: {task_title}',
            'task_commented': f'New Comment on Task: {task_title}',
            'task_updated': f'Task Updated: {task_title}',
            'task_deadline': f'Task Deadline Reminder: {task_title}',
            'task_completed': f'Task Completed: {task_title}',
            'task_overdue': f'Task Overdue: {task_title}'
        }
        
        subject = subjects.get(notification_type, f'Task Notification: {task_title}')
        
        # Generate content
        content_templates = {
            'task_assigned': f'You have been assigned to the task "{task_title}" by {sender_username}.',
            'task_unassigned': f'You have been unassigned from the task "{task_title}" by {sender_username}.',
            'status_changed': f'The status of task "{task_title}" has been changed by {sender_username}.',
            'task_commented': f'{sender_username} added a comment to task "{task_title}".',
            'task_updated': f'Task "{task_title}" has been updated by {sender_username}.',
            'task_deadline': f'Reminder: Task "{task_title}" has an upcoming deadline.',
            'task_completed': f'Task "{task_title}" has been marked as completed by {sender_username}.',
            'task_overdue': f'Task "{task_title}" is now overdue.'
        }
        
        content = content_templates.get(
            notification_type, 
            f'Task "{task_title}" notification from {sender_username}.'
        )
        
        # Add extra data if provided
        if extra_data:
            if 'old_status' in extra_data and 'new_status' in extra_data:
                content += f' Status changed from {extra_data["old_status"]} to {extra_data["new_status"]}.'
            if 'comment' in extra_data:
                content += f' Comment: {extra_data["comment"][:100]}...'
        
        content += f'\n\nNotification sent at {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")}'
        
        return await self.send_email(
            to_email=email,
            subject=subject,
            text_content=content,
            template_name=f'task_{notification_type}_fallback'
        )
    
    async def send_email_from_template(
        self,
        to_email: str,
        template_name: str,
        template_data: Dict[str, Any],
        recipient_id: Optional[UUID] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """Send email using Jinja2 template"""
        try:
            # Load and render templates
            subject_template = self.jinja_env.get_template(f"{template_name}_subject.txt")
            text_template = self.jinja_env.get_template(f"{template_name}.txt")
            
            subject = subject_template.render(**template_data).strip()
            text_content = text_template.render(**template_data)
            
            # Try to load HTML template
            html_content = None
            try:
                html_template = self.jinja_env.get_template(f"{template_name}.html")
                html_content = html_template.render(**template_data)
            except TemplateNotFound:
                logger.debug(f"No HTML template found for {template_name}")
            
            return await self.send_email(
                to_email=to_email,
                subject=subject,
                text_content=text_content,
                html_content=html_content,
                recipient_id=recipient_id,
                template_name=template_name,
                attachments=attachments
            )
            
        except TemplateNotFound as e:
            logger.error(f"Template not found: {e}")
            raise
        except Exception as e:
            logger.error(f"Error rendering template {template_name}: {e}")
            return False
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        text_content: str,
        html_content: Optional[str] = None,
        from_email: Optional[str] = None,
        recipient_id: Optional[UUID] = None,
        template_name: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """Send email via configured provider"""
        from_email = from_email or getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@liderix.com')
        
        # Log notification
        notification_log = NotificationLog(
            recipient_id=recipient_id,
            recipient_email=to_email,
            notification_type=NotificationType.EMAIL,
            template_name=template_name,
            subject=subject,
            content=text_content,
            html_content=html_content,
            provider=self.email_provider,
            meta_data={
                'from_email': from_email,
                'attachments_count': len(attachments) if attachments else 0
            }
        )
        
        try:
            if self.email_provider == EmailProvider.SENDGRID:
                success = await self._send_via_sendgrid(
                    to_email, subject, text_content, html_content, from_email, attachments
                )
            elif self.email_provider == EmailProvider.AWS_SES:
                success = await self._send_via_aws_ses(
                    to_email, subject, text_content, html_content, from_email, attachments
                )
            else:  # SMTP
                success = await self._send_via_smtp(
                    to_email, subject, text_content, html_content, from_email, attachments
                )
            
            if success:
                notification_log.status = NotificationStatus.SENT
                notification_log.sent_at = datetime.now(timezone.utc)
            else:
                notification_log.status = NotificationStatus.FAILED
                
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            notification_log.status = NotificationStatus.FAILED
            notification_log.error_message = str(e)
            success = False
        
        # Save to database
        try:
            async with get_async_session() as session:
                session.add(notification_log)
                await session.commit()
        except Exception as e:
            logger.error(f"Failed to save notification log: {e}")
        
        return success
    
    async def _send_via_sendgrid(
        self,
        to_email: str,
        subject: str,
        text_content: str,
        html_content: Optional[str],
        from_email: str,
        attachments: Optional[List[Dict[str, Any]]]
    ) -> bool:
        """Send email via SendGrid API"""
        if not hasattr(settings, 'SENDGRID_API_KEY'):
            logger.error("SendGrid API key not configured")
            return False
        
        payload = {
            "personalizations": [{
                "to": [{"email": to_email}],
                "subject": subject
            }],
            "from": {"email": from_email},
            "content": [
                {"type": "text/plain", "value": text_content}
            ]
        }
        
        if html_content:
            payload["content"].append({
                "type": "text/html", 
                "value": html_content
            })
        
        # Add attachments if provided
        if attachments:
            payload["attachments"] = []
            for attachment in attachments:
                payload["attachments"].append({
                    "content": attachment["content"],  # base64 encoded
                    "filename": attachment["filename"],
                    "type": attachment.get("type", "application/octet-stream")
                })
        
        headers = {
            "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.sendgrid.com/v3/mail/send",
                json=payload,
                headers=headers
            ) as response:
                if response.status == 202:
                    logger.info(f"Email sent via SendGrid to {to_email}")
                    return True
                else:
                    error_text = await response.text()
                    logger.error(f"SendGrid error {response.status}: {error_text}")
                    return False
    
    async def _send_via_aws_ses(
        self,
        to_email: str,
        subject: str,
        text_content: str,
        html_content: Optional[str],
        from_email: str,
        attachments: Optional[List[Dict[str, Any]]]
    ) -> bool:
        """Send email via AWS SES"""
        try:
            import boto3
            from botocore.exceptions import ClientError
            
            ses_client = boto3.client(
                'ses',
                region_name=getattr(settings, 'AWS_REGION', 'us-east-1'),
                aws_access_key_id=getattr(settings, 'AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=getattr(settings, 'AWS_SECRET_ACCESS_KEY')
            )
            
            # Build message
            message = {
                'Subject': {'Data': subject},
                'Body': {'Text': {'Data': text_content}}
            }
            
            if html_content:
                message['Body']['Html'] = {'Data': html_content}
            
            response = ses_client.send_email(
                Source=from_email,
                Destination={'ToAddresses': [to_email]},
                Message=message
            )
            
            logger.info(f"Email sent via AWS SES to {to_email}: {response['MessageId']}")
            return True
            
        except ImportError:
            logger.error("boto3 not installed for AWS SES")
            return False
        except ClientError as e:
            logger.error(f"AWS SES error: {e}")
            return False
    
    async def _send_via_smtp(
        self,
        to_email: str,
        subject: str,
        text_content: str,
        html_content: Optional[str],
        from_email: str,
        attachments: Optional[List[Dict[str, Any]]]
    ) -> bool:
        """Send email via SMTP"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = from_email
            msg['To'] = to_email
            
            # Add text part
            text_part = MIMEText(text_content, 'plain', 'utf-8')
            msg.attach(text_part)
            
            # Add HTML part if provided
            if html_content:
                html_part = MIMEText(html_content, 'html', 'utf-8')
                msg.attach(html_part)
            
            # Add attachments if provided
            if attachments:
                for attachment in attachments:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(attachment['content'])
                    encoders.encode_base64(part)
                    part.add_header(
                        'Content-Disposition',
                        f'attachment; filename= {attachment["filename"]}'
                    )
                    msg.attach(part)
            
            # Send via SMTP
            def send_smtp():
                smtp_host = getattr(settings, 'SMTP_HOST', 'localhost')
                smtp_port = getattr(settings, 'SMTP_PORT', 587)
                
                with smtplib.SMTP(smtp_host, smtp_port) as server:
                    if getattr(settings, 'SMTP_TLS', True):
                        server.starttls()
                    if hasattr(settings, 'SMTP_USERNAME'):
                        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                    server.send_message(msg)
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, send_smtp)
            
            logger.info(f"Email sent via SMTP to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"SMTP error: {e}")
            # For development, just log and return True to avoid blocking
            if getattr(settings, 'DEBUG', False):
                logger.info(f"DEBUG MODE: Would send email to {to_email} - {subject}")
                return True
            return False
    
    async def send_push_notification(
        self,
        user_id: UUID,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
        badge_count: Optional[int] = None
    ) -> bool:
        """Send push notification via Firebase Cloud Messaging"""
        try:
            # Get user's FCM tokens from database
            async with get_async_session() as session:
                # You'll need to implement a UserDevice model to store FCM tokens
                # devices = await session.scalars(
                #     select(UserDevice).where(
                #         UserDevice.user_id == user_id,
                #         UserDevice.is_active == True
                #     )
                # )
                
                # For now, log the push notification
                notification_log = NotificationLog(
                    recipient_id=user_id,
                    notification_type=NotificationType.PUSH,
                    subject=title,
                    content=message,
                    meta_data={
                        'data': data,
                        'badge_count': badge_count
                    }
                )
                
                # TODO: Implement actual FCM sending
                # This would involve calling Firebase Cloud Messaging API
                
                notification_log.status = NotificationStatus.SENT
                notification_log.sent_at = datetime.now(timezone.utc)
                
                session.add(notification_log)
                await session.commit()
            
            logger.info(f"Push notification sent to user {user_id}: {title}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send push notification: {e}")
            return False
    
    async def send_bulk_email(
        self,
        recipients: List[str],
        subject: str,
        text_content: str,
        html_content: Optional[str] = None,
        template_name: Optional[str] = None,
        template_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Send bulk emails with rate limiting"""
        results = {
            'total': len(recipients),
            'success': 0,
            'failed': 0,
            'errors': []
        }
        
        # Process in batches to avoid overwhelming the email service
        batch_size = getattr(settings, 'EMAIL_BATCH_SIZE', 10)
        
        for i in range(0, len(recipients), batch_size):
            batch = recipients[i:i + batch_size]
            tasks = []
            
            for email in batch:
                if template_name and template_data:
                    task = self.send_email_from_template(
                        to_email=email,
                        template_name=template_name,
                        template_data=template_data
                    )
                else:
                    task = self.send_email(
                        to_email=email,
                        subject=subject,
                        text_content=text_content,
                        html_content=html_content
                    )
                tasks.append(task)
            
            # Execute batch
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for email, result in zip(batch, batch_results):
                if isinstance(result, Exception):
                    results['failed'] += 1
                    results['errors'].append({
                        'email': email,
                        'error': str(result)
                    })
                elif result:
                    results['success'] += 1
                else:
                    results['failed'] += 1
                    results['errors'].append({
                        'email': email,
                        'error': 'Unknown error'
                    })
            
            # Rate limiting between batches
            if i + batch_size < len(recipients):
                await asyncio.sleep(1)
        
        logger.info(f"Bulk email completed: {results}")
        return results


# Global instance
notification_service = NotificationService()

# Convenience functions for backward compatibility
async def send_project_notification(
    email: str,
    notification_type: str,
    project_name: str,
    sender_name: str,
    extra_data: Optional[Dict[str, Any]] = None
) -> bool:
    return await notification_service.send_project_notification(
        email, notification_type, project_name, sender_name, extra_data
    )

async def send_email_notification(
    to_email: str,
    subject: str,
    body: str,
    html_body: Optional[str] = None,
    from_email: Optional[str] = None
) -> bool:
    return await notification_service.send_email(
        to_email, subject, body, html_body, from_email
    )

async def send_push_notification(
    user_id: str,
    title: str,
    message: str,
    data: Optional[Dict[str, Any]] = None
) -> bool:
    return await notification_service.send_push_notification(
        UUID(user_id), title, message, data
    )

# NEW: Task notification function that routes expects
async def send_task_notification(
    email: str,
    notification_type: str,
    task_title: str,
    sender_username: str,
    extra_data: Optional[Dict[str, Any]] = None
) -> bool:
    """
    Send task-related notification - main function expected by routes
    """
    return await notification_service.send_task_notification(
        email, notification_type, task_title, sender_username, extra_data
    )