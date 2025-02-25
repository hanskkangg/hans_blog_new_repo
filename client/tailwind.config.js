/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        ovo: ['Ovo', 'serif'],
        outfit: ['Outfit', 'sans-serif'],
        'league-spartan': ['League Spartan', 'sans-serif'],
    },
    
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/line-clamp'),
  ],
};
