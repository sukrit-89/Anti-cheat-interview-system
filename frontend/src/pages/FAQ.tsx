/**
 * FAQ Page — Frequently Asked Questions
 * Accordion-style expandable Q&A with forensic authority aesthetic
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { Shield, ChevronDown, Search, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  // General
  {
    category: 'General',
    question: 'What is Neeti AI?',
    answer:
      'Neeti AI is an AI-powered technical interview evaluation platform that provides evidence-based assessments. It uses multiple specialised AI agents to analyse code quality, reasoning, communication, and behaviour during live technical interviews.',
  },
  {
    category: 'General',
    question: 'What does "Neeti" mean?',
    answer:
      'Neeti (नीति) is a Sanskrit word meaning ethics, judgment, or policy. It reflects our commitment to fair, transparent, and evidence-based technical evaluation.',
  },
  {
    category: 'General',
    question: 'Who is Neeti AI designed for?',
    answer:
      'Neeti AI is designed for engineering teams, technical recruiters, and hiring managers who want to conduct fair, rigorous, and repeatable technical assessments. Candidates benefit from structured, bias-aware evaluation.',
  },

  // For Recruiters
  {
    category: 'For Recruiters',
    question: 'How do I create a technical assessment session?',
    answer:
      'After registering as a recruiter, navigate to your dashboard and click "Create Session". Configure the programming languages, difficulty level, and assessment criteria. A unique session code will be generated that you can share with candidates.',
  },
  {
    category: 'For Recruiters',
    question: 'Can I monitor sessions in real-time?',
    answer:
      'Yes. Recruiters can observe live sessions through the Session Monitor view, which shows real-time code changes, agent analysis progress, and interim evaluation signals without interfering with the candidate.',
  },
  {
    category: 'For Recruiters',
    question: 'How is the final score calculated?',
    answer:
      'The Evaluation Agent aggregates signals from all five AI agents (Coding, Reasoning, Speech, Vision, Evaluation) using weighted scoring rubrics. Each metric is backed by evidence blocks showing exactly what was measured.',
  },
  {
    category: 'For Recruiters',
    question: 'Can I customise the evaluation criteria?',
    answer:
      'Yes. When creating a session, you can adjust the weight of different evaluation dimensions, select specific programming languages, and set difficulty parameters to match the role requirements.',
  },

  // For Candidates
  {
    category: 'For Candidates',
    question: 'How do I join an interview session?',
    answer:
      'You will receive a session code or join link from the recruiter. Navigate to the Join page, enter the code, and grant the necessary permissions (camera, microphone, screen) when prompted.',
  },
  {
    category: 'For Candidates',
    question: 'What programming languages are supported?',
    answer:
      'Neeti AI supports 50+ programming languages through its Judge0 integration, including Python, JavaScript, TypeScript, Java, C++, Go, Rust, Ruby, and many more.',
  },
  {
    category: 'For Candidates',
    question: 'Is my camera and audio always recorded?',
    answer:
      'Audio and video are processed in real-time by AI agents during the session for evaluation purposes. No raw video or audio recordings are stored beyond the session. Only the AI-generated analysis and metrics are retained.',
  },
  {
    category: 'For Candidates',
    question: 'Can I use my own IDE or code editor?',
    answer:
      'The assessment uses the built-in Monaco Editor (the same editor powering VS Code) for a consistent, fair evaluation environment. External IDEs are not supported during assessments.',
  },

  // Technical
  {
    category: 'Technical',
    question: 'What happens if I lose internet connection during a session?',
    answer:
      'The system maintains session state server-side. If you reconnect within a reasonable window, your code and progress are preserved. The evaluation will account for any disconnection periods.',
  },
  {
    category: 'Technical',
    question: 'How secure is the platform?',
    answer:
      'Neeti AI uses end-to-end encryption via WebRTC/LiveKit, JWT-based authentication with token rotation, Supabase Row Level Security, rate limiting, and CORS restrictions. See our Security page for full details.',
  },
  {
    category: 'Technical',
    question: 'What browsers are supported?',
    answer:
      'Neeti AI works best on Chrome, Firefox, Edge, and Safari (latest 2 versions). WebRTC support is required for audio/video features. We recommend Chrome for the best experience.',
  },
  {
    category: 'Technical',
    question: 'Is there an API available?',
    answer:
      'Yes. Neeti AI exposes a RESTful API built on FastAPI with comprehensive OpenAPI documentation. Contact our team for API access and integration support.',
  },

  // Billing & Support
  {
    category: 'Billing & Support',
    question: 'Is Neeti AI free to use?',
    answer:
      'Neeti AI offers a free tier for evaluation purposes. For production usage and enterprise features, contact our team for pricing information.',
  },
  {
    category: 'Billing & Support',
    question: 'How do I get support?',
    answer:
      'Reach out to support@neeti-ai.com for technical support. For common issues, check the Troubleshooting page. We also maintain documentation on GitHub.',
  },
];

const CATEGORIES = [...new Set(FAQ_DATA.map((item) => item.category))];

const FAQAccordion: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle,
}) => (
  <div className="border border-white/[0.06] rounded-md overflow-hidden transition-all duration-200 hover:border-white/[0.10]">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 text-left bg-neeti-surface/50 hover:bg-neeti-surface transition-colors"
    >
      <span className="text-sm font-medium text-ink-primary pr-4">{item.question}</span>
      <ChevronDown
        className={`w-4 h-4 text-ink-ghost shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-bronze' : ''
        }`}
      />
    </button>
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="px-5 pb-5 pt-2 text-sm text-ink-secondary leading-relaxed border-t border-white/[0.04]">
        {item.answer}
      </div>
    </div>
  </div>
);

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

        {/* ── Hero ─────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
          <div className="animate-fadeUp">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-bronze/25 bg-bronze/[0.08] backdrop-blur-md rounded-full mb-6">
              <Shield className="w-3.5 h-3.5 text-bronze" />
              <span className="text-xs font-mono text-bronze tracking-wider">
                KNOWLEDGE BASE
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-display font-bold text-ink-primary leading-[1.1] tracking-tight mb-4">
              Frequently Asked
              <br />
              <span className="text-gradient-bronze">Questions</span>
            </h1>

            <p className="text-lg text-ink-secondary leading-relaxed max-w-2xl">
              Find answers to common questions about the Neeti AI platform, setup,
              assessment process, and troubleshooting.
            </p>
          </div>
        </section>

        {/* ── Search + Filters ─────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-ghost" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neeti-surface border border-neeti-border rounded-md text-sm text-ink-primary placeholder:text-ink-ghost focus:outline-none focus:border-bronze/40 transition-colors"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-mono tracking-wider rounded-md border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'border-bronze/40 bg-bronze/[0.12] text-bronze'
                    : 'border-neeti-border bg-neeti-surface text-ink-tertiary hover:text-ink-secondary hover:border-white/[0.10]'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* ── FAQ List ─────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-3">
              {filteredFAQs.map((item, idx) => (
                <FAQAccordion
                  key={idx}
                  item={item}
                  isOpen={openIndex === idx}
                  onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-ink-tertiary mb-2">No matching questions found.</p>
              <p className="text-sm text-ink-ghost">
                Try adjusting your search or{' '}
                <a
                  href="mailto:support@neeti-ai.com"
                  className="text-bronze hover:text-bronze-light transition-colors"
                >
                  contact support
                </a>
                .
              </p>
            </div>
          )}
        </section>

        {/* ── Still Need Help ──────────────────────────── */}
        <section className="border-t border-white/[0.06] bg-white/[0.02] py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-display font-bold text-ink-primary mb-3">
              Still Have Questions?
            </h2>
            <p className="text-ink-secondary mb-6 max-w-md mx-auto">
              Check our troubleshooting guide for technical issues, or reach
              out to our support team directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/troubleshooting">
                <button className="px-6 py-3 bg-bronze hover:bg-bronze-light text-white font-medium rounded-md transition-all duration-200 flex items-center gap-2 shadow-glow">
                  Troubleshooting Guide
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="mailto:support@neeti-ai.com">
                <button className="px-6 py-3 border border-neeti-border hover:border-bronze/40 bg-neeti-surface text-ink-primary font-medium rounded-md transition-all duration-200">
                  Contact Support
                </button>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default FAQ;
