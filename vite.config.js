import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'prompt' — onNeedRefresh fires when a new SW is waiting,
      // giving us a chance to show the toast before reloading.
      registerType: 'prompt',
      injectRegister: 'auto',

      // Use the existing manifest.json in /public
      manifest: false,

      workbox: {
        // Cache all built assets (JS, CSS, images)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],

        // App shell — always serve index.html for any navigation
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        // Runtime caching strategies
        runtimeCaching: [
          {
            // Firebase Firestore & Auth — network first, fall back to cache
            urlPattern: /^https:\/\/(firestore|identitytoolkit|securetoken)\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Google fonts / external assets — stale while revalidate
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 20 } },
          },
        ],

        // Don't let the SW intercept the sandbox tunnel health-check
        navigateFallbackAllowlist: [/^(?!\/api\/)/],

        // Clean old caches on activate
        cleanupOutdatedCaches: true,
        // skipWaiting/clientsClaim are handled manually via updateSW()
        // so the toast can show first before the page reloads.
        skipWaiting: false,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,  // Don't run SW in dev mode
      },
    }),
  ],

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
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase') || id.includes('firestoreSync') || id.includes('firestoreService')) {
            return 'firebase-lazy';
          }
        },
      },
    },
  },
})
