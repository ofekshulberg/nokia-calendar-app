import { useState, useEffect } from 'react'
import { useNotifications, Notification } from '../context/NotificationContext'
import { LocalNotifications } from '@capacitor/local-notifications'
import '../styles/NotificationModal.css'

interface NotificationModalProps {
  dateString?: string
  notificationId?: string
  onClose: () => void
}

function NotificationModal({
  dateString,
  notificationId,
  onClose,
}: NotificationModalProps) {
  const { addNotification, updateNotification, deleteNotification, getNotification } =
    useNotifications()

  const existingNotification = notificationId ? getNotification(notificationId) : null

  const [date, setDate] = useState(dateString || new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(existingNotification?.time || '00:00')
  const [message, setMessage] = useState(existingNotification?.message || '')
  const [repetition, setRepetition] = useState<'once' | 'daily' | 'weekly' | 'monthly'>(
    existingNotification?.repetition || 'once'
  )

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value)
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleRepetitionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRepetition(e.target.value as any)
  }

  const handleDone = async () => {
    if (!message.trim()) {
      alert('Please enter a message')
      return
    }

    const notificationData = {
      date,
      time,
      message,
      repetition,
    }

    if (existingNotification) {
      updateNotification(existingNotification.id, notificationData)
    } else {
      addNotification(notificationData)
    }

    // Schedule native notification
    const [hours, minutes] = time.split(':').map(Number)
    const notifDate = new Date(date)
    notifDate.setHours(hours, minutes, 0, 0)

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: existingNotification?.id ? parseInt(existingNotification.id.replace(/\D/g, '')) % 2147483647 : Math.floor(Math.random() * 2147483647),
            title: 'Nokia Calendar',
            body: message,
            schedule: {
              at: notifDate,
            },
          },
        ],
      })
    } catch (e) {
      console.error('Failed to schedule notification:', e)
    }

    onClose()
  }

  const handleDelete = () => {
    if (existingNotification) {
      deleteNotification(existingNotification.id)
      try {
        LocalNotifications.cancel({
          notifications: [
            {
              id: parseInt(existingNotification.id.replace(/\D/g, '')) % 2147483647,
            },
          ],
        })
      } catch (e) {
        console.error('Failed to cancel notification:', e)
      }
      onClose()
    }
  }

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{existingNotification ? 'Edit Notification' : 'New Notification'}</h2>

        <div className="modal-group">
          <label htmlFor="notif-date">Date</label>
          <input
            id="notif-date"
            type="date"
            value={date}
            onChange={handleDateChange}
          />
        </div>

        <div className="modal-group">
          <label htmlFor="notif-time">Time</label>
          <input
            id="notif-time"
            type="time"
            value={time}
            onChange={handleTimeChange}
          />
        </div>

        <div className="modal-group">
          <label htmlFor="repetition">Repeat</label>
          <select id="repetition" value={repetition} onChange={handleRepetitionChange}>
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="modal-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter notification message"
            rows={4}
          />
        </div>

        <div className="modal-buttons">
          {existingNotification && (
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="done-button" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationModal