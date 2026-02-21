/**
 * Evaluation Report Page - Forensic-style technical assessment results
 * Design: Evidence-based verdict with multi-agent analysis breakdown
 */
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { EvidenceBlock } from '../components/EvidenceBlock';
import { Scale, FileText, Download, Gavel } from 'lucide-react';

// Mock data - in real app, fetch from API using evaluationId
const mockEvaluationData = {
    sessionRef: 'ARCH_009',
    protocol: 'V2.4_SECURE',
    verdict: 'QUALIFIED',
    confidence: 96.8,
    timestamp: '2024-02-17T14:30:00Z',
    candidate: {
        name: 'Alex Chen',
        email: 'alex.chen@example.com',
        experience: '5 years',
        degree: 'BS Computer Science',
        avatar: null,
    },
    agents: [
        { id: 1, name: 'Code Integrity', icon: 'code', score: 94, },
        { id: 2, name: 'Logic Flow', icon: 'account_tree', score: 98 },
        { id: 3, name: 'Architecture', icon: 'hub', score: 91 },
        { id: 4, name: 'Security', icon: 'shield', score: 97 },
        { id: 5, name: 'Efficiency', icon: 'speed', score: 95 },
    ],
    evidence: [
        {
            type: 'success' as const,
            title: 'Strong Algorithm Implementation',
            content: 'Candidate demonstrated proficiency in implementing efficient sorting and search algorithms with optimal time complexity.',
            level: 'STRENGTH',
        },
        {
            type: 'success' as const,
            title: 'Clean Code Structure',
            content: 'Code exhibits strong organizational patterns with appropriate use of functions, clear variable naming, and logical flow.',
            level: 'STRENGTH',
        },
        {
            type: 'warning' as const,
            title: 'Edge Case Handling',
            content: 'Some edge cases were not initially considered. Candidate addressed this after prompting.',
            level: 'ADVISORY',
        },
        {
            type: 'success' as const,
            title: 'Problem Solving Approach',
            content: 'Methodical approach to problem decomposition. Clear communication of thought process throughout evaluation.',
            level: 'STRENGTH',
        },
    ],
    analysis: `The candidate demonstrated strong technical proficiency across all evaluation criteria. Code quality was consistently high, with particular strength in algorithmic thinking and system design principles. Communication skills were effective, with clear articulation of tradeoffs and design decisions. Minor areas for improvement identified in edge case handling were addressed promptly when raised. Overall assessment indicates strong technical capability aligned with senior engineering expectations.`,
};

export const EvaluationReport = () => {
    const { id } = useParams<{ id: string }>();
    const data = mockEvaluationData;

    const verdictConfig = {
        QUALIFIED: {
            borderColor: 'border-green-600',
            textColor: 'text-green-500',
            label: 'VERDICT: QUALIFIED',
        },
        REJECTED: {
            borderColor: 'border-red-600',
            textColor: 'text-red-500',
            label: 'VERDICT: REJECTED',
        },
        INCONCLUSIVE: {
            borderColor: 'border-amber-600',
            textColor: 'text-amber-500',
            label: 'VERDICT: INCONCLUSIVE',
        },
    };

    const config = verdictConfig[data.verdict as keyof typeof verdictConfig];

    return (
        <div className="min-h-screen bg-background-dark">
            {/* Header */}
            <header className="w-full border-b border-border-strong bg-surface-dark px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Scale className="w-8 h-8 text-primary" strokeWidth={1.5} />
                    <div className="flex flex-col">
                        <h2 className="text-white text-lg font-bold tracking-tight uppercase">
                            Neeti AI <span className="text-slate-500 font-normal">|</span> Forensic Report
                        </h2>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                            <span>SYS_REF: {data.sessionRef}</span>
                            <span className="text-slate-600">•</span>
                            <span>PROTOCOL: {data.protocol}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
                        Export PDF
                    </Button>
                    <Button variant="primary" size="sm" icon={<Gavel className="w-4 h-4" />}>
                        Authorize Hire
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 lg:p-10 grid grid-cols-12 gap-8">
                {/* Left Column: Metrics & Evidence */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    {/* Verdict Banner */}
                    <div className={`bg-surface-dark border-l-4 ${config.borderColor} p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 shadow-lg`}>
                        <div>
                            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-1">
                                Final Determination
                            </p>
                            <h1 className={`text-4xl font-bold tracking-tight ${config.textColor}`}>
                                {config.label}
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-1">
                                Aggregate Confidence
                            </p>
                            <p className={`text-3xl font-mono font-bold ${config.textColor}`}>
                                {data.confidence}%
                            </p>
                        </div>
                    </div>

                    {/* Agent Score Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                        {data.agents.map((agent) => (
                            <div
                                key={agent.id}
                                className="bg-surface-dark border border-border-strong p-4 flex flex-col gap-3 group hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center justify-between text-slate-400">
                                    <span className="text-xl">📊</span>
                                    <span className="text-[10px] font-mono uppercase opacity-50">
                                        AGT_{agent.id.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-slate-300 text-xs uppercase font-medium tracking-wide mb-1">
                                        {agent.name}
                                    </p>
                                    <p className="text-white text-2xl font-mono font-bold">{agent.score}</p>
                                </div>
                                <div className="h-1 bg-[#222] overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${agent.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Evidence Breakdown */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-semibold text-white mb-4">
                            Evidence Breakdown
                        </h2>
                        {data.evidence.map((item, idx) => (
                            <EvidenceBlock key={idx} type={item.type} title={item.title} label={item.level}>
                                {item.content}
                            </EvidenceBlock>
                        ))}
                    </div>

                    {/* Comprehensive Analysis */}
                    <div className="bg-surface-dark border border-border-dark p-6">
                        <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Comprehensive Analysis
                        </h2>
                        <p className="text-slate-300 leading-relaxed font-serif italic text-base">
                            {data.analysis}
                        </p>
                    </div>
                </div>

                {/* Right Column: Candidate Profile */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="sticky top-24 space-y-6">
                        {/* Candidate Card */}
                        <div className="bg-surface-dark border border-border-dark p-6">
                            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">
                                Evaluated Candidate
                            </p>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary text-2xl font-bold">
                                    {data.candidate.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">{data.candidate.name}</h3>
                                    <p className="text-slate-400 text-sm font-mono">{data.candidate.email}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm border-t border-border-dark pt-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Experience</span>
                                    <span className="text-white font-medium">{data.candidate.experience}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Education</span>
                                    <span className="text-white font-medium">{data.candidate.degree}</span>
                                </div>
                            </div>
                        </div>

                        {/* Session Metadata */}
                        <div className="bg-surface-dark border border-border-dark p-6">
                            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">
                                Session Metadata
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Session ID</span>
                                    <span className="text-white font-mono text-xs">{id || 'EVAL_001'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Timestamp</span>
                                    <span className="text-white font-mono text-xs">
                                        {new Date(data.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Duration</span>
                                    <span className="text-white font-mono text-xs">54m 32s</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Link to="/dashboard">
                                <Button variant="secondary" className="w-full">
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
