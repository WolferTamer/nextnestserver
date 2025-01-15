import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
let port = process.env.PORT || 3000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port:port,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  }
})
