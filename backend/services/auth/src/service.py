from fastapi import HTTPException, Request, status
from schemas import (
    LoginUserRequest,
    RegisterByInviterUserRequest,
    RegisterUserRequest,
    TokenResponse,
)
from security import pwd_context
from utils import (
    create_access_token,
    create_refresh_token,
    create_verification_token,
    get_verification_token,
    verify_password,
)

from shared.rabbitmq import rabbitmq
from shared.schemas.company_units.common import BaseInviteMemberCreateRequest
from shared.schemas.user import UserCreateInternal, UserVerificationEmail
from shared.service_clients.company_units import (
    CompanyUnitsInviteServiceClient,
    CompanyUnitsOrganizationServiceClient,
)
from shared.service_clients.user import UserServiceClient


async def register(
    request: Request,
    data: RegisterUserRequest,
    user_service: UserServiceClient,
    units_service: CompanyUnitsOrganizationServiceClient,
):
    user_created = None
    try:
        user, organization = data.user, data.organization

        hashed_password = pwd_context.hash(user.password)
        user_internal = UserCreateInternal(
            **user.model_dump(exclude={'password'}), hashed_password=hashed_password
        )

        user_created = await user_service.create_user(request_data=user_internal)

        organization.created_by_uuid = str(user_created.uuid)

        await units_service.create_organization(request_data=organization)

        verification_token = await create_verification_token(
            data={
                'sub': 'email',
                'email': user_created.email,
                'user_uuid': str(user_created.uuid),
                'type': 'verification',
            }
        )

        await rabbitmq.publish(
            routing_key='user.verification_email',
            message={'token': verification_token, 'email': user_created.email},
        )

        return {
            'status': 'success',
            'message': 'User registered. Check your email for confirmation.',
        }
    except Exception:
        if user_created:
            await user_service.delete_user(user_created.uuid)
        raise


async def register_by_invite(
    request: Request,
    data: RegisterByInviterUserRequest,
    user_service: UserServiceClient,
    invite_service: CompanyUnitsInviteServiceClient,
):
    user_created = None
    try:
        invite_token = data.invite_token
        invite_data = await invite_service.validate(invite_token=invite_token)

        hashed_password = pwd_context.hash(data.password)
        user_internal = UserCreateInternal(
            **data.model_dump(exclude={'password'}),
            hashed_password=hashed_password,
            email=invite_data.email,
        )

        user_created = await user_service.create_user(request_data=user_internal)

        await invite_service.create_members(
            uuid=invite_data.uuid,
            request_data=BaseInviteMemberCreateRequest(
                user_uuid=str(user_created.uuid), type=invite_data.type
            ),
        )

        verification_token = await create_verification_token(
            data={
                'sub': 'email',
                'email': user_created.email,
                'user_uuid': str(user_created.uuid),
                'type': 'verification',
            }
        )

        await rabbitmq.publish(
            routing_key='user.verification_email',
            message={'token': verification_token, 'email': user_created.email},
        )

        return {
            'status': 'success',
            'message': 'User registered. Check your email for confirmation.',
        }
    except Exception:
        if user_created:
            await user_service.delete_user(user_created.uuid)
        raise


async def login(
    request: Request, data: LoginUserRequest, user_service: UserServiceClient
) -> TokenResponse:
    user = await user_service.get_user_for_auth(username=data.username)

    if not await verify_password(
        password=data.password, hashed_password=user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid authentication credentials',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    user_date = {
        'sub': user.uuid,
        'user_uuid': user.uuid,
        'username': user.username,
        'email': user.email,
        'roles': user.roles,
    }

    access_token = await create_access_token(data=user_date)

    refresh_token = await create_refresh_token(data=user_date)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


async def verify_email(request: Request, token: str, user_service: UserServiceClient):
    data = await get_verification_token(token=token)
    email = data.get('email')
    user_uuid = data.get('user_uuid')

    if not email or not user_uuid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Invalid token',
        )
    await user_service.verification_email(
        request_data=UserVerificationEmail(user_uuid=str(user_uuid), email=email)
    )


async def refresh_access_token(request: Request, payload: dict):
    access_token = await create_access_token(data=payload)

    return TokenResponse(
        access_token=access_token,
        token_type='bearer',
    )
