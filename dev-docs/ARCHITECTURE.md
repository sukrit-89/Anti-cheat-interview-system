# 🏗️ Architecture Guide
# System design and architecture of Neeti AI

## 📋 Overview

Neeti AI is a modern, scalable technical interview platform that combines real-time collaboration, AI-powered evaluation, and secure code execution in a microservices architecture.

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   React    │  │   React     │  │   React     │ │
│  │ (Cand.)    │  │ (Recruiter)│  │ (Monitor)   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway                           │
│                  (FastAPI + Nginx)                  │
└─────────────────────────────────────────────────────────────────┘
                           │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Supabase  │ │     Redis    │ │    Judge0   │ │   LiveKit   │
│ (Database+  │ │   (Cache+   │ │ (Code       │ │ (Video+     │
│   Auth+     │ │   Pub/Sub)   │ │ Execution)  │ │   Audio)     │
│  Storage)   │ │              │ │             │ │              │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
        │                │              │             │              │
        ▼                ▼              ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                Background Services                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │   Ollama   │ │  Celery     │ │  Whisper    │ │
│  │ (Local AI) │ │ (Workers)    │ │ (Speech)    │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Core Components

### **Frontend Architecture**

#### **Technology Stack**
- **React 19** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **LiveKit React** for video/audio

#### **Component Structure**
```
frontend/src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx          # Card, MetricCard, EvidenceCard
│   ├── CodeEditor.tsx    # Monaco editor wrapper
│   ├── EvidenceBlock.tsx
│   ├── Input.tsx
│   ├── MetricCard.tsx
│   ├── StatusIndicator.tsx
│   └── TechnicalBlueprint.tsx
├── pages/              # Route-level components
│   ├── Landing.tsx       # Public marketing page
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── SessionDetail.tsx
│   ├── SessionJoin.tsx   # Candidate join flow
│   ├── InterviewRoom.tsx # Live interview (video + code)
│   ├── SessionMonitor.tsx # Recruiter live monitoring
│   ├── SessionResults.tsx
│   └── EvaluationReport.tsx
├── store/              # Zustand state management
│   ├── useAuthStore.ts
│   ├── useSessionStore.ts
│   └── useInterviewStore.ts
└── lib/                # Utilities and services
    ├── api.ts            # Axios HTTP client
    ├── errorUtils.ts     # Error handling helpers
    ├── livekit.ts        # LiveKit token helpers
    └── websocket.ts      # WebSocket hook + connection
```

### **Backend Architecture**

#### **Technology Stack**
- **FastAPI** for REST API
- **SQLAlchemy 2.0** for ORM
- **PostgreSQL** for primary database
- **Supabase** for managed services
- **Pydantic** for data validation
- **Celery** for background tasks

#### **Service Layer**
```
app/
├── api/                  # API endpoints
│   ├── sessions.py       # Session CRUD + management
│   ├── coding_events.py  # Code execution + event tracking
│   ├── speech.py         # Speech transcription endpoints
│   ├── supabase_auth.py  # Supabase JWT auth endpoints
│   └── websocket.py      # WebSocket real-time events
├── core/                  # Core functionality
│   ├── config.py         # Pydantic Settings (env-driven)
│   ├── supabase_auth.py  # Supabase JWT validation
│   ├── database.py       # SQLAlchemy async engine
│   ├── events.py         # Redis pub/sub event system
│   ├── logging.py        # JSON structured logging
│   └── redis.py          # Redis connection manager
├── agents/                # AI evaluation agents
│   ├── base.py           # BaseAgent abstract class
│   ├── coding_agent.py   # Code quality analysis
│   ├── speech_agent.py   # Communication evaluation
│   ├── vision_agent.py   # Engagement monitoring
│   ├── reasoning_agent.py # Problem-solving analysis
│   └── evaluation_agent.py # Final score aggregation
├── services/              # Business logic
│   ├── ai_service.py     # Multi-provider AI (OpenAI → Ollama → rule-based)
│   ├── judge0_service.py # Judge0 sandboxed code execution
│   ├── livekit_service.py # LiveKit room + token management
│   ├── realtime_service.py # Redis/Supabase real-time broadcast
│   ├── speech_service.py # Whisper speech-to-text
│   ├── vision_service.py # Frame analysis (OpenAI Vision)
│   ├── storage_service.py # S3/MinIO file storage
│   ├── metrics_service.py # Real-time metrics aggregation
│   └── supabase_service.py # Supabase client wrapper
├── models/                # Database models
│   └── models.py         # SQLAlchemy 2.0 ORM models
├── schemas/               # Request/response schemas
│   └── schemas.py        # Pydantic v2 schemas
└── workers/               # Background task processing
    ├── celery_app.py     # Celery + Redis broker config
    ├── agent_tasks.py    # AI agent Celery tasks
    └── session_tasks.py  # Session lifecycle tasks
```

## 🗄️ Database Design

### **Schema Overview**
```sql
-- Users and Authentication
users (id, email, full_name, role, is_active, created_at)

-- Interview Sessions
sessions (id, title, description, recruiter_id, candidate_email, 
          status, session_code, livekit_room, created_at, started_at, ended_at)

-- Code Execution Events
coding_events (id, session_id, event_type, code, language, 
              output, execution_time, created_at)

-- AI Evaluations
evaluations (id, session_id, overall_score, coding_score, 
             communication_score, problem_solving_score, created_at)

-- Real-time Events
websocket_connections (id, session_id, user_id, connected_at, last_ping)
```

### **Data Flow**
```
User Registration → Supabase Auth → Local User Table
Login Request → Supabase Validation → JWT Token → Session State
Session Creation → Database Record → LiveKit Room → WebSocket Connection
Code Execution → Judge0 API → Result Storage → Real-time Broadcast
AI Analysis → Ollama/OpenAI → Evaluation Storage → Report Generation
```

## 🔄 Real-time Architecture

### **WebSocket Communication**
```python
# Connection management
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, session_id: int):
        self.active_connections[session_id] = websocket
    
    async def broadcast(self, session_id: int, message: dict):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_json(message)
```

### **Event Types**
```typescript
// Real-time events
interface RealtimeEvent {
  type: 'code_update' | 'execution_result' | 'ai_analysis' | 'participant_join';
  session_id: number;
  data: any;
  timestamp: string;
}
```

### **Supabase Realtime Integration**
```python
# Fallback to Supabase if Redis unavailable
async def subscribe_to_session(session_id: int, callback):
    if use_supabase:
        return await supabase_service.subscribe_to_session(session_id, callback)
    else:
        return await redis_subscribe(session_id, callback)
```

## 🤖 AI Integration Architecture

### **Multi-Provider AI Service**
```python
class AIService:
    def __init__(self):
        self.providers = {
            'ollama': OllamaProvider(),
            'openai': OpenAIProvider(),
            'anthropic': AnthropicProvider()
        }
    
    async def complete(self, prompt: str, provider: str = 'ollama'):
        provider = self.providers.get(provider)
        return await provider.complete(prompt)
```

### **Agent System**
```python
# Base agent for extensibility
class BaseAgent:
    def __init__(self, session_id: int):
        self.session_id = session_id
    
    async def analyze(self, data: any) -> AnalysisResult:
        raise NotImplementedError

# Specialized agents
class CodingAgent(BaseAgent):
    async def analyze(self, code: str) -> CodeAnalysis:
        # Code quality, style, best practices
        pass

class SpeechAgent(BaseAgent):
    async def analyze(self, audio_data: bytes) -> SpeechAnalysis:
        # Transcription, clarity, communication skills
        pass

class VisionAgent(BaseAgent):
    async def analyze(self, video_frames: List[bytes]) -> VisionAnalysis:
        # Engagement, behavior, focus metrics
        pass
```

## 🔒 Security Architecture

### **Authentication Flow**
```
1. User Registration → Supabase Auth → Email Verification
2. Login Request → Supabase Validation → JWT Tokens
3. API Request → JWT Validation → User Context
4. Protected Resource → Role Check → Access Grant/Deny
```

### **Authorization Model**
```python
# Role-based access control
@router.get("/recruiter-only")
async def recruiter_endpoint(user: User = Depends(get_current_recruiter)):
    return {"message": "Recruiter access granted"}

@router.get("/candidate-only") 
async def candidate_endpoint(user: User = Depends(get_current_candidate)):
    return {"message": "Candidate access granted"}
```

### **Data Security**
- **Encryption**: All data encrypted at rest (Supabase)
- **Transmission**: HTTPS/TLS 1.3 for all communications
- **Tokens**: JWT with short expiry + refresh mechanism
- **Isolation**: Sandboxed code execution (Judge0)
- **Audit**: Complete audit trail for all actions

## ⚡ Performance Architecture

### **Caching Strategy**
```python
# Multi-level caching
class CacheManager:
    def __init__(self):
        self.redis_client = redis.Redis()
        self.local_cache = {}
    
    async def get(self, key: str):
        # L1: Local memory cache
        if key in self.local_cache:
            return self.local_cache[key]
        
        # L2: Redis cache
        value = await self.redis_client.get(key)
        if value:
            self.local_cache[key] = value
            return value
        
        return None
```

### **Database Optimization**
```sql
-- Strategic indexing
CREATE INDEX CONCURRENTLY idx_sessions_status ON sessions(status);
CREATE INDEX CONCURRENTLY idx_sessions_recruiter ON sessions(recruiter_id);
CREATE INDEX CONCURRENTLY idx_coding_events_session ON coding_events(session_id, created_at);

-- Partitioning for large tables
CREATE TABLE coding_events_2024_01 PARTITION OF coding_events
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### **Load Balancing**
```nginx
# Upstream configuration
upstream backend {
    server app1:8000 weight=3;
    server app2:8000 weight=2;
    server app3:8000 weight=1 backup;
}

# Health checks
server {
    location /health {
        proxy_pass http://backend/health;
        access_log off;
    }
}
```

## 🚀 Deployment Architecture

### **Container Orchestration**
```yaml
# Service dependencies
services:
  app:
    depends_on: [redis, postgres, judge0]
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:pass@postgres:5432/db
      - REDIS_URL=redis://redis:6379/0
      - JUDGE0_API_URL=http://judge0:2358
  
  worker:
    depends_on: [redis, postgres]
    command: celery -A app.workers.celery_app worker
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
```

### **Scaling Strategy**
```yaml
# Horizontal scaling
services:
  app:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
  
  worker:
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
```

## 📊 Monitoring & Observability

### **Logging Architecture**
```python
# JSON structured logging (app/core/logging.py)
import logging
import json

logger = logging.getLogger("neeti_ai")

def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(f"neeti_ai.{name}")

async def handle_request(request_id: str):
    logger.info("Processing request",
                extra={"request_id": request_id,
                       "user_id": user.id,
                       "action": "code_execution"})
```

### **Health Monitoring**
```python
# Real health checks (app/main.py)
@app.get("/health")
async def health_check():
    db_ok, redis_ok = False, False
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
            db_ok = True
    except Exception:
        pass
    try:
        redis_ok = await redis_client.ping()
    except Exception:
        pass
    return {
        "status": "healthy" if (db_ok and redis_ok) else "degraded",
        "database": "connected" if db_ok else "disconnected",
        "redis": "connected" if redis_ok else "disconnected",
    }
```

### **Metrics Collection**
```python
# Custom metrics
class MetricsCollector:
    def __init__(self):
        self.prometheus_client = PrometheusClient()
    
    def record_code_execution(self, language: str, duration: float):
        self.prometheus_client.histogram(
            'code_execution_duration_seconds',
            f"Language: {language}"
        ).observe(duration)
```

## 🔮 Future Architecture Considerations

### **Microservices Migration**
- **Service Decomposition**: Split monolith into domain services
- **API Gateway**: Centralized routing and authentication
- **Event Sourcing**: Immutable event log for state reconstruction
- **CQRS**: Command Query Responsibility Segregation

### **Advanced AI Integration**
- **Vector Database**: For semantic code search
- **Fine-tuned Models**: Domain-specific AI models
- **Multi-modal AI**: Combined text, audio, video analysis
- **Real-time AI**: Streaming AI responses during interviews

### **Enterprise Features**
- **Multi-tenancy**: Isolated tenant environments
- **Advanced Analytics**: ML-powered insights and predictions
- **Compliance**: GDPR, SOC2, ISO27001 compliance
- **Disaster Recovery**: Multi-region backup and failover

---

## 🎯 Key Architectural Decisions

### **Why Supabase?**
- **Managed Infrastructure**: Reduced operational overhead
- **Built-in Auth**: Enterprise-grade authentication
- **Real-time**: Native WebSocket support
- **Scalability**: Auto-scaling with usage

### **Why FastAPI?**
- **Performance**: Async-first design
- **Documentation**: Auto-generated OpenAPI specs
- **Type Safety**: Native Python type hints
- **Ecosystem**: Rich middleware and plugin ecosystem

### **Why Docker?**
- **Consistency**: Same environment everywhere
- **Isolation**: Service dependencies managed
- **Scalability**: Easy horizontal scaling
- **Portability**: Cloud-agnostic deployment

This architecture supports current requirements while providing clear paths for future growth and enhancement.
