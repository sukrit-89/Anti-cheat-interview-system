# src/video/blink_detector.py
import cv2
import mediapipe as mp
import numpy as np

class BlinkDetector:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )

        # Eye landmarks for blink detection
        self.left_eye_idx = [33, 160, 158, 133, 153, 144]
        self.right_eye_idx = [263, 387, 385, 362, 380, 373]

    def _eye_aspect_ratio(self, eye_points):
        # EAR = (vertical distance) / (horizontal distance)
        v1 = np.linalg.norm(eye_points[1] - eye_points[5])
        v2 = np.linalg.norm(eye_points[2] - eye_points[4])
        h = np.linalg.norm(eye_points[0] - eye_points[3])
        return (v1 + v2) / (2.0 * h)

    def analyze_video(self, video_path, blink_threshold=0.22, min_blinks=1):
        """Detects if user blinks at least once during the session."""
        cap = cv2.VideoCapture(video_path)
        blink_count, frame_idx = 0, 0
        flags = []
        ear_prev = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = self.face_mesh.process(rgb)

            if not result.multi_face_landmarks:
                frame_idx += 1
                continue

            h, w, _ = frame.shape
            landmarks = result.multi_face_landmarks[0].landmark

            def get_eye_points(index_list):
                return np.array([(landmarks[i].x * w, landmarks[i].y * h) for i in index_list])

            left_eye = get_eye_points(self.left_eye_idx)
            right_eye = get_eye_points(self.right_eye_idx)

            ear_left = self._eye_aspect_ratio(left_eye)
            ear_right = self._eye_aspect_ratio(right_eye)
            ear_avg = (ear_left + ear_right) / 2.0

            if ear_avg < blink_threshold and ear_prev >= blink_threshold:
                blink_count += 1

            ear_prev = ear_avg
            frame_idx += 1

        cap.release()
        if blink_count < min_blinks:
            flags.append({"type": "no_blink_detected", "blinks": blink_count})
        return flags
