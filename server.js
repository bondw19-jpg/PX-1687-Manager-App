// Production static server for Cloud Run / Firebase App Hosting
// Reads PORT from environment variable (required by Cloud Run)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Read PORT from environment — Cloud Run injects this automatically
const port = parseInt(process.env.PORT || '8080', 10);

// Serve the Vite production build from /dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback — send index.html for all non-asset routes
// (required for React Router client-side routing)
// NOTE: Express 5 uses /{*path} instead of * for wildcard routes
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ✅ Bind to 0.0.0.0 — Cloud Run requires this (not localhost/127.0.0.1)
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Panda Manager Hub server running on port ${port}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`   Serving from: ${distPath}`);
});
