/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",             // ✅ Ensures all React components are included
    "./node_modules/flowbite/**/*.js",        // ✅ Added Flowbite core files
    "./node_modules/flowbite-react/**/*.js"   // ✅ Ensures Flowbite React components are included
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite')],             // ✅ Flowbite plugin for Tailwind
};
