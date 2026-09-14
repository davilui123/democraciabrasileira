/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // FASE 3 — Central de Governo
        bg: '#080D14',
        panel: '#0E1621',
        card: '#131E2B',
        border: '#263446',
        text: '#E7EDF5',
        muted: '#8B9AAF',
        primary: '#17806A',
        'primary-hover': '#1B947B',
        warning: '#D5A246',
        danger: '#D35C67',
        critical: '#D35C67',
        info: '#5792C8',
        success: '#43AE83',
        chart: '#5792C8',
        ink: '#05080D',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        fadeIn: 'fadeIn .28s ease-out forwards',
        slideInRight: 'slideInRight .28s ease-out forwards',
        slideInLeft: 'slideInLeft .28s ease-out forwards',
        slideInUp: 'slideInUp .28s ease-out forwards',
        slideInDown: 'slideInDown .28s ease-out forwards',
        scaleIn: 'scaleIn .18s ease-out forwards',
        'pulse-soft': 'pulseSoft 2.2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          from: { opacity: '0', transform: 'translateY(-24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(.975)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '.72' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0,0,0,.18)',
        'elevation-2': '0 8px 20px rgba(0,0,0,.15)',
        'elevation-3': '0 14px 34px rgba(0,0,0,.20)',
        'elevation-4': '0 22px 52px rgba(0,0,0,.28)',
        'elevation-5': '0 32px 72px rgba(0,0,0,.34)',
        'glow-primary': '0 0 0 1px rgba(23,128,106,.24), 0 14px 36px rgba(0,0,0,.22)',
        'glow-success': '0 0 24px rgba(67,174,131,.20)',
        'glow-warning': '0 0 24px rgba(213,162,70,.20)',
        'glow-danger': '0 0 24px rgba(211,92,103,.20)',
      },
    },
  },
  plugins: [],
};
