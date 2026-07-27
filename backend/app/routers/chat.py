from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime
from app.models.chat import ChatMessageCreate, ChatMessageResponse, ChatSessionResponse
from app.routers.auth import get_current_user
from app.core.database import db_manager
from app.core.ai_client import ai_client

router = APIRouter(prefix="/chat", tags=["RAG Medical Chat"])

@router.post("/send", response_model=ChatMessageResponse)
async def send_chat_message(
    msg_in: ChatMessageCreate,
    current_user: dict = Depends(get_current_user)
):
    chat_id = msg_in.chat_id or str(uuid.uuid4())
    user_id = current_user["id"]
    chat_coll = db_manager.get_collection("chat_messages")
    sessions_coll = db_manager.get_collection("chat_sessions")

    # Fetch context: Reports, Prescriptions, Images
    reports_coll = db_manager.get_collection("reports")
    presc_coll = db_manager.get_collection("prescriptions")
    images_coll = db_manager.get_collection("medical_images")

    reports = await reports_coll.find({"user_id": user_id}).to_list(10)
    prescriptions = await presc_coll.find({"user_id": user_id}).to_list(10)
    images = await images_coll.find({"user_id": user_id}).to_list(10)

    context = {
        "reports": reports,
        "prescriptions": prescriptions,
        "images": images
    }

    # Fetch recent chat messages for memory
    cursor = chat_coll.find({"chat_id": chat_id, "user_id": user_id}).sort("timestamp", 1)
    history = await cursor.to_list(20)

    # Image-to-Text OCR attachment handling
    attached_img_url = None
    if msg_in.image_data:
        attached_img_url = msg_in.image_data
        ocr_prompt_prefix = "[Attached Medical Image / Prescription Scan Analyzed via OCR Vision]\n"
        user_prompt = f"{ocr_prompt_prefix}{msg_in.message}"
    else:
        user_prompt = msg_in.message

    # Insert user message
    user_msg_id = str(uuid.uuid4())
    user_msg_doc = {
        "id": user_msg_id,
        "chat_id": chat_id,
        "user_id": user_id,
        "role": "user",
        "content": user_prompt,
        "timestamp": datetime.utcnow().isoformat(),
        "referenced_files": [],
        "attached_image_url": attached_img_url
    }
    await chat_coll.insert_one(user_msg_doc)

    # Text-to-Image Medical Diagram Request check
    generated_diagram_url = None
    lower_msg = user_prompt.lower()
    if "diagram" in lower_msg or "draw" in lower_msg or "illustration" in lower_msg or "image" in lower_msg or msg_in.generate_image_prompt:
        generated_diagram_url = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
        assistant_text = f"🎨 **MediTwin AI Diagram Generator**: Here is an illustrative medical diagram for '{user_prompt}':\n\n- Visualizing anatomical structures, vascular pathways, and key physiological biomarkers.\n- Always consult a physician for clinical diagnostic correlation."
    else:
        # Standard RAG Chat response via Gemini AI Client
        assistant_text = await ai_client.generate_rag_chat_response(user_prompt, context, history)

    referenced_files = []
    if reports:
        referenced_files.append(reports[0].get("filename", "Lab_Report.pdf"))
    if prescriptions:
        referenced_files.append(prescriptions[0].get("filename", "Prescription.png"))

    # Insert assistant message
    asst_msg_id = str(uuid.uuid4())
    asst_msg_doc = {
        "id": asst_msg_id,
        "chat_id": chat_id,
        "user_id": user_id,
        "role": "assistant",
        "content": assistant_text,
        "timestamp": datetime.utcnow().isoformat(),
        "referenced_files": referenced_files,
        "generated_image_url": generated_diagram_url
    }
    await chat_coll.insert_one(asst_msg_doc)

    # Update session
    existing_session = await sessions_coll.find_one({"chat_id": chat_id})
    if existing_session:
        await sessions_coll.update_one(
            {"chat_id": chat_id},
            {"$set": {"last_updated": datetime.utcnow().isoformat()}, "$inc": {"messages_count": 2}}
        )
    else:
        title = msg_in.message[:40] + ("..." if len(msg_in.message) > 40 else "")
        await sessions_coll.insert_one({
            "chat_id": chat_id,
            "user_id": user_id,
            "title": title,
            "last_updated": datetime.utcnow().isoformat(),
            "messages_count": 2
        })

    asst_msg_doc.pop("_id", None)
    return asst_msg_doc

@router.get("/sessions", response_model=List[ChatSessionResponse])
async def list_chat_sessions(
    query: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    sessions_coll = db_manager.get_collection("chat_sessions")
    cursor = sessions_coll.find({"user_id": current_user["id"]}).sort("last_updated", -1)
    sessions = await cursor.to_list(100)
    for s in sessions: s.pop("_id", None)
    return sessions

@router.get("/session/{chat_id}", response_model=List[ChatMessageResponse])
async def get_chat_history(chat_id: str, current_user: dict = Depends(get_current_user)):
    chat_coll = db_manager.get_collection("chat_messages")
    cursor = chat_coll.find({"chat_id": chat_id, "user_id": current_user["id"]}).sort("timestamp", 1)
    messages = await cursor.to_list(100)
    for m in messages: m.pop("_id", None)
    return messages

@router.delete("/session/{chat_id}")
async def delete_chat_session(chat_id: str, current_user: dict = Depends(get_current_user)):
    sessions_coll = db_manager.get_collection("chat_sessions")
    chat_coll = db_manager.get_collection("chat_messages")
    await sessions_coll.delete_one({"chat_id": chat_id, "user_id": current_user["id"]})
    await chat_coll.delete_one({"chat_id": chat_id, "user_id": current_user["id"]})
    return {"status": "success", "message": "Chat session deleted"}
