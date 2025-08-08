import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(config)

const builder = imageUrlBuilder(sanityClient)

export const urlFor = (source: any) => builder.image(source)

// Types for our content
export interface Region {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  logo?: any
  officeHoursInfo?: string
  schedulingLink?: string
  websiteLink?: string
  color?: string
}

export interface Consultant {
  _id: string
  name: string
  title: string
  image: any
  email: string
  phone: string
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
  image?: any
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
  image?: any
}

export interface SiteSettings {
  _id: string
  siteLogo?: any
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
