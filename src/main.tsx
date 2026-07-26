import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { NotificationProvider } from './context/NotificationContext'
import { SettingsProvider } from './context/SettingsContext'
import { runAllTests } from './test-runner'
import './styles/index.css'

// Run tests in development/test mode
if (import.meta.env.DEV) {
  console.log('🔍 Running tests in development mode...')
  runAllTests()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </SettingsProvider>
  </React.StrictMode>
)
