import { getAllPages, getPageBySlug } from '@/lib/sanity'
import { Page } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static params for all pages at build time
export async function generateStaticParams() {
  const pages = await getAllPages()
  
  return pages.map((page: Page) => ({
    slug: page.slug.current,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)
  
  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }
  
  return {
    title: `${page.title} | SLPC & SPC Consultants`,
    description: page.content ? page.content.substring(0, 160) : `${page.title} - SLPC & SPC Consultants`,
  }
}

// Page component
export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug)
  
  if (!page) {
    notFound()
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">{page.title}</h1>
            </div>
            
            {/* Page Content */}
            <div className="px-8 py-6">
              {page.content ? (
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {page.content}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No content available for this page.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour
