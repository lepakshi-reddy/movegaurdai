/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#080808',
          900: '#111111',
          850: '#171717',
          800: '#202020',
          700: '#2a2a2a',
          600: '#3a3a3a',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          accent: '#00f0ff',
        },
        electric: {
          blue: '#2563eb',
          cyan: '#00e5ff',
          glow: 'rgba(0, 229, 255, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(255, 255, 255, 0.14)',
        'glow-blue': '0 0 25px rgba(255, 255, 255, 0.12)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.5s infinite ease-in-out',
        'scan': 'scan 3s infinite linear',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        'scan': {
          '0%': { top: '10%' },
          '50%': { top: '85%' },
          '100%': { top: '10%' },
        }
      }
    },
  },
  plugins: [],
}
