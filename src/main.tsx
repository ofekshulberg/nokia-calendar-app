import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationProvider } from './context/NotificationContext'
import { SettingsProvider } from './context/SettingsContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </SettingsProvider>
  </React.StrictMode>,
)