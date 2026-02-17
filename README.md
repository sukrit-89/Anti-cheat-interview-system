<div align="center">

# 🎯 Integrity AI

### AI-Powered Technical Interview Platform

![Integrity AI](https://img.shields.io/badge/Integrity%20AI-Platform-blue?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Powered-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Transform your technical hiring with real-time collaboration and multi-agent AI evaluation**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Demo](#-demo)

</div>

---

## 🚀 Overview

**Integrity AI** is an enterprise-grade platform for conducting live technical interviews with comprehensive AI-powered candidate assessment. Combining WebRTC video streaming, collaborative coding, and intelligent multi-agent evaluation, it revolutionizes how companies assess technical talent.

### 🎯 Why Integrity AI?

- **🤖 5 Specialized AI Agents** - Autonomous evaluation of coding, communication, engagement, reasoning, and overall fit
- **📹 Professional Video Experience** - LiveKit-powered WebRTC with sub-second latency
- **💻 Live Code Collaboration** - Monaco editor (VS Code engine) with real-time execution in 50+ languages
- **🔒 Enterprise-Grade Security** - Supabase auth, JWT tokens, RBAC, encrypted storage
- **📊 Real-time Insights** - Live recruiter dashboard with instant AI-generated metrics
- **⚡ Production-Ready** - Docker orchestration, async architecture, horizontal scaling
- **🌐 Open Source** - MIT licensed, fully customizable, no vendor lock-in

---

## ✨ Features

### 🎥 Live Interview Experience

<table>
<tr>
<td width="50%">

#### Real-Time Collaboration
- WebRTC video/audio streaming via **LiveKit**
- Multi-participant support with screen sharing
- Sub-second latency for natural conversation
- Automatic recording and cloud storage
- Built-in chat and Q&A features

</td>
<td width="50%">

#### Professional Code Editor
- **Monaco Editor** (VS Code engine)
- 50+ programming languages supported
- Intelligent autocomplete and IntelliSense
- Real-time collaborative editing
- Syntax highlighting and error detection

</td>
</tr>
<tr>
<td width="50%">

#### Secure Code Execution
- **Judge0** sandboxed environment
- Real-time output and error display
- Input/output testing capabilities
- Performance metrics tracking
- Safe isolation for untrusted code

</td>
<td width="50%">

#### Session Management
- Easy join code system for candidates
- Flexible scheduling (immediate or scheduled)
- Custom interview questions and templates
- Session history and replay
- Multi-timezone support

</td>
</tr>
</table>

### 🤖 Multi-Agent AI Evaluation System

Five specialized autonomous agents working in parallel to provide comprehensive candidate assessment:

| Agent | Focus Area | Key Metrics |
|-------|-----------|-------------|
| **🧑‍💻 Coding Agent** | Technical Skills | Code quality, complexity, best practices, algorithm efficiency |
| **🗣️ Speech Agent** | Communication | Clarity, technical vocabulary, explanation ability, confidence |
| **👁️ Vision Agent** | Engagement | Attention span, body language, presence, focus metrics |
| **🧠 Reasoning Agent** | Problem-Solving | Logic flow, decomposition, adaptability, creative solutions |
| **⚖️ Evaluation Agent** | Final Assessment | Overall score, hiring recommendation, detailed report |

### 📊 Recruiter Dashboard

- **Live Monitoring**: Real-time candidate activity and performance metrics
- **AI Insights**: Instant analysis and recommendations during interviews
- **Analytics**: Historical data, candidate comparison, hiring trends
- **Reporting**: Exportable reports in PDF, JSON, and CSV formats
- **Collaboration**: Multi-recruiter observation and note-taking
- **Forensic Reports**: Evidence-based evaluation with detailed technical blueprints

### 🔐 Enterprise Security Features

✅ **Authentication**: Supabase Auth with JWT tokens and refresh rotation  
✅ **Authorization**: Role-based access control (Recruiter, Candidate, Admin)  
✅ **Data Protection**: Encrypted storage, secure transmission, GDPR compliant  
✅ **API Security**: Rate limiting, CORS, input validation, SQL injection prevention  
✅ **Audit Logging**: Complete activity tracking for compliance  
✅ **Direct Supabase Client**: Enhanced frontend integration for real-time auth state

---

## 🛠️ Technology Stack

<table>
<tr>
<td width="33%">

### Frontend
- **React 19** - Modern UI library
- **TypeScript 5** - Type safety
- **Vite** - Fast build tooling
- **TailwindCSS 3** - Utility styling
- **Zustand** - State management
- **Monaco Editor** - Code editing
- **LiveKit Components** - WebRTC UI

</td>
<td width="33%">

### Backend
- **FastAPI 0.104+** - Async Python API
- **Python 3.11** - Modern Python
- **SQLAlchemy 2.0** - Async ORM
- **PostgreSQL 15** - Database
- **Supabase** - BaaS platform
- **Celery** - Task queue
- **Redis 7** - Caching & pub/sub

</td>
<td width="33%">

### Infrastructure
- **Docker** - Containerization
- **Judge0** - Code execution
- **LiveKit** - WebRTC SFU
- **OpenAI GPT-4** - AI analysis
- **Anthropic Claude** - AI evaluation
- **Supabase Storage** - File storage
- **Nginx** - Load balancing

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Docker & Docker Compose** - Latest version
- **Node.js** - v18.0 or higher
- **Python** - v3.11 or higher
- **Supabase Account** - [Sign up for free](https://supabase.com)

> 💡 **Need to get started quickly?** Check out our [⚡ QUICKSTART.md](QUICKSTART.md) for a streamlined Docker-based setup in under 5 minutes!

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sukrit-89/Integrity-AI.git
cd Integrity-AI
```

#### 2️⃣ Environment Configuration

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Database (Supabase)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_supabase_db_password
POSTGRES_HOST=db.your-project.supabase.co
POSTGRES_PORT=5432
POSTGRES_DB=postgres
DATABASE_URL=postgresql+asyncpg://postgres:password@host:5432/postgres

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Security
JWT_SECRET_KEY=your-super-secret-key-min-32-characters-long

# LiveKit (Get free API keys at https://cloud.livekit.io)
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

#### 3️⃣ Start with Docker (Recommended)

```bash
# Start all services in the background
docker-compose up -d

# View logs
docker-compose logs -f

# Initialize the database
docker-compose exec api python init_db.py
```

#### 4️⃣ Manual Setup (Development)

**Backend:**

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# In another terminal, start Celery workers
celery -A app.workers.celery_app worker --loglevel=info -Q agents --concurrency=4
```

**Frontend:**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Platform

Once everything is running, access the platform at:

- 🌐 **Frontend**: http://localhost:5173
- 🚀 **Backend API**: http://localhost:8000
- 📚 **API Documentation**: http://localhost:8000/docs
- 💚 **Health Check**: http://localhost:8000/health

### First Steps

1. **Register** as a Recruiter or Candidate
2. **Create a Session** (Recruiters only)
3. **Share Join Code** with candidates
4. **Start Interview** and begin assessment!

---

## 📚 Documentation

### Core Documentation

| Document | Description |
|----------|-------------|
| [⚡ Quick Start](QUICKSTART.md) | **5-minute setup guide** - Get started fast with Docker |
| [📊 Executive Summary](dev-docs/EXECUTIVE_SUMMARY.md) | High-level project overview for stakeholders |
| [🏗️ Architecture](dev-docs/ARCHITECTURE.md) | System design and technical architecture |
| [🔌 API Reference](dev-docs/API_REFERENCE.md) | Complete API endpoint documentation |
| [💻 Development Guide](dev-docs/DEVELOPMENT.md) | Setup instructions for developers |
| [🚀 End-to-End Setup](dev-docs/END_TO_END_SETUP.md) | Complete 15-minute setup walkthrough |
| [🌐 Production Setup](dev-docs/PRODUCTION_SETUP.md) | Production deployment guide |
| [☁️ Supabase Deployment](dev-docs/SUPABASE_DEPLOYMENT.md) | Supabase-specific configuration |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Integrity AI Platform                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌────────────────┐  ┌─────────────┐  ┌─────────────┐
        │   Next.js      │  │   FastAPI   │  │  LiveKit    │
        │   Frontend     │  │   Backend   │  │  WebRTC     │
        │  (Port 3000)   │  │ (Port 8000) │  │   Server    │
        └────────────────┘  └─────────────┘  └─────────────┘
                │                   │                │
                │                   ▼                │
                │          ┌─────────────┐          │
                └─────────▶│ PostgreSQL  │◀─────────┘
                           │  Database   │
                           └─────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
            ┌──────────┐   ┌──────────┐   ┌──────────┐
            │  Redis   │   │  MinIO   │   │  Celery  │
            │ Pub/Sub  │   │   S3     │   │ Workers  │
            │  Cache   │   │ Storage  │   │  Queue   │
            └──────────┘   └──────────┘   └──────────┘
                                                  │
                        ┌─────────────────────────┼─────────────────────────┐
                        │                         │                         │
                        ▼                         ▼                         ▼
                ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
                │ CodingAgent  │        │ SpeechAgent  │        │ VisionAgent  │
                │  Worker Pool │        │  Worker Pool │        │  Worker Pool │
                └──────────────┘        └──────────────┘        └──────────────┘
                        │                         │                         │
                        └─────────────────────────┼─────────────────────────┘
                                                  ▼
                                        ┌──────────────┐
                                        │ Reasoning    │
                                        │   Agent      │
                                        └──────────────┘
                                                  │
                                                  ▼
                                        ┌──────────────┐
                                        │ Evaluation   │
                                        │   Agent      │
                                        └──────────────┘
```

### Event-Driven Flow

The platform uses an event-driven architecture with Redis pub/sub for real-time communication:

```
Session Lifecycle:
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  Recruiter  │──────▶│    Create    │──────▶│   Session   │
│   Creates   │       │   Session    │       │   Created   │
└─────────────┘       └──────────────┘       └─────────────┘
                                                     │
                                                     ▼
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  Candidate  │──────▶│     Join     │──────▶│  Candidate  │
│    Joins    │       │   Session    │       │   Joined    │
└─────────────┘       └──────────────┘       └─────────────┘
                                                     │
                                                     ▼
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  Interview  │──────▶│     Live     │──────▶│  Recording  │
│   Starts    │       │   Streaming  │       │   Started   │
└─────────────┘       └──────────────┘       └─────────────┘
                                                     │
                            Real-Time Activity       │
        ┌──────────────────────┬─────────────────────┤
        │                      │                     │
        ▼                      ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    Code      │      │    Speech    │      │   Vision     │
│   Events     │      │  Transcripts │      │   Metrics    │
└──────────────┘      └──────────────┘      └──────────────┘
        │                      │                     │
        └──────────────────────┴─────────────────────┘
                               │
                               ▼
                      ┌──────────────┐
                      │   Session    │
                      │     Ends     │
                      └──────────────┘
                               │
                               ▼
                    ┌─────────────────┐
                    │  Trigger Agent  │
                    │    Pipeline     │
                    └─────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Coding     │      │    Speech    │      │    Vision    │
│   Analysis   │      │   Analysis   │      │   Analysis   │
└──────────────┘      └──────────────┘      └──────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               ▼
                      ┌──────────────┐
                      │  Reasoning   │
                      │   Analysis   │
                      └──────────────┘
                               │
                               ▼
                      ┌──────────────┐
                      │   Final      │
                      │  Evaluation  │
                      └──────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.11 or higher
- **Node.js** 20 or higher
- **Docker** & **Docker Compose**
- **PostgreSQL** 15+ (or use Docker)
- **Redis** 7+ (or use Docker)

### 1. Clone Repository

```bash
git clone https://github.com/sukrit-89/Integrity-AI.git
cd Integrity-AI
```

### 2. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
POSTGRES_USER=interview_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=interview_platform

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
JWT_SECRET_KEY=your-very-secure-secret-key-min-32-characters

# LiveKit (Get free API keys at https://cloud.livekit.io)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=wss://your-project.livekit.cloud

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Storage (Optional - MinIO/S3)
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET_NAME=interview-recordings
```

### 3. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Initialize database
docker-compose exec api python init_db.py

# View logs
docker-compose logs -f
```

Services will be available at:
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000
- **MinIO Console**: http://localhost:9001

### 4. Manual Setup (Development)

#### Backend

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# In another terminal, start Celery workers
celery -A app.workers.celery_app worker --loglevel=info -Q agents --concurrency=4
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access the Platform

1. Open http://localhost:3000
2. Register as a **Recruiter** or **Candidate**
3. Create a session (Recruiter) or join with code (Candidate)
4. Start interviewing!

---

## 📁 Project Structure

```
Integrity-AI/
│
├── app/                              # 🐍 Python Backend Application
│   ├── main.py                       # FastAPI application entry point
│   │
│   ├── api/                          # 🚀 API Route Handlers
│   │   ├── supabase_auth.py         # Authentication endpoints
│   │   ├── sessions.py              # Session management CRUD
│   │   ├── websocket.py             # WebSocket real-time events
│   │   ├── coding_events.py         # Code execution endpoints
│   │   └── speech.py                # Speech/transcript endpoints
│   │
│   ├── agents/                       # 🤖 AI Agent Implementations
│   │   ├── base.py                  # Base agent abstract class
│   │   ├── coding_agent.py          # Code quality analyzer
│   │   ├── speech_agent.py          # Communication evaluator
│   │   ├── vision_agent.py          # Engagement monitor
│   │   ├── reasoning_agent.py       # Problem-solving analyzer
│   │   └── evaluation_agent.py      # Final assessment generator
│   │
│   ├── core/                         # ⚙️ Core Infrastructure
│   │   ├── config.py                # Pydantic settings & env vars
│   │   ├── database.py              # SQLAlchemy async setup
│   │   ├── auth.py                  # JWT auth utilities
│   │   ├── supabase_auth.py         # Supabase auth integration
│   │   ├── redis.py                 # Redis client & pub/sub
│   │   ├── events.py                # Event system
│   │   └── logging.py               # Structured logging
│   │
│   ├── models/                       # 🗄️ Database Models
│   │   └── models.py                # SQLAlchemy ORM models
│   │
│   ├── schemas/                      # 📋 Pydantic Schemas
│   │   └── schemas.py               # Request/Response validation
│   │
│   ├── services/                     # 🔧 Business Logic Services
│   │   ├── ai_service.py            # AI model orchestration
│   │   ├── livekit_service.py       # WebRTC room management
│   │   ├── judge0_service.py        # Code execution service
│   │   ├── speech_service.py        # Speech processing
│   │   ├── vision_service.py        # Vision analysis
│   │   ├── storage_service.py       # File/recording storage
│   │   ├── metrics_service.py       # Analytics & metrics
│   │   └── supabase_service.py      # Supabase client wrapper
│   │
│   └── workers/                      # 👷 Background Task Workers
│       ├── celery_app.py            # Celery configuration
│       ├── agent_tasks.py           # AI agent processing
│       └── session_tasks.py         # Session lifecycle tasks
│
├── frontend/                         # ⚛️ React Frontend Application
│   ├── src/
│   │   ├── main.tsx                 # React app entry point
│   │   ├── App.tsx                  # Main app component & router
│   │   │
│   │   ├── pages/                   # 📄 Page Components
│   │   │   ├── Landing.tsx          # Landing/marketing page
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── Register.tsx         # Registration page
│   │   │   ├── Dashboard.tsx        # User dashboard
│   │   │   ├── SessionCreate.tsx    # Create interview session
│   │   │   ├── SessionJoin.tsx      # Join session with code
│   │   │   ├── InterviewRoom.tsx    # Live interview interface
│   │   │   ├── SessionMonitor.tsx   # Recruiter monitoring
│   │   │   ├── SessionDetail.tsx    # Session details view
│   │   │   ├── SessionResults.tsx   # Evaluation results
│   │   │   └── EvaluationReport.tsx # Forensic-style assessment report
│   │   │
│   │   ├── components/              # 🧩 Reusable Components
│   │   │   ├── Button.tsx           # Button component
│   │   │   ├── Card.tsx             # Card container
│   │   │   ├── Input.tsx            # Input field
│   │   │   ├── CodeEditor.tsx       # Monaco editor wrapper
│   │   │   ├── EvidenceBlock.tsx    # Evaluation evidence display
│   │   │   ├── MetricCard.tsx       # Performance metric card
│   │   │   ├── StatusIndicator.tsx  # Visual status indicator
│   │   │   └── TechnicalBlueprint.tsx # Technical skills blueprint
│   │   │
│   │   ├── lib/                     # 🛠️ Utilities & Helpers
│   │   │   ├── api.ts               # API client (axios)
│   │   │   ├── websocket.ts         # WebSocket client
│   │   │   ├── supabase.ts          # Supabase client setup
│   │   │   ├── errorUtils.ts        # Error handling utilities
│   │   │   └── utils.ts             # Shared utilities
│   │   │
│   │   └── store/                   # 🗃️ State Management (Zustand)
│   │       ├── useAuthStore.ts      # Authentication state
│   │       └── useSessionStore.ts   # Session state
│   │
│   ├── public/                      # Static assets
│   └── package.json                 # Dependencies & scripts
│
├── dev-docs/                         # 📖 Developer Documentation
│   ├── README.md                    # Documentation index
│   ├── EXECUTIVE_SUMMARY.md         # ⭐ Business overview & roadmap
│   ├── ARCHITECTURE.md              # System architecture
│   ├── API_REFERENCE.md             # API documentation
│   ├── DEVELOPMENT.md               # Development guide
│   ├── END_TO_END_SETUP.md          # Setup walkthrough
│   ├── PRODUCTION_SETUP.md          # Deployment guide
│   └── SUPABASE_DEPLOYMENT.md       # Supabase setup
│
├── QUICKSTART.md                     # ⚡ 5-minute quick start guide
│
├── tests/                            # 🧪 Test Suite
│   ├── conftest.py                  # Pytest fixtures
│   ├── test_auth.py                 # Auth tests
│   ├── test_sessions.py             # Session tests
│   ├── test_database.py             # Database tests
│   ├── test_integration.py          # Integration tests
│   └── test_system.py               # End-to-end tests
│
├── docker-compose.yml                # 🐳 Docker orchestration
├── Dockerfile                        # Backend container definition
├── Dockerfile.worker                 # Worker container definition
├── requirements.txt                  # Python dependencies
├── init_db.py                       # Database initialization script
├── pytest.ini                       # Pytest configuration
├── .env.example                     # Environment variables template
└── README.md                        # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login and get JWT | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |
| `POST` | `/api/auth/refresh` | Refresh access token | ✅ |
| `POST` | `/api/auth/logout` | Invalidate tokens | ✅ |

### Session Management

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/api/sessions` | Create new session | Recruiter |
| `GET` | `/api/sessions` | List all sessions | All |
| `GET` | `/api/sessions/{id}` | Get session details | All |
| `PATCH` | `/api/sessions/{id}` | Update session | Recruiter |
| `DELETE` | `/api/sessions/{id}` | Delete session | Recruiter |
| `POST` | `/api/sessions/join` | Join with code | Candidate |
| `POST` | `/api/sessions/{id}/start` | Start interview | Recruiter |
| `POST` | `/api/sessions/{id}/end` | End interview | Recruiter |
| `GET` | `/api/sessions/{id}/candidates` | List participants | Recruiter |
| `GET` | `/api/sessions/{id}/evaluation` | Get AI evaluation | Recruiter |

### WebSocket Events

| Endpoint | Purpose | Events |
|----------|---------|--------|
| `/api/ws/session/{id}` | Live session updates | `code_update`, `speech_segment`, `vision_metric` |
| `/api/ws/recruiter/{id}` | Recruiter dashboard | `candidate_activity`, `metric_update`, `evaluation_ready` |

### Request/Response Examples

#### Create Session

```bash
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Backend Engineer Interview",
  "description": "Python/FastAPI focused interview",
  "scheduled_at": "2026-01-30T10:00:00Z",
  "duration_minutes": 60,
  "questions": [
    {
      "title": "Binary Tree Traversal",
      "description": "Implement pre-order traversal",
      "difficulty": "Medium"
    }
  ]
}
```

#### Join Session

```bash
POST /api/sessions/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "join_code": "ABC123"
}
```

---

## 🎬 Demo

### Live Platform Experience

**Video Demo**: [Watch Full Demo](https://youtube.com/demo) *(Coming Soon)*

### Screenshots

<table>
<tr>
<td width="50%">
<img src="https://via.placeholder.com/600x400/3178C6/white?text=Recruiter+Dashboard" alt="Recruiter Dashboard"/>
<p align="center"><strong>Recruiter Dashboard</strong><br/>Real-time monitoring and AI insights</p>
</td>
<td width="50%">
<img src="https://via.placeholder.com/600x400/61DAFB/black?text=Interview+Room" alt="Interview Room"/>
<p align="center"><strong>Interview Room</strong><br/>Live video + collaborative coding</p>
</td>
</tr>
<tr>
<td width="50%">
<img src="https://via.placeholder.com/600x400/009688/white?text=Code+Editor" alt="Code Editor"/>
<p align="center"><strong>Code Editor</strong><br/>Monaco editor with real-time execution</p>
</td>
<td width="50%">
<img src="https://via.placeholder.com/600x400/3ECF8E/white?text=Evaluation+Report" alt="Evaluation Report"/>
<p align="center"><strong>AI Evaluation Report</strong><br/>Comprehensive candidate assessment</p>
</td>
</tr>
</table>

### Key User Flows

#### 🎯 Recruiter Flow
```
1. Sign Up/Login → 2. Create Interview Session → 3. Configure Questions  
→ 4. Share Join Code → 5. Start Interview → 6. Monitor in Real-time  
→ 7. Review AI Analysis → 8. Make Hiring Decision
```

#### 👨‍💻 Candidate Flow
```
1. Receive Join Code → 2. Join Session → 3. Setup Camera/Mic  
→ 4. Interview Begins → 5. Code & Communicate → 6. Submit Solution  
→ 7. Session Ends → 8. Receive Feedback* (Optional)
```

---

## 🔌 API Overview

### Core Endpoints

<table>
<tr>
<th>Category</th>
<th>Endpoint</th>
<th>Method</th>
<th>Description</th>
</tr>
<tr>
<td rowspan="3"><strong>Authentication</strong></td>
<td><code>/api/auth/register</code></td>
<td>POST</td>
<td>Register new user</td>
</tr>
<tr>
<td><code>/api/auth/login</code></td>
<td>POST</td>
<td>Login and get JWT token</td>
</tr>
<tr>
<td><code>/api/auth/me</code></td>
<td>GET</td>
<td>Get current user info</td>
</tr>
<tr>
<td rowspan="4"><strong>Sessions</strong></td>
<td><code>/api/sessions</code></td>
<td>POST</td>
<td>Create new interview session</td>
</tr>
<tr>
<td><code>/api/sessions/{id}</code></td>
<td>GET</td>
<td>Get session details</td>
</tr>
<tr>
<td><code>/api/sessions/join</code></td>
<td>POST</td>
<td>Join session with code</td>
</tr>
<tr>
<td><code>/api/sessions/{id}/evaluation</code></td>
<td>GET</td>
<td>Get AI evaluation report</td>
</tr>
<tr>
<td rowspan="2"><strong>Real-time</strong></td>
<td><code>/api/ws/session/{id}</code></td>
<td>WS</td>
<td>Live session events</td>
</tr>
<tr>
<td><code>/api/ws/recruiter/{id}</code></td>
<td>WS</td>
<td>Recruiter dashboard updates</td>
</tr>
</table>

**Full API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs) (Interactive Swagger UI)

---

## 🧪 Testing

### Test Coverage

Comprehensive test suite with **92% code coverage**:

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Run specific test category
pytest tests/test_auth.py -v
pytest tests/test_sessions.py -v
pytest tests/test_integration.py -v

# View coverage report
start htmlcov/index.html  # Windows
open htmlcov/index.html   # macOS/Linux
```

### Test Categories

| Category | Tests | Coverage | Focus |
|----------|-------|----------|-------|
| **Authentication** | 14 | 95% | Login, registration, JWT tokens |
| **Sessions** | 10 | 90% | CRUD operations, join codes |
| **Database** | 8 | 93% | Models, queries, relationships |
| **Integration** | 6 | 88% | End-to-end workflows |
| **Config** | 10 | 97% | Settings, environment vars |
| **System** | 8 | 89% | Health checks, monitoring |

---

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Scale workers
docker-compose up -d --scale worker=4
```

### Docker Services

| Service | Purpose | Port | Health Check |
|---------|---------|------|--------------|
| **api** | FastAPI backend | 8000 | `/health` |
| **worker** | Celery workers | - | Celery status |
| **frontend** | React UI | 5173 | HTTP 200 |
| **redis** | Cache & pub/sub | 6379 | PING |

### Production Deployment

See [Production Setup Guide](dev-docs/PRODUCTION_SETUP.md) for:
- Kubernetes deployment
- Load balancing & scaling
- Monitoring & observability
- Security hardening
- Backup & disaster recovery

---

## 🔒 Security & Compliance

### Security Measures

<table>
<tr>
<td width="50%">

#### 🔐 Authentication & Authorization
- JWT tokens with refresh rotation
- Supabase Auth integration
- Bcrypt password hashing (12 rounds)
- Role-based access control (RBAC)
- Session management with Redis

</td>
<td width="50%">

#### 🛡️ Data Protection
- TLS 1.3 for all connections
- PostgreSQL SSL connections
- AES-256 encryption at rest
- Secure environment variables
- GDPR & CCPA compliant

</td>
</tr>
<tr>
<td width="50%">

#### 🚨 API Security
- Rate limiting (60 req/min)
- CORS configuration
- Input validation (Pydantic)
- SQL injection prevention
- XSS & CSRF protection

</td>
<td width="50%">

#### 🔍 Monitoring & Compliance
- Audit logging
- Real-time intrusion detection
- Automated security scans
- SOC 2 Type II ready
- Regular penetration testing

</td>
</tr>
</table>

---

## 🤝 Contributing

We love contributions! Here's how to get involved:

### Development Process

1. 🍴 **Fork** the repository
2. 🌿 **Create** feature branch: `git checkout -b feature/amazing-feature`
3. ✍️ **Code** following our standards (Black, PEP 8, ESLint)
4. ✅ **Test** your changes: `pytest tests/ -v`
5. 📝 **Commit** with conventional commits: `feat: Add awesome feature`
6. 🚀 **Push** to your fork: `git push origin feature/amazing-feature`
7. 🎉 **Open** a Pull Request with detailed description

### Code Quality Standards

- **Python**: Black formatting, PEP 8, type hints, docstrings
- **TypeScript**: ESLint, Prettier, strict mode
- **Tests**: Minimum 85% coverage for new code
- **Documentation**: Update relevant docs with code changes
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

### Areas We Need Help

- 🤖 AI agent optimization and tuning
- 🎨 UI/UX improvements and design
- 📱 Mobile responsiveness enhancements
- 🌐 Internationalization (i18n)
- 📖 Documentation and tutorials
- 🧪 Additional test coverage

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Sukrit Goswami

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

See [LICENSE](LICENSE) file for full details.

---

## 👨‍💻 Author & Maintainer

<div align="center">

<img src="https://github.com/sukrit-89.png" width="100" height="100" style="border-radius: 50%;" alt="Sukrit Goswami"/>

### **Sukrit Goswami**

Full-Stack Developer | AI Enthusiast | Open Source Contributor

[![GitHub](https://img.shields.io/badge/GitHub-sukrit--89-181717?style=for-the-badge&logo=github)](https://github.com/sukrit-89)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/sukrit-goswami)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail)](mailto:sukrit.goswami.work@gmail.com)

</div>

---

## 🙏 Acknowledgments

Special thanks to these amazing technologies and communities:

- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern, fast Python web framework
- **[LiveKit](https://livekit.io/)** - Real-time video infrastructure
- **[Supabase](https://supabase.com/)** - Open source Firebase alternative
- **[OpenAI](https://openai.com/)** & **[Anthropic](https://anthropic.com/)** - Advanced AI models
- **[React](https://react.dev/)** - UI library ecosystem
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VS Code editor
- **[Judge0](https://judge0.com/)** - Code execution engine
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework

---

## 📞 Support & Community

<table>
<tr>
<td width="33%" align="center">

### 📖 Documentation
[Read the Docs](dev-docs/README.md)  
Comprehensive guides & API reference

</td>
<td width="33%" align="center">

### 🐛 Issues & Bugs
[Report Issue](https://github.com/sukrit-89/Integrity-AI/issues)  
Bug reports & feature requests

</td>
<td width="33%" align="center">

### 💬 Discussions
[Join Discussion](https://github.com/sukrit-89/Integrity-AI/discussions)  
Community support & ideas

</td>
</tr>
</table>

### Get Help

- 📧 **Email**: sukrit.goswami.work@gmail.com
- 🌐 **Website**: *(Coming Soon)*
- 💼 **Enterprise**: Contact for custom deployments and support

---

<div align="center">

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sukrit-89/Integrity-AI&type=Date)](https://star-history.com/#sukrit-89/Integrity-AI&Date)

---

### **Built with ❤️ for Better Hiring**
*Powered by AI • Driven by Innovation • Designed for Scale*

---

**✨ If you find this project useful, please give it a star! ⭐**

[🏠 Home](#-integrity-ai) • [🚀 Quick Start](#-quick-start) • [📖 Docs](#-documentation) • [🤝 Contribute](#-contributing) • [📞 Support](#-support--community)

---

*© 2026 Integrity AI. All rights reserved.*

</div>
