/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-beige': '#F3D8C4',
        'vibrant-magenta': '#D90368',
        'dark-charcoal': '#222222',
        'deep-red': '#A30000',
      },
      fontFamily: {
        heading: ['var(--font-press-start)'],
        body: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}