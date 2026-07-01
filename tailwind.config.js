/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0A',
          secondary: '#121212',
          card: '#1F1F1F',
          elevated: '#2A2A2A',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8CC6A',
          dark: '#A88A20',
        },
        green: {
          cta: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        error: '#EF4444',
        star: '#FACC15',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        'card-lg': '20px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
        'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.4)',
      },
    },
  },
  plugins: [],
}
