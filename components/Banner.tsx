'use client'

import { useState, useEffect } from 'react'
import { Banner, sanityClient } from '@/lib/sanity'

export default function HomepageBanner() {
  const [activeBanners, setActiveBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchActiveBanners = async () => {
      try {
        setLoading(true)
        
        const now = new Date().toISOString()
        
        // Query for all active banners within date range, ordered by priority (highest first)
        const query = `*[
          _type == "banner" && 
          isActive == true && 
          startDate <= "${now}" && 
          endDate >= "${now}"
        ] | order(priority desc, startDate desc) {
          _id,
          title,
          description,
          backgroundColor,
          textColor,
          startDate,
          endDate,
          linkUrl,
          linkText,
          isActive,
          priority
        }`

        console.log('Fetching active banners...')
        const bannerData = await sanityClient.fetch(query)
        console.log('Banners fetched:', bannerData)
        setActiveBanners(bannerData || [])
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActiveBanners()
  }, [])

  // Function to dismiss a banner
  const dismissBanner = (bannerId: string) => {
    setDismissedBanners(prev => new Set(Array.from(prev).concat(bannerId)))
  }

  // Filter out dismissed banners
  const visibleBanners = activeBanners.filter(banner => !dismissedBanners.has(banner._id))

  // Don't render anything if loading or no visible banners
  if (loading || visibleBanners.length === 0) {
    return null
  }

  return (
    <div>
      {visibleBanners.map((banner) => (
        <div 
          key={banner._id}
          className="w-full py-4 px-4 sm:px-6 lg:px-8"
          style={{ 
            backgroundColor: banner.backgroundColor,
            color: banner.textColor 
          }}
        >
          <div className="container mx-auto">
            <div className="flex items-start gap-4">
              {/* Content Section */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Alert Icon */}
                      <svg 
                        className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        style={{ color: banner.textColor }}
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      
                      {/* Title */}
                      <h2 className="text-lg sm:text-xl font-semibold">
                        {banner.title}
                      </h2>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed opacity-90">
                      {banner.description}
                    </p>
                  </div>

                  {/* Optional Link Button */}
                  {banner.linkUrl && banner.linkText && (
                    <div className="flex-shrink-0">
                      <a
                        href={banner.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-current rounded-lg font-medium hover:bg-white hover:bg-opacity-20 transition-colors"
                        style={{ color: banner.textColor }}
                      >
                        {banner.linkText}
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Dismiss Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => dismissBanner(banner._id)}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                  style={{ color: banner.textColor }}
                  aria-label="Dismiss banner"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
