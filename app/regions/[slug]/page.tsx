import { notFound } from 'next/navigation'
import { sanityClient, urlFor, Region } from '@/lib/sanity'
import Image from 'next/image'
import EventsCalendar from '@/components/EventsCalendar'
import AnnouncementsSection from '@/components/AnnouncementsSection'

// Query to fetch region by slug
const getRegionBySlug = async (slug: string): Promise<Region | null> => {
  const query = `*[_type == "region" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    logo,
    contactEmail,
    contactPhone,
    officeHoursInfo,
    schedulingLink
  }`
  
  return await sanityClient.fetch(query, { slug })
}

export default async function RegionPage({ params }: { params: { slug: string } }) {
  const region = await getRegionBySlug(params.slug)
  
  if (!region) {
    notFound()
  }

  return (
    <div>
      {/* Header Section */}
      <div className="container py-8 max-w-4xl mx-auto">
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

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              {region.contactEmail && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-blue-600">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <a 
                    href={`mailto:${region.contactEmail}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {region.contactEmail}
                  </a>
                </div>
              )}
              
              {region.contactPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-blue-600">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                  </div>
                  <a 
                    href={`tel:${region.contactPhone}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {region.contactPhone}
                  </a>
                </div>
              )}
            </div>

            {/* Office Hours & Scheduling */}
            <div className="space-y-4">
              {region.officeHoursInfo && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Office Hours</h3>
                  <p className="text-gray-700 whitespace-pre-line">{region.officeHoursInfo}</p>
                </div>
              )}
              
              {region.schedulingLink && (
                <div className="mt-6">
                  <a
                    href={region.schedulingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    Schedule Appointment
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Region Announcements */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <AnnouncementsSection 
            regionSlug={region.slug.current} 
            showFilters={false}
            maxAnnouncements={10}
          />
        </div>
      </div>

      {/* Region Events */}
      <div className="py-16">
        <div className="container">
          <EventsCalendar 
            regionSlug={region.slug.current} 
            showFilters={false}
          />
        </div>
      </div>
    </div>
  )
}
