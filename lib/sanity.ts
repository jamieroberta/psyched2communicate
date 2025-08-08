import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const config = {
  projectId: 'h3prmcr9',
  dataset: 'production',
  apiVersion: '2023-12-01',
  useCdn: false, // Disable CDN temporarily for debugging
}

export const sanityClient = createClient(config)

const builder = imageUrlBuilder(sanityClient)

export const urlFor = (source: any) => builder.image(source)

// Helper functions for new media field format
export const getMediaUrl = (mediaField?: MediaField[]): string | null => {
  if (!mediaField || !mediaField[0]) return null
  
  const media = mediaField[0]
  if (media.mediaType === 'image' && media.image) {
    return urlFor(media.image).url()
  } else if (media.mediaType === 'pdf' && media.pdf) {
    return media.pdf.asset.url
  }
  return null
}

export const getMediaType = (mediaField?: MediaField[]): 'image' | 'pdf' | null => {
  if (!mediaField || !mediaField[0]) return null
  return mediaField[0].mediaType || null
}

export const getMediaAlt = (mediaField?: MediaField[]): string => {
  if (!mediaField || !mediaField[0]) return ''
  return mediaField[0].alt || mediaField[0].description || ''
}

export const isImage = (mediaField?: MediaField[]): boolean => {
  return getMediaType(mediaField) === 'image'
}

export const isPDF = (mediaField?: MediaField[]): boolean => {
  return getMediaType(mediaField) === 'pdf'
}

// Types for our content
export interface Region {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  logo?: MediaField[]
  officeHoursInfo?: string
  websiteLink?: string
  color?: string
}

export interface Consultant {
  _id: string
  name: string
  title: string
  image: MediaField[]
  email: string
  phone: string
  schedulingLink?: string
  region: Region
  isActive: boolean
  displayOrder?: number
}



export interface Page {
  _id: string
  title: string
  slug: { current: string }
  content?: string
  showOnNavigation: boolean
}

export interface MediaField {
  mediaType?: 'image' | 'pdf'
  image?: any
  pdf?: any
  alt?: string
  description?: string
}

export interface Event {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  startDate: string
  endDate?: string
  location?: string
  isVirtual: boolean
  meetingLink?: string
  region?: Region
  category: 'training' | 'workshop' | 'meeting' | 'conference' | 'social' | 'other'
  registrationRequired: boolean
  registrationLink?: string
  media?: MediaField[]
}

export interface Announcement {
  _id: string
  title: string
  slug: { current: string }
  content: any[]
  excerpt?: string
  publishedAt: string
  expiresAt?: string
  region: Region
  priority: 'low' | 'normal' | 'high' | 'urgent'
  category: 'general' | 'policy' | 'training' | 'event' | 'system' | 'emergency'
  isPinned: boolean
  media?: MediaField[]
}

export interface SiteSettings {
  _id: string
  siteLogo?: MediaField[]
  homepageTitle?: string
  homepageSubtitle?: string
}

export interface Resource {
  _id: string
  title: string
  description?: string
  linkType: 'external' | 'pdf'
  externalUrl?: string
  pdfFile?: any
  displayOrder?: number
  isActive: boolean
  region?: Region
}

export interface Banner {
  _id: string
  title: string
  description: string
  backgroundColor: string
  textColor: string
  startDate: string
  endDate: string
  linkUrl?: string
  linkText?: string
  isActive: boolean
  priority: number
}

export interface JobListing {
  _id: string
  title: string
  description: string
  region: Region
  applicationLink: string
  postedDate: string
  isActive: boolean
}
