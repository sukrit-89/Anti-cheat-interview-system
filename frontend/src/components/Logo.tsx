import React from 'react';
import { clsx } from 'clsx';

/**
 * Neeti AI Logo — Indic-inspired geometric mark
 *
 * The form is a stylised dharma-chakra (wheel of law/ethics) merged with
 * balanced scales — representing नीति (ethical judgment).  Eight spokes
 * invoke the Ashoka Chakra, the central node anchors balance, and the
 * outer ring references the cyclical nature of evaluation.
 *
 * Colour: bronze accent by default, inherits currentColor via `inherit`.
 */

interface LogoProps {
  /** sm = 24px, md = 32px, lg = 48px, xl = 64px, 2xl = 96px */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Override with any colour — use 'inherit' to follow parent text-color */
  color?: string;
  /** Show the wordmark beside the mark */
  showWordmark?: boolean;
  /** Add the Devanagari tagline */
  showTagline?: boolean;
  className?: string;
}

const SIZE_MAP = { sm: 24, md: 32, lg: 48, xl: 64, '2xl': 96 } as const;

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  color,
  showWordmark = false,
  showTagline = false,
  className,
}) => {
  const s = SIZE_MAP[size];
  const fill = color || '#D4873F';

  return (
    <div className={clsx('inline-flex items-center gap-3', className)}>
      {/* ── Mark ───────────────────────────────────── */}
      <svg
        width={s}
        height={s}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Neeti AI logo"
        className="shrink-0"
      >
        {/* Glow filter */}
        <defs>
          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bronze-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E09848" />
            <stop offset="50%" stopColor="#D4873F" />
            <stop offset="100%" stopColor="#B06A28" />
          </linearGradient>
        </defs>

        {/* Outer Chakra ring */}
        <circle
          cx="32"
          cy="32"
          r="29"
          stroke="url(#bronze-grad)"
          strokeWidth="1.8"
          fill="none"
          opacity="0.6"
        />

        {/* Inner Chakra ring */}
        <circle
          cx="32"
          cy="32"
          r="22"
          stroke="url(#bronze-grad)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.35"
        />

        {/* 8 Spokes — Ashoka Chakra inspired */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = 32 + 10 * Math.cos(angle);
          const y1 = 32 + 10 * Math.sin(angle);
          const x2 = 32 + 28 * Math.cos(angle);
          const y2 = 32 + 28 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={fill}
              strokeWidth={i % 2 === 0 ? '1.4' : '0.8'}
              opacity={i % 2 === 0 ? 0.7 : 0.35}
              strokeLinecap="round"
            />
          );
        })}

        {/* Central balance / node — scales motif */}
        <circle
          cx="32"
          cy="32"
          r="7"
          fill="none"
          stroke="url(#bronze-grad)"
          strokeWidth="1.6"
        />

        {/* Balance beam */}
        <line x1="22" y1="32" x2="42" y2="32" stroke={fill} strokeWidth="1.6" strokeLinecap="round" />

        {/* Left scale pan */}
        <path
          d="M24 32 L22 36 L26 36 Z"
          fill={fill}
          opacity="0.8"
        />

        {/* Right scale pan */}
        <path
          d="M40 32 L38 36 L42 36 Z"
          fill={fill}
          opacity="0.8"
        />

        {/* Centre dot — pivot */}
        <circle cx="32" cy="32" r="2.2" fill={fill} />

        {/* Small accent dots at cardinal spokes */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <circle
              key={deg}
              cx={32 + 29 * Math.cos(rad)}
              cy={32 + 29 * Math.sin(rad)}
              r="1.8"
              fill={fill}
              opacity="0.7"
            />
          );
        })}
      </svg>

      {/* ── Wordmark ───────────────────────────────── */}
      {showWordmark && (
        <div className="leading-none select-none">
          <span
            className="font-display font-bold tracking-tight text-ink-primary"
            style={{ fontSize: s * 0.65 }}
          >
            Neeti
            <span className="text-bronze ml-0.5" style={{ fontSize: s * 0.5 }}>
              AI
            </span>
          </span>
          {showTagline && (
            <p
              className="font-mono text-ink-ghost tracking-[0.2em] mt-0.5"
              style={{ fontSize: Math.max(8, s * 0.2) }}
            >
              नीति · EVALUATION AUTHORITY
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
