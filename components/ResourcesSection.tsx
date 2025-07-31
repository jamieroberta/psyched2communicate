'use client'

import { useState, useEffect } from 'react'
import { Resource } from '@/lib/sanity'
import { createClient } from 'next-sanity'

// Create a reliable client for the component
const client = createClient({
  projectId: 'h3prmcr9',
  dataset: 'production',
  apiVersion: '2023-12-01',
  useCdn: false,
})

interface ResourcesSectionProps {
  compact?: boolean // Whether to use compact styling for sidebar
}

export default function ResourcesSection({ compact = false }: ResourcesSectionProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        
        const query = `*[_type == "resource" && isActive == true] | order(displayOrder asc, title asc) {
          _id,
          title,
          description,
          linkType,
          externalUrl,
          pdfFile,
          displayOrder,
          isActive
        }`

        console.log('Fetching resources...')
        const resourcesData = await client.fetch(query)
        console.log('Resources fetched:', resourcesData)
        setResources(resourcesData || [])
      } catch (error) {
        console.error('Error fetching resources:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  // Helper function to get the resource link
  const getResourceLink = (resource: Resource): string => {
    if (resource.linkType === 'external' && resource.externalUrl) {
      return resource.externalUrl
    } else if (resource.linkType === 'pdf' && resource.pdfFile) {
      // Return the Sanity asset URL for the PDF
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
      const assetId = resource.pdfFile.asset._ref
      return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId.replace('file-', '').replace('-pdf', '.pdf')}`
    }
    return '#'
  }

  // Helper function to determine if link should open in new tab
  const shouldOpenInNewTab = (resource: Resource): boolean => {
    return resource.linkType === 'external' || resource.linkType === 'pdf'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (resources.length === 0) {
    return null // Don't show the section if there are no resources
  }

  return (
    <div className={compact ? "space-y-4 p-6" : "space-y-6"}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
        </svg>
        <h2 className={compact ? "text-lg font-semibold text-gray-900" : "text-xl font-bold text-gray-900"}>
          Resources
        </h2>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {resources.map(resource => (
          <a
            key={resource._id}
            href={getResourceLink(resource)}
            target={shouldOpenInNewTab(resource) ? '_blank' : undefined}
            rel={shouldOpenInNewTab(resource) ? 'noopener noreferrer' : undefined}
            className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {resource.linkType === 'external' ? (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                {resource.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {resource.description}
                  </p>
                )}
              </div>
              
              {/* External link indicator */}
              {shouldOpenInNewTab(resource) && (
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}