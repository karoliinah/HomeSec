from sqlalchemy.orm import Session

from app.database.models import AIAnalysisModel


class AIRepository:

    def get_latest_by_device(
        self,
        db: Session,
        device_id: int,
    ):
        return (
            db.query(AIAnalysisModel)
            .filter(
                AIAnalysisModel.device_id == device_id
            )
            .order_by(
                AIAnalysisModel.created_at.desc()
            )
            .first()
        )

    def create(
        self,
        db: Session,
        device_id: int,
        analysis: str,
        model: str = "gemini-3.6-flash",
    ):
        ai_analysis = AIAnalysisModel(
            device_id=device_id,
            analysis=analysis,
            model=model,
        )

        db.add(ai_analysis)
        db.commit()
        db.refresh(ai_analysis)

        return ai_analysis