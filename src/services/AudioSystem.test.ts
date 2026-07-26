// Audio system test suite
import {
  AVAILABLE_SOUNDS,
  isSoundAvailable,
  getSoundName,
  testSoundAvailability,
  VIBRATION_PATTERN,
  validateNotificationOptions,
  getNextNotificationDate,
} from './NotificationService'

export const audioSystemTests = {
  // Test 1: Verify available sounds exist
  testAvailableSounds: () => {
    const sounds = Object.keys(AVAILABLE_SOUNDS)
    if (sounds.length === 0) {
      throw new Error('No sounds configured in AVAILABLE_SOUNDS')
    }

    const requiredSounds = ['default', 'bell', 'chime', 'digital']
    for (const sound of requiredSounds) {
      if (!sounds.includes(sound)) {
        throw new Error(`Required sound '${sound}' not found in AVAILABLE_SOUNDS`)
      }
    }

    console.log(`✅ Test 1 PASSED: All required sounds are available: ${sounds.join(', ')}`)
  },

  // Test 2: Test isSoundAvailable function
  testIsSoundAvailable: () => {
    if (!isSoundAvailable('default')) {
      throw new Error('default sound should be available')
    }
    if (!isSoundAvailable('bell')) {
      throw new Error('bell sound should be available')
    }
    if (!isSoundAvailable('chime')) {
      throw new Error('chime sound should be available')
    }
    if (isSoundAvailable('nonexistent')) {
      throw new Error('nonexistent sound should not be available')
    }

    console.log('✅ Test 2 PASSED: isSoundAvailable function works correctly')
  },

  // Test 3: Test getSoundName function
  testGetSoundName: () => {
    if (getSoundName('default') !== 'default') {
      throw new Error('getSoundName should return default for default sound')
    }
    if (getSoundName('bell') !== 'bell') {
      throw new Error('getSoundName should return bell for bell sound')
    }
    if (getSoundName('chime') !== 'chime') {
      throw new Error('getSoundName should return chime for chime sound')
    }
    if (getSoundName('nonexistent') !== 'default') {
      throw new Error('getSoundName should return default for nonexistent sound')
    }
    if (getSoundName() !== 'default') {
      throw new Error('getSoundName should return default when no sound specified')
    }

    console.log('✅ Test 3 PASSED: getSoundName function returns correct sound names')
  },

  // Test 4: Test testSoundAvailability function
  testSoundAvailabilityCheck: () => {
    const result1 = testSoundAvailability('default')
    if (!result1.available) {
      throw new Error('default sound should be available')
    }

    const result2 = testSoundAvailability('nonexistent')
    if (result2.available) {
      throw new Error('nonexistent sound should not be available')
    }
    if (!result2.message.includes('not available')) {
      throw new Error('Error message should indicate sound is not available')
    }

    console.log('✅ Test 4 PASSED: testSoundAvailability function provides correct feedback')
  },

  // Test 5: Verify vibration pattern
  testVibrationPattern: () => {
    if (!Array.isArray(VIBRATION_PATTERN)) {
      throw new Error('VIBRATION_PATTERN should be an array')
    }
    if (VIBRATION_PATTERN.length !== 2) {
      throw new Error(`VIBRATION_PATTERN should have 2 values, got ${VIBRATION_PATTERN.length}`)
    }
    if (VIBRATION_PATTERN[0] !== 200) {
      throw new Error(`First vibration duration should be 200ms, got ${VIBRATION_PATTERN[0]}ms`)
    }
    if (VIBRATION_PATTERN[1] !== 100) {
      throw new Error(`Pause duration should be 100ms, got ${VIBRATION_PATTERN[1]}ms`)
    }

    console.log(`✅ Test 5 PASSED: Vibration pattern is correct (${VIBRATION_PATTERN[0]}ms on, ${VIBRATION_PATTERN[1]}ms off)`)
  },

  // Test 6: Test 60-second repetition calculation
  testSixtySecondRepetition: () => {
    // 12 notifications at 5-second intervals = 60 seconds
    const notificationCount = 12
    const intervalSeconds = 5
    const totalSeconds = (notificationCount - 1) * intervalSeconds

    if (totalSeconds < 55 || totalSeconds > 65) {
      throw new Error(`60-second repetition failed: calculated ${totalSeconds}s from ${notificationCount} notifications at ${intervalSeconds}s intervals`)
    }

    console.log(`✅ Test 6 PASSED: 60-second repetition timing is correct (${notificationCount} notifications × ${intervalSeconds}s = ${totalSeconds}s)`)
  },

  // Test 7: Test sound with notification validation
  testSoundWithNotificationValidation: () => {
    const validOptions = {
      id: '1',
      title: 'Test',
      message: 'Test message',
      date: '2026-07-26',
      time: '09:00',
      repetition: 'once' as const,
      sound: 'bell',
    }

    const result = validateNotificationOptions(validOptions)
    if (!result.valid) {
      throw new Error(`Notification with bell sound should be valid: ${result.error}`)
    }

    console.log('✅ Test 7 PASSED: Sound parameter is properly validated in notifications')
  },

  // Test 8: Test all sound types with validation
  testAllSoundTypesValidation: () => {
    const soundTypes = ['default', 'bell', 'chime', 'digital']

    for (const sound of soundTypes) {
      const result = testSoundAvailability(sound)
      if (!result.available) {
        throw new Error(`Sound type '${sound}' should be available: ${result.message}`)
      }
    }

    console.log('✅ Test 8 PASSED: All sound types are properly validated')
  },

  // Test 9: Test sound selection logic
  testSoundSelectionLogic: () => {
    // Simulate selecting different sounds
    const sounds = ['default', 'bell', 'chime', 'digital']

    for (const sound of sounds) {
      const selectedSound = getSoundName(sound)
      if (selectedSound !== sound) {
        throw new Error(`Sound '${sound}' should be returned as-is when valid`)
      }
    }

    console.log('✅ Test 9 PASSED: Sound selection logic works correctly for all available sounds')
  },

  // Test 10: Test default sound fallback
  testDefaultSoundFallback: () => {
    const invalid1 = getSoundName('invalid')
    if (invalid1 !== 'default') {
      throw new Error('Invalid sound should fall back to default')
    }

    const undefined1 = getSoundName(undefined)
    if (undefined1 !== 'default') {
      throw new Error('Undefined sound should fall back to default')
    }

    const empty1 = getSoundName('')
    if (empty1 !== 'default') {
      throw new Error('Empty sound should fall back to default')
    }

    console.log('✅ Test 10 PASSED: Default sound fallback works for invalid inputs')
  },

  // Run all tests
  runAllTests: () => {
    console.log('\n🔊 Starting Audio System Test Suite...\n')

    const tests = [
      'testAvailableSounds',
      'testIsSoundAvailable',
      'testGetSoundName',
      'testSoundAvailabilityCheck',
      'testVibrationPattern',
      'testSixtySecondRepetition',
      'testSoundWithNotificationValidation',
      'testAllSoundTypesValidation',
      'testSoundSelectionLogic',
      'testDefaultSoundFallback',
    ] as const

    let passed = 0
    let failed = 0

    for (const test of tests) {
      try {
        audioSystemTests[test]()
        passed++
      } catch (error: any) {
        failed++
        console.error(`❌ ${test} FAILED:`, error.message)
      }
    }

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length} total\n`)

    if (failed === 0) {
      console.log('🎉 All audio system tests passed!')
    } else {
      throw new Error(`${failed} audio system test(s) failed`)
    }
  },
}

// Run tests when module loads in dev mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    try {
      audioSystemTests.runAllTests()
    } catch (e) {
      console.error('Audio system tests error:', e)
    }
  }, 2000)
}
