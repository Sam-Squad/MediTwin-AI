from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List, Dict, Any
import uuid
from datetime import datetime
from app.routers.auth import get_current_user
from app.core.database import db_manager
from app.core.ai_client import ai_client

router = APIRouter(prefix="/medical-images", tags=["Medical Image Analysis"])

@router.post("/upload")
async def upload_medical_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    contents = await file.read()
    filename = file.filename or "chest_xray.png"

    analysis = await ai_client.analyze_medical_image(filename, contents)

    img_id = str(uuid.uuid4())
    doc = {
        "id": img_id,
        "user_id": current_user["id"],
        "filename": filename,
        "upload_date": datetime.utcnow().isoformat(),
        "image_type": analysis.get("image_type", "Diagnostic Scan"),
        "findings_summary": analysis.get("findings_summary", ""),
        "notable_observations": analysis.get("notable_observations", []),
        "questions_for_doctor": analysis.get("questions_for_doctor", []),
        "disclaimer": analysis.get("disclaimer", "Informational Vision AI overview only.")
    }

    images_coll = db_manager.get_collection("medical_images")
    await images_coll.insert_one(doc)

    # Timeline event
    timeline_coll = db_manager.get_collection("timeline")
    await timeline_coll.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "event_type": "image_analysis",
        "title": f"Medical Image Analyzed: {filename}",
        "description": doc["findings_summary"],
        "timestamp": datetime.utcnow().isoformat(),
        "ref_id": img_id
    })

    doc.pop("_id", None)
    return doc

@router.get("/")
async def list_medical_images(current_user: dict = Depends(get_current_user)):
    images_coll = db_manager.get_collection("medical_images")
    cursor = images_coll.find({"user_id": current_user["id"]}).sort("upload_date", -1)
    results = await cursor.to_list(100)

    if not results:
        sample_id = str(uuid.uuid4())
        sample = {
            "id": sample_id,
            "user_id": current_user["id"],
            "filename": "Chest_XRay_PA_View.png",
            "upload_date": datetime.utcnow().isoformat(),
            "image_type": "Chest X-Ray (PA View)",
            "findings_summary": "Clear lung fields bilaterally without acute focal airspace consolidation or pleural effusion. Heart size and vascular structures appear normal.",
            "notable_observations": [
                "Clear bilateral pulmonary fields",
                "Normal cardiothoracic index",
                "Unremarkable bony structures"
            ],
            "questions_for_doctor": [
                "Are there any subtle bronchial markings to monitor given my seasonal allergies?",
                "Does this comparison align with my previous X-ray from last year?"
            ],
            "disclaimer": "AI Vision overview intended for health education only. Consult a licensed radiologist for official diagnostic interpretation."
        }
        await images_coll.insert_one(sample)
        results = [sample]

    for r in results: r.pop("_id", None)
    return results
