/**
 * Evaluation Report — Forensic-style technical assessment results
 * Visual: evidence-based verdict with multi-agent analysis breakdown
 */
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { EvidenceBlock } from '../components/EvidenceBlock';
import { Card } from '../components/Card';
import { FileText, Download, Gavel } from 'lucide-react';
import { Logo } from '../components/Logo';

/* ── mock data (replace with API fetch) ─────────────── */
const MOCK = {
  sessionRef: 'ARCH_009',
  protocol: 'V2.4_SECURE',
  verdict: 'QUALIFIED' as const,
  confidence: 96.8,
  timestamp: '2024-02-17T14:30:00Z',
  candidate: { name: 'Alex Chen', email: 'alex.chen@example.com', experience: '5 years', degree: 'BS Computer Science' },
  agents: [
    { id: 1, name: 'Code Integrity', score: 94 },
    { id: 2, name: 'Logic Flow',     score: 98 },
    { id: 3, name: 'Architecture',   score: 91 },
    { id: 4, name: 'Security',       score: 97 },
    { id: 5, name: 'Efficiency',     score: 95 },
  ],
  evidence: [
    { type: 'success' as const, title: 'Strong Algorithm Implementation', content: 'Candidate demonstrated proficiency in implementing efficient sorting and search algorithms with optimal time complexity.', level: 'STRENGTH' },
    { type: 'success' as const, title: 'Clean Code Structure', content: 'Code exhibits strong organizational patterns with appropriate use of functions, clear variable naming, and logical flow.', level: 'STRENGTH' },
    { type: 'warning' as const, title: 'Edge Case Handling', content: 'Some edge cases were not initially considered. Candidate addressed this after prompting.', level: 'ADVISORY' },
    { type: 'success' as const, title: 'Problem Solving Approach', content: 'Methodical approach to problem decomposition. Clear communication of thought process throughout evaluation.', level: 'STRENGTH' },
  ],
  analysis: `The candidate demonstrated strong technical proficiency across all evaluation criteria. Code quality was consistently high, with particular strength in algorithmic thinking and system design principles. Communication skills were effective, with clear articulation of tradeoffs and design decisions. Minor areas for improvement identified in edge case handling were addressed promptly when raised. Overall assessment indicates strong technical capability aligned with senior engineering expectations.`,
};

/* ── verdict colour map ─────────────────────────────── */
const VERDICT_CFG = {
  QUALIFIED:    { border: 'border-status-success', text: 'text-status-success', label: 'VERDICT: QUALIFIED' },
  REJECTED:     { border: 'border-status-critical', text: 'text-status-critical', label: 'VERDICT: REJECTED' },
  INCONCLUSIVE: { border: 'border-status-warning', text: 'text-status-warning', label: 'VERDICT: INCONCLUSIVE' },
} as const;

/* ═══════════════════════════════════════════════════════ */
export const EvaluationReport = () => {
  const { id } = useParams<{ id: string }>();
  const data = MOCK;
  const cfg = VERDICT_CFG[data.verdict];

  return (
    <div className="min-h-screen bg-neeti-bg">
      {/* ── Header ────────────────────────────────── */}
      <header className="sticky top-0 z-30 glass-header px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="md" linkTo="/" />
          <div>
            <h2 className="text-base font-display font-semibold text-ink-primary">
              Neeti AI <span className="text-ink-ghost font-normal">|</span> Forensic Report
            </h2>
            <div className="flex items-center gap-3 text-[10px] text-ink-ghost font-mono">
              <span>SYS_REF: {data.sessionRef}</span>
              <span className="text-ink-ghost/40">•</span>
              <span>PROTOCOL: {data.protocol}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>Export PDF</Button>
          <Button variant="primary" size="sm" icon={<Gavel className="w-4 h-4" />}>Authorize Hire</Button>
        </div>
      </header>

      {/* ── Main grid ─────────────────────────────── */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Verdict banner */}
          <div className={`bg-neeti-surface border-l-4 ${cfg.border} rounded-lg p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4`}>
            <div>
              <p className="text-[10px] text-ink-ghost font-mono uppercase tracking-widest mb-1">Final Determination</p>
              <h1 className={`text-3xl font-bold font-display tracking-tight ${cfg.text}`}>{cfg.label}</h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-ink-ghost font-mono uppercase tracking-widest mb-1">Aggregate Confidence</p>
              <p className={`text-3xl font-mono font-bold ${cfg.text}`}>{data.confidence}%</p>
            </div>
          </div>

          {/* Agent score grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {data.agents.map(ag => (
              <Card key={ag.id} interactive className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">📊</span>
                  <span className="text-[9px] font-mono text-ink-ghost uppercase">AGT_{ag.id.toString().padStart(2, '0')}</span>
                </div>
                <p className="text-[10px] text-ink-secondary uppercase font-medium tracking-wide mb-1">{ag.name}</p>
                <p className="text-2xl font-mono font-bold text-ink-primary">{ag.score}</p>
                <div className="h-1 bg-neeti-elevated rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-bronze rounded-full transition-all duration-500" style={{ width: `${ag.score}%` }} />
                </div>
              </Card>
            ))}
          </div>

          {/* Evidence breakdown */}
          <section className="space-y-4">
            <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">Evidence Breakdown</h2>
            {data.evidence.map((item, idx) => (
              <EvidenceBlock key={idx} type={item.type} title={item.title} label={item.level}>
                {item.content}
              </EvidenceBlock>
            ))}
          </section>

          {/* Comprehensive analysis */}
          <Card>
            <h2 className="text-sm font-display font-semibold text-ink-primary mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-bronze" /> Comprehensive Analysis
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed font-display italic">{data.analysis}</p>
          </Card>
        </div>

        {/* Right column — candidate profile */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-24 space-y-5">
            {/* Candidate */}
            <Card>
              <p className="text-[10px] text-ink-ghost font-mono uppercase tracking-widest mb-4">Evaluated Candidate</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-bronze/10 border-2 border-bronze flex items-center justify-center text-bronze text-xl font-bold">
                  {data.candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-ink-primary font-semibold">{data.candidate.name}</h3>
                  <p className="text-ink-ghost text-xs font-mono">{data.candidate.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-neeti-border pt-4">
                {[['Experience', data.candidate.experience], ['Education', data.candidate.degree]].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-ink-ghost">{l}</span>
                    <span className="text-ink-primary font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Session metadata */}
            <Card>
              <p className="text-[10px] text-ink-ghost font-mono uppercase tracking-widest mb-4">Session Metadata</p>
              <div className="space-y-2 text-sm">
                {[
                  ['Session ID', id || 'EVAL_001'],
                  ['Timestamp',  new Date(data.timestamp).toLocaleString()],
                  ['Duration',   '54m 32s'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-ink-ghost">{l}</span>
                    <span className="text-ink-primary font-mono text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Link to="/dashboard">
              <Button variant="secondary" className="w-full">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
