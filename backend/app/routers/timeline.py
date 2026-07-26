from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.routers.auth import get_current_user
from app.core.database import db_manager

router = APIRouter(prefix="/timeline", tags=["Health Timeline"])

@router.get("/")
async def get_health_timeline(current_user: dict = Depends(get_current_user)):
    timeline_coll = db_manager.get_collection("timeline")
    cursor = timeline_coll.find({"user_id": current_user["id"]}).sort("timestamp", -1)
    events = await cursor.to_list(100)

    if not events:
        # Seed timeline items from initial demo events
        sample_events = [
            {
                "id": "t1",
                "user_id": current_user["id"],
                "event_type": "report_upload",
                "title": "Medical Report Analyzed: CBC_Metabolic_Panel_2026.pdf",
                "description": "Lab report analyzed. Mild low hemoglobin (11.8 g/dL) & glucose (108 mg/dL) identified.",
                "timestamp": "2026-07-25T10:15:00",
                "ref_id": "r1"
            },
            {
                "id": "t2",
                "user_id": current_user["id"],
                "event_type": "prescription_confirmed",
                "title": "Prescription Confirmed & Reminders Active",
                "description": "Prescription parsed for Amoxicillin & Metformin with morning & evening daily schedules.",
                "timestamp": "2026-07-24T14:30:00",
                "ref_id": "p1"
            },
            {
                "id": "t3",
                "user_id": current_user["id"],
                "event_type": "image_analysis",
                "title": "Medical Image Analyzed: Chest_XRay_PA_View.png",
                "description": "Chest X-Ray analyzed via Vision AI. Clear lung fields with normal cardiac contour.",
                "timestamp": "2026-07-23T09:00:00",
                "ref_id": "i1"
            },
            {
                "id": "t4",
                "user_id": current_user["id"],
                "event_type": "chat_interaction",
                "title": "AI RAG Consultation Session",
                "description": "Asked MediTwin AI about hemoglobin lab range and doctor preparation questions.",
                "timestamp": "2026-07-22T18:45:00",
                "ref_id": "c1"
            }
        ]
        for e in sample_events:
            await timeline_coll.insert_one(e)
        events = sample_events

    return events
