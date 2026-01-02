# Quick Start Guide

## Installation

```bash
# Clone and setup
cd zeroshothire

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

## Usage Examples

### Video Analysis
```bash
# Basic JSON report
python src/main.py --video data/sample.mp4

# PDF report with visualizations
python src/main.py --video data/sample.mp4 --format pdf

# Both formats with candidate tracking
python src/main.py --video interview.mp4 --format both --candidate-id CAND001
```

### Live Monitoring
```bash
python src/main.py --live
```

## Output

Reports are saved to `reports/` directory with:
- JSON files: Structured data for programmatic access
- PDF files: Professional reports with charts
- Charts: PNG visualizations (flag distribution, temporal analysis, risk gauge)

## Troubleshooting

**MediaPipe Error**: Ensure you're using mediapipe==0.10.14 (not 0.10.30+):
```bash
pip uninstall mediapipe
pip install mediapipe==0.10.14
```

**No Video File**: Make sure the video path exists and is a valid video format (.mp4, .avi, etc.)
