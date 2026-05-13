import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0E14',
        'background-secondary': '#151922',
        surface: '#161B22',
        'surface-elevated': '#1F2937',
        border: '#2D3748',
        accent: '#FACC15',
        'accent-hover': '#EAB308',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
        sidebar: '#111827',
        'sidebar-border': '#1F2937',
        purple: {
          500: '#7C3AED',
          600: '#6D28D9',
          900: '#4C1D95',
        },
        casino: {
          purple: '#4C1D95',
          'purple-dark': '#1E1B4B',
        },
        sports: {
          amber: '#D97706',
          'amber-dark': '#92400E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'sidebar': '260px',
        'header': '64px',
      },
      borderRadius: {
        'card': '8px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'count-up': 'countUp 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
