from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.ai_service import AIService

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)

ai_service = AIService()


@router.get("/analyze/{device_id}")
def analyze_device(
    device_id: int,
    db: Session = Depends(get_db),
):
    try:
        result = ai_service.analyze_device(
            db=db,
            device_id=device_id,
        )

        return {
            "device_id": result.device_id,
            "analysis": result.analysis,
            "model": result.model,
            "created_at": result.created_at,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )