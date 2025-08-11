// Analytics configuration and utilities
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Check if analytics is enabled
export const isAnalyticsEnabled = () => {
  return typeof window !== 'undefined' && 
         GA_MEASUREMENT_ID && 
         window.gtag && 
         !window.location.hostname.includes('localhost')
}

// Enhanced event tracking with error handling
export const safeTrackEvent = (
  action: string, 
  category: string, 
  label?: string, 
  value?: number
) => {
  try {
    if (!isAnalyticsEnabled()) return

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      custom_map: {
        custom_parameter: label
      }
    })
  } catch (error) {
    console.warn('Analytics tracking error:', error)
  }
}

// Track user engagement metrics
export const trackUserEngagement = (engagementType: string, duration?: number) => {
  safeTrackEvent('user_engagement', 'engagement', engagementType, duration)
}

// Track form interactions
export const trackFormInteraction = (formName: string, action: 'start' | 'complete' | 'abandon') => {
  safeTrackEvent(`form_${action}`, 'forms', formName)
}

// Track search functionality
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  safeTrackEvent('search', 'site_search', searchTerm, resultsCount)
}

// Track outbound links
export const trackOutboundLink = (url: string, linkText: string) => {
  safeTrackEvent('click', 'outbound_link', `${linkText} - ${url}`)
}

// Track file downloads
export const trackFileDownload = (fileName: string, fileType: string) => {
  safeTrackEvent('download', 'file_download', `${fileType}: ${fileName}`)
}

// Track social media interactions
export const trackSocialShare = (platform: string, url: string) => {
  safeTrackEvent('share', 'social', `${platform}: ${url}`)
}

// Enhanced tracking for consultancy-specific actions
export const ConsultancyAnalytics = {
  // Track consultant profile views
  viewConsultantProfile: (consultantName: string, specialization: string) => {
    safeTrackEvent('view_consultant_profile', 'consultant_engagement', `${consultantName} - ${specialization}`)
  },

  // Track service inquiries
  initiateServiceInquiry: (serviceType: string, region: string) => {
    safeTrackEvent('initiate_inquiry', 'lead_generation', `${serviceType} in ${region}`)
  },

  // Track resource usage
  accessResource: (resourceType: string, resourceName: string) => {
    safeTrackEvent('access_resource', 'resource_usage', `${resourceType}: ${resourceName}`)
  },

  // Track calendar interactions
  calendarInteraction: (action: string, eventType?: string) => {
    safeTrackEvent('calendar_interaction', 'calendar', `${action}${eventType ? ` - ${eventType}` : ''}`)
  },

  // Track region-specific engagement
  regionEngagement: (regionName: string, action: string) => {
    safeTrackEvent('region_engagement', 'regional_activity', `${regionName}: ${action}`)
  }
}
