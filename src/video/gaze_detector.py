# src/video/gaze_detector.py
import cv2
import mediapipe as mp
import numpy as np
import time

class GazeDetector:
    def __init__(self, angle_threshold=20, calibration_time=4):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )
        self.angle_threshold = angle_threshold
        self.calibration_time = calibration_time
        self.calibrated = False
        self.baseline_pitch = 0
        self.baseline_yaw = 0
        self.dynamic_threshold = None

    def _get_head_pose(self, landmarks, w, h):
        face_3d = []
        face_2d = []
        idxs = [33, 263, 1, 61, 291, 199]  # key landmarks

        for idx in idxs:
            x, y = int(landmarks[idx].x * w), int(landmarks[idx].y * h)
            face_2d.append([x, y])
            face_3d.append([x, y, landmarks[idx].z * 3000])

        face_2d = np.array(face_2d, dtype=np.float64)
        face_3d = np.array(face_3d, dtype=np.float64)

        focal_length = w
        cam_matrix = np.array([[focal_length, 0, w / 2],
                               [0, focal_length, h / 2],
                               [0, 0, 1]])
        dist_matrix = np.zeros((4, 1), dtype=np.float64)

        success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)
        if not success:
            return None

        rmat, _ = cv2.Rodrigues(rot_vec)
        angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)
        pitch, yaw, roll = [a * 180 for a in angles]
        return pitch, yaw, roll

    def analyze_frame(self, frame):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self.face_mesh.process(rgb)
        if not result.multi_face_landmarks:
            return None, False, None

        h, w, _ = frame.shape
        landmarks = result.multi_face_landmarks[0].landmark
        pose = self._get_head_pose(landmarks, w, h)
        if pose is None:
            return None, False, None

        pitch, yaw, roll = pose

        # Calibration
        if not self.calibrated:
            if not hasattr(self, "_calibration_start"):
                self._calibration_start = time.time()
                self.pitch_samples = []
                self.yaw_samples = []

            elapsed = time.time() - self._calibration_start
            self.pitch_samples.append(pitch)
            self.yaw_samples.append(yaw)

            remaining = self.calibration_time - elapsed
            if remaining <= 0:
                self.baseline_pitch = np.mean(self.pitch_samples)
                self.baseline_yaw = np.mean(self.yaw_samples)

                # compute natural variation → dynamic threshold
                pitch_std = np.std(self.pitch_samples)
                yaw_std = np.std(self.yaw_samples)
                self.dynamic_threshold = max(10, (pitch_std + yaw_std) * 5)

                self.calibrated = True
                print(f"[INFO] Gaze calibrated → pitch={self.baseline_pitch:.1f}, yaw={self.baseline_yaw:.1f}, threshold={self.dynamic_threshold:.1f}")

            return (pitch, yaw, roll), False, max(0, remaining)

        # After calibration for the gaze
        delta_pitch = abs(pitch - self.baseline_pitch)
        delta_yaw = abs(yaw - self.baseline_yaw)
        threshold = self.dynamic_threshold or self.angle_threshold

        looking_away = delta_yaw > threshold or delta_pitch > threshold
        return (pitch, yaw, roll), looking_away, None

    def analyze_live_camera(self):
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("[ERROR] Cannot open webcam.")
            return

        print("[INFO] Starting live gaze detection (ESC to exit)")

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            pose, looking_away, remaining = self.analyze_frame(frame)

            if pose:
                pitch, yaw, _ = pose
                cv2.putText(frame, f"Pitch: {pitch:.1f} | Yaw: {yaw:.1f}", (20, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 2)

            if not self.calibrated:
                cv2.putText(frame, f"Hold still... Calibrating ({int(remaining)}s left)",
                            (20, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            else:
                if looking_away:
                    cv2.putText(frame, "⚠ LOOKING AWAY!", (20, 80),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 3)
                else:
                    cv2.putText(frame, "Looking Forward ✅", (20, 80),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            cv2.imshow("Gaze Detection", frame)

            if cv2.waitKey(1) & 0xFF == 27:
                break

        cap.release()
        cv2.destroyAllWindows()
        print("[INFO] Camera released successfully.")
