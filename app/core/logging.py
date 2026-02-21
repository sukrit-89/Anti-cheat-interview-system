"""
Production-grade logging configuration.
Structured logging with JSON output for production.
"""
import logging
import sys
from datetime import datetime
from typing import Any

from app.core.config import settings

class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging."""
    
    def format(self, record: logging.LogRecord) -> str:
        import json
        
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        if hasattr(record, "extra"):
            log_data["extra"] = record.extra
        
        return json.dumps(log_data)

def setup_logging() -> logging.Logger:
    """Configure application logging."""
    logger = logging.getLogger("app")
    logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    logger.handlers.clear()
    
    handler = logging.StreamHandler(sys.stdout)
    
    if settings.LOG_FORMAT == "json":
        handler.setFormatter(JSONFormatter())
    else:
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    
    logger.propagate = False
    
    return logger

logger = setup_logging()

def get_logger(name: str = "app") -> logging.Logger:
    """Get a named logger instance. Used by service modules."""
    child_logger = logging.getLogger(name)
    if not child_logger.handlers:
        child_logger.parent = logger
    return child_logger
