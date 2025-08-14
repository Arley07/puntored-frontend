import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: mode === 'development' ? {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://puntored-backend.onrender.com',
        changeOrigin: true
      }
    }
  } : undefined
}))
