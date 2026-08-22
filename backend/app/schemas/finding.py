from pydantic import BaseModel


class SecurityFinding(BaseModel):
    title: str
    description: str
    severity: str
    score: int
    recommendation: str