'use client'

import { useState, useEffect } from 'react'
import { Announcement, Region, sanityClient } from '@/lib/sanity'
import AnnouncementCard from './AnnouncementCard'

interface AnnouncementsSectionProps {
  regionSlug?: string // If provided, only show announcements for this region
  showFilters?: boolean // Whether to show region filters
  maxAnnouncements?: number // Maximum number of announcements to display
  compact?: boolean // Whether to use compact styling for sidebar
}

export default function AnnouncementsSection({ regionSlug, showFilters = true, maxAnnouncements, compact = false }: AnnouncementsSectionProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Fetch announcements and regions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Build announcements query
        let announcementsQuery = `*[_type == "announcement"`
        
        // Filter by region if specified
        if (regionSlug) {
          announcementsQuery += ` && region->slug.current == "${regionSlug}"`
        }
        
        // Filter out expired announcements
        const now = new Date().toISOString()
        announcementsQuery += ` && (!defined(expiresAt) || expiresAt > "${now}")`
        
        announcementsQuery += `] | order(isPinned desc, priority desc, publishedAt desc) {
          _id,
          title,
          slug,
          content,
          excerpt,
          publishedAt,
          expiresAt,
          priority,
          category,
          isPinned,
          media,
          region->{
            _id,
            name,
            slug
          }
        }`

        // Fetch announcements
        const announcementsData = await sanityClient.fetch(announcementsQuery)
        setAnnouncements(announcementsData || [])

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
        console.error('Error fetching announcements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [regionSlug, showFilters])

  // Filter announcements based on selected criteria
  const filteredAnnouncements = announcements.filter(announcement => {
    // Filter by region (if not region-specific page)
    if (!regionSlug && selectedRegion !== 'all') {
      if (announcement.region.slug.current !== selectedRegion) return false
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && announcement.category !== selectedCategory) return false
    
    // Filter by priority
    if (selectedPriority !== 'all' && announcement.priority !== selectedPriority) return false
    
    return true
  }).slice(0, maxAnnouncements || undefined)

  // Group announcements by pinned status
  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned)
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={compact ? "space-y-4 p-6" : "space-y-6"}>
      {/* Header */}
      <div className={compact ? "flex items-center gap-3" : "flex items-center justify-between"}>
        {compact && (
          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
        <h2 className={compact ? "text-xl font-semibold text-gray-900" : "text-3xl font-bold text-gray-900"}>
          {regionSlug ? 'Region Announcements' : 'Announcements'}
        </h2>
        {!regionSlug && !compact && (
          <div className="text-sm text-gray-600">
            {filteredAnnouncements.length} {filteredAnnouncements.length === 1 ? 'announcement' : 'announcements'}
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
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
              <option value="general">General</option>
              <option value="policy">Policy Update</option>
              <option value="training">Training</option>
              <option value="event">Event</option>
              <option value="system">System</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      )}

      {/* Announcements */}
      {filteredAnnouncements.length > 0 ? (
        <div className={compact ? "space-y-3" : "space-y-6"}>
          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <div className={compact ? "space-y-3" : "space-y-4"}>
              {!regionSlug && !compact && (
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Pinned Announcements
                </h3>
              )}
              <div className={compact ? "space-y-3" : "space-y-4"}>
                {pinnedAnnouncements.map(announcement => (
                  <AnnouncementCard key={announcement._id} announcement={announcement} compact={compact} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Announcements */}
          {regularAnnouncements.length > 0 && (
            <div className={compact ? "space-y-3" : "space-y-4"}>
              {pinnedAnnouncements.length > 0 && !regionSlug && !compact && (
                <h3 className="text-xl font-semibold text-gray-900">Recent Announcements</h3>
              )}
              <div className={compact ? "space-y-3" : "space-y-4"}>
                {regularAnnouncements.map(announcement => (
                  <AnnouncementCard key={announcement._id} announcement={announcement} compact={compact} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No announcements match your current filters.
          </p>
        </div>
      )}
    </div>
  )
}