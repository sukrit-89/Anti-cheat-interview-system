# backend/models.py
"""Database models for sessions, flags, and reports"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .database import Base


class SessionStatus(str, enum.Enum):
    """Session status enum"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class RiskLevel(str, enum.Enum):
    """Risk level enum"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class Session(Base):
    """Interview session model"""
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(String, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(Enum(SessionStatus), default=SessionStatus.PENDING)
    
    # Video metadata
    video_path = Column(String, nullable=True)
    video_filename = Column(String, nullable=True)
    duration_seconds = Column(Float, default=0.0)
    total_frames = Column(Integer, default=0)
    fps = Column(Float, default=30.0)
    
    # Analysis results
    risk_score = Column(Float, nullable=True)
    risk_level = Column(Enum(RiskLevel), nullable=True)
    total_flags = Column(Integer, default=0)
    
    # Relationships
    flags = relationship("Flag", back_populates="session", cascade="all, delete-orphan")
    report = relationship("Report", back_populates="session", uselist=False, cascade="all, delete-orphan")


class Flag(Base):
    """Detection flag model"""
    __tablename__ = "flags"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    
    timestamp = Column(Float, nullable=False)
    frame = Column(Integer, nullable=False)
    flag_type = Column(String, nullable=False, index=True)
    severity = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    
    # Relationship
    session = relationship("Session", back_populates="flags")


class Report(Base):
    """Analysis report model"""
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False, unique=True)
    generated_at = Column(DateTime, default=datetime.utcnow)
    
    overall_score = Column(Float, nullable=False)
    risk_level = Column(Enum(RiskLevel), nullable=False)
    recommendation = Column(Text, nullable=True)
    
    # File paths
    json_path = Column(String, nullable=True)
    pdf_path = Column(String, nullable=True)
    
    # Relationship
    session = relationship("Session", back_populates="report")
