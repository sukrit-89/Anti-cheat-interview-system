/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Editorial, authority-driven palette
                verdict: {
                    bg: '#0A0A0A',           // Deep black - seriousness
                    surface: '#111111',      // Elevated surface
                    'surface-elevated': '#1A1A1A', // Higher elevation
                    border: '#2A2A2A',       // Subtle borders
                    'border-strong': '#333333', // Strong borders
                    line: '#3A3A3A',         // Dividers
                    text: {
                        primary: '#F1F1F1',   // Warm white for readability
                        secondary: '#B8B8B8', // Muted gray
                        tertiary: '#888888',  // Deemphasized
                        quaternary: '#666666', // Very muted
                    }
                },
                // Semantic colors only - meaning-driven
                semantic: {
                    critical: '#B91C1C',     // Critical red - integrity violations
                    'critical-light': '#991B1B', // Darker critical
                    warning: '#92400E',      // Muted amber - flags
                    'warning-light': '#78350F', // Darker warning
                    success: '#14532D',      // Forest green - pass
                    'success-light': '#166534', // Darker success
                    neutral: '#6B7280',      // Neutral gray
                    emphasis: '#78716C',     // Stone - authority, judgment
                    'emphasis-light': '#57534E', // Darker emphasis
                },
                // Accent colors for minimal highlights
                accent: {
                    bronze: '#92400E',       // Authority bronze
                    'bronze-light': '#B45309', // Lighter bronze
                }
            },
            fontFamily: {
                // Editorial serif-sans combination - character-rich
                serif: ['"Crimson Pro"', 'Georgia', 'serif'],
                sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
                display: ['"Crimson Pro"', 'Georgia', 'serif'], // For headings
            },
            fontSize: {
                // Editorial type scale - deliberate hierarchy
                'xs': ['0.75rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
                'sm': ['0.875rem', { lineHeight: '1.5rem', letterSpacing: '0.01em' }],
                'base': ['1rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }],
                'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }],
                '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
                '5xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.03em' }],
                '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.035em' }],
            },
            borderRadius: {
                'none': '0',
                'sm': '1px',      // Sharp, deliberate
                DEFAULT: '2px',
                'md': '3px',
                'lg': '4px',
                'xl': '6px',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '92': '23rem',
                '96': '24rem',
                '100': '25rem',
                '104': '26rem',
                '108': '27rem',
                '112': '28rem',
                '116': '29rem',
                '120': '30rem',
            },
            animation: {
                'reveal-slow': 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                'reveal-slower': 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
            },
            keyframes: {
                reveal: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(8px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
            },
            boxShadow: {
                'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
                'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
                'strong': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            },
            backdropBlur: {
                'xs': '2px',
            },
        },
    },
    plugins: [],
}
