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

// Sound configuration - maps sound names to Android system sounds
export const AVAILABLE_SOUNDS = {
  default: 'default',
  bell: 'bell',
  chime: 'chime',
  digital: 'digital',
} as const

export type SoundType = keyof typeof AVAILABLE_SOUNDS

// Validate that a sound is available
export function isSoundAvailable(sound: string): sound is SoundType {
  return sound in AVAILABLE_SOUNDS
}

// Get the actual sound name to use
export function getSoundName(sound?: string): string {
  if (!sound) return 'default'
  if (isSoundAvailable(sound)) {
    return AVAILABLE_SOUNDS[sound]
  }
  console.warn(`Sound '${sound}' not available, using default`)
  return 'default'
}

// Calculate next occurrence based on repetition
export function getNextNotificationDate(
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

// Strong vibration pattern: 200ms on, 100ms off (repeats for 60 seconds)
export const VIBRATION_PATTERN = [200, 100] // in milliseconds

// Schedule a single notification with repeating sound and vibration for 60 seconds
export async function scheduleNotification(options: NotificationOptions) {
  try {
    if (!options.date || !options.time) {
      throw new Error('Date and time are required')
    }

    const [hours, minutes] = options.time.split(':').map(Number)
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error('Invalid time format')
    }

    const notifDate = new Date(options.date)
    notifDate.setHours(hours, minutes, 0, 0)

    // Only schedule if date is in the future
    if (notifDate <= new Date()) {
      if (options.repetition === 'once') {
        console.warn('Notification date is in the past, skipping')
        return false
      }
      // For repeating, schedule the next occurrence
      const next = getNextNotificationDate(notifDate, options.repetition)
      notifDate.setTime(next.getTime())
    }

    const id =
      typeof options.id === 'string'
        ? parseInt(options.id.replace(/\D/g, '')) % 2147483647
        : (options.id as number) % 2147483647

    if (isNaN(id)) {
      throw new Error('Invalid notification ID')
    }

    // Get the sound to use - use provided sound or default
    const soundToUse = getSoundName(options.sound || 'default')

    // Create 12 notifications at 5-second intervals for 60 seconds
    // Each has vibration pattern and sound that repeats
    const notifications = []

    for (let i = 0; i < 12; i++) {
      const alertTime = new Date(notifDate.getTime() + i * 5000) // 5 seconds apart

      notifications.push({
        id: id + i,
        title: i === 0 ? (options.title || 'Notification') : '',
        body: i === 0 ? options.message : '',
        schedule: {
          at: alertTime,
        },
        sound: soundToUse, // Use the validated sound
        smallIcon: 'ic_stat_icon_0',
        autoCancel: false, // Don't auto-cancel so user can dismiss
        vibrate: VIBRATION_PATTERN, // Strong 200ms on, 100ms off pattern
      })
    }

    await LocalNotifications.schedule({ notifications })

    console.log('✅ Notification scheduled with sound:', soundToUse, 'and vibration:', options)
    return true
  } catch (error) {
    console.error('❌ Error scheduling notification:', error)
    return false
  }
}

// Cancel a notification (and all its sound alerts)
export async function cancelNotification(id: string | number) {
  try {
    if (!id) {
      throw new Error('Notification ID is required')
    }

    const numId =
      typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) % 2147483647 : (id as number) % 2147483647

    if (isNaN(numId)) {
      throw new Error('Invalid notification ID')
    }

    // Cancel all 12 notification IDs for this alert
    const idsToCancel = Array.from({ length: 12 }, (_, i) => numId + i)

    await LocalNotifications.cancel({
      notifications: idsToCancel.map((cancelId) => ({ id: cancelId })),
    })

    console.log('✅ Notification cancelled:', id)
    return true
  } catch (error) {
    console.error('❌ Error cancelling notification:', error)
    return false
  }
}

// Get all pending notifications
export async function getPendingNotifications() {
  try {
    const result = await LocalNotifications.getPending()
    console.log('✅ Pending notifications retrieved:', result.notifications.length)
    return result.notifications
  } catch (error) {
    console.error('❌ Error getting pending notifications:', error)
    return []
  }
}

// Validate notification options
export function validateNotificationOptions(options: NotificationOptions): { valid: boolean; error?: string } {
  if (!options.id) return { valid: false, error: 'Missing notification ID' }
  if (!options.title) return { valid: false, error: 'Missing title' }
  if (!options.message) return { valid: false, error: 'Missing message' }
  if (!options.date) return { valid: false, error: 'Missing date' }
  if (!options.time) return { valid: false, error: 'Missing time' }
  if (!['once', 'daily', 'weekly', 'monthly'].includes(options.repetition)) {
    return { valid: false, error: 'Invalid repetition type' }
  }
  return { valid: true }
}

// Test that a sound name is valid
export function testSoundAvailability(sound: string): { available: boolean; message: string } {
  if (isSoundAvailable(sound)) {
    return { available: true, message: `Sound '${sound}' is available` }
  }
  return { available: false, message: `Sound '${sound}' is not available. Available sounds: ${Object.keys(AVAILABLE_SOUNDS).join(', ')}` }
}
