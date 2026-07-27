from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import Response
from typing import List
import uuid
from datetime import datetime
from app.models.report import MedicalReportResponse
from app.routers.auth import get_current_user
from app.core.database import db_manager
from app.core.ai_client import ai_client
from app.services.pdf_service import extract_text_from_pdf_bytes, generate_doctor_visit_pdf

router = APIRouter(prefix="/reports", tags=["Medical Reports"])

@router.post("/upload", response_model=MedicalReportResponse)
async def upload_medical_report(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    contents = await file.read()
    filename = file.filename or "medical_report.pdf"
    
    # Extract text from PDF or image string
    if filename.lower().endswith(".pdf"):
        extracted_text = extract_text_from_pdf_bytes(contents)
    else:
        try:
            extracted_text = contents.decode("utf-8", errors="ignore")
        except Exception:
            extracted_text = "Sample Medical Report text extracted from image."

    # Gemini 2.5 AI Analysis
    ai_result = await ai_client.analyze_medical_report(extracted_text, filename)
    
    report_id = str(uuid.uuid4())
    report_doc = {
        "id": report_id,
        "user_id": current_user["id"],
        "filename": filename,
        "file_type": file.content_type or "application/pdf",
        "upload_date": datetime.utcnow().isoformat(),
        "report_type": ai_result.get("report_type", "Lab Report"),
        "summary": ai_result.get("summary", "Medical lab analysis complete."),
        "findings": ai_result.get("findings", []),
        "key_abnormalities": ai_result.get("key_abnormalities", []),
        "questions_for_doctor": ai_result.get("questions_for_doctor", []),
        "health_score_impact": ai_result.get("health_score_impact", 85)
    }

    reports_coll = db_manager.get_collection("reports")
    await reports_coll.insert_one(report_doc)

    # Record Timeline Event
    timeline_coll = db_manager.get_collection("timeline")
    await timeline_coll.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "event_type": "report_upload",
        "title": f"Medical Report Analyzed: {filename}",
        "description": report_doc["summary"],
        "timestamp": datetime.utcnow().isoformat(),
        "ref_id": report_id
    })

    report_doc.pop("_id", None)
    return report_doc

@router.get("/", response_model=List[MedicalReportResponse])
async def list_user_reports(current_user: dict = Depends(get_current_user)):
    reports_coll = db_manager.get_collection("reports")
    cursor = reports_coll.find({"user_id": current_user["id"]}).sort("upload_date", -1)
    results = await cursor.to_list(100)
    
    if not results:
        # Seed initial sample report for instant preview experience
        sample_id = str(uuid.uuid4())
        sample = {
            "id": sample_id,
            "user_id": current_user["id"],
            "filename": "CBC_Metabolic_Panel_2026.pdf",
            "file_type": "application/pdf",
            "upload_date": datetime.utcnow().isoformat(),
            "report_type": "Complete Blood Count & Metabolic Panel",
            "summary": "Your CBC and metabolic panel show overall good health markers with mild hemoglobin elevation and optimal kidney function.",
            "findings": [
                {
                    "parameter": "Hemoglobin (Hb)",
                    "value": "11.8 g/dL",
                    "normal_range": "13.0 - 17.0 g/dL",
                    "status": "Low",
                    "explanation": "Hemoglobin is slightly lower than standard reference range, indicating mild potential anemia."
                },
                {
                    "parameter": "Fasting Plasma Glucose",
                    "value": "108 mg/dL",
                    "normal_range": "70 - 99 mg/dL",
                    "status": "Elevated",
                    "explanation": "Fasting glucose is borderline elevated; dietary monitoring is recommended."
                },
                {
                    "parameter": "White Blood Cells (WBC)",
                    "value": "6,800 /mcL",
                    "normal_range": "4,500 - 11,000 /mcL",
                    "status": "Normal",
                    "explanation": "WBC count is within standard healthy bounds."
                }
            ],
            "key_abnormalities": ["Hemoglobin 11.8 g/dL (Mildly Low)", "Fasting Glucose 108 mg/dL (Slightly High)"],
            "questions_for_doctor": [
                "Should I increase dietary iron intake for my hemoglobin level?",
                "When should I repeat my fasting glucose test?"
            ],
            "health_score_impact": 84
        }
        await reports_coll.insert_one(sample)
        results = [sample]

    for r in results: r.pop("_id", None)
    return results

@router.get("/{report_id}/download-pdf")
async def download_report_pdf(report_id: str, current_user: dict = Depends(get_current_user)):
    reports_coll = db_manager.get_collection("reports")
    report = await reports_coll.find_one({"id": report_id, "user_id": current_user["id"]})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    pdf_bytes = generate_doctor_visit_pdf(
        patient_name=current_user.get("name", "Patient"),
        symptoms=[],
        medicines=[],
        lab_summary=f"Report: {report.get('filename')} | {report.get('summary')}",
        questions=report.get("questions_for_doctor", [])
    )
    return Response(content=pdf_bytes, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename=AI_Analysis_{report.get('filename', 'report')}.pdf"
    })
