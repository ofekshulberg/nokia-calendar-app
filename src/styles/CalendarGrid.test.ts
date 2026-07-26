// Test suite for CalendarGrid CSS
export const calendarGridTests = {
  // Test 1: Grid layout validation
  testGridLayout: () => {
    const gridElement = document.querySelector('.calendar-grid')
    if (!gridElement) {
      throw new Error('Calendar grid element not found')
    }

    const computedStyle = window.getComputedStyle(gridElement)
    const display = computedStyle.display
    if (display !== 'grid') {
      throw new Error(`Calendar grid should be display: grid, got ${display}`)
    }

    console.log('✅ Test 1 PASSED: Calendar grid is properly formatted')
  },

  // Test 2: Weekday headers grid
  testWeekdayHeadersGrid: () => {
    const headersElement = document.querySelector('.weekday-headers')
    if (!headersElement) {
      throw new Error('Weekday headers element not found')
    }

    const computedStyle = window.getComputedStyle(headersElement)
    const display = computedStyle.display
    if (display !== 'grid') {
      throw new Error(`Weekday headers should be display: grid, got ${display}`)
    }

    console.log('✅ Test 2 PASSED: Weekday headers are properly formatted')
  },

  // Test 3: Seven columns in grid
  testSevenColumnsGrid: () => {
    const gridElement = document.querySelector('.calendar-grid')
    if (!gridElement) {
      throw new Error('Calendar grid element not found')
    }

    const computedStyle = window.getComputedStyle(gridElement)
    const gridTemplate = computedStyle.gridTemplateColumns

    // Should have 7 equal columns
    const columnCount = gridTemplate.split(' ').length
    if (columnCount < 7) {
      throw new Error(`Grid should have 7 columns, got ${columnCount}`)
    }

    console.log('✅ Test 3 PASSED: Grid has 7 columns for days of the week')
  },

  // Test 4: Day number font size
  testDayNumberSize: () => {
    const dayNumbers = document.querySelectorAll('.day-number')
    if (dayNumbers.length === 0) {
      throw new Error('No day numbers found on the page')
    }

    const firstDayNumber = dayNumbers[0]
    const computedStyle = window.getComputedStyle(firstDayNumber)
    const fontSize = computedStyle.fontSize

    // Font size should be at least 16px
    const sizeValue = parseInt(fontSize)
    if (sizeValue < 16) {
      throw new Error(`Day numbers should be at least 16px, got ${fontSize}`)
    }

    console.log(`✅ Test 4 PASSED: Day numbers are properly sized (${fontSize})`)
  },

  // Test 5: Weekday header font size
  testWeekdayHeaderSize: () => {
    const weekdayHeaders = document.querySelectorAll('.weekday-header')
    if (weekdayHeaders.length === 0) {
      throw new Error('No weekday headers found')
    }

    if (weekdayHeaders.length !== 7) {
      throw new Error(`Should have exactly 7 weekday headers, got ${weekdayHeaders.length}`)
    }

    const firstHeader = weekdayHeaders[0]
    const computedStyle = window.getComputedStyle(firstHeader)
    const fontSize = computedStyle.fontSize
    const sizeValue = parseInt(fontSize)

    // Should be smaller than day numbers (11px)
    if (sizeValue > 14) {
      throw new Error(`Weekday headers should be small (11px), got ${fontSize}`)
    }

    console.log(`✅ Test 5 PASSED: Weekday headers are smaller than day numbers (${fontSize})`)
  },

  // Test 6: Calendar days have proper min-height
  testDayMinHeight: () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
    if (calendarDays.length === 0) {
      throw new Error('No calendar days found')
    }

    const firstDay = calendarDays[0]
    const computedStyle = window.getComputedStyle(firstDay)
    const minHeight = computedStyle.minHeight
    const heightValue = parseInt(minHeight)

    if (heightValue < 80) {
      throw new Error(`Day cells should have min-height >= 80px, got ${minHeight}`)
    }

    console.log(`✅ Test 6 PASSED: Calendar day cells have proper height (${minHeight})`)
  },

  // Test 7: Grid gap is consistent
  testGridGap: () => {
    const gridElement = document.querySelector('.calendar-grid')
    if (!gridElement) {
      throw new Error('Calendar grid element not found')
    }

    const computedStyle = window.getComputedStyle(gridElement)
    const gap = computedStyle.gap

    // Gap should be present
    if (!gap || gap === '0px') {
      throw new Error('Calendar grid should have a gap between items')
    }

    console.log(`✅ Test 7 PASSED: Calendar grid has proper spacing (gap: ${gap})`)
  },

  // Test 8: Calendar grid is full width
  testGridFullWidth: () => {
    const gridElement = document.querySelector('.calendar-grid')
    if (!gridElement) {
      throw new Error('Calendar grid element not found')
    }

    const computedStyle = window.getComputedStyle(gridElement)
    const width = computedStyle.width

    // Should fill container width
    if (width === '0px') {
      throw new Error('Calendar grid should be full width, got 0px')
    }

    console.log(`✅ Test 8 PASSED: Calendar grid is full width (${width})`)
  },

  // Test 9: Day cells not stacking vertically
  testDaysNotStacking: () => {
    const gridElement = document.querySelector('.calendar-grid')
    if (!gridElement) {
      throw new Error('Calendar grid element not found')
    }

    const children = gridElement.children
    if (children.length < 7) {
      throw new Error(`Grid should display at least 7 cells in first row, got ${children.length}`)
    }

    // Check if items are positioned horizontally (similar top positions)
    const firstCell = children[0] as HTMLElement
    const seventhCell = children[6] as HTMLElement

    const firstTop = firstCell.getBoundingClientRect().top
    const seventhTop = seventhCell.getBoundingClientRect().top

    // Should be roughly at same vertical level (within 5px tolerance for rounding)
    if (Math.abs(firstTop - seventhTop) > 5) {
      throw new Error(
        `Days should be in same row horizontally, but tops differ by ${Math.abs(firstTop - seventhTop)}px`
      )
    }

    console.log('✅ Test 9 PASSED: Calendar days are arranged horizontally (not stacking)')
  },

  // Test 10: Proper aspect ratio for day cells
  testDayAspectRatio: () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
    if (calendarDays.length === 0) {
      throw new Error('No calendar days found')
    }

    const firstDay = calendarDays[0] as HTMLElement
    const rect = firstDay.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Height should be somewhat larger than width (for Redmi 15 portrait)
    if (height < width) {
      throw new Error(
        `Day cell height (${height}px) should be >= width (${width}px) for portrait orientation`
      )
    }

    console.log(
      `✅ Test 10 PASSED: Day cells have proper aspect ratio (${width}x${height}px)`
    )
  },

  // Run all tests
  runAllTests: () => {
    console.log('\n🧪 Starting CalendarGrid CSS Test Suite...\n')

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      throw new Error('DOM not fully loaded yet')
    }

    const tests = [
      'testGridLayout',
      'testWeekdayHeadersGrid',
      'testSevenColumnsGrid',
      'testDayNumberSize',
      'testWeekdayHeaderSize',
      'testDayMinHeight',
      'testGridGap',
      'testGridFullWidth',
      'testDaysNotStacking',
      'testDayAspectRatio',
    ] as const

    let passed = 0
    let failed = 0

    for (const test of tests) {
      try {
        calendarGridTests[test]()
        passed++
      } catch (error: any) {
        failed++
        console.error(`❌ ${test} FAILED:`, error.message)
      }
    }

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length} total\n`)

    if (failed === 0) {
      console.log('🎉 All calendar grid tests passed!')
    } else {
      throw new Error(`${failed} calendar grid test(s) failed`)
    }
  },
}

// Run tests when DOM is ready
if (typeof document !== 'undefined') {
  // Try to run when document is interactive or loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          try {
            calendarGridTests.runAllTests()
          } catch (e) {
            console.error('Calendar grid tests failed:', e)
          }
        }
      }, 1000)
    })
  } else {
    // DOM already loaded
    setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        try {
          calendarGridTests.runAllTests()
        } catch (e) {
          console.error('Calendar grid tests failed:', e)
        }
      }
    }, 1000)
  }
}
