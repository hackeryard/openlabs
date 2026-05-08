// @ts-ignore
import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import OpenLabsAI from './components/OpenLabsAI'
import { ChatProvider } from './components/ChatContext'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from "@vercel/analytics/next"
import Script from 'next/script'

const Navbar = dynamic(() => import('./components/Navbar'), { ssr: false })
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })

export const metadata: Metadata = {
  title: {
    default: 'OpenLabs - Virtual Lab Experience Platform for Science & Technology',
    template: '%s | OpenLabs'
  },
  description: 'OpenLabs is an interactive virtual lab experience platform where students can explore physics, chemistry, biology, and computer science experiments online.',
  keywords: [
    'interactive labs', 'physics experiments', 'chemistry simulations', 'biology education',
    'computer science learning', 'mathematics tools', 'virtual labs', 'science education',
    'STEM learning', 'online experiments', 'educational technology', 'simulation software'
  ],
  authors: [{ name: 'OpenLabs Team' }],
  creator: 'OpenLabs',
  publisher: 'OpenLabs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.openlabs.org.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'OpenLabs - Virtual Lab Experience Platform for Science & Technology',
    description: 'OpenLabs is an interactive virtual lab experience platform where students can explore physics, chemistry, biology, and computer science experiments online.',
    siteName: 'OpenLabs',
    images: [
      {
        url: '/images/og-image.jpg', // Add this image to public/images/
        width: 1200,
        height: 630,
        alt: 'OpenLabs - Interactive Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/twitter-image.svg'],
    title: 'OpenLabs - Virtual Lab Experience Platform for Science & Technology',
    description: 'Explore interactive physics, chemistry, biology, computer science, and mathematics experiments.',
    creator: '@openlabs', // Replace with actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'iAVkmM8erPgrIq7AOILu',
    yandex: 'dec6f568bf371741',
    other: { bing: 'DB3814EA47FB786C9197CFE5A3FC3BFC' },
  },
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <Navbar />
        <div className="mx-auto">
          <main data-ol-page-root>
            <ChatProvider>
              {children}
              <OpenLabsAI />
            </ChatProvider>
          </main>
        </div>
        <Footer />
        <SpeedInsights />

        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'OpenLabs',
              description: 'Interactive science and technology learning platform with virtual labs and simulations',
              url: 'https://www.openlabs.org.in',
              logo: 'https://www.openlabs.org.in/images/logo.png',
              sameAs: [
                'https://twitter.com/openlabs',
                'https://github.com/openlabs'
              ],
              offers: [
                {
                  '@type': 'Course',
                  name: 'Physics Experiments',
                  description: 'Interactive physics simulations and experiments',
                  provider: {
                    '@type': 'Organization',
                    name: 'OpenLabs'
                  }
                },
                {
                  '@type': 'Course',
                  name: 'Chemistry Experiments',
                  description: 'Interactive chemistry simulations and experiments',
                  provider: {
                    '@type': 'Organization',
                    name: 'OpenLabs'
                  }
                },
                {
                  '@type': 'Course',
                  name: 'Biology Experiments',
                  description: 'Interactive biology simulations and experiments',
                  provider: {
                    '@type': 'Organization',
                    name: 'OpenLabs'
                  }
                },
                {
                  '@type': 'Course',
                  name: 'Computer Science Tools',
                  description: 'Interactive computer science tools and simulations',
                  provider: {
                    '@type': 'Organization',
                    name: 'OpenLabs'
                  }
                },
                {
                  '@type': 'Course',
                  name: 'Mathematics Tools',
                  description: 'Interactive mathematics tools and visualizations',
                  provider: {
                    '@type': 'Organization',
                    name: 'OpenLabs'
                  }
                }
              ],
              educationalCredentialAwarded: 'Certificate of Completion',
              teaches: [
                'Physics',
                'Chemistry',
                'Biology',
                'Computer Science',
                'Mathematics'
              ],
              hasEducationalUse: 'Interactive Learning',
              learningResourceType: 'Interactive Simulation'
            })
          }}
        />
      </body>
    </html>
  )
}
