import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, FileText, Scale, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/Button';
import { Card, MetricCard } from '../components/Card';

interface EvaluationScore {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
  agent: string;
}

interface Finding {
  content: string;
  severity: 'positive' | 'negative' | 'neutral';
  category: string;
}

interface AIAgent {
  name: string;
  status: 'completed' | 'processing' | 'failed';
  findings: Finding[];
  confidence: number;
}

export default function SessionResults() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, fetchSession } = useSessionStore();
  const [evaluationScores, setEvaluationScores] = useState<EvaluationScore[]>([]);
  const [agentReports, setAgentReports] = useState<AIAgent[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [recommendation, setRecommendation] = useState<'HIRE' | 'MAYBE' | 'NO_HIRE'>('MAYBE');

  useEffect(() => {
    if (sessionId) {
      fetchSession(parseInt(sessionId));
      loadMockEvaluation();
    }
  }, [sessionId, fetchSession]);

  const loadMockEvaluation = () => {
    setOverallScore(78);
    setRecommendation('HIRE');

    setEvaluationScores([
      {
        category: 'Problem Solving',
        score: 82,
        maxScore: 100,
        feedback: 'Strong analytical skills, efficient algorithmic approach',
        agent: 'ReasoningAgent'
      },
      {
        category: 'Code Quality',
        score: 85,
        maxScore: 100,
        feedback: 'Clean, well-structured code with good practices',
        agent: 'CodingAgent'
      },
      {
        category: 'Communication',
        score: 74,
        maxScore: 100,
        feedback: 'Clear explanations, good technical vocabulary',
        agent: 'SpeechAgent'
      },
      {
        category: 'Engagement',
        score: 71,
        maxScore: 100,
        feedback: 'Consistent attention, professional demeanor',
        agent: 'VisionAgent'
      }
    ]);

    setAgentReports([
      {
        name: 'CodingAgent',
        status: 'completed',
        confidence: 92,
        findings: [
          { content: 'Implemented efficient binary search algorithm', severity: 'positive', category: 'Algorithm' },
          { content: 'Code follows SOLID principles', severity: 'positive', category: 'Best Practices' },
          { content: 'Minor optimization opportunities in loop structure', severity: 'neutral', category: 'Optimization' }
        ]
      },
      {
        name: 'SpeechAgent',
        status: 'completed',
        confidence: 88,
        findings: [
          { content: 'Excellent technical explanation clarity', severity: 'positive', category: 'Communication' },
          { content: 'Used appropriate industry terminology', severity: 'positive', category: 'Vocabulary' },
          { content: 'Occasional filler words during complex explanations', severity: 'neutral', category: 'Delivery' }
        ]
      },
      {
        name: 'VisionAgent',
        status: 'completed',
        confidence: 85,
        findings: [
          { content: 'Maintained consistent eye contact with screen', severity: 'positive', category: 'Attention' },
          { content: 'Professional posture throughout interview', severity: 'positive', category: 'Demeanor' },
          { content: 'Brief attention lapses during complex problems', severity: 'negative', category: 'Focus' }
        ]
      },
      {
        name: 'ReasoningAgent',
        status: 'completed',
        confidence: 90,
        findings: [
          { content: 'Systematic problem decomposition approach', severity: 'positive', category: 'Methodology' },
          { content: 'Logical progression through solution steps', severity: 'positive', category: 'Logic' },
          { content: 'Good adaptation to edge cases', severity: 'positive', category: 'Adaptability' }
        ]
      }
    ]);
  };

  const handleDownloadReport = () => {
    // PDF generation logic here
    console.log('Downloading PDF report...');
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'HIRE': return 'text-semantic-success';
      case 'NO_HIRE': return 'text-semantic-critical';
      default: return 'text-semantic-warning';
    }
  };

  const getRecommendationBg = (rec: string) => {
    switch (rec) {
      case 'HIRE': return 'bg-semantic-success/10 border-semantic-success';
      case 'NO_HIRE': return 'bg-semantic-critical/10 border-semantic-critical';
      default: return 'bg-semantic-warning/10 border-semantic-warning';
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-verdict-bg flex items-center justify-center">
        <div className="text-verdict-text-secondary">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-verdict-bg">
      {/* Evidence Report Header */}
      <header className="verdict-card border-b border-verdict-border-strong px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-accent-bronze" />
              <div>
                <h1 className="text-headline font-display text-verdict-text-primary">
                  Evaluation Report
                </h1>
                <p className="text-micro text-verdict-text-tertiary">
                  {currentSession.title} · Session {currentSession.join_code}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/sessions/${sessionId}/monitor`)}
            >
              Back to Monitor
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadReport}
              icon={<Download className="w-4 h-4" />}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12 space-editorial">
        {/* Final Verdict */}
        <section className="editorial-section">
          <h2 className="text-subheadline mb-6">Final Verdict</h2>

          <div className="grid-control">
            <div className="grid-control-8">
              <MetricCard
                title="Overall Score"
                value={overallScore}
                unit="/100"
                status="success"
                description="Comprehensive evaluation"
              />
            </div>

            <div className="grid-control-4">
              <Card variant="evidence" className={`text-center ${getRecommendationBg(recommendation)}`}>
                <div className="space-y-3">
                  <Scale className="w-8 h-8 mx-auto text-accent-bronze" />
                  <div>
                    <div className={`text-2xl font-bold ${getRecommendationColor(recommendation)}`}>
                      {recommendation.replace('_', ' ')}
                    </div>
                    <p className="text-micro text-verdict-text-secondary">
                      Hiring Recommendation
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="editorial-section">
          <h2 className="text-subheadline mb-6">Performance Analysis</h2>

          <div className="grid-control">
            {evaluationScores.map((score, index) => (
              <div key={index} className="grid-control-6">
                <Card variant="control" className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-subheadline font-semibold text-verdict-text-primary">
                        {score.category}
                      </h3>
                      <span className={`text-micro px-2 py-1 rounded-sm ${score.score >= 80 ? 'bg-semantic-success/10 text-semantic-success' :
                          score.score >= 60 ? 'bg-semantic-warning/10 text-semantic-warning' :
                            'bg-semantic-critical/10 text-semantic-critical'
                        }`}>
                        {score.score}/100
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-micro">
                        <span className="text-verdict-text-tertiary">Agent:</span>
                        <span className="font-mono text-verdict-text-secondary">{score.agent}</span>
                      </div>

                      <div className="w-full bg-verdict-border rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${score.score >= 80 ? 'bg-semantic-success' :
                              score.score >= 60 ? 'bg-semantic-warning' :
                                'bg-semantic-critical'
                            }`}
                          style={{ width: `${score.score}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-body text-verdict-text-secondary">
                      {score.feedback}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* AI Agent Reports */}
        <section className="editorial-section">
          <h2 className="text-subheadline mb-6">Agent Analysis</h2>

          <div className="grid-control">
            {agentReports.map((agent, index) => (
              <div key={index} className="grid-control-6">
                <Card variant="evidence" className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-subheadline font-semibold text-verdict-text-primary">
                        {agent.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${agent.status === 'completed' ? 'bg-semantic-success' :
                            agent.status === 'processing' ? 'bg-semantic-warning' :
                              'bg-semantic-critical'
                          }`} />
                        <span className="text-micro text-verdict-text-secondary">
                          {agent.confidence}% confidence
                        </span>
                      </div>
                    </div>

                    <div className="space-paragraph">
                      {agent.findings.map((finding, findingIndex) => (
                        <div key={findingIndex} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${finding.severity === 'positive' ? 'bg-semantic-success' :
                              finding.severity === 'negative' ? 'bg-semantic-critical' :
                                'bg-semantic-warning'
                            }`} />
                          <div className="flex-1">
                            <p className="text-body text-verdict-text-primary">
                              {finding.content}
                            </p>
                            <p className="text-micro text-verdict-text-tertiary">
                              {finding.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Session Metadata */}
        <section className="editorial-section">
          <h2 className="text-subheadline mb-6">Session Information</h2>

          <div className="grid-control">
            <div className="grid-control-6">
              <Card variant="control">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-micro text-verdict-text-secondary">
                    <Clock className="w-4 h-4" />
                    <span>Duration</span>
                  </div>
                  <p className="text-body font-mono text-verdict-text-primary">
                    45 minutes
                  </p>
                </div>
              </Card>
            </div>

            <div className="grid-control-6">
              <Card variant="control">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-micro text-verdict-text-secondary">
                    <TrendingUp className="w-4 h-4" />
                    <span>Complexity</span>
                  </div>
                  <p className="text-body text-verdict-text-primary">
                    Medium-Hard
                  </p>
                </div>
              </Card>
            </div>

            <div className="grid-control-6">
              <Card variant="control">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-micro text-verdict-text-secondary">
                    <CheckCircle className="w-4 h-4" />
                    <span>Status</span>
                  </div>
                  <p className="text-body text-verdict-text-primary">
                    Completed Successfully
                  </p>
                </div>
              </Card>
            </div>

            <div className="grid-control-6">
              <Card variant="control">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-micro text-verdict-text-secondary">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Flags</span>
                  </div>
                  <p className="text-body text-verdict-text-primary">
                    2 minor issues detected
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
