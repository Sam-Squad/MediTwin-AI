from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class LabFinding(BaseModel):
    parameter: str
    value: str
    normal_range: Optional[str] = "N/A"
    status: str = "Normal"  # Normal, Low, Elevated, Critical
    explanation: str

class MedicalReportResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    file_type: str
    upload_date: str
    report_type: str
    summary: str
    findings: List[LabFinding]
    key_abnormalities: List[str]
    questions_for_doctor: List[str]
    health_score_impact: int = 85
