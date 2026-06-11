export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '8xl':  ['6rem',   { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl':  ['8rem',   { lineHeight: '1', letterSpacing: '-0.05em' }],
        '10xl': ['10rem',  { lineHeight: '0.95', letterSpacing: '-0.05em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter:  '-0.04em',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'scroll-cue': 'scrollCue 2s ease-in-out infinite',
        'ticker':     'ticker 32s linear infinite',
      },
      keyframes: {
        scrollCue: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%':       { transform: 'translateY(8px)', opacity: '1' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: []
}
