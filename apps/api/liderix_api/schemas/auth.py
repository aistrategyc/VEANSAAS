from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
import re

from uuid import UUID

class RegisterSchema(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username (3-50 characters)")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, max_length=128, description="Password (8-128 characters)")
    client_id: Optional[UUID] = Field(None, description="Client ID for tracking registration source")
    terms_accepted: bool = Field(..., description="User must accept terms of service")
    
    @validator('username')
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        if v.lower() in ['admin', 'root', 'system', 'api', 'support']:
            raise ValueError('Username is reserved')
        return v.strip()
    
    @validator('password')
    def validate_password_complexity(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @validator('terms_accepted')
    def validate_terms(cls, v):
        if not v:
            raise ValueError('You must accept the terms of service')
        return v

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., description="Password")
    remember_me: Optional[bool] = Field(False, description="Extend session duration")
    device_name: Optional[str] = Field(None, max_length=100, description="Optional device name for tracking")

class TokenResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field("bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")
    refresh_expires_in: Optional[int] = Field(None, description="Refresh token expiration time")
    user: Optional['UserInfo'] = Field(None, description="User information")

class UserInfo(BaseModel):
    id: str = Field(..., description="User ID")
    username: str = Field(..., description="Username")
    email: str = Field(..., description="Email address")
    is_verified: bool = Field(..., description="Email verification status")
    created_at: str = Field(..., description="Account creation timestamp")
    last_login_at: Optional[str] = Field(None, description="Last login timestamp")

class VerifySchema(BaseModel):
    token: str = Field(..., min_length=40, max_length=50, description="Verification token")
    email: EmailStr = Field(..., description="Email address")

class ResendSchema(BaseModel):
    email: EmailStr = Field(..., description="Email address")

class PasswordResetRequestSchema(BaseModel):
    email: EmailStr = Field(..., description="Email address")

class PasswordResetConfirmSchema(BaseModel):
    email: EmailStr = Field(..., description="Email address")
    token: str = Field(..., min_length=40, max_length=50, description="Reset token")
    new_password: str = Field(..., min_length=8, max_length=128, description="New password")
    
    @validator('new_password')
    def validate_new_password(cls, v):
        # Same validation as registration
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class ChangePasswordSchema(BaseModel):
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, max_length=128, description="New password")
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class SessionInfo(BaseModel):
    jti: str = Field(..., description="Session identifier")
    is_current: bool = Field(..., description="Whether this is the current session")
    created_at: str = Field(..., description="Session creation time")
    last_used: str = Field(..., description="Last activity time")
    ip: str = Field(..., description="IP address")
    user_agent: str = Field(..., description="User agent string")
    device_info: Optional[str] = Field(None, description="Parsed device information")
    location: Optional[str] = Field(None, description="Approximate location")

class SessionsResponse(BaseModel):
    sessions: List[SessionInfo] = Field(..., description="List of active sessions")
    total_count: int = Field(..., description="Total number of sessions")

class MessageResponse(BaseModel):
    message: str = Field(..., description="Response message")
    success: Optional[bool] = Field(True, description="Operation success status")
    data: Optional[dict] = Field(None, description="Additional response data")

class AuthHealthResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    service: str = Field(..., description="Service name")
    endpoints: dict = Field(..., description="Available endpoints")
    version: Optional[str] = Field(None, description="Service version")
    uptime: Optional[str] = Field(None, description="Service uptime")

class TwoFactorSetupResponse(BaseModel):
    """For future 2FA implementation"""
    qr_code_url: str = Field(..., description="QR code for authenticator app")
    backup_codes: List[str] = Field(..., description="Backup codes for recovery")
    secret_key: str = Field(..., description="Secret key for manual entry")

class TwoFactorVerifySchema(BaseModel):
    """For future 2FA implementation"""
    code: str = Field(..., min_length=6, max_length=6, description="6-digit verification code")
    
    @validator('code')
    def validate_code(cls, v):
        if not v.isdigit():
            raise ValueError('Code must contain only digits')
        return v

class SecurityEventResponse(BaseModel):
    """For security monitoring"""
    event_type: str = Field(..., description="Type of security event")
    timestamp: str = Field(..., description="Event timestamp")
    ip: str = Field(..., description="Source IP address")
    user_agent: str = Field(..., description="User agent")
    success: bool = Field(..., description="Whether the event was successful")
    metadata: Optional[dict] = Field(None, description="Additional event data")

class RateLimitInfo(BaseModel):
    """Rate limiting information"""
    limit: int = Field(..., description="Rate limit threshold")
    remaining: int = Field(..., description="Remaining requests")
    reset_time: int = Field(..., description="Time when limit resets (Unix timestamp)")
    retry_after: Optional[int] = Field(None, description="Seconds to wait before retrying")

# Update forward references
TokenResponse.model_rebuild()
UserInfo.model_rebuild()