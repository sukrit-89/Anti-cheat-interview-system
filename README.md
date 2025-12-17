🎯 AI-Based Anti-Cheat Interview Monitoring System

An AI-powered interview proctoring system designed to detect and restrict unfair practices during online technical interviews by analyzing visual, behavioral, and audio cues in real time.

📌 Problem Statement

With the rapid shift to remote interviews, maintaining fairness and integrity has become a major challenge.
Candidates may engage in cheating behaviors such as:

Looking away repeatedly (external assistance)

Switching tabs or screens

Receiving verbal hints

Using unauthorized resources during coding rounds

Manual monitoring is time-consuming, subjective, and not scalable.

💡 Solution Overview

This project provides an automated anti-cheat interview system that continuously monitors a candidate’s behavior using computer vision and audio analysis, and flags suspicious activities during interviews.

The system is designed to be transparent, modular, and extensible.

🧠 Features Implemented
👁️ Face Detection

Detects presence of candidate throughout the interview

Flags multiple faces or absence from frame

😑 Blink Detection

Tracks blink frequency

Identifies abnormal blinking patterns (stress / distraction)

👀 Gaze Tracking

Monitors eye direction

Flags frequent off-screen gaze indicating external help

🎤 Audio Monitoring

Detects background voices and unusual audio activity

Helps identify verbal assistance

🚧 Features Under Development
💻 Coding Simulator

In-browser coding environment

Time-bound problem solving

Copy-paste & tab-switch detection

📊 Behavior Scoring System

Weighted scoring for suspicious activities

Transparent evaluation instead of black-box decisions

📁 Interview Report Generation

Summary of detected events

Downloadable evaluation report for interviewers

🛠️ Tech Stack

Python

OpenCV

MediaPipe

NumPy

Machine Learning

Computer Vision

(Planned) Web-based coding environment

🗂️ Project Structure
anti-cheat-interview-system/
│
├── audio_detection/
├── face_detection/
├── blink_detection/
├── gaze_tracking/
├── coding_simulator/        # (In progress)
│
├── main.py
├── requirements.txt
└── README.md

⚙️ Installation & Setup
git clone https://github.com/your-username/anti-cheat-interview-system.git
cd anti-cheat-interview-system
pip install -r requirements.txt
python main.py


⚠️ A webcam and microphone are required for full functionality.

📈 Use Cases

Online technical interviews

Hackathon preliminary rounds

Remote assessments

Academic integrity monitoring (research use)

⚠️ Ethical & Privacy Disclaimer

This project is developed strictly for educational and research purposes.

No biometric data is stored

No facial identity recognition is performed

All monitoring happens in real time

Designed to promote fairness and transparency

Any deployment must comply with local privacy laws and informed user consent.

🚀 Future Scope

AI-based cheating pattern classification

Browser extension integration

Plagiarism detection in coding rounds

Real-time dashboard for interviewers

Secure cloud-based deployment

👨‍💻 Author

Sukrit Goswami
CSE (Data Science) Student
Aspiring Machine Learning Engineer

⭐ Final Note

If you find this project useful or interesting, feel free to star ⭐ the repository and explore future updates.
