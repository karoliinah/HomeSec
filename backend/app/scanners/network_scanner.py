import nmap


class NetworkScanner:
    """
    Scans the local network for active devices using Nmap.
    """

    def scan_network(self, network: str = "192.168.1.0/24"):
        scanner = nmap.PortScanner()

        scanner.scan(
            hosts=network,
            arguments="-sn"
        )

        devices = []

        for host in scanner.all_hosts():
            device = {
                "hostname": scanner[host].hostname() or "Unknown",
                "ip": host,
                "status": scanner[host].state(),
            }

            # Get MAC address and vendor if available
            addresses = scanner[host].get("addresses", {})
            vendor = scanner[host].get("vendor", {})

            device["mac"] = addresses.get("mac", "Unknown")
            device["vendor"] = (
                list(vendor.values())[0]
                if vendor
                else "Unknown"
            )

            devices.append(device)

        return devices