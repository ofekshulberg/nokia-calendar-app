import { LocalNotifications } from '@capacitor/local-notifications'

export interface NotificationOptions {
  title: string
  message: string
  vibrate?: boolean
  sound?: string
  overrideSilent?: boolean
}

// Strong vibration pattern for 60 seconds using repeated calls
export async function triggerStrongVibration() {
  try {
    // Repeat vibration pattern for approximately 60 seconds
    // Each pattern: 200ms vibrate, 200ms pause
    for (let i = 0; i < 150; i++) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.random(),
              title: '',
              body: '',
              schedule: { at: new Date(Date.now() + i * 400) },
            },
          ],
        })
      } catch (e) {
        // Continue on error
      }
    }
  } catch (error) {
    console.warn('Vibration pattern failed:', error)
  }
}

export async function triggerNotification(options: NotificationOptions) {
  try {
    // Trigger vibration
    if (options.vibrate !== false) {
      await triggerStrongVibration()
    }

    console.log('Notification triggered:', options)
  } catch (error) {
    console.error('Error triggering notification:', error)
  }
}

// Helper to get ringtone
export function getRingtoneUri(ringtone: string): string {
  const ringtones: { [key: string]: string } = {
    default: 'default',
    bell: 'bell',
    chime: 'chime',
  }

  return ringtones[ringtone] || 'default'
}
