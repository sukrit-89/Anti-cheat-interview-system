# 🛡️ Satya Guard (सत्य)

**AI-Powered Interview Integrity Platform**

An advanced, real-time interview monitoring system that uses computer vision and audio analysis to detect suspicious behavior during virtual interviews. Built with cutting-edge technologies including Firebase Authentication, Cloudinary storage, and comprehensive AI-powered analysis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)

---

## 🌟 Features

### 🔐 **Authentication & Access Control**
- **Firebase Authentication** - Secure user registration and login
- **Role-Based Access** - Distinct permissions for Interviewers and Interviewees
- **Join Code System** - 6-character codes for session joining
- **JWT Token Verification** - Backend validates Firebase tokens

### 🎥 **Real-Time Monitoring**
- **Live Video Analysis** - Frame-by-frame behavioral detection
- **Audio Anomaly Detection** - Identifies suspicious audio patterns
- **Gaze Tracking** - MediaPipe-powered eye movement analysis
- **Face Detection** - Multiple face detection and verification
- **Object Recognition** - Phone and suspicious object detection

### 📊 **Comprehensive Reporting**
- **Risk Assessment** - AI-calculated integrity scores (0-100)
- **Detailed Analytics** - Timestamped flags with severity levels
- **PDF Reports** - Professional, downloadable analysis reports
- **Visual Dashboards** - Real-time statistics and charts
- **Export Options** - JSON and PDF report formats

### ☁️ **Cloud Infrastructure**
- **Cloudinary Integration** - Scalable video and report storage
- **Firebase Backend** - Reliable authentication infrastructure
- **CDN Delivery** - Fast, global content distribution
- **Secure URLs** - Signed, time-limited resource access

### 🎨 **Premium UI/UX**
- **Glassmorphism Design** - Modern, translucent card effects
- **Animated Gradients** - Eye-catching background animations
- **Dark Mode Support** - Elegant color schemes
- **Responsive Layout** - Mobile and desktop optimized
- **Interactive Animations** - Smooth transitions and micro-interactions

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Satya Guard Platform                     │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
        ┌──────────┐   ┌──────────┐  ┌──────────┐
        │ Firebase │   │ Frontend │  │  Backend │
        │   Auth   │   │  (React) │  │ (FastAPI)│
        └──────────┘   └──────────┘  └──────────┘
                              │             │
                              └──────┬──────┘
                                     ▼
                        ┌────────────────────────┐
                        │   Analysis Pipeline    │
                        │ ┌──────────────────┐   │
                        │ │ Video Analysis   │   │
                        │ │ Audio Detection  │   │
                        │ │ Gaze Tracking    │   │
                        │ │ Risk Scoring     │   │
                        │ └──────────────────┘   │
                        └────────────────────────┘
                                     │
                        ┌────────────┴───────────┐
                        ▼                        ▼
                  ┌──────────┐           ┌──────────┐
                  │Cloudinary│           │  SQLite  │
                  │ Storage  │           │ Database │
                  └──────────┘           └──────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Firebase Project
- Cloudinary Account

### 1. Clone Repository

```bash
git clone https://github.com/sukrit-89/Anti-cheat-interview-system.git
cd Anti-cheat-interview-system
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

**Backend (.env):**
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env):**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Setup

1. Create Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Email/Password** authentication
3. Download service account JSON → save as `firebase-service-account.json`
4. Copy Firebase config to frontend `.env`

### 5. Frontend Setup

```bash
cd frontend
npm install
```

### 6. Run Application

**Terminal 1 - Backend:**
```bash
python run_backend.py
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App: http://localhost:3000
```

---

## 📖 Usage Guide

### For Interviewers

1. **Register** - Create account with INTERVIEWER role
2. **Create Session** - Generate unique join code
3. **Share Code** - Send 6-character code to interviewee
4. **Monitor Live** - Watch real-time analysis dashboard
5. **Review Reports** - Access detailed PDF reports

### For Interviewees

1. **Register** - Create account with INTERVIEWEE role
2. **Join Session** - Enter 6-character join code
3. **Complete Interview** - System monitors automatically
4. **View Results** - Access your own interview reports

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** 0.104+ - Modern Python web framework
- **SQLAlchemy** 2.0 - SQL toolkit and ORM
- **Firebase Admin SDK** - Backend authentication
- **Cloudinary SDK** - Cloud storage integration
- **MediaPipe** 0.10.14 - Computer vision models
- **Librosa** - Audio analysis library
- **OpenCV** 4.8+ - Image processing
- **ReportLab** - PDF report generation

### Frontend
- **React** 18.0 - UI library
- **Vite** 5.0 - Build tool and dev server
- **Firebase SDK** - Client-side authentication
- **Fetch API** - HTTP requests with JWT tokens
- **CSS3** - Custom animations and glassmorphism

### Infrastructure
- **Firebase Authentication** - User management
- **Cloudinary** - Video and PDF storage
- **SQLite** - Local database
- **WebSocket** - Real-time communication

---

## 📊 Detection Capabilities

| Category | Detection Methods | Severity Levels |
|----------|------------------|-----------------|
| **Gaze** | Eye movement tracking, looking away detection | Low, Medium, High |
| **Face** | Multiple face detection, face absence | High |
| **Audio** | Voice anomalies, background noise, silence | Low, Medium |
| **Objects** | Phone detection, suspicious items | Medium, High |
| **Behavior** | Head movements, posture changes | Low, Medium |

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/sync` - Sync Firebase user to database
- `GET /api/auth/me` - Get current user info

### Sessions
- `POST /api/sessions/create` - Create session (Interviewer)
- `POST /api/sessions/join` - Join with code (Interviewee)
- `GET /api/sessions` - List all sessions
- `GET /api/sessions/{id}` - Get session details
- `GET /api/sessions/my-reports` - Get own reports (Interviewee)

### Analysis
- `POST /api/upload` - Upload interview video
- `GET /api/reports/{id}/json` - Get JSON report
- `GET /api/reports/{id}/pdf` - Download PDF report

### Live Monitoring
- `WebSocket /ws/live/{session_id}` - Real-time analysis stream

---

## 🔒 Security Features

- **Firebase Authentication** - Industry-standard user auth
- **JWT Token Verification** - Secure API access
- **Role-Based Access Control** - Permission-based features
- **Signed URLs** - Time-limited Cloudinary access
- **CORS Protection** - Configured allowed origins
- **Input Validation** - Pydantic schema validation
- **SQL Injection Protection** - SQLAlchemy ORM

---

## 📁 Project Structure

```
Anti-cheat-interview-system/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── models.py               # Database models
│   ├── schemas.py              # Pydantic schemas
│   ├── firebase_auth.py        # Firebase authentication
│   ├── cloudinary_service.py   # Cloud storage service
│   ├── analysis_service.py     # Video analysis pipeline
│   ├── report_generator.py     # PDF report creation
│   ├── scoring_engine.py       # Risk assessment
│   └── utils.py                # Helper functions
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API integration
│   │   ├── firebase.js         # Firebase config
│   │   ├── App.jsx             # Main application
│   │   └── index.css           # Styles
│   └── package.json
├── src/
│   ├── video/                  # Video analysis modules
│   │   └── gaze_detector.py
│   └── audio/                  # Audio analysis modules
│       └── audio_detector.py
├── requirements.txt            # Python dependencies
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sukrit Goswami**
- Email: sukrit.goswami.work@gmail.com
- GitHub: [@sukrit-89](https://github.com/sukrit-89)

---

## 🙏 Acknowledgments

- **MediaPipe** - For powerful computer vision models
- **Firebase** - For authentication infrastructure
- **Cloudinary** - For reliable cloud storage
- **FastAPI** - For modern Python web framework
- **React** - For excellent UI development

---

## 📞 Support

For issues, questions, or suggestions:
- 🐛 [Create an Issue](https://github.com/sukrit-89/Anti-cheat-interview-system/issues)
- 📧 Email: sukrit.goswami.work@gmail.com

---

<div align="center">

**Built with ❤️**

⭐ Star this repo if you find it helpful!

</div>
