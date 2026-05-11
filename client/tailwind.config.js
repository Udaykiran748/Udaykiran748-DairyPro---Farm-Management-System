/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
          400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
          800: '#166534', 900: '#14532d', 950: '#052e16'
        },
        earth: {
          50: '#fdf8f0', 100: '#faefd9', 200: '#f4dcb0', 300: '#ecc37f',
          400: '#e2a24d', 500: '#d4872b', 600: '#b86d20', 700: '#965320',
          800: '#7a4420', 900: '#63381d'
        },
        cream: '#fefdf8',
        barn: '#8B2500'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.08)',
        'card': '0 2px 20px rgba(22,163,74,0.08)',
        'glow': '0 0 30px rgba(34,197,94,0.15)'
      }
    }
  },
  plugins: []
}
