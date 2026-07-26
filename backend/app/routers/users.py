from fastapi import APIRouter, Depends, HTTPException
from app.models.user import UserProfileUpdate, UserResponse
from app.routers.auth import get_current_user
from app.core.database import db_manager

router = APIRouter(prefix="/users", tags=["Users Profile"])

@router.put("/profile", response_model=UserResponse)
async def update_profile(profile_data: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    users_coll = db_manager.get_collection("users")
    update_dict = {k: v for k, v in profile_data.dict().items() if v is not None}
    
    if update_dict:
        await users_coll.update_one({"id": current_user["id"]}, {"$set": update_dict})
        updated = await users_coll.find_one({"id": current_user["id"]})
        current_user = updated

    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        blood_group=current_user.get("blood_group", "O+"),
        allergies=current_user.get("allergies", []),
        emergency_contact=current_user.get("emergency_contact", ""),
        chronic_conditions=current_user.get("chronic_conditions", []),
        role=current_user.get("role", "patient"),
        theme=current_user.get("theme", "dark"),
        language=current_user.get("language", "en"),
        created_at=current_user.get("created_at", "")
    )
