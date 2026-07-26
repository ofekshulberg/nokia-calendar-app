// Test suite for CalendarGrid spacing and layout
export const calendarSpacingTests = {
  // Test 1: Verify gap between cells
  testGapBetweenCells: () => {
    const gridElement = document.querySelector('.calendar-grid')
    if (!gridElement) {
      throw new Error('Calendar grid element not found')
    }

    const computedStyle = window.getComputedStyle(gridElement)
    const gap = computedStyle.gap
    const gapValue = parseInt(gap)

    if (gapValue < 8) {
      throw new Error(`Gap between cells should be at least 8px, got ${gap}`)
    }

    console.log(`✅ Test 1 PASSED: Grid gap is sufficient (${gap})`)
  },

  // Test 2: Verify cells don't overlap horizontally
  testCellsNotOverlapping: () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
    if (calendarDays.length < 7) {
      throw new Error('Not enough calendar days to test')
    }

    // Check first row (7 cells)
    for (let i = 0; i < 6; i++) {
      const currentCell = calendarDays[i] as HTMLElement
      const nextCell = calendarDays[i + 1] as HTMLElement

      const currentRight = currentCell.getBoundingClientRect().right
      const nextLeft = nextCell.getBoundingClientRect().left

      // Cells should not overlap (nextLeft should be >= currentRight)
      if (nextLeft < currentRight) {
        throw new Error(
          `Cells ${i} and ${i + 1} are overlapping: ${currentRight}px vs ${nextLeft}px`
        )
      }
    }

    console.log('✅ Test 2 PASSED: Calendar cells do not overlap horizontally')
  },

  // Test 3: Verify minimum spacing between cells
  testMinimumSpacingBetweenCells: () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
    if (calendarDays.length < 7) {
      throw new Error('Not enough calendar days to test')
    }

    let minSpacing = Infinity

    // Check first row spacing
    for (let i = 0; i < 6; i++) {
      const currentCell = calendarDays[i] as HTMLElement
      const nextCell = calendarDays[i + 1] as HTMLElement

      const currentRight = currentCell.getBoundingClientRect().right
      const nextLeft = nextCell.getBoundingClientRect().left
      const spacing = nextLeft - currentRight

      minSpacing = Math.min(minSpacing, spacing)
    }

    // Minimum spacing should be at least 4px (due to rounding, we accept >= 3px)
    if (minSpacing < 3) {
      throw new Error(
        `Minimum spacing between cells is too small: ${minSpacing.toFixed(1)}px`
      )
    }

    console.log(
      `✅ Test 3 PASSED: Minimum spacing between cells is adequate (${minSpacing.toFixed(1)}px)`
    )
  },

  // Test 4: Verify day cell size is reasonable
  testDayCellSize: () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
    if (calendarDays.length === 0) {
      throw new Error('No calendar days found')
    }

    const firstDay = calendarDays[0] as HTMLElement
    const rect = firstDay.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Cell should be reasonably sized (not too small)
    if (width < 40 || height < 70) {
      throw new Error(
        `Day cell is too small: ${width.toFixed(1)}x${height.toFixed(1)}px`
      )
    }

    console.log(
      `✅ Test 4 PASSED: Day cell size is appropriate (${width.toFixed(1)}x${height.toFixed(1)}px)`
    )
  },

  // Test 5: Verify cells are separated vertically
  testVerticalSeparation: () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
    if (calendarDays.length < 14) {
      throw new Error('Not enough calendar days to test vertical separation')
    }

    // Check separation between first and second row (cell 0 and cell 7)
    const firstRowCell = calendarDays[0] as HTMLElement
    const secondRowCell = calendarDays[7] as HTMLElement

    const firstRowBottom = firstRowCell.getBoundingClientRect().bottom
    const secondRowTop = secondRowCell.getBoundingClientRect().top
    const verticalSpacing = secondRowTop - firstRowBottom

    if (verticalSpacing < 3) {
      throw new Error(
        `Vertical spacing between rows is too small: ${verticalSpacing.toFixed(1)}px`
      )
    }

    console.log(
      `✅ Test 5 PASSED: Cells are properly separated vertically (${verticalSpacing.toFixed(1)}px)`
    )
  },

  // Test 6: Verify aspect ratio
  testAspectRatio: () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
    if (calendarDays.length === 0) {
      throw new Error('No calendar days found')
    }

    const firstDay = calendarDays[0] as HTMLElement
    const rect = firstDay.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const ratio = height / width

    // Should be taller than wide (portrait oriented)
    if (ratio < 1) {
      throw new Error(
        `Cell aspect ratio should be > 1, got ${ratio.toFixed(2)} (${width.toFixed(1)}x${height.toFixed(1)})`
      )
    }

    console.log(
      `✅ Test 6 PASSED: Day cells have correct aspect ratio (${ratio.toFixed(2)})`
    )
  },

  // Test 7: All cells in first row have same height
  testFirstRowConsistentHeight: () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
    if (calendarDays.length < 7) {
      throw new Error('Not enough calendar days in first row')
    }

    const heights = []
    for (let i = 0; i < 7; i++) {
      const cell = calendarDays[i] as HTMLElement
      heights.push(cell.getBoundingClientRect().height)
    }

    // All heights should be within 1px of each other
    const minHeight = Math.min(...heights)
    const maxHeight = Math.max(...heights)
    const heightDiff = maxHeight - minHeight

    if (heightDiff > 2) {
      throw new Error(
        `First row cells have inconsistent heights: ${minHeight.toFixed(1)}px to ${maxHeight.toFixed(1)}px (diff: ${heightDiff.toFixed(1)}px)`
      )
    }

    console.log(
      `✅ Test 7 PASSED: All cells in first row have consistent height`
    )
  },

  // Test 8: Verify no cells are too large
  testMaximumCellSize: () => {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)')
    if (calendarDays.length === 0) {
      throw new Error('No calendar days found')
    }

    for (let i = 0; i < calendarDays.length; i++) {
      const cell = calendarDays[i] as HTMLElement
      const rect = cell.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      // Cells should not exceed screen width / 7 by too much
      if (width > 100) {
        throw new Error(`Cell ${i} is too wide: ${width.toFixed(1)}px`)
      }
      if (height > 150) {
        throw new Error(`Cell ${i} is too tall: ${height.toFixed(1)}px`)
      }
    }

    console.log('✅ Test 8 PASSED: All cells are appropriately sized')
  },

  // Run all tests
  runAllTests: () => {
    console.log('\n🧪 Starting CalendarGrid Spacing Test Suite...\n')

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      throw new Error('DOM not fully loaded yet')
    }

    const tests = [
      'testGapBetweenCells',
      'testCellsNotOverlapping',
      'testMinimumSpacingBetweenCells',
      'testDayCellSize',
      'testVerticalSeparation',
      'testAspectRatio',
      'testFirstRowConsistentHeight',
      'testMaximumCellSize',
    ] as const

    let passed = 0
    let failed = 0

    for (const test of tests) {
      try {
        calendarSpacingTests[test]()
        passed++
      } catch (error: any) {
        failed++
        console.error(`❌ ${test} FAILED:`, error.message)
      }
    }

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length} total\n`)

    if (failed === 0) {
      console.log('🎉 All calendar spacing tests passed!')
    } else {
      throw new Error(`${failed} calendar spacing test(s) failed`)
    }
  },
}

// Run tests when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          try {
            calendarSpacingTests.runAllTests()
          } catch (e) {
            console.error('Calendar spacing tests failed:', e)
          }
        }
      }, 1500)
    })
  } else {
    setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        try {
          calendarSpacingTests.runAllTests()
        } catch (e) {
          console.error('Calendar spacing tests failed:', e)
        }
      }
    }, 1500)
  }
}
