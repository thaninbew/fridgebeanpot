/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        contentSlideUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-7vh)' },
        },
        fadeOutUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        'loading-bar': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        }
      },
      animation: {
        slideUp: 'slideUp 0.5s ease-out forwards',
        contentSlideUp: 'contentSlideUp 0.5s ease-out forwards',
        fadeOutUp: 'fadeOutUp 0.5s ease-out forwards',
        'loading-bar': 'loading-bar 2s ease-in-out'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 