from shared.logger import logger


async def create_email(data: dict):
    logger.warning(data)


handlers = {'user.created': create_email}
