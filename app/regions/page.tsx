import { sanityClient, urlFor, Region } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'

// Query to fetch all regions
const getAllRegions = async (): Promise<Region[]> => {
  const query = `*[_type == "region"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    logo,
    contactEmail,
    contactPhone
  }`
  
  return await sanityClient.fetch(query)
}

export default async function RegionsPage() {
  const regions = await getAllRegions()

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Regions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find your local SLPC office and connect with our team in your area. 
          Each region offers specialized services tailored to the local community.
        </p>
      </div>

      {regions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No regions found</h3>
          <p className="text-gray-600">
            No regional data is currently available. Please check your Sanity CMS or contact an administrator.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions.map((region) => (
            <Link 
              key={region._id} 
              href={`/regions/${region.slug.current}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {region.logo && (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <Image
                      src={urlFor(region.logo).width(400).height(240).url()}
                      alt={`${region.name} logo`}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {region.name}
                  </h3>
                  
                  {region.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {region.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    {region.contactEmail && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <span>{region.contactEmail}</span>
                      </div>
                    )}
                    
                    {region.contactPhone && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                        <span>{region.contactPhone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 