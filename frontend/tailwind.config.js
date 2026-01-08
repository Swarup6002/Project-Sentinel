/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        'surface': '#ffffff',
        'text-main': '#111111',
        'text-muted': '#666666',
      }
    },
  },
  plugins: [],
}
