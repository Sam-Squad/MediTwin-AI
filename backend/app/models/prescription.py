from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class MedicineItem(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str
    instructions: Optional[str] = ""
    warnings: Optional[str] = ""
    food_interactions: Optional[str] = ""
    side_effects: List[str] = []

class PrescriptionConfirmRequest(BaseModel):
    medicines: List[MedicineItem]
    doctor_notes: Optional[str] = ""

class PrescriptionResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    upload_date: str
    medicines: List[MedicineItem]
    doctor_notes: Optional[str] = ""
    confidence_score: float = 0.90
    confirmed_by_user: bool = False
