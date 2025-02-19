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
        
        outfit: ['Outfit', 'sans-serif'],// ✅ Define Ovo font in Tailwind
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'), // Now compatible with Tailwind v4
    require('flowbite/plugin')
    
  ],
};
