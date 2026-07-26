from pydantic import BaseModel
from typing import Optional, List

class MedicineReminderCreate(BaseModel):
    medicine_name: str
    dosage: str
    schedule: List[str]  # Morning, Afternoon, Night
    time_slots: List[str]  # e.g. ["08:00", "20:00"]
    instructions: Optional[str] = ""

class MedicineReminderResponse(BaseModel):
    id: str
    user_id: str
    medicine_name: str
    dosage: str
    schedule: List[str]
    time_slots: List[str]
    instructions: str
    status_today: Optional[str] = "Pending" # Taken, Skipped, Pending
    adherence_rate: int = 100
    created_at: str

class AdherenceUpdate(BaseModel):
    status: str # Taken, Skipped, Pending
