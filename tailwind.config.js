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
          950: '#050912',
          900: '#080e1a',
          850: '#0c1527',
          800: '#101d36',
          700: '#182b4e',
          600: '#233c6c',
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
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.25)',
        'glow-blue': '0 0 25px rgba(37, 99, 235, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
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
