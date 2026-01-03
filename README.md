# 🛡️ Satya Guard - Interview Integrity Platform

**Satya** (सत्य = Truth) **Guard** is an AI-powered interview integrity monitoring platform that uses computer vision and audio analysis to detect suspicious behavior during remote technical interviews.

![Platform Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![React](https://img.shields.io/badge/react-18-blue)
![FastAPI](https://img.shields.io/badge/fastapi-0.104-green)

---

## ✨ Features

### 🎯 **Real-Time Monitoring**
- Live webcam-based interview monitoring
- Instant flag detection and logging
- Real-time risk score calculation
- Session persistence with full reports

### 📹 **Video Analysis**
- Upload pre-recorded interview videos
- Automated integrity analysis
- Comprehensive PDF & JSON reports
- Visual analytics with charts

### 🧠 **AI Detection** (No LLM Required!)
- **Face Detection**: Multiple face/no face detection (MediaPipe)
- **Blink Analysis**: Suspicious eye behavior patterns  
- **Gaze Tracking**: Off-screen looking detection via 3D pose estimation
- **Audio Analysis**: Multi-voice detection (Libros

### 📊 **Professional Dashboard**
- Beautiful modern UI with gradient design
- Session management with CRUD operations
- Detailed session timelines
- Risk-level categorization (LOW/MEDIUM/HIGH)
- Downloadable PDF reports

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Clone repository
git clone https://github.com/sukrit-89/Anti-cheat-interview-system.git
cd Anti-cheat-interview-system

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run backend
python run_backend.py
```

Backend will be available at: **http://localhost:8000**  
API docs: **http://localhost:8000/docs**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## 📖 Usage

### 1. **Live Monitoring**
1. Navigate to "Live Monitor" tab
2. Enter candidate ID
3. Click "Start Live Monitoring"
4. Flags are detected and logged in real-time
5. Click "Stop & Generate Report" when done
6. Full report auto-generated and saved

### 2. **Video Upload**
1. Go to "Upload Video" tab
2. Drag & drop video file or browse
3. Enter candidate ID
4. Click "Upload & Analyze"
5. View instant results with risk score

### 3. **Review Sessions**
1. Navigate to "Sessions" tab
2. View all interview sessions
3. Click "View" for detailed timeline
4. Download PDF reports

---

## 🏗️ Architecture

### Backend (FastAPI)
```
backend/
├── main.py              # FastAPI app with REST endpoints
├── models.py            # SQLAlchemy database models
├── schemas.py           # Pydantic validation schemas
├── database.py          # Database configuration
└── analysis_service.py  # Video analysis integration
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── SessionList.jsx
│   │   ├── VideoUpload.jsx
│   │   ├── SessionDetail.jsx
│   │   └── LiveMonitor.jsx
│   ├── services/
│   │   └── api.js
│   └── App.jsx
└── public/
    ├── logo-icon.png
    └── logo-full.png
```

### Detection Modules
```
src/
├── video/
│   ├── face_detector.py    # MediaPipe face detection
│   ├── blink_detector.py   # Eye aspect ratio analysis
│   └── gaze_detector.py    # 3D head pose estimation
├── audio/
│   └── audio_detector.py   # Voice activity detection
└── reporting/
    ├── scoring_engine.py   # Risk calculation
    └── report_generator.py # PDF/JSON generation
```

---

## 🔧 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Computer Vision** | MediaPipe 0.10.14 | Face/gaze/blink detection |
| **Backend API** | FastAPI 0.104+ | REST endpoints |
| **Database** | SQLite (SQLAlchemy 2.0) | Session storage |
| **Frontend** | React 18 + Vite 5 | Modern UI |
| **Reporting** | ReportLab + Matplotlib | PDF & charts |
| **Audio** | Librosa + sounddevice | Voice analysis |

---

## 📊 Detection Capabilities

### Face Detection
- ✅ No face detected
- ✅ Multiple faces detected
- ✅ Face tracking across frames

### Gaze Tracking
- ✅ Looking away from screen
- ✅ Head orientation analysis
- ✅ Dynamic calibration

### Blink Analysis
- ✅ Abnormal blink patterns
- ✅ Eye closure detection
- ✅ Baseline comparison

### Audio Analysis
- ✅ Multiple speakers
- ✅ Voice activity detection
- ✅ Background noise analysis

---

## 📈 Sample Output

**Risk Score**: 0.000 - 1.000  
**Risk Levels**: LOW (<0.3) | MEDIUM (0.3-0.6) | HIGH (>0.6)  
**Report Formats**: JSON (machine-readable) + PDF (human-readable)

**PDF Report Includes**:
- Executive summary
- Risk assessment with confidence intervals
- Flag distribution pie chart
- Temporal distribution bar chart
- Risk gauge visualization
- Timestamped flag timeline

---

## 🎨 Branding

**Name**: Satya Guard (सत्य = Truth in Sanskrit)  
**Tagline**: Interview Integrity Platform  
**Logo**: Purple shield with eye (monitoring) and circuit elements (AI)  

---

## 🔐 Privacy & Ethics

- **Offline Processing**: All analysis runs locally, no external API calls
- **Data Privacy**: Video files and reports stored locally
- **Transparency**: Clear disclosure to candidates required
- **Fairness**: Algorithmic detection, no bias in ML models
- **Purpose**: Designed to ensure fair interview processes

---

## 🛣️ Roadmap

### Phase 3 (Future)
- [ ] Advanced ML-based behavioral classification
- [ ] Browser tab monitoring extension
- [ ] Code plagiarism detection
- [ ] Multi-language support
- [ ] Cloud deployment
- [ ] User authentication (JWT)
- [ ] Email notifications
- [ ] Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Author

**Sukrit** - [GitHub](https://github.com/sukrit-89)

---

## 🙏 Acknowledgments

- MediaPipe team for face detection models
- FastAPI for excellent API framework
- React team for modern frontend library
- Open-source community

---

## 📧 Support

For issues and questions:
- Open an [Issue](https://github.com/sukrit-89/Anti-cheat-interview-system/issues)
- Email: [sukrit.goswami.work@gmail.com]

---

**Built with ❤️ in India**
