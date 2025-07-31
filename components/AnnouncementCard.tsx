import Image from 'next/image'
import Link from 'next/link'
import { Announcement, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'

interface AnnouncementCardProps {
  announcement: Announcement
  showFullContent?: boolean
  compact?: boolean
}

export default function AnnouncementCard({ announcement, showFullContent = false, compact = false }: AnnouncementCardProps) {
  const publishedDate = new Date(announcement.publishedAt)
  const isExpired = announcement.expiresAt ? new Date(announcement.expiresAt) < new Date() : false

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      normal: 'bg-gray-100 text-gray-800 border-gray-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return colors[priority as keyof typeof colors] || colors.normal
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      general: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      policy: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ),
      training: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z" />
        </svg>
      ),
      event: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      system: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      emergency: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
    return icons[category as keyof typeof icons] || icons.general
  }

  return (
    <div className={`${compact ? 'bg-gray-50' : 'bg-white'} rounded-lg ${compact ? '' : 'shadow-md hover:shadow-lg'} transition-shadow border-l-4 ${getPriorityColor(announcement.priority)} ${isExpired ? 'opacity-75' : ''}`}>
      {announcement.isPinned && !compact && (
        <div className="bg-yellow-50 px-4 py-2 border-b">
          <div className="flex items-center gap-2 text-yellow-800 text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Pinned Announcement
          </div>
        </div>
      )}

      <div className={compact ? "p-4" : "p-6"}>
        <div className={compact ? "mb-3" : "flex items-start justify-between mb-3"}>
          <div className="flex-1">
            <h3 className={`${compact ? 'text-sm' : 'text-xl'} font-semibold text-gray-900 mb-2`}>
              {announcement.title}
            </h3>
            <div className={`flex items-center gap-1 ${compact ? 'mb-2' : 'mb-3'} ${compact ? 'flex-wrap' : ''}`}>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                {getCategoryIcon(announcement.category)}
                {compact ? announcement.category.charAt(0).toUpperCase() : announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
              </span>
              {announcement.isPinned && compact && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  📌
                </span>
              )}
              {announcement.priority !== 'normal' && !compact && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                  {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                </span>
              )}
              {isExpired && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Expired
                </span>
              )}
            </div>
          </div>
          {announcement.image && !compact && (
            <div className="flex-shrink-0 ml-4">
              <Image
                src={urlFor(announcement.image).width(100).height(100).url()}
                alt={announcement.title}
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {showFullContent ? (
          <div className="prose prose-sm max-w-none mb-4">
            <PortableText value={announcement.content} />
          </div>
        ) : (
          announcement.excerpt && (
            <p className={`text-gray-600 text-sm mb-4 ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
              {announcement.excerpt}
            </p>
          )
        )}

        <div className={`${compact ? 'block' : 'flex items-center justify-between'} text-xs text-gray-500`}>
          <div className={`flex items-center ${compact ? 'gap-2 mb-2' : 'gap-4'}`}>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{publishedDate.toLocaleDateString()}</span>
            </div>
            {!compact && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                <span>{announcement.region.name}</span>
              </div>
            )}
          </div>
          
          {!showFullContent && (
            <Link 
              href={`/announcements/${announcement.slug.current}`}
              className={`text-blue-600 hover:text-blue-800 font-medium ${compact ? 'text-xs' : ''}`}
            >
              {compact ? 'Read →' : 'Read More →'}
            </Link>
          )}
        </div>

        {announcement.expiresAt && (
          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
            Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  )
}