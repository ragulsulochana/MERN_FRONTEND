/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'irctc-blue': '#1e40af',
        'irctc-orange': '#f97316'
      }
    },
  },
  plugins: [],
}