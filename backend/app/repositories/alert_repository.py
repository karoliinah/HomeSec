from sqlalchemy.orm import Session

from app.database.models import AlertModel


class AlertRepository:

    def create(
        self,
        db: Session,
        alert_type: str,
        message: str,
        severity: str,
        device_ip: str | None = None,
        device_hostname: str | None = None,
    ):
        alert = AlertModel(
            alert_type=alert_type,
            message=message,
            severity=severity,
            device_ip=device_ip,
            device_hostname=device_hostname,
        )

        db.add(alert)
        db.commit()
        db.refresh(alert)

        return alert

    def get_all(self, db: Session):
        return (
            db.query(AlertModel)
            .order_by(AlertModel.id.desc())
            .all()
        )