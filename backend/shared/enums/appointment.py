import enum


class AppointmentStatusEnum(str, enum.Enum):
    SCHEDULED = 'scheduled'
    CONFIRMED = 'confirmed'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'


class AppointmentPrepaymentStatusEnum(str, enum.Enum):
    PENDING = 'pending'
    PAID = 'paid'
    CANCELED = 'canceled'
    REFUNDED = 'refunded'
    CANCELLED = 'cancelled'
