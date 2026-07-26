import { LocalNotifications } from '@capacitor/local-notifications'

export async function startForegroundService() {
  try {
    // Create notification channel for foreground service
    await LocalNotifications.createChannel({
      id: 'foreground',
      name: 'Calendar Running',
      importance: 2,
      visibility: 1,
    })

    // Schedule persistent notification
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999,
          title: '📅 Nokia Calendar',
          body: 'Calendar notifications enabled',
          smallIcon: 'ic_notification',
          channelId: 'foreground',
          autoCancel: false,
        },
      ],
    })
  } catch (error) {
    console.warn('Failed to start foreground service:', error)
  }
}

export async function stopForegroundService() {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: 999 }] })
  } catch (error) {
    console.warn('Failed to stop foreground service:', error)
  }
}
