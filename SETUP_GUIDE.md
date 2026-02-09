# Integrity AI - Setup & Deployment Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 15+** ([Download](https://www.postgresql.org/download/))
- **Redis 7+** ([Download](https://redis.io/download/))

### Installation Steps

#### 1. Clone & Setup Environment
```bash
git clone <your-repo-url>
cd Integrity-AI

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Minimum required: Database, Redis, LiveKit credentials
```

#### 2. Database Setup
```bash
# Create PostgreSQL database
createdb integrity_ai

# Or using psql:
psql -U postgres
CREATE DATABASE integrity_ai;
\q

# Update .env with your database credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=integrity_ai
```

#### 3. Backend Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start Redis (separate terminal)
redis-server

# Start Celery worker (separate terminal)
celery -A app.workers.celery_app worker --loglevel=info

# Start backend server
python -m uvicorn app.main:app --reload --port 8000
```

#### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env
echo "VITE_WS_URL=ws://localhost:8000" >> .env
echo "VITE_LIVEKIT_WS_URL=wss://your-livekit-instance.livekit.cloud" >> .env

# Start development server
npm run dev
```

#### 5. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🔧 Service Configuration

### LiveKit (Video/Audio) - **REQUIRED**
**Free Tier**: 10,000 minutes/month

1. Sign up at [cloud.livekit.io](https://cloud.livekit.io)
2. Create a project
3. Copy API Key, Secret, and WebSocket URL
4. Add to `.env`:
```env
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
LIVEKIT_WS_URL=wss://your-instance.livekit.cloud
```

### AI Services - **Choose ONE Option**

#### Option A: Local Whisper (100% FREE, Recommended for Testing)
```env
USE_LOCAL_WHISPER=True
WHISPER_MODEL=tiny  # or base, small
```
```bash
pip install openai-whisper
```

#### Option B: OpenAI (Best Quality)
**Cost**: ~$0.006 per minute of audio + GPT usage

1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Add credit ($5-10 recommended)
3. Add to `.env`:
```env
OPENAI_API_KEY=sk-your-api-key
USE_LOCAL_WHISPER=False
```

#### Option C: Ollama (100% FREE Local LLM)
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Download model
ollama pull llama2

# Update .env
USE_OLLAMA=True
OLLAMA_MODEL=llama2
```

### Code Execution - **Choose ONE Option**

#### Option A: Judge0 (Recommended for Production)
**Free Tier**: 50 requests/day

1. Sign up at [RapidAPI - Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Subscribe to free tier
3. Copy API key
4. Add to `.env`:
```env
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-rapidapi-key
```

#### Option B: Rule-Based Analysis (100% FREE Fallback)
```env
USE_RULE_BASED_CODE_ANALYSIS=True
# No execution, just syntax/structure analysis
```

---

## 🗄️ Database Migrations

### Create New Migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations
```bash
alembic upgrade head
```

### Rollback Migration
```bash
alembic downgrade -1
```

---

## 🧪 Testing

### Run All Tests
```bash
pytest
```

### Run Specific Test File
```bash
pytest tests/test_auth.py
```

### Run with Coverage
```bash
pytest --cov=app --cov-report=html
```

---

## 📦 Production Deployment

### Docker Deployment

#### Build Images
```bash
docker-compose build
```

#### Start Services
```bash
docker-compose up -d
```

#### View Logs
```bash
docker-compose logs -f
```

#### Stop Services
```bash
docker-compose down
```

### Environment Variables for Production
```env
ENVIRONMENT=production
DEBUG=False
WORKERS=4

# Use strong JWT secret
JWT_SECRET_KEY=<generate with: openssl rand -hex 32>

# Configure production database
DATABASE_URL=postgresql+asyncpg://user:pass@host:port/db

# Production CORS
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### Railway Deployment

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and Initialize:
```bash
railway login
railway init
```

3. Add Services:
```bash
railway add  # Select PostgreSQL
railway add  # Select Redis
```

4. Set Environment Variables:
```bash
railway variables set JWT_SECRET_KEY=<your-secret>
railway variables set LIVEKIT_API_KEY=<your-key>
# ... add all required variables
```

5. Deploy:
```bash
railway up
```

---

## 🔍 Monitoring & Debugging

### Check Service Status
```bash
# Backend health
curl http://localhost:8000/health

# API info
curl http://localhost:8000/api/info

# Speech service status
curl http://localhost:8000/api/speech/status
```

### View Logs
```bash
# Backend logs (if using systemd)
journalctl -u integrity-ai -f

# Docker logs
docker-compose logs -f app

# Celery worker logs
celery -A app.workers.celery_app inspect active
```

### Database Queries
```bash
# Connect to database
psql -U postgres -d integrity_ai

# View users
SELECT id, email, role FROM users;

# View sessions
SELECT id, title, status, created_at FROM sessions;
```

---

## 🛡️ Security Checklist

- [ ] Change `JWT_SECRET_KEY` to random 256-bit key
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set `DEBUG=False` in production
- [ ] Use environment variables (never commit `.env`)
- [ ] Enable rate limiting
- [ ] Regular security updates (`pip install --upgrade`)

---

## 🔥 Common Issues & Solutions

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Verify credentials
psql -U postgres -d integrity_ai

# Reset database
alembic downgrade base
alembic upgrade head
```

### Redis Connection Error
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Start Redis
redis-server
```

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### LiveKit Connection Issues
- Verify WebSocket URL includes `wss://` protocol
- Check API key and secret are correct
- Ensure firewall allows WebSocket connections
- Test at [https://meet.livekit.io](https://meet.livekit.io)

### Whisper Installation Issues (Windows)
```bash
# Install ffmpeg first
# Download from: https://ffmpeg.org/download.html
# Add to PATH

# Install Whisper
pip install openai-whisper
```

---

## 📚 API Documentation

### Interactive API Docs
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

#### Authentication
```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepass",
  "full_name": "John Doe",
  "role": "recruiter"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepass"
}
```

#### Sessions
```bash
# Create session
POST /api/sessions
{
  "title": "Senior Backend Engineer",
  "description": "Python FastAPI interview"
}

# Join session
POST /api/sessions/join
{
  "session_code": "ABC123",
  "full_name": "Jane Candidate",
  "email": "jane@example.com"
}

# Start session
POST /api/sessions/{id}/start

# End session
POST /api/sessions/{id}/end
```

---

## 🎯 Performance Optimization

### Database Indexing
```sql
CREATE INDEX idx_sessions_recruiter ON sessions(recruiter_id);
CREATE INDEX idx_candidates_session ON candidates(session_id);
CREATE INDEX idx_coding_events_session ON coding_events(session_id);
```

### Redis Caching
```python
# Cache session data
await redis_client.setex(f"session:{id}", 3600, json.dumps(data))

# Retrieve cached data
cached = await redis_client.get(f"session:{id}")
```

### Frontend Optimization
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📞 Support & Resources

- **Documentation**: See `PROJECT_BRIEF.md`
- **Issues**: Check GitHub issues
- **LiveKit Docs**: [docs.livekit.io](https://docs.livekit.io)
- **FastAPI Docs**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Judge0 API**: [judge0.com](https://judge0.com)

---

## 📄 License

MIT License - See LICENSE file for details
