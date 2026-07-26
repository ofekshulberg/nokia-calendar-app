import { LocalNotifications } from '@capacitor/local-notifications'

export async function startForegroundService() {
  try {
    // Create notification channel for foreground service
    await LocalNotifications.createChannel({
      id: 'foreground_service',
      name: 'App Running',
      importance: 2,
      visibility: 1,
      description: 'Indicates the app is running in background',
    })

    // Schedule persistent notification
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999999,
          title: '📅 Nokia Calendar',
          body: 'Monitoring for notifications',
          smallIcon: 'ic_stat_icon_0',
          largeIcon: 'ic_stat_icon_0',
          channelId: 'foreground_service',
          autoCancel: false,
          ongoing: true,
        },
      ],
    })

    console.log('Foreground service started')
  } catch (error) {
    console.warn('Failed to start foreground service:', error)
  }
}

export async function stopForegroundService() {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: 999999 }] })
    console.log('Foreground service stopped')
  } catch (error) {
    console.warn('Failed to stop foreground service:', error)
  }
}
