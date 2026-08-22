from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.device_service import DeviceService
from app.repositories.port_repository import PortRepository


router = APIRouter(
    prefix="/devices",
    tags=["Devices"],
)

device_service = DeviceService()
port_repository = PortRepository()


@router.get("/")
def get_devices(
    db: Session = Depends(get_db),
):
    devices = device_service.get_devices(db)

    result = []

    for device in devices:

        ports = port_repository.get_by_device(
            db,
            device.id,
        )

        result.append(
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

                "open_ports": [
                    {
                        "id": port.id,
                        "port": port.port,
                        "protocol": port.protocol,
                        "service": port.service,
                        "state": port.state,
                        "first_seen": port.first_seen,
                        "last_seen": port.last_seen,
                    }
                    for port in ports
                    if port.state == "open"
                ],
            }
        )

    return result