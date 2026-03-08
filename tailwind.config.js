/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C8102E',
        'primary-dark': '#A00D24',
        accent: '#F5A623',
        background: '#F3F4F6',
        surface: '#FFFFFF',
        'text-primary': '#1F2937',
        'text-muted': '#6B7280',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
}
