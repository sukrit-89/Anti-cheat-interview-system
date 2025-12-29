# 🎯 ZeroShotHire Guard - AI-Powered Interview Integrity System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![OpenCV](https://img.shields.io/badge/OpenCV-4.10-green.svg)
![MediaPipe](https://img.shields.io/badge/MediaPipe-0.10-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

*An intelligent, real-time interview proctoring system that ensures fairness and integrity in remote technical interviews through advanced computer vision and audio analysis.*

</div>

---

## 📌 Problem Statement

The shift to remote hiring has introduced significant challenges in maintaining interview integrity. Traditional manual monitoring is:
- ⏱️ **Time-consuming** and resource-intensive
- 🎲 **Subjective** and inconsistent across evaluators
- 📈 **Not scalable** for high-volume recruitment

**Common Cheating Behaviors:**
- 👀 Looking away for external assistance
- 💻 Tab/screen switching to access resources
- 🗣️ Receiving verbal hints from others
- 📱 Using unauthorized devices or notes

## 💡 Solution Overview

**ZeroShotHire Guard** is an automated anti-cheat system that leverages **AI-powered computer vision** and **audio analysis** to monitor candidate behavior in real-time. The system provides:
- 🔍 Transparent, explainable flagging system
- 📊 Quantifiable risk assessment
- 🏗️ Modular, extensible architecture
- 🎯 Both live monitoring and post-interview analysis

---

## ✨ Key Features

### 🟢 Implemented Features

| Feature | Description | Technology |
|---------|-------------|------------|
| **👁️ Face Detection** | Continuous presence verification<br/>• Detects absence from frame<br/>• Flags multiple faces | OpenCV + MediaPipe |
| **😑 Blink Analysis** | Behavioral pattern recognition<br/>• Tracks blink frequency<br/>• Identifies stress/distraction | MediaPipe Face Mesh |
| **👀 Gaze Tracking** | Eye direction monitoring<br/>• Auto-calibrates baseline<br/>• Flags off-screen attention | 3D Head Pose Estimation |
| **🎤 Audio Monitoring** | Voice activity detection<br/>• Background noise analysis<br/>• Multi-speaker identification | PyAudio + Signal Processing |
| **� Dual Modes** | Live webcam + Recorded video analysis | Threading + OpenCV |

### 🔶 Planned Enhancements

- **📊 Scoring System** - Weighted risk calculation with confidence intervals
- **📝 Report Generation** - Exportable JSON/PDF interview summaries
- **💻 Coding Simulator** - Integrated IDE with copy-paste detection
- **🌐 Web Dashboard** - Real-time interviewer monitoring interface
- **🤖 ML Classification** - Pattern-based cheating behavior prediction

---

## 🏗️ System Architecture

```
zeroshothire/
│
├── src/
│   ├── main.py                 # Entry point with CLI
│   ├── video/
│   │   ├── face_detector.py    # Multi-face detection
│   │   ├── blink_detector.py   # EAR-based blink analysis
│   │   ├── gaze_detector.py    # 3D pose estimation
│   │   └── ...
│   └── audio/
│       └── audio_detector.py   # Voice activity detection
│
├── data/                       # Sample videos for testing
├── reports/                    # Generated analysis outputs
├── requirements.txt
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Webcam (for live monitoring)
- Microphone (for audio analysis)

### Installation

```bash
# Clone the repository
git clone https://github.com/sukrit-89/Anti-cheat-interview-system.git
cd zeroshothire

# Install dependencies
pip install -r requirements.txt
```

### Usage

#### 🔴 Live Monitoring (Webcam + Microphone)
```bash
python src/main.py --live
```
- **ESC** to exit
- System calibrates gaze baseline for 3 seconds
- Real-time flags displayed on screen and console

#### 📹 Video Analysis (Post-Interview)
```bash
python src/main.py --video data/sample.mp4 --report reports/analysis.json
```
Generates a detailed JSON report with:
- Total suspicious events
- Risk score (0.0 - 1.0)
- Timestamped flag descriptions

---

## 🎥 Demo

### Live Monitoring Interface
*Real-time detection with visual feedback:*
- ✅ Green indicators for compliant behavior
- ⚠️ Red warnings for suspicious activities
- 📊 Live pitch/yaw gaze metrics

### Sample Output
```json
{
  "total_flags": 23,
  "risk_score": 0.69,
  "flags": [
    {"time": 12.5, "type": "multiple_faces"},
    {"time": 45.2, "type": "looking_away"},
    {"time": 78.1, "type": "no_face"}
  ]
}
```

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Core Language** | Python 3.8+ |
| **Computer Vision** | OpenCV, MediaPipe |
| **Audio Processing** | PyAudio, NumPy |
| **Utilities** | imutils, threading |
| **Future Stack** | React (Web UI), Flask/FastAPI (Backend) |

---

## 📊 Use Cases

- 🏢 **Corporate Recruitment** - High-stakes technical interviews
- 🎓 **Academic Assessments** - Remote examination monitoring
- 🏆 **Hackathons** - Preliminary screening rounds
- 🔬 **Research** - Behavioral analysis studies

---

## ⚖️ Ethics & Privacy

> [!CAUTION]
> This system is designed **exclusively** for ethical, transparent, and consented monitoring.

**Privacy Commitments:**
- ❌ **No biometric storage** - Face embeddings not saved
- ❌ **No identity recognition** - Only presence/behavior detection
- ✅ **Real-time only** - Processing happens locally
- ✅ **Transparent flags** - Explainable decision-making

**Compliance Requirements:**
- 📋 Informed consent from all participants
- 🔒 GDPR/local privacy law adherence
- 🎯 Purpose limitation (hiring/education only)

---

## � Future Roadmap

- [ ] **ML-Based Classification** - Train on behavioral patterns
- [ ] **Browser Extension** - Tab-switch detection
- [ ] **Plagiarism Engine** - Code similarity analysis
- [ ] **Cloud Deployment** - Scalable SaaS solution
- [ ] **Mobile Support** - iOS/Android monitoring

---

## 🤝 Contributing

Contributions are welcome! Areas of interest:
- 🧪 Testing on diverse datasets
- 🌐 Web interface development
- 🤖 ML model training
- 📖 Documentation improvements

---

## 👨‍💻 Author

**Sukrit Goswami**  
🎓 CSE (Data Science) Student  
🚀 Aspiring ML Engineer  
📧 [Contact](mailto:sukrit.goswami.work@example.com) | 🔗 [LinkedIn](https://www.linkedin.com/in/sukrit-goswami-5558a5321/)

---

## ⭐ Support

If this project helps your work or research, please **star** ⭐ the repository!

---

<div align="center">

**Built with ❤️ for fair and transparent remote hiring**

</div>
