import { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface Notification {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  message: string
  repetition: 'once' | 'daily' | 'weekly' | 'monthly'
  createdAt: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  updateNotification: (id: string, notification: Omit<Notification, 'id' | 'createdAt'>) => void
  deleteNotification: (id: string) => void
  getNotificationsForDate: (dateString: string) => Notification[]
  getNotification: (id: string) => Notification | undefined
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notifications')
    if (saved) {
      try {
        setNotifications(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load notifications:', e)
      }
    }
  }, [])

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: Date.now(),
    }
    setNotifications([...notifications, newNotification])
  }

  const updateNotification = (id: string, notification: Omit<Notification, 'id' | 'createdAt'>) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, ...notification } : n))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getNotificationsForDate = (dateString: string): Notification[] => {
    return notifications
      .filter((n) => n.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  const getNotification = (id: string): Notification | undefined => {
    return notifications.find((n) => n.id === id)
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        updateNotification,
        deleteNotification,
        getNotificationsForDate,
        getNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}