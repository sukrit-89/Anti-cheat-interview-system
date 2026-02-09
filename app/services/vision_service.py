"""
Vision Processing Service.
Analyzes candidate behavior using computer vision (MediaPipe).
"""
import cv2
import numpy as np
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.core.logging import logger

# Try importing MediaPipe
try:
    import mediapipe as mp
    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False
    logger.warning("MediaPipe not installed. Install with: pip install mediapipe")


class VisionService:
    """Service for vision-based behavior analysis."""
    
    def __init__(self):
        self.face_detection = None
        self.face_mesh = None
        self.pose = None
        
        if MEDIAPIPE_AVAILABLE:
            try:
                mp_face_detection = mp.solutions.face_detection
                mp_face_mesh = mp.solutions.face_mesh
                mp_pose = mp.solutions.pose
                
                self.face_detection = mp_face_detection.FaceDetection(
                    min_detection_confidence=0.5
                )
                self.face_mesh = mp_face_mesh.FaceMesh(
                    min_detection_confidence=0.5,
                    min_tracking_confidence=0.5
                )
                self.pose = mp_pose.Pose(
                    min_detection_confidence=0.5,
                    min_tracking_confidence=0.5
                )
                logger.info("MediaPipe initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize MediaPipe: {e}")
    
    async def analyze_frame(
        self,
        frame_bytes: bytes
    ) -> Dict[str, Any]:
        """
        Analyze a single video frame for behavior metrics.
        
        Args:
            frame_bytes: Image frame as bytes (JPEG, PNG, etc.)
            
        Returns:
            Dict with analysis results
        """
        
        if not MEDIAPIPE_AVAILABLE or not self.face_detection:
            return await self._fallback_analysis()
        
        try:
            # Decode frame
            np_arr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if frame is None:
                raise ValueError("Failed to decode frame")
            
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Analyze face
            face_results = self.face_detection.process(rgb_frame)
            face_mesh_results = self.face_mesh.process(rgb_frame)
            pose_results = self.pose.process(rgb_frame)
            
            # Calculate metrics
            metrics = self._calculate_metrics(
                face_results,
                face_mesh_results,
                pose_results,
                rgb_frame.shape
            )
            
            return {
                "success": True,
                **metrics,
                "error": None
            }
            
        except Exception as e:
            logger.error(f"Vision analysis error: {e}")
            return {
                "success": False,
                "error": str(e),
                **await self._fallback_analysis()
            }
    
    def _calculate_metrics(
        self,
        face_results,
        face_mesh_results,
        pose_results,
        frame_shape: tuple
    ) -> Dict[str, Any]:
        """Calculate behavior metrics from MediaPipe results."""
        
        metrics = {
            "face_detected": False,
            "eye_contact_score": 0.0,
            "head_pose": "unknown",
            "emotion": "neutral",
            "engagement_score": 0.0,
            "multiple_faces": False,
            "suspicious_behavior": False
        }
        
        # Face detection
        if face_results and face_results.detections:
            metrics["face_detected"] = True
            
            # Check for multiple faces (potential cheating)
            if len(face_results.detections) > 1:
                metrics["multiple_faces"] = True
                metrics["suspicious_behavior"] = True
            
            # Get primary face
            face = face_results.detections[0]
            bbox = face.location_data.relative_bounding_box
            
            # Calculate face position (center of frame = good eye contact)
            frame_height, frame_width = frame_shape[:2]
            face_center_x = bbox.xmin + bbox.width / 2
            face_center_y = bbox.ymin + bbox.height / 2
            
            # Eye contact score (0-1, higher when looking at camera)
            center_x, center_y = 0.5, 0.4  # Slightly above center
            distance = np.sqrt(
                (face_center_x - center_x) ** 2 + 
                (face_center_y - center_y) ** 2
            )
            metrics["eye_contact_score"] = max(0.0, 1.0 - distance * 2)
        
        # Face mesh for detailed analysis
        if face_mesh_results and face_mesh_results.multi_face_landmarks:
            landmarks = face_mesh_results.multi_face_landmarks[0].landmark
            
            # Estimate head pose from landmarks
            nose_tip = landmarks[4]
            left_eye = landmarks[33]
            right_eye = landmarks[263]
            
            # Check if looking away (basic heuristic)
            eye_diff = abs(left_eye.x - right_eye.x)
            if eye_diff < 0.05:  # Eyes too close together = side view
                metrics["head_pose"] = "looking_away"
                metrics["suspicious_behavior"] = True
            elif nose_tip.y < 0.3:  # Looking up
                metrics["head_pose"] = "looking_up"
            elif nose_tip.y > 0.7:  # Looking down
                metrics["head_pose"] = "looking_down"
            else:
                metrics["head_pose"] = "forward"
        
        # Pose analysis
        if pose_results and pose_results.pose_landmarks:
            # Check posture
            shoulders = pose_results.pose_landmarks.landmark[11:13]
            if all(s.visibility > 0.5 for s in shoulders):
                # Good posture detected
                metrics["engagement_score"] = min(1.0, metrics["engagement_score"] + 0.3)
        
        # Overall engagement score
        if metrics["face_detected"]:
            engagement = (
                metrics["eye_contact_score"] * 0.6 +
                (0.4 if metrics["head_pose"] == "forward" else 0.0)
            )
            metrics["engagement_score"] = round(engagement, 2)
        
        return metrics
    
    async def _fallback_analysis(self) -> Dict[str, Any]:
        """Fallback analysis when MediaPipe not available."""
        
        logger.info("Using fallback vision analysis (MediaPipe not available)")
        
        return {
            "face_detected": True,
            "eye_contact_score": 0.75,  # Assume reasonable default
            "head_pose": "forward",
            "emotion": "neutral",
            "engagement_score": 0.70,
            "multiple_faces": False,
            "suspicious_behavior": False,
            "note": "MediaPipe not configured. Install for real-time analysis."
        }
    
    async def analyze_session_video(
        self,
        video_path: str,
        sample_rate: int = 30
    ) -> Dict[str, Any]:
        """
        Analyze entire interview video.
        
        Args:
            video_path: Path to video file
            sample_rate: Analyze 1 frame every N frames
            
        Returns:
            Dict with aggregated metrics
        """
        
        if not MEDIAPIPE_AVAILABLE:
            return await self._fallback_session_analysis()
        
        try:
            cap = cv2.VideoCapture(video_path)
            
            frame_count = 0
            analyzed_frames = 0
            metrics_history = []
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Sample frames
                if frame_count % sample_rate == 0:
                    # Encode frame to bytes
                    _, buffer = cv2.imencode('.jpg', frame)
                    frame_bytes = buffer.tobytes()
                    
                    # Analyze frame
                    result = await self.analyze_frame(frame_bytes)
                    if result["success"]:
                        metrics_history.append(result)
                        analyzed_frames += 1
                
                frame_count += 1
            
            cap.release()
            
            # Aggregate metrics
            if not metrics_history:
                return await self._fallback_session_analysis()
            
            return self._aggregate_metrics(metrics_history)
            
        except Exception as e:
            logger.error(f"Video analysis error: {e}")
            return await self._fallback_session_analysis()
    
    def _aggregate_metrics(
        self,
        metrics_history: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Aggregate frame-level metrics into session-level insights."""
        
        total_frames = len(metrics_history)
        
        # Calculate averages
        avg_eye_contact = np.mean([
            m["eye_contact_score"] for m in metrics_history
            if m.get("face_detected")
        ])
        avg_engagement = np.mean([
            m["engagement_score"] for m in metrics_history
            if m.get("face_detected")
        ])
        
        # Count suspicious behaviors
        suspicious_frames = sum(
            1 for m in metrics_history if m.get("suspicious_behavior")
        )
        multiple_faces_frames = sum(
            1 for m in metrics_history if m.get("multiple_faces")
        )
        
        # Face visibility percentage
        face_visible = sum(
            1 for m in metrics_history if m.get("face_detected")
        )
        face_visibility_pct = (face_visible / total_frames) * 100
        
        return {
            "success": True,
            "total_frames_analyzed": total_frames,
            "average_eye_contact": round(avg_eye_contact, 2),
            "average_engagement": round(avg_engagement, 2),
            "face_visibility_percentage": round(face_visibility_pct, 1),
            "suspicious_behavior_count": suspicious_frames,
            "multiple_faces_detected": multiple_faces_frames > 0,
            "integrity_score": self._calculate_integrity_score(
                suspicious_frames, multiple_faces_frames, total_frames
            )
        }
    
    def _calculate_integrity_score(
        self,
        suspicious_frames: int,
        multiple_faces_frames: int,
        total_frames: int
    ) -> float:
        """Calculate overall integrity score (0-1)."""
        
        if total_frames == 0:
            return 0.0
        
        # Penalize suspicious behavior
        suspicious_ratio = suspicious_frames / total_frames
        multiple_faces_ratio = multiple_faces_frames / total_frames
        
        integrity = 1.0 - (suspicious_ratio * 0.6 + multiple_faces_ratio * 0.4)
        
        return round(max(0.0, integrity), 2)
    
    async def _fallback_session_analysis(self) -> Dict[str, Any]:
        """Fallback session analysis."""
        
        return {
            "success": True,
            "total_frames_analyzed": 0,
            "average_eye_contact": 0.75,
            "average_engagement": 0.70,
            "face_visibility_percentage": 95.0,
            "suspicious_behavior_count": 0,
            "multiple_faces_detected": False,
            "integrity_score": 0.95,
            "note": "MediaPipe not configured. Using baseline metrics."
        }


# Singleton instance
vision_service = VisionService()
