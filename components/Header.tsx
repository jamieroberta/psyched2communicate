"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { sanityClient, urlFor } from '@/lib/sanity'
import type { Region, Page, SiteSettings } from '@/lib/sanity'

export default function Header() {
  const [regions, setRegions] = useState<Region[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const [regionsData, pagesData, siteSettingsData] = await Promise.all([
          sanityClient.fetch(`*[_type == "region"] | order(name asc) {
            _id,
            name,
            slug
          }`),
          sanityClient.fetch(`*[_type == "page" && showOnNavigation == true] | order(title asc) {
            _id,
            title,
            slug
          }`),
          sanityClient.fetch(`*[_type == "siteSettings"][0] {
            _id,
            siteLogo
          }`)
        ])
        setRegions(regionsData)
        setPages(pagesData)
        setSiteSettings(siteSettingsData)
      } catch (error) {
        console.error('Error fetching navigation data:', error)
      }
    }

    fetchNavData()
  }, [])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="container">
        <div className="flex justify-between items-center min-h-16 py-2">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary-700 hover:text-primary-800 transition-colors"
          >
            {siteSettings?.siteLogo ? (
              <img 
                src={urlFor(siteSettings.siteLogo).height(40).fit('max').url()} 
                alt="Site Logo" 
                className="h-10 w-auto max-w-[200px]"
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  SLPC
                </div>
                <span className="hidden sm:block">Ohio Consultants</span>
              </>
            )}
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary-600 transition-colors flex items-center">
                Regions
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  {regions.map((region) => (
                    <Link
                      key={region._id}
                      href={`/regions/${region.slug.current}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {region.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {pages.map((page) => (
              <Link
                key={page._id}
                href={`/${page.slug.current}`}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {page.title}
              </Link>
            ))}

            <Link href="/posts" className="text-gray-700 hover:text-primary-600 transition-colors">
              All Posts
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block py-2 text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="py-2">
                <p className="text-sm font-medium text-gray-900 mb-2">Regions:</p>
                <div className="pl-4 space-y-1">
                  {regions.map((region) => (
                    <Link
                      key={region._id}
                      href={`/regions/${region.slug.current}`}
                      className="block py-1 text-sm text-gray-600 hover:text-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {region.name}
                    </Link>
                  ))}
                </div>
              </div>

              {pages.map((page) => (
                <Link
                  key={page._id}
                  href={`/${page.slug.current}`}
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {page.title}
                </Link>
              ))}

              <Link 
                href="/posts" 
                className="block py-2 text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                All Posts
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}