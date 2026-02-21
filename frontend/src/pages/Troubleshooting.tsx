import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import {
  Shield,
  ChevronDown,
  Search,
  Wifi,
  Camera,
  Monitor,
  Code2,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  RefreshCw,
} from 'lucide-react';

interface TroubleshootItem {
  title: string;
  symptoms: string[];
  steps: string[];
  category: string;
  severity: 'low' | 'medium' | 'high';
}

const TROUBLESHOOT_DATA: TroubleshootItem[] = [
  {
    category: 'Connection',
    title: 'Cannot connect to the interview session',
    severity: 'high',
    symptoms: [
      'Stuck on "Connecting..." screen',
      'Session code rejected',
      '"Session not found" error',
    ],
    steps: [
      'Verify the session code is correct (case-sensitive, 8 characters).',
      'Ensure the session has been started by the recruiter and is in "active" state.',
      'Check your internet connection — try loading another website.',
      'Clear browser cache and cookies, then try again.',
      'If using a VPN, try disconnecting it — WebRTC connections can be blocked by some VPN configurations.',
      'Try a different browser (Chrome recommended).',
    ],
  },
  {
    category: 'Connection',
    title: 'Disconnected during an active session',
    severity: 'high',
    symptoms: [
      'Video/audio feed stopped',
      '"Connection lost" banner appeared',
      'Code editor became unresponsive',
    ],
    steps: [
      'Check your internet connection stability.',
      'The system preserves session state server-side — your code is safe.',
      'Try refreshing the page and re-entering the session code.',
      'If the issue persists, switch to a wired ethernet connection if possible.',
      'Contact the recruiter to confirm the session is still active.',
    ],
  },
  {
    category: 'Connection',
    title: 'WebSocket connection errors',
    severity: 'medium',
    symptoms: [
      'Real-time updates not appearing',
      'Agent status indicators stuck',
      'Console shows WebSocket errors',
    ],
    steps: [
      'Refresh the page to re-establish the WebSocket connection.',
      'Check if a firewall or proxy is blocking WebSocket connections (port 443).',
      'Disable browser extensions that might interfere (ad blockers, privacy extensions).',
      'Try in an incognito/private window to rule out extension conflicts.',
    ],
  },

  {
    category: 'Audio & Video',
    title: 'Camera not detected or not working',
    severity: 'high',
    symptoms: [
      'Black video preview',
      '"Camera access denied" error',
      'Camera dropdown is empty',
    ],
    steps: [
      'Click the camera/lock icon in your browser address bar and allow camera access.',
      'Go to browser Settings > Site Settings > Camera and ensure it is set to "Allow".',
      'Check that no other application (Zoom, Teams, etc.) is using the camera.',
      'Try selecting a different camera from the dropdown if you have multiple.',
      'On macOS: System Preferences > Security & Privacy > Camera — ensure your browser is allowed.',
      'On Windows: Settings > Privacy > Camera — ensure "Allow apps to access your camera" is on.',
      'Restart your browser completely (close all windows).',
    ],
  },
  {
    category: 'Audio & Video',
    title: 'Microphone not working or poor audio quality',
    severity: 'high',
    symptoms: [
      'Speech agent shows no audio signal',
      'Recruiter cannot hear you',
      'Audio is choppy or distorted',
    ],
    steps: [
      'Check browser permissions — click the lock icon in the address bar to allow microphone.',
      'Ensure the correct microphone is selected in the audio settings dropdown.',
      'Close other apps using the microphone (Zoom, Discord, etc.).',
      'Use a headset or external microphone for better audio quality.',
      'Check your system audio input settings — ensure the mic is not muted.',
      'If audio is choppy, try reducing background browser tabs to free up CPU.',
    ],
  },
  {
    category: 'Audio & Video',
    title: 'Screen share not working',
    severity: 'medium',
    symptoms: [
      'Screen share prompt does not appear',
      '"Screen share denied" error',
      'Shared screen appears black to others',
    ],
    steps: [
      'Use Chrome or Edge for the most reliable screen sharing experience.',
      'When the prompt appears, select "Entire Screen" for best compatibility.',
      'On macOS: System Preferences > Security & Privacy > Screen Recording — add your browser.',
      'Ensure no DRM-protected content is displayed (Netflix, etc.) as it will appear black.',
      'Try sharing a specific window instead of the entire screen.',
    ],
  },

  {
    category: 'Code Editor',
    title: 'Code execution fails or times out',
    severity: 'medium',
    symptoms: [
      '"Execution timed out" message',
      'No output returned',
      '"Runtime error" for valid code',
    ],
    steps: [
      'Check for infinite loops or excessive memory usage in your code.',
      'Execution has a default timeout (typically 10-30 seconds). Optimise long-running code.',
      'Ensure you selected the correct programming language from the language dropdown.',
      'Check for missing import statements or standard library dependencies.',
      'If the issue persists, try submitting a simple "Hello World" to verify the execution service.',
    ],
  },
  {
    category: 'Code Editor',
    title: 'Code editor not loading or unresponsive',
    severity: 'medium',
    symptoms: [
      'Editor area is blank',
      'Syntax highlighting not working',
      'Cannot type in the editor',
    ],
    steps: [
      'Refresh the page — the Monaco editor instance may need to re-initialise.',
      'Check browser console (F12) for JavaScript errors.',
      'Ensure JavaScript is enabled in your browser.',
      'Try disabling hardware acceleration: Chrome > Settings > System > "Use hardware acceleration".',
      'Clear browser cache and hard-reload (Ctrl+Shift+R / Cmd+Shift+R).',
    ],
  },

  {
    category: 'Authentication',
    title: 'Cannot log in or register',
    severity: 'high',
    symptoms: [
      '"Invalid credentials" error',
      '"Email already registered" error',
      'Login button does nothing',
    ],
    steps: [
      'Verify your email and password are correct.',
      'Check if Caps Lock is enabled.',
      'Try the "Forgot Password" flow if available.',
      'Clear cookies for the site and try again.',
      'If registering and receiving "email already registered", try logging in instead.',
      'Check your email for any verification links that may need to be confirmed first.',
    ],
  },
  {
    category: 'Authentication',
    title: 'Session expired or logged out unexpectedly',
    severity: 'low',
    symptoms: [
      'Redirected to login page',
      '"Token expired" message',
      'Dashboard shows "Unauthorized"',
    ],
    steps: [
      'This is normal security behaviour — authentication tokens have a limited lifespan.',
      'Log in again with your credentials.',
      'Ensure your system clock is accurate — token validation requires correct time.',
      'If it happens repeatedly within minutes, clear all cookies and browser data for the site.',
    ],
  },

  {
    category: 'Performance',
    title: 'Platform is slow or laggy',
    severity: 'low',
    symptoms: [
      'Pages take long to load',
      'UI animations are choppy',
      'High CPU/memory usage in browser',
    ],
    steps: [
      'Close unnecessary browser tabs and applications.',
      'Use Chrome (recommended) for the best performance.',
      'Ensure your internet connection is stable and has at least 5 Mbps upload/download.',
      'Disable unnecessary browser extensions.',
      'If video is causing lag, try reducing your camera resolution in system settings.',
      'Restart your browser to free up leaked memory.',
    ],
  },
];

const CATEGORIES = [...new Set(TROUBLESHOOT_DATA.map((item) => item.category))];

const SEVERITY_CONFIG = {
  low: { label: 'LOW', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  medium: { label: 'MED', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  high: { label: 'HIGH', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
};

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Connection: Wifi,
  'Audio & Video': Camera,
  'Code Editor': Code2,
  Authentication: Lock,
  Performance: Monitor,
};

const TroubleshootAccordion: React.FC<{
  item: TroubleshootItem;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => {
  const sev = SEVERITY_CONFIG[item.severity];
  return (
    <div className="border border-white/[0.06] rounded-md overflow-hidden transition-all duration-200 hover:border-white/[0.10]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left bg-neeti-surface/50 hover:bg-neeti-surface transition-colors"
      >
        <div className="flex items-center gap-3 pr-4">
          <span className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded ${sev.bg} ${sev.color} ${sev.border} border`}>
            {sev.label}
          </span>
          <span className="text-sm font-medium text-ink-primary">{item.title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-ink-ghost shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-bronze' : ''
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 pt-4 border-t border-white/[0.04] space-y-4">
          <div>
            <p className="text-[10px] font-mono text-ink-ghost tracking-[0.15em] uppercase mb-2">
              Symptoms
            </p>
            <ul className="space-y-1.5">
              {item.symptoms.map((symptom, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400/60 shrink-0 mt-0.5" />
                  {symptom}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-mono text-ink-ghost tracking-[0.15em] uppercase mb-2">
              Resolution Steps
            </p>
            <ol className="space-y-2">
              {item.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink-secondary">
                  <span className="text-[10px] font-mono text-bronze/60 bg-bronze/[0.08] rounded px-1.5 py-0.5 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Troubleshooting = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredItems = TROUBLESHOOT_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neeti-bg relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.012]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(194,112,42,.4) 1px,transparent 1px), linear-gradient(90deg,rgba(194,112,42,.4) 1px,transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="ambient-orb ambient-orb-bronze w-[500px] h-[500px] top-[-10%] right-[5%] z-0 opacity-55" />
      <div className="ambient-orb ambient-orb-blue w-[400px] h-[400px] bottom-[15%] left-[-5%] z-0 opacity-40" />

      <div className="relative z-10">
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

        <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
          <div className="animate-fadeUp">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-bronze/25 bg-bronze/[0.08] backdrop-blur-md rounded-full mb-6">
              <Terminal className="w-3.5 h-3.5 text-bronze" />
              <span className="text-xs font-mono text-bronze tracking-wider">
                DIAGNOSTIC GUIDE
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-display font-bold text-ink-primary leading-[1.1] tracking-tight mb-4">
              Troubleshooting
              <br />
              <span className="text-gradient-bronze">& Issue Resolution</span>
            </h1>

            <p className="text-lg text-ink-secondary leading-relaxed max-w-2xl">
              Step-by-step guides to resolve common technical issues. Each entry
              includes symptoms, severity, and a clear resolution path.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-8">
          <div className="glass-subtle p-5 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="w-4 h-4 text-bronze" />
              <span className="text-[10px] font-mono text-ink-ghost tracking-[0.2em]">
                QUICK DIAGNOSTICS
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                {
                  label: 'Browser Check',
                  detail: 'Chrome, Firefox, Edge, or Safari (latest 2 versions)',
                  icon: Monitor,
                },
                {
                  label: 'Network Check',
                  detail: 'Minimum 5 Mbps, WebSocket support required',
                  icon: Wifi,
                },
                {
                  label: 'Permissions Check',
                  detail: 'Camera + Microphone access granted',
                  icon: Shield,
                },
              ].map((check) => (
                <div
                  key={check.label}
                  className="p-3 border border-white/[0.06] rounded-md bg-neeti-surface/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <check.icon className="w-3.5 h-3.5 text-bronze" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-ink-primary">{check.label}</span>
                  </div>
                  <p className="text-[11px] text-ink-tertiary">{check.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-ghost" />
            <input
              type="text"
              placeholder="Describe your issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neeti-surface border border-neeti-border rounded-md text-sm text-ink-primary placeholder:text-ink-ghost focus:outline-none focus:border-bronze/40 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-mono tracking-wider rounded-md border transition-all duration-200 inline-flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? 'border-bronze/40 bg-bronze/[0.12] text-bronze'
                      : 'border-neeti-border bg-neeti-surface text-ink-tertiary hover:text-ink-secondary hover:border-white/[0.10]'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {cat.toUpperCase()}
                </button>
              );
            })}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-16">
          {filteredItems.length > 0 ? (
            <div className="space-y-3">
              {filteredItems.map((item, idx) => (
                <TroubleshootAccordion
                  key={idx}
                  item={item}
                  isOpen={openIndex === idx}
                  onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-ink-tertiary mb-2">No matching issues found.</p>
              <p className="text-sm text-ink-ghost">
                Try adjusting your search or{' '}
                <a
                  href="mailto:support@neeti-ai.com"
                  className="text-bronze hover:text-bronze-light transition-colors"
                >
                  contact support
                </a>{' '}
                for personalised help.
              </p>
            </div>
          )}
        </section>

        <section className="border-t border-white/[0.06] bg-white/[0.02] py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-subtle p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-bronze" />
                  <h3 className="text-base font-display font-semibold text-ink-primary">
                    Resolved?
                  </h3>
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed mb-4">
                  If your issue is resolved, you can return to the platform and
                  continue your session.
                </p>
                <Link
                  to="/dashboard"
                  className="text-sm text-bronze hover:text-bronze-light font-medium transition-colors"
                >
                  Go to Dashboard →
                </Link>
              </div>

              <div className="glass-subtle p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-base font-display font-semibold text-ink-primary">
                    Still Having Issues?
                  </h3>
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed mb-4">
                  Contact our support team with your session ID and a description
                  of the problem.
                </p>
                <a
                  href="mailto:support@neeti-ai.com"
                  className="text-sm text-bronze hover:text-bronze-light font-medium transition-colors"
                >
                  Email Support →
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Troubleshooting;
