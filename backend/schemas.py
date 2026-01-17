# backend/schemas.py
"""Pydantic schemas for API request/response validation"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class SessionStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class UserRole(str, Enum):
    INTERVIEWER = "INTERVIEWER"
    INTERVIEWEE = "INTERVIEWEE"


# Authentication schemas  
class FirebaseUserSync(BaseModel):
    firebase_uid: str = Field(..., description="Firebase user ID")
    email: str = Field(..., description="User email address")
    full_name: str = Field(..., description="User's full name")
    role: UserRole = Field(..., description="User role (INTERVIEWER or INTERVIEWEE)")


class UserResponse(BaseModel):
    id: int
    firebase_uid: str
    email: str
    full_name: str
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True


# Session schemas
class SessionBase(BaseModel):
    candidate_id: str = Field(..., description="Candidate identifier")


class SessionCreate(SessionBase):
    pass


class SessionJoin(BaseModel):
    join_code: str = Field(..., min_length=6, max_length=6, description="6-character join code")



class SessionResponse(SessionBase):
    id: int
    created_at: datetime
    status: SessionStatus
    video_filename: Optional[str] = None
    duration_seconds: Optional[float] = None
    risk_score: Optional[float] = None
    risk_level: Optional[RiskLevel] = None
    total_flags: int = 0
    
    class Config:
        from_attributes = True


class SessionList(BaseModel):
    sessions: List[SessionResponse]
    total: int


# Flag schemas
class FlagResponse(BaseModel):
    id: int
    timestamp: float
    frame: int
    flag_type: str
    severity: float
    description: Optional[str] = None
    
    class Config:
        from_attributes = True


# Report schemas
class ReportResponse(BaseModel):
    id: int
    session_id: int
    generated_at: datetime
    overall_score: float
    risk_level: RiskLevel
    recommendation: Optional[str] = None
    json_path: Optional[str] = None
    pdf_path: Optional[str] = None
    
    class Config:
        from_attributes = True


# Detailed session with flags and report
class SessionDetail(SessionResponse):
    flags: List[FlagResponse] = []
    report: Optional[ReportResponse] = None
    
    class Config:
        from_attributes = True


# WebSocket message schemas
class WSMessage(BaseModel):
    type: str  # "flag", "status", "score", "error"
    data: dict


class FlagMessage(BaseModel):
    timestamp: float
    flag_type: str
    severity: float
    current_score: float
