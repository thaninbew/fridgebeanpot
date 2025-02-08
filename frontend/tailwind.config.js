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
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],

  theme: {
    extend: {
      keyframes: {
        //for the popup sliding up from the bottom
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        //for the rest of the content moving up a bit
        contentSlideUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-13vh)' },
        },
      },
      animation: {
        slideUp: 'slideUp 1s ease-out forwards',
        contentSlideUp: 'contentSlideUp 1s ease-out forwards',
      },
    },
  },
  plugins: [],
} 