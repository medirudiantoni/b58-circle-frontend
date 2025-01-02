/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          100: '#d6d6d6',
          200: '#909090',
          300: '#7a7a7a',
          400: '#5f5f5f',
          500: '#3f3f3f',
          600: '#2b2b2b',
          700: '#262626',
          800: '#1d1d1d',
          900: '#121212',
        },
      },
    },
  },
  plugins: [],
};
