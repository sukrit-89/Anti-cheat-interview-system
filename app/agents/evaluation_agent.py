"""
Evaluation Agent - Combines all agent outputs into final recommendation.
"""
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.base import BaseAgent, AgentInput, AgentOutput
from app.models.models import AgentOutput as AgentOutputModel, AgentType
from app.core.database import AsyncSessionLocal
from app.core.logging import logger
from app.services.ai_service import ai_service

class EvaluationAgent(BaseAgent):
    """
    Final evaluation agent that:
    - Aggregates all agent outputs
    - Produces overall hiring recommendation
    - Generates structured report
    """
    
    def get_name(self) -> str:
        return "evaluation"
    
    async def process(self, input_data: AgentInput) -> AgentOutput:
        """Generate final evaluation from all agent outputs."""
        session_id = input_data.session_id
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(AgentOutputModel)
                .where(
                    AgentOutputModel.session_id == session_id,
                    AgentOutputModel.status == "completed"
                )
            )
            agent_outputs = result.scalars().all()
        
        if not agent_outputs:
            return AgentOutput(
                agent_type=self.agent_type,
                session_id=session_id,
                score=0.0,
                insights="No agent data available for evaluation"
            )
        
        evaluation = self._aggregate_outputs(agent_outputs)
        
        recommendation = self._generate_recommendation(evaluation)
        
        findings = self._extract_key_findings(agent_outputs, evaluation)
        
        insights = await self._generate_comprehensive_insights(evaluation, recommendation, agent_outputs)
        
        return AgentOutput(
            agent_type=self.agent_type,
            session_id=session_id,
            score=evaluation["overall_score"],
            findings=evaluation,
            flags=findings["flags"],
            insights=insights
        )
    
    def _aggregate_outputs(
        self,
        agent_outputs: list[AgentOutputModel]
    ) -> dict[str, Any]:
        """Aggregate scores from all agents."""
        
        scores = {}
        for output in agent_outputs:
            if output.score is not None:
                scores[output.agent_type.value] = output.score
        
        weights = {
            AgentType.CODING.value: 0.35,
            AgentType.SPEECH.value: 0.20,
            AgentType.VISION.value: 0.15,
            AgentType.REASONING.value: 0.30
        }
        
        overall_score = 0.0
        total_weight = 0.0
        
        for agent_type, score in scores.items():
            weight = weights.get(agent_type, 0.0)
            overall_score += score * weight
            total_weight += weight
        
        if total_weight > 0:
            overall_score /= total_weight
        
        return {
            "overall_score": round(overall_score, 2),
            "coding_score": scores.get(AgentType.CODING.value),
            "communication_score": scores.get(AgentType.SPEECH.value),
            "engagement_score": scores.get(AgentType.VISION.value),
            "reasoning_score": scores.get(AgentType.REASONING.value),
            "agent_count": len(agent_outputs)
        }
    
    def _generate_recommendation(self, evaluation: dict[str, Any]) -> dict[str, Any]:
        """Generate hiring recommendation based on overall score."""
        score = evaluation["overall_score"]
        
        if score >= 75:
            recommendation = "hire"
            confidence = 0.9
            reasoning = "Candidate demonstrates strong technical and communication skills."
        elif score >= 60:
            recommendation = "maybe"
            confidence = 0.7
            reasoning = "Candidate shows potential but has areas for improvement."
        else:
            recommendation = "no_hire"
            confidence = 0.85
            reasoning = "Candidate does not meet minimum requirements at this time."
        
        return {
            "recommendation": recommendation,
            "confidence": confidence,
            "reasoning": reasoning
        }
    
    def _extract_key_findings(
        self,
        agent_outputs: list[AgentOutputModel],
        evaluation: dict[str, Any]
    ) -> dict[str, Any]:
        """Extract key findings and flags across all agents."""
        
        all_flags = []
        strengths = []
        weaknesses = []
        
        for output in agent_outputs:
            if output.flags:
                for flag in output.flags:
                    flag_copy = dict(flag)
                    flag_copy["agent"] = output.agent_type.value
                    all_flags.append(flag_copy)
            
            if output.score is not None:
                if output.score >= 80:
                    strengths.append(f"Strong {output.agent_type.value} performance")
                elif output.score < 50:
                    weaknesses.append(f"Weak {output.agent_type.value} performance")
        
        severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        all_flags.sort(key=lambda f: severity_order.get(f.get("severity", "low"), 3))
        
        return {
            "flags": all_flags,
            "strengths": strengths,
            "weaknesses": weaknesses
        }
    
    async def _generate_comprehensive_insights(
        self,
        evaluation: dict[str, Any],
        recommendation: dict[str, Any],
        agent_outputs: list[AgentOutputModel],
    ) -> str:
        """Generate comprehensive natural language insights using AI."""
        
        agent_summaries = []
        for output in agent_outputs:
            agent_summaries.append(
                f"- {output.agent_type.value}: score={output.score}, insights={output.insights}"
            )
        
        prompt = f"""Generate a comprehensive interview evaluation report.

Overall Score: {evaluation['overall_score']:.1f}/100
Recommendation: {recommendation['recommendation'].upper()}
Confidence: {recommendation['confidence']:.0%}

Scores:
- Coding: {evaluation.get('coding_score', 'N/A')}
- Communication: {evaluation.get('communication_score', 'N/A')}
- Reasoning: {evaluation.get('reasoning_score', 'N/A')}
- Engagement: {evaluation.get('engagement_score', 'N/A')}

Agent Analyses:
{chr(10).join(agent_summaries)}

Write a 4-6 sentence professional evaluation summary covering strengths, weaknesses, and the hiring recommendation with reasoning."""
        
        system_prompt = (
            "You are a senior technical hiring manager writing a final evaluation report. "
            "Be professional, balanced, and data-driven."
        )
        
        try:
            return (await ai_service.generate_completion(
                prompt=prompt,
                system_prompt=system_prompt,
                temperature=0.3,
                max_tokens=400,
            )).strip()
        except Exception as e:
            logger.warning(f"AI insights failed for evaluation agent: {e}")
            parts = [
                f"Overall performance score: {evaluation['overall_score']:.1f}/100.",
                f"Recommendation: {recommendation['recommendation'].upper()}.",
                recommendation["reasoning"],
            ]
            return " ".join(parts)
