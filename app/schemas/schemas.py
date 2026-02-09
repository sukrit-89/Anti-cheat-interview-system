"""
Pydantic schemas for request/response validation.
Using Pydantic v2 with production-ready patterns.
"""
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from app.models.models import UserRole, SessionStatus, AgentType


# ============================================================================
# User Schemas
# ============================================================================

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)
    role: UserRole


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


# ============================================================================
# Session Schemas
# ============================================================================

class SessionCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class SessionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    status: Optional[SessionStatus] = None


class SessionResponse(BaseModel):
    id: int
    session_code: str
    title: str
    description: Optional[str]
    recruiter_id: int
    status: SessionStatus
    scheduled_at: Optional[datetime]
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    created_at: datetime
    room_name: Optional[str]
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="meta_data")
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SessionJoinRequest(BaseModel):
    session_code: str = Field(..., min_length=6, max_length=50)
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr


class SessionJoinResponse(BaseModel):
    session: SessionResponse
    room_token: str
    candidate_id: int


# ============================================================================
# Candidate Schemas
# ============================================================================

class CandidateResponse(BaseModel):
    id: int
    session_id: int
    email: str
    full_name: str
    joined_at: Optional[datetime]
    is_present: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Coding Event Schemas
# ============================================================================

class CodingEventCreate(BaseModel):
    session_id: int
    event_type: str = Field(..., max_length=50)  # keystroke, execute, submit
    code_snapshot: Optional[str] = None
    language: Optional[str] = Field(None, max_length=50)
    execution_output: Optional[str] = None
    execution_error: Optional[str] = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class CodingEventResponse(BaseModel):
    id: int
    session_id: int
    timestamp: datetime
    event_type: str
    code_snapshot: Optional[str]
    language: Optional[str]
    execution_output: Optional[str]
    execution_error: Optional[str]
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="meta_data")
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    full_name: str
    joined_at: Optional[datetime]
    left_at: Optional[datetime]
    is_present: bool
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Coding Event Schemas
# ============================================================================

class CodingEventCreate(BaseModel):
    event_type: str = Field(..., min_length=1, max_length=50)
    code_snapshot: Optional[str] = None
    language: Optional[str] = Field(None, max_length=50)
    execution_output: Optional[str] = None
    execution_error: Optional[str] = None
    execution_time_ms: Optional[int] = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class CodingEventResponse(BaseModel):
    id: int
    session_id: int
    timestamp: datetime
    event_type: str
    code_snapshot: Optional[str]
    language: Optional[str]
    execution_output: Optional[str]
    execution_error: Optional[str]
    execution_time_ms: Optional[int]
    metadata: dict[str, Any]
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Speech Segment Schemas
# ============================================================================

class SpeechSegmentCreate(BaseModel):
    start_time: float = Field(..., ge=0)
    end_time: float = Field(..., ge=0)
    duration: float = Field(..., ge=0)
    transcript: str = Field(..., min_length=1)
    language: Optional[str] = None
    confidence: Optional[float] = Field(None, ge=0, le=1)
    speaker_id: Optional[str] = None
    audio_url: Optional[str] = None


class SpeechSegmentResponse(BaseModel):
    id: int
    session_id: int
    start_time: float
    end_time: float
    duration: float
    transcript: str
    language: Optional[str]
    confidence: Optional[float]
    speaker_id: Optional[str]
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Vision Metric Schemas
# ============================================================================

class VisionMetricCreate(BaseModel):
    metric_type: str = Field(..., min_length=1, max_length=50)
    value: Optional[float] = None
    label: Optional[str] = Field(None, max_length=100)
    confidence: Optional[float] = Field(None, ge=0, le=1)
    metadata: dict[str, Any] = Field(default_factory=dict)


class VisionMetricResponse(BaseModel):
    id: int
    session_id: int
    timestamp: datetime
    metric_type: str
    value: Optional[float]
    label: Optional[str]
    confidence: Optional[float]
    metadata: dict[str, Any]
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Agent Output Schemas
# ============================================================================

class AgentOutputResponse(BaseModel):
    id: int
    session_id: int
    agent_type: AgentType
    started_at: datetime
    completed_at: Optional[datetime]
    status: str
    score: Optional[float]
    findings: dict[str, Any]
    flags: list[dict[str, Any]]
    insights: Optional[str]
    error_message: Optional[str]
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Evaluation Schemas
# ============================================================================

class EvaluationResponse(BaseModel):
    id: int
    session_id: int
    overall_score: float
    coding_score: Optional[float]
    communication_score: Optional[float]
    engagement_score: Optional[float]
    reasoning_score: Optional[float]
    recommendation: str
    confidence_level: Optional[float]
    strengths: list[str]
    weaknesses: list[str]
    key_findings: list[dict[str, Any]]
    summary: Optional[str]
    detailed_report: Optional[str]
    evaluated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# WebSocket Message Schemas
# ============================================================================

class WSMessage(BaseModel):
    """Base WebSocket message."""
    type: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    data: dict[str, Any] = Field(default_factory=dict)


class WSCodingUpdate(WSMessage):
    """Coding activity update."""
    type: str = "coding_update"


class WSMetricUpdate(WSMessage):
    """Real-time metric update."""
    type: str = "metric_update"


class WSSessionUpdate(WSMessage):
    """Session status update."""
    type: str = "session_update"
