from fastapi import APIRouter

from app.services.device_service import DeviceService

router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)

device_service = DeviceService()


@router.get("/")
async def get_devices():
    return device_service.get_devices()