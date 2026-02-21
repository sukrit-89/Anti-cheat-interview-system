/**
 * About Page — Neeti AI platform overview
 * Forensic Authority aesthetic with detailed sections
 */
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import {
  Shield,
  Brain,
  Code2,
  Mic,
  Eye,
  Scale,
  FileCheck,
  Lock,
  Zap,
  Server,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const AGENTS = [
  {
    icon: Code2,
    name: 'Coding Agent',
    desc: 'Evaluates code quality, complexity, correctness, and efficiency in real-time across 50+ programming languages using Judge0 integration.',
    tag: 'AGENT_CODE',
  },
  {
    icon: Brain,
    name: 'Reasoning Agent',
    desc: 'Analyses problem-solving approach, algorithmic thinking, edge-case handling, and logical reasoning patterns during live sessions.',
    tag: 'AGENT_REASON',
  },
  {
    icon: Mic,
    name: 'Speech Agent',
    desc: 'Processes real-time audio for communication clarity, technical articulation, and explanation quality via LiveKit integration.',
    tag: 'AGENT_SPEECH',
  },
  {
    icon: Eye,
    name: 'Vision Agent',
    desc: 'Monitors candidate behaviour through video analysis, detecting attention patterns, screen engagement, and environmental context.',
    tag: 'AGENT_VISION',
  },
  {
    icon: Scale,
    name: 'Evaluation Agent',
    desc: 'Aggregates signals from all agents, applies weighted scoring rubrics, and generates comprehensive evidence-backed verdicts.',
    tag: 'AGENT_EVAL',
  },
];

const SECURITY_FEATURES = [
  'End-to-end encrypted sessions via WebRTC/LiveKit',
  'JWT-based authentication with refresh token rotation',
  'Role-based access control (recruiter / candidate)',
  'Supabase Row Level Security (RLS) on all tables',
  'CORS-restricted API endpoints',
  'Rate-limited authentication and session creation',
  'Compliance-ready audit trails with full evidence logging',
  'No candidate PII stored beyond session scope',
];

const TECH_STACK = [
  { name: 'FastAPI', desc: 'High-performance async Python backend', icon: Server },
  { name: 'React + TypeScript', desc: 'Type-safe reactive frontend', icon: Code2 },
  { name: 'Supabase', desc: 'PostgreSQL database with RLS', icon: Lock },
  { name: 'LiveKit', desc: 'Real-time audio/video infrastructure', icon: Mic },
  { name: 'Judge0', desc: 'Sandboxed code execution engine', icon: Zap },
  { name: 'Celery + Redis', desc: 'Distributed task queue', icon: BarChart3 },
];

export const About = () => {
  return (
    <div className="min-h-screen bg-neeti-bg relative overflow-hidden">
      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.012]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(194,112,42,.4) 1px,transparent 1px), linear-gradient(90deg,rgba(194,112,42,.4) 1px,transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="relative z-10">
        {/* ── Header ───────────────────────────────────── */}
        <header className="glass-header sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Logo size="md" showWordmark linkTo="/" />
            <Link
              to="/login"
              className="px-5 py-2 border border-neeti-border hover:border-bronze/50 bg-neeti-elevated text-ink-primary text-sm font-medium rounded-md transition-all duration-200 hover:shadow-glow"
            >
              Access System
            </Link>
          </div>
        </header>

        {/* ── Hero / Intro ─────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="max-w-3xl animate-fadeUp">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-bronze/25 bg-bronze/[0.08] backdrop-blur-md rounded-full mb-6">
              <Shield className="w-3.5 h-3.5 text-bronze" />
              <span className="text-xs font-mono text-bronze tracking-wider">
                ABOUT NEETI AI
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-display font-bold text-ink-primary leading-[1.1] tracking-tight mb-6">
              Evidence-Based Technical
              <br />
              <span className="text-gradient-bronze">Interview Intelligence</span>
            </h1>

            <p className="text-lg text-ink-secondary leading-relaxed mb-4">
              Neeti AI (from Sanskrit नीति — ethics, judgment, policy) is an
              AI-powered technical interview platform that replaces subjective
              evaluation with measurable, evidence-backed assessments.
            </p>

            <p className="text-base text-ink-tertiary leading-relaxed">
              Built for engineering teams that demand fairness, rigour, and
              transparency in their hiring process. Every assessment is backed by
              quantified evidence from multiple specialised AI agents working in
              concert.
            </p>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────── */}
        <section id="how-it-works" className="border-y border-white/[0.06] bg-white/[0.02] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-ink-primary mb-3">
                How It Works
              </h2>
              <p className="text-ink-secondary max-w-2xl mx-auto">
                A three-phase protocol designed for comprehensive, fair, and
                repeatable technical evaluation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  num: '01',
                  title: 'Configure & Invite',
                  desc: 'Recruiters create a session by selecting programming languages, difficulty level, and assessment criteria. A unique session code and join link are generated for the candidate.',
                  tag: 'PHASE_INIT',
                },
                {
                  num: '02',
                  title: 'Live Assessment',
                  desc: 'The candidate codes in a real-time editor with immediate execution. AI agents simultaneously analyse code quality, reasoning approach, communication, and behaviour.',
                  tag: 'PHASE_EVAL',
                },
                {
                  num: '03',
                  title: 'Verdict & Report',
                  desc: 'All agent signals are aggregated into a weighted score. A detailed report with evidence blocks, per-metric breakdowns, and a final recommendation is generated.',
                  tag: 'PHASE_VERDICT',
                },
              ].map((phase) => (
                <div key={phase.num} className="glass-subtle p-8 group">
                  <div className="text-3xl font-mono font-bold text-bronze/40 mb-4">
                    {phase.num}
                  </div>
                  <h3 className="text-lg font-display font-semibold text-ink-primary mb-3">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed mb-4">
                    {phase.desc}
                  </p>
                  <span className="text-[10px] font-mono text-ink-ghost tracking-[0.15em]">
                    {phase.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Multi-Agent System ───────────────────────── */}
        <section id="agents" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-ink-primary mb-3">
              Multi-Agent Architecture
            </h2>
            <p className="text-ink-secondary max-w-2xl mx-auto">
              Five specialised AI agents work concurrently during each session,
              each contributing a unique evaluation dimension.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENTS.map((agent) => (
              <div key={agent.tag} className="glass-subtle p-6 group hover:bg-white/[0.06] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-bronze/[0.08] flex items-center justify-center group-hover:bg-bronze/[0.14] transition-colors">
                    <agent.icon className="w-5 h-5 text-bronze" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-semibold text-ink-primary">
                      {agent.name}
                    </h4>
                    <span className="text-[9px] font-mono text-ink-ghost tracking-[0.15em]">
                      {agent.tag}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  {agent.desc}
                </p>
              </div>
            ))}

            {/* CTA card */}
            <div className="glass-bronze p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-display font-semibold text-ink-primary mb-2">
                  See It In Action
                </h4>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  Create a free evaluation session to experience the multi-agent
                  system live.
                </p>
              </div>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 text-sm text-bronze hover:text-bronze-light font-medium transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Security ─────────────────────────────────── */}
        <section id="security" className="border-y border-white/[0.06] bg-white/[0.02] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl font-display font-bold text-ink-primary mb-3">
                  Security & Compliance
                </h2>
                <p className="text-ink-secondary mb-8 max-w-lg">
                  Built with enterprise-grade security from the ground up.
                  Every layer of the stack is designed to protect candidate data
                  and ensure assessment integrity.
                </p>

                <div className="glass-subtle p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-4 h-4 text-bronze" />
                    <span className="text-[10px] font-mono text-ink-ghost tracking-[0.2em]">
                      SECURITY POSTURE
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {SECURITY_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-bronze shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-sm text-ink-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-display font-semibold text-ink-primary mb-4">
                  Technology Stack
                </h3>
                {TECH_STACK.map((tech) => (
                  <div key={tech.name} className="glass-subtle p-4 flex items-center gap-4 group hover:bg-white/[0.06] transition-all duration-300">
                    <div className="w-9 h-9 rounded-md bg-bronze/[0.08] flex items-center justify-center shrink-0">
                      <tech.icon className="w-4.5 h-4.5 text-bronze" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-ink-primary">{tech.name}</h4>
                      <p className="text-xs text-ink-tertiary">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Responsible AI ───────────────────────────── */}
        <section id="responsible-ai" className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-ink-primary mb-3">
              Responsible AI Commitment
            </h2>
            <p className="text-ink-secondary leading-relaxed mb-8">
              Neeti AI is committed to ethical AI practices in hiring. Our
              evaluation system is designed to reduce bias, not introduce it.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 text-left">
              {[
                {
                  icon: Scale,
                  title: 'Bias Mitigation',
                  desc: 'Assessments focus exclusively on demonstrated technical competency, not demographics, background, or presentation style.',
                },
                {
                  icon: FileCheck,
                  title: 'Transparent Scoring',
                  desc: 'Every score is accompanied by evidence blocks showing exactly what was measured and how each metric was derived.',
                },
                {
                  icon: Users,
                  title: 'Human Oversight',
                  desc: 'AI-generated verdicts are recommendations, not final decisions. Recruiters retain full control over hiring outcomes.',
                },
              ].map((item) => (
                <div key={item.title} className="glass-subtle p-6">
                  <item.icon className="w-5 h-5 text-bronze mb-3" strokeWidth={1.5} />
                  <h4 className="text-sm font-display font-semibold text-ink-primary mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="border-t border-white/[0.06] bg-white/[0.02] py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-display font-bold text-ink-primary mb-4">
              Ready to Elevate Your Technical Hiring?
            </h2>
            <p className="text-ink-secondary mb-8 max-w-lg mx-auto">
              Start running evidence-based technical assessments in minutes.
              No complex setup required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register">
                <button className="px-8 py-3.5 bg-bronze hover:bg-bronze-light text-white font-medium rounded-md transition-all duration-200 flex items-center gap-2 shadow-glow hover:shadow-glow-strong">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/faq">
                <button className="px-8 py-3.5 border border-neeti-border hover:border-bronze/40 bg-neeti-surface text-ink-primary font-medium rounded-md transition-all duration-200">
                  View FAQ
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default About;
