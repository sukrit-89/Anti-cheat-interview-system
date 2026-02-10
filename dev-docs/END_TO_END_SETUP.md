# 🎯 End-to-End Setup Guide
# From Zero to Running Integrity AI in 15 Minutes

## 📋 Prerequisites Checklist

### **Required Software**
- [ ] **Docker Desktop** - https://docker.com/products/docker-desktop
- [ ] **Git** - https://git-scm.com
- [ ] **VS Code** - https://code.visualstudio.com (recommended)

### **Required Accounts**
- [ ] **Supabase** - https://supabase.com (free)
- [ ] **LiveKit** - https://cloud.livekit.io (free tier)

---

## 🚀 Step 1: Account Setup (5 minutes)

### **1.1 Create Supabase Project**
1. Go to https://supabase.com
2. Click **"New Project"**
3. Enter project name: `integrity-ai`
4. Create strong database password
5. Choose region closest to you
6. Wait for project creation (2-3 minutes)

### **1.2 Get Supabase Credentials**
1. Go to Project → **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://[project-id].supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **1.3 Create LiveKit Account**
1. Go to https://cloud.livekit.io
2. Sign up (no credit card required)
3. Create new project: `integrity-ai`
4. Get API keys:
   ```
   API Key: API[xxxxxxxx]
   API Secret: [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx]
   WebSocket URL: wss://[project-id].livekit.cloud
   ```

---

## 📝 Step 2: Environment Configuration (3 minutes)

### **2.1 Create Environment File**
```bash
# Copy template
cp .env.example .env

# Edit in VS Code
code .env
```

### **2.2 Update .env with Your Values**
```bash
# Replace these with your actual values:
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

LIVEKIT_API_KEY=API[your-actual-api-key]
LIVEKIT_API_SECRET=your-actual-api-secret
LIVEKIT_WS_URL=wss://your-project-id.livekit.cloud

# Keep these defaults
ENVIRONMENT=production
DEBUG=False
USE_OLLAMA=True
OLLAMA_MODEL=llama2
USE_LOCAL_WHISPER=True
WHISPER_MODEL=tiny
```

---

## 🔧 Step 3: Start Services with Docker (2 minutes)

### **3.1 Verify Docker is Running**
```powershell
# Check Docker status
docker --version
docker-compose --version

# Expected output:
# Docker version 24.x.x
# Docker Compose version v2.x.x
```

### **3.2 Start All Services**
```bash
# Start all services in detached mode
docker-compose up -d

# This will:
# - Pull all required Docker images (PostgreSQL, Redis, MinIO)
# - Build the FastAPI application container
# - Start all services in the background
# - Set up networking between containers
```

### **3.3 Initialize the Database**
```bash
# Run database initialization script
docker-compose exec api python init_db.py

# Or if containers aren't running yet:
python init_db.py
```

### **What This Does:**
- ✅ Starts PostgreSQL database
- ✅ Starts Redis cache
- ✅ Starts MinIO storage (S3-compatible)
- ✅ Builds and starts FastAPI application
- ✅ Starts Celery worker for background tasks
- ✅ Creates database tables
- ✅ Sets up networking between services

---

## ⏳ Step 4: Wait for Services (3 minutes)

### **4.1 Monitor Startup**
```bash
# Watch all services start
docker-compose logs -f
```

### **4.2 Check Service Status**
```bash
# View all running containers
docker-compose ps

# Expected output showing all services "Up" and "healthy":
NAME              STATUS          PORTS
interview_api     Up (healthy)    0.0.0.0:8000->8000/tcp
interview_db      Up (healthy)    0.0.0.0:5432->5432/tcp
interview_redis   Up (healthy)    0.0.0.0:6379->6379/tcp
interview_minio   Up              0.0.0.0:9000-9001->9000-9001/tcp
interview_worker  Up              
```

### **4.3 Wait for Health Checks**
```bash
# All services should show "healthy" status
# This may take 30-60 seconds
# You can check individual service logs:
docker-compose logs api
docker-compose logs postgres
docker-compose logs redis
```

---

## 🌐 Step 5: Access Your Application (1 minute)

### MinIO Console** | http://localhost:9001 | Storage Management (minioadmin/minioadmin) |
| **Supabase Dashboard** | https://supabase.com/dashboard | Database Management |
| **Frontend** | http://localhost:5173 | React Application (after npm run dev)
|---------|-----|---------|
| **Main App** | http://localhost:8000 | FastAPI Backend |
| **API Docs** | http://localhost:8000/docs | Swagger Documentation |
| **Health Check** | http://localhost:8000/health | Service Status |
| **Judge0 API** | http://localhost:2358 | Code Execution |
| **Supabase Dashboard** | https://supabase.com/dashboard | Database Management |

### **5.2 Verify Everything Works**
```bash
# Test main application
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "environment": "production",
  "database": "connected",
  "redis": "connected"
}
```

---

## 🧪 Step 6: Test Core Features (2 minutes)

### **6.1 Test Authentication**
1. Go to http://localhost:8000/docs
2. Try **POST /api/auth/register**
3. Try **POST /api/auth/login**
4. Verify tokens are returned
Storage Service**
```bash
# Check MinIO is running
curl http://localhost:9000/minio/health/live

# Access MinIO Console
# Browser: http://localhost:9001
# Login: minioadmin / minioadmin
```

### **6.3 Test Database Connection**
```bash
# Test Supabase connection via the API
curl http://localhost:8000/api/auth/health

# Expected response:
{
  "database": "connected",
  "supabase": "ok"
}"max_tokens": 100
  }'
```

---

## 🎯 Step 7: Frontend Setup (3 minutes)

### **7.1 Start Frontend**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### **7.2 Access Frontend**
- **URL**: http://localhost:5173
- **Login Page**: http://localhost:5173/login
- **Register Page**: http://localhost:5173/register

### **7.3 Test Full Flow**
1. Register a new user
2. Login with credentials
3. Create interview session
4. Access dashboard

---

## 🔍 Step 8: Troubleshooting (If needed)

### **8.1 Common Issues & Solutions**

**Issue: "Docker is not running"**
```bash
# Solution: Start Docker Desktop
# Open Docker Desktop application
# Wait for "Docker is running" status
```

**Issue: "Port already in use"**
```bash
# Check what's using port 8000
netstat -tulpn | grep :8000

# Kill conflicting process
sudo kill -9 <PID>
```

**Issue: "Supabase connection failed"**
```bash
# Check .env values
cat .env | grep SUPABASE

# Test connection manually
curl -H "apikey: YOUR_ANON_KEY" https://your-project.supabase.co/rest/v1/
```

**Issue: "Frontend can't reach backend"**
```bash
# Check if API is accessible
curl http://localhost:8000/health

# Check CORS in .env (should allow frontend)
# Backend automatically allows localhost:5173 in development
```

### **8.2 Health Check Commands**
```bash
# Check all containers
docker-compose ps

# Check specific service logs
docker-compose logs api
docker-compose logs postgres
docker-compose logs redis
docker-compose logs worker

# Restart specific service
docker-compose restart api
docker-compose restart worker

# Rebuild and restart a service
docker-compose up -d --build api
```

---

## 📊 Step 9: Production Verification (1 minute)

### **9.1 Final Checklist**Supabase health check passes)
- [ ] **Storage accessible** (MinIO console at http://localhost:9001)
- [ ] **Redis working** (container healthy)
- [ ] **Authentication working** (can register/login via Supabase
- [ ] **Database connected** (health check passes)
- [ ] **Code execution working** (Judge0 responds)
- [ ] **AI integration functional** (Ollama responds)
- [ ] **Authentication working** (can register/login)

### **9.2 Performance Check**
```bash
# interview_api:    < 500MB memory
# interview_db:     < 200MB memory
# interview_redis:  < 100MB memory
# interview_worker: < 300MB memory
# interview_minio:  < 200MB memoryPU usage:
# app: < 500MB memory
# redis: < 100MB memory  
# judge0: < 1GB memory
# ollama: < 2GB memory (if using)
```

---
MinIO storage** for recordings and uploads (S3-compatible)
- ✅ **Redis cache** for fast data access and pub/sub
- ✅ **Celery workers** for background tasks
- ✅ **Real-time video** ready (LiveKit integration)
- ✅ **Docker containerization** for easy deployment
- ✅ **Production-ready** interview platform
- ✅ **Supabase integration** for database and auth
- ✅ **Local AI processing** with Ollama
- ✅ **Secure code execution** with Judge0
- ✅ **Real-time video** with LiveKit
- ✅ **Auto-scaling** with Docker Compose

### **Next Steps:**
1. **Create interview sessions** via the dashboard
2. **Test video calling** with LiveKit integration
3. **Run AI evaluations** on sample code
4. **Generate reports** for interview results
5. **Deploy to cloud** when ready (see deployment guide)

### **Need Help?**
- 📖 **Documentation**: `PRODUCTION_SETUP.md`
- 🐛 **Issues**: Check logs with `docker-compose logs -f`
- 📧 **Configuration**: Edit `.env` file
- 🚀 **Deployment**: See `SUPABASE_DEPLOYMENT.md`

---

## 📞 Quick Reference

### **Essential Commands**
```bashup -d

# Stop everything  
docker-compose down

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f api

# Restart services
docker-compose restart api
docker-compose restart worker

# Rebuild after code changes
docker-compose up -d --build api

# Initialize/migrate database
docker-compose exec api python init_db.py

# Access application shell
docker-compose exec api bash

# Access database
docker-compose exec postgres psql -U interview_user -d interview_platform
```

### **Service URLs**
- **Main App**: http://localhost:8000with:
- 🗄️ **Supabase** managed database and authentication
- 📦 **MinIO** S3-compatible storage for recordings
- 🔄 **Redis** caching and real-time pub/sub
- 👷 **Celery** background task processing
- 📹 **LiveKit** ready for video streaming
- 🐳 **Docker** containerized deployment

**Ready for development and testing!** 🎯

Your platform is now set up for conducting technical interviews with AI-powered evaluation, real-time collaboration, and comprehensive reporting.

**Next:** Configure your LiveKit credentials in `.env` to enable video functionality

You now have a **fully functional Integrity AI platform** running in production mode with:
- 🗄️ **Supabase** database and authentication
- ⚖️ **Judge0** secure code execution
- 🤖 **Ollama** local AI processing
- 📹 **LiveKit** video streaming
- 🔄 **Redis** caching and pub/sub
- 🐳 **Docker** containerization

**Ready for interviews!** 🎯

Your platform is now capable of conducting technical interviews with AI-powered evaluation, real-time collaboration, and comprehensive reporting.
