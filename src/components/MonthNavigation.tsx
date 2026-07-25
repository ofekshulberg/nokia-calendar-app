import '../styles/MonthNavigation.css'

interface MonthNavigationProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onYearClick: () => void
}

function MonthNavigation({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onYearClick,
}: MonthNavigationProps) {
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' })
  const year = currentDate.getFullYear()

  return (
    <div className="month-navigation">
      <button className="nav-arrow prev" onClick={onPrevMonth}>
        ←
      </button>
      <div className="month-year-display">
        <h1 className="month-title">{monthName}</h1>
        <button className="year-button" onClick={onYearClick}>
          {year}
        </button>
      </div>
      <button className="nav-arrow next" onClick={onNextMonth}>
        →
      </button>
    </div>
  )
}

export default MonthNavigation