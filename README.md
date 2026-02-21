<div align="center">

# नीति — Neeti AI

### AI-Powered Technical Interview Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Conduct live technical interviews with real-time video, collaborative code editing, and autonomous multi-agent AI evaluation — from a 6-character join code to a forensic hiring report.**

[Quick Start](#-quick-start) · [Features](#-features) · [Architecture](#-architecture) · [API Reference](#-api-reference) · [Docs](dev-docs/)

</div>

---

## Why Neeti AI?

> **नीति** (Neeti) = Ethics / Integrity in Sanskrit — because hiring decisions should be fair, data-driven, and transparent.

Most interview platforms make you choose between *live interaction* and *AI analysis*. Neeti AI does both simultaneously. Five autonomous agents observe the session in real time and produce a detailed, evidence-backed evaluation the moment the interview ends.

---

## ✨ Features

### Live Interview Experience

- **WebRTC Video/Audio** — sub-second latency via LiveKit, multi-participant rooms
- **Collaborative Code Editor** — Monaco (VS Code engine) with syntax highlighting, IntelliSense, and real-time sync
- **Sandboxed Code Execution** — Judge0 integration supporting 50+ languages
- **6-Character Join Code** — candidates join from any browser, no install required
- **Role-Based UI** — recruiters see dashboards and controls; candidates see the interview flow

### Multi-Agent AI Evaluation

Five specialized agents run in parallel during and after each session:

| Agent | What it evaluates |
|-------|-------------------|
| **Coding** | Code quality, algorithm efficiency, best practices, language proficiency |
| **Speech** | Clarity, technical vocabulary, ability to explain approach, confidence |
| **Vision** | Engagement, attention span, body language signals |
| **Reasoning** | Logical flow, problem decomposition, adaptability |
| **Evaluation** | Cross-agent synthesis → final score, hiring recommendation, forensic report |

### Recruiter Tools

- **Live Monitoring Dashboard** — watch AI metrics and integrity flags in real time
- **Session Management** — create, schedule, start, end, and review sessions
- **Evaluation Reports** — per-candidate breakdowns with strengths, risks, and evidence
- **Role-Based Access Control** — route guards on both frontend and API

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 · TypeScript 5.9 · Vite · TailwindCSS · Zustand · Monaco Editor · LiveKit React |
| **Backend** | FastAPI · Python 3.11 · SQLAlchemy 2.0 (async) · Pydantic v2 · Celery |
| **Database** | PostgreSQL 15 (via Supabase) · Redis 7 (cache + pub/sub) |
| **Auth** | Supabase Auth (JWT with refresh rotation) |
| **Video** | LiveKit Cloud (WebRTC SFU) |
| **Code Exec** | Judge0 (sandboxed, 50+ languages) |
| **AI** | OpenAI GPT-4 → Ollama (local) → rule-based fallback |
| **Infra** | Docker Compose · MinIO (S3-compatible storage) |

---

## 🚀 Quick Start

> Full walkthrough with all options → **[QUICKSTART.md](QUICKSTART.md)**

### Prerequisites

Docker Desktop · Node.js 18+ · [Supabase project](https://supabase.com) · [LiveKit Cloud account](https://cloud.livekit.io)

### 1. Clone & configure

```bash
git clone https://github.com/sukrit-89/Neeti-AI.git
cd Neeti-AI
```

Create `.env` in the project root with your Supabase + LiveKit credentials (see [QUICKSTART.md](QUICKSTART.md) for the full template).

### 2. Start backend

```bash
docker-compose up -d --build
curl http://localhost:8000/health
# → {"status":"healthy","database":"connected","redis":"connected"}
```

### 3. Start frontend

```bash
cd frontend && npm install && npm run dev
```

Open **http://localhost:5173** — register, create a session, and start interviewing.

---

## 📁 Project Structure

```
neeti-ai/
│
├── app/                            # FastAPI backend
│   ├── api/                        # Route handlers
│   │   ├── supabase_auth.py        #   register / login / me / refresh / logout
│   │   ├── sessions.py             #   CRUD + join / start / end / token
│   │   ├── coding_events.py        #   code execution + event tracking
│   │   ├── speech.py               #   speech transcription
│   │   └── websocket.py            #   real-time WebSocket events
│   │
│   ├── agents/                     # AI evaluation agents
│   │   ├── base.py                 #   abstract base class
│   │   ├── coding_agent.py         #   code quality analysis
│   │   ├── speech_agent.py         #   communication scoring
│   │   ├── vision_agent.py         #   engagement monitoring
│   │   ├── reasoning_agent.py      #   problem-solving analysis
│   │   └── evaluation_agent.py     #   final score + recommendation
│   │
│   ├── core/                       # Infrastructure
│   │   ├── config.py               #   Pydantic settings (env-driven)
│   │   ├── database.py             #   SQLAlchemy async engine + session
│   │   ├── supabase_auth.py        #   JWT validation
│   │   ├── redis.py                #   Redis connection
│   │   ├── events.py               #   Redis pub/sub event helpers
│   │   └── logging.py              #   JSON structured logging
│   │
│   ├── models/models.py            # SQLAlchemy ORM models
│   ├── schemas/schemas.py          # Pydantic v2 request/response schemas
│   │
│   ├── services/                   # Business logic
│   │   ├── ai_service.py           #   multi-provider AI orchestration
│   │   ├── judge0_service.py       #   sandboxed code execution
│   │   ├── livekit_service.py      #   WebRTC room + token management
│   │   ├── speech_service.py       #   Whisper speech-to-text
│   │   ├── vision_service.py       #   OpenAI Vision frame analysis
│   │   ├── realtime_service.py     #   Redis / Supabase broadcast
│   │   ├── storage_service.py      #   S3 / MinIO file storage
│   │   ├── metrics_service.py      #   real-time analytics
│   │   └── supabase_service.py     #   Supabase client wrapper
│   │
│   └── workers/                    # Celery background tasks
│       ├── celery_app.py
│       ├── agent_tasks.py
│       └── session_tasks.py
│
├── frontend/                       # React 19 + TypeScript
│   └── src/
│       ├── App.tsx                  #   router + ErrorBoundary + route guards
│       ├── pages/                   #   11 route-level pages
│       ├── components/              #   reusable UI (Button, Card, CodeEditor…)
│       ├── store/                   #   Zustand (auth, session, interview)
│       └── lib/                     #   API client, WebSocket, utilities
│
├── tests/                          # Pytest suite
├── migrations/                     # SQL migration scripts
├── dev-docs/                       # Developer documentation (7 guides)
│
├── docker-compose.yml              # API + Postgres + Redis + Workers + MinIO
├── Dockerfile / Dockerfile.worker  # Container definitions
├── init_db.py                      # DB table creation
├── reset_all.py                    # Full system reset (dev utility)
├── cleanup_database.py             # Wipe data, keep auth users
├── QUICKSTART.md                   # 5-minute setup guide
└── requirements.txt                # Python dependencies
```

---

## 🔌 API Reference

### Authentication (Supabase)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Get access + refresh token |
| `GET`  | `/api/auth/me` | Current user profile |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Invalidate session |

### Sessions

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/api/sessions` | Create session | Recruiter |
| `GET`  | `/api/sessions` | List sessions | All |
| `GET`  | `/api/sessions/{id}` | Session detail | All |
| `POST` | `/api/sessions/join` | Join with code | Candidate |
| `POST` | `/api/sessions/{id}/start` | Start interview | Recruiter |
| `POST` | `/api/sessions/{id}/end` | End interview | Recruiter |
| `GET`  | `/api/sessions/{id}/token` | LiveKit room token | All |
| `GET`  | `/api/sessions/{id}/evaluation` | AI evaluation report | Recruiter |

### Code Execution

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/coding-events` | Record coding event |
| `POST` | `/api/coding-events/execute` | Execute code (Judge0) |
| `GET`  | `/api/coding-events/{session_id}` | Event history |

### WebSocket

| Endpoint | Purpose |
|----------|---------|
| `/api/ws/session/{id}` | Live session events (code sync, metrics, flags) |

Full interactive docs → **http://localhost:8000/docs**

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Browser — React 19 + TypeScript + Vite                      │
│  (Zustand stores • LiveKit video • Monaco editor)            │
└──────────────────────┬───────────────────────────────────────┘
                       │  REST (Axios) + WebSocket
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  FastAPI — Python 3.11 (async)                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐      │
│  │ Auth API │ │ Session  │ │ Coding   │ │ WebSocket  │      │
│  │(Supabase)│ │  API     │ │ Events   │ │  Events    │      │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘      │
└──────┬──────────┬──────────┬──────────┬──────────────────────┘
       │          │          │          │
  ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐
  │Supabase│ │Postgres│ │ Redis  │ │LiveKit │
  │ Auth   │ │  15    │ │   7    │ │ (SFU)  │
  └────────┘ └────────┘ └───┬────┘ └────────┘
                            │
                    ┌───────▼───────┐
                    │ Celery Workers │
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                  ▼
   ┌─────────────┐  ┌─────────────┐   ┌─────────────┐
   │CodingAgent  │  │SpeechAgent  │   │VisionAgent  │
   └──────┬──────┘  └──────┬──────┘   └──────┬──────┘
          └─────────────────┼─────────────────┘
                            ▼
                   ┌─────────────────┐
                   │ ReasoningAgent  │
                   └────────┬────────┘
                            ▼
                   ┌─────────────────┐
                   │EvaluationAgent  │
                   │  (final report) │
                   └─────────────────┘
```

---

## 🧑‍💻 Development

### Manual backend (without Docker)

```bash
python -m venv venv && .\venv\Scripts\activate   # Windows
pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload --port 8000
```

### Celery workers

```bash
celery -A app.workers.celery_app worker --loglevel=info -Q agents --concurrency=4
```

### Tests

```bash
pytest tests/ -v
pytest tests/ --cov=app --cov-report=html
```

### Dev utilities

```bash
python cleanup_database.py   # wipe data, keep Supabase auth users
python reset_all.py          # full nuke — all auth users + all data
```

---

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `SUPABASE_URL` | ✅ | — | Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | — | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | — | Supabase service role key |
| `LIVEKIT_API_KEY` | ✅ | — | LiveKit API key |
| `LIVEKIT_API_SECRET` | ✅ | — | LiveKit API secret |
| `LIVEKIT_WS_URL` | ✅ | — | LiveKit WebSocket URL (`wss://...`) |
| `JWT_SECRET_KEY` | ✅ | — | Min 32-char secret for tokens |
| `OPENAI_API_KEY` | — | — | GPT-4 for AI agents |
| `ANTHROPIC_API_KEY` | — | — | Claude fallback |
| `JUDGE0_API_URL` | — | — | Judge0 base URL for code execution |
| `JUDGE0_API_KEY` | — | — | Judge0 API key (if using RapidAPI) |
| `REDIS_HOST` | — | `localhost` | Redis hostname |
| `REDIS_PORT` | — | `6379` | Redis port |
| `POSTGRES_USER` | — | `interview_user` | Postgres username |
| `POSTGRES_PASSWORD` | — | `changeme` | Postgres password |
| `USE_OLLAMA` | — | `false` | Use local Ollama LLM instead of OpenAI |

---

## 📚 Documentation

| Guide | For | Time |
|-------|-----|------|
| **[QUICKSTART.md](QUICKSTART.md)** | Getting running fast | 5 min |
| [Architecture](dev-docs/ARCHITECTURE.md) | System design & data flow | 20 min |
| [API Reference](dev-docs/API_REFERENCE.md) | Full endpoint docs | 30 min |
| [Development Guide](dev-docs/DEVELOPMENT.md) | Local dev setup | 15 min |
| [End-to-End Setup](dev-docs/END_TO_END_SETUP.md) | Complete walkthrough | 15 min |
| [Production Setup](dev-docs/PRODUCTION_SETUP.md) | Docker deployment | 25 min |
| [Supabase Deployment](dev-docs/SUPABASE_DEPLOYMENT.md) | Supabase config | 10 min |
| [Executive Summary](dev-docs/EXECUTIVE_SUMMARY.md) | Business overview | 15 min |

---

## 👤 Author

**Sukrit Goswami**

- Email: sukrit.goswami.work@gmail.com
- GitHub: [@sukrit-89](https://github.com/sukrit-89)

---

## 📄 License

[MIT](LICENSE) — use it, fork it, build on it.
