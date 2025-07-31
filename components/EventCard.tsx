import Image from 'next/image'
import Link from 'next/link'
import { Event, urlFor } from '@/lib/sanity'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : null
  const isUpcoming = startDate > new Date()
  const isPast = startDate < new Date()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      training: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      meeting: 'bg-gray-100 text-gray-800',
      conference: 'bg-purple-100 text-purple-800',
      social: 'bg-pink-100 text-pink-800',
      other: 'bg-yellow-100 text-yellow-800'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${isPast ? 'opacity-75' : ''}`}>
      {event.image && (
        <div className="relative h-48 w-full">
          <Image
            src={urlFor(event.image).width(400).height(200).url()}
            alt={event.title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>
              {isUpcoming && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Upcoming
                </span>
              )}
              {isPast && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Past Event
                </span>
              )}
            </div>
          </div>
        </div>

        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>
              {formatDate(startDate)} at {formatTime(startDate)}
              {endDate && ` - ${endDate.toDateString() === startDate.toDateString() ? formatTime(endDate) : formatDate(endDate)}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>
              {event.isVirtual ? 'Virtual Event' : event.location || 'Location TBD'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            <span>{event.region.name}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {event.isVirtual && event.meetingLink && (
            <a
              href={event.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Join Meeting
            </a>
          )}
          
          {event.registrationRequired && event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Register
            </a>
          )}
        </div>
      </div>
    </div>
  )
}