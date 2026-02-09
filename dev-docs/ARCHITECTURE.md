# 🏗️ Architecture Guide
# System design and architecture of Integrity AI

## 📋 Overview

Integrity AI is a modern, scalable technical interview platform that combines real-time collaboration, AI-powered evaluation, and secure code execution in a microservices architecture.

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
- **React 18** with TypeScript
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
│   ├── Input.tsx
│   ├── CodeEditor.tsx
│   └── VideoChat.tsx
├── pages/              # Route-level components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── InterviewRoom.tsx
│   └── Results.tsx
├── store/              # State management
│   ├── useAuthStore.ts
│   ├── useSessionStore.ts
│   └── useInterviewStore.ts
├── lib/                # Utilities and services
│   ├── api.ts
│   ├── livekit.ts
│   └── utils.ts
└── hooks/              # Custom React hooks
    ├── useAuth.ts
    ├── useWebSocket.ts
    └── useCodeExecution.ts
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
├── api/                # API endpoints
│   ├── auth.py         # Authentication
│   ├── sessions.py     # Session management
│   ├── coding.py       # Code execution
│   └── websocket.py    # Real-time events
├── core/                # Core functionality
│   ├── config.py       # Configuration
│   ├── auth.py         # Authentication logic
│   ├── database.py     # Database connection
│   └── logging.py      # Structured logging
├── services/            # Business logic
│   ├── ai_service.py   # AI integration
│   ├── judge0_service.py # Code execution
│   ├── livekit_service.py # Video/audio
│   └── realtime_service.py # Real-time updates
├── models/              # Database models
│   ├── models.py       # SQLAlchemy models
│   └── schemas.py      # Pydantic schemas
└── workers/             # Background tasks
    ├── celery_app.py    # Celery configuration
    ├── agent_tasks.py   # AI agent processing
    └── session_tasks.py # Session management
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
# Structured logging with correlation IDs
import structlog

logger = structlog.get_logger()

async def handle_request(request_id: str):
    logger.info("Processing request", 
                request_id=request_id,
                user_id=user.id,
                action="code_execution")
```

### **Health Monitoring**
```python
# Comprehensive health checks
@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.APP_VERSION,
        "database": await check_database_health(),
        "redis": await check_redis_health(),
        "judge0": await check_judge0_health(),
        "supabase": await check_supabase_health()
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
