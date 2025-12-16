# Pydantic schemas for request/response models
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Video Schemas
class VideoCreate(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    roteiro: Optional[str] = None
    url: Optional[str] = None
    status: str = "planejado"

class VideoUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    roteiro: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = None
    data_conclusao: Optional[datetime] = None

class VideoResponse(BaseModel):
    id: int
    titulo: str
    descricao: Optional[str]
    roteiro: Optional[str]
    url: Optional[str]
    status: str
    data_criacao: datetime
    data_conclusao: Optional[datetime]
    user_id: int
    
    class Config:
        from_attributes = True

# Bulk Operations
class BulkUpdateRequest(BaseModel):
    video_ids: List[int]
    status: Optional[str] = None
    data_conclusao: Optional[datetime] = None

class BulkDeleteRequest(BaseModel):
    video_ids: List[int]

# Import/Export
class ImportRequest(BaseModel):
    content: str

class ImportResponse(BaseModel):
    success: bool
    imported_count: int
    errors: List[str] = []

# Stats
class StatsResponse(BaseModel):
    total_videos: int
    videos_concluidos: int
    videos_planejado: int
    videos_em_producao: int
    videos_em_edicao: int
    nivel: int
