"""
Vision Agent - Analyzes visual engagement and attention.
"""
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.base import BaseAgent, AgentInput, AgentOutput
from app.models.models import VisionMetric
from app.core.database import AsyncSessionLocal
from app.core.logging import logger

class VisionAgent(BaseAgent):
    """
    Analyzes vision metrics to assess:
    - Engagement level
    - Attention focus
    - Emotional state
    - Presence/absence detection
    """
    
    def get_name(self) -> str:
        return "vision"
    
    async def process(self, input_data: AgentInput) -> AgentOutput:
        """Process vision metrics for a session."""
        session_id = input_data.session_id
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(VisionMetric)
                .where(VisionMetric.session_id == session_id)
                .order_by(VisionMetric.timestamp)
            )
            metrics_list = result.scalars().all()
        
        if not metrics_list:
            return AgentOutput(
                agent_type=self.agent_type,
                session_id=session_id,
                score=0.0,
                insights="No vision data available"
            )
        
        metrics = self._analyze_metrics(metrics_list)
        
        weights = {
            "engagement": 0.4,
            "attention": 0.3,
            "presence": 0.3
        }
        score = self.calculate_score(metrics, weights)
        
        flags = self._extract_flags(metrics_list, metrics)
        
        insights = self._generate_insights(metrics, flags)
        
        return AgentOutput(
            agent_type=self.agent_type,
            session_id=session_id,
            score=score,
            findings=metrics,
            flags=flags,
            insights=insights
        )
    
    def _analyze_metrics(self, metrics_list: list[VisionMetric]) -> dict[str, float]:
        """Analyze vision metrics."""
        total_metrics = len(metrics_list)
        
        gaze_metrics = [m for m in metrics_list if m.metric_type == "gaze"]
        emotion_metrics = [m for m in metrics_list if m.metric_type == "emotion"]
        presence_metrics = [m for m in metrics_list if m.metric_type == "presence"]
        
        if gaze_metrics:
            focused_gaze = sum(
                1 for m in gaze_metrics
                if m.label in ["focused", "looking_at_screen"]
            )
            engagement = (focused_gaze / len(gaze_metrics)) * 100
        else:
            engagement = 0.0
        
        if emotion_metrics:
            positive_emotions = sum(
                1 for m in emotion_metrics
                if m.label in ["focused", "interested", "neutral"]
            )
            attention = (positive_emotions / len(emotion_metrics)) * 100
        else:
            attention = 70.0
        
        if presence_metrics:
            present = sum(1 for m in presence_metrics if m.value == 1.0)
            presence = (present / len(presence_metrics)) * 100
        else:
            presence = 100.0
        
        return {
            "total_metrics": total_metrics,
            "gaze_samples": len(gaze_metrics),
            "emotion_samples": len(emotion_metrics),
            "presence_samples": len(presence_metrics),
            "engagement": engagement,
            "attention": attention,
            "presence": presence
        }
    
    def _extract_flags(
        self,
        metrics_list: list[VisionMetric],
        metrics: dict[str, float]
    ) -> list[dict[str, Any]]:
        """Extract concerning patterns."""
        flags = []
        
        if metrics["engagement"] < 50:
            flags.append({
                "type": "low_engagement",
                "severity": "high",
                "message": "Low visual engagement detected"
            })
        
        if metrics["presence"] < 80:
            flags.append({
                "type": "intermittent_presence",
                "severity": "medium",
                "message": "Candidate frequently absent from camera view"
            })
        
        if metrics["total_metrics"] < 100:
            flags.append({
                "type": "limited_vision_data",
                "severity": "low",
                "message": "Limited vision data collected"
            })
        
        return flags
    
    def _generate_insights(
        self,
        metrics: dict[str, float],
        flags: list[dict[str, Any]]
    ) -> str:
        """Generate natural language insights."""
        insights = []
        
        if metrics["engagement"] > 80:
            insights.append("High visual engagement throughout the session.")
        elif metrics["engagement"] > 60:
            insights.append("Moderate visual engagement.")
        else:
            insights.append("Low visual engagement - candidate may be distracted.")
        
        if metrics["presence"] > 95:
            insights.append("Consistent camera presence.")
        
        return " ".join(insights)
