/**
 * Footer — Production-level site footer
 * Forensic Authority aesthetic with glass panels, bronze accents
 */
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  Shield,
  Activity,
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const PLATFORM_LINKS = [
  { label: 'How It Works', to: '/about#how-it-works' },
  { label: 'Security', to: '/about#security' },
  { label: 'Multi-Agent System', to: '/about#agents' },
  { label: 'For Recruiters', to: '/register' },
  { label: 'For Candidates', to: '/join' },
];

const RESOURCE_LINKS = [
  { label: 'FAQ', to: '/faq' },
  { label: 'Troubleshooting', to: '/troubleshooting' },
  { label: 'API Reference', to: '/about#api', external: false },
  { label: 'Documentation', href: 'https://github.com/sukrit-89/Anti-cheat-interview-system', external: true },
  { label: 'Release Notes', href: 'https://github.com/sukrit-89/Anti-cheat-interview-system/releases', external: true },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Cookie Policy', to: '/cookies' },
  { label: 'Responsible AI', to: '/about#responsible-ai' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-white/[0.08]">
      {/* Ambient gradient behind footer */}
      <div className="absolute inset-0 bg-gradient-to-t from-neeti-surface/60 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* ── Main Footer Grid ──────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Column 1 — Brand + About */}
            <div className="lg:col-span-4 space-y-5">
              <Logo size="lg" showWordmark showTagline linkTo="/" />

              <p className="text-sm text-ink-secondary leading-relaxed max-w-sm">
                Neeti AI is an evidence-based technical interview evaluation platform.
                Multi-agent AI analysis provides comprehensive, bias-aware assessments
                backed by measurable evidence and real-time code execution.
              </p>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 border border-status-success/30 bg-status-success/[0.08] rounded-full">
                  <Activity className="w-3 h-3 text-status-success" />
                  <span className="text-[10px] font-mono text-status-success tracking-wider">
                    ALL SYSTEMS OPERATIONAL
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://github.com/sukrit-89/Anti-cheat-interview-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md border border-neeti-border hover:border-bronze/40 bg-neeti-surface hover:bg-neeti-elevated text-ink-tertiary hover:text-bronze transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-md border border-neeti-border hover:border-bronze/40 bg-neeti-surface hover:bg-neeti-elevated text-ink-tertiary hover:text-bronze transition-all duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-md border border-neeti-border hover:border-bronze/40 bg-neeti-surface hover:bg-neeti-elevated text-ink-tertiary hover:text-bronze transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:support@neeti-ai.com"
                  className="p-2 rounded-md border border-neeti-border hover:border-bronze/40 bg-neeti-surface hover:bg-neeti-elevated text-ink-tertiary hover:text-bronze transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2 — Platform */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h4 className="text-[10px] font-mono text-ink-ghost tracking-[0.2em] uppercase mb-5">
                Platform
              </h4>
              <ul className="space-y-3">
                {PLATFORM_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-secondary hover:text-ink-primary hover:translate-x-0.5 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Resources */}
            <div className="lg:col-span-3">
              <h4 className="text-[10px] font-mono text-ink-ghost tracking-[0.2em] uppercase mb-5">
                Resources
              </h4>
              <ul className="space-y-3">
                {RESOURCE_LINKS.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ink-secondary hover:text-ink-primary transition-all duration-200 inline-flex items-center gap-1.5"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        to={link.to!}
                        className="text-sm text-ink-secondary hover:text-ink-primary hover:translate-x-0.5 transition-all duration-200 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Column 4 — Legal */}
            <div className="lg:col-span-3">
              <h4 className="text-[10px] font-mono text-ink-ghost tracking-[0.2em] uppercase mb-5">
                Legal
              </h4>
              <ul className="space-y-3">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-secondary hover:text-ink-primary hover:translate-x-0.5 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact Support */}
              <div className="mt-8 p-4 glass-subtle rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-bronze" />
                  <span className="text-xs font-mono text-ink-ghost tracking-wider">
                    SUPPORT
                  </span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Need help? Reach out at{' '}
                  <a
                    href="mailto:support@neeti-ai.com"
                    className="text-bronze hover:text-bronze-light transition-colors underline underline-offset-2"
                  >
                    support@neeti-ai.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ────────────────────────────────── */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-ink-ghost font-mono tracking-wider">
              <span>© {CURRENT_YEAR} Neeti AI. All rights reserved.</span>
              <span className="text-bronze/20">|</span>
              <span>EVAL_SYSTEM v2.1.0</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-ink-ghost font-mono tracking-wider">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                SECURE_PROTOCOL_ACTIVE
              </span>
              <span className="text-bronze/20">|</span>
              <Link
                to="/about"
                className="hover:text-ink-secondary transition-colors"
              >
                ABOUT
              </Link>
              <span className="text-bronze/20">|</span>
              <Link
                to="/faq"
                className="hover:text-ink-secondary transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
