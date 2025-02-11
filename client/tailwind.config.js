/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  darkMode: 'class', // ✅ Enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [require('flowbite')],
};
