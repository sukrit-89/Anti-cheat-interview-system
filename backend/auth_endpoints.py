"""
Authentication endpoints for Satya Guard
To be added to main.py after the root endpoint
"""

# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post("/api/auth/register", response_model=schemas.Token)
async def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user (interviewer or interviewee)
    """
    # Check if user already exists
    existing_user = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    
    db_user = models.User(
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    token = create_access_token(data={
        "user_id": db_user.id,
        "email": db_user.email,
        "role": db_user.role.value
    })
    
    return schemas.Token(
        access_token=token,
        user=schemas.UserResponse.from_orm(db_user)
    )


@app.post("/api/auth/login", response_model=schemas.Token)
async def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Login user and return JWT token
    """
    # Find user
    user = db.query(models.User).filter(
        models.User.email == credentials.email
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    token = create_access_token(data={
        "user_id": user.id,
        "email": user.email,
        "role": user.role.value
    })
    
    return schemas.Token(
        access_token=token,
        user=schemas.UserResponse.from_orm(user)
    )


@app.get("/api/auth/me", response_model=schemas.UserResponse)
async def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """
    Get current authenticated user information
    """
    return schemas.UserResponse.from_orm(current_user)


# ============================================================================
# Session Management with Authentication
# ============================================================================

@app.post("/api/sessions/create", response_model=dict)
async def create_session_with_code(
    candidate_id: str = Form(...),
    current_user: models.User = Depends(require_role([models.UserRole.INTERVIEWER])),
    db: Session = Depends(get_db)
):
    """
    Create a new interview session with join code (INTERVIEWER only)
    """
    from backend.utils import generate_unique_join_code
    
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
    """
    Join an interview session using join code (INTERVIEWEE only)
    """
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
    """
    Get all reports for current interviewee (INTERVIEWEE only)
    """
    sessions = db.query(models.Session).filter(
        models.Session.interviewee_id == current_user.id
    ).order_by(models.Session.created_at.desc()).all()
    
    total = len(sessions)
    
    return schemas.SessionList(sessions=sessions, total=total)


# ============================================================================
# Updated Live Monitoring with Authentication
# ============================================================================

@app.post("/api/live/start")
async def start_live_session_auth(
    join_code: str = Form(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Start live monitoring for an existing session (requires join code)
    """
    # Find session
    session = db.query(models.Session).filter(
        models.Session.join_code == join_code,
        models.Session.is_active == True
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid join code"
        )
    
    # Verify user has access
    if current_user.role == models.UserRole.INTERVIEWER:
        if session.interviewer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized for this session"
            )
    elif current_user.role == models.UserRole.INTERVIEWEE:
        if session.interviewee_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized for this session"
            )
    
    # Update session status
    session.status = models.SessionStatus.PROCESSING
    session.video_filename = "live_session"
    db.commit()
    
    return {
        "session_id": session.id,
        "candidate_id": session.candidate_id,
        "message": "Live session started"
    }
