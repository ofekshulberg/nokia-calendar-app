import { useNotifications } from '../context/NotificationContext'
import '../styles/CalendarGrid.css'

interface CalendarGridProps {
  currentDate: Date
  highlightToday: boolean
  onDateSelect: (dateString: string) => void
}

function CalendarGrid({
  currentDate,
  highlightToday,
  onDateSelect,
}: CalendarGridProps) {
  const { getNotificationsForDate } = useNotifications()
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay() // 0 = Sunday

  const days = []
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const todayDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="calendar-grid-container">
      <div className="weekday-headers">
        {dayNames.map((day) => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day empty"></div>
          }

          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isToday = highlightToday && dateString === todayDate
          const dayNotifications = getNotificationsForDate(dateString)

          return (
            <button
              key={dateString}
              className={`calendar-day ${isToday ? 'today' : ''}`}
              onClick={() => onDateSelect(dateString)}
            >
              <div className="day-number">{day}</div>
              <div className="day-notifications">
                {dayNotifications.slice(0, 2).map((notif, i) => (
                  <div key={i} className="notification-badge">
                    {notif.time}
                  </div>
                ))}
                {dayNotifications.length > 2 && (
                  <div className="notification-more">+{dayNotifications.length - 2}</div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarGrid