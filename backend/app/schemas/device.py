from pydantic import BaseModel


class Device(BaseModel):
    hostname: str
    ip: str
    status: str
    mac: str
    vendor: str
    risk_score: int = 0
    risk_level: str = "Low"
    reasons: list[str] = []