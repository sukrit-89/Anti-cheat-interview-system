# ðŸš€ Production Setup Guide
# Complete Docker-based deployment for Neeti AI

## ðŸ“‹ Prerequisites

1. **Docker Desktop** - Install from https://docker.com/products/docker-desktop
2. **Git** - Already installed
3. **Supabase Account** - Create at https://supabase.com
4. **LiveKit Account** - Create at https://cloud.livekit.io (free tier)

## âš¡ Quick Setup (5 minutes)

### Step 1: Configure Environment
```bash
# Create a .env file (see QUICKSTART.md for template)
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

### Step 2: Start Services

```bash
docker-compose up -d --build
```

### Step 3: Verify Setup
```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f
```

## ðŸ—ï¸ Architecture Overview

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   Frontend    â”‚    â”‚    Backend     â”‚    â”‚   Supabase     â”‚
â”‚   (React)     â”‚    â”‚   (FastAPI)    â”‚    â”‚  (Database)    â”‚
â”‚   Port: 3000  â”‚    â”‚   Port: 8000   â”‚    â”‚  PostgreSQL     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚                       â”‚                       â”‚
         â”‚                       â”‚                       â”‚
         â–¼                       â–¼                       â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚     Nginx     â”‚    â”‚     Redis       â”‚    â”‚     Judge0     â”‚
â”‚  (Load Balancer)â”‚    â”‚    (Cache)      â”‚    â”‚ (Code Execute)  â”‚
â”‚  Port: 80/443 â”‚    â”‚  Port: 6379    â”‚    â”‚  Port: 2358    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## ðŸ³ Services Included

### **Core Application**
- **FastAPI Backend** - API server with auto-reload
- **React Frontend** - Containerized via `frontend/Dockerfile` (multi-stage: Node 20 build â†’ nginx alpine), served on port 80 (mapped to 3000)
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

## ðŸ”§ Configuration Options

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

## ðŸ“Š Service URLs

After setup, access services at:

| Service | URL | Description |
|---------|------|-------------|
| Main App | http://localhost:8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | Swagger documentation |
| Frontend | http://localhost:3000 | React application |
| Judge0 | http://localhost:2358 | Code execution API |
| Redis | localhost:6379 | Cache server |
| Supabase | https://your-project.supabase.co | Database dashboard |

## ðŸ” Health Checks

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
docker-compose ps

# Check specific service logs
docker-compose logs app
docker-compose logs judge0-server
docker-compose logs redis
```

## ðŸš€ Deployment Commands

### **Start Services**
```bash
docker-compose up -d
```

### **Stop Services**
```bash
docker-compose down
```

### **Update Application**
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### **Database Initialization**
```bash
# Initialize tables
docker-compose exec app python init_db.py

# Or reset everything
docker-compose exec app python reset_all.py
```

## ðŸ”’ Security Configuration

### **SSL/HTTPS**
```bash
# Place certificates in ssl/ directory
ssl/
â”œâ”€â”€ cert.pem
â””â”€â”€ key.pem

# Update nginx.conf to use SSL
# Automatically configured if certificates exist
```

### **Environment Security**
```bash
# Use HTTPS only
CORS_ORIGINS=https://yourdomain.com

# Enable rate limiting
RATE_LIMIT_PER_MINUTE=60
```

## ðŸ“ˆ Monitoring & Scaling

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
docker-compose logs -f

# Export logs
docker-compose logs --tail=1000 > app.log
```

### **Scaling Workers**
```bash
# Scale Celery workers
docker-compose up -d --scale worker=3

# Scale app instances
docker-compose up -d --scale app=2
```

## ðŸ› ï¸ Troubleshooting

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
docker-compose exec app python -c "
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
# In docker-compose.yml
command: redis-server --appendonly yes --maxmemory 256mb
```

**3. Application Caching**
```bash
# Enable response caching
ENABLE_CACHE=true
CACHE_TTL=300
```

## ðŸ“ž Support

### **Logs & Debugging**
```bash
# Enable debug mode
DEBUG=True
LOG_LEVEL=DEBUG

# View error logs
docker-compose logs app | grep ERROR
```

### **Backup & Recovery**
```bash
# Backup database
docker-compose exec judge0-db pg_dump -U judge0 judge0 > backup.sql

# Restore database
docker-compose exec -T judge0-db psql -U judge0 judge0 < backup.sql
```

---

## ðŸŽ‰ You're Ready!

Your Neeti AI platform is now running in production mode with:
- âœ… **Supabase** for database and auth
- âœ… **Judge0** for code execution  
- âœ… **Ollama** for local AI
- âœ… **Redis** for caching
- âœ… **LiveKit** for video streaming
- âœ… **Nginx** for load balancing

Access your application at **http://localhost:8000** ðŸš€
