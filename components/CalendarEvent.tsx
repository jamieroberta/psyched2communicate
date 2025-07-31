import { Event } from '@/lib/sanity'

interface CalendarEventProps {
  event: Event
  onClick?: () => void
}

export default function CalendarEvent({ event, onClick }: CalendarEventProps) {
  const startDate = new Date(event.startDate)
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Get region color or default color for events with no region
  const getEventColor = (event: Event) => {
    if (event.region?.color) {
      return event.region.color
    }
    return '#6B7280' // Default gray for events with no region
  }

  const eventColor = getEventColor(event)
  
  // Convert hex to RGB for background opacity
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 107, g: 114, b: 128 } // Default gray
  }

  const rgb = hexToRgb(eventColor)
  const backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
  const borderColor = eventColor

  return (
    <div 
      className="text-xs p-1 rounded border-l-2 truncate cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
      style={{
        backgroundColor,
        borderLeftColor: borderColor
      }}
      title={`${event.title} - ${formatTime(startDate)} ${event.region?.name ? `(${event.region.name})` : '(No Region)'}`}
      onClick={onClick}
    >
      <div className="font-medium text-gray-900 truncate">
        {event.title}
      </div>
      <div className="text-gray-600 flex items-center gap-1">
        <span>{formatTime(startDate)}</span>
        {event.region?.name && (
          <>
            <span>•</span>
            <span className="truncate">{event.region.name}</span>
          </>
        )}
      </div>
    </div>
  )
}