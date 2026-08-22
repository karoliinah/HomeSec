import nmap


class PortScanner:
    """
    Scans a device for commonly used TCP ports.
    """

    COMMON_PORTS = [
        21,    # FTP
        22,    # SSH
        23,    # Telnet
        25,    # SMTP
        53,    # DNS
        80,    # HTTP
        110,   # POP3
        139,   # NetBIOS
        143,   # IMAP
        443,   # HTTPS
        445,   # SMB
        3389,  # RDP
    ]

    def scan_device(self, ip: str):
        scanner = nmap.PortScanner()

        ports = ",".join(
            str(port)
            for port in self.COMMON_PORTS
        )

        scanner.scan(
            hosts=ip,
            arguments=f"-sT -p {ports}"
        )

        open_ports = []

        if ip not in scanner.all_hosts():
            return open_ports

        tcp_data = scanner[ip].get("tcp", {})

        for port, data in tcp_data.items():
            if data.get("state") == "open":
                open_ports.append(
                    {
                        "port": port,
                        "protocol": "tcp",
                        "service": data.get("name", "unknown"),
                    }
                )

        return open_ports