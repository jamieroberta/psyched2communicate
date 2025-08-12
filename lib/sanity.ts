import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const config = {
  projectId: 'h3prmcr9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-12-01',
  useCdn: true, // Enable CDN for better performance in production
}

export const sanityClient = createClient(config)

const builder = imageUrlBuilder(sanityClient)

export const urlFor = (source: any) => builder.image(source)

// Helper functions for media field format
export const getMediaUrl = (mediaField?: MediaField[]): string | null => {
  if (!mediaField || !mediaField[0]) return null
  
  const media = mediaField[0]
  if (media._type === 'image') {
    return urlFor(media).url()
  } else if (media._type === 'file') {
    return media.asset?.url || null
  }
  return null
}

export const getMediaType = (mediaField?: MediaField[]): 'image' | 'file' | null => {
  if (!mediaField || !mediaField[0]) return null
  return mediaField[0]._type || null
}

export const getMediaAlt = (mediaField?: MediaField[]): string => {
  if (!mediaField || !mediaField[0]) return ''
  return mediaField[0].alt || mediaField[0].description || ''
}

export const isImage = (mediaField?: MediaField[]): boolean => {
  return getMediaType(mediaField) === 'image'
}

export const isPDF = (mediaField?: MediaField[]): boolean => {
  return getMediaType(mediaField) === 'file'
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
  _type: 'image' | 'file'
  asset?: {
    url: string
    originalFilename?: string
  }
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
  isRecurring?: boolean
  recurrencePattern?: 'weekly' | 'biweekly' | 'monthly'
  recurrenceEndDate?: string
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

// Page queries
export async function getNavigationPages(): Promise<Page[]> {
  const query = `*[_type == "page" && showOnNavigation == true] | order(title asc) {
    _id,
    title,
    slug,
    showOnNavigation
  }`
  
  try {
    return await sanityClient.fetch(query)
  } catch (error) {
    console.error('Error fetching navigation pages:', error)
    return []
  }
}

export async function getAllPages(): Promise<Page[]> {
  const query = `*[_type == "page"] | order(title asc) {
    _id,
    title,
    slug,
    content,
    showOnNavigation
  }`
  
  try {
    return await sanityClient.fetch(query)
  } catch (error) {
    console.error('Error fetching all pages:', error)
    return []
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const query = `*[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    showOnNavigation
  }`
  
  try {
    return await sanityClient.fetch(query, { slug })
  } catch (error) {
    console.error('Error fetching page by slug:', error)
    return null
  }
}
