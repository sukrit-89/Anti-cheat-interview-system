<div align="center">

<br />

<img src="https://img.shields.io/badge/%E0%A4%A8%E0%A5%80%E0%A4%A4%E0%A4%BF-Neeti_AI-D4873F?style=for-the-badge&labelColor=0A0A0D" alt="Neeti AI" height="40" />

<br /><br />

<h3>AI-Powered Technical Interview Intelligence Platform</h3>

<p align="center">
  <em>Five autonomous AI agents evaluate candidates in real time — from a 6-character join code to a forensic hiring report.</em>
</p>

<br />

<p>
  <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://docker.com"><img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" /></a>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License" />
</p>

<p>
  <a href="#-quick-start">Quick Start</a> · 
  <a href="#-features">Features</a> · 
  <a href="#-architecture">Architecture</a> · 
  <a href="#-api-reference">API</a> · 
  <a href="dev-docs/">Full Docs</a> · 
  <a href="https://github.com/sukrit-89/Anti-cheat-interview-system/issues">Issues</a>
</p>

</div>

<br />

---

## Why Neeti AI?

> **नीति** (Neeti) = *Ethics / Integrity* in Sanskrit — because hiring decisions should be fair, evidence-based, and transparent.

Most interview platforms force a choice between **live interaction** and **AI analysis**. Neeti AI does both simultaneously. Five autonomous agents observe the entire session in real time and produce a detailed, evidence-backed evaluation the moment the interview ends.

**No bias. No guesswork. Just data.**

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎥 Live Interview Experience

- **WebRTC Video/Audio** — sub-second latency via LiveKit
- **Collaborative Code Editor** — Monaco (VS Code engine), real-time sync
- **Sandboxed Code Execution** — Judge0, 50+ languages
- **6-Character Join Code** — candidates join from any browser
- **Role-Based UI** — recruiter dashboards + candidate interview flow

</td>
<td width="50%">

### 🤖 Multi-Agent AI Evaluation

Five specialized agents run in parallel:

| Agent | Evaluates |
|:------|:----------|
| **Coding** | Code quality, algorithms, best practices |
| **Speech** | Clarity, vocabulary, explanation ability |
| **Vision** | Engagement, attention, body language |
| **Reasoning** | Logic flow, problem decomposition |
| **Evaluation** | Cross-agent synthesis → final verdict |

</td>
</tr>
</table>

### 📊 Recruiter Tools

- **Live Monitoring** — watch AI metrics and integrity flags in real time
- **Session Management** — create, schedule, start, end, review
- **Forensic Reports** — per-candidate breakdowns with strengths, risks, and evidence
- **Role-Based Access** — route guards on frontend and API

---

## 🛠 Tech Stack

<table>
<tr><td><b>Frontend</b></td><td>React 19 · TypeScript 5.9 · Vite · TailwindCSS · Zustand · Monaco Editor · LiveKit React</td></tr>
<tr><td><b>Backend</b></td><td>FastAPI · Python 3.11 · SQLAlchemy 2.0 (async) · Pydantic v2 · Celery</td></tr>
<tr><td><b>Database</b></td><td>PostgreSQL 15 (Supabase) · Redis 7 (cache + pub/sub)</td></tr>
<tr><td><b>Auth</b></td><td>Supabase Auth (JWT with refresh rotation)</td></tr>
<tr><td><b>Video</b></td><td>LiveKit Cloud (WebRTC SFU)</td></tr>
<tr><td><b>Code Exec</b></td><td>Judge0 (sandboxed, 50+ languages)</td></tr>
<tr><td><b>AI</b></td><td>OpenAI GPT-4 → Ollama (local) → rule-based fallback</td></tr>
<tr><td><b>Infra</b></td><td>Docker Compose · Nginx · MinIO (S3-compatible)</td></tr>
</table>

---

## 🚀 Quick Start

> **Full walkthrough** → [QUICKSTART.md](QUICKSTART.md)

### Prerequisites

Docker Desktop · Node.js 18+ · [Supabase project](https://supabase.com) · [LiveKit Cloud](https://cloud.livekit.io)

### 1. Clone & configure

```bash
git clone https://github.com/sukrit-89/Anti-cheat-interview-system.git
cd Anti-cheat-interview-system
```

Create `.env` in the project root (see [QUICKSTART.md](QUICKSTART.md) for the full template):

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
LIVEKIT_API_KEY=APIxxxxx
LIVEKIT_API_SECRET=xxxxx
LIVEKIT_WS_URL=wss://xxxx.livekit.cloud
```

### 2. Launch everything

```bash
docker-compose up -d --build
```

This starts **API** (`:8000`), **Frontend** (`:3000`), **PostgreSQL**, **Redis**, **Celery workers**, **MinIO**, and **Ollama**.

```bash
curl http://localhost:8000/health
# → {"status":"healthy","database":"connected","redis":"connected"}
```

### 3. Open the app

| Mode | URL |
|:-----|:----|
| **Production** (Docker) | http://localhost:3000 |
| **Development** (hot-reload) | `cd frontend && npm i && npm run dev` → http://localhost:5173 |

Register → create a session → share the 6-char code → start interviewing.

---

## 📁 Project Structure

```
neeti-ai/
├── app/                          # FastAPI backend
│   ├── api/                      #   Route handlers (auth, sessions, coding, ws)
│   ├── agents/                   #   5 AI evaluation agents
│   ├── core/                     #   Config, database, auth, redis, logging
│   ├── models/                   #   SQLAlchemy ORM models
│   ├── schemas/                  #   Pydantic v2 request/response schemas
│   ├── services/                 #   Business logic (AI, Judge0, LiveKit, S3…)
│   └── workers/                  #   Celery background tasks
│
├── frontend/                     # React 19 + TypeScript
│   ├── src/
│   │   ├── pages/                #   14 route-level pages
│   │   ├── components/           #   UI components (Button, Card, Logo, Footer…)
│   │   ├── store/                #   Zustand stores (auth, session)
│   │   └── lib/                  #   API client, WebSocket, utilities
│   └── Dockerfile                #   Multi-stage: Node build → Nginx
│
├── tests/                        # Pytest suite
├── migrations/                   # SQL migration scripts
├── dev-docs/                     # Developer documentation (8 guides)
│
├── docker-compose.yml            # Full stack orchestration
├── Dockerfile                    # API container
├── Dockerfile.worker             # Celery worker container
├── QUICKSTART.md                 # 5-minute setup guide
└── requirements.txt              # Python dependencies
```

---

## 🔌 API Reference

### Authentication (Supabase)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Get access + refresh token |
| `GET` | `/api/auth/me` | Current user profile |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Invalidate session |

### Sessions

| Method | Endpoint | Description | Role |
|:-------|:---------|:------------|:-----|
| `POST` | `/api/sessions` | Create session | Recruiter |
| `GET` | `/api/sessions` | List sessions | All |
| `GET` | `/api/sessions/{id}` | Session detail | All |
| `POST` | `/api/sessions/join` | Join with code | Candidate |
| `POST` | `/api/sessions/{id}/start` | Start interview | Recruiter |
| `POST` | `/api/sessions/{id}/end` | End interview | Recruiter |
| `GET` | `/api/sessions/{id}/token` | LiveKit room token | All |
| `GET` | `/api/sessions/{id}/evaluation` | AI evaluation report | Recruiter |

### Code Execution

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/coding-events` | Record coding event |
| `POST` | `/api/coding-events/execute` | Execute code (Judge0) |
| `GET` | `/api/coding-events/{session_id}` | Event history |

### WebSocket

| Endpoint | Purpose |
|:---------|:--------|
| `/api/ws/session/{id}` | Live session events (code sync, metrics, flags) |

> **Interactive docs** → http://localhost:8000/docs

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser — React 19 + TypeScript + Vite                         │
│  Zustand stores · LiveKit video · Monaco editor                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST + WebSocket
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  Nginx (frontend container :3000)                                │
│  Static SPA + reverse proxy /api → API container                 │
├──────────────────────────────────────────────────────────────────┤
│  FastAPI — Python 3.11 (async) :8000                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐          │
│  │ Auth API │ │ Sessions │ │ Coding   │ │ WebSocket  │          │
│  │(Supabase)│ │   API    │ │ Events   │ │  Events    │          │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘          │
└──────┬──────────┬──────────┬──────────┬─────────────────────────┘
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

### Run backend locally (without Docker)

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
python reset_all.py          # full reset — all auth users + all data
```

---

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|:---------|:--------:|:--------|:------------|
| `SUPABASE_URL` | ✅ | — | Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | — | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | — | Supabase service role key |
| `LIVEKIT_API_KEY` | ✅ | — | LiveKit API key |
| `LIVEKIT_API_SECRET` | ✅ | — | LiveKit API secret |
| `LIVEKIT_WS_URL` | ✅ | — | LiveKit WebSocket URL |
| `OPENAI_API_KEY` | — | — | GPT-4 for AI agents |
| `ANTHROPIC_API_KEY` | — | — | Claude fallback |
| `JUDGE0_API_URL` | — | — | Judge0 base URL |
| `JUDGE0_API_KEY` | — | — | Judge0 API key (RapidAPI) |
| `REDIS_HOST` | — | `localhost` | Redis hostname |
| `REDIS_PORT` | — | `6379` | Redis port |
| `POSTGRES_USER` | — | `interview_user` | Postgres username |
| `POSTGRES_PASSWORD` | — | `changeme` | Postgres password |
| `USE_OLLAMA` | — | `false` | Use local Ollama instead of OpenAI |

---

## 📚 Documentation

| Guide | What you'll learn | Reading time |
|:------|:------------------|:-------------|
| [**QUICKSTART.md**](QUICKSTART.md) | Get running in 5 minutes | 5 min |
| [Architecture](dev-docs/ARCHITECTURE.md) | System design & data flow | 20 min |
| [API Reference](dev-docs/API_REFERENCE.md) | Full endpoint documentation | 30 min |
| [Development Guide](dev-docs/DEVELOPMENT.md) | Local dev setup & workflow | 15 min |
| [End-to-End Setup](dev-docs/END_TO_END_SETUP.md) | Complete walkthrough | 15 min |
| [Production Setup](dev-docs/PRODUCTION_SETUP.md) | Docker deployment guide | 25 min |
| [Supabase Deployment](dev-docs/SUPABASE_DEPLOYMENT.md) | Supabase configuration | 10 min |
| [Executive Summary](dev-docs/EXECUTIVE_SUMMARY.md) | Business & product overview | 15 min |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 👤 Author

<table>
<tr>
<td>

**Sukrit Goswami**

[![GitHub](https://img.shields.io/badge/GitHub-sukrit--89-181717?style=flat-square&logo=github)](https://github.com/sukrit-89)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sukrit--goswami-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/sukrit-goswami-5558a5321)
[![Twitter](https://img.shields.io/badge/X-@sukritmotion-000000?style=flat-square&logo=x)](https://x.com/sukritmotion)
[![Email](https://img.shields.io/badge/Email-neetiatsuuport-EA4335?style=flat-square&logo=gmail)](mailto:neetiatsuuport@gmail.com)

</td>
</tr>
</table>

---

## 📄 License

[MIT](LICENSE) — use it, fork it, build on it.

<br />

<div align="center">
  <sub>Built with conviction that hiring should be fair. 🇮🇳</sub>
</div>
