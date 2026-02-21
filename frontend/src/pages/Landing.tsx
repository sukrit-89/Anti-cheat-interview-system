/**
 * Landing Page — Forensic Authority aesthetic
 * Dark, precise, data-driven with warm bronze authority accent
 */
import { Link } from 'react-router-dom';
import { TechnicalBlueprint } from '../components/TechnicalBlueprint';
import { StatusIndicator } from '../components/StatusIndicator';
import {
  Terminal,
  FileCheck,
  Fingerprint,
  ArrowRight,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { Logo } from '../components/Logo';

const AGENTS = [
  { name: 'Coding Agent', status: 'active' as const },
  { name: 'Speech Agent', status: 'active' as const },
  { name: 'Vision Agent', status: 'active' as const },
  { name: 'Reasoning Agent', status: 'active' as const },
  { name: 'Evaluation Agent', status: 'idle' as const },
];

const CAPABILITIES = [
  {
    icon: Terminal,
    title: 'Real-time Execution',
    desc: 'Immediate code compilation and execution across 50+ languages via Judge0 integration.',
    tag: 'EXEC_001',
  },
  {
    icon: Scale,
    title: 'Multi-Agent Analysis',
    desc: 'Specialized agents evaluate code quality, reasoning, communication, and depth.',
    tag: 'EVAL_002',
  },
  {
    icon: FileCheck,
    title: 'Evidence Collection',
    desc: 'Comprehensive session recording with code snapshots, audio, and behavioral metrics.',
    tag: 'LOG_003',
  },
  {
    icon: Fingerprint,
    title: 'Secure Protocol',
    desc: 'End-to-end encryption, authenticated access, and compliance-ready audit trails.',
    tag: 'SEC_004',
  },
];

const PHASES = [
  {
    num: '01',
    title: 'Session Initialization',
    desc: 'Configure evaluation parameters, define assessment criteria, and generate secure session credentials.',
    tag: 'INIT_SESSION',
  },
  {
    num: '02',
    title: 'Live Evaluation',
    desc: 'Real-time code execution, automated testing, and concurrent analysis by specialized AI agents.',
    tag: 'CONDUCT_EVAL',
  },
  {
    num: '03',
    title: 'Verdict Generation',
    desc: 'Comprehensive report compilation with evidence-backed assessments and quantified performance metrics.',
    tag: 'GEN_VERDICT',
  },
];

export const Landing = () => {
  return (
    <div className="min-h-screen bg-neeti-bg relative overflow-hidden">
      {/* Faint grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.012]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(194,112,42,.4) 1px,transparent 1px), linear-gradient(90deg,rgba(194,112,42,.4) 1px,transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(194,112,42,.04),transparent)]" />

      <div className="relative z-10">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="glass-header sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <Logo size="md" showWordmark showTagline />
            </Link>

            <Link
              to="/login"
              className="px-5 py-2 border border-neeti-border hover:border-bronze/50 bg-neeti-elevated text-ink-primary text-sm font-medium rounded-md transition-all duration-200 hover:shadow-glow"
            >
              Access System
            </Link>
          </div>
        </header>

        {/* ── Hero ────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-28 lg:pt-28 lg:pb-36">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Messaging */}
            <div className="space-y-8 animate-fadeUp">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-bronze/25 bg-bronze/[0.08] backdrop-blur-md rounded-full">
                <Shield className="w-3.5 h-3.5 text-bronze" />
                <span className="text-xs font-mono text-bronze tracking-wider">
                  TECHNICAL ASSESSMENT v2.1
                </span>
              </div>

              <h2 className="text-5xl lg:text-[3.5rem] xl:text-6xl font-display font-bold text-ink-primary leading-[1.08] tracking-tight">
                Evidence-Based
                <br />
                <span className="text-gradient-bronze">Technical Judgment</span>
              </h2>

              <p className="text-lg text-ink-secondary leading-relaxed max-w-xl">
                A rigorous evaluation framework for technical interviews. Real-time
                code analysis, multi-agent assessment, and comprehensive verdict
                generation backed by measurable evidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/register" className="group">
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-bronze hover:bg-bronze-light text-white font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-strong active:scale-[0.97]">
                    Initiate Evaluation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="w-full sm:w-auto px-8 py-3.5 border border-neeti-border hover:border-bronze/40 bg-neeti-surface text-ink-primary font-medium rounded-md transition-all duration-200">
                    System Login
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2 text-sm text-ink-tertiary">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-bronze" strokeWidth={2} />
                  Multi-agent analysis
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-bronze" strokeWidth={2} />
                  Real-time execution
                </span>
              </div>
            </div>

            {/* Right — Schematic + Agent Status */}
            <div className="hidden lg:block space-y-6 animate-fadeUp" style={{ animationDelay: '120ms' }}>
              <TechnicalBlueprint showScanLine />

              <div className="glass-medium p-5 space-y-3">
                <p className="text-[10px] font-mono text-ink-ghost tracking-[0.2em] uppercase mb-3">
                  Agent Status
                </p>
                {AGENTS.map((a) => (
                  <div key={a.name} className="flex items-center justify-between">
                    <span className="text-sm font-mono text-ink-secondary">{a.name}</span>
                    <StatusIndicator
                      status={a.status}
                      label={a.status === 'active' ? 'READY' : 'STANDBY'}
                      showPulse={a.status === 'active'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Capabilities ───────────────────────────────── */}
        <section className="border-y border-white/[0.06] bg-white/[0.02] backdrop-blur-sm py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-display font-bold text-ink-primary mb-3">
                Evaluation Infrastructure
              </h3>
              <p className="text-ink-secondary max-w-2xl mx-auto">
                A comprehensive technical assessment framework built on measurable
                criteria and automated analysis.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.tag}
                  className="glass-subtle p-7 group hover:bg-white/[0.06] transition-all duration-300"
                >
                  <div className="mb-5 relative inline-flex items-center justify-center w-12 h-12 rounded-md bg-bronze/[0.07] group-hover:bg-bronze/[0.12] transition-colors">
                    <cap.icon className="w-6 h-6 text-bronze" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-base font-display font-semibold text-ink-primary mb-2">
                    {cap.title}
                  </h4>
                  <p className="text-sm text-ink-secondary leading-relaxed mb-4">
                    {cap.desc}
                  </p>
                  <span className="text-[10px] font-mono text-ink-ghost tracking-[0.15em]">
                    MODULE: {cap.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Assessment Protocol ────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display font-bold text-ink-primary mb-3">
              Assessment Protocol
            </h3>
            <p className="text-ink-secondary max-w-2xl mx-auto">
              A rigorous three-phase evaluation process designed for technical
              integrity and comprehensive judgment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {PHASES.map((phase) => (
              <div key={phase.num} className="relative pl-10 group">
                {/* Vertical connector line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-neeti-border group-last:hidden" />

                {/* Phase badge */}
                <div className="absolute left-0 top-0 w-9 h-9 flex items-center justify-center border border-bronze/30 bg-neeti-surface rounded-md text-base font-mono font-bold text-bronze">
                  {phase.num}
                </div>

                <div className="pt-1">
                  <h4 className="text-lg font-display font-semibold text-ink-primary mb-3">
                    {phase.title}
                  </h4>
                  <p className="text-sm text-ink-secondary leading-relaxed mb-3">
                    {phase.desc}
                  </p>
                  <span className="text-[10px] font-mono text-ink-ghost tracking-[0.15em]">
                    PROTOCOL: {phase.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="border-t border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-ghost">
            <span className="inline-flex items-center gap-3 font-mono tracking-wider">
              <Logo size="sm" />
              NEETI AI © {new Date().getFullYear()}
            </span>
            <span className="font-mono text-xs tracking-wider">
              EVAL_SYSTEM_v2.1.0
              <span className="text-bronze/30 mx-2">|</span>
              SECURE_PROTOCOL_ACTIVE
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
