module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        ovo: ['Ovo', 'serif'], 
        
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'), 
    require('flowbite/plugin')
    
  ],
};
