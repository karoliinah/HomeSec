from app.schemas.device import Device


class RiskEngine:
    """
    Calculates a deterministic risk score for a device.
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

        # Router
        if "router" in device.hostname.lower():
            score -= 10
            reasons.append("Recognized network router")

        score = max(score, 0)

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