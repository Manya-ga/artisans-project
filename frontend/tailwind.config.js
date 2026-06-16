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
        primary: {
          50: '#fff5f9',
          100: '#ffe0ed',
          200: '#ffc0db',
          300: '#ff7eb3',
          400: '#ff5a9f',
          500: '#ff3d8b',
          600: '#e63976',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#e8deff',
          200: '#d4c5ff',
          300: '#b89fff',
          400: '#9d7fff',
          500: '#8e44ad',
          600: '#7c3699',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
        },
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #ff7eb3, #8e44ad)',
        'gradient-light': 'linear-gradient(135deg, #fff5f9, #f5f3ff)',
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