import React from 'react';
import { clsx } from 'clsx';

interface TechnicalBlueprintProps {
    className?: string;
    showScanLine?: boolean;
}

export const TechnicalBlueprint: React.FC<TechnicalBlueprintProps> = ({
    className,
    showScanLine = true,
}) => {
    return (
        <div className={clsx('relative technical-grid bg-background-dark p-8 border border-border-dark corner-brackets', className)}>
            {showScanLine && <div className="scan-line absolute top-0 left-0 w-full h-px opacity-30" />}

            {/* Technical Schematic Content */}
            <div className="space-y-6 relative z-10">
                {/* Corner Annotations */}
                <div className="flex justify-between items-start text-[10px] font-mono text-text-muted uppercase tracking-wide">
                    <span>SYS_STATUS: MONITORING</span>
                    <span>INTEGRITY PROTOCOL</span>
                </div>

                {/* Center Visual - Bar Chart Demo */}
                <div className="flex items-end justify-center gap-2 h-32">
                    {[40, 75, 60, 90, 55, 85, 70].map((height, i) => (
                        <div
                            key={i}
                            className="w-8 bg-primary/30 border border-primary/50 relative"
                            style={{ height: `${height}%` }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                        </div>
                    ))}
                </div>

                {/* Progress Bars with Labels */}
                <div className="space-y-3">
                    {[
                        { label: 'CODE_INTEGRITY', value: 87 },
                        { label: 'LOGIC_ANALYSIS', value: 92 },
                        { label: 'SECURITY_SCAN', value: 78 },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-[10px] font-mono mb-1">
                                <span className="text-text-muted">{item.label}</span>
                                <span className="text-primary font-bold">{item.value}%</span>
                            </div>
                            <div className="w-full h-1 bg-border-dark">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${item.value}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Annotations */}
                <div className="flex justify-between items-end text-[10px] font-mono text-text-muted">
                    <span>V2.0.1</span>
                    <span className="uppercase">Real-time Analysis</span>
                </div>
            </div>
        </div>
    );
};
