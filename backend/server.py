# VideoFlow FastAPI Backend with MongoDB and JWT
from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta, timezone
from typing import List, Optional
import os
import logging
import re
from pathlib import Path
from dotenv import load_dotenv
from bson import ObjectId

# Import local modules
from database_mongo import db, users_collection, videos_collection, create_indexes
from models_mongo import UserDB, VideoDB
from schemas import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    VideoCreate, VideoUpdate, VideoResponse,
    BulkUpdateRequest, BulkDeleteRequest,
    ImportRequest, ImportResponse, StatsResponse
)
from auth_mongo import (
    get_password_hash, verify_password, create_access_token, get_current_user
)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create FastAPI app
app = FastAPI(title="VideoFlow API", version="1.0.0")

# Create API router with prefix
api_router = APIRouter(prefix="/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database initialization
@app.on_event("startup")
async def startup():
    """Initialize database on startup"""
    await create_indexes()
    logger.info("MongoDB initialized successfully")

# Helper function to convert ObjectId to string
def video_helper(video) -> dict:
    return {
        "id": str(video["_id"]),
        "titulo": video["titulo"],
        "descricao": video.get("descricao"),
        "roteiro": video.get("roteiro"),
        "url": video.get("url"),
        "status": video["status"],
        "data_criacao": video["data_criacao"],
        "data_conclusao": video.get("data_conclusao"),
        "user_id": str(video["user_id"])
    }

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"],
        "created_at": user["created_at"]
    }

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if email already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_user = await users_collection.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = {
        "email": user_data.email,
        "username": user_data.username,
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await users_collection.insert_one(new_user)
    new_user["_id"] = result.inserted_id
    
    # Create access token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(**user_helper(new_user))
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    """Login user and return JWT token"""
    # Find user by email
    user = await users_collection.find_one({"email": user_data.email})
    
    if not user or not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(**user_helper(user))
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return UserResponse(**user_helper(current_user))

# ==================== VIDEO ROUTES ====================

@api_router.get("/videos/stats", response_model=StatsResponse)
async def get_stats(current_user: dict = Depends(get_current_user)):
    """Get user's video statistics"""
    user_id = str(current_user["_id"])
    
    # Get total count
    total_videos = await videos_collection.count_documents({"user_id": user_id})
    
    # Get count by status
    videos_concluidos = await videos_collection.count_documents({"user_id": user_id, "status": "concluido"})
    videos_planejado = await videos_collection.count_documents({"user_id": user_id, "status": "planejado"})
    videos_em_producao = await videos_collection.count_documents({"user_id": user_id, "status": "em-producao"})
    videos_em_edicao = await videos_collection.count_documents({"user_id": user_id, "status": "em-edicao"})
    
    # Calculate nivel (level) based on completed videos
    nivel = min(videos_concluidos // 5 + 1, 99)
    
    return StatsResponse(
        total_videos=total_videos,
        videos_concluidos=videos_concluidos,
        videos_planejado=videos_planejado,
        videos_em_producao=videos_em_producao,
        videos_em_edicao=videos_em_edicao,
        nivel=nivel
    )

@api_router.get("/videos", response_model=List[VideoResponse])
async def get_videos(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    time_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 12,
    current_user: dict = Depends(get_current_user)
):
    """Get user's videos with filters and pagination"""
    user_id = str(current_user["_id"])
    query = {"user_id": user_id}
    
    # Apply search filter
    if search:
        query["$or"] = [
            {"titulo": {"$regex": search, "$options": "i"}},
            {"descricao": {"$regex": search, "$options": "i"}},
            {"roteiro": {"$regex": search, "$options": "i"}}
        ]
    
    # Apply status filter
    if status_filter:
        query["status"] = status_filter
    
    # Apply time filter
    if time_filter:
        now = datetime.now(timezone.utc)
        time_filters = {
            "1h": now - timedelta(hours=1),
            "4h": now - timedelta(hours=4),
            "6h": now - timedelta(hours=6),
            "12h": now - timedelta(hours=12),
            "1d": now - timedelta(days=1),
            "3d": now - timedelta(days=3),
            "1s": now - timedelta(weeks=1),
            "1m": now - timedelta(days=30),
            "3m": now - timedelta(days=90),
            "6m": now - timedelta(days=180),
            "1a": now - timedelta(days=365),
        }
        if time_filter in time_filters:
            query["data_criacao"] = {"$gte": time_filters[time_filter]}
    
    # Get videos with pagination
    cursor = videos_collection.find(query).sort("data_criacao", -1).skip(skip).limit(limit)
    videos = await cursor.to_list(length=limit)
    
    return [VideoResponse(**video_helper(video)) for video in videos]

@api_router.get("/videos/count")
async def get_videos_count(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    time_filter: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get total count of videos matching filters"""
    user_id = str(current_user["_id"])
    query = {"user_id": user_id}
    
    # Apply search filter
    if search:
        query["$or"] = [
            {"titulo": {"$regex": search, "$options": "i"}},
            {"descricao": {"$regex": search, "$options": "i"}},
            {"roteiro": {"$regex": search, "$options": "i"}}
        ]
    
    # Apply status filter
    if status_filter:
        query["status"] = status_filter
    
    # Apply time filter
    if time_filter:
        now = datetime.now(timezone.utc)
        time_filters = {
            "1h": now - timedelta(hours=1),
            "4h": now - timedelta(hours=4),
            "6h": now - timedelta(hours=6),
            "12h": now - timedelta(hours=12),
            "1d": now - timedelta(days=1),
            "3d": now - timedelta(days=3),
            "1s": now - timedelta(weeks=1),
            "1m": now - timedelta(days=30),
            "3m": now - timedelta(days=90),
            "6m": now - timedelta(days=180),
            "1a": now - timedelta(days=365),
        }
        if time_filter in time_filters:
            query["data_criacao"] = {"$gte": time_filters[time_filter]}
    
    count = await videos_collection.count_documents(query)
    return {"count": count}

@api_router.post("/videos", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
async def create_video(
    video_data: VideoCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new video"""
    user_id = str(current_user["_id"])
    
    new_video = {
        "titulo": video_data.titulo,
        "descricao": video_data.descricao,
        "roteiro": video_data.roteiro,
        "url": video_data.url,
        "status": video_data.status,
        "data_criacao": datetime.now(timezone.utc),
        "data_conclusao": datetime.now(timezone.utc) if video_data.status == "concluido" else None,
        "user_id": user_id
    }
    
    result = await videos_collection.insert_one(new_video)
    new_video["_id"] = result.inserted_id
    
    return VideoResponse(**video_helper(new_video))

@api_router.get("/videos/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific video"""
    user_id = str(current_user["_id"])
    
    try:
        video = await videos_collection.find_one({"_id": ObjectId(video_id), "user_id": user_id})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid video ID"
        )
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    return VideoResponse(**video_helper(video))

@api_router.put("/videos/{video_id}", response_model=VideoResponse)
async def update_video(
    video_id: str,
    video_data: VideoUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a video"""
    user_id = str(current_user["_id"])
    
    try:
        video = await videos_collection.find_one({"_id": ObjectId(video_id), "user_id": user_id})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid video ID"
        )
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    # Update fields
    update_data = video_data.model_dump(exclude_unset=True)
    
    # Auto-set data_conclusao if status changed to concluido
    if video_data.status == "concluido" and not video.get("data_conclusao"):
        update_data["data_conclusao"] = datetime.now(timezone.utc)
    
    await videos_collection.update_one(
        {"_id": ObjectId(video_id)},
        {"$set": update_data}
    )
    
    updated_video = await videos_collection.find_one({"_id": ObjectId(video_id)})
    return VideoResponse(**video_helper(updated_video))

@api_router.delete("/videos/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(
    video_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a video"""
    user_id = str(current_user["_id"])
    
    try:
        result = await videos_collection.delete_one({"_id": ObjectId(video_id), "user_id": user_id})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid video ID"
        )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    return None

# ==================== BULK OPERATIONS ====================

@api_router.post("/videos/bulk-update")
async def bulk_update_videos(
    bulk_data: BulkUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Bulk update videos status"""
    user_id = str(current_user["_id"])
    
    # Convert string IDs to ObjectId
    object_ids = []
    for vid_id in bulk_data.video_ids:
        try:
            object_ids.append(ObjectId(str(vid_id)))
        except:
            pass
    
    if not object_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid video IDs provided"
        )
    
    update_data = {}
    if bulk_data.status:
        update_data["status"] = bulk_data.status
        if bulk_data.status == "concluido":
            update_data["data_conclusao"] = datetime.now(timezone.utc)
    if bulk_data.data_conclusao:
        update_data["data_conclusao"] = bulk_data.data_conclusao
    
    result = await videos_collection.update_many(
        {"_id": {"$in": object_ids}, "user_id": user_id},
        {"$set": update_data}
    )
    
    return {"success": True, "updated_count": result.modified_count}

@api_router.post("/videos/bulk-delete")
async def bulk_delete_videos(
    bulk_data: BulkDeleteRequest,
    current_user: dict = Depends(get_current_user)
):
    """Bulk delete videos"""
    user_id = str(current_user["_id"])
    
    # Convert string IDs to ObjectId
    object_ids = []
    for vid_id in bulk_data.video_ids:
        try:
            object_ids.append(ObjectId(str(vid_id)))
        except:
            pass
    
    if not object_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid video IDs provided"
        )
    
    result = await videos_collection.delete_many(
        {"_id": {"$in": object_ids}, "user_id": user_id}
    )
    
    return {"success": True, "deleted_count": result.deleted_count}

# ==================== IMPORT/EXPORT ====================

def parse_video_text(content: str) -> List[dict]:
    """Parse video data from text format using REGEX"""
    videos = []
    video_blocks = re.split(r'(?=\[TÍTULO\])', content)
    
    for block in video_blocks:
        if not block.strip():
            continue
        
        video_data = {}
        
        titulo_match = re.search(r'\[TÍTULO\]\s*(.+?)(?=\n|\[|$)', block, re.IGNORECASE)
        if titulo_match:
            video_data['titulo'] = titulo_match.group(1).strip()
        else:
            continue
        
        descricao_match = re.search(r'\[DESCRIÇÃO\]\s*(.+?)(?=\n\[|$)', block, re.IGNORECASE | re.DOTALL)
        if descricao_match:
            video_data['descricao'] = descricao_match.group(1).strip()
        
        roteiro_match = re.search(r'\[ROTEIRO\]\s*(.+?)(?=\n\[|$)', block, re.IGNORECASE | re.DOTALL)
        if roteiro_match:
            video_data['roteiro'] = roteiro_match.group(1).strip()
        
        url_match = re.search(r'\[URL\]\s*(.+?)(?=\n|\[|$)', block, re.IGNORECASE)
        if url_match:
            video_data['url'] = url_match.group(1).strip()
        
        status_match = re.search(r'\[STATUS\]\s*(.+?)(?=\n|\[|$)', block, re.IGNORECASE)
        if status_match:
            status_text = status_match.group(1).strip().lower()
            status_map = {
                'planejado': 'planejado',
                'em produção': 'em-producao',
                'em producao': 'em-producao',
                'em-producao': 'em-producao',
                'em edição': 'em-edicao',
                'em edicao': 'em-edicao',
                'em-edicao': 'em-edicao',
                'concluído': 'concluido',
                'concluido': 'concluido'
            }
            video_data['status'] = status_map.get(status_text, 'planejado')
        else:
            video_data['status'] = 'planejado'
        
        videos.append(video_data)
    
    return videos

@api_router.post("/videos/import", response_model=ImportResponse)
async def import_videos(
    import_data: ImportRequest,
    current_user: dict = Depends(get_current_user)
):
    """Import videos from text format"""
    user_id = str(current_user["_id"])
    
    try:
        parsed_videos = parse_video_text(import_data.content)
        
        if not parsed_videos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid videos found in the content"
            )
        
        errors = []
        imported_count = 0
        
        for video_data in parsed_videos:
            try:
                new_video = {
                    **video_data,
                    "user_id": user_id,
                    "data_criacao": datetime.now(timezone.utc),
                    "data_conclusao": datetime.now(timezone.utc) if video_data.get('status') == "concluido" else None
                }
                
                await videos_collection.insert_one(new_video)
                imported_count += 1
            except Exception as e:
                errors.append(f"Error importing '{video_data.get('titulo', 'Unknown')}': {str(e)}")
        
        return ImportResponse(
            success=True,
            imported_count=imported_count,
            errors=errors
        )
    except Exception as e:
        logger.error(f"Import error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error parsing content: {str(e)}"
        )

@api_router.get("/videos/export")
async def export_videos(current_user: dict = Depends(get_current_user)):
    """Export all user videos to text format"""
    user_id = str(current_user["_id"])
    
    cursor = videos_collection.find({"user_id": user_id}).sort("data_criacao", -1)
    videos = await cursor.to_list(length=None)
    
    if not videos:
        return {"content": ""}
    
    lines = []
    for video in videos:
        lines.append(f"[TÍTULO] {video['titulo']}")
        if video.get('descricao'):
            lines.append(f"[DESCRIÇÃO] {video['descricao']}")
        if video.get('roteiro'):
            lines.append(f"[ROTEIRO] {video['roteiro']}")
        if video.get('url'):
            lines.append(f"[URL] {video['url']}")
        lines.append(f"[STATUS] {video['status']}")
        lines.append("")
    
    content = "\n".join(lines)
    return {"content": content}

# Include router in app
app.include_router(api_router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "VideoFlow API is running", "version": "1.0.0 (MongoDB)"}
