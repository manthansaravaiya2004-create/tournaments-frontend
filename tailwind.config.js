/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'var(--color-ink-950)',
          900: 'var(--color-ink-900)',
          800: 'var(--color-ink-800)',
          700: 'var(--color-ink-700)',
          600: 'var(--color-ink-600)',
        },
        mist: {
          400: 'var(--color-mist-400)',
          200: 'var(--color-mist-200)',
          100: 'var(--color-mist-100)',
        },
        signal: {
          violet: 'var(--color-signal-violet)',
          teal: 'var(--color-signal-teal)',
          amber: 'var(--color-signal-amber)',
          red: 'var(--color-signal-red)',
          lime: 'var(--color-signal-lime)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(180deg, rgba(178,133,240,0.08) 0%, rgba(11,14,20,0) 60%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        slideUp: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeIn: 'fadeIn 1s ease-out forwards',
      }
    },
  },
  plugins: [],
};
