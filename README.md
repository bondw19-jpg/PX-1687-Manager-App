# Panda Manager Hub

A mobile-first, web-compatible Manager Hub PWA for Panda Express restaurant locations.

## Features

- 🏠 **Dashboard** — Real-time stats cards, today's events, recent call-ins, preview update banner
- 👥 **Associates** — Full roster management with work files, status, star ratings
- 📵 **Call-In Tracker** — Log & track call-ins with frequency charts
- 📅 **Calendar** — Team & personal calendars with event management
- ✅ **Shift Checklist** — Opening / Mid / Closing checklists with history
- 📝 **Notes** — Team & personal notes with categories and pinning
- ⭐ **Performance Reviews** — Associate evaluations with per-category scoring
- 📋 **Tasks & To-Do** — Kanban-style task management
- 📞 **Quick Contacts** — Pre-seeded + custom contact directory
- 📣 **Announcements** — Team-wide announcements with priority levels

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS (Panda brand tokens)
- **State**: Zustand (with localStorage persistence)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Server**: Express 5 (static SPA server for Cloud Run)
- **Database**: Firebase Firestore (ready to connect)
- **Auth**: Firebase Auth (demo mode included)
- **PWA**: Web App Manifest included

---

## Local Development

```bash
npm install
npm run dev          # Vite dev server → http://localhost:5173
```

## Production Build

```bash
npm run build        # outputs to /dist
npm start            # runs Express server on PORT (default 8080)
```

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## ☁️ Cloud Run Deployment

The app is fully Cloud Run compatible:

- ✅ `server.js` reads `PORT` from environment (`process.env.PORT`)
- ✅ Binds to `0.0.0.0` (not `localhost`)
- ✅ SPA fallback — all routes serve `index.html` for React Router
- ✅ `Dockerfile` uses multi-stage build (builder → runner)

### Deploy via Docker

```bash
# Build
docker build -t panda-manager-hub .

# Test locally (simulates Cloud Run)
docker run -p 8080:8080 -e PORT=8080 panda-manager-hub
curl http://localhost:8080/

# Deploy to Cloud Run
gcloud run deploy panda-manager-hub \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔥 Firebase App Hosting

`apphosting.yaml` is included for Firebase App Hosting (Cloud Run backed):

```yaml
runConfig:
  cpu: 1
  memoryMiB: 512
  concurrency: 80
  minInstances: 0
  maxInstances: 10
```

```bash
firebase apphosting:backends:create
firebase deploy
```

---

## 🌐 Firebase Hosting (Static)

`firebase.json` is included for static Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

---

## 🐼 Demo Mode

Click **"🐼 Demo Login (No Account Needed)"** on the login screen to access all features without Firebase credentials. All data saves to `localStorage`.
