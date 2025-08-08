import Link from 'next/link'
import EventsCalendar from '@/components/EventsCalendar'
import AnnouncementsSection from '@/components/AnnouncementsSection'
import ResourcesSection from '@/components/ResourcesSection'
import Banner from '@/components/Banner'
import GoogleMap from '@/components/GoogleMap'
import { SiteSettings } from '@/lib/sanity'
import { createClient } from 'next-sanity'

// Create a more reliable client for server-side rendering
const client = createClient({
  projectId: 'h3prmcr9',
  dataset: 'production',
  apiVersion: '2023-12-01',
  useCdn: false, // Disable CDN for fresh data
})

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings"][0] {
      _id,
      siteLogo,
      homepageTitle,
      homepageSubtitle
    }`
    
    console.log('Fetching site settings...')
    const siteSettings = await client.fetch(query)
    console.log('Site settings fetched:', siteSettings)
    return siteSettings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

// Force revalidation every time to get fresh data
export const revalidate = 0

export default async function HomePage() {
  const siteSettings = await getSiteSettings()
  return (
    <div>
      {/* Banner Section */}
      <Banner />
      {/* Hero Section with Map */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
        <div className="container py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {siteSettings?.homepageTitle || 'SLPC & SPC Consultants'}
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                {siteSettings?.homepageSubtitle || 'Supporting Speech-Language Pathology and School Psychology consultants across Ohio\'s Educational Service Centers'}
              </p>
            </div>

            {/* Right Side - Google Map */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center lg:text-left">
                Regional Map
              </h2>
              <GoogleMap 
                mapId="17lkGMv8UcPWPN0NaXOg2BuXpeKMtL2I"
                title="SLPC & SPC Consultant Service Areas"
                height="280px"
                className="w-full rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="bg-gray-50">
        <div className="container py-16">
          <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
              {/* Events Calendar Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                  <p className="text-blue-100 mt-1">Stay updated with our latest events and training sessions</p>
                </div>
                <div className="p-6">
                  <EventsCalendar maxEvents={6} />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 xl:col-span-2">
              <div className="sticky top-8 space-y-6">
                {/* Resources Sidebar Widget */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">Resources</h3>
                  </div>
                  <ResourcesSection compact={true} />
                </div>

                {/* Announcements Sidebar Widget */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">Announcements</h3>
                  </div>
                  <AnnouncementsSection 
                    maxAnnouncements={5} 
                    showFilters={false}
                    compact={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
