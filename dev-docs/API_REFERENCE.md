# 📡 API Reference
# Complete API documentation for Neeti AI

## 🔐 Authentication

> **Note:** Authentication is handled via **Supabase Auth**. All endpoints below use Supabase's managed authentication service for user management, JWT token generation, and session handling. The backend validates Supabase JWTs for protected routes.

### **Register User**
```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "role": "recruiter"  // or "candidate"
}
```

**Response (201):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "recruiter",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### **Login User**
```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### **Get Current User**
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "recruiter",
  "is_active": true
}
```

### **Refresh Token**
```http
POST /api/auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Logout**
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

---

## 📅 Sessions

### **Create Session**
```http
POST /api/sessions
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Senior Python Developer Interview",
  "description": "Technical interview for senior Python position",
  "candidate_email": "candidate@example.com",
  "scheduled_at": "2024-01-15T14:00:00Z",
  "duration_minutes": 60,
  "metadata": {
    "difficulty": "senior",
    "technologies": ["python", "django", "postgresql"],
    "interview_type": "technical"
  }
}
```

**Response (201):**
```json
{
  "id": 123,
  "title": "Senior Python Developer Interview",
  "status": "scheduled",
  "recruiter_id": "uuid-string",
  "candidate_email": "candidate@example.com",
  "session_code": "ABC123",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### **Get Sessions**
```http
GET /api/sessions
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status`: Filter by status (`scheduled`, `active`, `completed`)
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset

**Response (200):**
```json
{
  "sessions": [
    {
      "id": 123,
      "title": "Senior Python Developer Interview",
      "status": "scheduled",
      "session_code": "ABC123",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### **Get Session Details**
```http
GET /api/sessions/{session_id}
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 123,
  "title": "Senior Python Developer Interview",
  "description": "Technical interview for senior Python position",
  "status": "active",
  "session_code": "ABC123",
  "recruiter_id": "uuid-string",
  "candidate_email": "candidate@example.com",
  "livekit_room": "interview-123",
  "created_at": "2024-01-01T00:00:00Z",
  "started_at": "2024-01-15T14:00:00Z"
}
```

---

## 💻 Coding Events

### **Execute Code**
```http
POST /api/coding/execute
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "session_id": 123,
  "code": "print('Hello, World!')",
  "language": "python",
  "input": ""
}
```

**Response (200):**
```json
{
  "output": "Hello, World!\n",
  "error": null,
  "execution_time": 0.123,
  "exit_code": 0,
  "memory_usage": 1024
}
```

### **Get Coding History**
```http
GET /api/coding/events/{session_id}
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "events": [
    {
      "id": 456,
      "session_id": 123,
      "event_type": "code_execution",
      "code": "print('Hello')",
      "language": "python",
      "output": "Hello\n",
      "created_at": "2024-01-15T14:05:00Z"
    }
  ]
}
```

---

## 🤖 AI Services

### **Complete Code**
```http
POST /api/ai/complete
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "Review this Python code and suggest improvements",
  "code": "def add(a, b): return a + b",
  "language": "python",
  "max_tokens": 500,
  "temperature": 0.1
}
```

**Response (200):**
```json
{
  "completion": "The code looks good. Consider adding type hints...",
  "model_used": "llama2",
  "tokens_used": 150,
  "confidence": 0.95
}
```

### **Analyze Code**
```http
POST /api/ai/analyze
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "def add(a, b): return a + b",
  "language": "python",
  "analysis_type": "quality"  // or "security", "performance"
}
```

**Response (200):**
```json
{
  "score": 8.5,
  "issues": [
    {
      "type": "style",
      "message": "Missing type hints",
      "line": 1,
      "severity": "info"
    }
  ],
  "suggestions": [
    "Add type hints: def add(a: int, b: int) -> int:"
  ]
}
```

---

## 📹 LiveKit Integration

### **Generate Token**
```http
POST /api/livekit/token
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "room_name": "interview-123",
  "participant_name": "John Doe",
  "participant_role": "host"  // or "guest"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "room_url": "wss://your-project.livekit.cloud",
  "expires_at": "2024-01-15T15:00:00Z"
}
```

---

## 📊 Evaluations

### **Create Evaluation**
```http
POST /api/evaluations
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "session_id": 123,
  "overall_score": 8.5,
  "coding_score": 9.0,
  "communication_score": 8.0,
  "problem_solving_score": 8.5,
  "key_findings": [
    {
      "category": "technical_skills",
      "finding": "Strong Python knowledge",
      "evidence": "Successfully solved complex algorithm problems"
    },
    {
      "category": "communication",
      "finding": "Clear explanations",
      "evidence": "Articulated thought process well"
    }
  ],
  "recommendations": [
    "Consider exploring system design topics",
    "Practice more complex data structures"
  ]
}
```

### **Get Evaluation**
```http
GET /api/evaluations/{session_id}
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 789,
  "session_id": 123,
  "overall_score": 8.5,
  "coding_score": 9.0,
  "communication_score": 8.0,
  "problem_solving_score": 8.5,
  "created_at": "2024-01-15T15:30:00Z"
}
```

---

## 🔍 WebSocket Events

### **Connection**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/session/{session_id}');

ws.onopen = () => {
  console.log('Connected to interview session');
};
```

### **Events**

#### **Code Update**
```json
{
  "type": "code_update",
  "data": {
    "session_id": 123,
    "code": "print('Updated code')",
    "language": "python",
    "timestamp": "2024-01-15T14:05:00Z"
  }
}
```

#### **Execution Result**
```json
{
  "type": "execution_result",
  "data": {
    "session_id": 123,
    "output": "Hello, World!\n",
    "exit_code": 0,
    "execution_time": 0.123,
    "timestamp": "2024-01-15T14:05:00Z"
  }
}
```

#### **AI Analysis**
```json
{
  "type": "ai_analysis",
  "data": {
    "session_id": 123,
    "analysis": "Code looks good with minor suggestions...",
    "confidence": 0.95,
    "timestamp": "2024-01-15T14:05:00Z"
  }
}
```

---

## 🔒 Error Responses

### **Authentication Errors**
```json
{
  "detail": "Invalid email or password"
}
```
**Status Codes:**
- `401`: Unauthorized
- `403`: Forbidden
- `422`: Validation error

### **Validation Errors**
```json
{
  "detail": [
    {
      "loc": ["email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### **Server Errors**
```json
{
  "detail": "Internal server error",
  "error_id": "uuid-for-tracking"
}
```
**Status Codes:**
- `500`: Internal server error
- `503`: Service unavailable

---

## 📝 Rate Limiting

### **Headers**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642697400
```

### **Rate Limited Response**
```json
{
  "detail": "Rate limit exceeded",
  "retry_after": 60
}
```
**Status Code:** `429 Too Many Requests`

---

## 🧪 Testing API

### **Using Swagger UI**
Visit: `http://localhost:8000/docs`

### **Using curl**
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test authentication
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/auth/me
```

### **Using Postman**
1. Set up a Postman collection for the API endpoints listed above
2. Set environment variables
3. Test endpoints with proper authentication

---

## 📚 Additional Resources

- **OpenAPI Spec**: `http://localhost:8000/openapi.json`
- **Migration Guide**: See `DEVELOPMENT.md`

---

*Last updated: February 2026*
