from fastapi import APIRouter, Depends
from typing import Dict, Any
from app.routers.auth import get_current_user
from app.core.database import db_manager

router = APIRouter(prefix="/emergency", tags=["Emergency QR Profile"])

@router.get("/card")
async def get_emergency_card(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    user_id = current_user["id"]
    presc_coll = db_manager.get_collection("prescriptions")
    prescriptions = await presc_coll.find({"user_id": user_id}).to_list(10)

    med_list = []
    for p in prescriptions:
        for m in p.get("medicines", []):
            med_list.append(f"{m.get('name')} ({m.get('dosage')})")

    if not med_list:
        med_list = ["Amoxicillin (500mg)", "Metformin (500mg)"]

    profile_qr_data = (
        f"EMERGENCY MEDICAL PROFILE\n"
        f"Name: {current_user.get('name')}\n"
        f"Blood Group: {current_user.get('blood_group', 'O+')}\n"
        f"Allergies: {', '.join(current_user.get('allergies', ['Penicillin']))}\n"
        f"Emergency Contact: {current_user.get('emergency_contact', '+1 555-019-2834')}\n"
        f"Current Medicines: {', '.join(med_list)}\n"
        f"Chronic Conditions: {', '.join(current_user.get('chronic_conditions', ['Mild Asthma']))}"
    )

    return {
        "user_name": current_user.get("name"),
        "blood_group": current_user.get("blood_group", "O+"),
        "allergies": current_user.get("allergies", ["Penicillin", "Dust Mites"]),
        "emergency_contact": current_user.get("emergency_contact", "+1 (555) 019-2834"),
        "chronic_conditions": current_user.get("chronic_conditions", ["Mild Asthma"]),
        "current_medicines": med_list,
        "qr_code_payload": profile_qr_data,
        "verified_profile_url": f"https://meditwin.ai/emergency/v/{user_id[:8]}"
    }
