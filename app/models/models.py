"""
Database models using async SQLAlchemy.
All models follow production best practices.
"""
from datetime import datetime
from typing import Optional
from enum import Enum as PyEnum

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
    Float,
    JSON,
    Enum,
    Index,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class UserRole(str, PyEnum):
    """User role enumeration."""
    RECRUITER = "recruiter"
    CANDIDATE = "candidate"
    ADMIN = "admin"

class SessionStatus(str, PyEnum):
    """Interview session status."""
    SCHEDULED = "scheduled"
    LIVE = "live"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    FAILED = "failed"

class AgentType(str, PyEnum):
    """AI Agent types."""
    CODING = "coding"
    SPEECH = "speech"
    VISION = "vision"
    REASONING = "reasoning"
    EVALUATION = "evaluation"

class SeverityLevel(str, PyEnum):
    """Event severity levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class User(Base):
    """
    User model - DEPRECATED: Users are managed by Supabase.
    This table is kept for backward compatibility but should not be used.
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        Index("idx_user_email_active", "email", "is_active"),
    )

class Session(Base):
    """Interview session model."""
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_code = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    recruiter_id = Column(String(255), nullable=False, index=True)
    status = Column(Enum(SessionStatus), default=SessionStatus.SCHEDULED, index=True)
    
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    room_name = Column(String(255), unique=True, nullable=True)
    room_token = Column(Text, nullable=True)
    
    recording_url = Column(Text, nullable=True)
    recording_started_at = Column(DateTime(timezone=True), nullable=True)
    
    meta_data = Column(JSON, default=dict)
    
    candidates = relationship("Candidate", back_populates="session", cascade="all, delete-orphan")
    coding_events = relationship("CodingEvent", back_populates="session", cascade="all, delete-orphan")
    speech_segments = relationship("SpeechSegment", back_populates="session", cascade="all, delete-orphan")
    vision_metrics = relationship("VisionMetric", back_populates="session", cascade="all, delete-orphan")
    agent_outputs = relationship("AgentOutput", back_populates="session", cascade="all, delete-orphan")
    evaluations = relationship("Evaluation", back_populates="session", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index("idx_session_status_recruiter", "status", "recruiter_id"),
        Index("idx_session_created_at", "created_at"),
    )

class Candidate(Base):
    """Candidate participation in sessions."""
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    user_id = Column(String(255), nullable=True)
    
    email = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    
    joined_at = Column(DateTime(timezone=True), nullable=True)
    left_at = Column(DateTime(timezone=True), nullable=True)
    is_present = Column(Boolean, default=False)
    
    participant_id = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    session = relationship("Session", back_populates="candidates")
    
    __table_args__ = (
        Index("idx_candidate_session", "session_id", "email"),
    )

class CodingEvent(Base):
    """Coding activity tracking."""
    __tablename__ = "coding_events"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    event_type = Column(String(50), nullable=False)
    
    code_snapshot = Column(Text, nullable=True)
    language = Column(String(50), nullable=True)
    
    execution_output = Column(Text, nullable=True)
    execution_error = Column(Text, nullable=True)
    execution_time_ms = Column(Integer, nullable=True)
    
    meta_data = Column(JSON, default=dict)
    
    session = relationship("Session", back_populates="coding_events")
    
    __table_args__ = (
        Index("idx_coding_event_session_timestamp", "session_id", "timestamp"),
    )

class SpeechSegment(Base):
    """Transcribed speech segments."""
    __tablename__ = "speech_segments"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    duration = Column(Float, nullable=False)
    
    transcript = Column(Text, nullable=False)
    language = Column(String(10), nullable=True)
    confidence = Column(Float, nullable=True)
    
    speaker_id = Column(String(255), nullable=True)
    
    audio_url = Column(Text, nullable=True)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    session = relationship("Session", back_populates="speech_segments")
    
    __table_args__ = (
        Index("idx_speech_session_time", "session_id", "start_time"),
    )

class VisionMetric(Base):
    """Vision analysis metrics (engagement, attention, etc.)."""
    __tablename__ = "vision_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    metric_type = Column(String(50), nullable=False)
    
    value = Column(Float, nullable=True)
    label = Column(String(100), nullable=True)
    confidence = Column(Float, nullable=True)
    
    meta_data = Column(JSON, default=dict)
    
    session = relationship("Session", back_populates="vision_metrics")
    
    __table_args__ = (
        Index("idx_vision_session_timestamp", "session_id", "timestamp"),
        Index("idx_vision_metric_type", "metric_type"),
    )

class AgentOutput(Base):
    """Output from AI agents processing session data."""
    __tablename__ = "agent_outputs"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    
    agent_type = Column(Enum(AgentType), nullable=False, index=True)
    
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="processing")
    
    score = Column(Float, nullable=True)
    findings = Column(JSON, default=dict)
    flags = Column(JSON, default=list)
    insights = Column(Text, nullable=True)
    
    error_message = Column(Text, nullable=True)
    
    session = relationship("Session", back_populates="agent_outputs")
    
    __table_args__ = (
        Index("idx_agent_output_session_type", "session_id", "agent_type"),
    )

class Evaluation(Base):
    """Final evaluation combining all agent outputs."""
    __tablename__ = "evaluations"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False, unique=True)
    
    overall_score = Column(Float, nullable=False)
    coding_score = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    engagement_score = Column(Float, nullable=True)
    reasoning_score = Column(Float, nullable=True)
    
    recommendation = Column(String(50), nullable=False)
    confidence_level = Column(Float, nullable=True)
    
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    key_findings = Column(JSON, default=list)
    
    summary = Column(Text, nullable=True)
    detailed_report = Column(Text, nullable=True)
    
    evaluated_at = Column(DateTime(timezone=True), server_default=func.now())
    evaluated_by_agent_version = Column(String(50), nullable=True)
    
    session = relationship("Session", back_populates="evaluations")
    
    __table_args__ = (
        Index("idx_evaluation_recommendation", "recommendation"),
        Index("idx_evaluation_score", "overall_score"),
    )
