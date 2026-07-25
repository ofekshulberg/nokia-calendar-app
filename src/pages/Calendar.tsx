import { useState } from 'react'
import CalendarGrid from '../components/CalendarGrid'
import MonthNavigation from '../components/MonthNavigation'
import YearPicker from '../components/YearPicker'
import SettingsButton from '../components/SettingsButton'
import SettingsModal from '../components/SettingsModal'
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

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <MonthNavigation
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onYearClick={() => setShowYearPicker(true)}
        />
        <SettingsButton onClick={() => setShowSettings(true)} />
      </div>

      <CalendarGrid
        currentDate={currentDate}
        highlightToday={isCurrentMonth}
        onDateSelect={onDateSelect}
      />

      {showYearPicker && (
        <YearPicker
          currentYear={currentDate.getFullYear()}
          onYearSelect={handleYearChange}
          onClose={() => setShowYearPicker(false)}
        />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default Calendar