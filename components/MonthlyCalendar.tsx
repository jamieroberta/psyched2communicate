'use client'

import { useState } from 'react'
import { Event } from '@/lib/sanity'
import CalendarEvent from './CalendarEvent'
import EventModal from './EventModal'

interface MonthlyCalendarProps {
  events: Event[]
}

export default function MonthlyCalendar({ events }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and calculate calendar grid
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate()

  // Calculate previous month's trailing days
  const prevMonth = new Date(year, month - 1, 0)
  const prevMonthDays = prevMonth.getDate()
  const trailingDays = firstDayOfWeek

  // Calculate next month's leading days
  const totalCells = 42 // 6 weeks × 7 days
  const leadingDays = totalCells - (trailingDays + daysInMonth)

  // Generate calendar days
  const calendarDays = []

  // Previous month days
  for (let i = trailingDays - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonthDays - i,
      isCurrentMonth: false,
      isPrevMonth: true,
      fullDate: new Date(year, month - 1, prevMonthDays - i)
    })
  }

  // Current month days
  for (let date = 1; date <= daysInMonth; date++) {
    calendarDays.push({
      date,
      isCurrentMonth: true,
      isPrevMonth: false,
      fullDate: new Date(year, month, date)
    })
  }

  // Next month days
  for (let date = 1; date <= leadingDays; date++) {
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isPrevMonth: false,
      fullDate: new Date(year, month + 1, date)
    })
  }

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const eventDate = new Date(event.startDate)
    const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  const getEventsForDay = (date: Date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    return eventsByDate[dateKey] || []
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1))
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const today = new Date()
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day.fullDate)
          return (
            <div
              key={index}
              className={`min-h-[120px] border-r border-b p-2 relative ${
                !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
              } ${isToday(day.fullDate) ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday(day.fullDate) ? 'text-blue-600' : ''
              }`}>
                {day.date}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <CalendarEvent 
                    key={event._id} 
                    event={event} 
                    onClick={() => handleEventClick(event)}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div 
                    className="text-xs text-gray-500 font-medium cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => {
                      // Show the first remaining event when clicking "+X more"
                      if (dayEvents[3]) {
                        handleEventClick(dayEvents[3])
                      }
                    }}
                    title={`Click to see more events (${dayEvents.slice(3).map(e => e.title).join(', ')})`}
                  >
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Event Modal */}
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}