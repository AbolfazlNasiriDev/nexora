/* NEXORA — Tailwind CDN theme configuration
   Loaded after the Tailwind Play CDN script on every page. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F2EFFE',
          100: '#E5DFFD',
          200: '#CCC2FA',
          300: '#AC9CF6',
          400: '#8A73F0',
          500: '#5B45E8',
          600: '#4B36D4',
          700: '#3C2AAD',
          800: '#2E2186',
          900: '#221963'
        },
        ink: '#15172B',
        page: '#F7F8FC',
        line: '#E8EAF2',
        muted: '#777C8C',
        sale: '#EF4444',
        success: '#16A34A',
        premium: '#F5B301'
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 8px 30px -12px rgba(21,23,43,.12)',
        card: '0 20px 45px -24px rgba(21,23,43,.28)',
        glow: '0 18px 40px -16px rgba(91,69,232,.65)'
      },
      maxWidth: { shell: '1280px' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(.9)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(-200%)' }
        }
      },
      animation: {
        'fade-up': 'fade-up .5s ease both',
        float: 'float 6s ease-in-out infinite',
        'bounce-in': 'bounce-in .35s ease both',
        shimmer: 'shimmer 1.6s infinite'
      }
    }
  }
};
