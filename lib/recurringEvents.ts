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

  // Start from the original event date and generate all occurrences
  let currentDate = new Date(startDate)
  let occurrenceIndex = 0

  // Optimize: if the start date is way before the view range, skip ahead
  if (currentDate < viewStartDate) {
    switch (baseEvent.recurrencePattern) {
      case 'weekly': {
        const daysDiff = Math.floor((viewStartDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
        const weeksDiff = Math.floor(daysDiff / 7)
        currentDate = new Date(currentDate.getTime() + (weeksDiff * 7 * 24 * 60 * 60 * 1000))
        occurrenceIndex = weeksDiff
        break
      }
      case 'biweekly': {
        const daysDiff = Math.floor((viewStartDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
        const biweeksDiff = Math.floor(daysDiff / 14)
        currentDate = new Date(currentDate.getTime() + (biweeksDiff * 14 * 24 * 60 * 60 * 1000))
        occurrenceIndex = biweeksDiff
        break
      }
      case 'monthly': {
        const originalStartDate = new Date(baseEvent.startDate)
        const targetDay = originalStartDate.getDate()
        const targetTime = {
          hours: originalStartDate.getHours(),
          minutes: originalStartDate.getMinutes(),
          seconds: originalStartDate.getSeconds(),
          milliseconds: originalStartDate.getMilliseconds()
        }
        
        while (currentDate < viewStartDate && occurrenceIndex < 1000) {
          // Move to the next month
          const newYear = currentDate.getFullYear()
          const newMonth = currentDate.getMonth() + 1
          
          // Create the date for the target day in the new month
          const nextMonthDate = new Date(newYear, newMonth, targetDay, 
            targetTime.hours, targetTime.minutes, targetTime.seconds, targetTime.milliseconds)
          
          // If the date is invalid (e.g., Feb 31 becomes Mar 3), adjust to the last day of the target month
          if (nextMonthDate.getMonth() !== (newMonth % 12)) {
            // The date rolled over, so use the last day of the intended month
            // To get last day of month X, we use new Date(year, X+1, 0)
            currentDate.setFullYear(newYear, newMonth + 1, 0) // Last day of target month
            currentDate.setHours(targetTime.hours, targetTime.minutes, targetTime.seconds, targetTime.milliseconds)
          } else {
            currentDate.setTime(nextMonthDate.getTime())
          }
          
          occurrenceIndex++
        }
        break
      }
    }
  }

  // Generate occurrences within the view range
  while (currentDate <= viewEndDate) {
    // Stop if we've reached the recurrence end date
    if (recurrenceEndDate && currentDate > recurrenceEndDate) {
      break
    }

    // Only include events that are within our view range
    if (currentDate >= viewStartDate) {
      const eventEndDate = eventDuration > 0 ? new Date(currentDate.getTime() + eventDuration) : null
      
      events.push({
        ...baseEvent,
        _id: `${baseEvent._id}-occurrence-${occurrenceIndex}`, // Use occurrence index for unique ID
        startDate: currentDate.toISOString(),
        endDate: eventEndDate ? eventEndDate.toISOString() : baseEvent.endDate,
      })
    }

    // Calculate next occurrence based on pattern
    const nextDate = new Date(currentDate)
    switch (baseEvent.recurrencePattern) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14)
        break
      case 'monthly': {
        // For monthly events, create a new date with the same day of month in the next month
        const originalStartDate = new Date(baseEvent.startDate)
        const targetDay = originalStartDate.getDate()
        const targetTime = {
          hours: originalStartDate.getHours(),
          minutes: originalStartDate.getMinutes(),
          seconds: originalStartDate.getSeconds(),
          milliseconds: originalStartDate.getMilliseconds()
        }
        
        // Move to the next month
        const newYear = nextDate.getFullYear()
        const newMonth = nextDate.getMonth() + 1
        
        // Create the date for the target day in the new month
        const nextMonthDate = new Date(newYear, newMonth, targetDay, 
          targetTime.hours, targetTime.minutes, targetTime.seconds, targetTime.milliseconds)
        
        // If the date is invalid (e.g., Feb 31 becomes Mar 3), adjust to the last day of the target month
        if (nextMonthDate.getMonth() !== (newMonth % 12)) {
          // The date rolled over, so use the last day of the intended month
          // To get last day of month X, we use new Date(year, X+1, 0)
          nextDate.setFullYear(newYear, newMonth + 1, 0) // Last day of target month
          nextDate.setHours(targetTime.hours, targetTime.minutes, targetTime.seconds, targetTime.milliseconds)
        } else {
          nextDate.setTime(nextMonthDate.getTime())
        }
        break
      }
    }
    
    currentDate = nextDate
    occurrenceIndex++

    // Safety check to prevent infinite loops
    if (occurrenceIndex > 1000) {
      console.warn('Recurring event generation stopped at 1000 occurrences to prevent infinite loop')
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
