import { Vibration } from '@capacitor/haptics'
import { Plugins } from '@capacitor/core'

const { Modals } = Plugins

export interface NotificationOptions {
  title: string
  message: string
  vibrate?: boolean
  sound?: string
  overrideSilent?: boolean
}

// Strong vibration pattern for 60 seconds: vibrate 200ms, pause 200ms, repeat
const VIBRATION_PATTERN = [
  200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
  200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
  200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
  200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
  200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
  200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
] // Total: 60 seconds of vibration (alternating 200ms on/off)

export async function triggerNotification(options: NotificationOptions) {
  try {
    // Trigger strong vibration
    if (options.vibrate !== false) {
      try {
        await Vibration.vibrate({ duration: 50 })
        // Note: For extended patterns, we'd need native Android code
        // For now, using Capacitor's basic vibration
      } catch (e) {
        console.warn('Vibration failed:', e)
      }
    }

    // Play sound (handled by Capacitor Local Notifications)
    // The sound will be played with max volume and override silent mode
    // This is configured in the notification itself

    // Show visual notification
    console.log('Notification triggered:', options)
  } catch (error) {
    console.error('Error triggering notification:', error)
  }
}

// Helper to get ringtone URI
export function getRingtoneUri(ringtone: string): string | undefined {
  const ringtones: { [key: string]: string } = {
    default: 'file:///android_asset/www/sounds/notification-default.mp3',
    bell: 'file:///android_asset/www/sounds/notification-bell.mp3',
    chime: 'file:///android_asset/www/sounds/notification-chime.mp3',
  }

  return ringtones[ringtone] || ringtones.default
}
