import { App as CapApp } from '@capacitor/app'
import { LocalNotifications } from '@capacitor/local-notifications'
import Calendar from './pages/Calendar'
import DateDetail from './pages/DateDetail'
import { useSettings } from './context/SettingsContext'
import { useNotifications } from './context/NotificationContext'
import { startForegroundService } from './services/ForegroundService'
import { scheduleNotification } from './services/NotificationService'
import { useEffect, useState } from 'react'
import './styles/App.css'

type Page = 'calendar' | 'date-detail'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('calendar')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { isDarkMode, showForegroundIndicator, ringtone } = useSettings()
  const { notifications } = useNotifications()

  useEffect(() => {
    // Request notification permissions
    LocalNotifications.requestPermissions()

    // Start foreground service
    startForegroundService()

    // Listen for notification clicks
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('✅ Notification clicked:', notification)
      // Cancel remaining alerts when user acknowledges
      if (notification.notification.id) {
        const baseId = Math.floor(notification.notification.id / 12) * 12
        for (let i = 0; i < 12; i++) {
          LocalNotifications.cancel({ notifications: [{ id: baseId + i }] })
        }
      }
    })

    // Listen for notification delivery
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('🔔 Notification received with sound:', notification)
    })

    // Handle app pause/resume
    CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        // App resumed - re-schedule all notifications
        scheduleAllPendingNotifications()
      }
    })

    // Initial schedule of all notifications
    scheduleAllPendingNotifications()
  }, [])

  const scheduleAllPendingNotifications = () => {
    notifications.forEach((notif) => {
      console.log('📅 Scheduling notification with ringtone:', ringtone)
      scheduleNotification({
        id: notif.id,
        title: 'Nokia Calendar',
        message: notif.message,
        date: notif.date,
        time: notif.time,
        repetition: notif.repetition,
        sound: ringtone, // Pass the user-selected ringtone
      })
    })
  }

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
      {currentPage === 'calendar' && <Calendar onDateSelect={handleDateSelect} />}
      {currentPage === 'date-detail' && selectedDate && (
        <DateDetail dateString={selectedDate} onBack={handleBack} />
      )}
    </div>
  )
}

export default App
