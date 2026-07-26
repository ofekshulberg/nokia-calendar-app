import { LocalNotifications } from '@capacitor/local-notifications'
import { useSettings } from '../context/SettingsContext'

export interface NotificationOptions {
  id: string | number
  title: string
  message: string
  date: string
  time: string
  repetition: 'once' | 'daily' | 'weekly' | 'monthly'
  vibrate?: boolean
  sound?: string
  overrideSilent?: boolean
}

// Calculate next occurrence based on repetition
function getNextNotificationDate(
  baseDate: Date,
  repetition: 'once' | 'daily' | 'weekly' | 'monthly'
): Date {
  const next = new Date(baseDate)

  switch (repetition) {
    case 'daily':
      next.setDate(next.getDate() + 1)
      break
    case 'weekly':
      next.setDate(next.getDate() + 7)
      break
    case 'monthly':
      next.setMonth(next.getMonth() + 1)
      break
    case 'once':
    default:
      // No repeat
      break
  }

  return next
}

// Schedule a single notification
export async function scheduleNotification(options: NotificationOptions) {
  try {
    const [hours, minutes] = options.time.split(':').map(Number)
    const notifDate = new Date(options.date)
    notifDate.setHours(hours, minutes, 0, 0)

    // Only schedule if date is in the future
    if (notifDate <= new Date()) {
      if (options.repetition === 'once') {
        return // Don't schedule past one-time notifications
      }
      // For repeating, schedule the next occurrence
      const next = getNextNotificationDate(notifDate, options.repetition)
      notifDate.setTime(next.getTime())
    }

    const id =
      typeof options.id === 'string'
        ? parseInt(options.id.replace(/\D/g, '')) % 2147483647
        : (options.id as number) % 2147483647

    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title: options.title || 'Notification',
          body: options.message,
          schedule: {
            at: notifDate,
          },
          sound: options.sound || 'default',
          smallIcon: 'ic_stat_icon_0',
          autoCancel: true,
        },
      ],
    })

    console.log('Notification scheduled:', options)
  } catch (error) {
    console.error('Error scheduling notification:', error)
  }
}

// Cancel a notification
export async function cancelNotification(id: string | number) {
  try {
    const numId =
      typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) % 2147483647 : (id as number) % 2147483647

    await LocalNotifications.cancel({
      notifications: [{ id: numId }],
    })

    console.log('Notification cancelled:', id)
  } catch (error) {
    console.error('Error cancelling notification:', error)
  }
}

// Get all pending notifications
export async function getPendingNotifications() {
  try {
    const result = await LocalNotifications.getPending()
    return result.notifications
  } catch (error) {
    console.error('Error getting pending notifications:', error)
    return []
  }
}

// Trigger vibration pattern (200ms on, 200ms off for ~60 seconds)
export async function triggerVibrationPattern() {
  try {
    // Capacitor doesn't have direct vibration, so we use the OS-level vibration
    // Multiple short vibrations to simulate pattern
    for (let i = 0; i < 30; i++) {
      // 30 iterations = ~60 seconds of pattern
      const notification = await LocalNotifications.schedule({
        notifications: [
          {
            id: -1000 - i,
            title: '',
            body: '',
            schedule: {
              at: new Date(Date.now() + i * 400),
            },
          },
        ],
      })
    }
  } catch (error) {
    console.warn('Vibration pattern failed:', error)
  }
}
