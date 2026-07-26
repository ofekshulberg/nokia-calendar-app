import {
  getNextNotificationDate,
  validateNotificationOptions,
  VIBRATION_PATTERN,
  scheduleNotification,
  cancelNotification,
  NotificationOptions,
} from './NotificationService'

// Test suite for NotificationService
export const notificationTests = {
  // Test 1: getNextNotificationDate - daily repetition
  testDailyRepetition: () => {
    const baseDate = new Date('2026-07-26T09:00:00')
    const nextDate = getNextNotificationDate(baseDate, 'daily')
    const expected = new Date('2026-07-27T09:00:00')

    if (nextDate.getTime() !== expected.getTime()) {
      throw new Error(
        `Daily repetition failed: expected ${expected.toISOString()}, got ${nextDate.toISOString()}`
      )
    }
    console.log('✅ Test 1 PASSED: Daily repetition works correctly')
  },

  // Test 2: getNextNotificationDate - weekly repetition
  testWeeklyRepetition: () => {
    const baseDate = new Date('2026-07-26T09:00:00')
    const nextDate = getNextNotificationDate(baseDate, 'weekly')
    const expected = new Date('2026-08-02T09:00:00')

    if (nextDate.getTime() !== expected.getTime()) {
      throw new Error(
        `Weekly repetition failed: expected ${expected.toISOString()}, got ${nextDate.toISOString()}`
      )
    }
    console.log('✅ Test 2 PASSED: Weekly repetition works correctly')
  },

  // Test 3: getNextNotificationDate - monthly repetition
  testMonthlyRepetition: () => {
    const baseDate = new Date('2026-07-26T09:00:00')
    const nextDate = getNextNotificationDate(baseDate, 'monthly')
    const expected = new Date('2026-08-26T09:00:00')

    if (nextDate.getTime() !== expected.getTime()) {
      throw new Error(
        `Monthly repetition failed: expected ${expected.toISOString()}, got ${nextDate.toISOString()}`
      )
    }
    console.log('✅ Test 3 PASSED: Monthly repetition works correctly')
  },

  // Test 4: getNextNotificationDate - once (no change)
  testOnceRepetition: () => {
    const baseDate = new Date('2026-07-26T09:00:00')
    const nextDate = getNextNotificationDate(baseDate, 'once')

    if (nextDate.getTime() !== baseDate.getTime()) {
      throw new Error(
        `Once repetition failed: date should not change, got ${nextDate.toISOString()}`
      )
    }
    console.log('✅ Test 4 PASSED: Once (no repeat) works correctly')
  },

  // Test 5: Vibration pattern validation
  testVibrationPattern: () => {
    if (!Array.isArray(VIBRATION_PATTERN)) {
      throw new Error('Vibration pattern should be an array')
    }
    if (VIBRATION_PATTERN.length !== 2) {
      throw new Error(`Vibration pattern should have 2 values, got ${VIBRATION_PATTERN.length}`)
    }
    if (VIBRATION_PATTERN[0] !== 200) {
      throw new Error(`First vibration duration should be 200ms, got ${VIBRATION_PATTERN[0]}ms`)
    }
    if (VIBRATION_PATTERN[1] !== 100) {
      throw new Error(`Pause duration should be 100ms, got ${VIBRATION_PATTERN[1]}ms`)
    }
    console.log('✅ Test 5 PASSED: Vibration pattern is correct (200ms on, 100ms off)')
  },

  // Test 6: Validate notification options - valid
  testValidNotificationOptions: () => {
    const options: NotificationOptions = {
      id: '123',
      title: 'Test',
      message: 'Test message',
      date: '2026-07-26',
      time: '09:00',
      repetition: 'once',
    }

    const result = validateNotificationOptions(options)
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.error}`)
    }
    console.log('✅ Test 6 PASSED: Valid notification options accepted')
  },

  // Test 7: Validate notification options - missing ID
  testMissingNotificationId: () => {
    const options: any = {
      title: 'Test',
      message: 'Test message',
      date: '2026-07-26',
      time: '09:00',
      repetition: 'once',
    }

    const result = validateNotificationOptions(options)
    if (result.valid) {
      throw new Error('Should reject notification with missing ID')
    }
    if (result.error !== 'Missing notification ID') {
      throw new Error(`Expected 'Missing notification ID', got '${result.error}'`)
    }
    console.log('✅ Test 7 PASSED: Missing ID is caught')
  },

  // Test 8: Validate notification options - missing message
  testMissingNotificationMessage: () => {
    const options: any = {
      id: '123',
      title: 'Test',
      date: '2026-07-26',
      time: '09:00',
      repetition: 'once',
    }

    const result = validateNotificationOptions(options)
    if (result.valid) {
      throw new Error('Should reject notification with missing message')
    }
    if (result.error !== 'Missing message') {
      throw new Error(`Expected 'Missing message', got '${result.error}'`)
    }
    console.log('✅ Test 8 PASSED: Missing message is caught')
  },

  // Test 9: Validate notification options - invalid repetition
  testInvalidRepetition: () => {
    const options: any = {
      id: '123',
      title: 'Test',
      message: 'Test message',
      date: '2026-07-26',
      time: '09:00',
      repetition: 'invalid',
    }

    const result = validateNotificationOptions(options)
    if (result.valid) {
      throw new Error('Should reject notification with invalid repetition')
    }
    if (result.error !== 'Invalid repetition type') {
      throw new Error(`Expected 'Invalid repetition type', got '${result.error}'`)
    }
    console.log('✅ Test 9 PASSED: Invalid repetition type is caught')
  },

  // Test 10: Validate notification options - missing date
  testMissingDate: () => {
    const options: any = {
      id: '123',
      title: 'Test',
      message: 'Test message',
      time: '09:00',
      repetition: 'once',
    }

    const result = validateNotificationOptions(options)
    if (result.valid) {
      throw new Error('Should reject notification with missing date')
    }
    if (result.error !== 'Missing date') {
      throw new Error(`Expected 'Missing date', got '${result.error}'`)
    }
    console.log('✅ Test 10 PASSED: Missing date is caught')
  },

  // Test 11: Validate notification options - missing time
  testMissingTime: () => {
    const options: any = {
      id: '123',
      title: 'Test',
      message: 'Test message',
      date: '2026-07-26',
      repetition: 'once',
    }

    const result = validateNotificationOptions(options)
    if (result.valid) {
      throw new Error('Should reject notification with missing time')
    }
    if (result.error !== 'Missing time') {
      throw new Error(`Expected 'Missing time', got '${result.error}'`)
    }
    console.log('✅ Test 11 PASSED: Missing time is caught')
  },

  // Run all tests
  runAllTests: () => {
    console.log('\n🧪 Starting NotificationService Test Suite...\n')

    const tests = [
      'testDailyRepetition',
      'testWeeklyRepetition',
      'testMonthlyRepetition',
      'testOnceRepetition',
      'testVibrationPattern',
      'testValidNotificationOptions',
      'testMissingNotificationId',
      'testMissingNotificationMessage',
      'testInvalidRepetition',
      'testMissingDate',
      'testMissingTime',
    ] as const

    let passed = 0
    let failed = 0

    for (const test of tests) {
      try {
        notificationTests[test]()
        passed++
      } catch (error: any) {
        failed++
        console.error(`❌ ${test} FAILED:`, error.message)
      }
    }

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length} total\n`)

    if (failed === 0) {
      console.log('🎉 All tests passed!')
    } else {
      throw new Error(`${failed} test(s) failed`)
    }
  },
}

// Run tests in development
if (typeof window !== 'undefined' && (window as any).__TEST_MODE__) {
  notificationTests.runAllTests()
}
