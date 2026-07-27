import os
import sys
import logging

# Ensure root backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import db_manager
from app.routers import (
    auth, users, reports, prescriptions, reminders,
    chat, medical_images, timeline, health_summary,
    doctor_copilot, wellness, emergency, admin, heart_rate, voice
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("meditwin.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="MediTwin AI — Production-Grade AI Healthcare Companion Backend APIs",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(status_code=500, content={"error": "Internal server error"})

# CORS Configuration for React (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing MediTwin AI database connection...")
    await db_manager.connect(settings.MONGODB_URL, settings.DATABASE_NAME)
    logger.info("MediTwin AI backend service ready!")

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "docs": "/docs",
        "disclaimer": "MediTwin AI is designed strictly for informational purposes and does not replace medical advice."
    }

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(prescriptions.router, prefix=settings.API_V1_STR)
app.include_router(reminders.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(medical_images.router, prefix=settings.API_V1_STR)
app.include_router(timeline.router, prefix=settings.API_V1_STR)
app.include_router(health_summary.router, prefix=settings.API_V1_STR)
app.include_router(doctor_copilot.router, prefix=settings.API_V1_STR)
app.include_router(wellness.router, prefix=settings.API_V1_STR)
app.include_router(emergency.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(heart_rate.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
