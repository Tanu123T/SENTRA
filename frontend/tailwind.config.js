/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sentra: {
          bg: '#080D13',
          card: '#0D151E',
          panel: '#111C27',
          border: '#243342',
          text: {
            primary: '#E8EEF5',
            secondary: '#91A0B3',
            muted: '#5A6E85',
          },
          amber: '#F59E0B',
          red: '#EF4444',
          orange: '#F97316',
          green: '#22C55E',
          blue: '#38BDF8',
          indigo: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
