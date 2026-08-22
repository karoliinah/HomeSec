from sqlalchemy.orm import Session

from app.repositories.alert_repository import AlertRepository
from app.repositories.device_repository import DeviceRepository
from app.repositories.port_repository import PortRepository
from app.repositories.scan_repository import ScanRepository
from app.scanners.network_scanner import NetworkScanner
from app.scanners.port_scanner import PortScanner
from app.services.risk_engine import RiskEngine


class DeviceService:

    def __init__(self):
        self.scanner = NetworkScanner()
        self.port_scanner = PortScanner()

        self.risk_engine = RiskEngine()

        self.repository = DeviceRepository()
        self.port_repository = PortRepository()

        self.scan_repository = ScanRepository()
        self.alert_repository = AlertRepository()

    def scan_and_save(self, db: Session):

        # 1. Discover devices
        devices = self.scanner.scan_network()

        assessed_devices = []

        # 2. Scan ports and assess risk
        for device in devices:

            try:
                ports = self.port_scanner.scan_device(
                    device.ip
                )
            except Exception:
                ports = []

            device.open_ports = ports

            assessed_device = (
                self.risk_engine.assess_device(
                    device
                )
            )

            assessed_devices.append(
                (assessed_device, ports)
            )

        saved_devices = []
        new_devices = []

        # 3. Save devices and ports
        for device, ports in assessed_devices:

            existing_device = (
                self.repository.get_by_ip(
                    db,
                    device.ip,
                )
            )

            if existing_device:

                saved_device = self.repository.update(
                    db,
                    existing_device,
                    device,
                )

            else:

                saved_device = self.repository.create(
                    db,
                    device,
                )

                new_devices.append(saved_device)

                self.alert_repository.create(
                    db=db,
                    alert_type="new_device",
                    message=(
                        f"New device detected: "
                        f"{device.ip}"
                    ),
                    severity=device.risk_level,
                    device_ip=device.ip,
                    device_hostname=device.hostname,
                )

            saved_devices.append(saved_device)

            # 4. Save discovered ports
            for port in ports:

                existing_port = (
                    self.port_repository
                    .get_by_device_and_port(
                        db,
                        saved_device.id,
                        port["port"],
                        port.get(
                            "protocol",
                            "tcp",
                        ),
                    )
                )

                if existing_port:

                    self.port_repository.update(
                        db,
                        existing_port,
                        port.get(
                            "service",
                            "unknown",
                        ),
                    )

                else:

                    self.port_repository.create(
                        db=db,
                        device_id=saved_device.id,
                        port=port["port"],
                        protocol=port.get(
                            "protocol",
                            "tcp",
                        ),
                        service=port.get(
                            "service",
                            "unknown",
                        ),
                    )

        # 5. Calculate scan statistics
        high_risk_count = sum(
            1
            for device in saved_devices
            if device.risk_level == "High"
        )

        medium_risk_count = sum(
            1
            for device in saved_devices
            if device.risk_level == "Medium"
        )

        low_risk_count = sum(
            1
            for device in saved_devices
            if device.risk_level == "Low"
        )

        # 6. Save scan history
        self.scan_repository.create(
            db=db,
            device_count=len(saved_devices),
            high_risk_count=high_risk_count,
            medium_risk_count=medium_risk_count,
            low_risk_count=low_risk_count,
        )

        return {
            "devices": saved_devices,
            "new_devices": new_devices,
        }

    def get_devices(self, db: Session):
        return self.repository.get_all(db)