import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SLPC & SPC Consultants</h3>
            <p className="text-gray-300 text-sm">
              Supporting Speech-Language Pathology and School Psychology consultants 
              across Ohio's Educational Service Centers.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-300 hover:text-white transition-colors">
                  All Posts
                </Link>
              </li>
              <li>
                <Link href="/posts?type=job" className="text-gray-300 hover:text-white transition-colors">
                  Job Postings
                </Link>
              </li>
              <li>
                <Link href="/posts?type=event" className="text-gray-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm">
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