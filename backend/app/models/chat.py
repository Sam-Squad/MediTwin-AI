from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ChatMessageCreate(BaseModel):
    message: str
    chat_id: Optional[str] = None
    image_data: Optional[str] = None # Base64 or URL for Image-to-Text OCR
    generate_image_prompt: Optional[str] = None # Text-to-Image trigger

class ChatMessageResponse(BaseModel):
    id: str
    chat_id: str
    user_id: str
    role: str # user, assistant
    content: str
    timestamp: str
    referenced_files: Optional[List[str]] = []
    attached_image_url: Optional[str] = None
    generated_image_url: Optional[str] = None
    audio_transcript: Optional[str] = None

class ChatSessionResponse(BaseModel):
    chat_id: str
    user_id: str
    title: str
    last_updated: str
    messages_count: int
