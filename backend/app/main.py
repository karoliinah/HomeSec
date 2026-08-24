from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.database import models

from app.api.scans import router as scan_router
from app.api.database import router as database_router
from app.api.devices import router as devices_router
from app.api.ai import router as ai_router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="HomeSec API",
    description="AI-assisted home network security dashboard",
    version="0.1.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    return {
        "status": "healthy",
    }


# API routers
app.include_router(devices_router)
app.include_router(scan_router)
app.include_router(database_router)
app.include_router(ai_router)