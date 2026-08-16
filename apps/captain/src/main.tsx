import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initNative, isNative } from '@/lib/native-bridge'
import './index.css'

if (isNative) {
  initNative()
} else {
  // Register the PWA service worker only on the web — it is unnecessary in the
  // native Capacitor WebView and can serve stale assets / interfere with API calls.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
    })
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
