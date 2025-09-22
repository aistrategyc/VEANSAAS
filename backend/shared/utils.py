from typing import Any


async def update_model_from_dict(model_instance: Any, update_data: dict) -> None:
    if not update_data:
        return

    for field, value in update_data.items():
        setattr(model_instance, field, value)
