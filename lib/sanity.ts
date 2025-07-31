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
  contactEmail?: string
  contactPhone?: string
  officeHoursInfo?: string
  schedulingLink?: string
}

export interface Consultant {
  _id: string
  name: string
  title: string
  bio?: string
  photo?: any
  email?: string
  phone?: string
  region: Region
  specialties?: string[]
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  type: 'job' | 'event' | 'announcement' | 'resource'
  content: string
  externalLink?: string
  regions: Region[]
  datePosted: string
  eventDate?: string
  tags?: string[]
  featured: boolean
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
  region: Region
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
