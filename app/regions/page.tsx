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
    logo
  }`
  
  return await sanityClient.fetch(query)
}

export default async function RegionsPage() {
  const regions = await getAllRegions()

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Regions</h1>
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