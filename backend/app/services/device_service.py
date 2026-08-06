from app.scanners.network_scanner import NetworkScanner


class DeviceService:
    def __init__(self):
        self.scanner = NetworkScanner()

    def get_devices(self):
        return self.scanner.scan_network()