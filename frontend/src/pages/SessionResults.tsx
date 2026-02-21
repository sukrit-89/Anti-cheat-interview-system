import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/Button';
import { Card, MetricCard } from '../components/Card';
import { StatusIndicator } from '../components/StatusIndicator';
import { Logo } from '../components/Logo';

interface EvaluationScore { category: string; score: number; maxScore: number; feedback: string; agent: string; }
interface Finding         { content: string; severity: 'positive' | 'negative' | 'neutral'; category: string; }
interface AIAgent         { name: string; status: 'completed' | 'processing' | 'failed'; findings: Finding[]; confidence: number; }

const scoreCls = (s: number) =>
  s >= 80 ? { text: 'text-status-success', bg: 'bg-status-success/10 text-status-success border-status-success/20', bar: 'bg-status-success' } :
  s >= 60 ? { text: 'text-status-warning', bg: 'bg-status-warning/10 text-status-warning border-status-warning/20', bar: 'bg-status-warning' } :
            { text: 'text-status-critical', bg: 'bg-status-critical/10 text-status-critical border-status-critical/20', bar: 'bg-status-critical' };

const recCls: Record<string, { text: string; bg: string }> = {
  HIRE:    { text: 'text-status-success', bg: 'bg-status-success/10 border-status-success/20' },
  NO_HIRE: { text: 'text-status-critical', bg: 'bg-status-critical/10 border-status-critical/20' },
  MAYBE:   { text: 'text-status-warning', bg: 'bg-status-warning/10 border-status-warning/20' },
};

const dotCls: Record<string, string> = { positive: 'bg-status-success', negative: 'bg-status-critical', neutral: 'bg-status-warning' };
const agentStatusCls: Record<string, 'success' | 'warning' | 'critical'> = { completed: 'success', processing: 'warning', failed: 'critical' };

export default function SessionResults() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, fetchSession } = useSessionStore();
  const [scores, setScores] = useState<EvaluationScore[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [overall, setOverall] = useState(0);
  const [rec, setRec] = useState<'HIRE' | 'MAYBE' | 'NO_HIRE'>('MAYBE');

  useEffect(() => {
    if (sessionId) { fetchSession(parseInt(sessionId)); loadMock(); }
  }, [sessionId, fetchSession]);

  const loadMock = () => {
    setOverall(78); setRec('HIRE');
    setScores([
      { category: 'Problem Solving', score: 82, maxScore: 100, feedback: 'Strong analytical skills, efficient algorithmic approach', agent: 'ReasoningAgent' },
      { category: 'Code Quality',    score: 85, maxScore: 100, feedback: 'Clean, well-structured code with good practices',        agent: 'CodingAgent' },
      { category: 'Communication',   score: 74, maxScore: 100, feedback: 'Clear explanations, good technical vocabulary',           agent: 'SpeechAgent' },
      { category: 'Engagement',      score: 71, maxScore: 100, feedback: 'Consistent attention, professional demeanor',             agent: 'VisionAgent' },
    ]);
    setAgents([
      { name: 'CodingAgent',    status: 'completed', confidence: 92, findings: [
        { content: 'Implemented efficient binary search algorithm', severity: 'positive', category: 'Algorithm' },
        { content: 'Code follows SOLID principles', severity: 'positive', category: 'Best Practices' },
        { content: 'Minor optimization opportunities in loop structure', severity: 'neutral', category: 'Optimization' },
      ]},
      { name: 'SpeechAgent',    status: 'completed', confidence: 88, findings: [
        { content: 'Excellent technical explanation clarity', severity: 'positive', category: 'Communication' },
        { content: 'Used appropriate industry terminology', severity: 'positive', category: 'Vocabulary' },
        { content: 'Occasional filler words during complex explanations', severity: 'neutral', category: 'Delivery' },
      ]},
      { name: 'VisionAgent',    status: 'completed', confidence: 85, findings: [
        { content: 'Maintained consistent eye contact with screen', severity: 'positive', category: 'Attention' },
        { content: 'Professional posture throughout interview', severity: 'positive', category: 'Demeanor' },
        { content: 'Brief attention lapses during complex problems', severity: 'negative', category: 'Focus' },
      ]},
      { name: 'ReasoningAgent', status: 'completed', confidence: 90, findings: [
        { content: 'Systematic problem decomposition approach', severity: 'positive', category: 'Methodology' },
        { content: 'Logical progression through solution steps', severity: 'positive', category: 'Logic' },
        { content: 'Good adaptation to edge cases', severity: 'positive', category: 'Adaptability' },
      ]},
    ]);
  };

  if (!currentSession) {
    return <div className="min-h-screen bg-neeti-bg flex items-center justify-center"><p className="text-ink-ghost text-sm">Loading results…</p></div>;
  }

  const r = recCls[rec] || recCls.MAYBE;

  return (
    <div className="min-h-screen bg-neeti-bg relative overflow-hidden">
      <div className="ambient-orb ambient-orb-bronze w-[500px] h-[500px] top-[-10%] right-[5%] z-0 opacity-50" />
      <div className="ambient-orb ambient-orb-blue w-[400px] h-[400px] bottom-[15%] left-[-5%] z-0 opacity-35" />

      <header className="sticky top-0 z-30 glass-header px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-bronze" />
            <div>
              <h1 className="text-base font-display font-semibold text-ink-primary">Evaluation Report</h1>
              <p className="text-[10px] text-ink-ghost">{currentSession.title} · {currentSession.join_code}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/sessions/${sessionId}/monitor`)}>Back to Monitor</Button>
            <Button variant="primary" size="sm" onClick={() => console.log('Download PDF')} icon={<Download className="w-4 h-4" />}>Download PDF</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10">
        <section>
          <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-5">Final Verdict</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <MetricCard title="Overall Score" value={overall} unit="/100" status="success" description="Comprehensive evaluation" />
            </div>
            <Card className={`text-center flex flex-col items-center justify-center border ${r.bg} rounded-lg`}>
              <Logo size="lg" linkTo="/" />
              <div className={`text-2xl font-bold font-mono ${r.text} mt-2`}>{rec.replace('_', ' ')}</div>
              <p className="text-[10px] text-ink-ghost mt-1">Hiring Recommendation</p>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-5">Performance Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scores.map((sc, i) => {
              const c = scoreCls(sc.score);
              return (
                <Card key={i}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-ink-primary">{sc.category}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${c.bg}`}>{sc.score}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-ink-ghost mb-2">
                    <span>Agent</span><span className="font-mono text-ink-secondary">{sc.agent}</span>
                  </div>
                  <div className="w-full bg-neeti-elevated rounded-full h-1.5 mb-3">
                    <div className={`h-1.5 rounded-full transition-all ${c.bar}`} style={{ width: `${sc.score}%` }} />
                  </div>
                  <p className="text-sm text-ink-secondary">{sc.feedback}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-5">Agent Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((ag, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-ink-primary">{ag.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <StatusIndicator status={agentStatusCls[ag.status] || 'warning'} size="sm" />
                    <span className="text-[10px] text-ink-ghost">{ag.confidence}%</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {ag.findings.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotCls[f.severity] || 'bg-ink-ghost'}`} />
                      <div className="min-w-0">
                        <p className="text-sm text-ink-primary">{f.content}</p>
                        <p className="text-[10px] text-ink-ghost">{f.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-5">Session Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Clock,         label: 'Duration',   value: '45 minutes' },
              { icon: TrendingUp,    label: 'Complexity', value: 'Medium-Hard' },
              { icon: CheckCircle,   label: 'Status',     value: 'Completed' },
              { icon: AlertTriangle, label: 'Flags',      value: '2 minor issues' },
            ].map(({ icon: Icon, label, value }) => (
              <Card key={label}>
                <div className="flex items-center gap-2 text-[10px] text-ink-ghost mb-2">
                  <Icon className="w-3.5 h-3.5" /><span>{label}</span>
                </div>
                <p className="text-sm font-medium text-ink-primary">{value}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
