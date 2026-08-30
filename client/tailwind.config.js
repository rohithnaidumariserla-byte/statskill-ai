/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b2545',
          navyLight: '#133c55',
          blue: '#1d4ed8',
          accent: '#ea580c', // Indian saffron touch
          saffron: '#f97316',
          green: '#15803d',  // Indian emerald green touch
          gold: '#d97706',
          slate: '#0f172a',
          lightBg: '#f8fafc',
          cardBg: '#ffffff',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'gov-card': '0 4px 6px -1px rgba(11, 37, 69, 0.06), 0 2px 4px -1px rgba(11, 37, 69, 0.04)',
        'gov-hover': '0 10px 15px -3px rgba(11, 37, 69, 0.1), 0 4px 6px -2px rgba(11, 37, 69, 0.05)',
      }
    },
  },
  plugins: [],
}
