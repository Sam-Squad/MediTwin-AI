from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    blood_group: Optional[str] = "O+"
    allergies: Optional[List[str]] = []
    emergency_contact: Optional[str] = ""
    chronic_conditions: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = None
    emergency_contact: Optional[str] = None
    chronic_conditions: Optional[List[str]] = None
    theme: Optional[str] = "dark"
    language: Optional[str] = "en"

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    blood_group: Optional[str] = "O+"
    allergies: Optional[List[str]] = []
    emergency_contact: Optional[str] = ""
    chronic_conditions: Optional[List[str]] = []
    role: str = "patient"
    theme: str = "dark"
    language: str = "en"
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
