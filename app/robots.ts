import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/physics/',
        '/chemistry/',
        '/biology/',
        '/computer-science/'
      ],
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/labs/',
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