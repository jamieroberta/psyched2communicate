'use client'

import { useState, useEffect } from 'react'
import { trackEvent } from '@/components/GoogleAnalytics'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already made a consent choice
    const consentChoice = localStorage.getItem('analytics-consent')
    if (!consentChoice) {
      setShowBanner(true)
    }
    setIsLoading(false)
  }, [])

  const acceptAnalytics = () => {
    localStorage.setItem('analytics-consent', 'accepted')
    localStorage.setItem('analytics-consent-date', new Date().toISOString())
    setShowBanner(false)
    
    // Track that user accepted analytics
    trackEvent('consent_granted', 'privacy', 'analytics_accepted')
  }

  const declineAnalytics = () => {
    localStorage.setItem('analytics-consent', 'declined')
    localStorage.setItem('analytics-consent-date', new Date().toISOString())
    setShowBanner(false)
    
    // Don't track anything if declined, just set the preference
    console.log('Analytics declined by user')
  }

  if (isLoading || !showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              We value your privacy
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use Google Analytics to understand how visitors interact with our website and improve your experience. 
              This helps us serve you better as we support speech-language pathologists and school psychologists across Ohio. 
              Your data is handled with care and anonymized.
            </p>
            <div className="mt-2">
              <a 
                href="/privacy-policy" 
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Learn more about our privacy practices
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
            <button
              onClick={declineAnalytics}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Decline Analytics
            </button>
            <button
              onClick={acceptAnalytics}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Accept Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to check if analytics is consented to
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('analytics-consent') === 'accepted'
}

// Helper function to get consent status
export const getConsentStatus = (): 'accepted' | 'declined' | 'pending' => {
  if (typeof window === 'undefined') return 'pending'
  const consent = localStorage.getItem('analytics-consent')
  if (consent === 'accepted') return 'accepted'
  if (consent === 'declined') return 'declined'
  return 'pending'
}
