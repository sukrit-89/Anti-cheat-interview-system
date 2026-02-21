<div align="center">

# Integrity AI

### AI-Powered Technical Interview Platform

![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Live technical interviews with multi-agent AI evaluation  from a 6-character join code to a complete forensic report.**

</div>

---

## Overview

Integrity AI is a full-stack platform for conducting real-time technical interviews with comprehensive, AI-driven candidate assessment. Recruiters create sessions, share a join code, and monitor candidates live. Five autonomous AI agents run in parallel, delivering a detailed evaluation report the moment the session ends.

---

## Features

### Live Interview Experience

| Feature | Details |
|---------|---------|
| **Video & Audio** | WebRTC via LiveKit  sub-second latency, multi-participant |
| **Collaborative Code Editor** | Monaco (VS Code engine), 5 languages, real-time execution |
| **Sandboxed Code Execution** | Judge0 integration  run and test code safely |
| **Session Join Code** | 6-character code for instant candidate onboarding |
| **Role-Based UI** | Recruiters see scheduling controls; candidates see join flow only |
| **Live Monitoring** | Recruiter dashboard with real-time AI metrics and flags |

### Multi-Agent AI Evaluation

Five agents run automatically after every session:

| Agent | Evaluates |
|-------|-----------|
| **Coding Agent** | Code quality, complexity, best practices, algorithm efficiency |
| **Speech Agent** | Clarity, technical vocabulary, explanation ability |
| **Vision Agent** | Engagement, attention span, body language |
| **Reasoning Agent** | Logic flow, problem decomposition, adaptability |
| **Evaluation Agent** | Overall score, hiring recommendation, detailed forensic report |

### Security & Access Control

- **Supabase Auth**  JWT with refresh rotation, UUID-based user IDs
- **RBAC**  Route guards and UI controls differentiated by role (Recruiter / Candidate)
- **API protection**  Rate limiting, CORS, input validation via Pydantic v2
- **Database migrations**  Auto-applied on container startup via `init_db.py`

---

## Technology Stack

### Frontend
- React 19 + TypeScript 5
- Vite (build tooling)
- TailwindCSS (custom design system)
- Zustand (state management)
- Monaco Editor (code editing)
- LiveKit Components (WebRTC UI)
- React Router v6

### Backend
- FastAPI 0.104+ (async Python API)
- Python 3.11
- SQLAlchemy 2.0 (async ORM)
- PostgreSQL 15
- Supabase (Auth + BaaS)
- Celery + Redis (background workers + pub/sub)
- Pydantic v2 (schema validation)

### Infrastructure
- Docker + Docker Compose
- Judge0 (sandboxed code execution)
- LiveKit (WebRTC SFU)
- OpenAI GPT-4 / Anthropic Claude (AI evaluation)
- Redis 7 (cache + real-time pub/sub)

---

## Quick Start

### Prerequisites

- Docker Desktop (latest)
- Node.js 18+
- Python 3.11+
- A [Supabase](https://supabase.com) project (free tier works)
- A [LiveKit Cloud](https://cloud.livekit.io) account (free tier works)

### 1. Clone

```bash
git clone https://github.com/sukrit-89/Anti-cheat-interview-system.git
cd Anti-cheat-interview-system
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# Database
POSTGRES_USER=interview_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=interview_platform

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Security
JWT_SECRET_KEY=your-secret-key-min-32-characters-long

# LiveKit
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=wss://your-project.livekit.cloud

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Judge0 (Code Execution)
JUDGE0_HOST=http://localhost:2358
```

### 3. Start Backend Services

```bash
# Build and start API, PostgreSQL, and Redis
docker-compose up -d --build
```

Verify health:

```bash
curl http://localhost:8000/health
# {"status":"healthy","database":"connected","redis":"connected"}
```

> The database initialises automatically on first start  `init_db.py` runs and applies all migrations in `migrations/`.

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |

### 5. First Use

1. Register as a **Recruiter** at http://localhost:5173/register
2. Register a second account as a **Candidate** (different browser / incognito)
3. Recruiter: **Dashboard  Create Session**
4. Recruiter: copy the **6-character join code** from the Session Detail page
5. Candidate: **Join Session**  enter the code
6. Recruiter: **Start Session  Enter Interview Room**
7. Code, talk, collaborate  then recruiter clicks **End Session**
8. AI evaluation runs automatically; view the report from the dashboard

---

## Project Structure

```
Anti-cheat-interview-system/

 app/                              # Python Backend
    main.py                       # FastAPI app entry point
   
    api/                          # Route Handlers
       supabase_auth.py          # Register / login / me
       sessions.py               # Session CRUD + join/start/end/token
       websocket.py              # Real-time WebSocket events
       coding_events.py          # Code execution endpoints
       speech.py                 # Speech/transcript endpoints
   
    agents/                       # AI Agent Implementations
       base.py                   # Abstract base agent
       coding_agent.py           # Code quality analysis
       speech_agent.py           # Communication evaluation
       vision_agent.py           # Engagement monitoring
       reasoning_agent.py        # Problem-solving analysis
       evaluation_agent.py       # Final assessment generation
   
    core/                         # Infrastructure
       config.py                 # Pydantic settings
       database.py               # SQLAlchemy async engine
       auth.py                   # JWT utilities
       supabase_auth.py          # Supabase token validation
       redis.py                  # Redis client + pub/sub
       events.py                 # Event publishing helpers
       logging.py                # Structured JSON logging
   
    models/models.py              # SQLAlchemy ORM models
    schemas/schemas.py            # Pydantic v2 request/response schemas
   
    services/                     # Business Logic
       ai_service.py             # AI model orchestration
       livekit_service.py        # WebRTC room management
       judge0_service.py         # Code sandbox service
       speech_service.py         # Speech processing
       vision_service.py         # Vision analysis
       storage_service.py        # File/recording storage
       metrics_service.py        # Analytics
       supabase_service.py       # Supabase client wrapper
   
    workers/                      # Background Workers
        celery_app.py             # Celery configuration
        agent_tasks.py            # AI agent task runners
        session_tasks.py          # Session lifecycle tasks

 frontend/                         # React Frontend
    src/
        App.tsx                   # Router + role-based route guards
        pages/
           Landing.tsx           # Marketing / landing page
           Login.tsx             # Supabase login
           Register.tsx          # Registration (recruiter / candidate)
           Dashboard.tsx         # Role-aware dashboard
           SessionCreate.tsx     # Create interview (recruiter only)
           SessionDetail.tsx     # Session info + controls
           SessionJoin.tsx       # Join with code (candidate)
           InterviewRoom.tsx     # Live interview (video + code editor)
           SessionMonitor.tsx    # Real-time recruiter monitor
           SessionResults.tsx    # Post-session results
           EvaluationReport.tsx  # Forensic-style AI report
        components/               # Reusable UI components
        lib/                      # API client, WebSocket, Supabase, utils
        store/                    # Zustand stores (auth, session)

 migrations/                       # SQL Migrations (auto-applied on startup)
    001_convert_recruiter_id_to_uuid.sql
    002_fix_candidates_user_id_type.sql

 tests/                            # Pytest test suite
    conftest.py
    test_auth.py
    test_sessions.py
    test_database.py
    test_integration.py
    test_system.py

 dev-docs/                         # Developer Documentation
    ARCHITECTURE.md               # System design
    API_REFERENCE.md              # Full API docs
    DEVELOPMENT.md                # Local dev guide
    END_TO_END_SETUP.md           # 15-minute setup walkthrough
    PRODUCTION_SETUP.md           # Production deployment
    SUPABASE_DEPLOYMENT.md        # Supabase configuration
    EXECUTIVE_SUMMARY.md          # Business overview

 cleanup_database.py               # Dev utility: wipe DB data, keep auth users
 reset_all.py                      # Dev utility: full system reset (auth + DB)
 init_db.py                        # DB init + auto-applies all migrations
 docker-compose.yml                # Orchestrates api, postgres, redis
 Dockerfile                        # API container
 Dockerfile.worker                 # Celery worker container
 requirements.txt                  # Python dependencies
 .env.example                      # Environment variable template
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user |  |
| `POST` | `/api/auth/login` | Login, returns JWT |  |
| `GET` | `/api/auth/me` | Current user info |  |

### Sessions

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/api/sessions` | Create session | Recruiter |
| `GET` | `/api/sessions` | List sessions | All |
| `GET` | `/api/sessions/{id}` | Session details | All |
| `POST` | `/api/sessions/join` | Join with code | Candidate |
| `POST` | `/api/sessions/{id}/start` | Start interview | Recruiter |
| `POST` | `/api/sessions/{id}/end` | End interview | Recruiter |
| `GET` | `/api/sessions/{id}/token` | Get LiveKit room token | All |
| `GET` | `/api/sessions/{id}/evaluation` | AI evaluation report | Recruiter |

### Coding Events

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/coding-events` | Record keystroke / submit event |  |
| `POST` | `/api/coding-events/execute` | Execute code via Judge0 |  |
| `GET` | `/api/coding-events/{session_id}` | All events for a session |  |

### WebSocket

| Endpoint | Purpose |
|----------|---------|
| `/api/ws/session/{id}` | Live session events (code, speech, vision metrics) |

Full interactive docs: **http://localhost:8000/docs**

---

## Architecture

```
Browser (React 19)
    
     REST (axios)  FastAPI (port 8000)
                                         
     WebSocket        PostgreSQL  (SQLAlchemy async)
                                           Redis        (pub/sub + cache)
                                           Supabase     (auth + storage)
                                           LiveKit      (WebRTC tokens)
                                           Judge0       (code execution)
                                                    
                                               Celery Workers
                                                    
                                    
                                                                  
                              CodingAgent    SpeechAgent     VisionAgent
                                    
                                                    
                                             ReasoningAgent
                                                    
                                            EvaluationAgent
                                         (final score + report)
```

---

## Development

### Manual Backend Setup

```bash
python -m venv venv
.\venv\Scripts\activate          # Windows
# source venv/bin/activate       # macOS / Linux

pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Run Celery Workers

```bash
celery -A app.workers.celery_app worker --loglevel=info -Q agents --concurrency=4
```

### Testing

```bash
pytest tests/ -v
pytest tests/ --cov=app --cov-report=html
```

### Database Utilities

```bash
# Wipe all sessions/evaluations but keep Supabase auth users
python cleanup_database.py

# Full reset  deletes all auth users AND all DB data
python reset_all.py
```

### Docker

```bash
# Start all services
docker-compose up -d

# Rebuild API after backend code changes
docker-compose up -d --build api

# Stream logs
docker-compose logs -f api

# Shell inside container
docker-compose exec api bash
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` |  | PostgreSQL async connection string |
| `SUPABASE_URL` |  | Supabase project URL |
| `SUPABASE_ANON_KEY` |  | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` |  | Service role key (server-side only) |
| `JWT_SECRET_KEY` |  | Minimum 32-character secret |
| `LIVEKIT_API_KEY` |  | LiveKit API key |
| `LIVEKIT_API_SECRET` |  | LiveKit API secret |
| `LIVEKIT_WS_URL` |  | `wss://` LiveKit server URL |
| `OPENAI_API_KEY` |  | GPT-4 for AI evaluation |
| `ANTHROPIC_API_KEY` |  | Claude fallback for evaluation |
| `REDIS_HOST` |  | Redis hostname (default: `localhost`) |
| `JUDGE0_HOST` |  | Judge0 base URL (default: `http://localhost:2358`) |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](dev-docs/ARCHITECTURE.md) | System design and component interactions |
| [API Reference](dev-docs/API_REFERENCE.md) | Complete endpoint documentation |
| [Development Guide](dev-docs/DEVELOPMENT.md) | Local environment setup details |
| [End-to-End Setup](dev-docs/END_TO_END_SETUP.md) | 15-minute full walkthrough |
| [Production Setup](dev-docs/PRODUCTION_SETUP.md) | Deployment and scaling guide |
| [Supabase Deployment](dev-docs/SUPABASE_DEPLOYMENT.md) | Supabase-specific configuration |
| [Executive Summary](dev-docs/EXECUTIVE_SUMMARY.md) | Business overview for stakeholders |

---

## License

MIT
