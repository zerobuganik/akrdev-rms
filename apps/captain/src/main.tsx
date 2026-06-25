import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initNative, isNative } from '@/lib/native-bridge'
import './index.css'

if (isNative) {
  initNative()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
