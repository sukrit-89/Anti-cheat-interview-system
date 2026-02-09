# 🚀 Production Setup Guide
# Complete Docker-based deployment for Integrity AI

## 📋 Prerequisites

1. **Docker Desktop** - Install from https://docker.com/products/docker-desktop
2. **Git** - Already installed
3. **Supabase Account** - Create at https://supabase.com
4. **LiveKit Account** - Create at https://cloud.livekit.io (free tier)

## ⚡ Quick Setup (5 minutes)

### Step 1: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
notepad .env  # Windows
nano .env        # Linux/Mac
```

**Required Variables:**
```bash
# Supabase (from https://supabase.com/dashboard/project/_/settings/api)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# LiveKit (from https://cloud.livekit.io)
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
LIVEKIT_WS_URL=wss://your-project.livekit.cloud
```

### Step 2: Run Setup Script

**Windows (PowerShell):**
```powershell
.\setup-production.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x setup-production.sh
./setup-production.sh
```

### Step 3: Verify Setup
```bash
# Check all services
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend    │    │    Backend     │    │   Supabase     │
│   (React)     │    │   (FastAPI)    │    │  (Database)    │
│   Port: 3000  │    │   Port: 8000   │    │  PostgreSQL     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx     │    │     Redis       │    │     Judge0     │
│  (Load Balancer)│    │    (Cache)      │    │ (Code Execute)  │
│  Port: 80/443 │    │  Port: 6379    │    │  Port: 2358    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🐳 Services Included

### **Core Application**
- **FastAPI Backend** - API server with auto-reload
- **React Frontend** - Built and served statically
- **Nginx Proxy** - SSL termination and load balancing

### **Database & Storage**
- **Supabase PostgreSQL** - Managed database with backups
- **Supabase Storage** - File storage for recordings
- **Redis Cache** - Session storage and pub/sub

### **AI & Code Execution**
- **Ollama** - Local LLM (Llama2, CodeLlama)
- **Judge0** - Secure code execution sandbox
- **Whisper** - Local speech-to-text

### **Background Processing**
- **Celery Workers** - AI agent processing
- **LiveKit** - WebRTC video/audio streaming

## 🔧 Configuration Options

### **Development Mode**
```bash
# Use local development
ENVIRONMENT=development
DEBUG=True
```

### **Production Mode**
```bash
# Production optimizations
ENVIRONMENT=production
DEBUG=False
WORKERS=4
```

### **AI Service Selection**
```bash
# Option 1: Local Ollama (Free)
USE_OLLAMA=True
OLLAMA_MODEL=llama2

# Option 2: OpenAI (Paid)
OPENAI_API_KEY=your-key

# Option 3: Anthropic (Paid)
ANTHROPIC_API_KEY=your-key
```

### **Code Execution**
```bash
# Option 1: Self-hosted Judge0 (Free)
JUDGE0_API_URL=http://judge0-server:2358

# Option 2: RapidAPI Judge0 (Free tier)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-rapidapi-key

# Option 3: Rule-based only (Free)
USE_RULE_BASED_CODE_ANALYSIS=True
```

## 📊 Service URLs

After setup, access services at:

| Service | URL | Description |
|---------|------|-------------|
| Main App | http://localhost:8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | Swagger documentation |
| Frontend | http://localhost:3000 | React application |
| Judge0 | http://localhost:2358 | Code execution API |
| Redis | localhost:6379 | Cache server |
| Supabase | https://your-project.supabase.co | Database dashboard |

## 🔍 Health Checks

### **Application Health**
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "environment": "production",
  "database": "connected",
  "redis": "connected"
}
```

### **Service Status**
```bash
# Check all containers
docker-compose -f docker-compose.production.yml ps

# Check specific service logs
docker-compose -f docker-compose.production.yml logs app
docker-compose -f docker-compose.production.yml logs judge0-server
docker-compose -f docker-compose.production.yml logs redis
```

## 🚀 Deployment Commands

### **Start Services**
```bash
docker-compose -f docker-compose.production.yml up -d
```

### **Stop Services**
```bash
docker-compose -f docker-compose.production.yml down
```

### **Update Application**
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build
```

### **Database Migrations**
```bash
# Run migrations
docker-compose -f docker-compose.production.yml exec app alembic upgrade head

# Check migration status
docker-compose -f docker-compose.production.yml exec app alembic current
```

## 🔒 Security Configuration

### **SSL/HTTPS**
```bash
# Place certificates in ssl/ directory
ssl/
├── cert.pem
└── key.pem

# Update nginx.conf to use SSL
# Automatically configured if certificates exist
```

### **Environment Security**
```bash
# Generate secure secrets
JWT_SECRET_KEY=$(openssl rand -hex 32)

# Use HTTPS only
CORS_ORIGINS=https://yourdomain.com

# Enable rate limiting
RATE_LIMIT_PER_MINUTE=60
```

## 📈 Monitoring & Scaling

### **Resource Monitoring**
```bash
# Check resource usage
docker stats

# Check disk usage
docker system df
```

### **Log Management**
```bash
# View all logs
docker-compose -f docker-compose.production.yml logs -f

# Export logs
docker-compose -f docker-compose.production.yml logs --tail=1000 > app.log
```

### **Scaling Workers**
```bash
# Scale Celery workers
docker-compose -f docker-compose.production.yml up -d --scale worker=3

# Scale app instances
docker-compose -f docker-compose.production.yml up -d --scale app=2
```

## 🛠️ Troubleshooting

### **Common Issues**

**1. Docker not running**
```bash
# Start Docker Desktop
# Check status
docker info
```

**2. Port conflicts**
```bash
# Check what's using ports
netstat -tulpn | grep :8000
netstat -tulpn | grep :2358

# Kill conflicting processes
sudo kill -9 <PID>
```

**3. Environment variables not loading**
```bash
# Verify .env file exists
ls -la .env

# Check permissions
chmod 600 .env
```

**4. Database connection failed**
```bash
# Test Supabase connection
docker-compose -f docker-compose.production.yml exec app python -c "
from app.core.config import settings
print(f'Database URL: {settings.DATABASE_URL}')
"
```

### **Performance Optimization**

**1. Database Indexing**
```sql
-- Add indexes to frequently queried columns
CREATE INDEX idx_sessions_recruiter_id ON sessions(recruiter_id);
CREATE INDEX idx_users_email ON users(email);
```

**2. Redis Configuration**
```bash
# Enable Redis persistence
# In docker-compose.production.yml
command: redis-server --appendonly yes --maxmemory 256mb
```

**3. Application Caching**
```bash
# Enable response caching
ENABLE_CACHE=true
CACHE_TTL=300
```

## 📞 Support

### **Logs & Debugging**
```bash
# Enable debug mode
DEBUG=True
LOG_LEVEL=DEBUG

# View error logs
docker-compose -f docker-compose.production.yml logs app | grep ERROR
```

### **Backup & Recovery**
```bash
# Backup database
docker-compose -f docker-compose.production.yml exec judge0-db pg_dump -U judge0 judge0 > backup.sql

# Restore database
docker-compose -f docker-compose.production.yml exec -T judge0-db psql -U judge0 judge0 < backup.sql
```

---

## 🎉 You're Ready!

Your Integrity AI platform is now running in production mode with:
- ✅ **Supabase** for database and auth
- ✅ **Judge0** for code execution  
- ✅ **Ollama** for local AI
- ✅ **Redis** for caching
- ✅ **LiveKit** for video streaming
- ✅ **Nginx** for load balancing

Access your application at **http://localhost:8000** 🚀
