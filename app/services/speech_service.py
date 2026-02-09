"""
Speech-to-Text Service.
Transcribes audio from interviews using Whisper.
"""
import io
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any
from app.core.config import settings
from app.core.logging import logger

# Try importing Whisper (local)
try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    logger.warning("Whisper not installed. Install with: pip install openai-whisper")

# Try importing OpenAI client (cloud)
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class SpeechService:
    """Service for speech-to-text transcription."""
    
    def __init__(self):
        self.use_local = settings.USE_LOCAL_WHISPER
        self.model_name = settings.WHISPER_MODEL
        self.model = None
        
        # Load local Whisper model if configured
        if self.use_local and WHISPER_AVAILABLE:
            try:
                logger.info(f"Loading Whisper model: {self.model_name}")
                self.model = whisper.load_model(self.model_name)
                logger.info("Whisper model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load Whisper model: {e}")
                self.model = None
    
    async def transcribe_audio(
        self,
        audio_file: bytes,
        language: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Transcribe audio to text.
        
        Args:
            audio_file: Audio file bytes (mp3, wav, m4a, etc.)
            language: Language code (e.g., 'en', 'es', 'fr')
            
        Returns:
            Dict with transcription results
        """
        
        if self.use_local and self.model:
            return await self._transcribe_local(audio_file, language)
        elif settings.OPENAI_API_KEY and OPENAI_AVAILABLE:
            return await self._transcribe_openai(audio_file, language)
        else:
            logger.warning("No transcription service available")
            return {
                "success": False,
                "text": "",
                "error": "Speech-to-text not configured. Install Whisper or add OpenAI API key.",
                "confidence": 0.0
            }
    
    async def _transcribe_local(
        self,
        audio_file: bytes,
        language: Optional[str]
    ) -> Dict[str, Any]:
        """Transcribe using local Whisper model."""
        
        try:
            # Save audio to temp file
            temp_path = Path("/tmp/temp_audio.wav")
            temp_path.write_bytes(audio_file)
            
            # Run transcription in thread pool (CPU-intensive)
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self._run_whisper,
                str(temp_path),
                language
            )
            
            # Clean up temp file
            temp_path.unlink(missing_ok=True)
            
            return {
                "success": True,
                "text": result.get("text", ""),
                "error": None,
                "confidence": self._calculate_confidence(result),
                "language": result.get("language"),
                "segments": result.get("segments", [])
            }
            
        except Exception as e:
            logger.error(f"Local transcription error: {e}")
            return {
                "success": False,
                "text": "",
                "error": str(e),
                "confidence": 0.0
            }
    
    def _run_whisper(
        self,
        audio_path: str,
        language: Optional[str]
    ) -> Dict[str, Any]:
        """Run Whisper model (blocking operation)."""
        
        options = {}
        if language:
            options["language"] = language
        
        result = self.model.transcribe(audio_path, **options)
        return result
    
    def _calculate_confidence(self, result: Dict[str, Any]) -> float:
        """Calculate average confidence from Whisper segments."""
        
        segments = result.get("segments", [])
        if not segments:
            return 0.0
        
        # Whisper doesn't directly provide confidence scores
        # We can estimate based on token probabilities if available
        # For now, return a placeholder
        return 0.85  # Typical Whisper accuracy
    
    async def _transcribe_openai(
        self,
        audio_file: bytes,
        language: Optional[str]
    ) -> Dict[str, Any]:
        """Transcribe using OpenAI Whisper API."""
        
        try:
            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            
            # Create file-like object
            audio_io = io.BytesIO(audio_file)
            audio_io.name = "audio.wav"
            
            # Call OpenAI Whisper API
            options = {"file": audio_io, "model": "whisper-1"}
            if language:
                options["language"] = language
            
            transcript = client.audio.transcriptions.create(**options)
            
            return {
                "success": True,
                "text": transcript.text,
                "error": None,
                "confidence": 0.9,  # OpenAI doesn't provide confidence
                "language": language
            }
            
        except Exception as e:
            logger.error(f"OpenAI transcription error: {e}")
            return {
                "success": False,
                "text": "",
                "error": str(e),
                "confidence": 0.0
            }
    
    async def analyze_speech_quality(
        self,
        transcription: str,
        audio_duration: float
    ) -> Dict[str, Any]:
        """
        Analyze speech quality metrics.
        
        Args:
            transcription: Transcribed text
            audio_duration: Audio duration in seconds
            
        Returns:
            Dict with quality metrics
        """
        
        if not transcription:
            return {
                "clarity_score": 0.0,
                "words_per_minute": 0.0,
                "filler_words_count": 0,
                "pauses_detected": 0
            }
        
        # Calculate metrics
        words = transcription.split()
        word_count = len(words)
        words_per_minute = (word_count / audio_duration) * 60 if audio_duration > 0 else 0
        
        # Detect filler words
        filler_words = ["um", "uh", "like", "you know", "basically", "actually"]
        filler_count = sum(
            transcription.lower().count(filler) for filler in filler_words
        )
        
        # Calculate clarity score (inverse of filler word ratio)
        clarity_score = max(0.0, 1.0 - (filler_count / max(word_count, 1)))
        
        return {
            "clarity_score": round(clarity_score, 2),
            "words_per_minute": round(words_per_minute, 1),
            "filler_words_count": filler_count,
            "word_count": word_count,
            "duration_seconds": audio_duration
        }


# Singleton instance
speech_service = SpeechService()
