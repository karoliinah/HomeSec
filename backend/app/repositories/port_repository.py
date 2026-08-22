from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.database.models import PortModel


class PortRepository:

    def get_by_device(self, db: Session, device_id: int):
        return (
            db.query(PortModel)
            .filter(PortModel.device_id == device_id)
            .order_by(PortModel.port)
            .all()
        )

    def get_by_device_and_port(
        self,
        db: Session,
        device_id: int,
        port: int,
        protocol: str = "tcp",
    ):
        return (
            db.query(PortModel)
            .filter(
                PortModel.device_id == device_id,
                PortModel.port == port,
                PortModel.protocol == protocol,
            )
            .first()
        )

    def create(
        self,
        db: Session,
        device_id: int,
        port: int,
        protocol: str,
        service: str,
    ):
        db_port = PortModel(
            device_id=device_id,
            port=port,
            protocol=protocol,
            service=service,
            state="open",
        )

        db.add(db_port)
        db.commit()
        db.refresh(db_port)

        return db_port

    def update(
        self,
        db: Session,
        db_port: PortModel,
        service: str,
    ):
        db_port.service = service
        db_port.state = "open"
        db_port.last_seen = datetime.now(timezone.utc)

        db.commit()
        db.refresh(db_port)

        return db_port