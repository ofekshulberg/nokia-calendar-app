import { useState } from 'react'
import '../styles/YearPicker.css'

interface YearPickerProps {
  currentYear: number
  onYearSelect: (year: number) => void
  onClose: () => void
}

function YearPicker({ currentYear, onYearSelect, onClose }: YearPickerProps) {
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [inputValue, setInputValue] = useState(currentYear.toString())

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    const num = parseInt(value)
    if (!isNaN(num) && num > 1900 && num < 2100) {
      setSelectedYear(num)
    }
  }

  const handleSelect = () => {
    onYearSelect(selectedYear)
  }

  const handleIncrement = () => {
    setSelectedYear((prev) => {
      const next = prev + 1
      setInputValue(next.toString())
      return next
    })
  }

  const handleDecrement = () => {
    setSelectedYear((prev) => {
      const next = prev - 1
      setInputValue(next.toString())
      return next
    })
  }

  return (
    <div className="year-picker-overlay" onClick={onClose}>
      <div className="year-picker-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Select Year</h2>
        <div className="year-picker-controls">
          <button className="year-decrement" onClick={handleDecrement}>
            −
          </button>
          <input
            type="text"
            className="year-input"
            value={inputValue}
            onChange={handleYearChange}
            maxLength={4}
          />
          <button className="year-increment" onClick={handleIncrement}>
            +
          </button>
        </div>
        <div className="year-picker-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={handleSelect}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default YearPicker