# Database models for VideoFlow
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationship with videos
    videos = relationship("Video", back_populates="owner", cascade="all, delete-orphan")

class Video(Base):
    __tablename__ = "videos"
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False, index=True)
    descricao = Column(Text, nullable=True)
    roteiro = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    status = Column(String, default="planejado", index=True)  # planejado, em-producao, em-edicao, concluido
    data_criacao = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    data_conclusao = Column(DateTime, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationship with user
    owner = relationship("User", back_populates="videos")
