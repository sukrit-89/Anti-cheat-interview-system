"""
Coding Agent - Analyzes coding behavior and problem-solving skills.
Uses: AI Service (OpenAI/Ollama) or rule-based fallback.
"""
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.base import BaseAgent, AgentInput, AgentOutput
from app.models.models import CodingEvent
from app.core.database import AsyncSessionLocal
from app.core.logging import logger
from app.services.ai_service import ai_service


class CodingAgent(BaseAgent):
    """
    Analyzes coding events to assess:
    - Problem-solving approach
    - Code quality
    - Execution patterns
    - Time management
    """
    
    def get_name(self) -> str:
        return "coding"
    
    async def process(self, input_data: AgentInput) -> AgentOutput:
        """Process coding events for a session."""
        session_id = input_data.session_id
        
        async with AsyncSessionLocal() as db:
            # Fetch all coding events
            result = await db.execute(
                select(CodingEvent)
                .where(CodingEvent.session_id == session_id)
                .order_by(CodingEvent.timestamp)
            )
            events = result.scalars().all()
        
        if not events:
            return AgentOutput(
                agent_type=self.agent_type,
                session_id=session_id,
                score=0.0,
                insights="No coding activity detected"
            )
        
        # Analyze coding patterns
        metrics = self._analyze_events(events)
        
        # Calculate score
        weights = {
            "execution_success_rate": 0.3,
            "code_quality": 0.3,
            "problem_solving": 0.2,
            "efficiency": 0.2
        }
        score = self.calculate_score(metrics, weights)
        
        # Extract flags
        flags = self._extract_flags(events, metrics)
        
        # Generate insights
        insights = self._generate_insights(metrics, flags)
        
        return AgentOutput(
            agent_type=self.agent_type,
            session_id=session_id,
            score=score,
            findings=metrics,
            flags=flags,
            insights=insights
        )
    
    def _analyze_events(self, events: list[CodingEvent]) -> dict[str, float]:
        """Analyze coding events and extract metrics."""
        total_events = len(events)
        execution_events = [e for e in events if e.event_type == "execute"]
        
        # Execution success rate
        successful_executions = sum(
            1 for e in execution_events if e.execution_error is None
        )
        execution_success_rate = (
            (successful_executions / len(execution_events) * 100)
            if execution_events else 0
        )
        
        # Code changes frequency
        keystroke_events = [e for e in events if e.event_type == "keystroke"]
        
        # Placeholder metrics (in production, use real analysis)
        code_quality = 75.0  # Would analyze code complexity, style, etc.
        problem_solving = 70.0  # Would analyze solution approach
        efficiency = 65.0  # Would analyze time to solution
        
        return {
            "total_events": total_events,
            "execution_count": len(execution_events),
            "execution_success_rate": execution_success_rate,
            "code_quality": code_quality,
            "problem_solving": problem_solving,
            "efficiency": efficiency
        }
    
    def _extract_flags(
        self,
        events: list[CodingEvent],
        metrics: dict[str, float]
    ) -> list[dict[str, Any]]:
        """Extract concerning patterns."""
        flags = []
        
        if metrics["execution_success_rate"] < 30:
            flags.append({
                "type": "low_execution_success",
                "severity": "high",
                "message": "Very low code execution success rate"
            })
        
        if metrics["total_events"] < 10:
            flags.append({
                "type": "minimal_activity",
                "severity": "medium",
                "message": "Minimal coding activity detected"
            })
        
        return flags
    
    def _generate_insights(
        self,
        metrics: dict[str, float],
        flags: list[dict[str, Any]]
    ) -> str:
        """Generate natural language insights using AI or rule-based fallback."""
        # Build analysis prompt
        prompt = f"""
Analyze this candidate's coding performance:

Metrics:
- Total coding events: {metrics['total_events']}
- Code executions: {metrics['execution_count']}
- Execution success rate: {metrics['execution_success_rate']:.1f}%
- Code quality score: {metrics['code_quality']:.1f}/100
- Problem-solving score: {metrics['problem_solving']:.1f}/100
- Efficiency score: {metrics['efficiency']:.1f}/100

Flags: {len(flags)} issues detected
{chr(10).join(f"- {flag['message']}" for flag in flags) if flags else "- None"}

Provide a 2-3 sentence assessment of their coding skills.
"""
        
        system_prompt = "You are an expert technical interviewer evaluating a candidate's coding ability."
        
        try:
            # Use AI service (OpenAI, Ollama, or rule-based)
            import asyncio
            insights = asyncio.run(ai_service.generate_completion(
                prompt=prompt,
                system_prompt=system_prompt,
                temperature=0.3,
                max_tokens=200
            ))
            return insights.strip()
        except Exception as e:
            logger.warning(f"AI insights generation failed, using rule-based: {e}")
            return self._fallback_insights(metrics, flags)
    
    def _fallback_insights(
        self,
        metrics: dict[str, float],
        flags: list[dict[str, Any]]
    ) -> str:
        """Rule-based insights fallback."""
        insights = []
        
        if metrics["execution_success_rate"] > 80:
            insights.append("Strong code execution success rate.")
        elif metrics["execution_success_rate"] > 50:
            insights.append("Moderate code execution success rate.")
        else:
            insights.append("Low code execution success - may need more practice.")
        
        if metrics["code_quality"] > 80:
            insights.append("High code quality observed.")
        
        return " ".join(insights)
