import { notFound } from 'next/navigation'
import { sanityClient, urlFor, Region, Consultant } from '@/lib/sanity'
import Image from 'next/image'
import EventsCalendar from '@/components/EventsCalendar'
import AnnouncementsSection from '@/components/AnnouncementsSection'
import ResourcesSection from '@/components/ResourcesSection'

// Query to fetch region by slug
const getRegionBySlug = async (slug: string): Promise<Region | null> => {
  const query = `*[_type == "region" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    logo,
    officeHoursInfo,
    schedulingLink
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

  return (
    <div>
      {/* Header Section */}
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{region.name}</h1>
              {region.description && (
                <p className="text-lg text-gray-600">{region.description}</p>
              )}
            </div>
          </div>

          {/* Consultants Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Consultants</h2>
            
            {consultants.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultants.map(consultant => (
                  <div key={consultant._id} className="bg-gray-100 rounded-lg p-6">
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
                              className="text-sm text-gray-700 hover:text-blue-600 transition-colors truncate"
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

      {/* Main Content Area with Sidebar - Similar to Home Page */}
      <div className="container py-16">
        <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
          {/* Main Content - Left Side (Events Calendar) */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-8">
            <div>
              <EventsCalendar 
                regionSlug={region.slug.current} 
                showFilters={false}
                maxEvents={12}
              />
            </div>
          </div>

          {/* Right Sidebar (Announcements & Resources) */}
          <div className="lg:col-span-1 xl:col-span-2">
            <div className="sticky top-8 space-y-6">
              {/* Region Resources Sidebar Widget */}
              <div className="bg-white rounded-lg shadow-md">
                <ResourcesSection 
                  regionSlug={region.slug.current}
                  compact={true}
                />
              </div>

              {/* Region Announcements Sidebar Widget */}
              <div className="bg-white rounded-lg shadow-md">
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
  )
}
