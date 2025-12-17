# src/main.py
import argparse
import json
import warnings
import os
import cv2
import threading
import time

# Suppress Mediapipe / TensorFlow warnings
warnings.filterwarnings("ignore")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from video.face_detector import FaceDetector
from video.blink_detector import BlinkDetector
from video.gaze_detector import GazeDetector
from audio.audio_detector import AudioDetector


def analyze_video(video_path, report_path):
    """Analyze a recorded video file."""
    face_detector = FaceDetector()
    blink_detector = BlinkDetector()

    print("[INFO] Analyzing faces...")
    face_flags = face_detector.analyze_video(video_path)

    print("[INFO] Analyzing blinks...")
    blink_flags = blink_detector.analyze_video(video_path)

    all_flags = face_flags + blink_flags
    risk_score = min(len(all_flags) * 0.1, 1.0)

    report = {
        "video": video_path,
        "total_flags": len(all_flags),
        "risk_score": risk_score,
        "flags": all_flags,
    }

    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[INFO] Report saved to {report_path}")


def analyze_live_camera():
    """Run live visual + audio detection together."""
    face_detector = FaceDetector()
    blink_detector = BlinkDetector()
    gaze_detector = GazeDetector()
    audio_detector = AudioDetector()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERROR] Cannot open webcam.")
        return

    print("[INFO] Starting live visual + audio detection (Press ESC to exit)")

    stop_audio_flag = threading.Event()

    def run_audio_monitor():
        """Run audio monitoring in background until stop flag is set."""
        while not stop_audio_flag.is_set():
            audio, fs = audio_detector._record_audio()
            db, voiced = audio_detector._analyze_audio(audio, fs)

            if db < audio_detector.threshold_db:
                print("[FLAG] Too quiet — possibly muted mic.")
            elif voiced > 5:
                print("[FLAG] Multiple voices or background noise detected!")
            else:
                print("[OK] Normal voice detected.")
            time.sleep(1)

    # Start audio thread
    audio_thread = threading.Thread(target=run_audio_monitor, daemon=True)
    audio_thread.start()

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            pose, looking_away, remaining = gaze_detector.analyze_frame(frame)
            face_count = face_detector.analyze_frame(frame)

            # Face-related flags
            if face_count == 0:
                cv2.putText(frame, "⚠ No face detected!", (20, 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                print("[FLAG] No face detected!")
            elif face_count > 1:
                cv2.putText(frame, "⚠ Multiple faces detected!", (20, 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                print("[FLAG] Multiple faces detected!")

            # Gaze feedback on screen
            if pose:
                pitch, yaw, _ = pose
                cv2.putText(frame, f"Pitch: {pitch:.1f} | Yaw: {yaw:.1f}",
                            (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 2)

            if not gaze_detector.calibrated:
                if remaining is not None:
                    cv2.putText(frame, f"Calibrating... Hold still ({int(remaining)}s)",
                                (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            else:
                if looking_away:
                    cv2.putText(frame, "⚠ LOOKING AWAY!", (20, 90),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 3)
                    print("[FLAG] Looking away from screen!")
                else:
                    cv2.putText(frame, "Looking Forward ✅", (20, 90),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            cv2.imshow("ZeroShotHire Live Monitor", frame)

            if cv2.waitKey(1) & 0xFF == 27:
                break

    finally:
        stop_audio_flag.set()
        cap.release()
        cv2.destroyAllWindows()
        print("[INFO] Camera released and audio stopped successfully.")



def main():
    parser = argparse.ArgumentParser(description="ZeroShotHire-Guard")
    parser.add_argument("--live", action="store_true",
                        help="Use webcam + mic for live detection")
    parser.add_argument("--video", type=str,
                        help="Path to video file for offline analysis")
    parser.add_argument("--report", type=str,
                        default="reports/report.json",
                        help="Path to save JSON report (video mode only)")
    args = parser.parse_args()

    if args.live:
        analyze_live_camera()
    elif args.video:
        analyze_video(args.video, args.report)
    else:
        print("Usage examples:")
        print("  python src/main.py --live")
        print("  python src/main.py --video data/sample.mp4")


if __name__ == "__main__":
    main()
