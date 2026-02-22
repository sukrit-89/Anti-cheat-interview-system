"""
Reasoning Agent - Evaluates problem-solving reasoning and approach.
"""
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.base import BaseAgent, AgentInput, AgentOutput
from app.models.models import CodingEvent, SpeechSegment
from app.core.database import AsyncSessionLocal
from app.core.logging import logger
from app.services.ai_service import ai_service

class ReasoningAgent(BaseAgent):
    """
    Analyzes reasoning patterns by combining:
    - Coding approach and logic
    - Verbal explanations
    - Problem decomposition
    - Solution strategy
    """
    
    def get_name(self) -> str:
        return "reasoning"
    
    async def process(self, input_data: AgentInput) -> AgentOutput:
        """Process combined data for reasoning analysis."""
        session_id = input_data.session_id
        
        async with AsyncSessionLocal() as db:
            coding_result = await db.execute(
                select(CodingEvent)
                .where(CodingEvent.session_id == session_id)
                .order_by(CodingEvent.timestamp)
            )
            coding_events = coding_result.scalars().all()
            
            speech_result = await db.execute(
                select(SpeechSegment)
                .where(SpeechSegment.session_id == session_id)
                .order_by(SpeechSegment.start_time)
            )
            speech_segments = speech_result.scalars().all()
        
        metrics = self._analyze_reasoning(coding_events, speech_segments)
        
        weights = {
            "logical_approach": 0.3,
            "problem_decomposition": 0.3,
            "explanation_quality": 0.2,
            "adaptability": 0.2
        }
        score = self.calculate_score(metrics, weights)
        
        flags = self._extract_flags(metrics)
        
        insights = await self._generate_insights(metrics, flags)
        
        return AgentOutput(
            agent_type=self.agent_type,
            session_id=session_id,
            score=score,
            findings=metrics,
            flags=flags,
            insights=insights
        )
    
    def _analyze_reasoning(
        self,
        coding_events: list[CodingEvent],
        speech_segments: list[SpeechSegment]
    ) -> dict[str, float]:
        """Analyze reasoning from coding and speech data."""
        
        code_iterations = len([e for e in coding_events if e.code_snapshot])
        execution_attempts = len([e for e in coding_events if e.event_type == "execute"])
        
        total_words = sum(
            len(s.transcript.split())
            for s in speech_segments
        )

        successful_execs = sum(
            1 for e in coding_events
            if e.event_type == "execute" and e.execution_error is None
        )

        logical_approach = 50.0
        if code_iterations > 0:
            logical_approach += 10
        if code_iterations >= 3:
            logical_approach += 10
        if execution_attempts > 0 and successful_execs / execution_attempts >= 0.5:
            logical_approach += 15
        if execution_attempts > 15:
            logical_approach -= 15

        problem_decomposition = 50.0
        if code_iterations >= 2:
            problem_decomposition += 15
        if code_iterations >= 5:
            problem_decomposition += 10
        if execution_attempts > 0 and execution_attempts <= 10:
            problem_decomposition += 10

        explanation_quality = 50.0
        if total_words > 100:
            explanation_quality += 10
        if total_words > 300:
            explanation_quality += 10
        if total_words > 500:
            explanation_quality += 15
        if speech_segments:
            avg_len = total_words / len(speech_segments)
            if avg_len > 20:
                explanation_quality += 10

        adaptability = 50.0
        if execution_attempts >= 2 and successful_execs > 0:
            adaptability += 15
        if code_iterations >= 3:
            adaptability += 10
        if total_words > 200:
            adaptability += 10

        logical_approach = min(100.0, max(0.0, logical_approach))
        problem_decomposition = min(100.0, max(0.0, problem_decomposition))
        explanation_quality = min(100.0, max(0.0, explanation_quality))
        adaptability = min(100.0, max(0.0, adaptability))
        
        return {
            "code_iterations": code_iterations,
            "execution_attempts": execution_attempts,
            "total_words": total_words,
            "logical_approach": logical_approach,
            "problem_decomposition": problem_decomposition,
            "explanation_quality": explanation_quality,
            "adaptability": adaptability
        }
    
    def _extract_flags(self, metrics: dict[str, float]) -> list[dict[str, Any]]:
        """Extract concerning patterns."""
        flags = []
        
        if metrics["execution_attempts"] > 15:
            flags.append({
                "type": "excessive_trial_and_error",
                "severity": "medium",
                "message": "High number of execution attempts - may indicate trial-and-error approach"
            })
        
        if metrics["total_words"] < 200:
            flags.append({
                "type": "limited_explanation",
                "severity": "medium",
                "message": "Limited verbal explanation of approach"
            })
        
        if metrics["logical_approach"] < 50:
            flags.append({
                "type": "weak_logical_approach",
                "severity": "high",
                "message": "Weak logical problem-solving approach detected"
            })
        
        return flags
    
    async def _generate_insights(
        self,
        metrics: dict[str, float],
        flags: list[dict[str, Any]]
    ) -> str:
        """Generate natural language insights using AI."""
        prompt = f"""Analyze this candidate's problem-solving and reasoning during a technical interview:

Metrics:
- Code iterations: {metrics['code_iterations']}
- Execution attempts: {metrics['execution_attempts']}
- Total words spoken: {metrics['total_words']}
- Logical approach score: {metrics['logical_approach']:.1f}/100
- Problem decomposition score: {metrics['problem_decomposition']:.1f}/100
- Explanation quality score: {metrics['explanation_quality']:.1f}/100
- Adaptability score: {metrics['adaptability']:.1f}/100

Flags: {len(flags)} issues detected
{chr(10).join(f"- {flag['message']}" for flag in flags) if flags else "- None"}

Provide a 2-3 sentence assessment of their reasoning and problem-solving ability."""
        
        system_prompt = "You are an expert technical interviewer evaluating a candidate's reasoning ability. Be concise and specific."
        
        try:
            return (await ai_service.generate_completion(
                prompt=prompt,
                system_prompt=system_prompt,
                temperature=0.3,
                max_tokens=250,
            )).strip()
        except Exception as e:
            logger.warning(f"AI insights failed for reasoning agent: {e}")
            if metrics["logical_approach"] > 80:
                return "Strong systematic problem-solving approach."
            elif metrics["logical_approach"] > 60:
                return "Reasonable problem-solving approach with room for improvement."
            return "Problem-solving approach needs improvement."
