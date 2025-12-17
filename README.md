# 🛡️ AI-Based Anti-Cheat Interview System

An AI-powered proctoring and monitoring system designed to detect suspicious behavior during online technical interviews using computer vision, audio analysis, and behavioral signals.

This project focuses on improving fairness, transparency, and integrity in remote interview processes.

---

## 📌 Problem Statement

With the rapid adoption of remote interviews, ensuring interview integrity has become challenging. Common cheating practices include:

- Looking away frequently for external help
- Presence of multiple people in the interview environment
- Receiving verbal hints or background assistance
- Using unauthorized resources during coding rounds

Manual monitoring is time-consuming, subjective, and not scalable.

---

## 💡 Proposed Solution

This system continuously monitors a candidate during an interview using AI-based detectors and flags suspicious behavior patterns in real time.

The architecture is modular, allowing easy integration of new detection features.

---

## 🧠 Features Implemented

### 👁️ Face Detection
- Ensures candidate presence throughout the interview
- Flags absence or multiple faces in the frame

### 😑 Blink Detection
- Tracks blink frequency
- Helps identify abnormal behavioral patterns

### 👀 Gaze Tracking
- Monitors eye movement and direction
- Detects frequent off-screen gaze

### 🎤 Audio Monitoring
- Detects background voices or unusual audio activity

---

## 🚧 Features Under Development

### 💻 Coding Simulator
- Browser-based coding environment
- Time-bound problem solving
- Tab-switch and copy-paste detection

### 📊 Behavior Scoring System
- Weighted scoring instead of binary decisions
- Transparent evaluation criteria

### 📄 Interview Summary Report
- Auto-generated behavioral analysis report
- Downloadable for interviewers

---

## 🛠️ Tech Stack

- Python
- OpenCV
- MediaPipe
- NumPy
- Computer Vision
- Machine Learning

---

## 🗂️ Project Structure

Anti-cheat-interview-system/
│
├── audio_detection/
├── face_detection/
├── blink_detection/
├── gaze_tracking/
├── coding_simulator/ # In progress
│
├── main.py
├── requirements.txt
└── README.md


---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/sukrit-89/Anti-cheat-interview-system.git
cd Anti-cheat-interview-system
pip install -r requirements.txt
python main.py


A webcam and microphone are required for full functionality.

🎯 Use Cases

Online technical interviews

Hackathon preliminary screening

Remote assessments

Academic research on interview integrity

⚠️ Ethical & Privacy Disclaimer

This project is intended strictly for educational and research purposes.

No biometric identity recognition is performed

No facial or audio data is stored

Monitoring is done in real time only

Explicit candidate consent is required before usage

Any real-world deployment must comply with applicable data protection and privacy laws.

🚀 Future Scope

AI-based cheating pattern classification

Browser extension integration

Code plagiarism detection

Real-time interviewer dashboard

Secure cloud-based deployment

👨‍💻 Author

Sukrit Goswami
CSE (Data Science)
Aspiring Machine Learning Engineer
