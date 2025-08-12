import { Event } from '@/lib/sanity'

/**
 * Generates recurring events based on the recurrence pattern
 * @param baseEvent The original event with recurrence settings
 * @param viewStartDate Start date for the view range
 * @param viewEndDate End date for the view range
 * @returns Array of events including all recurring instances within the view range
 */
export function generateRecurringEvents(baseEvent: Event, viewStartDate: Date, viewEndDate: Date): Event[] {
  if (!baseEvent.isRecurring || !baseEvent.recurrencePattern) {
    return [baseEvent]
  }

  const events: Event[] = []
  const startDate = new Date(baseEvent.startDate)
  const endDate = baseEvent.endDate ? new Date(baseEvent.endDate) : null
  const eventDuration = endDate ? endDate.getTime() - startDate.getTime() : 0
  const recurrenceEndDate = baseEvent.recurrenceEndDate ? new Date(baseEvent.recurrenceEndDate) : null

  let currentDate = new Date(startDate)

  // Generate occurrences within the view range
  while (currentDate <= viewEndDate) {
    // Stop if we've reached the recurrence end date
    if (recurrenceEndDate && currentDate > recurrenceEndDate) {
      break
    }

    // Only include events that are within or overlap with our view range
    if (currentDate >= viewStartDate && currentDate <= viewEndDate) {
      const eventEndDate = eventDuration > 0 ? new Date(currentDate.getTime() + eventDuration) : null
      
      events.push({
        ...baseEvent,
        _id: `${baseEvent._id}-${currentDate.toISOString()}`,
        startDate: currentDate.toISOString(),
        endDate: eventEndDate ? eventEndDate.toISOString() : baseEvent.endDate,
      })
    }

    // Calculate next occurrence based on pattern
    switch (baseEvent.recurrencePattern) {
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7)
        break
      case 'biweekly':
        currentDate.setDate(currentDate.getDate() + 14)
        break
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1)
        break
    }
  }

  return events
}

/**
 * Expands a list of events to include all recurring instances within a date range
 * @param events Array of base events
 * @param viewStartDate Start date for the view range
 * @param viewEndDate End date for the view range
 * @returns Array of events including all recurring instances
 */
export function expandRecurringEvents(events: Event[], viewStartDate: Date, viewEndDate: Date): Event[] {
  return events.flatMap(event => generateRecurringEvents(event, viewStartDate, viewEndDate))
}

/**
 * Gets a reasonable date range for generating recurring events
 * @param monthsBack Number of months to look back (default: 6)
 * @param monthsForward Number of months to look forward (default: 12)
 * @returns Object with viewStartDate and viewEndDate
 */
export function getRecurringEventsDateRange(monthsBack: number = 6, monthsForward: number = 12) {
  const viewStartDate = new Date()
  viewStartDate.setMonth(viewStartDate.getMonth() - monthsBack)
  
  const viewEndDate = new Date()
  viewEndDate.setMonth(viewEndDate.getMonth() + monthsForward)
  
  return { viewStartDate, viewEndDate }
}
