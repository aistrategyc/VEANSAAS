"""
Модели соглашений и файлов для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, DateTime, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class AgreementType(str, enum.Enum):
    TATTOO_CONSENT = "tattoo_consent"
    PIERCING_CONSENT = "piercing_consent"
    BEAUTY_CONSENT = "beauty_consent"
    PRIVACY_POLICY = "privacy_policy"
    TERMS_OF_SERVICE = "terms_of_service"
    HEALTH_QUESTIONNAIRE = "health_questionnaire"


class SignatureMethod(str, enum.Enum):
    PAD = "pad"  # планшет/подпись на экране
    SMS = "sms"  # подтверждение по СМС
    EMAIL = "email"  # подтверждение по email


class AgreementTemplate(BaseModel):
    """Шаблон согласия/анкеты"""
    __tablename__ = "agreement_templates"
    
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=True)  # Null = для всех студий
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    
    name = Column(String(255), nullable=False)
    type = Column(Enum(AgreementType), nullable=False)
    
    # Содержимое шаблона
    content = Column(Text, nullable=False)  # HTML/Markdown содержимое
    fields = Column(JSON, nullable=True)  # Поля для заполнения клиентом
    
    # Настройки
    is_required = Column(Boolean, default=True)
    version = Column(String(20), default="1.0")
    
    # Связи
    studio = relationship("Studio")
    organization = relationship("Organization")
    agreements = relationship("Agreement", back_populates="template")


class Agreement(BaseModel):
    """Подписанное согласие/анкета"""
    __tablename__ = "agreements"
    
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    template_id = Column(UUID(as_uuid=True), ForeignKey("agreement_templates.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    
    # Метод подписания
    signature_method = Column(Enum(SignatureMethod), nullable=False)
    
    # Данные подписи
    signature_data = Column(JSON, nullable=True)  # подпись, IP, устройство и т.д.
    signed_at = Column(DateTime(timezone=True), nullable=False)
    
    # Заполненные данные
    form_data = Column(JSON, nullable=True)  # ответы клиента на поля формы
    
    # Связи
    client = relationship("Client", back_populates="agreements")
    template = relationship("AgreementTemplate", back_populates="agreements")
    appointment = relationship("Appointment", back_populates="agreements")
    file_assets = relationship("FileAsset", back_populates="agreement")


class FileAsset(BaseModel):
    """Файловые активы (PDF согласий, фото работ, чеки)"""
    __tablename__ = "file_assets"
    
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=True)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String(100), nullable=True)
    
    # Связи
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    agreement_id = Column(UUID(as_uuid=True), ForeignKey("agreements.id"), nullable=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=True)
    
    # Метаданные
    metadata = Column(JSON, nullable=True)  # дополнительная информация о файле
    
    # Связи
    appointment = relationship("Appointment")
    agreement = relationship("Agreement", back_populates="file_assets")
    client = relationship("Client")