from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.database.database import Base


class DeviceModel(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)

    hostname = Column(String, nullable=False)
    ip = Column(String, unique=True, nullable=False)
    mac = Column(String, nullable=True)
    vendor = Column(String)

    risk_score = Column(Integer, default=0)
    risk_level = Column(String, default="Low")

    trusted = Column(Boolean, default=False)

    first_seen = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    last_seen = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


class PortModel(Base):
    __tablename__ = "device_ports"

    id = Column(Integer, primary_key=True, index=True)

    device_id = Column(Integer, nullable=False, index=True)

    port = Column(Integer, nullable=False)
    protocol = Column(String, default="tcp")
    service = Column(String, default="unknown")
    state = Column(String, default="open")

    first_seen = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    last_seen = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


class AIAnalysisModel(Base):
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True)

    device_id = Column(
        Integer,
        nullable=False,
        index=True,
    )

    analysis = Column(
        Text,
        nullable=False,
    )

    model = Column(
        String,
        default="gemini-3.6-flash",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


class ScanModel(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)

    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    completed_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    device_count = Column(Integer, default=0)

    high_risk_count = Column(Integer, default=0)
    medium_risk_count = Column(Integer, default=0)
    low_risk_count = Column(Integer, default=0)

    status = Column(
        String,
        default="completed",
    )


class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    alert_type = Column(
        String,
        nullable=False,
    )

    message = Column(
        String,
        nullable=False,
    )

    severity = Column(
        String,
        default="Medium",
    )

    device_ip = Column(
        String,
        nullable=True,
    )

    device_hostname = Column(
        String,
        nullable=True,
    )

    acknowledged = Column(
        Boolean,
        default=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )