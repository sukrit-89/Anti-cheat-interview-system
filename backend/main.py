# backend/main.py
"""
Satya Guard - FastAPI Backend
Main application with REST API endpoints for interview session management
"""

from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, status, WebSocket
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional
import os
import shutil
from datetime import datetime
import random
import string
import tempfile

from . import schemas, models
from .database import get_db, init_db, engine
from .analysis_service import AnalysisService
from .firebase_auth import (
    initialize_firebase,
    get_current_user,
    require_role
)
from .cloudinary_service import CloudinaryService
from .utils import generate_unique_join_code

# Initialize FastAPI app
app = FastAPI(
    title="ZeroShotHire Guard API",
    description="AI-Powered Interview Integrity System",
    version="2.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files for reports
os.makedirs("reports/api", exist_ok=True)
app.mount("/reports", StaticFiles(directory="reports"), name="reports")

# Initialize database
models.Base.metadata.create_all(bind=engine)

# Initialize Firebase
try:
    initialize_firebase()
except Exception as e:
    print(f"⚠️  Warning: Firebase initialization failed: {e}")
    print("   Make sure firebase-service-account.json is in the project root")

# Initialize Cloudinary service
cloudinary_service = CloudinaryService()


# ============================================================================
# REST API Endpoints
# ============================================================================

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Satya Guard API",
        "version": "3.0.0",
        "endpoints": {
            "auth": "/api/auth/register, /api/auth/login",
            "sessions": "/api/sessions",
            "upload": "/api/upload",
            "live": "/api/live"
        }
    }


# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post("/api/auth/sync", response_model=schemas.UserResponse)
async def sync_firebase_user(
    user_data: schemas.FirebaseUserSync,
    db: Session = Depends(get_db)
):
    """
    Sync Firebase user to database after registration
    Called from frontend after Firebase createUserWithEmailAndPassword
    """
    # Check if user already exists
    existing_user = db.query(models.User).filter(
        models.User.firebase_uid == user_data.firebase_uid
    ).first()
    
    if existing_user:
        # Update existing user
        existing_user.email = user_data.email
        existing_user.full_name = user_data.full_name
        existing_user.role = user_data.role
        db.commit()
        db.refresh(existing_user)
        return existing_user
    
    # Create new user in database
    db_user = models.User(
        firebase_uid=user_data.firebase_uid,
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@app.get("/api/auth/me", response_model=schemas.UserResponse)
async def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """Get current authenticated user information"""
    return current_user


# ============================================================================
# Session Management with Authentication
# ============================================================================

@app.post("/api/sessions/create")
async def create_session_with_code(
    candidate_id: str = Form(...),
    current_user: models.User = Depends(require_role([models.UserRole.INTERVIEWER])),
    db: Session = Depends(get_db)
):
    """Create a new interview session with join code (INTERVIEWER only)"""
    # Generate unique join code
    join_code = generate_unique_join_code(db)
    
    # Create session
    db_session = models.Session(
        candidate_id=candidate_id,
        status=models.SessionStatus.PENDING,
        interviewer_id=current_user.id,
        join_code=join_code,
        is_active=True
    )
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return {
        "session_id": db_session.id,
        "candidate_id": db_session.candidate_id,
        "join_code": join_code,
        "message": f"Session created with join code: {join_code}"
    }


@app.post("/api/sessions/join")
async def join_session(
    join_data: schemas.SessionJoin,
    current_user: models.User = Depends(require_role([models.UserRole.INTERVIEWEE])),
    db: Session = Depends(get_db)
):
    """Join an interview session using join code (INTERVIEWEE only)"""
    # Find session by join code
    session = db.query(models.Session).filter(
        models.Session.join_code == join_data.join_code,
        models.Session.is_active == True
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired join code"
        )
    
    if session.interviewee_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session already has an interviewee"
        )
    
    # Assign interviewee to session
    session.interviewee_id = current_user.id
    db.commit()
    db.refresh(session)
    
    return {
        "session_id": session.id,
        "candidate_id": session.candidate_id,
        "message": "Successfully joined interview session"
    }


@app.get("/api/sessions/my-reports", response_model=schemas.SessionList)
async def get_my_reports(
    current_user: models.User = Depends(require_role([models.UserRole.INTERVIEWEE])),
    db: Session = Depends(get_db)
):
    """Get all reports for current interviewee (INTERVIEWEE only)"""
    sessions = db.query(models.Session).filter(
        models.Session.interviewee_id == current_user.id
    ).order_by(models.Session.created_at.desc()).all()
    
    total = len(sessions)
    
    return schemas.SessionList(sessions=sessions, total=total)


# ============================================================================  
# Original Session Endpoints (now without auth - will update later)
# ============================================================================

@app.post("/api/sessions", response_model=schemas.SessionResponse)
async def create_session(
    session: schemas.SessionCreate,
    db: Session = Depends(get_db)
):
    """Create a new interview session"""
    db_session = models.Session(
        candidate_id=session.candidate_id,
        status=models.SessionStatus.PENDING
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


@app.get("/api/sessions", response_model=schemas.SessionList)
async def list_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all interview sessions"""
    sessions = db.query(models.Session).order_by(
        models.Session.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    total = db.query(models.Session).count()
    
    return schemas.SessionList(sessions=sessions, total=total)


@app.get("/api/sessions/{session_id}", response_model=schemas.SessionDetail)
async def get_session(session_id: int, db: Session = Depends(get_db)):
    """Get detailed session information"""
    session = db.query(models.Session).filter(
        models.Session.id == session_id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session


@app.post("/api/upload")
async def upload_video(
    file: UploadFile = File(...),
    candidate_id: str = Form(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload video file to Cloudinary and run analysis
    """
    temp_video_path = None
    analysis_video_path = None
    
    try:
        # Create session
        db_session = models.Session(
            candidate_id=candidate_id,
            status=models.SessionStatus.PROCESSING,
            interviewer_id=current_user.id if current_user.role == models.UserRole.INTERVIEWER else None,
            interviewee_id=current_user.id if current_user.role == models.UserRole.INTERVIEWEE else None
        )
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        # Save temporary file for Cloudinary upload
        temp_video_path = f"temp_upload_{db_session.id}_{file.filename}"
        with open(temp_video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Upload to Cloudinary
        upload_result = cloudinary_service.upload_video(
            temp_video_path,
            public_id=f"session_{db_session.id}"
        )
        
        # Store Cloudinary URL in database
        db_session.video_filename = upload_result['url']
        if upload_result.get('duration'):
            db_session.duration_seconds = upload_result['duration']
        db.commit()
        
        # Clean up upload temp file
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)
            temp_video_path = None
        
        # Download from Cloudinary for analysis
        analysis_video_path = f"temp_analysis_{db_session.id}.mp4"
        cloudinary_service.download_video(upload_result['url'], analysis_video_path)
        
        # Run analysis
        db_session.video_path = analysis_video_path  # Temporarily set for analysis
        
        analysis_service = AnalysisService()
        result = analysis_service.analyze_video(
            video_path=analysis_video_path,
            session_id=db_session.id,
            candidate_id=candidate_id
        )
        
        # Update session with analysis results
        db_session.duration_seconds = result['metadata']['duration_seconds']
        db_session.total_frames = result['metadata']['total_frames']
        db_session.fps = result['metadata']['fps']
        db_session.risk_score = result['risk_data']['overall_score']
        db_session.risk_level = models.RiskLevel[result['risk_data']['risk_level']]
        db_session.total_flags = len(result['flags'])
        db_session.status = models.SessionStatus.COMPLETED
        db_session.video_path = None  # Clear temp path
        
        # Save flags to database
        for flag in result['flags']:
            db_flag = models.Flag(
                session_id=db_session.id,
                timestamp=flag.get('time', flag.get('frame', 0) / result['metadata']['fps']),
                frame=flag.get('frame', int(flag.get('time', 0) * result['metadata']['fps'])),
                flag_type=flag['type'],
                severity=analysis_service.scoring_engine.FLAG_WEIGHTS.get(flag['type'], 0.05),
                description=f"{flag['type']} detected"
            )
            db.add(db_flag)
        
        # Generate reports
        reports = analysis_service.generate_reports(
            flags=result['flags'],
            metadata=result['metadata'],
            risk_data=result['risk_data']
        )
        
        # Upload PDF report to Cloudinary if generated
        pdf_url = None
        if reports.get('pdf_path') and os.path.exists(reports['pdf_path']):
            pdf_result = cloudinary_service.upload_pdf(
                reports['pdf_path'],
                public_id=f"report_{db_session.id}"
            )
            pdf_url = pdf_result['url']
            
            # Delete local PDF after upload
            os.remove(reports['pdf_path'])
        
        # Save report info
        db_report = models.Report(
            session_id=db_session.id,
            overall_score=result['risk_data']['overall_score'],
            risk_level=models.RiskLevel[result['risk_data']['risk_level']],
            recommendation=result['risk_data']['recommendation'],
            json_path=reports.get('json_path'),
            pdf_path=pdf_url  # Store Cloudinary URL
        )
        db.add(db_report)
        
        # Clean up analysis temp file
        if os.path.exists(analysis_video_path):
            os.remove(analysis_video_path)
            analysis_video_path = None
        
        db.commit()
        db.refresh(db_session)
        
        return {
            "message": "Analysis complete",
            "session_id": db_session.id,
            "video_url": upload_result['url'],
            "risk_score": db_session.risk_score,
            "risk_level": db_session.risk_level.value,
            "total_flags": db_session.total_flags,
            "report_url": pdf_url
        }
        
    except Exception as e:
        # Update session status to failed
        if 'db_session' in locals():
            db_session.status = models.SessionStatus.FAILED
            db.commit()
        
        # Clean up temp files
        if temp_video_path and os.path.exists(temp_video_path):
            os.remove(temp_video_path)
        if analysis_video_path and os.path.exists(analysis_video_path):
            os.remove(analysis_video_path)
        
        raise HTTPException(
            status_code=500,
            detail=f"Upload/analysis failed: {str(e)}"
        )
        db.commit()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: int, db: Session = Depends(get_db)):
    """Delete a session and associated data"""
    session = db.query(models.Session).filter(
        models.Session.id == session_id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Delete video file
    if session.video_path and os.path.exists(session.video_path):
        os.remove(session.video_path)
    
    # Delete reports
    if session.report:
        if session.report.json_path and os.path.exists(session.report.json_path):
            os.remove(session.report.json_path)
        if session.report.pdf_path and os.path.exists(session.report.pdf_path):
            os.remove(session.report.pdf_path)
    
    db.delete(session)
    db.commit()
    
    return {"message": "Session deleted successfully"}


@app.get("/api/reports/{session_id}/json")
async def get_json_report(session_id: int, db: Session = Depends(get_db)):
    """Get JSON report for session"""
    session = db.query(models.Session).filter(
        models.Session.id == session_id
    ).first()
    
    if not session or not session.report or not session.report.json_path:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if not os.path.exists(session.report.json_path):
        raise HTTPException(status_code=404, detail="Report file not found")
    
    return FileResponse(session.report.json_path, media_type="application/json")


@app.get("/api/reports/{session_id}/pdf")
async def get_pdf_report(session_id: int, db: Session = Depends(get_db)):
    """Get PDF report for session"""
    session = db.query(models.Session).filter(
        models.Session.id == session_id
    ).first()
    
    if not session or not session.report or not session.report.pdf_path:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if not os.path.exists(session.report.pdf_path):
        raise HTTPException(status_code=404, detail="Report file not found")
    
    return FileResponse(session.report.pdf_path, media_type="application/pdf")


# ============================================================================
# Live Monitoring Endpoints
# ============================================================================

@app.post("/api/live/start")
async def start_live_session(
    candidate_id: str = Form(...),
    db: Session = Depends(get_db)
):
    """Start a new live monitoring session"""
    db_session = models.Session(
        candidate_id=candidate_id,
        status=models.SessionStatus.PROCESSING,
        video_filename="live_session"
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return {
        "session_id": db_session.id,
        "candidate_id": db_session.candidate_id,
        "message": "Live session started"
    }


@app.post("/api/live/{session_id}/flag")
async def add_live_flag(
    session_id: int,
    flag_type: str = Form(...),
    timestamp: float = Form(...),
    severity: float = Form(0.1),
    db: Session = Depends(get_db)
):
    """Add a flag during live monitoring"""
    session = db.query(models.Session).filter(
        models.Session.id == session_id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Create flag
    db_flag = models.Flag(
        session_id=session_id,
        timestamp=timestamp,
        frame=int(timestamp * 30),  # Assume 30 FPS
        flag_type=flag_type,
        severity=severity,
        description=f"{flag_type} detected during live monitoring"
    )
    db.add(db_flag)
    
    # Update session flag count
    session.total_flags = session.total_flags + 1
    
    db.commit()
    
    return {"message": "Flag added", "total_flags": session.total_flags}


@app.post("/api/live/{session_id}/stop")
async def stop_live_session(
    session_id: int,
    duration: float = Form(...),
    db: Session = Depends(get_db)
):
    """Stop live monitoring session and finalize report"""
    session = db.query(models.Session).filter(
        models.Session.id == session_id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Calculate metrics from flags
    flags = db.query(models.Flag).filter(
        models.Flag.session_id == session_id
    ).all()
    
    # Convert to dict format for scoring
    flag_dicts = [
        {
            'type': f.flag_type,
            'time': f.timestamp,
            'frame': f.frame
        }
        for f in flags
    ]
    
    # Calculate risk score
    analysis_service = AnalysisService()
    total_frames = int(duration * 30)  # Assume 30 FPS
    
    risk_data = analysis_service.scoring_engine.calculate_risk_score(
        flag_dicts,
        duration,
        total_frames,
        30.0
    )
    
    # Update session
    session.duration_seconds = duration
    session.total_frames = total_frames
    session.fps = 30.0
    session.risk_score = risk_data['overall_score']
    session.risk_level = models.RiskLevel[risk_data['risk_level']]
    session.status = models.SessionStatus.COMPLETED
    
    # Create report
    metadata = {
        'session_id': session.id,
        'candidate_id': session.candidate_id,
        'duration_seconds': duration,
        'total_frames': total_frames,
        'fps': 30.0,
        'video_path': 'live_session'
    }
    
    reports = analysis_service.generate_reports(
        flags=flag_dicts,
        metadata=metadata,
        risk_data=risk_data
    )
    
    # Save report info
    db_report = models.Report(
        session_id=session.id,
        overall_score=risk_data['overall_score'],
        risk_level=models.RiskLevel[risk_data['risk_level']],
        recommendation=risk_data['recommendation'],
        json_path=reports['json_path'],
        pdf_path=reports['pdf_path']
    )
    db.add(db_report)
    
    db.commit()
    db.refresh(session)
    
    return {
        "message": "Session completed",
        "session_id": session.id,
        "risk_score": session.risk_score,
        "risk_level": session.risk_level.value,
        "total_flags": session.total_flags
    }


# ============================================================================
# WebSocket Endpoint (Live Monitoring - Placeholder)
# ============================================================================

@app.websocket("/ws/live/{session_id}")
async def websocket_live_monitor(websocket: WebSocket, session_id: int):
    """
    WebSocket endpoint for live monitoring
    TODO: Implement real-time video streaming and detection
    """
    await websocket.accept()
    
    try:
        await websocket.send_json({
            "type": "connected",
            "message": f"Connected to live monitoring for session {session_id}",
            "session_id": session_id
        })
        
        # Keep connection alive and echo messages for now
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "type": "echo",
                "data": data
            })
            
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for session {session_id}")


# ============================================================================
# Health Check
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
