# 🎯 End-to-End Setup Guide
# From Zero to Running Neeti AI in 15 Minutes

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
3. Enter project name: `neeti-ai`
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
3. Create new project: `neeti-ai`
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
# Create a .env file manually (see QUICKSTART.md for template)
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

# Code Execution - Choose one option:

# Option A: RapidAPI Judge0 (Paid - $0.004/request, easiest setup)
# JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
# JUDGE0_API_KEY=your-rapidapi-key-from-rapidapi.com

# Option B: Self-hosted Judge0 (FREE & Unlimited - Recommended, requires Docker)
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=

# Option C: No code execution (rule-based analysis only)
# USE_RULE_BASED_CODE_ANALYSIS=True
```

### **2.3 Judge0 Setup (Optional - For Code Execution)**

⚠️ **Important: RapidAPI Judge0 is now PAID only** (~$0.004/request, $20/month minimum)

**Option A: RapidAPI Judge0 (Paid - Only if you need managed service)**
1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Subscribe to a paid plan (starts at ~$20/month)
3. Get your API key
4. Update `.env`:
   ```bash
   JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
   JUDGE0_API_KEY=your_rapidapi_key
   ```

**Option B: Self-Hosted Judge0 (FREE & Unlimited - Recommended) ✅**
1. Clone Judge0 repository:
   ```bash
   cd ..
   git clone https://github.com/judge0/judge0.git
   cd judge0
   ```

2. Start Judge0 services:
   ```bash
   docker-compose up -d db redis
   docker-compose up -d
   ```

3. Verify it's running:
   ```bash
   curl http://localhost:2358/about
   ```

4. In your Neeti-AI `.env` file:
   ```bash
   JUDGE0_API_URL=http://localhost:2358
   JUDGE0_API_KEY=  # Leave empty for self-hosted
   ```

**Option C: No Code Execution (Rule-Based Analysis Only)**
```bash
# In your .env file:
USE_RULE_BASED_CODE_ANALYSIS=True
```
This will analyze code patterns without actually executing it.

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

### **5.1 Service URLs**
| Service | URL | Purpose |
|---------|-----|---------|
| **Main App** | http://localhost:8000 | FastAPI Backend |
| **API Docs** | http://localhost:8000/docs | Swagger Documentation |
| **Health Check** | http://localhost:8000/health | Service Status |
| **MinIO Console** | http://localhost:9001 | Storage Management (minioadmin/minioadmin) |
| **Supabase Dashboard** | https://supabase.com/dashboard | Database Management |
| **Judge0 API** | http://localhost:2358 | Code Execution (if self-hosted) |
| **Frontend** | http://localhost:3000 | React Application (containerized via `frontend/Dockerfile`, multi-stage nginx build) |

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

### **6.2 Test Storage Service**
```bash
# Check MinIO is running
curl http://localhost:9000/minio/health/live

# Access MinIO Console
# Browser: http://localhost:9001
# Login: minioadmin / minioadmin
```

### **6.3 Test Code Execution (If Judge0 is set up)**
```bash
# If self-hosted: Test Judge0 directly
curl http://localhost:2358/about

# Or test through your API
curl -X POST "http://localhost:8000/api/code/execute" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "print(\"Hello World\")",
    "language": "python"
  }'

# Expected response:
{
  "stdout": "Hello World\n",
  "stderr": "",
  "status": "Accepted"
}
```

### **6.4 Test Database Connection**
```bash
# Test Supabase connection via the API
curl http://localhost:8000/api/auth/health

# Expected response:
{
  "database": "connected",
  "supabase": "ok"
}
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

**Issue: "Judge0 not working"**
```bash
# If self-hosted: Check Judge0 is running
cd ../judge0
docker-compose ps

# If using RapidAPI: Check your API key and quota
# Visit https://rapidapi.com/judge0-official/api/judge0-ce/pricing

# Alternatively, disable code execution
# Add to .env: USE_RULE_BASED_CODE_ANALYSIS=True
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

### **9.1 Final Checklist**
- [ ] **Database connected** (health check passes)
- [ ] **Storage accessible** (MinIO console at http://localhost:9001)
- [ ] **Redis working** (container healthy)
- [ ] **Authentication working** (can register/login via Supabase)
- [ ] **Code execution** (Judge0 responding — optional if configured)
- [ ] **AI integration functional** (Ollama responds)

### **9.2 Performance Check**
```bash
# Expected resource usage:
# app:     < 500MB memory
# redis:   < 100MB memory
# judge0:  < 1GB memory
# ollama:  < 2GB memory (if using)
```

---

## 🎉 Conclusion

You now have a **fully functional Neeti AI platform** running with:
- ✅ **Supabase** for database and authentication
- ✅ **Judge0** for secure code execution
- ✅ **Ollama** for local AI processing
- ✅ **LiveKit** for real-time video streaming
- ✅ **Redis** for caching and pub/sub
- ✅ **Celery workers** for background tasks
- ✅ **Docker containerization** for easy deployment
- ✅ **Frontend** containerized via `frontend/Dockerfile` (Node 20 build → nginx alpine, port 80 mapped to 3000)

### **Next Steps:**
1. **Create interview sessions** via the dashboard
2. **Test video calling** with LiveKit integration
3. **Run AI evaluations** on sample code
4. **Generate reports** for interview results
5. **Deploy to cloud** when ready (see deployment guide)

### **Need Help?**
- 📖 **Documentation**: See `PRODUCTION_SETUP.md`
- 🐛 **Issues**: Check logs with `docker-compose logs -f`
- 📧 **Contact**: neetiatsuuport@gmail.com
- 🚀 **Deployment**: See `SUPABASE_DEPLOYMENT.md`

---

## 📞 Quick Reference

### **Essential Commands**
```bash
# Start everything
docker-compose up -d

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
- **Main App**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000
- **Judge0**: http://localhost:2358

**Ready for interviews!** 🎯
