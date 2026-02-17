# Quick Start Guide - Integrity AI Interview Platform

## Prerequisites
- Docker Desktop installed and running
- Judge0 running on `localhost:2358` (for code execution)

## Starting the Application

### 1. Start Backend Services
```bash
docker-compose up -d postgres redis minio api
```

This starts:
- **PostgreSQL** (port 5432): Database for sessions, evaluations, and business data
- **Redis** (port 6379): Caching and pub/sub messaging
- **MinIO** (ports 9000, 9001): S3-compatible object storage for recordings
- **API** (port 8000): FastAPI backend with Supabase authentication

### 2. Verify Services are Running
```bash
docker-compose ps
```

All services should show status as "Up" (postgres and redis should show "healthy").

### 3. Check API Health
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "environment": "development",
  "database": "connected",
  "redis": "connected"
}
```

### 4. View API Documentation
Open in browser: http://localhost:8000/docs

This provides interactive Swagger UI for testing all API endpoints.

## Backend Worker Services (Optional)

For background task processing:

```bash
docker-compose up -d worker_agents worker_sessions beat
```

- **worker_agents**: Processes AI agent tasks (coding, evaluation, speech)
- **worker_sessions**: Manages session lifecycle tasks
- **beat**: Celery beat scheduler for periodic tasks

## Stopping the Application

```bash
docker-compose down
```

## Troubleshooting

### API won't start
```bash
# Check logs
docker logs interview_api --tail 50

# Rebuild if needed
docker-compose build api
docker-compose up -d api
```

### Database connection issues
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check logs
docker logs interview_db --tail 20
```

### View all service logs
```bash
docker-compose logs -f
```

## Environment Variables

The application uses `.env` file for configuration. Key variables:

```env
# Authentication - Supabase (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Note: Make sure there are NO leading spaces before variable names!

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT (fallback for development - Supabase handles production auth)
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256

# Judge0 (for code execution)
JUDGE0_URL=http://host.docker.internal:2358

# LiveKit (for video rooms)
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
LIVEKIT_WS_URL=wss://your-project.livekit.cloud
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_LIVEKIT_WS_URL=wss://your-project.livekit.cloud

# Supabase (REQUIRED for authentication)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Frontend Development

The frontend is a Vite + React + TypeScript application.

### Start Frontend Dev Server
```bash
cd frontend
npm install  # First time only
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### Frontend Features
- ✅ Supabase authentication (register, login, logout)
- ✅ Session management
- ✅ LiveKit video rooms
- ✅ Real-time coding environment
- ✅ Professional UI with Verdict Design System

## Common Workflows

### Development: Backend Only
```bash
docker-compose up -d postgres redis minio api
```

### Development: Full Stack
```bash
# Terminal 1: Backend
docker-compose up -d postgres redis minio api

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Production: Full Stack (Docker)
```bash
docker-compose up -d
```

### Rebuild after code changes
```bash
# Backend
docker-compose build api
docker-compose up -d api

# Frontend (if using Docker)
docker-compose build frontend
docker-compose up -d frontend
```

## Authentication Setup

**⚠️ REQUIRED**: You must have a Supabase project configured.

1. **Create Supabase Project**: https://supabase.com
2. **Get Credentials**: Project Settings → API
   - Project URL
   - Anon/Public Key
   - Service Role Key (secret)
3. **Add to `.env`**: Copy keys to both root `.env` and `frontend/.env`
4. **Users Managed by Supabase**: No local user table needed

## Next Steps

1. ✅ **Authentication**: Managed by Supabase
2. 📝 **Create Sessions**: Login and use the UI at `/dashboard`
3. 🎥 **Video Rooms**: LiveKit WebRTC integration
4. 🤖 **AI Agents**: Background workers process interviews
5. 📊 **Evaluations**: Multi-agent evaluation system

## Architecture Notes

- **User Authentication**: Supabase Auth (not PostgreSQL)
- **Business Data**: PostgreSQL (sessions, evaluations, metrics)
- **Real-time**: Redis pub/sub + WebSockets
- **Video**: LiveKit WebRTC
- **Storage**: MinIO (S3-compatible)
