# Quick Start — Neeti AI

Get the platform running in **under 5 minutes**.

## Prerequisites

| Tool | Why | Get it |
|------|-----|--------|
| **Docker Desktop** | Runs API, Postgres, Redis | https://docker.com/products/docker-desktop |
| **Node.js 18+** | Frontend dev server | https://nodejs.org |
| **Supabase project** | Auth + database | https://supabase.com (free) |
| **LiveKit Cloud** | Video/audio (WebRTC) | https://cloud.livekit.io (free) |

## 1 — Clone & configure

```bash
git clone https://github.com/sukrit-89/Neeti-AI.git
cd Neeti-AI
```

Create a `.env` in the project root:

```env
# ── Required ──────────────────────────────────
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

LIVEKIT_API_KEY=APIxxxxx
LIVEKIT_API_SECRET=xxxxx
LIVEKIT_WS_URL=wss://xxxx.livekit.cloud

JWT_SECRET_KEY=change-me-to-at-least-32-characters

# ── Optional (sensible defaults exist) ────────
OPENAI_API_KEY=sk-...              # AI evaluation (or use Ollama)
JUDGE0_API_URL=http://localhost:2358  # code execution
```

## 2 — Start backend (Docker)

```bash
docker-compose up -d --build
```

This launches **API** (`:8000`), **PostgreSQL**, **Redis**, **Celery workers**, and **MinIO**.

Verify:

```bash
curl http://localhost:8000/health
# → {"status":"healthy","database":"connected","redis":"connected"}
```

## 3 — Start frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — done.

## 4 — Try it out

| Step | Action |
|------|--------|
| 1 | Register as **Recruiter** → `/register` |
| 2 | Register as **Candidate** (incognito tab) |
| 3 | Recruiter: **Create Session** from dashboard |
| 4 | Copy the **6-char join code** |
| 5 | Candidate: **Join Session** with the code |
| 6 | Recruiter: **Start** → both enter the Interview Room |
| 7 | Code, talk, collaborate |
| 8 | Recruiter: **End Session** → AI report auto-generates |

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| MinIO Console | http://localhost:9001 (minioadmin / minioadmin) |

## Stopping

```bash
docker-compose down        # stop services
docker-compose down -v     # stop + delete volumes (full reset)
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 8000 in use | `netstat -ano \| findstr :8000` → kill the PID |
| Supabase connection fails | Double-check URL + keys in `.env` |
| Docker build fails | Run `docker system prune -f` then retry |
| Frontend can't reach API | Ensure backend is healthy first (`curl :8000/health`) |

---

For the full setup guide with all options (Ollama, Judge0 self-hosting, production deployment), see [dev-docs/END_TO_END_SETUP.md](dev-docs/END_TO_END_SETUP.md).
