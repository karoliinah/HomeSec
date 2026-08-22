from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.database.models import DeviceModel


class DeviceRepository:

    def get_all(self, db: Session):
        return db.query(DeviceModel).order_by(DeviceModel.id).all()

    def get_by_ip(self, db: Session, ip: str):
        return (
            db.query(DeviceModel)
            .filter(DeviceModel.ip == ip)
            .first()
        )

    def create(self, db: Session, device):
        db_device = DeviceModel(
            hostname=device.hostname,
            ip=device.ip,
            mac=device.mac,
            vendor=device.vendor,
            risk_score=device.risk_score,
            risk_level=device.risk_level,
        )

        db.add(db_device)
        db.commit()
        db.refresh(db_device)

        return db_device

    def update(self, db: Session, db_device, device):
        db_device.hostname = device.hostname
        db_device.mac = device.mac
        db_device.vendor = device.vendor
        db_device.risk_score = device.risk_score
        db_device.risk_level = device.risk_level
        db_device.last_seen = datetime.now(timezone.utc)

        db.commit()
        db.refresh(db_device)

        return db_device