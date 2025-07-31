'use client'

import { useState, useEffect } from 'react'
import { Event, Region, sanityClient } from '@/lib/sanity'
import EventCard from './EventCard'

interface EventsCalendarProps {
  regionSlug?: string // If provided, only show events for this region
  showFilters?: boolean // Whether to show region filters
  maxEvents?: number // Maximum number of events to display
}

export default function EventsCalendar({ regionSlug, showFilters = true, maxEvents }: EventsCalendarProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewType, setViewType] = useState<'upcoming' | 'all' | 'past'>('upcoming')
  const [loading, setLoading] = useState(true)

  // Fetch events and regions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Build events query
        let eventsQuery = `*[_type == "event"`
        if (regionSlug) {
          eventsQuery += ` && region->slug.current == "${regionSlug}"`
        }
        eventsQuery += `] | order(startDate asc) {
          _id,
          title,
          slug,
          description,
          startDate,
          endDate,
          location,
          isVirtual,
          meetingLink,
          category,
          registrationRequired,
          registrationLink,
          image,
          region->{
            _id,
            name,
            slug
          }
        }`

        // Fetch events
        const eventsData = await sanityClient.fetch(eventsQuery)
        setEvents(eventsData || [])

        // Fetch regions for filtering (only if not region-specific)
        if (!regionSlug && showFilters) {
          const regionsQuery = `*[_type == "region"] | order(name asc) {
            _id,
            name,
            slug
          }`
          const regionsData = await sanityClient.fetch(regionsQuery)
          setRegions(regionsData || [])
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [regionSlug, showFilters])

  // Filter events based on selected criteria
  const filteredEvents = events.filter(event => {
    const now = new Date()
    const eventDate = new Date(event.startDate)
    
    // Filter by view type
    if (viewType === 'upcoming' && eventDate < now) return false
    if (viewType === 'past' && eventDate >= now) return false
    
    // Filter by region (if not region-specific page)
    if (!regionSlug && selectedRegion !== 'all') {
      if (event.region.slug.current !== selectedRegion) return false
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && event.category !== selectedCategory) return false
    
    return true
  }).slice(0, maxEvents || undefined)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">
          {regionSlug ? 'Region Events' : 'Events Calendar'}
        </h2>
        {!regionSlug && (
          <div className="text-sm text-gray-600">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          {/* View Type Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">View:</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as typeof viewType)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="all">All Events</option>
              <option value="past">Past Events</option>
            </select>
          </div>

          {/* Region Filter (only for non-region-specific pages) */}
          {!regionSlug && regions.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Region:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region._id} value={region.slug.current}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="training">Training</option>
              <option value="workshop">Workshop</option>
              <option value="meeting">Meeting</option>
              <option value="conference">Conference</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M7 21h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v11a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {viewType === 'upcoming' ? 'No upcoming events' : 'No events match your filters'}.
          </p>
        </div>
      )}
    </div>
  )
}