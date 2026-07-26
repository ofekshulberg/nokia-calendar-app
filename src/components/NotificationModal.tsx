import { useState, useEffect } from 'react'
import { useNotifications, Notification } from '../context/NotificationContext'
import { scheduleNotification, cancelNotification } from '../services/NotificationService'
import '../styles/NotificationModal.css'

interface NotificationModalProps {
  dateString?: string
  notificationId?: string
  onClose: () => void
}

function NotificationModal({ dateString, notificationId, onClose }: NotificationModalProps) {
  const { addNotification, updateNotification, deleteNotification, getNotification } = useNotifications()

  const existingNotification = notificationId ? getNotification(notificationId) : null

  const [date, setDate] = useState(dateString || new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(existingNotification?.time || '09:00')
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

    let notifId: string
    if (existingNotification) {
      updateNotification(existingNotification.id, notificationData)
      notifId = existingNotification.id
    } else {
      notifId = addNotification(notificationData)
    }

    // Schedule native notification
    try {
      await scheduleNotification({
        id: notifId,
        title: 'Nokia Calendar',
        message,
        date,
        time,
        repetition,
      })
    } catch (e) {
      console.error('Failed to schedule native notification:', e)
    }

    onClose()
  }

  const handleDelete = async () => {
    if (existingNotification) {
      try {
        await cancelNotification(existingNotification.id)
      } catch (e) {
        console.error('Failed to cancel notification:', e)
      }
      deleteNotification(existingNotification.id)
      onClose()
    }
  }

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{existingNotification ? 'Edit Notification' : 'New Notification'}</h2>

        <div className="modal-group">
          <label htmlFor="notif-date">Date</label>
          <input id="notif-date" type="date" value={date} onChange={handleDateChange} />
        </div>

        <div className="modal-group">
          <label htmlFor="notif-time">Time</label>
          <input id="notif-time" type="time" value={time} onChange={handleTimeChange} />
        </div>

        <div className="modal-group">
          <label htmlFor="notif-repetition">Repeat</label>
          <select id="notif-repetition" value={repetition} onChange={handleRepetitionChange}>
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="modal-group">
          <label htmlFor="notif-message">Message</label>
          <textarea id="notif-message" value={message} onChange={handleMessageChange} />
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