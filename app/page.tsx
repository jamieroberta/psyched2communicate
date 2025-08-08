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
      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {siteSettings?.homepageTitle || 'SLPC & SPC Consultants'}
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-4">
              {siteSettings?.homepageSubtitle || 'Supporting Speech-Language Pathology and School Psychology consultants across Ohio\'s Educational Service Centers'}
            </p>
          </div>

          {/* Right Side - Google Map */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 text-center lg:text-left">
              Service Areas
            </h2>
            <GoogleMap 
              mapId="17lkGMv8UcPWPN0NaXOg2BuXpeKMtL2I"
              title="SLPC & SPC Consultant Service Areas"
              height="280px"
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2 text-center lg:text-left">
              Explore our regional Educational Service Centers across Ohio
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="container py-16">
        <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-16">
            {/* Events Calendar Section */}
            <div>
              <EventsCalendar maxEvents={6} />
            </div>


          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 xl:col-span-2">
            <div className="sticky top-8 space-y-6">
              {/* Resources Sidebar Widget */}
              <div className="bg-white rounded-lg shadow-md">
                <ResourcesSection compact={true} />
              </div>

              {/* Announcements Sidebar Widget */}
              <div className="bg-white rounded-lg shadow-md">
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
  )
}
