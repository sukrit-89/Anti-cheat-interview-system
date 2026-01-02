# ZeroShotHire Guard - Web Dashboard Guide

## 🚀 Quick Start

### Backend Setup

1. **Install Python Dependencies**:
```bash
pip install -r requirements.txt
```

2. **Start Backend Server**:
```bash
python run_backend.py
```

Backend will be available at: `http://localhost:8000`  
API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to Frontend**:
```bash
cd frontend
```

2. **Install NPM Dependencies**:
```bash
npm install
```

3. **Start Frontend Dev Server**:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## 📸 Features

### Dashboard
- **Quick Stats**: View total sessions, completed interviews, and high-risk count
- **Recent Activity**: See the latest 5 sessions at a glance

### Session Management
- **List All Sessions**: Browse every interview session
- **View Details**: See complete analysis with flags, timestamps, and risk scores
- **Delete Sessions**: Remove sessions and associated data

### Video Upload & Analysis
- **Upload Videos**: Drag and drop or browse for interview videos
- **Real-time Progress**: Track upload and analysis progress
- **Instant Results**: Get risk scores and flag counts immediately

### Reports
- **PDF Reports**: Download professional reports with charts
- **JSON Data**: Access structured data for programmatic use
- **Flag Timeline**: Visual timeline of all detected violations

---

## 🎓 Usage Examples

### Upload a Video
1. Click "Upload Video" in the navigation
2. Enter candidate ID (e.g., "CAND001")
3. Select video file (.mp4, .avi, etc.)
4. Click "Upload & Analyze"
5. Wait for analysis to complete

### View Session Details
1. Go to "Sessions" tab
2. Click "View" on any session
3. Review risk score, flags, and timeline
4. Download PDF report if needed

### Monitor Dashboard
- Check dashboard for quick overview
- Identify high-risk sessions at a glance
- Track completion rate

---

## 🔧 Troubleshooting

### Backend Issues
- **Port 8000 in use**: Change port in `run_backend.py`
- **Database locked**: Stop all backend processes and restart
- **Module not found**: Run `pip install -r requirements.txt` again

### Frontend Issues
- **Port 3000 in use**: Frontend will auto-select next available port
- **API connection failed**: Ensure backend is running at `localhost:8000`
- **Build errors**: Delete `node_modules` and run `npm install` again

---

## 📁 Project Structure

```
zeroshothire/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # DB configuration
│   └── analysis_service.py  # Video analysis integration
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   ├── App.jsx          # Main app
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
├── src/                     # Core detection modules
├── reports/                 # Generated reports
├── uploads/                 # Uploaded videos
└── run_backend.py          # Server runner
```

---

## 🌐 API Endpoints

- `GET /api/sessions` - List all sessions
- `GET /api/sessions/{id}` - Get session details
- `POST /api/upload` - Upload and analyze video
- `DELETE /api/sessions/{id}` - Delete session
- `GET /api/reports/{id}/json` - Get JSON report
- `GET /api/reports/{id}/pdf` - Get PDF report
- `WS /ws/live/{id}` - WebSocket for live monitoring

Full API documentation available at: `http://localhost:8000/docs`
