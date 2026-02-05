/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Neural Precision Color System
                'neural': {
                    bg: '#0A0E1A',          // Deep charcoal background
                    surface: '#12171F',     // Card/panel surface
                    border: '#1E2736',      // Subtle borders
                    text: {
                        primary: '#FFFFFF',   // Pure white for high contrast
                        secondary: '#A8B2C1', // Muted blue-gray
                        tertiary: '#6B7A91',  // Even more muted
                    }
                },
                'accent': {
                    cyan: '#00D9FF',        // Electric cyan - active states
                    amber: '#FFB84D',       // Warm amber - alerts
                    violet: '#B794F6',      // Soft violet - AI insights
                    success: '#00FF88',     // Bright green - success
                    error: '#FF4D6D',       // Soft red - errors
                }
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
                sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                // Precise type scale
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            },
            animation: {
                'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
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
