from fastapi import FastAPI

from app.api.devices import router as devices_router

app = FastAPI(
    title="HomeSec API",
    description="AI-assisted home network security dashboard",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {
        "application": "HomeSec",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


app.include_router(devices_router)