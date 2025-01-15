import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
let port = process.env.PORT || 3000;
let APIURL = process.env.API_URL || "http://127.0.0.1:3001"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: APIURL,
        changeOrigin: true,
      }
    }
  }
})
