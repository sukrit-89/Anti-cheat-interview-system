"""
Speech Agent - Analyzes communication and speech patterns.
"""
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.base import BaseAgent, AgentInput, AgentOutput
from app.models.models import SpeechSegment
from app.core.database import AsyncSessionLocal
from app.core.logging import logger

class SpeechAgent(BaseAgent):
    """
    Analyzes speech segments to assess:
    - Communication clarity
    - Technical vocabulary
    - Explanation quality
    - Confidence level
    """
    
    def get_name(self) -> str:
        return "speech"
    
    async def process(self, input_data: AgentInput) -> AgentOutput:
        """Process speech segments for a session."""
        session_id = input_data.session_id
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(SpeechSegment)
                .where(SpeechSegment.session_id == session_id)
                .order_by(SpeechSegment.start_time)
            )
            segments = result.scalars().all()
        
        if not segments:
            return AgentOutput(
                agent_type=self.agent_type,
                session_id=session_id,
                score=0.0,
                insights="No speech detected"
            )
        
        metrics = self._analyze_segments(segments)
        
        weights = {
            "clarity": 0.3,
            "technical_depth": 0.3,
            "fluency": 0.2,
            "confidence": 0.2
        }
        score = self.calculate_score(metrics, weights)
        
        flags = self._extract_flags(segments, metrics)
        
        insights = self._generate_insights(metrics, flags)
        
        return AgentOutput(
            agent_type=self.agent_type,
            session_id=session_id,
            score=score,
            findings=metrics,
            flags=flags,
            insights=insights
        )
    
    def _analyze_segments(self, segments: list[SpeechSegment]) -> dict[str, float]:
        """Analyze speech segments and extract metrics."""
        total_segments = len(segments)
        total_duration = sum(s.duration for s in segments)
        
        full_transcript = " ".join(s.transcript for s in segments)
        word_count = len(full_transcript.split())
        
        avg_confidence = (
            sum(s.confidence for s in segments if s.confidence) / total_segments
            if total_segments > 0 else 0
        ) * 100
        
        wpm = (word_count / total_duration * 60) if total_duration > 0 else 0
        
        clarity = min(100.0, avg_confidence)
        fluency = min(100.0, max(0.0, (wpm / 150) * 100))

        tech_keywords = {
            "algorithm", "function", "variable", "loop", "recursion", "array",
            "object", "class", "method", "complexity", "runtime", "memory",
            "stack", "queue", "tree", "graph", "hash", "sort", "search",
            "database", "api", "server", "client", "cache", "index",
            "optimize", "refactor", "debug", "test", "deploy", "interface",
            "abstract", "inherit", "polymorphism", "encapsulation", "async",
            "callback", "promise", "thread", "process", "mutex", "semaphore",
        }
        words_lower = full_transcript.lower().split()
        tech_count = sum(1 for w in words_lower if w.strip(".,;:!?()") in tech_keywords)
        tech_ratio = tech_count / max(len(words_lower), 1)
        technical_depth = min(100.0, 40.0 + tech_ratio * 600)

        confidence = 50.0
        if total_duration > 120:
            confidence += 10
        if wpm >= 100:
            confidence += 10
        if word_count > 200:
            confidence += 10
        if total_segments > 5:
            confidence += 10
        if avg_confidence > 70:
            confidence += 10
        confidence = min(100.0, max(0.0, confidence))
        
        return {
            "total_segments": total_segments,
            "total_duration": total_duration,
            "word_count": word_count,
            "words_per_minute": wpm,
            "avg_confidence": avg_confidence,
            "clarity": clarity,
            "technical_depth": technical_depth,
            "fluency": fluency,
            "confidence": confidence
        }
    
    def _extract_flags(
        self,
        segments: list[SpeechSegment],
        metrics: dict[str, float]
    ) -> list[dict[str, Any]]:
        """Extract concerning patterns."""
        flags = []
        
        if metrics["total_duration"] < 60:
            flags.append({
                "type": "minimal_speech",
                "severity": "high",
                "message": "Very little verbal communication detected"
            })
        
        if metrics["avg_confidence"] < 50:
            flags.append({
                "type": "low_transcription_confidence",
                "severity": "medium",
                "message": "Low transcription confidence - audio quality issues?"
            })
        
        if metrics["words_per_minute"] < 80:
            flags.append({
                "type": "slow_speech",
                "severity": "low",
                "message": "Speaking pace is slower than average"
            })
        elif metrics["words_per_minute"] > 200:
            flags.append({
                "type": "fast_speech",
                "severity": "low",
                "message": "Speaking pace is faster than average"
            })
        
        return flags
    
    def _generate_insights(
        self,
        metrics: dict[str, float],
        flags: list[dict[str, Any]]
    ) -> str:
        """Generate natural language insights."""
        insights = []
        
        if metrics["clarity"] > 80:
            insights.append("Clear and articulate communication.")
        elif metrics["clarity"] > 60:
            insights.append("Generally clear communication with some unclear moments.")
        else:
            insights.append("Communication clarity could be improved.")
        
        wpm = metrics["words_per_minute"]
        if 120 <= wpm <= 180:
            insights.append("Good speaking pace.")
        
        return " ".join(insights)
