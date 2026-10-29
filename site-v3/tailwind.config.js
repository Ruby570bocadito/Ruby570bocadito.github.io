/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' }
        }
      },
      colors: {
        ink: '#0C0C0C',
        mist: '#D7E2EA',
        steel: '#646973',
        magenta: '#B600A8',
        grape: '#7621B0',
        ember: '#BE4C00'
      }
    }
  },
  plugins: []
};
