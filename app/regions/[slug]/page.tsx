import { notFound } from 'next/navigation'
import { sanityClient, urlFor, Region, Consultant } from '@/lib/sanity'
import Image from 'next/image'
import EventsCalendar from '@/components/EventsCalendar'
import AnnouncementsSection from '@/components/AnnouncementsSection'
import ResourcesSection from '@/components/ResourcesSection'
import ThemedButton from '@/components/ThemedButton'

// Helper function to generate color variations
const generateColorVariations = (hexColor: string) => {
  // Remove # if present
  const color = hexColor.replace('#', '')
  
  // Convert hex to RGB
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  
  return {
    primary: `rgb(${r}, ${g}, ${b})`,
    light: `rgba(${r}, ${g}, ${b}, 0.1)`,
    medium: `rgba(${r}, ${g}, ${b}, 0.8)`,
    gradient: `linear-gradient(135deg, rgb(${r}, ${g}, ${b}), rgb(${Math.max(0, r-30)}, ${Math.max(0, g-30)}, ${Math.max(0, b-30)}))`,
    border: `rgba(${r}, ${g}, ${b}, 0.3)`
  }
}

// Query to fetch region by slug
const getRegionBySlug = async (slug: string): Promise<Region | null> => {
  const query = `*[_type == "region" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    logo,
    officeHoursInfo,
    schedulingLink,
    websiteLink,
    color
  }`
  
  return await sanityClient.fetch(query, { slug })
}

// Query to fetch consultants by region
const getConsultantsByRegion = async (slug: string): Promise<Consultant[]> => {
  const query = `*[_type == "consultant" && isActive == true && region->slug.current == $slug] | order(displayOrder asc, name asc) {
    _id,
    name,
    title,
    image,
    email,
    phone,
    displayOrder,
    region->{
      _id,
      name,
      slug
    }
  }`
  
  return await sanityClient.fetch(query, { slug })
}

export default async function RegionPage({ params }: { params: { slug: string } }) {
  const region = await getRegionBySlug(params.slug)
  
  if (!region) {
    notFound()
  }

  const consultants = await getConsultantsByRegion(params.slug)

  // Generate dynamic colors based on region color
  const regionColor = region.color || '#3B82F6' // Default to blue
  const colors = generateColorVariations(regionColor)

  return (
    <div>
      {/* Hero Section with Region Branding */}
      <div 
        className="border-b-2"
        style={{ 
          background: colors.light,
          borderBottomColor: colors.primary
        }}
      >
        <div className="container py-12 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-opacity-30" style={{ borderColor: colors.primary }}>
            <div className="flex items-center gap-6 mb-8">
            {region.logo && (
              <div className="flex-shrink-0">
                <Image
                  src={urlFor(region.logo).width(120).height(120).url()}
                  alt={`${region.name} logo`}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">{region.name}</h1>
              {region.description && (
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">{region.description}</p>
              )}
              
              {/* Action Buttons */}
              {(region.websiteLink || region.schedulingLink) && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {region.websiteLink && (
                    <ThemedButton 
                      href={region.websiteLink}
                      variant="primary"
                      colors={colors}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      }
                    >
                      Visit Website
                    </ThemedButton>
                  )}
                  
                  {region.schedulingLink && (
                    <ThemedButton 
                      href={region.schedulingLink}
                      variant="secondary"
                      colors={colors}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M7 21h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v11a2 2 0 002 2z" />
                        </svg>
                      }
                    >
                      Schedule Appointment
                    </ThemedButton>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Consultants Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <h2 className="text-3xl font-bold text-gray-900">Our Consultants</h2>
            </div>
            
            {consultants.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultants.map(consultant => (
                  <div 
                    key={consultant._id} 
                    className="bg-white rounded-xl p-6 shadow-lg border border-opacity-20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{ borderColor: colors.primary }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={urlFor(consultant.image).width(80).height(80).url()}
                          alt={consultant.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {consultant.name}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium mb-3">
                          {consultant.title}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                            </svg>
                            <a 
                              href={`mailto:${consultant.email}`}
                              className="text-sm text-gray-700 hover:text-blue-600 transition-colors break-all"
                            >
                              {consultant.email}
                            </a>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                            </svg>
                            <a 
                              href={`tel:${consultant.phone}`}
                              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                            >
                              {consultant.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 13a3 3 0 110-6 3 3 0 010 6zM15 21v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No consultants found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No consultants are currently assigned to this region.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Main Content Area with Sidebar - Similar to Home Page */}
      <div style={{ backgroundColor: colors.light }}>
        <div className="container py-16">
          <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
            {/* Main Content - Left Side (Events Calendar) */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
              <div className="bg-white rounded-xl shadow-lg border border-opacity-20 overflow-hidden" style={{ borderColor: colors.primary }}>
                <div 
                  className="px-6 py-4"
                  style={{ background: colors.gradient }}
                >
                  <h2 className="text-2xl font-bold text-white">Regional Events</h2>
                  <p className="text-white text-opacity-90 mt-1">Stay updated with events in {region.name}</p>
                </div>
                <div className="p-6">
                  <EventsCalendar 
                    regionSlug={region.slug.current} 
                    showFilters={false}
                    maxEvents={12}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar (Announcements & Resources) */}
            <div className="lg:col-span-1 xl:col-span-2">
              <div className="sticky top-8 space-y-6">
                {/* Region Resources Sidebar Widget */}
                <div className="bg-white rounded-xl shadow-lg border border-opacity-20 overflow-hidden hover:shadow-xl transition-shadow" style={{ borderColor: colors.primary }}>
                  <div 
                    className="px-6 py-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.medium})`
                    }}
                  >
                    <h3 className="text-lg font-bold text-white">Regional Resources</h3>
                  </div>
                  <ResourcesSection 
                    regionSlug={region.slug.current}
                    compact={true}
                  />
                </div>

                {/* Region Announcements Sidebar Widget */}
                <div className="bg-white rounded-xl shadow-lg border border-opacity-20 overflow-hidden hover:shadow-xl transition-shadow" style={{ borderColor: colors.primary }}>
                  <div 
                    className="px-6 py-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.medium}, ${colors.primary})`
                    }}
                  >
                    <h3 className="text-lg font-bold text-white">Announcements</h3>
                  </div>
                  <AnnouncementsSection 
                    regionSlug={region.slug.current} 
                    showFilters={false}
                    maxAnnouncements={8}
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
