import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // ✅ Ensure this matches your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
