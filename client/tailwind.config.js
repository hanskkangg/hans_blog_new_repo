/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this includes your src folder
    "./node_modules/flowbite-react/**/*.js", // Add this line for Flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite')],
};
