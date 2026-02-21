# 🛠️ Development Guide
# Setting up local development environment

## 📋 Prerequisites

### **Required Software**
- **Python 3.11+** - https://python.org
- **Node.js 18+** - https://nodejs.org
- **Docker Desktop** - https://docker.com/products/docker-desktop
- **Git** - https://git-scm.com
- **VS Code** - https://code.visualstudio.com (recommended)

### **VS Code Extensions**
```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.black-formatter",
    "ms-python.flake8",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## 🚀 Quick Setup (10 minutes)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/sukrit-89/Anti-cheat-interview-system.git
cd Anti-cheat-interview-system
```

### **Step 2: Backend Setup**
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### **Step 3: Frontend Setup**
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Step 4: Database Setup**
```bash
# Option 1: Local PostgreSQL (Development)
docker-compose up -d postgres

# Option 2: Supabase (Production)
# Update .env with Supabase credentials
```

## 🔧 Development Workflow

### **Daily Development**
```bash
# 1. Start backend
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 2. Start frontend (new terminal)
cd frontend
npm run dev

# 3. Start supporting services
docker-compose up -d redis postgres
```

### **Project Structure**
```
neeti-ai/
├── app/                    # FastAPI backend
│   ├── api/               # API endpoints (sessions, coding_events, speech, websocket)
│   ├── core/               # Core functionality (config, database, auth, events, redis)
│   ├── agents/             # AI evaluation agents (coding, speech, vision, reasoning, evaluation)
│   ├── models/             # SQLAlchemy ORM models
│   ├── schemas/            # Pydantic request/response schemas
│   ├── services/           # Business logic (AI, Judge0, LiveKit, metrics, storage)
│   └── workers/            # Celery background tasks
├── frontend/               # React 19 + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Button, Card, CodeEditor, etc.)
│   │   ├── pages/         # Route pages (Dashboard, InterviewRoom, SessionMonitor, etc.)
│   │   ├── store/         # Zustand state stores
│   │   └── lib/           # API client, WebSocket hooks, utilities
│   └── public/            # Static assets
├── dev-docs/              # Developer documentation
├── tests/                  # Pytest test suite
├── migrations/             # SQL migration scripts
├── init_db.py              # Database initialization (create_all)
├── reset_all.py            # Full database reset
├── cleanup_database.py     # Database cleanup utility
├── docker-compose.yml       # Development services
├── Dockerfile              # Backend Docker image
├── Dockerfile.worker       # Celery worker Docker image
└── frontend/Dockerfile     # Frontend Docker image (multi-stage: Node build → Nginx)
```

## 🧪 Testing

### **Backend Tests**
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test categories
pytest -m unit
pytest -m integration
```

### **Frontend Tests**
```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## 🐛 Debugging

### **Backend Debugging**
```bash
# Start with debug mode
uvicorn app.main:app --reload --log-level debug

# Use Python debugger
python -m debugpy --listen 5678 app/main.py

# Check environment
python -c "from app.core.config import settings; print(settings.dict())"
```

### **Frontend Debugging**
```bash
# Start with debug
npm run dev:debug

# Open Chrome DevTools
# Use React DevTools extension
```

### **Database Debugging**
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d interview_platform

# Re-initialize tables (uses SQLAlchemy create_all)
python init_db.py

# Reset everything (drops and recreates all tables)
python reset_all.py

# Run SQL migrations manually
# See migrations/ folder for migration scripts
```

## 📊 Monitoring

### **Health Endpoints**
```bash
# Backend health
curl http://localhost:8000/health

# Database health
curl http://localhost:8000/health/db

# Redis health
curl http://localhost:8000/health/redis
```

### **Development Logs**
```bash
# Backend logs
uvicorn app.main:app --log-level debug

# Frontend logs
# Check browser console

# Docker logs
docker-compose logs -f
```

## 🔧 Configuration

### **Development .env**
```bash
# Development settings
ENVIRONMENT=development
DEBUG=True
LOG_LEVEL=DEBUG

# Database (local)
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/interview_platform

# Redis
REDIS_URL=redis://localhost:6379/0

# AI Services (local options)
USE_OLLAMA=True
OLLAMA_BASE_URL=http://localhost:11434
USE_LOCAL_WHISPER=True
```

### **Hot Reload**
```bash
# Backend auto-reload on file changes
uvicorn app.main:app --reload

# Frontend hot reload
npm run dev  # Vite handles automatically
```

## 🚀 Common Development Tasks

### **Adding New API Endpoint**
```python
# 1. Create in app/api/new_endpoint.py
from fastapi import APIRouter
from app.core.database import get_db

router = APIRouter(prefix="/new-endpoint", tags=["New Feature"])

@router.post("/")
async def create_item(item: ItemCreate, db: AsyncSession = Depends(get_db)):
    # Implementation
    pass

# 2. Add to app/main.py
from app.api import new_endpoint
app.include_router(new_endpoint.router, prefix="/api")
```

### **Adding New Frontend Page**
```typescript
// 1. Create in frontend/src/pages/NewPage.tsx
import { useState } from 'react';

export const NewPage = () => {
  return <div>New Page Content</div>;
};

// 2. Add to frontend/src/App.tsx
import { NewPage } from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

### **Database Schema Changes**
```bash
# The project uses SQLAlchemy create_all() for table creation.
# To add new tables, define models in app/models/models.py
# then run init_db.py to create them:
python init_db.py

# For manual migrations, add SQL scripts to migrations/ folder
# and run them against your Supabase SQL editor or psql.
```

## 🔒 Security in Development

### **Environment Variables**
```bash
# Never commit secrets
# Create a .env file — see QUICKSTART.md for the required variables
# Add .env to .gitignore
```

### **API Security**
```python
# Use dependency injection
from app.core.auth import get_current_user

@router.get("/protected")
async def protected_endpoint(current_user: User = Depends(get_current_user)):
    return {"user": current_user}
```

## 📝 Code Quality

### **Backend Standards**
```python
# Use type hints
def create_user(user_data: UserCreate) -> User:
    pass

# Use async/await
async def get_user(user_id: int) -> Optional[User]:
    pass

# Handle errors properly
try:
    result = await some_operation()
except SpecificError as e:
    logger.error(f"Operation failed: {e}")
    raise HTTPException(status_code=400, detail=str(e))
```

### **Frontend Standards**
```typescript
// Use proper types
interface User {
  id: number;
  email: string;
}

// Use React hooks properly
const [user, setUser] = useState<User | null>(null);

// Handle loading states
if (loading) return <div>Loading...</div>;
```

## 🚀 Deployment Preparation

### **Pre-deployment Checklist**
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Build production assets
- [ ] Security scan completed

### **Build Commands**
```bash
# Backend production build
# (No build needed for FastAPI)

# Frontend production build
cd frontend
npm run build

# Check build output
ls -la frontend/dist/
```

---

## 📞 Getting Help

- **Documentation**: Check `dev-docs/` folder
- **Issues**: Create GitHub issue
- **Discussions**: Ask questions in GitHub Discussions
- **Templates**: Use issue and PR templates

Happy coding! 🎉
