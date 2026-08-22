from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.database.models import ScanModel


class ScanRepository:

    def create(
        self,
        db: Session,
        device_count: int,
        high_risk_count: int,
        medium_risk_count: int,
        low_risk_count: int,
    ):
        scan = ScanModel(
            completed_at=datetime.now(timezone.utc),
            device_count=device_count,
            high_risk_count=high_risk_count,
            medium_risk_count=medium_risk_count,
            low_risk_count=low_risk_count,
            status="completed",
        )

        db.add(scan)
        db.commit()
        db.refresh(scan)

        return scan

    def get_all(self, db: Session):
        return (
            db.query(ScanModel)
            .order_by(ScanModel.id.desc())
            .all()
        )