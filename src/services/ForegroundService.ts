import { LocalNotifications } from '@capacitor/local-notifications'

export async function startForegroundService() {
  try {
    await LocalNotifications.createChannel({
      id: 'foreground',
      name: 'Foreground Service',
      importance: 3,
      visibility: 1,
    })

    // Show persistent foreground notification
    await LocalNotifications.sendNotification({
      id: -1, // Special ID for foreground notification
      title: 'Nokia Calendar',
      body: 'Calendar notifications are enabled',
      channelId: 'foreground',
      autoCancel: false,
      largeBody: 'The app is running and monitoring for scheduled notifications',
    })
  } catch (error) {
    console.error('Failed to start foreground service:', error)
  }
}

export async function stopForegroundService() {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: -1 }] })
  } catch (error) {
    console.error('Failed to stop foreground service:', error)
  }
}
