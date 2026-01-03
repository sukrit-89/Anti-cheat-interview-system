# backend/models.py
"""Database models for sessions, flags, and reports"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SQLEnum, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()


class UserRole(enum.Enum):
    """User role enumeration"""
    INTERVIEWER = "INTERVIEWER"
    INTERVIEWEE = "INTERVIEWEE"


class SessionStatus(enum.Enum):
    """Session status enum"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class RiskLevel(str, enum.Enum):
    """Risk level classification"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class User(Base):
    """User model for authentication"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interviewer_sessions = relationship("Session", foreign_keys="[Session.interviewer_id]", back_populates="interviewer")
    interviewee_sessions = relationship("Session", foreign_keys="[Session.interviewee_id]", back_populates="interviewee")


class Session(Base):
    """Interview session"""
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(String, index=True)
    video_filename = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(SQLEnum(SessionStatus), default=SessionStatus.PENDING)
    
    # Authentication fields
    interviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    interviewee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    join_code = Column(String(6), unique=True, index=True, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Video metadata
    duration_seconds = Column(Float, nullable=True)
    total_frames = Column(Integer, nullable=True)
    fps = Column(Float, nullable=True)
    
    # Risk assessment
    risk_score = Column(Float, nullable=True)
    risk_level = Column(SQLEnum(RiskLevel), nullable=True)
    total_flags = Column(Integer, default=0)
    
    # Relationships
    flags = relationship("Flag", back_populates="session", cascade="all, delete-orphan")
    report = relationship("Report", back_populates="session", uselist=False, cascade="all, delete-orphan")
    interviewer = relationship("User", foreign_keys=[interviewer_id], back_populates="interviewer_sessions")
    interviewee = relationship("User", foreign_keys=[interviewee_id], back_populates="interviewee_sessions")


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
    risk_level = Column(SQLEnum(RiskLevel), nullable=False)
    recommendation = Column(Text, nullable=True)
    
    # File paths
    json_path = Column(String, nullable=True)
    pdf_path = Column(String, nullable=True)
    
    # Relationship
    session = relationship("Session", back_populates="report")
