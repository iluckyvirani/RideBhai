/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F15A24',
          'orange-hover': '#d94b1a',
          'orange-light': '#FFF0EB',
          'orange-50': '#FFF5F0',
          'orange-100': '#FFE6DC',
          'orange-200': '#FFC4B0',
          'orange-500': '#F15A24',
          'orange-600': '#D94714',
          gradStart: '#FF8A00',
          gradEnd: '#E8380D',
          bg: '#FAF6EE',
          dark: '#1C1C1C',
          muted: '#6B6B6B',
          subtle: '#9E9E9E',
          card: '#FFFFFF',
          border: '#EBE5D8',
          success: '#2E9E5B',
          'success-light': '#EBF7F0',
          error: '#D64545',
          'error-light': '#FDEDED',
          accent: '#FFB800',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(28, 28, 28, 0.06)',
        'card': '0 4px 20px -2px rgba(241, 90, 36, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'featured': '0 8px 30px -4px rgba(241, 90, 36, 0.22), 0 4px 12px rgba(232, 56, 13, 0.12)',
        'glow': '0 0 25px rgba(241, 90, 36, 0.35)',
        'nav': '0 -4px 20px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
