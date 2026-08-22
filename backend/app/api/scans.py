from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.alert_repository import AlertRepository
from app.repositories.scan_repository import ScanRepository
from app.services.device_service import DeviceService

router = APIRouter(prefix="/scan", tags=["Scan"])

device_service = DeviceService()
scan_repository = ScanRepository()
alert_repository = AlertRepository()


@router.post("/")
def scan_network(db: Session = Depends(get_db)):
    result = device_service.scan_and_save(db)

    devices = result["devices"]
    new_devices = result["new_devices"]

    return {
        "devices": [
            {
                "id": device.id,
                "hostname": device.hostname,
                "ip": device.ip,
                "mac": device.mac,
                "vendor": device.vendor,
                "risk_score": device.risk_score,
                "risk_level": device.risk_level,
                "trusted": device.trusted,
                "first_seen": device.first_seen,
                "last_seen": device.last_seen,
            }
            for device in devices
        ],
        "new_devices": [
            {
                "id": device.id,
                "hostname": device.hostname,
                "ip": device.ip,
                "mac": device.mac,
                "vendor": device.vendor,
                "risk_score": device.risk_score,
                "risk_level": device.risk_level,
            }
            for device in new_devices
        ],
    }


@router.get("/history")
def get_scan_history(db: Session = Depends(get_db)):
    scans = scan_repository.get_all(db)

    return [
        {
            "id": scan.id,
            "started_at": scan.started_at,
            "completed_at": scan.completed_at,
            "device_count": scan.device_count,
            "high_risk_count": scan.high_risk_count,
            "medium_risk_count": scan.medium_risk_count,
            "low_risk_count": scan.low_risk_count,
            "status": scan.status,
        }
        for scan in scans
    ]


@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = alert_repository.get_all(db)

    return [
        {
            "id": alert.id,
            "alert_type": alert.alert_type,
            "message": alert.message,
            "severity": alert.severity,
            "device_ip": alert.device_ip,
            "device_hostname": alert.device_hostname,
            "acknowledged": alert.acknowledged,
            "created_at": alert.created_at,
        }
        for alert in alerts
    ]