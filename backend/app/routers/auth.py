from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
import uuid
from app.models.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.core.database import db_manager

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    users_coll = db_manager.get_collection("users")
    user = await users_coll.find_one({"id": user_id})
    if not user:
        # Fallback check for email
        user = await users_coll.find_one({"email": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register", response_model=TokenResponse)
async def register(user_in: UserRegister):
    users_coll = db_manager.get_collection("users")
    existing = await users_coll.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    user_id = str(uuid.uuid4())
    hashed_pwd = get_password_hash(user_in.password)
    new_user = {
        "id": user_id,
        "name": user_in.name,
        "email": user_in.email.lower(),
        "password": hashed_pwd,
        "blood_group": user_in.blood_group or "O+",
        "allergies": user_in.allergies or [],
        "emergency_contact": user_in.emergency_contact or "+1 (555) 019-2834",
        "chronic_conditions": user_in.chronic_conditions or [],
        "role": "patient",
        "theme": "dark",
        "language": "en",
        "created_at": datetime.utcnow().isoformat()
    }
    await users_coll.insert_one(new_user)
    token = create_access_token(subject=user_id)
    
    user_resp = UserResponse(
        id=user_id,
        name=new_user["name"],
        email=new_user["email"],
        blood_group=new_user["blood_group"],
        allergies=new_user["allergies"],
        emergency_contact=new_user["emergency_contact"],
        chronic_conditions=new_user["chronic_conditions"],
        role=new_user["role"],
        theme=new_user["theme"],
        language=new_user["language"],
        created_at=new_user["created_at"]
    )
    return TokenResponse(access_token=token, user=user_resp)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    users_coll = db_manager.get_collection("users")
    user = await users_coll.find_one({"email": credentials.email.lower()})
    
    # Auto-seed demo user if logging in with demo account
    if not user and credentials.email.lower() in ["demo@meditwin.ai", "user@meditwin.ai", "admin@meditwin.ai"]:
        user_id = str(uuid.uuid4())
        user = {
            "id": user_id,
            "name": "Alex Morgan" if "admin" not in credentials.email else "Admin User",
            "email": credentials.email.lower(),
            "password": get_password_hash(credentials.password),
            "blood_group": "A+",
            "allergies": ["Penicillin", "Dust Mites"],
            "emergency_contact": "+1 (555) 948-2301",
            "chronic_conditions": ["Mild Asthma"],
            "role": "admin" if "admin" in credentials.email else "patient",
            "theme": "dark",
            "language": "en",
            "created_at": datetime.utcnow().isoformat()
        }
        await users_coll.insert_one(user)

    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    token = create_access_token(subject=user["id"])
    user_resp = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        blood_group=user.get("blood_group", "O+"),
        allergies=user.get("allergies", []),
        emergency_contact=user.get("emergency_contact", ""),
        chronic_conditions=user.get("chronic_conditions", []),
        role=user.get("role", "patient"),
        theme=user.get("theme", "dark"),
        language=user.get("language", "en"),
        created_at=user.get("created_at", datetime.utcnow().isoformat())
    )
    return TokenResponse(access_token=token, user=user_resp)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
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
        created_at=current_user.get("created_at", datetime.utcnow().isoformat())
    )
