# src/reporting/report_generator.py
import json
import os
from datetime import datetime
from typing import List, Dict, Optional
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
from matplotlib.patches import Wedge
import numpy as np

try:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

from .scoring_engine import ScoringEngine


class ReportGenerator:
    """
    Generate comprehensive interview analysis reports in JSON and PDF formats.
    """
    
    def __init__(self):
        self.scoring_engine = ScoringEngine()
    
    def generate_report(
        self,
        flags: List[Dict],
        metadata: Dict,
        output_path: str,
        format: str = 'json',
        candidate_id: Optional[str] = None
    ) -> str:
        """
        Generate comprehensive report in specified format.
        
        Args:
            flags: List of detection flags
            metadata: Video/session metadata (duration, fps, total_frames, etc.)
            output_path: Path to save report
            format: 'json', 'pdf', or 'both'
            candidate_id: Optional candidate identifier
            
        Returns:
            Path to generated report (or primary report if 'both')
        """
        # Calculate risk assessment
        duration = metadata.get('duration_seconds', 0)
        total_frames = metadata.get('total_frames', 0)
        fps = metadata.get('fps', 30.0)
        
        risk_data = self.scoring_engine.calculate_risk_score(flags, duration, total_frames, fps)
        flag_distribution = self.scoring_engine.get_flag_distribution(flags)
        temporal_distribution = self.scoring_engine.get_temporal_distribution(flags, duration, fps)
        
        # Prepare complete data
        report_data = {
            'report_metadata': {
                'generated_at': datetime.now().isoformat(),
                'candidate_id': candidate_id or 'N/A',
                'video_path': metadata.get('video_path', 'N/A'),
                'duration_seconds': duration,
                'total_frames': total_frames,
                'fps': fps,
            },
            'risk_assessment': risk_data,
            'flag_summary': {
                'total_flags': len(flags),
                'by_type': flag_distribution,
                'temporal_distribution': temporal_distribution,
            },
            'detailed_flags': self._format_detailed_flags(flags, fps),
        }
        
        # Generate based on format
        if format == 'json':
            return self.generate_json_report(report_data, output_path)
        elif format == 'pdf':
            if not PDF_AVAILABLE:
                print("[WARNING] reportlab not installed. Falling back to JSON format.")
                return self.generate_json_report(report_data, output_path)
            return self.generate_pdf_report(report_data, output_path, metadata)
        elif format == 'both':
            json_path = self.generate_json_report(report_data, output_path)
            if PDF_AVAILABLE:
                pdf_path = output_path.replace('.json', '.pdf')
                self.generate_pdf_report(report_data, pdf_path, metadata)
            return json_path
        else:
            raise ValueError(f"Unknown format: {format}. Use 'json', 'pdf', or 'both'")
    
    def generate_json_report(self, report_data: Dict, output_path: str) -> str:
        """Generate JSON report with full statistics."""
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"[INFO] JSON report saved to {output_path}")
        return output_path
    
    def generate_pdf_report(self, report_data: Dict, output_path: str, metadata: Dict) -> str:
        """Generate PDF report with visualizations."""
        if not PDF_AVAILABLE:
            raise ImportError("reportlab is required for PDF generation. Install with: pip install reportlab")
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Create PDF document
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=TA_CENTER,
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=12,
        )
        
        # Title
        story.append(Paragraph("ZeroShotHire Guard", title_style))
        story.append(Paragraph("Interview Integrity Analysis Report", styles['Heading2']))
        story.append(Spacer(1, 0.3 * inch))
        
        # Metadata table
        meta = report_data['report_metadata']
        risk = report_data['risk_assessment']
        
        metadata_data = [
            ['Report Generated:', meta['generated_at']],
            ['Candidate ID:', meta['candidate_id']],
            ['Interview Duration:', f"{meta['duration_seconds']:.1f} seconds"],
            ['Total Frames Analyzed:', str(meta['total_frames'])],
        ]
        
        t = Table(metadata_data, colWidths=[2.5*inch, 4*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ecf0f1')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        story.append(t)
        story.append(Spacer(1, 0.3 * inch))
        
        # Risk Assessment Section
        story.append(Paragraph("Risk Assessment", heading_style))
        
        risk_color = self._get_risk_color(risk['risk_level'])
        risk_data = [
            ['Risk Level:', Paragraph(f"<b>{risk['risk_level']}</b>", styles['Normal'])],
            ['Overall Score:', f"{risk['overall_score']:.3f}"],
            ['Confidence Interval:', f"[{risk['confidence_interval'][0]:.3f}, {risk['confidence_interval'][1]:.3f}]"],
            ['Total Flags:', str(risk['total_flags'])],
            ['Recommendation:', risk['recommendation']],
        ]
        
        t = Table(risk_data, colWidths=[2*inch, 4.5*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ecf0f1')),
            ('BACKGROUND', (1, 0), (1, 0), risk_color),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        story.append(t)
        story.append(Spacer(1, 0.3 * inch))
        
        # Generate charts
        chart_dir = os.path.join(os.path.dirname(output_path), 'charts')
        os.makedirs(chart_dir, exist_ok=True)
        
        # Flag distribution chart
        flag_dist_path = os.path.join(chart_dir, 'flag_distribution.png')
        self._create_flag_distribution_chart(report_data['flag_summary']['by_type'], flag_dist_path)
        
        # Temporal distribution chart
        temporal_path = os.path.join(chart_dir, 'temporal_distribution.png')
        self._create_temporal_chart(report_data['flag_summary']['temporal_distribution'], temporal_path)
        
        # Risk gauge
        gauge_path = os.path.join(chart_dir, 'risk_gauge.png')
        self._create_risk_gauge(risk['overall_score'], risk['risk_level'], gauge_path)
        
        # Add charts to PDF
        story.append(Paragraph("Visualizations", heading_style))
        
        try:
            story.append(Image(gauge_path, width=4*inch, height=3*inch))
            story.append(Spacer(1, 0.2 * inch))
            story.append(Image(flag_dist_path, width=5*inch, height=3*inch))
            story.append(Spacer(1, 0.2 * inch))
            story.append(Image(temporal_path, width=5*inch, height=3*inch))
        except Exception as e:
            print(f"[WARNING] Could not add charts to PDF: {e}")
        
        # Build PDF
        doc.build(story)
        print(f"[INFO] PDF report saved to {output_path}")
        
        return output_path
    
    def _format_detailed_flags(self, flags: List[Dict], fps: float) -> List[Dict]:
        """Format flags with timestamps and descriptions."""
        detailed = []
        
        for flag in flags:
            # Calculate timestamp
            if 'time' in flag:
                timestamp = flag['time']
            elif 'frame' in flag:
                timestamp = flag['frame'] / fps
            else:
                timestamp = 0.0
            
            flag_type = flag.get('type', 'unknown')
            severity = ScoringEngine.FLAG_WEIGHTS.get(flag_type, 0.05)
            
            detailed.append({
                'timestamp': round(timestamp, 2),
                'frame': flag.get('frame', int(timestamp * fps)),
                'type': flag_type,
                'severity': severity,
                'description': self._get_flag_description(flag_type),
            })
        
        return sorted(detailed, key=lambda x: x['timestamp'])
    
    def _get_flag_description(self, flag_type: str) -> str:
        """Get human-readable description for flag type."""
        descriptions = {
            'no_face': 'Candidate not visible in frame',
            'multi_face': 'Multiple faces detected - potential proxy',
            'looking_away': 'Candidate looking away from screen',
            'no_blink': 'Insufficient blinking detected',
            'no_blink_detected': 'Insufficient blinking detected',
            'multi_voice': 'Multiple voices or background noise',
            'no_audio': 'Suspicious silence or muted microphone',
            'gaze_violation': 'Gaze directed away from screen',
        }
        return descriptions.get(flag_type, f'Unknown flag type: {flag_type}')
    
    def _get_risk_color(self, risk_level: str):
        """Get color for risk level."""
        colors_map = {
            'LOW': colors.HexColor('#2ecc71'),    # Green
            'MEDIUM': colors.HexColor('#f39c12'), # Orange
            'HIGH': colors.HexColor('#e74c3c'),   # Red
        }
        return colors_map.get(risk_level, colors.grey)
    
    def _create_flag_distribution_chart(self, flag_dist: Dict[str, int], output_path: str):
        """Create pie chart of flag distribution."""
        if not flag_dist:
            return
        
        fig, ax = plt.subplots(figsize=(8, 6))
        
        labels = list(flag_dist.keys())
        sizes = list(flag_dist.values())
        colors_list = plt.cm.Set3(range(len(labels)))
        
        ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors_list)
        ax.set_title('Flag Distribution by Type', fontsize=14, fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        plt.close()
    
    def _create_temporal_chart(self, temporal_dist: Dict[str, int], output_path: str):
        """Create bar chart of temporal distribution."""
        fig, ax = plt.subplots(figsize=(8, 6))
        
        quartiles = ['0-25%', '25-50%', '50-75%', '75-100%']
        counts = [temporal_dist.get(q, 0) for q in quartiles]
        
        colors_list = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c']
        bars = ax.bar(quartiles, counts, color=colors_list, edgecolor='black', linewidth=1.2)
        
        ax.set_xlabel('Interview Progress', fontsize=12, fontweight='bold')
        ax.set_ylabel('Number of Flags', fontsize=12, fontweight='bold')
        ax.set_title('Temporal Distribution of Flags', fontsize=14, fontweight='bold')
        ax.grid(axis='y', alpha=0.3)
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{int(height)}', ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        plt.close()
    
    def _create_risk_gauge(self, score: float, risk_level: str, output_path: str):
        """Create gauge meter visualization for risk score."""
        fig, ax = plt.subplots(figsize=(6, 4))
        
        # Draw gauge background
        theta = np.linspace(0, np.pi, 100)
        
        # Color segments
        ax.fill_between(theta, 0, 1, where=(theta < np.pi * 0.25), color='#2ecc71', alpha=0.3, transform=ax.transData)
        ax.fill_between(theta, 0, 1, where=(theta >= np.pi * 0.25) & (theta < np.pi * 0.60), color='#f39c12', alpha=0.3, transform=ax.transData)
        ax.fill_between(theta, 0, 1, where=(theta >= np.pi * 0.60), color='#e74c3c', alpha=0.3, transform=ax.transData)
        
        # Draw needle
        angle = np.pi * (1 - score)
        ax.arrow(0, 0, 0.7 * np.cos(angle), 0.7 * np.sin(angle), 
                head_width=0.1, head_length=0.1, fc='black', ec='black', linewidth=2)
        
        # Labels
        ax.text(0, -0.3, f'Risk Score: {score:.3f}', ha='center', fontsize=14, fontweight='bold')
        ax.text(0, -0.5, f'Level: {risk_level}', ha='center', fontsize=12, 
               color=self._get_matplotlib_risk_color(risk_level))
        
        ax.set_xlim(-1, 1)
        ax.set_ylim(-0.6, 1)
        ax.axis('off')
        ax.set_aspect('equal')
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        plt.close()
    
    def _get_matplotlib_risk_color(self, risk_level: str) -> str:
        """Get matplotlib color for risk level."""
        return {
            'LOW': '#2ecc71',
            'MEDIUM': '#f39c12',
            'HIGH': '#e74c3c',
        }.get(risk_level, 'grey')
