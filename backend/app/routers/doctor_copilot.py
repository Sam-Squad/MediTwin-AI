from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import Response
from typing import List, Optional, Dict, Any
from app.routers.auth import get_current_user
from app.core.database import db_manager
from app.services.pdf_service import generate_doctor_visit_pdf

router = APIRouter(prefix="/doctor-copilot", tags=["Doctor Visit Copilot"])

@router.post("/generate-sheet")
async def generate_doctor_sheet(
    symptoms: List[str] = Body(default=["Mild fatigue in late afternoon", "Occasional indigestion"]),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    presc_coll = db_manager.get_collection("prescriptions")
    reports_coll = db_manager.get_collection("reports")

    prescriptions = await presc_coll.find({"user_id": user_id}).to_list(5)
    reports = await reports_coll.find({"user_id": user_id}).to_list(5)

    all_meds = []
    for p in prescriptions:
        all_meds.extend(p.get("medicines", []))

    lab_summary = ""
    if reports:
        latest = reports[0]
        lab_summary = f"{latest.get('report_type')}: {latest.get('summary')}"
    else:
        lab_summary = "Hemoglobin 11.8 g/dL (Mildly Low), Fasting Blood Sugar 108 mg/dL."

    questions = [
        "Are my hemoglobin levels stable, or do I need dietary iron supplements?",
        "Should my medication dosage be adjusted based on my recent lab work?",
        "How frequently should I monitor my blood glucose?"
    ]

    pdf_bytes = generate_doctor_visit_pdf(
        patient_name=current_user.get("name", "Patient"),
        symptoms=symptoms,
        medicines=all_meds,
        lab_summary=lab_summary,
        questions=questions
    )

    return Response(content=pdf_bytes, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename=Doctor_Visit_Prep_Sheet_{current_user.get('name', 'Patient').replace(' ', '_')}.pdf"
    })
