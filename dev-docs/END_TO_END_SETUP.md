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

## 🔧 Step 3: Run Setup Script (2 minutes)

### **3.1 Windows (PowerShell)**
```powershell
# Make sure Docker Desktop is running
# Then run:
.\setup-production.ps1
```

### **3.2 Linux/Mac (Bash)**
```bash
# Make script executable
chmod +x setup-production.sh

# Run setup
./setup-production.sh
```

### **What the Script Does:**
- ✅ Checks Docker is running
- ✅ Creates necessary directories
- ✅ Clones Judge0 for code execution
- ✅ Pulls all Docker images
- ✅ Builds application
- ✅ Starts all services
- ✅ Runs database migrations
- ✅ Tests all services

---

## ⏳ Step 4: Wait for Services (3 minutes)

### **4.1 Monitor Startup**
```powershell
# Watch all services start
docker-compose -f docker-compose.production.yml logs -f
```

### **4.2 Expected Output:**
```
🚀 Setting up Integrity AI Production Environment...
📁 Creating directories...
⚖️ Setting up Judge0...
📦 Pulling Docker images...
🔨 Building application...
🚀 Starting services...
⏳ Waiting for services to start...
🔍 Checking service status...
🗄️ Running database migrations...
🧪 Testing services...
✅ Main application is running
✅ Judge0 is running
✅ Redis is running
🎉 Setup Complete!
```

---

## 🌐 Step 5: Access Your Application (1 minute)

### **5.1 Service URLs**
| Service | URL | Purpose |
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

### **6.2 Test Code Execution**
```bash
# Test Judge0 integration
curl -X POST "http://localhost:2358/submissions" \
  -H "Content-Type: application/json" \
  -d '{
    "source_code": "print(\"Hello World\")",
    "language_id": 71,
    "stdin": ""
  }'
```

### **6.3 Test AI Integration**
```bash
# Test Ollama (local AI)
curl -X POST "http://localhost:8000/api/ai/complete" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is Python?",
    "max_tokens": 100
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
# Check CORS settings
cat .env | grep CORS

# Should include frontend URL:
CORS_ORIGINS=http://localhost:5173,http://localhost:8000
```

### **8.2 Health Check Commands**
```bash
# Check all containers
docker-compose -f docker-compose.production.yml ps

# Check specific service logs
docker-compose -f docker-compose.production.yml logs app
docker-compose -f docker-compose.production.yml logs judge0-server
docker-compose -f docker-compose.production.yml logs redis

# Restart specific service
docker-compose -f docker-compose.production.yml restart app
```

---

## 📊 Step 9: Production Verification (1 minute)

### **9.1 Final Checklist**
- [ ] **All services running** (`docker-compose ps` shows all containers healthy)
- [ ] **Backend accessible** at http://localhost:8000
- [ ] **Frontend running** at http://localhost:5173
- [ ] **Database connected** (health check passes)
- [ ] **Code execution working** (Judge0 responds)
- [ ] **AI integration functional** (Ollama responds)
- [ ] **Authentication working** (can register/login)

### **9.2 Performance Check**
```bash
# Check resource usage
docker stats

# Should show reasonable memory/CPU usage:
# app: < 500MB memory
# redis: < 100MB memory  
# judge0: < 1GB memory
# ollama: < 2GB memory (if using)
```

---

## 🎉 Success! Your Platform is Running

### **What You Have Now:**
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
```bash
# Start everything
docker-compose -f docker-compose.production.yml up -d

# Stop everything  
docker-compose -f docker-compose.production.yml down

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Restart services
docker-compose -f docker-compose.production.yml restart

# Run migrations
docker-compose -f docker-compose.production.yml exec app alembic upgrade head

# Access application shell
docker-compose -f docker-compose.production.yml exec app bash
```

### **Service URLs**
- **Main App**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173
- **Supabase**: https://supabase.com/dashboard
- **Judge0**: http://localhost:2358

---

## 🏆 Congratulations!

You now have a **fully functional Integrity AI platform** running in production mode with:
- 🗄️ **Supabase** database and authentication
- ⚖️ **Judge0** secure code execution
- 🤖 **Ollama** local AI processing
- 📹 **LiveKit** video streaming
- 🔄 **Redis** caching and pub/sub
- 🐳 **Docker** containerization

**Ready for interviews!** 🎯

Your platform is now capable of conducting technical interviews with AI-powered evaluation, real-time collaboration, and comprehensive reporting.
