'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Google Analytics tracking ID for psyched2communicate.com
const GA_MEASUREMENT_ID = 'G-23J0GKYCYG'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

function GoogleAnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics Measurement ID not found')
      return
    }

    // Check if user has consented to analytics
    const consent = localStorage.getItem('analytics-consent')
    if (consent !== 'accepted') {
      console.log('Analytics not loaded - user consent required')
      return
    }

    // Initialize Google Analytics
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    `
    document.head.appendChild(script2)

    return () => {
      // Cleanup scripts if component unmounts
      if (script1.parentNode) document.head.removeChild(script1)
      if (script2.parentNode) document.head.removeChild(script2)
    }
  }, [])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return

    // Check consent before tracking page views
    const consent = localStorage.getItem('analytics-consent')
    if (consent !== 'accepted') return

    const url = pathname + searchParams.toString()
    
    // Track page views
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href
    })
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  )
}

// Analytics helper functions for custom event tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return

  // Check consent before tracking events
  if (typeof window !== 'undefined') {
    const consent = localStorage.getItem('analytics-consent')
    if (consent !== 'accepted') return
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  })
}

// Specific tracking functions for your consultancy website
export const trackConsultantContact = (consultantName: string, region?: string) => {
  trackEvent('contact_consultant', 'engagement', `${consultantName}${region ? ` - ${region}` : ''}`)
}

export const trackResourceDownload = (resourceName: string, resourceType: string) => {
  trackEvent('download_resource', 'resources', `${resourceType}: ${resourceName}`)
}

export const trackEventRegistration = (eventName: string, eventType: string) => {
  trackEvent('register_event', 'events', `${eventType}: ${eventName}`)
}

export const trackRegionView = (regionName: string) => {
  trackEvent('view_region', 'navigation', regionName)
}

export const trackJobApplicationStart = (jobTitle: string, location: string) => {
  trackEvent('start_job_application', 'jobs', `${jobTitle} - ${location}`)
}

export const trackCalendarInteraction = (action: 'view_month' | 'view_list' | 'view_event', eventName?: string) => {
  trackEvent(action, 'calendar', eventName)
}
