# VideoFlow FastAPI Backend with SQLite and JWT
from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from datetime import datetime, timedelta, timezone
from typing import List, Optional
import os
import logging
import re
from pathlib import Path
from dotenv import load_dotenv

# Import local modules
from database import engine, Base, get_db
from models import User, Video
from schemas import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    VideoCreate, VideoUpdate, VideoResponse,
    BulkUpdateRequest, BulkDeleteRequest,
    ImportRequest, ImportResponse, StatsResponse
)
from auth import (
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
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized successfully")

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(new_user)
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login user and return JWT token"""
    # Find user by email
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return UserResponse.model_validate(current_user)

# ==================== VIDEO ROUTES ====================

@api_router.get("/videos", response_model=List[VideoResponse])
async def get_videos(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    time_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 12,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's videos with filters and pagination"""
    query = select(Video).where(Video.user_id == current_user.id)
    
    # Apply search filter
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Video.titulo.ilike(search_pattern),
                Video.descricao.ilike(search_pattern),
                Video.roteiro.ilike(search_pattern)
            )
        )
    
    # Apply status filter
    if status_filter:
        query = query.where(Video.status == status_filter)
    
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
            query = query.where(Video.data_criacao >= time_filters[time_filter])
    
    # Order by creation date (most recent first)
    query = query.order_by(Video.data_criacao.desc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    videos = result.scalars().all()
    
    return [VideoResponse.model_validate(video) for video in videos]

@api_router.get("/videos/count")
async def get_videos_count(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    time_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get total count of videos matching filters"""
    query = select(func.count(Video.id)).where(Video.user_id == current_user.id)
    
    # Apply search filter
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Video.titulo.ilike(search_pattern),
                Video.descricao.ilike(search_pattern),
                Video.roteiro.ilike(search_pattern)
            )
        )
    
    # Apply status filter
    if status_filter:
        query = query.where(Video.status == status_filter)
    
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
            query = query.where(Video.data_criacao >= time_filters[time_filter])
    
    result = await db.execute(query)
    count = result.scalar_one()
    
    return {"count": count}

@api_router.post("/videos", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
async def create_video(
    video_data: VideoCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new video"""
    new_video = Video(
        **video_data.model_dump(),
        user_id=current_user.id
    )
    
    # Set data_conclusao if status is concluido
    if new_video.status == "concluido":
        new_video.data_conclusao = datetime.now(timezone.utc)
    
    db.add(new_video)
    await db.commit()
    await db.refresh(new_video)
    
    return VideoResponse.model_validate(new_video)

@api_router.get("/videos/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific video"""
    result = await db.execute(
        select(Video).where(
            and_(Video.id == video_id, Video.user_id == current_user.id)
        )
    )
    video = result.scalar_one_or_none()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    return VideoResponse.model_validate(video)

@api_router.put("/videos/{video_id}", response_model=VideoResponse)
async def update_video(
    video_id: int,
    video_data: VideoUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a video"""
    result = await db.execute(
        select(Video).where(
            and_(Video.id == video_id, Video.user_id == current_user.id)
        )
    )
    video = result.scalar_one_or_none()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    # Update fields
    update_data = video_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(video, field, value)
    
    # Auto-set data_conclusao if status changed to concluido
    if video_data.status == "concluido" and not video.data_conclusao:
        video.data_conclusao = datetime.now(timezone.utc)
    
    await db.commit()
    await db.refresh(video)
    
    return VideoResponse.model_validate(video)

@api_router.delete("/videos/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a video"""
    result = await db.execute(
        select(Video).where(
            and_(Video.id == video_id, Video.user_id == current_user.id)
        )
    )
    video = result.scalar_one_or_none()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    await db.delete(video)
    await db.commit()
    
    return None

# ==================== BULK OPERATIONS ====================

@api_router.post("/videos/bulk-update")
async def bulk_update_videos(
    bulk_data: BulkUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Bulk update videos status"""
    result = await db.execute(
        select(Video).where(
            and_(
                Video.id.in_(bulk_data.video_ids),
                Video.user_id == current_user.id
            )
        )
    )
    videos = result.scalars().all()
    
    if not videos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No videos found"
        )
    
    # Update videos
    for video in videos:
        if bulk_data.status:
            video.status = bulk_data.status
            # Auto-set data_conclusao if status changed to concluido
            if bulk_data.status == "concluido" and not video.data_conclusao:
                video.data_conclusao = datetime.now(timezone.utc)
        if bulk_data.data_conclusao:
            video.data_conclusao = bulk_data.data_conclusao
    
    await db.commit()
    
    return {"success": True, "updated_count": len(videos)}

@api_router.post("/videos/bulk-delete")
async def bulk_delete_videos(
    bulk_data: BulkDeleteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Bulk delete videos"""
    result = await db.execute(
        select(Video).where(
            and_(
                Video.id.in_(bulk_data.video_ids),
                Video.user_id == current_user.id
            )
        )
    )
    videos = result.scalars().all()
    
    if not videos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No videos found"
        )
    
    # Delete videos
    for video in videos:
        await db.delete(video)
    
    await db.commit()
    
    return {"success": True, "deleted_count": len(videos)}

# ==================== IMPORT/EXPORT ====================

def parse_video_text(content: str) -> List[dict]:
    """Parse video data from text format using REGEX"""
    videos = []
    
    # Split by video entries (assuming each video starts with [TÍTULO])
    video_blocks = re.split(r'(?=\[TÍTULO\])', content)
    
    for block in video_blocks:
        if not block.strip():
            continue
        
        video_data = {}
        
        # Extract TÍTULO
        titulo_match = re.search(r'\[TÍTULO\]\s*(.+?)(?=\n|\[|$)', block, re.IGNORECASE)
        if titulo_match:
            video_data['titulo'] = titulo_match.group(1).strip()
        else:
            continue  # Skip if no title
        
        # Extract DESCRIÇÃO
        descricao_match = re.search(r'\[DESCRIÇÃO\]\s*(.+?)(?=\n\[|$)', block, re.IGNORECASE | re.DOTALL)
        if descricao_match:
            video_data['descricao'] = descricao_match.group(1).strip()
        
        # Extract ROTEIRO (multi-line)
        roteiro_match = re.search(r'\[ROTEIRO\]\s*(.+?)(?=\n\[|$)', block, re.IGNORECASE | re.DOTALL)
        if roteiro_match:
            video_data['roteiro'] = roteiro_match.group(1).strip()
        
        # Extract URL
        url_match = re.search(r'\[URL\]\s*(.+?)(?=\n|\[|$)', block, re.IGNORECASE)
        if url_match:
            video_data['url'] = url_match.group(1).strip()
        
        # Extract STATUS
        status_match = re.search(r'\[STATUS\]\s*(.+?)(?=\n|\[|$)', block, re.IGNORECASE)
        if status_match:
            status_text = status_match.group(1).strip().lower()
            # Normalize status
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
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Import videos from text format"""
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
                new_video = Video(
                    **video_data,
                    user_id=current_user.id
                )
                
                # Set data_conclusao if status is concluido
                if new_video.status == "concluido":
                    new_video.data_conclusao = datetime.now(timezone.utc)
                
                db.add(new_video)
                imported_count += 1
            except Exception as e:
                errors.append(f"Error importing '{video_data.get('titulo', 'Unknown')}': {str(e)}")
        
        await db.commit()
        
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
async def export_videos(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Export all user videos to text format"""
    result = await db.execute(
        select(Video)
        .where(Video.user_id == current_user.id)
        .order_by(Video.data_criacao.desc())
    )
    videos = result.scalars().all()
    
    if not videos:
        return {"content": ""}
    
    # Generate text content
    lines = []
    for video in videos:
        lines.append(f"[TÍTULO] {video.titulo}")
        if video.descricao:
            lines.append(f"[DESCRIÇÃO] {video.descricao}")
        if video.roteiro:
            lines.append(f"[ROTEIRO] {video.roteiro}")
        if video.url:
            lines.append(f"[URL] {video.url}")
        lines.append(f"[STATUS] {video.status}")
        lines.append("")  # Empty line between videos
    
    content = "\n".join(lines)
    
    return {"content": content}

# ==================== STATS ====================

@api_router.get("/videos/stats", response_model=StatsResponse)
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's video statistics"""
    # Get total count
    result = await db.execute(
        select(func.count(Video.id)).where(Video.user_id == current_user.id)
    )
    total_videos = result.scalar_one()
    
    # Get count by status
    result = await db.execute(
        select(func.count(Video.id))
        .where(and_(Video.user_id == current_user.id, Video.status == "concluido"))
    )
    videos_concluidos = result.scalar_one()
    
    result = await db.execute(
        select(func.count(Video.id))
        .where(and_(Video.user_id == current_user.id, Video.status == "planejado"))
    )
    videos_planejado = result.scalar_one()
    
    result = await db.execute(
        select(func.count(Video.id))
        .where(and_(Video.user_id == current_user.id, Video.status == "em-producao"))
    )
    videos_em_producao = result.scalar_one()
    
    result = await db.execute(
        select(func.count(Video.id))
        .where(and_(Video.user_id == current_user.id, Video.status == "em-edicao"))
    )
    videos_em_edicao = result.scalar_one()
    
    # Calculate nivel (level) based on completed videos
    nivel = min(videos_concluidos // 5 + 1, 99)  # Level up every 5 completed videos, max 99
    
    return StatsResponse(
        total_videos=total_videos,
        videos_concluidos=videos_concluidos,
        videos_planejado=videos_planejado,
        videos_em_producao=videos_em_producao,
        videos_em_edicao=videos_em_edicao,
        nivel=nivel
    )

# Include router in app
app.include_router(api_router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "VideoFlow API is running", "version": "1.0.0"}
