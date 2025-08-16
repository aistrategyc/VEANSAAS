import asyncio
import json
from contextlib import asynccontextmanager
from typing import Any, Awaitable, Callable, Dict, List, Union

import aio_pika
from aio_pika import ExchangeType, Message
from aio_pika.abc import (
    AbstractChannel,
    AbstractExchange,
    AbstractRobustChannel,
    AbstractRobustConnection,
)
from fastapi import FastAPI

from .config import settings


class RabbitMQ:
    def __init__(self):
        self.connection: AbstractRobustConnection
        self.channel: Union[AbstractRobustChannel, AbstractChannel]
        self.exchange: AbstractExchange

    async def connect(self):
        self.connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)
        self.channel = await self.connection.channel()
        self.exchange = await self.channel.declare_exchange(
            'microservices_exchange', ExchangeType.DIRECT, durable=True
        )

    async def publish(self, routing_key: str, message: dict):
        await self.exchange.publish(
            Message(
                body=json.dumps(message).encode(),
                delivery_mode=2,
            ),
            routing_key=routing_key,
        )

    async def setup_queue(self, queue_name: str, routing_keys: List[str]):
        queue = await self.channel.declare_queue(
            queue_name,
            durable=True,
            arguments={
                'x-message-ttl': 60000,
                'x-dead-letter-exchange': 'dlx_exchange',
            },
        )
        for key in routing_keys:
            await queue.bind(self.exchange, key)
        return queue

    async def consume(
        self, queue_name: str, callback: Callable[[Dict[str, Any]], Awaitable[None]]
    ):
        queue = await self.channel.declare_queue(
            queue_name,
            durable=True,
            arguments={
                'x-message-ttl': 60000,
                'x-dead-letter-exchange': 'dlx_exchange',
            },
        )

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    data = json.loads(message.body.decode())
                    await callback(data)

    async def close(self):
        if self.connection:
            await self.connection.close()


rabbitmq = RabbitMQ()


def create_lifespan(
    queue_name: str,
    routing_keys: list[str],
    handlers: dict[str, Callable[[Dict[str, Any]], Awaitable[None]]],
):
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        await rabbitmq.connect()

        queue = await rabbitmq.setup_queue(
            queue_name=queue_name, routing_keys=routing_keys
        )

        consumer_tasks = []
        for routing_key in routing_keys:
            if handler := handlers.get(routing_key, None):
                task = asyncio.create_task(rabbitmq.consume(queue.name, handler))
                consumer_tasks.append(task)

        yield

        for task in consumer_tasks:
            task.cancel()
        await asyncio.wait(consumer_tasks, timeout=1.0)
        await rabbitmq.close()

    return lifespan
