import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/directory/health-wellness',
        destination: '/directory/medical-services',
        permanent: true,
      },
      {
        source: '/directory/health-wellness/:path*',
        destination: '/directory/medical-services/:path*',
        permanent: true,
      },
      {
        source: '/journal/dear-doctor',
        destination: '/dear-doctor',
        permanent: true,
      },
      {
        source: '/directory/property-construction',
        destination: '/directory/building-construction',
        permanent: true,
      },
      {
        source: '/directory/property-construction/:path*',
        destination: '/directory/building-construction/:path*',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'streetviewpixels-pa.googleapis.com',
      },
    ],
  },
}

export default nextConfig
