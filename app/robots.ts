import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/login',
        '/signup',
        '/forgotpassword',
        '/reset-password',
        '/verify-email'
      ],
    },
    sitemap: 'https://www.openlabs.org.in/sitemap.xml',
  }
}