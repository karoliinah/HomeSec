import os

from google import genai
from sqlalchemy.orm import Session

from app.repositories.ai_repository import AIRepository
from app.repositories.device_repository import DeviceRepository


class AIService:

    def __init__(self):
        self.repository = AIRepository()
        self.device_repository = DeviceRepository()

        self.model = "gemini-3.5-flash"

        api_key = os.getenv("GEMINI_API_KEY")

        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None

    def analyze_device(
        self,
        db: Session,
        device_id: int,
    ):
        # First check PostgreSQL.
        # If an analysis already exists, DO NOT call Gemini.
        existing_analysis = (
            self.repository.get_latest_by_device(
                db,
                device_id,
            )
        )

        if existing_analysis:
            return existing_analysis

        # Find device
        device = self.device_repository.get_by_id(
            db,
            device_id,
        )

        if not device:
            raise ValueError(
                f"Device {device_id} not found"
            )

        # Gemini is only needed if no cached
        # analysis exists.
        if self.client is None:
            raise ValueError(
                "GEMINI_API_KEY is not configured"
            )

        prompt = f"""
You are a cybersecurity analyst specializing
in home network security.

Analyze this device:

Hostname: {device.hostname}
IP address: {device.ip}
MAC address: {device.mac}
Vendor: {device.vendor}
Risk score: {device.risk_score}
Risk level: {device.risk_level}

Provide a concise security assessment.

Use exactly this structure:

SUMMARY:
Explain what the device appears to be
and its overall security situation.

RISKS:
List the most important security risks.

RECOMMENDATIONS:
Give practical recommendations for
improving the security of this device.

Focus on realistic home network security.
Do not invent vulnerabilities.
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

        analysis_text = response.text

        if not analysis_text:
            raise ValueError(
                "Gemini returned an empty response"
            )

        return self.repository.create(
            db=db,
            device_id=device_id,
            analysis=analysis_text,
            model=self.model,
        )