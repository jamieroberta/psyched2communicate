import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { sanityClient, urlFor } from '@/lib/sanity'

const inter = Inter({ subsets: ['latin'] })

// Fetch site settings for metadata
const getSiteSettings = async () => {
  const query = `*[_type == "siteSettings"][0] {
    homepageTitle,
    homepageSubtitle,
    siteLogo
  }`
  
  return await sanityClient.fetch(query)
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings()
  
  const title = siteSettings?.homepageTitle || 'SLPC & SPC Consultants'
  const description = siteSettings?.homepageSubtitle || "Speech-Language Pathology and School Psychology consultants across Ohio's Educational Service Centers"
  
  // Generate favicon URL from site logo if available
  const favicon = siteSettings?.siteLogo 
    ? urlFor(siteSettings.siteLogo).width(32).height(32).format('png').url()
    : '/favicon.ico'

  return {
    title: title,
    description: description,
    keywords: 'SLP, speech pathology, school psychology, Ohio, education, consultants',
    icons: {
      icon: favicon,
      shortcut: favicon,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}