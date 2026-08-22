from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.device_service import DeviceService

router = APIRouter(prefix="/devices", tags=["Devices"])

device_service = DeviceService()


@router.get("/")
def get_devices(db: Session = Depends(get_db)):
    devices = device_service.get_devices(db)

    return [
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
    ]