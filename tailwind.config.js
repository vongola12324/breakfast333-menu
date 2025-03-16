/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b35',
        secondary: '#f7c59f',
        accent: '#efefd0',
        textColor: '#333',
        lightText: '#666',
        backgroundColor: '#fff',
        cardBackground: '#f9f9f9',
        borderColor: '#eaeaea',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
