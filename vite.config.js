import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'autoUpdate' — automatically updates the SW when a new version is detected
      // This ensures non-technical users always see the latest version without manual refresh
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      // Use the existing manifest.json in /public
      manifest: false,

      workbox: {
        // Cache all built assets (JS, CSS, images)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],

        // App shell — always serve index.html for any navigation
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        // Runtime caching strategies. Firebase Auth/Firestore API responses must
        // never be service-worker cached because they are account-specific and can
        // replay one user's private data after switching accounts on the same PWA.
        runtimeCaching: [
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
        // skipWaiting: true — immediately activate new SW without waiting for user action
        // This ensures non-technical users get updates without confusion
        skipWaiting: true,
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
    port: parseInt(process.env.PORT || '4173', 10),
    allowedHosts: true,
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
