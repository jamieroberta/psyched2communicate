#!/bin/bash

echo "Creating remaining React components..."

# Create a simple homepage for now
cat > app/page.tsx << "HOMEPAGE"
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
HOMEPAGE

# Create basic posts page
cat > app/posts/page.tsx << "POSTS"
export default function PostsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">All Posts</h1>
      <p>Posts will appear here once you add content in Sanity CMS.</p>
    </div>
  )
}
POSTS

# Create basic post detail page
cat > app/posts/[slug]/page.tsx << "POSTDETAIL"
export default function PostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Post: {params.slug}</h1>
      <p>Individual post content will appear here.</p>
    </div>
  )
}
POSTDETAIL

# Create basic region page
cat > app/regions/[slug]/page.tsx << "REGION"
export default function RegionPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Region: {params.slug}</h1>
      <p>Region content will appear here once you add data in Sanity CMS.</p>
    </div>
  )
}
REGION

echo "✅ Created all basic React components!"
echo "Next steps:"
echo "1. chmod +x setup_remaining_files.sh"
echo "2. ./setup_remaining_files.sh"
echo "3. npm run dev"
