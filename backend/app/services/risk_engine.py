from app.schemas.device import Device
from app.schemas.finding import SecurityFinding


class RiskEngine:
    """
    Calculates a deterministic security risk score
    and generates security findings for a device.
    """

    def assess_device(self, device: Device) -> Device:
        score = 0
        reasons = []

        # Unknown vendor
        if device.vendor == "Unknown":
            score += 20
            reasons.append("Unknown device vendor")

        # Unknown hostname
        if device.hostname == "Unknown":
            score += 10
            reasons.append("Hostname could not be identified")

        # Recognized router
        if "router" in device.hostname.lower():
            score -= 10
            reasons.append("Recognized network router")

        # Analyze open ports
        for port_info in device.open_ports:
            port = int(port_info["port"])

            if port == 23:
                score += 40
                reasons.append(
                    "Telnet service exposed"
                )

            elif port == 21:
                score += 20
                reasons.append(
                    "FTP service exposed"
                )

            elif port == 3389:
                score += 20
                reasons.append(
                    "RDP service exposed"
                )

            elif port == 445:
                score += 15
                reasons.append(
                    "SMB service exposed"
                )

            elif port == 139:
                score += 15
                reasons.append(
                    "NetBIOS service exposed"
                )

            elif port == 22:
                score += 5
                reasons.append(
                    "SSH service exposed"
                )

            elif port == 80:
                score += 10
                reasons.append(
                    "Unencrypted HTTP service exposed"
                )

            elif port == 8080:
                score += 10
                reasons.append(
                    "Alternative HTTP service exposed"
                )

            elif port == 5900:
                score += 20
                reasons.append(
                    "VNC remote access service exposed"
                )

        # Prevent negative scores
        score = max(score, 0)

        # Determine risk level
        if score >= 60:
            level = "High"
        elif score >= 30:
            level = "Medium"
        else:
            level = "Low"

        device.risk_score = score
        device.risk_level = level
        device.reasons = reasons

        return device