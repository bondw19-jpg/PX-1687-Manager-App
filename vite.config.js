import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Dev server — binds to all interfaces so sandbox tunneling works
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '5173', 10),
  },
  // Preview server — reads PORT from env for Cloud Run compatibility
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4173', 10),
    allowedHosts: 'all',
  },
  build: {
    // Ensure sourcemaps are off in production for smaller bundles
    sourcemap: false,
    // Raise chunk size warning limit slightly
    chunkSizeWarningLimit: 600,
  },
})
