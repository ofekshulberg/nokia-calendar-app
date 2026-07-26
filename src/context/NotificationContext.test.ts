import { v4 as uuidv4 } from 'uuid'

// Mock Notification interface for testing
interface TestNotification {
  id: string
  date: string
  time: string
  message: string
  repetition: 'once' | 'daily' | 'weekly' | 'monthly'
  createdAt: number
}

// Simulated notification storage for testing
class NotificationStorageMock {
  private notifications: TestNotification[] = []

  addNotification(notification: Omit<TestNotification, 'id' | 'createdAt'>): string {
    const newNotification: TestNotification = {
      ...notification,
      id: uuidv4(),
      createdAt: Date.now(),
    }
    this.notifications.push(newNotification)
    return newNotification.id
  }

  updateNotification(id: string, notification: Omit<TestNotification, 'id' | 'createdAt'>): boolean {
    const index = this.notifications.findIndex((n) => n.id === id)
    if (index === -1) return false
    this.notifications[index] = { ...this.notifications[index], ...notification }
    return true
  }

  deleteNotification(id: string): boolean {
    const index = this.notifications.findIndex((n) => n.id === id)
    if (index === -1) return false
    this.notifications.splice(index, 1)
    return true
  }

  getNotification(id: string): TestNotification | undefined {
    return this.notifications.find((n) => n.id === id)
  }

  getNotificationsForDate(dateString: string): TestNotification[] {
    return this.notifications
      .filter((n) => n.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  getAllNotifications(): TestNotification[] {
    return [...this.notifications]
  }
}

export const notificationContextTests = {
  // Test 1: Add notification
  testAddNotification: () => {
    const storage = new NotificationStorageMock()
    const id = storage.addNotification({
      date: '2026-07-26',
      time: '09:00',
      message: 'Test notification',
      repetition: 'once',
    })

    if (!id) {
      throw new Error('Failed to add notification')
    }

    const notif = storage.getNotification(id)
    if (!notif) {
      throw new Error('Could not retrieve added notification')
    }

    if (notif.message !== 'Test notification') {
      throw new Error('Notification message does not match')
    }

    console.log('✅ Test 1 PASSED: Add notification works correctly')
  },

  // Test 2: Update notification
  testUpdateNotification: () => {
    const storage = new NotificationStorageMock()
    const id = storage.addNotification({
      date: '2026-07-26',
      time: '09:00',
      message: 'Original message',
      repetition: 'once',
    })

    const updated = storage.updateNotification(id, {
      date: '2026-07-26',
      time: '10:00',
      message: 'Updated message',
      repetition: 'daily',
    })

    if (!updated) {
      throw new Error('Failed to update notification')
    }

    const notif = storage.getNotification(id)
    if (notif?.message !== 'Updated message') {
      throw new Error('Notification was not updated correctly')
    }
    if (notif?.repetition !== 'daily') {
      throw new Error('Notification repetition was not updated')
    }

    console.log('✅ Test 2 PASSED: Update notification works correctly')
  },

  // Test 3: Delete notification
  testDeleteNotification: () => {
    const storage = new NotificationStorageMock()
    const id = storage.addNotification({
      date: '2026-07-26',
      time: '09:00',
      message: 'To be deleted',
      repetition: 'once',
    })

    const deleted = storage.deleteNotification(id)
    if (!deleted) {
      throw new Error('Failed to delete notification')
    }

    const notif = storage.getNotification(id)
    if (notif !== undefined) {
      throw new Error('Notification was not deleted')
    }

    console.log('✅ Test 3 PASSED: Delete notification works correctly')
  },

  // Test 4: Get notifications for date
  testGetNotificationsForDate: () => {
    const storage = new NotificationStorageMock()

    storage.addNotification({
      date: '2026-07-26',
      time: '09:00',
      message: 'Notif 1',
      repetition: 'once',
    })

    storage.addNotification({
      date: '2026-07-26',
      time: '14:00',
      message: 'Notif 2',
      repetition: 'once',
    })

    storage.addNotification({
      date: '2026-07-27',
      time: '09:00',
      message: 'Notif 3',
      repetition: 'once',
    })

    const july26 = storage.getNotificationsForDate('2026-07-26')
    if (july26.length !== 2) {
      throw new Error(`Expected 2 notifications for 2026-07-26, got ${july26.length}`)
    }

    const july27 = storage.getNotificationsForDate('2026-07-27')
    if (july27.length !== 1) {
      throw new Error(`Expected 1 notification for 2026-07-27, got ${july27.length}`)
    }

    // Check sorting by time
    if (july26[0].time !== '09:00' || july26[1].time !== '14:00') {
      throw new Error('Notifications are not sorted by time')
    }

    console.log('✅ Test 4 PASSED: Get notifications for date works correctly')
  },

  // Test 5: Multiple notifications on same date
  testMultipleNotificationsPerDate: () => {
    const storage = new NotificationStorageMock()

    for (let i = 0; i < 5; i++) {
      storage.addNotification({
        date: '2026-07-26',
        time: `${9 + i}:00`,
        message: `Notification ${i + 1}`,
        repetition: 'once',
      })
    }

    const allNotifs = storage.getNotificationsForDate('2026-07-26')
    if (allNotifs.length !== 5) {
      throw new Error(`Expected 5 notifications, got ${allNotifs.length}`)
    }

    console.log('✅ Test 5 PASSED: Multiple notifications per date works correctly')
  },

  // Test 6: Notification persistence (ID uniqueness)
  testNotificationIdUniqueness: () => {
    const storage = new NotificationStorageMock()

    const id1 = storage.addNotification({
      date: '2026-07-26',
      time: '09:00',
      message: 'Notif 1',
      repetition: 'once',
    })

    const id2 = storage.addNotification({
      date: '2026-07-26',
      time: '10:00',
      message: 'Notif 2',
      repetition: 'once',
    })

    if (id1 === id2) {
      throw new Error('Notification IDs should be unique')
    }

    console.log('✅ Test 6 PASSED: Notification IDs are unique')
  },

  // Test 7: Empty notifications list
  testEmptyNotificationsList: () => {
    const storage = new NotificationStorageMock()
    const notifs = storage.getNotificationsForDate('2026-07-26')

    if (notifs.length !== 0) {
      throw new Error(`Expected 0 notifications, got ${notifs.length}`)
    }

    console.log('✅ Test 7 PASSED: Empty notifications list works correctly')
  },

  // Test 8: Delete non-existent notification
  testDeleteNonExistent: () => {
    const storage = new NotificationStorageMock()
    const deleted = storage.deleteNotification('non-existent-id')

    if (deleted) {
      throw new Error('Should not be able to delete non-existent notification')
    }

    console.log('✅ Test 8 PASSED: Cannot delete non-existent notification')
  },

  // Test 9: Update non-existent notification
  testUpdateNonExistent: () => {
    const storage = new NotificationStorageMock()
    const updated = storage.updateNotification('non-existent-id', {
      date: '2026-07-26',
      time: '09:00',
      message: 'Updated',
      repetition: 'once',
    })

    if (updated) {
      throw new Error('Should not be able to update non-existent notification')
    }

    console.log('✅ Test 9 PASSED: Cannot update non-existent notification')
  },

  // Test 10: Get non-existent notification
  testGetNonExistent: () => {
    const storage = new NotificationStorageMock()
    const notif = storage.getNotification('non-existent-id')

    if (notif !== undefined) {
      throw new Error('Should return undefined for non-existent notification')
    }

    console.log('✅ Test 10 PASSED: Get non-existent notification returns undefined')
  },

  // Run all tests
  runAllTests: () => {
    console.log('\n🧪 Starting NotificationContext Test Suite...\n')

    const tests = [
      'testAddNotification',
      'testUpdateNotification',
      'testDeleteNotification',
      'testGetNotificationsForDate',
      'testMultipleNotificationsPerDate',
      'testNotificationIdUniqueness',
      'testEmptyNotificationsList',
      'testDeleteNonExistent',
      'testUpdateNonExistent',
      'testGetNonExistent',
    ] as const

    let passed = 0
    let failed = 0

    for (const test of tests) {
      try {
        notificationContextTests[test]()
        passed++
      } catch (error: any) {
        failed++
        console.error(`❌ ${test} FAILED:`, error.message)
      }
    }

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length} total\n`)

    if (failed === 0) {
      console.log('🎉 All context tests passed!')
    } else {
      throw new Error(`${failed} test(s) failed`)
    }
  },
}

// Run tests in development
if (typeof window !== 'undefined' && (window as any).__TEST_MODE__) {
  notificationContextTests.runAllTests()
}
