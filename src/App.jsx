import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Associates = lazy(() => import('./pages/Associates'));
const CallIns = lazy(() => import('./pages/CallIns'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const Checklist = lazy(() => import('./pages/Checklist'));
const Notes = lazy(() => import('./pages/Notes'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Announcements = lazy(() => import('./pages/Announcements'));
const Login = lazy(() => import('./pages/Login'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/team" element={<Layout><Associates /></Layout>} />
          <Route path="/callins" element={<Layout><CallIns /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
          <Route path="/checklist" element={<Layout><Checklist /></Layout>} />
          <Route path="/notes" element={<Layout><Notes /></Layout>} />
          <Route path="/reviews" element={<Layout><Reviews /></Layout>} />
          <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
          <Route path="/contacts" element={<Layout><Contacts /></Layout>} />
          <Route path="/announcements" element={<Layout><Announcements /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
