'use client'

import { useState, useEffect } from 'react'
import { JobListing, Region, sanityClient } from '@/lib/sanity'

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Fetch jobs and regions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch active job listings
        const jobsQuery = `*[_type == "jobListing" && isActive == true] | order(postedDate desc) {
          _id,
          title,
          description,
          applicationLink,
          postedDate,
          isActive,
          region->{
            _id,
            name,
            slug
          }
        }`

        // Fetch regions for filtering
        const regionsQuery = `*[_type == "region"] | order(name asc) {
          _id,
          name,
          slug
        }`

        const [jobsData, regionsData] = await Promise.all([
          sanityClient.fetch(jobsQuery),
          sanityClient.fetch(regionsQuery)
        ])

        setJobs(jobsData || [])
        setRegions(regionsData || [])
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter jobs based on selected criteria
  const filteredJobs = jobs.filter(job => {
    if (selectedRegion !== 'all' && job.region.slug.current !== selectedRegion) {
      return false
    }
    return true
  })



  if (loading) {
    return (
      <div className="container py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Career Opportunities
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Board</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Region:</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region._id} value={region.slug.current}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </span>
          </div>
        </div>

      {/* Job Listings */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-6">
          {filteredJobs.map(job => (
            <div key={job._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        <span>{job.region.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-gray-500">
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="flex items-center justify-between">
                  <a
                    href={job.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Apply Now
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No job listings match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
      </div>
    </div>
  )
}
