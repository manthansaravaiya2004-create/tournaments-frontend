/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0E14',
          900: '#12161F',
          800: '#171C28',
          700: '#232939',
          600: '#323A4E',
        },
        mist: {
          400: '#7C8496',
          200: '#C4C9D4',
          100: '#E7E9EE',
        },
        signal: {
          violet: '#B285F0',
          teal: '#46E1B8',
          amber: '#F0B84E',
          red: '#F0596B',
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
    },
  },
  plugins: [],
};
