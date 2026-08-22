from pydantic import BaseModel, Field


class Device(BaseModel):
    hostname: str
    ip: str
    status: str
    mac: str
    vendor: str

    risk_score: int = 0
    risk_level: str = "Low"

    open_ports: list[dict] = Field(default_factory=list)
    reasons: list[str] = Field(default_factory=list)