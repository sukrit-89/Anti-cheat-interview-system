# src/main.py
import argparse
import json
import warnings
import os
import cv2

# Suppress Mediapipe / TensorFlow warnings
warnings.filterwarnings("ignore")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from video.face_detector import FaceDetector
from video.blink_detector import BlinkDetector


def analyze_video(video_path, report_path):
    """Analyze an offline video file."""
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
    """Run live webcam detection."""
    face_detector = FaceDetector()
    blink_detector = BlinkDetector()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERROR] Cannot open webcam.")
        return

    print("[INFO] Starting live detection (Press ESC to exit)")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            face_count = face_detector.analyze_frame(frame)
            if face_count == 0:
                print("[FLAG] No face detected!")
            elif face_count > 1:
                print("[FLAG] Multiple faces detected!")

            # Optional: show the camera feed
            cv2.imshow("ZeroShotHire-Guard Live", frame)

            if cv2.waitKey(1) & 0xFF == 27:  # ESC key
                break
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("[INFO] Camera released successfully.")


def main():
    parser = argparse.ArgumentParser(description="ZeroShotHire-Guard")
    parser.add_argument("--live", action="store_true",
                        help="Use webcam for live detection")
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
