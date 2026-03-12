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
    allowedHosts: true,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    // Disable modulePreload polyfill injection — prevents Firebase SDK chunks
    // from being speculatively fetched before the user actually needs them.
    modulePreload: false,
    rollupOptions: {
      output: {
        // Keep Firebase chunks in a separate group so they are never eagerly loaded
        manualChunks(id) {
          if (id.includes('firebase') || id.includes('firestoreSync') || id.includes('firestoreService')) {
            return 'firebase-lazy';
          }
        },
      },
    },
  },
})
