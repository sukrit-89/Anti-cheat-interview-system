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
        
        metrics = self._analyze_events(events)
        
        weights = {
            "execution_success_rate": 0.3,
            "code_quality": 0.3,
            "problem_solving": 0.2,
            "efficiency": 0.2
        }
        score = self.calculate_score(metrics, weights)
        
        flags = self._extract_flags(events, metrics)
        
        insights = await self._generate_insights(metrics, flags)
        
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
        
        successful_executions = sum(
            1 for e in execution_events if e.execution_error is None
        )
        execution_success_rate = (
            (successful_executions / len(execution_events) * 100)
            if execution_events else 0
        )
        
        keystroke_events = [e for e in events if e.event_type == "keystroke"]

        code_quality = self._compute_code_quality(events, execution_events)
        problem_solving = self._compute_problem_solving(events, execution_events, successful_executions)
        efficiency = self._compute_efficiency(events, execution_events, keystroke_events)
        
        return {
            "total_events": total_events,
            "execution_count": len(execution_events),
            "execution_success_rate": execution_success_rate,
            "code_quality": code_quality,
            "problem_solving": problem_solving,
            "efficiency": efficiency
        }

    def _compute_code_quality(self, events, execution_events) -> float:
        """Compute code quality from snapshots and execution results."""
        score = 50.0
        snapshots = [e for e in events if e.code_snapshot]
        if not snapshots:
            return score
        latest = snapshots[-1].code_snapshot or ""
        lines = [l for l in latest.split("\n") if l.strip()]
        if len(lines) > 3:
            score += 10
        has_functions = any("def " in l or "function " in l for l in lines)
        if has_functions:
            score += 15
        blank_ratio = sum(1 for l in latest.split("\n") if not l.strip()) / max(len(latest.split("\n")), 1)
        if 0.1 <= blank_ratio <= 0.4:
            score += 5
        if execution_events:
            success_rate = sum(1 for e in execution_events if e.execution_error is None) / len(execution_events)
            score += success_rate * 20
        return min(100.0, max(0.0, score))

    def _compute_problem_solving(self, events, execution_events, successful) -> float:
        """Compute problem-solving score from iteration patterns."""
        score = 50.0
        snapshots = [e for e in events if e.code_snapshot]
        if len(snapshots) >= 2:
            score += 10
        if len(snapshots) >= 5:
            score += 5
        if execution_events:
            if len(execution_events) <= 10:
                score += 10
            if successful > 0:
                score += 15
            if successful >= 3:
                score += 10
        return min(100.0, max(0.0, score))

    def _compute_efficiency(self, events, execution_events, keystroke_events) -> float:
        """Compute efficiency score from execution-to-total-event ratio."""
        score = 50.0
        if not events:
            return score
        if execution_events:
            ratio = len(execution_events) / len(events)
            if 0.1 <= ratio <= 0.4:
                score += 20
            elif ratio < 0.1:
                score += 5
        if keystroke_events and len(keystroke_events) > 20:
            score += 10
        if len(events) > 30:
            score += 10
        return min(100.0, max(0.0, score))
    
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
    
    async def _generate_insights(
        self,
        metrics: dict[str, float],
        flags: list[dict[str, Any]]
    ) -> str:
        """Generate natural language insights using AI or rule-based fallback."""
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
            insights = await ai_service.generate_completion(
                prompt=prompt,
                system_prompt=system_prompt,
                temperature=0.3,
                max_tokens=200
            )
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
