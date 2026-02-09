import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';

interface EvaluationScore {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
}

interface Finding {
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface AIAgent {
  name: string;
  status: 'completed' | 'processing' | 'failed';
  findings: Finding[];
}

export default function SessionResults() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, fetchSession } = useSessionStore();
  const [evaluationScores, setEvaluationScores] = useState<EvaluationScore[]>([]);
  const [agentReports, setAgentReports] = useState<AIAgent[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);

  useEffect(() => {
    if (sessionId) {
      fetchSession(parseInt(sessionId));
      loadMockEvaluation();
    }
  }, [sessionId, fetchSession]);

  const loadMockEvaluation = () => {
    setOverallScore(72);
    setEvaluationScores([
      {
        category: 'Problem Solving',
        score: 78,
        maxScore: 100,
        feedback: 'Strong analytical skills, efficient algorithmic approach',
      },
      {
        category: 'Code Quality',
        score: 85,
        maxScore: 100,
        feedback: 'Clean code structure, good naming conventions',
      },
      {
        category: 'Communication',
        score: 65,
        maxScore: 100,
        feedback: 'Adequate explanation, could improve clarity',
      },
      {
        category: 'Technical Knowledge',
        score: 70,
        maxScore: 100,
        feedback: 'Solid fundamentals, some advanced concepts unclear',
      },
      {
        category: 'Behavioral',
        score: 60,
        maxScore: 100,
        feedback: 'Moderate eye contact, some signs of stress',
      },
    ]);

    setAgentReports([
      {
        name: 'Code Execution Analysis',
        status: 'completed',
        findings: [
          { content: 'Implemented optimal solution with O(n log n) complexity', sentiment: 'positive' },
          { content: 'Used appropriate data structures', sentiment: 'positive' },
          { content: 'Code passed 8/10 test cases', sentiment: 'neutral' },
          { content: 'Minor edge case handling issues detected', sentiment: 'negative' },
        ],
      },
      {
        name: 'Speech Pattern Analysis',
        status: 'completed',
        findings: [
          { content: 'Clear pronunciation and pace', sentiment: 'positive' },
          { content: 'Used technical terminology correctly', sentiment: 'positive' },
          { content: 'Explained thought process adequately', sentiment: 'neutral' },
          { content: 'Some filler words detected (12 instances)', sentiment: 'negative' },
        ],
      },
      {
        name: 'Behavioral Observation',
        status: 'completed',
        findings: [
          { content: 'Maintained eye contact 65% of the time', sentiment: 'neutral' },
          { content: 'Neutral facial expressions', sentiment: 'neutral' },
          { content: 'No suspicious behavior detected', sentiment: 'positive' },
          { content: 'Slight signs of nervousness noted', sentiment: 'negative' },
        ],
      },
      {
        name: 'Reasoning Assessment',
        status: 'completed',
        findings: [
          { content: 'Logical problem decomposition', sentiment: 'positive' },
          { content: 'Identified trade-offs effectively', sentiment: 'positive' },
          { content: 'Made reasonable assumptions', sentiment: 'neutral' },
          { content: 'Could improve time complexity analysis', sentiment: 'negative' },
        ],
      },
      {
        name: 'Final Evaluation',
        status: 'completed',
        findings: [
          { content: 'Overall performance: Above Average', sentiment: 'positive' },
          { content: 'Recommended for next round', sentiment: 'positive' },
          { content: 'Strong technical foundation', sentiment: 'positive' },
          { content: 'Suggested improvement areas: Advanced algorithms, system design', sentiment: 'neutral' },
        ],
      },
    ]);
  };

  const getVerdict = (score: number) => {
    if (score >= 80) return { text: 'Advance to Next Round', type: 'success' };
    if (score >= 60) return { text: 'Conditional Recommendation', type: 'warning' };
    return { text: 'Decline', type: 'critical' };
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-verdict-bg flex items-center justify-center">
        <div className="text-verdict-text-tertiary">Loading evaluation results...</div>
      </div>
    );
  }

  const verdict = getVerdict(overallScore);

  return (
    <div className="min-h-screen bg-verdict-bg">
      {/* Header */}
      <header className="border-b border-verdict-border bg-verdict-surface/50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-verdict-text-secondary hover:text-verdict-text-primary mb-4 transition-colors"
          >
            ← Return to Dashboard
          </button>
          <h1 className="font-serif text-3xl font-semibold text-verdict-text-primary mb-2">
            Evaluation Report
          </h1>
          <p className="text-verdict-text-secondary">{currentSession.title}</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Verdict Section */}
        <section className="mb-12 border-b border-verdict-border pb-8">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-serif text-xl font-medium text-verdict-text-primary">
              Final Assessment
            </h2>
            <div className={`text-xs uppercase tracking-widest ${{
              success: 'text-semantic-success',
              warning: 'text-semantic-warning',
              critical: 'text-semantic-critical'
            }[verdict.type]}`}>
              {verdict.text}
            </div>
          </div>
          
          <div className="flex items-end gap-12">
            <div>
              <div className="text-xs uppercase tracking-wide text-verdict-text-tertiary mb-2">
                Composite Score
              </div>
              <div className="font-mono text-6xl text-verdict-text-primary">
                {overallScore}
                <span className="text-2xl text-verdict-text-tertiary ml-1">/100</span>
              </div>
            </div>
            <div className="flex-1 pb-4">
              <div className="h-2 bg-verdict-border">
                <div 
                  className={`h-full ${{
                    success: 'bg-semantic-success',
                    warning: 'bg-semantic-warning',
                    critical: 'bg-semantic-critical'
                  }[verdict.type]}`}
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Breakdown */}
        <section className="mb-12">
          <h2 className="font-serif text-xl font-medium text-verdict-text-primary mb-6 border-b border-verdict-border pb-3">
            Assessment Criteria
          </h2>
          <div className="space-y-6">
            {evaluationScores.map((score, index) => (
              <div key={index} className="border-l-2 border-verdict-line pl-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-sm font-medium text-verdict-text-primary uppercase tracking-wide">
                    {score.category}
                  </h3>
                  <span className="font-mono text-lg text-verdict-text-primary">
                    {score.score}
                    <span className="text-sm text-verdict-text-tertiary ml-1">/{score.maxScore}</span>
                  </span>
                </div>
                <div className="h-1 bg-verdict-border mb-3">
                  <div 
                    className="h-full bg-verdict-line"
                    style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-verdict-text-secondary leading-relaxed">
                  {score.feedback}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Agent Analysis */}
        <section>
          <h2 className="font-serif text-xl font-medium text-verdict-text-primary mb-6 border-b border-verdict-border pb-3">
            Evidence & Observations
          </h2>
          <div className="space-y-8">
            {agentReports.map((agent, index) => (
              <div key={index}>
                <h3 className="text-sm uppercase tracking-widest text-verdict-text-tertiary mb-4 flex items-center gap-3">
                  {agent.name}
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === 'completed' ? 'bg-semantic-success' :
                    agent.status === 'processing' ? 'bg-semantic-warning' :
                    'bg-semantic-critical'
                  }`} />
                </h3>
                <div className="space-y-2">
                  {agent.findings.map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${
                        finding.sentiment === 'positive' ? 'bg-semantic-success' :
                        finding.sentiment === 'negative' ? 'bg-semantic-critical' :
                        'bg-verdict-line'
                      }`} />
                      <p className="text-verdict-text-secondary leading-relaxed">
                        {finding.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-verdict-border text-center">
          <p className="text-xs text-verdict-text-tertiary">
            This report was generated by Integrity AI evaluation system on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </footer>
      </div>
    </div>
  );
}
