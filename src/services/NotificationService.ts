import { LocalNotifications } from '@capacitor/local-notifications'

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

// Schedule a single notification with repeating sound for 60 seconds
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

    // Create multiple notifications at intervals for repeating sound
    // Schedule sound alerts every 5 seconds for 60 seconds (12 times total)
    const notifications = []

    for (let i = 0; i < 12; i++) {
      const alertTime = new Date(notifDate.getTime() + i * 5000) // 5 seconds apart

      notifications.push({
        id: id + i, // Different ID for each sound alert
        title: i === 0 ? (options.title || 'Notification') : '', // Only show title on first alert
        body: i === 0 ? options.message : '', // Only show message on first alert
        schedule: {
          at: alertTime,
        },
        sound: options.sound || 'default',
        smallIcon: 'ic_stat_icon_0',
        autoCancel: true,
        vibrate: [100, 50, 100], // Vibration pattern: 100ms on, 50ms off, 100ms on
      })
    }

    await LocalNotifications.schedule({ notifications })

    console.log('Notification scheduled with repeating sound:', options)
  } catch (error) {
    console.error('Error scheduling notification:', error)
  }
}

// Cancel a notification (and all its sound alerts)
export async function cancelNotification(id: string | number) {
  try {
    const numId =
      typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) % 2147483647 : (id as number) % 2147483647

    // Cancel all 12 notification IDs for this alert
    const idsToCancel = Array.from({ length: 12 }, (_, i) => numId + i)

    await LocalNotifications.cancel({
      notifications: idsToCancel.map((cancelId) => ({ id: cancelId })),
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
