# 🎯 AI-Powered Technical Interview Platform

**Production-grade real-time interview system with autonomous AI agents**

Scalable, event-driven platform for conducting live technical interviews with real-time AI-powered evaluation. Features WebRTC video, live coding, and multi-agent assessment pipeline.

---

## 🚀 Quick Start

```powershell
# 1. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 2. Start services with Docker
docker-compose up -d

# 3. Initialize database
python init_db.py

# 4. Start the platform
uvicorn app.main:app --reload

# 5. Open API docs
# http://localhost:8000/docs
```

---

## 🧪 Testing

Comprehensive test suite with 56 tests covering all functionality:

```powershell
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html
```

**Test Coverage:**
- ✅ Authentication & Security (14 tests)
- ✅ Session Management (10 tests)
- ✅ Database Operations (8 tests)
- ✅ Integration Workflows (6 tests)
- ✅ Configuration (10 tests)
- ✅ System Validation (8 tests)

---

## ✨ Core Features

### 🎥 **Live Interview Sessions**
- WebRTC-powered video/audio streaming via LiveKit
- Embedded Monaco code editor
- Real-time collaborative coding environment
- Session join codes for easy access

### 🤖 **Autonomous AI Agents**
Each agent operates independently and asynchronously:

- **CodingAgent** - Analyzes code quality, execution patterns, problem-solving approach
- **SpeechAgent** - Evaluates communication clarity, technical vocabulary, explanation quality
- **VisionAgent** - Monitors engagement, attention, presence detection
- **ReasoningAgent** - Assesses logical thinking, problem decomposition, adaptability
- **EvaluationAgent** - Aggregates all outputs into hiring recommendation

### 📊 **Real-Time Monitoring**
- WebSocket-based live updates
- Recruiter dashboard with metrics
- Activity tracking and presence detection
- Instant feedback on candidate performance

### 🔐 **Enterprise Security**
- JWT-based authentication
- Role-based access control (Recruiter/Candidate/Admin)
- PostgreSQL with async SQLAlchemy
- Secure session management

### 📈 **Scalable Architecture**
- Event-driven with Redis pub/sub
- Celery workers for background processing
- Horizontal scaling support
- Docker containerization

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** 0.104+ - Modern async Python framework
- **PostgreSQL** 15+ - Production database with async support
- **Redis** 7+ - Caching and pub/sub messaging
- **Celery** 5.3+ - Distributed task queue
- **SQLAlchemy** 2.0+ - Async ORM
- **Pydantic** v2 - Data validation

### Real-Time Infrastructure
- **LiveKit** - WebRTC video/audio streaming
- **WebSockets** - Real-time event delivery
- **Redis Pub/Sub** - Inter-service communication

### AI/ML
- **Ollama** - Local LLM for reasoning analysis
- **Whisper** - Speech-to-text transcription (optional)

### DevOps
- **Docker** & **Docker Compose** - Containerization
- **Uvicorn** - ASGI server
- **MinIO** - S3-compatible object storage

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Interview Platform Stack                      │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐         ┌──────────┐         ┌──────────┐
   │ FastAPI │         │PostgreSQL│         │  Redis   │
   │   API   │────────▶│  Database│◀────────│  Cache   │
   └─────────┘         └──────────┘         │  Pub/Sub │
        │                                    └──────────┘
        │                                          │
        ▼                                          ▼
   ┌─────────────────────────────────────────────────┐
   │           Event-Driven Pipeline                 │
   │  SessionCreated → RecordingStarted →           │
   │  AgentsProcess → EvaluationComplete            │
   └─────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ Coding  │     │ Speech  │     │ Vision  │
   │  Agent  │     │  Agent  │     │  Agent  │
   └─────────┘     └─────────┘     └─────────┘
        │                ▼                │
        └──────────▶┌─────────┐◀─────────┘
                    │Reasoning│
                    │  Agent  │
                    └─────────┘
                         │
                         ▼
                   ┌──────────┐
                   │Evaluation│
                   │  Agent   │
                   └──────────┘
```

---

## 📁 Project Structure

```
app/
├── api/                    # API endpoints
│   ├── auth.py            # Authentication endpoints
│   ├── sessions.py        # Session management
│   └── websocket.py       # WebSocket handlers
├── agents/                # AI agents
│   ├── base.py           # Base agent class
│   ├── coding_agent.py
│   ├── speech_agent.py
│   ├── vision_agent.py
│   ├── reasoning_agent.py
│   └── evaluation_agent.py
├── core/                  # Core utilities
│   ├── config.py         # Pydantic settings
│   ├── database.py       # DB connection
│   ├── auth.py           # JWT authentication
│   ├── redis.py          # Redis client
│   ├── events.py         # Event system
│   └── logging.py        # Structured logging
├── models/               # Database models
│   └── models.py        # SQLAlchemy models
├── schemas/             # Pydantic schemas
│   └── schemas.py      # Request/response models
├── services/           # Business logic
│   ├── livekit_service.py
│   ├── storage_service.py
│   ├── metrics_service.py
│   └── ai_service.py
├── workers/           # Background tasks
│   ├── celery_app.py
│   ├── agent_tasks.py
│   └── session_tasks.py
└── main.py           # FastAPI application

tests/                # Test suite
├── conftest.py      # Shared fixtures
├── test_auth.py     # Authentication tests
├── test_sessions.py # Session management tests
├── test_database.py # Database model tests
├── test_config.py   # Configuration tests
├── test_integration.py # Integration tests
└── test_system.py   # End-to-end tests
```

---

## 🔄 Event-Driven Flow

### Session Lifecycle

1. **Recruiter Creates Session**
   - `POST /api/sessions` creates session
   - Generates unique join code
   - Creates LiveKit room
   - Publishes `SESSION_CREATED` event

2. **Candidate Joins**
   - `POST /api/sessions/join` with code
   - Validates session status
   - Generates LiveKit token
   - Publishes `CANDIDATE_JOINED` event

3. **Interview Starts**
   - `POST /api/sessions/{id}/start`
   - Updates status to `LIVE`
   - Publishes `SESSION_STARTED` event
   - Begins recording

4. **Real-Time Activity**
   - Coding events → Redis pub/sub → WebSocket
   - Speech transcription → Database → WebSocket
   - Vision metrics → Database → WebSocket

5. **Interview Ends**
   - `POST /api/sessions/{id}/end`
   - Status → `COMPLETED`
   - Publishes `SESSION_ENDED` event
   - **Triggers agent pipeline**

6. **Agent Processing**
   - Celery dispatches agents in parallel:
     - CodingAgent analyzes code
     - SpeechAgent analyzes communication
     - VisionAgent analyzes engagement
     - ReasoningAgent analyzes problem-solving
   - Each agent saves output to `agent_outputs` table
   - Publishes `AGENT_PROCESSING_COMPLETED` events

7. **Final Evaluation**
   - EvaluationAgent aggregates all outputs
   - Generates hiring recommendation
   - Creates `Evaluation` record
   - Publishes `EVALUATION_COMPLETED` event

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT tokens
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Sessions
- `POST /api/sessions` - Create session (Recruiter)
- `POST /api/sessions/join` - Join with code (Candidate)
- `GET /api/sessions` - List sessions
- `GET /api/sessions/{id}` - Get session details
- `PATCH /api/sessions/{id}` - Update session
- `POST /api/sessions/{id}/start` - Start session
- `POST /api/sessions/{id}/end` - End session
- `GET /api/sessions/{id}/candidates` - List candidates

### WebSocket
- `WS /api/ws/session/{id}` - Real-time session events
- `WS /api/ws/live/{id}` - Live monitoring dashboard

---

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts (recruiters, candidates, admins)
- **sessions** - Interview sessions
- **candidates** - Session participation records

### Activity Tables
- **coding_events** - Code changes and executions
- **speech_segments** - Transcribed speech
- **vision_metrics** - Engagement and attention data

### AI Tables
- **agent_outputs** - Individual agent analysis
- **evaluations** - Final hiring recommendations

---

## ⚙️ Environment Configuration

See [.env.example](.env.example) for full configuration.

Key settings:
```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/interview_platform

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256

# LiveKit
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
LIVEKIT_URL=wss://your-livekit-server.com

# Storage (MinIO/S3)
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET_NAME=interview-recordings
```

---

## 🐳 Docker Services

```yaml
services:
  api:        # FastAPI application
  postgres:   # PostgreSQL database
  redis:      # Redis cache/pub-sub
  minio:      # S3-compatible storage
  ollama:     # Local LLM
  worker:     # Celery worker for background tasks
```

---

## 🔧 Development

### Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Running Celery Workers

```bash
# Agent processing workers
celery -A app.workers.celery_app worker -Q agents --loglevel=info

# Session task workers
celery -A app.workers.celery_app worker -Q sessions --loglevel=info
```

---

## 📊 Production Deployment

### Recommended Setup

1. **Load Balancer** - Nginx/Traefik
2. **Application** - Multiple FastAPI instances
3. **Workers** - Dedicated Celery worker pools
4. **Database** - PostgreSQL with replication
5. **Cache** - Redis cluster
6. **Storage** - S3-compatible object storage
7. **Monitoring** - Prometheus + Grafana

### Scaling Guidelines

- **API**: Scale horizontally based on request load
- **Workers**: Scale based on queue depth
- **Database**: Use read replicas for analytics
- **Redis**: Use Redis Cluster for high availability

---

## 🔒 Security Best Practices

- Never commit `.env` file
- Use strong `JWT_SECRET_KEY` (32+ bytes)
- Enable HTTPS in production
- Rotate credentials regularly
- Implement rate limiting
- Use database connection pooling
- Enable CORS only for trusted origins
- Sanitize all user inputs

---

## 👨‍💻 Author

**Sukrit Goswami**
- Email: sukrit.goswami.work@gmail.com
- GitHub: [@sukrit-89](https://github.com/sukrit-89)

---

**Built for scalability. Designed for production. Powered by AI.**
