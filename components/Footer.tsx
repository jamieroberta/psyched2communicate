import Link from 'next/link'
import { sanityClient } from '@/lib/sanity'

// Fetch site settings for footer
const getSiteSettings = async () => {
  const query = `*[_type == "siteSettings"][0] {
    homepageTitle,
    homepageSubtitle
  }`
  
  return await sanityClient.fetch(query)
}

export default async function Footer() {
  const siteSettings = await getSiteSettings()
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-12 border-t-4 border-blue-600">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {siteSettings?.homepageTitle || 'SLPC & SPC Consultants'}
            </h3>
            <p className="text-gray-300 text-sm">
              {siteSettings?.homepageSubtitle || 'Supporting Speech-Language Pathology and School Psychology consultants across Ohio\'s Educational Service Centers'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-300 transition-colors"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-300 transition-colors"></span>
                  Job Postings
                </Link>
              </li>
              <li>
                <Link href="/regions" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-300 transition-colors"></span>
                  Regional Info
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Contact</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              For technical issues or questions about this website, 
              please contact your regional administrator.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Ohio Educational Service Centers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}