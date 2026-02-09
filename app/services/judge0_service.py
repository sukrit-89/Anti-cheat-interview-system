"""
Judge0 Code Execution Service.
Handles secure code execution in sandbox environment.
"""
import asyncio
import httpx
from typing import Optional, Dict, Any
from app.core.config import settings
from app.core.logging import logger


# Language ID mapping for Judge0 API
# Full list: https://github.com/judge0/judge0/blob/master/CHANGELOG.md
LANGUAGE_MAP = {
    "python": 71,  # Python 3.8.1
    "javascript": 63,  # JavaScript (Node.js 12.14.0)
    "typescript": 74,  # TypeScript 3.7.4
    "java": 62,  # Java (OpenJDK 13.0.1)
    "cpp": 54,  # C++ (GCC 9.2.0)
    "c": 50,  # C (GCC 9.2.0)
    "csharp": 51,  # C# (Mono 6.6.0.161)
    "go": 60,  # Go (1.13.5)
    "rust": 73,  # Rust (1.40.0)
    "ruby": 72,  # Ruby (2.7.0)
    "php": 68,  # PHP (7.4.1)
    "swift": 83,  # Swift (5.2.3)
    "kotlin": 78,  # Kotlin (1.3.70)
}


class Judge0Service:
    """Service for executing code using Judge0 API."""
    
    def __init__(self):
        self.api_url = settings.JUDGE0_API_URL
        self.api_key = settings.JUDGE0_API_KEY
        self.timeout = settings.CODE_EXECUTION_TIMEOUT
        
    def get_language_id(self, language: str) -> Optional[int]:
        """Get Judge0 language ID from language name."""
        return LANGUAGE_MAP.get(language.lower())
    
    async def execute_code(
        self,
        code: str,
        language: str,
        stdin: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute code using Judge0 API.
        
        Args:
            code: Source code to execute
            language: Programming language
            stdin: Standard input (optional)
            
        Returns:
            Dict with execution results (output, error, status)
        """
        
        # Check if Judge0 is configured
        if not self.api_url or not self.api_key:
            logger.warning("Judge0 not configured, using rule-based analysis")
            return await self._rule_based_execution(code, language)
        
        language_id = self.get_language_id(language)
        
        if language_id is None:
            logger.warning(f"Unsupported language: {language}")
            return {
                "success": False,
                "output": None,
                "error": f"Unsupported language: {language}",
                "status": "error"
            }
        
        try:
            async with httpx.AsyncClient() as client:
                # Submit code for execution
                submission = await self._submit_code(
                    client, code, language_id, stdin
                )
                
                if not submission:
                    return {
                        "success": False,
                        "output": None,
                        "error": "Failed to submit code",
                        "status": "error"
                    }
                
                # Poll for results
                result = await self._get_submission_result(
                    client, submission["token"]
                )
                
                return self._format_result(result)
                
        except httpx.TimeoutException:
            logger.error("Judge0 request timeout")
            return {
                "success": False,
                "output": None,
                "error": "Execution timeout",
                "status": "timeout"
            }
        except Exception as e:
            logger.error(f"Judge0 execution error: {e}")
            return {
                "success": False,
                "output": None,
                "error": str(e),
                "status": "error"
            }
    
    async def _submit_code(
        self,
        client: httpx.AsyncClient,
        code: str,
        language_id: int,
        stdin: Optional[str]
    ) -> Optional[Dict[str, Any]]:
        """Submit code to Judge0 for execution."""
        
        headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": self.api_url.replace("https://", ""),
            "Content-Type": "application/json"
        }
        
        payload = {
            "source_code": code,
            "language_id": language_id,
            "stdin": stdin or "",
            "cpu_time_limit": self.timeout,
            "wall_time_limit": self.timeout,
        }
        
        response = await client.post(
            f"{self.api_url}/submissions?base64_encoded=false&wait=false",
            json=payload,
            headers=headers,
            timeout=10.0
        )
        
        if response.status_code == 201:
            return response.json()
        else:
            logger.error(f"Judge0 submission failed: {response.status_code}")
            return None
    
    async def _get_submission_result(
        self,
        client: httpx.AsyncClient,
        token: str,
        max_attempts: int = 10
    ) -> Optional[Dict[str, Any]]:
        """Poll Judge0 for submission results."""
        
        headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": self.api_url.replace("https://", "")
        }
        
        for attempt in range(max_attempts):
            await asyncio.sleep(1)  # Wait 1 second between polls
            
            response = await client.get(
                f"{self.api_url}/submissions/{token}?base64_encoded=false",
                headers=headers,
                timeout=10.0
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Check if execution is complete
                # Status IDs: 1-2 = In Queue/Processing, 3 = Accepted, 4+ = Errors
                if result.get("status", {}).get("id", 0) > 2:
                    return result
            else:
                logger.error(f"Judge0 result retrieval failed: {response.status_code}")
                return None
        
        logger.warning("Judge0 polling timeout")
        return None
    
    def _format_result(self, result: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Format Judge0 result into standard response."""
        
        if not result:
            return {
                "success": False,
                "output": None,
                "error": "No result received",
                "status": "error"
            }
        
        status = result.get("status", {})
        status_id = status.get("id", 0)
        
        # Status ID 3 = Accepted (successful execution)
        if status_id == 3:
            return {
                "success": True,
                "output": result.get("stdout", ""),
                "error": None,
                "status": "success",
                "time": result.get("time"),
                "memory": result.get("memory")
            }
        else:
            # Compilation error, runtime error, etc.
            error_msg = (
                result.get("compile_output") or
                result.get("stderr") or
                result.get("message") or
                status.get("description", "Unknown error")
            )
            
            return {
                "success": False,
                "output": result.get("stdout"),
                "error": error_msg,
                "status": status.get("description", "error").lower(),
                "time": result.get("time"),
                "memory": result.get("memory")
            }
    
    async def _rule_based_execution(
        self,
        code: str,
        language: str
    ) -> Dict[str, Any]:
        """
        Fallback: Rule-based code analysis without execution.
        Analyzes code syntax and structure.
        """
        
        logger.info("Using rule-based code analysis (no execution)")
        
        # Basic syntax checks
        issues = []
        
        if language == "python":
            # Check for basic Python syntax
            if "print(" in code:
                issues.append("✓ Print statement detected")
            if "def " in code:
                issues.append("✓ Function definition detected")
            if "for " in code or "while " in code:
                issues.append("✓ Loop structure detected")
        
        elif language in ["javascript", "typescript"]:
            if "console.log(" in code:
                issues.append("✓ Console log detected")
            if "function " in code or "=>" in code:
                issues.append("✓ Function detected")
        
        elif language == "java":
            if "public static void main" in code:
                issues.append("✓ Main method detected")
            if "System.out.println" in code:
                issues.append("✓ Print statement detected")
        
        analysis = "\n".join(issues) if issues else "Code structure analyzed"
        
        return {
            "success": True,
            "output": f"[Rule-based Analysis]\n{analysis}\n\nNote: Actual execution disabled. Enable Judge0 for real results.",
            "error": None,
            "status": "analyzed"
        }


# Singleton instance
judge0_service = Judge0Service()
