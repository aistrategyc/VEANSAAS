from sqlalchemy import String, DateTime, ForeignKey, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
import uuid
from liderix_api.db import Base
from enum import Enum as PythonEnum

class SubscriptionTier(PythonEnum):
    free = "free"
    basic = "basic"
    pro = "pro"

class Client(Base):
    __tablename__ = "clients"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    subscription_tier: Mapped[SubscriptionTier] = mapped_column(Enum(SubscriptionTier), default=SubscriptionTier.free, nullable=False)
    max_employees: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="clients")