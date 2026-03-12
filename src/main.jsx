import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global unhandled error/rejection catcher — prevents blank screen from silent crashes
window.addEventListener('unhandledrejection', (event) => {
  console.warn('[App] Unhandled promise rejection (suppressed):', event?.reason?.message || event?.reason);
  event.preventDefault(); // stop it from killing the app
});

window.addEventListener('error', (event) => {
  console.warn('[App] Uncaught error (suppressed):', event?.message);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
