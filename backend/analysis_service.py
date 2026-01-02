# backend/analysis_service.py
"""Background video analysis service using existing detectors"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from video.face_detector import FaceDetector
from video.blink_detector import BlinkDetector
from video.gaze_detector import GazeDetector
from reporting.scoring_engine import ScoringEngine
from reporting.report_generator import ReportGenerator
import cv2


class AnalysisService:
    """Service for analyzing videos and generating reports"""
    
    def __init__(self):
        self.scoring_engine = ScoringEngine()
        self.report_generator = ReportGenerator()
    
    def analyze_video(self, video_path: str, session_id: int, candidate_id: str = None):
        """
        Analyze video file and return flags, metadata, and report data.
        
        Returns:
            dict with 'flags', 'metadata', 'risk_data'
        """
        # Initialize detectors
        face_detector = FaceDetector()
        blink_detector = BlinkDetector()
        gaze_detector = GazeDetector()
        
        # Collect metadata
        metadata = self._collect_metadata(video_path)
        metadata['session_id'] = session_id
        metadata['candidate_id'] = candidate_id or f"SESSION_{session_id}"
        
        # Run detection
        print(f"[AnalysisService] Analyzing faces...")
        face_flags = face_detector.analyze_video(video_path)
        
        print(f"[AnalysisService] Analyzing blinks...")
        blink_flags = blink_detector.analyze_video(video_path)
        
        print(f"[AnalysisService] Analyzing gaze...")
        gaze_flags = gaze_detector.analyze_video(video_path)
        
        # Combine flags
        all_flags = face_flags + blink_flags + gaze_flags
        
        # Calculate risk
        risk_data = self.scoring_engine.calculate_risk_score(
            all_flags,
            metadata['duration_seconds'],
            metadata['total_frames'],
            metadata['fps']
        )
        
        print(f"[AnalysisService] Analysis complete: {len(all_flags)} flags, score={risk_data['overall_score']}")
        
        return {
            'flags': all_flags,
            'metadata': metadata,
            'risk_data': risk_data
        }
    
    def _collect_metadata(self, video_path: str):
        """Extract metadata from video file"""
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            return {
                'video_path': video_path,
                'duration_seconds': 0,
                'total_frames': 0,
                'fps': 30.0,
            }
        
        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps if fps > 0 else 0
        
        cap.release()
        
        return {
            'video_path': video_path,
            'duration_seconds': duration,
            'total_frames': total_frames,
            'fps': fps,
        }
    
    def generate_reports(self, flags, metadata, risk_data, output_dir="reports/api"):
        """Generate JSON and PDF reports"""
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(os.path.join(output_dir, "charts"), exist_ok=True)  # Ensure charts dir exists
        
        session_id = metadata.get('session_id', 'unknown')
        json_path = os.path.join(output_dir, f"session_{session_id}.json")
        pdf_path = os.path.join(output_dir, f"session_{session_id}.pdf")
        
        # Generate JSON
        self.report_generator.generate_report(
            flags=flags,
            metadata=metadata,
            output_path=json_path,
            format='json',
            candidate_id=metadata.get('candidate_id')
        )
        
        # Generate PDF
        try:
            self.report_generator.generate_report(
                flags=flags,
                metadata=metadata,
                output_path=pdf_path,
                format='pdf',
                candidate_id=metadata.get('candidate_id')
            )
        except Exception as e:
            print(f"[AnalysisService] PDF generation failed: {e}")
            pdf_path = None
        
        return {
            'json_path': json_path,
            'pdf_path': pdf_path
        }
