/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        pink: {
          50: '#fff8f1',
          100: '#ffeed6',
          200: '#ffd4a8',
          300: '#ffb571',
          400: '#ff8c3a',
          500: '#fa690a', // Saffron / Terracotta
          600: '#eb5200',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Teal / Jade
          600: '#0d9488',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
        },
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #fa690a, #14b8a6)',
        'gradient-light': 'linear-gradient(135deg, #fff8f1, #f0fdfa)',
      },
      boxShadow: {
        'soft': '0 8px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'elevated': '0 12px 28px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}