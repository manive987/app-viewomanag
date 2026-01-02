# Pydantic models for MongoDB
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime, timezone
from bson import ObjectId

# Custom ObjectId handler
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# User Model
class UserDB(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    username: str
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Video Model
class VideoDB(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    titulo: str
    descricao: Optional[str] = None
    roteiro: Optional[str] = None
    url: Optional[str] = None
    status: str = "planejado"
    data_criacao: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    data_conclusao: Optional[datetime] = None
    user_id: str  # Reference to User ObjectId

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}
