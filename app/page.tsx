import Link from 'next/link'
import EventsCalendar from '@/components/EventsCalendar'
import AnnouncementsSection from '@/components/AnnouncementsSection'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="container py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          SLPC & SPC Consultants
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Supporting Speech-Language Pathology and School Psychology consultants 
          across Ohio's Educational Service Centers
        </p>
        <div className="space-x-4">
          <Link href="/posts" className="btn-primary">
            View Posts
          </Link>
          <Link href="/posts?type=job" className="btn-secondary">
            Job Postings
          </Link>
        </div>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="container py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 space-y-16">
            {/* Events Calendar Section */}
            <div>
              <EventsCalendar maxEvents={6} />
            </div>

            {/* Quick Links Section */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Links</h2>
                <p className="text-lg text-gray-600">Access important resources and information</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link 
                  href="/regions" 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Regional Centers</h3>
                      <p className="text-gray-600 text-sm">Find your local ESC information</p>
                    </div>
                  </div>
                </Link>

                <Link 
                  href="/posts" 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1v7a2 2 0 01-2 2H5.5a1.5 1.5 0 010-3H9a1 1 0 001-1V8a2 2 0 012-2h3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Resources & Posts</h3>
                      <p className="text-gray-600 text-sm">Access professional resources</p>
                    </div>
                  </div>
                </Link>

                <Link 
                  href="/posts?type=job" 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Job Postings</h3>
                      <p className="text-gray-600 text-sm">Find career opportunities</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Announcements Sidebar Widget */}
              <div className="bg-white rounded-lg shadow-md">
                <AnnouncementsSection 
                  maxAnnouncements={5} 
                  showFilters={false}
                  compact={true}
                />
              </div>

              {/* Emergency Contact Widget */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-sm font-semibold text-red-900">Emergency Support</h3>
                </div>
                <p className="text-xs text-red-800 mb-3">
                  Need immediate assistance? Contact your regional coordinator.
                </p>
                <Link 
                  href="/regions" 
                  className="text-xs text-red-700 hover:text-red-900 font-medium"
                >
                  Find Emergency Contacts →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
