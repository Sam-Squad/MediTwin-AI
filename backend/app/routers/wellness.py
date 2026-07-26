from fastapi import APIRouter, Depends, Body
from typing import Dict, Any
import uuid
from datetime import datetime
from app.routers.auth import get_current_user
from app.core.database import db_manager

router = APIRouter(prefix="/wellness", tags=["AI Wellness Coach"])

@router.get("/")
async def get_wellness_goals(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    wellness_coll = db_manager.get_collection("wellness")
    data = await wellness_coll.find_one({"user_id": current_user["id"]})

    if not data:
        data = {
            "id": str(uuid.uuid4()),
            "user_id": current_user["id"],
            "water_intake_ml": 1750,
            "water_goal_ml": 2500,
            "steps_count": 6420,
            "steps_goal": 8000,
            "sleep_hours": 7.2,
            "sleep_goal": 8.0,
            "daily_tips": [
                "Drink 250ml water upon waking to kickstart hydration.",
                "Take a short 10-minute walk after meals to assist glucose management.",
                "Maintain consistent sleep hygiene by dimming screens 45 minutes before sleep."
            ],
            "updated_at": datetime.utcnow().isoformat()
        }
        await wellness_coll.insert_one(data)

    return data

@router.put("/update")
async def update_wellness_progress(
    water_ml: int = Body(default=None),
    steps: int = Body(default=None),
    sleep_hrs: float = Body(default=None),
    current_user: dict = Depends(get_current_user)
):
    wellness_coll = db_manager.get_collection("wellness")
    data = await wellness_coll.find_one({"user_id": current_user["id"]})

    update_fields = {"updated_at": datetime.utcnow().isoformat()}
    if water_ml is not None:
        update_fields["water_intake_ml"] = water_ml
    if steps is not None:
        update_fields["steps_count"] = steps
    if sleep_hrs is not None:
        update_fields["sleep_hours"] = sleep_hrs

    if data:
        await wellness_coll.update_one({"user_id": current_user["id"]}, {"$set": update_fields})
    else:
        update_fields["user_id"] = current_user["id"]
        update_fields["water_goal_ml"] = 2500
        update_fields["steps_goal"] = 8000
        update_fields["sleep_goal"] = 8.0
        await wellness_coll.insert_one(update_fields)

    updated = await wellness_coll.find_one({"user_id": current_user["id"]})
    return updated
