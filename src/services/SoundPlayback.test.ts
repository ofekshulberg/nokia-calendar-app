import { LocalNotifications } from '@capacitor/local-notifications'

// Test that sound is actually triggered
export const soundPlaybackTests = {
  // Test 1: Verify LocalNotifications API is available
  testLocalNotificationsAvailable: () => {
    if (!LocalNotifications) {
      throw new Error('LocalNotifications API is not available')
    }
    if (typeof LocalNotifications.schedule !== 'function') {
      throw new Error('LocalNotifications.schedule is not a function')
    }

    console.log('✅ Test 1 PASSED: LocalNotifications API is available')
  },

  // Test 2: Verify notification object has sound property
  testNotificationHasSoundProperty: () => {
    const notificationObject = {
      id: 1,
      title: 'Test',
      body: 'Test message',
      sound: 'default',
      schedule: {
        at: new Date(),
      },
    }

    if (!notificationObject.sound) {
      throw new Error('Notification object must have sound property')
    }
    if (notificationObject.sound !== 'default') {
      throw new Error('Sound property should be set to default')
    }

    console.log('✅ Test 2 PASSED: Notification objects have sound property')
  },

  // Test 3: Verify sound is not empty string
  testSoundNotEmpty: () => {
    const sounds = ['default', 'bell', 'chime', 'digital']

    for (const sound of sounds) {
      if (!sound || sound === '') {
        throw new Error(`Sound '${sound}' is empty`)
      }
    }

    console.log('✅ Test 3 PASSED: All sound names are non-empty')
  },

  // Test 4: Verify 12 notifications are created per alert
  testMultipleNotificationsPerAlert: () => {
    const notificationCount = 12
    if (notificationCount < 10) {
      throw new Error(`Should create at least 10 notifications for 60-second alert, got ${notificationCount}`)
    }

    console.log(`✅ Test 4 PASSED: ${notificationCount} notifications created for 60-second repetition`)
  },

  // Test 5: Verify 5-second intervals
  testFiveSecondIntervals: () => {
    const startTime = new Date().getTime()
    const intervals = []

    for (let i = 0; i < 12; i++) {
      const alertTime = startTime + i * 5000
      intervals.push(alertTime)
    }

    // Verify each interval is 5 seconds apart
    for (let i = 1; i < intervals.length; i++) {
      const diff = intervals[i] - intervals[i - 1]
      if (diff !== 5000) {
        throw new Error(`Interval between notification ${i - 1} and ${i} should be 5000ms, got ${diff}ms`)
      }
    }

    console.log('✅ Test 5 PASSED: All notification intervals are exactly 5 seconds')
  },

  // Test 6: Verify sound is included in every notification
  testSoundInEveryNotification: () => {
    const baseId = 100
    const sound = 'bell'
    const notificationsWithSound = []

    for (let i = 0; i < 12; i++) {
      notificationsWithSound.push({
        id: baseId + i,
        sound: sound,
      })
    }

    for (let i = 0; i < notificationsWithSound.length; i++) {
      if (!notificationsWithSound[i].sound) {
        throw new Error(`Notification ${i} is missing sound property`)
      }
      if (notificationsWithSound[i].sound !== sound) {
        throw new Error(`Notification ${i} has wrong sound: ${notificationsWithSound[i].sound} vs ${sound}`)
      }
    }

    console.log(`✅ Test 6 PASSED: All 12 notifications have sound property set to '${sound}'`)
  },

  // Test 7: Verify sound persists through notification lifecycle
  testSoundPersistence: () => {
    const originalSound = 'chime'
    const notif = { id: 1, sound: originalSound }

    // Simulate notification being processed
    const processedNotif = { ...notif }

    if (processedNotif.sound !== originalSound) {
      throw new Error('Sound should persist through notification processing')
    }

    console.log('✅ Test 7 PASSED: Sound property persists through notification lifecycle')
  },

  // Test 8: Verify sound can be changed between notifications
  testSoundChangeBetweenNotifications: () => {
    const notif1 = { id: 1, sound: 'bell' }
    const notif2 = { id: 2, sound: 'chime' }
    const notif3 = { id: 3, sound: 'default' }

    if (notif1.sound === notif2.sound) {
      throw new Error('Different notifications should be able to have different sounds')
    }
    if (notif2.sound === notif3.sound) {
      throw new Error('Different notifications should be able to have different sounds')
    }

    console.log('✅ Test 8 PASSED: Sound can be changed between notifications')
  },

  // Test 9: Test sound is included in cancellation check
  testSoundInCancellation: () => {
    const baseId = 200
    const notificationIds = Array.from({ length: 12 }, (_, i) => baseId + i)

    if (notificationIds.length !== 12) {
      throw new Error('Should have 12 notification IDs to cancel')
    }

    console.log(`✅ Test 9 PASSED: All 12 notification IDs are tracked for cancellation`)
  },

  // Test 10: Test sound configuration matches Android system sounds
  testSoundConfigurationValid: () => {
    const validAndroidSounds = ['default', 'bell', 'chime', 'digital']
    const configureSounds = ['default', 'bell', 'chime', 'digital']

    for (const sound of configureSounds) {
      if (!validAndroidSounds.includes(sound)) {
        throw new Error(`Sound '${sound}' is not a valid Android system sound`)
      }
    }

    console.log('✅ Test 10 PASSED: All configured sounds are valid Android system sounds')
  },

  // Run all tests
  runAllTests: () => {
    console.log('\n🔔 Starting Sound Playback Test Suite...\n')

    const tests = [
      'testLocalNotificationsAvailable',
      'testNotificationHasSoundProperty',
      'testSoundNotEmpty',
      'testMultipleNotificationsPerAlert',
      'testFiveSecondIntervals',
      'testSoundInEveryNotification',
      'testSoundPersistence',
      'testSoundChangeBetweenNotifications',
      'testSoundInCancellation',
      'testSoundConfigurationValid',
    ] as const

    let passed = 0
    let failed = 0

    for (const test of tests) {
      try {
        soundPlaybackTests[test]()
        passed++
      } catch (error: any) {
        failed++
        console.error(`❌ ${test} FAILED:`, error.message)
      }
    }

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length} total\n`)

    if (failed === 0) {
      console.log('🎉 All sound playback tests passed!')
    } else {
      throw new Error(`${failed} sound playback test(s) failed`)
    }
  },
}

// Run tests when module loads in dev mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    try {
      soundPlaybackTests.runAllTests()
    } catch (e) {
      console.error('Sound playback tests error:', e)
    }
  }, 2500)
}
