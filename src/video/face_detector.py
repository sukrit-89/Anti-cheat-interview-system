# src/video/face_detector.py
import cv2
import mediapipe as mp

class FaceDetector:
    def __init__(self, min_confidence=0.5):
        self.mp_face = mp.solutions.face_detection
        self.detector = self.mp_face.FaceDetection(
            model_selection=0, min_detection_confidence=min_confidence
        )

    def analyze_frame(self, frame):
        """Return number of detected faces in the given frame."""
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self.detector.process(rgb)
        count = len(result.detections) if result.detections else 0
        return count

    def analyze_video(self, video_path):
        """Iterate through video frames and log face count flags."""
        cap = cv2.VideoCapture(video_path)   # ✅ fixed (was 0 earlier)
        flags, frame_idx = [], 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            count = self.analyze_frame(frame)
            if count == 0:
                flags.append({"frame": frame_idx, "type": "no_face"})
            elif count > 1:
                flags.append({"frame": frame_idx, "type": "multi_face"})

            frame_idx += 1

        cap.release()
        return flags
