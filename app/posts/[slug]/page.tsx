export default function PostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Post: {params.slug}</h1>
      <p>Individual post content will appear here.</p>
    </div>
  )
}
