/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Serious, restrained palette - semantic only
                verdict: {
                    bg: '#0D0D0D',           // Near black
                    surface: '#1A1A1A',      // Elevated surface
                    border: '#2A2A2A',       // Subtle borders
                    line: '#3A3A3A',         // Dividers
                    text: {
                        primary: '#F5F5F5',   // Off-white for readability
                        secondary: '#A0A0A0', // Muted gray
                        tertiary: '#707070',  // Deemphasized
                    }
                },
                // Semantic colors only
                semantic: {
                    critical: '#C41E3A',     // Dark red - integrity violations
                    warning: '#C17817',      // Muted gold - flags
                    success: '#1F7A1F',      // Forest green - pass
                    neutral: '#5A5A5A',      // Neutral gray
                    emphasis: '#8B7355',     // Muted bronze - authority
                }
            },
            fontFamily: {
                // Editorial serif-sans combination
                serif: ['"Crimson Pro"', 'Georgia', 'serif'],
                sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
            },
            fontSize: {
                // Editorial type scale
                'xs': ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.01em' }],
                'sm': ['0.875rem', { lineHeight: '1.375rem', letterSpacing: '0' }],
                'base': ['1rem', { lineHeight: '1.625rem', letterSpacing: '0' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
                'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }],
                '2xl': ['1.5rem', { lineHeight: '2.125rem', letterSpacing: '-0.02em' }],
                '3xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.02em' }],
                '4xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.03em' }],
                '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.03em' }],
            },
            borderRadius: {
                'none': '0',
                'sm': '2px',      // Sharp, deliberate
                DEFAULT: '3px',
                'md': '4px',
                'lg': '6px',
            },
            animation: {
                'reveal': 'reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            },
            keyframes: {
                reveal: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            backgroundImage: {
                'neural-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300D9FF' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            },
        },
    },
    plugins: [],
}
