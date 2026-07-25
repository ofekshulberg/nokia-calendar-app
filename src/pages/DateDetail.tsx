import { useState } from 'react'
import { useNotifications } from '../context/NotificationContext'
import NotificationCard from '../components/NotificationCard'
import NotificationModal from '../components/NotificationModal'
import '../styles/DateDetail.css'

interface DateDetailProps {
  dateString: string
  onBack: () => void
}

function DateDetail({ dateString, onBack }: DateDetailProps) {
  const { getNotificationsForDate } = useNotifications()
  const [showNewNotification, setShowNewNotification] = useState(false)
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null)

  const notifications = getNotificationsForDate(dateString)
  const date = new Date(dateString + 'T00:00:00')
  const dateDisplay = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleEditNotification = (id: string) => {
    setSelectedNotificationId(id)
  }

  return (
    <div className="date-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>←</button>
        <h1 className="detail-title">{dateDisplay}</h1>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications for this date</p>
        ) : (
          notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onClick={() => handleEditNotification(notif.id)}
            />
          ))
        )}
      </div>

      <button
        className="new-notification-button"
        onClick={() => setShowNewNotification(true)}
      >
        <span className="plus-sign">+</span> New Notification
      </button>

      {showNewNotification && (
        <NotificationModal
          dateString={dateString}
          onClose={() => setShowNewNotification(false)}
        />
      )}

      {selectedNotificationId && (
        <NotificationModal
          notificationId={selectedNotificationId}
          dateString={dateString}
          onClose={() => setSelectedNotificationId(null)}
        />
      )}
    </div>
  )
}

export default DateDetail