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
    <div
      className={clsx(
        'relative bg-neeti-surface/50 p-8 border border-neeti-border rounded-lg corner-brackets overflow-hidden',
        className
      )}
    >
      {showScanLine && (
        <div className="scan-line absolute top-0 left-0 w-full h-px opacity-20" />
      )}

      <div className="space-y-6 relative z-10">
        {/* Header annotations */}
        <div className="flex justify-between items-start text-[10px] font-mono text-ink-ghost uppercase tracking-widest">
          <span>SYS_STATUS: MONITORING</span>
          <span>NEETI PROTOCOL</span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end justify-center gap-2 h-32">
          {[40, 75, 60, 90, 55, 85, 70].map((height, i) => (
            <div
              key={i}
              className="w-8 bg-bronze/20 border border-bronze/30 relative transition-all duration-500"
              style={{ height: `${height}%` }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-bronze" />
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div className="space-y-3">
          {[
            { label: 'CODE_INTEGRITY', value: 87 },
            { label: 'LOGIC_ANALYSIS', value: 92 },
            { label: 'SECURITY_SCAN', value: 78 },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-ink-ghost">{item.label}</span>
                <span className="text-bronze font-bold">{item.value}%</span>
              </div>
              <div className="w-full h-0.5 bg-neeti-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-bronze rounded-full transition-all duration-700"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer annotations */}
        <div className="flex justify-between items-end text-[10px] font-mono text-ink-ghost">
          <span>V2.1.0</span>
          <span className="uppercase">Real-time Analysis</span>
        </div>
      </div>
    </div>
  );
};
