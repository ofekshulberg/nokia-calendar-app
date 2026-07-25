import { useEffect, useState } from 'react'
import { App as CapApp } from '@capacitor/app'
import { LocalNotifications } from '@capacitor/local-notifications'
import Calendar from './pages/Calendar'
import DateDetail from './pages/DateDetail'
import { useSettings } from './context/SettingsContext'
import './styles/App.css'

type Page = 'calendar' | 'date-detail'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('calendar')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { isDarkMode } = useSettings()

  useEffect(() => {
    // Request notification permissions
    LocalNotifications.requestPermissions()
    
    // Handle app pause/resume
    CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        // App resumed - check and trigger any pending notifications
      }
    })
  }, [])

  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString)
    setCurrentPage('date-detail')
  }

  const handleBack = () => {
    setCurrentPage('calendar')
    setSelectedDate(null)
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {currentPage === 'calendar' && (
        <Calendar onDateSelect={handleDateSelect} />
      )}
      {currentPage === 'date-detail' && selectedDate && (
        <DateDetail dateString={selectedDate} onBack={handleBack} />
      )}
    </div>
  )
}

export default App