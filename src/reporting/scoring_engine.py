# src/reporting/scoring_engine.py
import numpy as np
from collections import defaultdict
from typing import List, Dict, Tuple


class ScoringEngine:
    """
    Calculate weighted risk scores from detection flags.
    Supports time-weighted scoring and confidence intervals.
    """
    
    # Severity weights for different flag types
    FLAG_WEIGHTS = {
        'no_face': 0.15,           # High severity - candidate not visible
        'multi_face': 0.20,         # Critical - potential proxy taking test
        'looking_away': 0.10,       # Medium severity - seeking external help
        'no_blink': 0.05,           # Low severity - potential bot/recording
        'no_blink_detected': 0.05,  # Alias for no_blink
        'multi_voice': 0.12,        # High severity - someone else present
        'no_audio': 0.08,           # Medium severity - suspicious silence
        'gaze_violation': 0.10,     # Medium severity - looking away
    }
    
    # Risk level thresholds
    RISK_LEVELS = {
        'LOW': (0.0, 0.25),
        'MEDIUM': (0.25, 0.60),
        'HIGH': (0.60, 1.0),
    }
    
    def __init__(self):
        pass
    
    def calculate_risk_score(
        self, 
        flags: List[Dict], 
        duration_seconds: float, 
        total_frames: int,
        fps: float = 30.0
    ) -> Dict:
        """
        Calculate comprehensive risk assessment from flags.
        
        Args:
            flags: List of detection flags with 'type', 'frame', or 'time' keys
            duration_seconds: Total interview duration
            total_frames: Total frames processed
            fps: Frames per second (for time conversion)
            
        Returns:
            Dictionary containing risk score, confidence, level, and analysis
        """
        if not flags:
            return {
                'overall_score': 0.0,
                'confidence_interval': (0.0, 0.0),
                'risk_level': 'LOW',
                'recommendation': 'No suspicious activity detected - Proceed with confidence',
                'total_flags': 0,
                'weighted_score': 0.0,
                'temporal_score': 0.0,
            }
        
        # Calculate base weighted score
        weighted_score = self._calculate_weighted_score(flags)
        
        # Calculate time-weighted score
        temporal_score = self._calculate_temporal_score(flags, duration_seconds, fps)
        
        # Combine scores (60% weighted, 40% temporal)
        overall_score = (weighted_score * 0.6) + (temporal_score * 0.4)
        overall_score = min(overall_score, 1.0)  # Cap at 1.0
        
        # Calculate confidence interval
        confidence_interval = self._calculate_confidence_interval(
            overall_score, len(flags), total_frames
        )
        
        # Determine risk level and recommendation
        risk_level = self._get_risk_level(overall_score)
        recommendation = self._generate_recommendation(risk_level, len(flags), overall_score)
        
        return {
            'overall_score': round(overall_score, 3),
            'confidence_interval': (round(confidence_interval[0], 3), round(confidence_interval[1], 3)),
            'risk_level': risk_level,
            'recommendation': recommendation,
            'total_flags': len(flags),
            'weighted_score': round(weighted_score, 3),
            'temporal_score': round(temporal_score, 3),
        }
    
    def _calculate_weighted_score(self, flags: List[Dict]) -> float:
        """Calculate score based on flag severity weights."""
        total_weight = 0.0
        
        for flag in flags:
            flag_type = flag.get('type', 'unknown')
            weight = self.FLAG_WEIGHTS.get(flag_type, 0.05)  # Default low weight for unknown
            total_weight += weight
        
        # Normalize by expected max (assume 100 flags would be extremely suspicious)
        normalized_score = min(total_weight / 10.0, 1.0)
        return normalized_score
    
    def _calculate_temporal_score(self, flags: List[Dict], duration: float, fps: float) -> float:
        """
        Calculate time-weighted score.
        Violations later in interview weighted higher (desperation factor).
        """
        if not flags or duration <= 0:
            return 0.0
        
        temporal_weights = []
        
        for flag in flags:
            # Get timestamp (either 'time' field or calculate from 'frame')
            if 'time' in flag:
                timestamp = flag['time']
            elif 'frame' in flag:
                timestamp = flag['frame'] / fps
            else:
                timestamp = duration / 2  # Default to middle if unknown
            
            # Calculate position in interview (0.0 to 1.0)
            position = min(timestamp / duration, 1.0)
            
            # Linear weighting: later violations weighted more heavily
            # Position multiplier ranges from 0.5 (start) to 1.5 (end)
            multiplier = 0.5 + position
            
            flag_type = flag.get('type', 'unknown')
            base_weight = self.FLAG_WEIGHTS.get(flag_type, 0.05)
            temporal_weights.append(base_weight * multiplier)
        
        # Normalize
        total_temporal_weight = sum(temporal_weights)
        normalized_score = min(total_temporal_weight / 15.0, 1.0)  # Adjusted for multiplier
        
        return normalized_score
    
    def _calculate_confidence_interval(
        self, 
        score: float, 
        num_flags: int, 
        total_frames: int
    ) -> Tuple[float, float]:
        """
        Calculate confidence interval around the risk score.
        More data (frames) and fewer flags = narrower interval.
        """
        # Base margin of error decreases with more frames
        base_margin = 0.15 / np.sqrt(max(total_frames / 1000, 1))
        
        # Increase margin if very few flags (less certain)
        if num_flags < 5:
            base_margin *= 1.5
        
        lower = max(0.0, score - base_margin)
        upper = min(1.0, score + base_margin)
        
        return (lower, upper)
    
    def _get_risk_level(self, score: float) -> str:
        """Categorize risk score into LOW/MEDIUM/HIGH."""
        for level, (min_score, max_score) in self.RISK_LEVELS.items():
            if min_score <= score < max_score:
                return level
        return 'HIGH'  # Fallback
    
    def _generate_recommendation(self, risk_level: str, num_flags: int, score: float) -> str:
        """Generate human-readable recommendation based on risk assessment."""
        if risk_level == 'LOW':
            return 'No significant concerns - Proceed with confidence'
        elif risk_level == 'MEDIUM':
            return f'Moderate concern - Manual review recommended ({num_flags} flags detected)'
        else:  # HIGH
            return f'High risk detected - Immediate review required ({num_flags} flags, score: {score:.2f})'
    
    def get_flag_distribution(self, flags: List[Dict]) -> Dict[str, int]:
        """Get count of flags by type."""
        distribution = defaultdict(int)
        
        for flag in flags:
            flag_type = flag.get('type', 'unknown')
            distribution[flag_type] += 1
        
        return dict(distribution)
    
    def get_temporal_distribution(self, flags: List[Dict], duration: float, fps: float = 30.0) -> Dict[str, int]:
        """
        Divide interview into quartiles and count flags in each.
        Returns dict like {'0-25%': 5, '25-50%': 8, ...}
        """
        if not flags or duration <= 0:
            return {'0-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0}
        
        quartiles = {'0-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0}
        
        for flag in flags:
            # Get timestamp
            if 'time' in flag:
                timestamp = flag['time']
            elif 'frame' in flag:
                timestamp = flag['frame'] / fps
            else:
                continue
            
            # Determine quartile
            position = timestamp / duration
            if position < 0.25:
                quartiles['0-25%'] += 1
            elif position < 0.50:
                quartiles['25-50%'] += 1
            elif position < 0.75:
                quartiles['50-75%'] += 1
            else:
                quartiles['75-100%'] += 1
        
        return quartiles
