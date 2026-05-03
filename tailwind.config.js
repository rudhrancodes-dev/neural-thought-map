/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      colors: {
        cyber: {
          bg:      '#050510',
          panel:   '#080818',
          border:  '#1a1a3a',
          cyan:    '#00e5ff',
          purple:  '#b388ff',
          green:   '#69ff47',
          orange:  '#ff6e40',
          text:    '#c0c0d0',
          dim:     '#3a3a5a',
        },
      },
      animation: {
        pulse_slow: 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        flicker: 'flicker 4s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: 1 },
          '92%':     { opacity: 1 },
          '93%':     { opacity: 0.6 },
          '94%':     { opacity: 1 },
          '96%':     { opacity: 0.8 },
          '97%':     { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
