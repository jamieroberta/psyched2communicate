import Link from 'next/link'

export default function HomePage() {
  return (
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
  )
}
