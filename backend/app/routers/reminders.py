from fastapi import APIRouter, Depends, HTTPException
from typing import List
import uuid
from datetime import datetime
from app.models.reminder import MedicineReminderCreate, MedicineReminderResponse, AdherenceUpdate
from app.routers.auth import get_current_user
from app.core.database import db_manager

router = APIRouter(prefix="/reminders", tags=["Medicine Reminders"])

@router.post("/", response_model=MedicineReminderResponse)
async def create_reminder(
    reminder_in: MedicineReminderCreate,
    current_user: dict = Depends(get_current_user)
):
    rem_id = str(uuid.uuid4())
    doc = {
        "id": rem_id,
        "user_id": current_user["id"],
        "medicine_name": reminder_in.medicine_name,
        "dosage": reminder_in.dosage,
        "schedule": reminder_in.schedule,
        "time_slots": reminder_in.time_slots,
        "instructions": reminder_in.instructions or "Take with water",
        "status_today": "Pending",
        "adherence_rate": 100,
        "created_at": datetime.utcnow().isoformat()
    }
    reminders_coll = db_manager.get_collection("reminders")
    await reminders_coll.insert_one(doc)
    return doc

@router.get("/", response_model=List[MedicineReminderResponse])
async def list_reminders(current_user: dict = Depends(get_current_user)):
    reminders_coll = db_manager.get_collection("reminders")
    cursor = reminders_coll.find({"user_id": current_user["id"]}).sort("created_at", -1)
    results = await cursor.to_list(100)
    
    if not results:
        # Seed initial sample reminders
        sample_reminders = [
            {
                "id": str(uuid.uuid4()),
                "user_id": current_user["id"],
                "medicine_name": "Amoxicillin",
                "dosage": "500 mg",
                "schedule": ["Morning", "Night"],
                "time_slots": ["08:00 AM", "08:00 PM"],
                "instructions": "Take after breakfast with plenty of water",
                "status_today": "Taken",
                "adherence_rate": 100,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "user_id": current_user["id"],
                "medicine_name": "Metformin",
                "dosage": "500 mg",
                "schedule": ["Morning"],
                "time_slots": ["08:30 AM"],
                "instructions": "Take with morning breakfast",
                "status_today": "Pending",
                "adherence_rate": 90,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "user_id": current_user["id"],
                "medicine_name": "Vitamin D3",
                "dosage": "1000 IU",
                "schedule": ["Afternoon"],
                "time_slots": ["01:00 PM"],
                "instructions": "Take with lunch meal",
                "status_today": "Pending",
                "adherence_rate": 95,
                "created_at": datetime.utcnow().isoformat()
            }
        ]
        for r in sample_reminders:
            await reminders_coll.insert_one(r)
        results = sample_reminders

    return results

@router.patch("/{reminder_id}/status", response_model=MedicineReminderResponse)
async def update_reminder_status(
    reminder_id: str,
    update_data: AdherenceUpdate,
    current_user: dict = Depends(get_current_user)
):
    reminders_coll = db_manager.get_collection("reminders")
    rem = await reminders_coll.find_one({"id": reminder_id, "user_id": current_user["id"]})
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")

    new_status = update_data.status
    adherence = rem.get("adherence_rate", 90)
    if new_status == "Taken":
        adherence = min(100, adherence + 5)
    elif new_status == "Skipped":
        adherence = max(0, adherence - 10)

    await reminders_coll.update_one(
        {"id": reminder_id},
        {"$set": {"status_today": new_status, "adherence_rate": adherence}}
    )
    
    # Record timeline action
    timeline_coll = db_manager.get_collection("timeline")
    await timeline_coll.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "event_type": "medicine_adherence",
        "title": f"Medicine Marked: {rem.get('medicine_name')} ({new_status})",
        "description": f"Status updated to {new_status}. Current adherence rate: {adherence}%.",
        "timestamp": datetime.utcnow().isoformat(),
        "ref_id": reminder_id
    })

    updated = await reminders_coll.find_one({"id": reminder_id})
    return updated
