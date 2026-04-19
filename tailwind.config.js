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
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'void-black': '#05050A',
        'deep-navy': '#0A1128',
        'electric-cyan': '#00E5FF',
        'ice-white': '#F8FAFC',
        'slate-gray': '#8B949E',
      },
    },
  },
  plugins: [],
}
