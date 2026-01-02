# run_backend.py
"""
Backend server runner
Starts the FastAPI application with uvicorn
"""

import uvicorn
import os

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Starting ZeroShotHire Guard Backend API")
    print("=" * 60)
    print()
    print("📍 API will be available at: http://localhost:8000")
    print("📖 API docs will be available at: http://localhost:8000/docs")
    print()
    print("Press CTRL+C to stop the server")
    print("=" * 60)
    print()
    
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
