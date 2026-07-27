from fastapi import APIRouter

router = APIRouter()

@router.get("/voice/status")
async def voice_status():
    """Placeholder endpoint for voice assistant status."""
    return {"status": "voice router placeholder active"}
