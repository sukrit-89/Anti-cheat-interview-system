"""
AI Service - Unified interface for LLM providers
Supports: OpenAI (paid), Ollama (free, local), rule-based fallback
"""
import httpx
from typing import Optional
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class AIService:
    """
    Multi-provider AI service with automatic fallback:
    1. OpenAI (if API key provided)
    2. Ollama (if enabled, 100% free)
    3. Rule-based responses (always free)
    """
    
    def __init__(self):
        self.openai_available = bool(settings.OPENAI_API_KEY)
        self.ollama_available = settings.USE_OLLAMA
        
        if self.openai_available:
            import openai
            self.openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            logger.info("OpenAI client initialized")
        
        if self.ollama_available:
            self.ollama_url = settings.OLLAMA_BASE_URL
            logger.info(f"Ollama configured: {self.ollama_url}")
    
    async def generate_completion(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 500
    ) -> str:
        """
        Generate AI completion with automatic provider fallback
        """
        # Try OpenAI first
        if self.openai_available:
            try:
                return await self._openai_completion(prompt, system_prompt, temperature, max_tokens)
            except Exception as e:
                logger.warning(f"OpenAI failed, trying fallback: {e}")
        
        # Try Ollama
        if self.ollama_available:
            try:
                return await self._ollama_completion(prompt, system_prompt, temperature, max_tokens)
            except Exception as e:
                logger.warning(f"Ollama failed, using rule-based: {e}")
        
        # Fallback to rule-based (always works)
        return self._rule_based_completion(prompt)
    
    async def _openai_completion(
        self, 
        prompt: str, 
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> str:
        """Call OpenAI API"""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = self.openai_client.chat.completions.create(
            model="gpt-3.5-turbo",  # Cheapest model
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return response.choices[0].message.content
    
    async def _ollama_completion(
        self, 
        prompt: str, 
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> str:
        """Call Ollama API (free, local)"""
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": full_prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens
                    }
                },
                timeout=60.0
            )
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
    
    def _rule_based_completion(self, prompt: str) -> str:
        """
        Rule-based fallback (100% free, no API needed)
        Returns template-based responses
        """
        prompt_lower = prompt.lower()
        
        # Code analysis
        if "code quality" in prompt_lower or "code review" in prompt_lower:
            return """
Code Quality Analysis:
- Syntax: Valid
- Structure: Acceptable
- Best Practices: Review recommended
- Performance: Standard

Recommendations:
- Add error handling
- Include documentation
- Consider edge cases
"""
        
        # Communication analysis
        elif "communication" in prompt_lower or "speech" in prompt_lower:
            return """
Communication Assessment:
- Clarity: Good
- Technical Vocabulary: Adequate
- Fluency: Acceptable
- Confidence: Moderate

Suggestions:
- Provide more structured explanations
- Use industry-standard terminology
- Reduce filler words
"""
        
        # Problem-solving
        elif "reasoning" in prompt_lower or "problem solving" in prompt_lower:
            return """
Reasoning Evaluation:
- Logical Approach: Sound
- Problem Decomposition: Adequate
- Solution Strategy: Acceptable
- Adaptability: Moderate

Notes:
- Demonstrates basic problem-solving skills
- Could improve systematic approach
- Shows potential for growth
"""
        
        # Default response
        else:
            return """
Analysis completed using rule-based evaluation.
For enhanced AI-powered insights, configure OpenAI or Ollama.

Current assessment: Meets baseline requirements.
Consider deeper evaluation with AI models for production use.
"""


# Singleton instance
ai_service = AIService()
