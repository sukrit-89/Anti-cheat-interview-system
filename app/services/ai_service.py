"""
AI Service - Unified interface for LLM providers
Supports: OpenAI (paid), Ollama (free, local)
"""
import json
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
    
    No rule-based fallback — requires at least one LLM provider.
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
            self.ollama_model = settings.OLLAMA_MODEL
            logger.info(f"Ollama configured: {self.ollama_url} model={self.ollama_model}")
        
        if not self.openai_available and not self.ollama_available:
            logger.warning("No AI provider configured! Set OPENAI_API_KEY or USE_OLLAMA=True")
    
    async def generate_completion(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        json_mode: bool = False,
    ) -> str:
        """
        Generate AI completion with automatic provider fallback.
        Raises RuntimeError if no provider is available.
        """
        last_error: Optional[Exception] = None
        
        if self.openai_available:
            try:
                return await self._openai_completion(prompt, system_prompt, temperature, max_tokens, json_mode)
            except Exception as e:
                logger.warning(f"OpenAI failed, trying Ollama: {e}")
                last_error = e
        
        if self.ollama_available:
            try:
                return await self._ollama_completion(prompt, system_prompt, temperature, max_tokens, json_mode)
            except Exception as e:
                logger.error(f"Ollama failed: {e}")
                last_error = e
        
        raise RuntimeError(
            f"All AI providers failed. Last error: {last_error}. "
            "Ensure Ollama is running and a model is pulled."
        )
    
    async def _openai_completion(
        self, 
        prompt: str, 
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int,
        json_mode: bool = False,
    ) -> str:
        """Call OpenAI API"""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        kwargs = dict(
            model="gpt-4o-mini",
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}
        
        response = self.openai_client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
    
    async def _ollama_completion(
        self, 
        prompt: str, 
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int,
        json_mode: bool = False,
    ) -> str:
        """Call Ollama chat API (free, local)"""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": self.ollama_model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            }
        }
        if json_mode:
            payload["format"] = "json"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.ollama_url}/api/chat",
                json=payload,
                timeout=120.0,
            )
            response.raise_for_status()
            result = response.json()
            return result.get("message", {}).get("content", "")

ai_service = AIService()
