from shared.logger import logger


async def send_verification_email(data: dict):
    logger.warning(data)


handlers = {'user.created': send_verification_email}
