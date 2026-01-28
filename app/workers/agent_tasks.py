"""
Celery tasks for agent processing.
Background jobs that process session data through AI agents.
"""
from typing import Any

from app.workers.celery_app import celery_app
from app.agents.base import AgentInput
from app.agents.coding_agent import CodingAgent
from app.agents.speech_agent import SpeechAgent
from app.agents.vision_agent import VisionAgent
from app.agents.reasoning_agent import ReasoningAgent
from app.agents.evaluation_agent import EvaluationAgent
from app.models.models import AgentOutput as AgentOutputModel, AgentType
from app.core.database import AsyncSessionLocal
from app.core.events import publish_agent_completed
from app.core.logging import logger


@celery_app.task(name="process_coding_agent", bind=True)
def process_coding_agent(self, session_id: int, data: dict[str, Any]) -> dict:
    """Process session through coding agent."""
    import asyncio
    
    async def _process():
        agent = CodingAgent()
        input_data = AgentInput(session_id=session_id, data=data)
        output = await agent.run(input_data)
        
        # Save to database
        async with AsyncSessionLocal() as db:
            db_output = AgentOutputModel(
                session_id=session_id,
                agent_type=AgentType.CODING,
                status=output.status,
                score=output.score,
                findings=output.findings,
                flags=output.flags,
                insights=output.insights,
                error_message=output.error_message
            )
            db.add(db_output)
            await db.commit()
            await db.refresh(db_output)
            
            # Publish completion event
            await publish_agent_completed(
                session_id=session_id,
                agent_type="coding",
                output_id=db_output.id
            )
            
            return output.model_dump()
    
    return asyncio.run(_process())


@celery_app.task(name="process_speech_agent", bind=True)
def process_speech_agent(self, session_id: int, data: dict[str, Any]) -> dict:
    """Process session through speech agent."""
    import asyncio
    
    async def _process():
        agent = SpeechAgent()
        input_data = AgentInput(session_id=session_id, data=data)
        output = await agent.run(input_data)
        
        async with AsyncSessionLocal() as db:
            db_output = AgentOutputModel(
                session_id=session_id,
                agent_type=AgentType.SPEECH,
                status=output.status,
                score=output.score,
                findings=output.findings,
                flags=output.flags,
                insights=output.insights,
                error_message=output.error_message
            )
            db.add(db_output)
            await db.commit()
            await db.refresh(db_output)
            
            await publish_agent_completed(
                session_id=session_id,
                agent_type="speech",
                output_id=db_output.id
            )
            
            return output.model_dump()
    
    return asyncio.run(_process())


@celery_app.task(name="process_vision_agent", bind=True)
def process_vision_agent(self, session_id: int, data: dict[str, Any]) -> dict:
    """Process session through vision agent."""
    import asyncio
    
    async def _process():
        agent = VisionAgent()
        input_data = AgentInput(session_id=session_id, data=data)
        output = await agent.run(input_data)
        
        async with AsyncSessionLocal() as db:
            db_output = AgentOutputModel(
                session_id=session_id,
                agent_type=AgentType.VISION,
                status=output.status,
                score=output.score,
                findings=output.findings,
                flags=output.flags,
                insights=output.insights,
                error_message=output.error_message
            )
            db.add(db_output)
            await db.commit()
            await db.refresh(db_output)
            
            await publish_agent_completed(
                session_id=session_id,
                agent_type="vision",
                output_id=db_output.id
            )
            
            return output.model_dump()
    
    return asyncio.run(_process())


@celery_app.task(name="process_reasoning_agent", bind=True)
def process_reasoning_agent(self, session_id: int, data: dict[str, Any]) -> dict:
    """Process session through reasoning agent."""
    import asyncio
    
    async def _process():
        agent = ReasoningAgent()
        input_data = AgentInput(session_id=session_id, data=data)
        output = await agent.run(input_data)
        
        async with AsyncSessionLocal() as db:
            db_output = AgentOutputModel(
                session_id=session_id,
                agent_type=AgentType.REASONING,
                status=output.status,
                score=output.score,
                findings=output.findings,
                flags=output.flags,
                insights=output.insights,
                error_message=output.error_message
            )
            db.add(db_output)
            await db.commit()
            await db.refresh(db_output)
            
            await publish_agent_completed(
                session_id=session_id,
                agent_type="reasoning",
                output_id=db_output.id
            )
            
            return output.model_dump()
    
    return asyncio.run(_process())


@celery_app.task(name="process_evaluation_agent", bind=True)
def process_evaluation_agent(self, session_id: int, data: dict[str, Any]) -> dict:
    """Generate final evaluation from all agents."""
    import asyncio
    from app.models.models import Evaluation
    
    async def _process():
        agent = EvaluationAgent()
        input_data = AgentInput(session_id=session_id, data=data)
        output = await agent.run(input_data)
        
        async with AsyncSessionLocal() as db:
            # Save agent output
            db_output = AgentOutputModel(
                session_id=session_id,
                agent_type=AgentType.EVALUATION,
                status=output.status,
                score=output.score,
                findings=output.findings,
                flags=output.flags,
                insights=output.insights,
                error_message=output.error_message
            )
            db.add(db_output)
            
            # Create evaluation record
            findings = output.findings
            evaluation = Evaluation(
                session_id=session_id,
                overall_score=output.score or 0.0,
                coding_score=findings.get("coding_score"),
                communication_score=findings.get("communication_score"),
                engagement_score=findings.get("engagement_score"),
                reasoning_score=findings.get("reasoning_score"),
                recommendation="hire" if output.score and output.score >= 75 else "no_hire",
                confidence_level=0.85,
                strengths=[],
                weaknesses=[],
                key_findings=output.flags,
                summary=output.insights,
                detailed_report=output.insights
            )
            db.add(evaluation)
            
            await db.commit()
            
            logger.info(f"Evaluation completed for session {session_id}")
            
            return output.model_dump()
    
    return asyncio.run(_process())


@celery_app.task(name="trigger_all_agents", bind=True)
def trigger_all_agents(self, session_id: int) -> None:
    """
    Trigger all agents to process a session.
    This is called when a session ends.
    """
    logger.info(f"Triggering all agents for session {session_id}")
    
    # Dispatch agents in parallel
    from celery import group
    
    job = group(
        process_coding_agent.s(session_id, {}),
        process_speech_agent.s(session_id, {}),
        process_vision_agent.s(session_id, {}),
        process_reasoning_agent.s(session_id, {})
    )
    
    result = job.apply_async()
    
    # Wait for all agents to complete, then trigger evaluation
    result.get()
    
    # Trigger evaluation agent
    process_evaluation_agent.delay(session_id, {})
    
    logger.info(f"All agents dispatched for session {session_id}")
