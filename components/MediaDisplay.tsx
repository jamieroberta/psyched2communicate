import Image from 'next/image'
import { MediaField, getMediaUrl, getMediaType, getMediaAlt, isImage, isPDF } from '@/lib/sanity'

interface MediaDisplayProps {
  media?: MediaField[]
  width?: number
  height?: number
  className?: string
  alt?: string
  showDownloadLink?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

export default function MediaDisplay({ 
  media, 
  width = 400, 
  height = 300, 
  className = '', 
  alt,
  showDownloadLink = true,
  objectFit = 'cover'
}: MediaDisplayProps) {
  if (!media || !media[0]) {
    return null
  }

  const mediaUrl = getMediaUrl(media)
  const mediaType = getMediaType(media)
  const mediaAlt = alt || getMediaAlt(media)

  if (!mediaUrl) {
    return null
  }

  if (isImage(media)) {
    return (
      <Image
        src={mediaUrl}
        alt={mediaAlt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit }}
      />
    )
  }

  if (isPDF(media)) {
    return (
      <div className={`pdf-display ${className}`}>
        {/* PDF Preview/Icon */}
        <div className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6" style={{ width, height }}>
          <svg 
            className="w-16 h-16 text-red-500 mb-4" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            <path d="M8 6a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M8 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">PDF Document</span>
          {mediaAlt && (
            <span className="text-xs text-gray-500 mt-1 text-center">{mediaAlt}</span>
          )}
          
          {showDownloadLink && (
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </a>
          )}
        </div>
      </div>
    )
  }

  return null
}

// Simplified version for cases where you just need the URL
export function useMediaUrl(media?: MediaField[]): string | null {
  return getMediaUrl(media)
}

// Hook for getting media information
export function useMediaInfo(media?: MediaField[]) {
  return {
    url: getMediaUrl(media),
    type: getMediaType(media),
    alt: getMediaAlt(media),
    isImage: isImage(media),
    isPDF: isPDF(media),
  }
}
