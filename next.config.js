/** @type {import('next').NextConfig} */
process.env.DOTENV_CONFIG_QUIET = "true";
process.env.DOTENVX_LOG = "error";
process.env.BROWSERSLIST_IGNORE_OLD_DATA = "true";
import "./scripts/guard.cjs";
import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['localhost', '127.0.0.1', 'hacker.rk'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? true : false,
  },
  // Canonical host is www (every canonical/OG URL in the app already
  // hardcodes https://www.openlabs.org.in) — but nothing previously
  // redirected the apex domain, so Google was indexing
  // openlabs.org.in and www.openlabs.org.in as two separate sites,
  // splitting ranking signal for the same content. 308 (permanent,
  // method-preserving) redirect every apex request to the www host.
  async redirects() {
    return [
      {
        source: '/education',
        destination: '/tracks',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'openlabs.org.in' }],
        destination: 'https://www.openlabs.org.in/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), geolocation=(), microphone=(self)',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
