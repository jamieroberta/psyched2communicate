/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows production builds even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // This allows production builds even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
}

module.exports = nextConfig
