import { Notification } from '../context/NotificationContext'
import '../styles/NotificationCard.css'

interface NotificationCardProps {
  notification: Notification
  onClick: () => void
}

function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const repetitionLabel = {
    once: '',
    daily: '(Daily)',
    weekly: '(Weekly)',
    monthly: '(Monthly)',
  }[notification.repetition]

  return (
    <button className="notification-card" onClick={onClick}>
      <div className="card-time">{notification.time}</div>
      <div className="card-message">{notification.message}</div>
      {repetitionLabel && <div className="card-repetition">{repetitionLabel}</div>}
    </button>
  )
}

export default NotificationCard