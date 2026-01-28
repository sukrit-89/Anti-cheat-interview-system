"""
Base agent interface and abstract classes.
All AI agents inherit from these base classes.
"""
from abc import ABC, abstractmethod
from typing import Any, Optional
from datetime import datetime

from pydantic import BaseModel

from app.core.logging import logger


class AgentInput(BaseModel):
    """Base input for all agents."""
    session_id: int
    data: dict[str, Any]
    metadata: dict[str, Any] = {}


class AgentOutput(BaseModel):
    """Base output from all agents."""
    agent_type: str
    session_id: int
    score: Optional[float] = None
    findings: dict[str, Any] = {}
    flags: list[dict[str, Any]] = []
    insights: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: str = "completed"
    error_message: Optional[str] = None


class BaseAgent(ABC):
    """
    Abstract base class for all AI agents.
    
    Each agent must implement:
    - process(): Main processing logic
    - get_name(): Agent identifier
    """
    
    def __init__(self):
        self.agent_type = self.get_name()
    
    @abstractmethod
    async def process(self, input_data: AgentInput) -> AgentOutput:
        """
        Process input and return analysis output.
        
        Args:
            input_data: Agent-specific input data
        
        Returns:
            AgentOutput with analysis results
        """
        pass
    
    @abstractmethod
    def get_name(self) -> str:
        """Return agent type identifier."""
        pass
    
    async def run(self, input_data: AgentInput) -> AgentOutput:
        """
        Execute agent with error handling and logging.
        
        Args:
            input_data: Agent input
        
        Returns:
            AgentOutput
        """
        started_at = datetime.utcnow()
        
        try:
            logger.info(
                f"{self.agent_type} agent started processing session {input_data.session_id}"
            )
            
            output = await self.process(input_data)
            output.started_at = started_at
            output.completed_at = datetime.utcnow()
            output.status = "completed"
            
            logger.info(
                f"{self.agent_type} agent completed session {input_data.session_id} "
                f"with score {output.score}"
            )
            
            return output
            
        except Exception as e:
            logger.error(
                f"{self.agent_type} agent failed for session {input_data.session_id}: {e}"
            )
            
            return AgentOutput(
                agent_type=self.agent_type,
                session_id=input_data.session_id,
                started_at=started_at,
                completed_at=datetime.utcnow(),
                status="failed",
                error_message=str(e)
            )
    
    def calculate_score(self, metrics: dict[str, float], weights: dict[str, float]) -> float:
        """
        Helper to calculate weighted score from metrics.
        
        Args:
            metrics: Dict of metric name to value (0-100)
            weights: Dict of metric name to weight (sum should be 1.0)
        
        Returns:
            Weighted score (0-100)
        """
        total_score = 0.0
        total_weight = 0.0
        
        for metric, value in metrics.items():
            weight = weights.get(metric, 0.0)
            total_score += value * weight
            total_weight += weight
        
        if total_weight == 0:
            return 0.0
        
        return min(100.0, max(0.0, total_score / total_weight))
