import { useState } from 'react'
import CalendarGrid from '../components/CalendarGrid'
import SettingsButton from '../components/SettingsButton'
import SettingsModal from '../components/SettingsModal'
import YearPicker from '../components/YearPicker'
import '../styles/Calendar.css'

interface CalendarProps {
  onDateSelect: (dateString: string) => void
}

function Calendar({ onDateSelect }: CalendarProps) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1))
    setShowYearPicker(false)
  }

  const isCurrentMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth()

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const monthTitle = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div className="title-bar">
          <h1 className="calendar-title">{monthTitle}</h1>
          <SettingsButton onClick={() => setShowSettings(true)} />
        </div>

        <div className="calendar-nav-controls">
          <button className="nav-arrow" onClick={handlePrevMonth}>
            ←
          </button>
          <div className="year-selector">
            <button className="year-button" onClick={() => setShowYearPicker(true)}>
              {currentDate.getFullYear()}
            </button>
          </div>
          <button className="nav-arrow" onClick={handleNextMonth}>
            →
          </button>
        </div>
      </div>

      <CalendarGrid currentDate={currentDate} highlightToday={isCurrentMonth} onDateSelect={onDateSelect} />

      {showYearPicker && (
        <YearPicker
          currentYear={currentDate.getFullYear()}
          onYearSelect={handleYearChange}
          onClose={() => setShowYearPicker(false)}
        />
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}

export default Calendar