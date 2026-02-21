/**
 * Landing Page - Technical evaluation authority
 * Design: Blueprint/technical drawing aesthetic meets courtroom precision
 */
import { Link } from 'react-router-dom';
import { TechnicalBlueprint } from '../components/TechnicalBlueprint';
import { Scale, Terminal, FileCheck, Fingerprint, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-verdict-bg relative overflow-hidden">
      {/* Technical grid overlay - blueprint aesthetic */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `
          linear-gradient(rgba(146, 64, 14, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(146, 64, 14, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px'
      }} />

      {/* Subtle radial emphasis */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-bronze/[0.03] via-transparent to-transparent" />

      <div className="relative">
        {/* Header - Technical Authority */}
        <header className="border-b border-verdict-border bg-verdict-surface/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Scale className="w-7 h-7 text-accent-bronze" strokeWidth={1.5} />
                <div className="absolute -inset-1 bg-accent-bronze/10 blur-sm -z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-semibold text-verdict-text-primary tracking-tight">
                  Neeti AI
                </h1>
                <p className="text-xs text-verdict-text-tertiary font-mono tracking-wider">नीति · EVALUATION AUTHORITY</p>
              </div>
            </div>
            <Link to="/login">
              <button className="px-5 py-2 border border-verdict-border hover:border-accent-bronze bg-verdict-surface-elevated text-verdict-text-primary text-sm font-medium transition-all duration-200 hover:bg-verdict-border">
                Access System
              </button>
            </Link>
          </div>
        </header>

        {/* Hero - Evidence-based messaging */}
        <section className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-reveal-slow">
              <div className="inline-block px-3 py-1 border border-accent-bronze/30 bg-accent-bronze/5 text-accent-bronze text-xs font-mono tracking-wider">
                TECHNICAL ASSESSMENT v2.0
              </div>

              <h2 className="text-5xl lg:text-6xl font-display font-semibold text-verdict-text-primary leading-[1.1] tracking-tight">
                Evidence-Based
                <br />
                <span className="text-accent-bronze">Technical Judgment</span>
              </h2>

              <p className="text-lg text-verdict-text-secondary leading-relaxed max-w-xl">
                A rigorous evaluation framework for technical interviews. Real-time code analysis,
                multi-agent assessment, and comprehensive verdict generation backed by measurable evidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register" className="group">
                  <button className="w-full sm:w-auto px-8 py-4 bg-accent-bronze hover:bg-accent-bronze-light border border-accent-bronze text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                    <span>Initiate Evaluation</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="w-full sm:w-auto px-8 py-4 border border-verdict-border hover:border-accent-bronze bg-verdict-surface text-verdict-text-primary font-medium transition-all duration-200">
                    System Login
                  </button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 pt-4 text-sm text-verdict-text-tertiary">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-bronze" strokeWidth={2} />
                  <span>Multi-agent analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-bronze" strokeWidth={2} />
                  <span>Real-time execution</span>
                </div>
              </div>
            </div>

            {/* Right Column - Technical Schematic */}
            <div className="hidden lg:block relative animate-reveal-slower">
              <TechnicalBlueprint showScanLine={true} />

              {/* Agent Status Panel */}
              <div className="mt-8 border border-verdict-border bg-verdict-surface p-6 space-y-4">
                <div className="text-xs font-mono text-verdict-text-quaternary tracking-wider mb-4">
                  AGENT STATUS
                </div>
                {[
                  { name: 'Coding Agent', status: 'READY', color: 'bg-semantic-success' },
                  { name: 'Speech Agent', status: 'READY', color: 'bg-semantic-success' },
                  { name: 'Vision Agent', status: 'READY', color: 'bg-semantic-success' },
                  { name: 'Reasoning Agent', status: 'READY', color: 'bg-semantic-success' },
                  { name: 'Evaluation Agent', status: 'STANDBY', color: 'bg-semantic-warning' },
                ].map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between text-sm">
                    <span className="text-verdict-text-secondary font-mono">{agent.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${agent.color}`} />
                      <span className="text-xs text-verdict-text-tertiary tracking-wider">{agent.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technical Capabilities - Evidence-based */}
        <section className="bg-verdict-surface border-y border-verdict-border py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-display font-semibold text-verdict-text-primary mb-4">
                Evaluation Infrastructure
              </h3>
              <p className="text-verdict-text-secondary max-w-2xl mx-auto">
                A comprehensive technical assessment framework built on measurable criteria and automated analysis.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
              {/* Real-time Execution */}
              <div className="bg-verdict-bg border border-verdict-border p-8 hover:border-accent-bronze/30 transition-colors group">
                <div className="mb-6 relative inline-block">
                  <Terminal className="w-10 h-10 text-accent-bronze/80" strokeWidth={1.5} />
                  <div className="absolute -inset-2 bg-accent-bronze/5 -z-10 group-hover:bg-accent-bronze/10 transition-colors" />
                </div>
                <h4 className="text-lg font-display font-semibold text-verdict-text-primary mb-3">
                  Real-time Execution
                </h4>
                <p className="text-sm text-verdict-text-secondary leading-relaxed mb-4">
                  Immediate code compilation and execution across 50+ languages via Judge0 integration.
                </p>
                <div className="text-xs font-mono text-verdict-text-quaternary tracking-wider">
                  MODULE: EXEC_001
                </div>
              </div>

              {/* Multi-Agent Analysis */}
              <div className="bg-verdict-bg border border-verdict-border p-8 hover:border-accent-bronze/30 transition-colors group">
                <div className="mb-6 relative inline-block">
                  <Scale className="w-10 h-10 text-accent-bronze/80" strokeWidth={1.5} />
                  <div className="absolute -inset-2 bg-accent-bronze/5 -z-10 group-hover:bg-accent-bronze/10 transition-colors" />
                </div>
                <h4 className="text-lg font-display font-semibold text-verdict-text-primary mb-3">
                  Multi-Agent Analysis
                </h4>
                <p className="text-sm text-verdict-text-secondary leading-relaxed mb-4">
                  Specialized agents evaluate code quality, reasoning, communication, and technical depth.
                </p>
                <div className="text-xs font-mono text-verdict-text-quaternary tracking-wider">
                  MODULE: EVAL_002
                </div>
              </div>

              {/* Evidence Collection */}
              <div className="bg-verdict-bg border border-verdict-border p-8 hover:border-accent-bronze/30 transition-colors group">
                <div className="mb-6 relative inline-block">
                  <FileCheck className="w-10 h-10 text-accent-bronze/80" strokeWidth={1.5} />
                  <div className="absolute -inset-2 bg-accent-bronze/5 -z-10 group-hover:bg-accent-bronze/10 transition-colors" />
                </div>
                <h4 className="text-lg font-display font-semibold text-verdict-text-primary mb-3">
                  Evidence Collection
                </h4>
                <p className="text-sm text-verdict-text-secondary leading-relaxed mb-4">
                  Comprehensive session recording with code snapshots, audio, and behavioral metrics.
                </p>
                <div className="text-xs font-mono text-verdict-text-quaternary tracking-wider">
                  MODULE: LOG_003
                </div>
              </div>

              {/* Secure Protocol */}
              <div className="bg-verdict-bg border border-verdict-border p-8 hover:border-accent-bronze/30 transition-colors group">
                <div className="mb-6 relative inline-block">
                  <Fingerprint className="w-10 h-10 text-accent-bronze/80" strokeWidth={1.5} />
                  <div className="absolute -inset-2 bg-accent-bronze/5 -z-10 group-hover:bg-accent-bronze/10 transition-colors" />
                </div>
                <h4 className="text-lg font-display font-semibold text-verdict-text-primary mb-3">
                  Secure Protocol
                </h4>
                <p className="text-sm text-verdict-text-secondary leading-relaxed mb-4">
                  End-to-end encryption, authenticated access, and compliance-ready audit trails.
                </p>
                <div className="text-xs font-mono text-verdict-text-quaternary tracking-wider">
                  MODULE: SEC_004
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Assessment Protocol - Sequential process */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display font-semibold text-verdict-text-primary mb-4">
              Assessment Protocol
            </h3>
            <p className="text-verdict-text-secondary max-w-2xl mx-auto">
              A rigorous three-phase evaluation process designed for technical integrity and comprehensive judgment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Phase 01 */}
            <div className="relative">
              <div className="border-l-2 border-accent-bronze/30 pl-8 pb-12">
                <div className="absolute left-0 top-0 w-16 h-16 -translate-x-[31px] border-2 border-accent-bronze/40 bg-verdict-surface flex items-center justify-center">
                  <span className="text-2xl font-mono font-bold text-accent-bronze">01</span>
                </div>
                <div className="pt-6">
                  <h4 className="text-xl font-display font-semibold text-verdict-text-primary mb-4">
                    Session Initialization
                  </h4>
                  <p className="text-verdict-text-secondary leading-relaxed mb-4">
                    Configure evaluation parameters, define assessment criteria, and generate secure session credentials.
                  </p>
                  <div className="text-xs font-mono text-verdict-text-quaternary tracking-wider">
                    PROTOCOL: INIT_SESSION
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 02 */}
            <div className="relative">
              <div className="border-l-2 border-accent-bronze/30 pl-8 pb-12">
                <div className="absolute left-0 top-0 w-16 h-16 -translate-x-[31px] border-2 border-accent-bronze/40 bg-verdict-surface flex items-center justify-center">
                  <span className="text-2xl font-mono font-bold text-accent-bronze">02</span>
                </div>
                <div className="pt-6">
                  <h4 className="text-xl font-display font-semibold text-verdict-text-primary mb-4">
                    Live Evaluation
                  </h4>
                  <p className="text-verdict-text-secondary leading-relaxed mb-4">
                    Real-time code execution, automated testing, and concurrent analysis by specialized AI agents.
                  </p>
                  <div className="text-xs font-mono text-verdict-text-quaternary tracking-wider">
                    PROTOCOL: CONDUCT_EVAL
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 03 */}
            <div className="relative">
              <div className="border-l-2 border-accent-bronze/30 pl-8 pb-12">
                <div className="absolute left-0 top-0 w-16 h-16 -translate-x-[31px] border-2 border-accent-bronze/40 bg-verdict-surface flex items-center justify-center">
                  <span className="text-2xl font-mono font-bold text-accent-bronze">03</span>
                </div>
                <div className="pt-6">
                  <h4 className="text-xl font-display font-semibold text-verdict-text-primary mb-4">
                    Verdict Generation
                  </h4>
                  <p className="text-verdict-text-secondary leading-relaxed mb-4">
                    Comprehensive report compilation with evidence-backed assessments and quantified performance metrics.
                  </p>
                  <div className="text-xs font-mono text-verdict-text-quaternary tracking-wider">
                    PROTOCOL: GEN_VERDICT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Institutional */}
        <footer className="border-t border-verdict-border bg-verdict-surface/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-verdict-text-tertiary">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Scale className="w-4 h-4 text-accent-bronze/60" strokeWidth={1.5} />
                <span className="font-mono tracking-wider">NEETI AI © 2026</span>
              </div>
              <div className="flex items-center space-x-1 font-mono text-xs text-verdict-text-quaternary">
                <span>EVAL_SYSTEM_v2.0.1</span>
                <span className="text-accent-bronze/40">|</span>
                <span>SECURE_PROTOCOL_ACTIVE</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
