# Panda Manager Hub

A mobile-first, web-compatible Manager Hub application for Panda Express restaurant locations.

## Features

- 🏠 **Dashboard** — Real-time stats cards, today's events, recent call-ins
- 👥 **Associates** — Full roster management with work files, status, star ratings
- 📵 **Call-In Tracker** — Log & track call-ins with frequency charts
- 📅 **Calendar** — Team & personal calendars with event management
- ✅ **Shift Checklist** — Opening / Mid / Closing checklists with history
- 📝 **Notes** — Team & personal notes with categories and pinning
- ⭐ **Performance Reviews** — Associate evaluations with per-category scoring
- 📋 **Tasks & To-Do** — Kanban-style task management
- 📞 **Quick Contacts** — Pre-seeded + custom contact directory
- 📣 **Announcements** — Team-wide announcements

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS
- **State**: Zustand (with localStorage persistence)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: Firebase Firestore (ready to connect)
- **Auth**: Firebase Auth (demo mode included)
- **PWA**: Web App Manifest included

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Demo Mode

The app includes a full demo mode with pre-seeded data. Click **"🐼 Demo Login"** on the login screen to access without Firebase credentials.

## Deployment

```bash
npm run build
# Deploy dist/ folder to Firebase Hosting or any static host
```
