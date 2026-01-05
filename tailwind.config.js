/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E07A5F', // Burnt Orange / Terracotta
        secondary: '#81B29A', // Sage Green
        background: '#F4F1DE', // Cream / Off-White
        text: '#3D405B', // Dark Charcoal
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
