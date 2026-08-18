// @ts-ignore
import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import OpenLabsAILoader from './components/OpenLabsAILoader'
import FloatingLabFeedback from './components/FloatingLabFeedback'
import { ChatProvider } from './components/ChatContext'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from "@vercel/analytics/next"
import Script from 'next/script'
import ClarityProvider from '@/components/ClarityProvider'
import ClarityTrackerObserver from '@/components/ClarityTrackerObserver'
import OpenLabsTracker from './components/OpenLabsTracker'
import ThemeProvider from '@/components/ThemeProvider'
import AmbientBackground from '@/components/ui/AmbientBackground'
import StructuredData from './components/seo/StructuredData'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.openlabs.org.in'

export const metadata: Metadata = {
  title: {
    default: 'OpenLabs - Virtual Lab Experience Platform for Science & Technology',
    template: '%s'
  },
  description: 'OpenLabs is an interactive virtual lab experience platform where students can explore physics, chemistry, biology, and computer science experiments online.',
  keywords: [
    'interactive labs', 'physics experiments', 'chemistry simulations', 'biology education',
    'computer science learning', 'virtual labs', 'science education',
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
  metadataBase: new URL(siteUrl),
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
    description: 'Explore interactive physics, chemistry, biology, and computer science experiments.',
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
  applicationName: "OpenLabs",
}

import { AuthProvider } from '@/components/AuthProvider'

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-7XW8JGG3BD" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7XW8JGG3BD');
          `}
        </Script>
      </head>
      <body className="bg-background text-foreground">
        <AuthProvider>
          <ThemeProvider>
          <AmbientBackground />
          <Analytics />
          <Navbar />
          <div className="mx-auto">
            <div data-ol-page-root>
              <ChatProvider>
                {children}
                <OpenLabsAILoader />
                <FloatingLabFeedback />
                <OpenLabsTracker />
                <ClarityProvider />
                <ClarityTrackerObserver />
              </ChatProvider>
            </div>
          </div>
          <Footer />
          <SpeedInsights />
          </ThemeProvider>
        </AuthProvider>

        {/* Structured Data */}
        <StructuredData
          data={[
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "OpenLabs",
              alternateName: "OpenLabs Virtual Labs",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl}/?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "OpenLabs",
              description: "Interactive science and technology learning platform with virtual labs and simulations",
              url: siteUrl,
              logo: `${siteUrl}/images/logo.png`,
              sameAs: [
                "https://twitter.com/openlabs",
                "https://github.com/openlabs"
              ],
              offers: [
                {
                  "@type": "Course",
                  name: "Physics Experiments",
                  description: "Interactive physics simulations and experiments",
                  provider: {
                    "@type": "Organization",
                    name: "OpenLabs"
                  }
                },
                {
                  "@type": "Course",
                  name: "Chemistry Experiments",
                  description: "Interactive chemistry simulations and experiments",
                  provider: {
                    "@type": "Organization",
                    name: "OpenLabs"
                  }
                },
                {
                  "@type": "Course",
                  name: "Biology Experiments",
                  description: "Interactive biology simulations and experiments",
                  provider: {
                    "@type": "Organization",
                    name: "OpenLabs"
                  }
                },
                {
                  "@type": "Course",
                  name: "Mathematics Simulations",
                  description: "Interactive mathematics simulations and function graphers",
                  provider: {
                    "@type": "Organization",
                    name: "OpenLabs"
                  }
                },
                {
                  "@type": "Course",
                  name: "Computer Science Tools",
                  description: "Interactive computer science tools and simulations",
                  provider: {
                    "@type": "Organization",
                    name: "OpenLabs"
                  }
                }
              ],
              educationalCredentialAwarded: "Certificate of Completion",
              teaches: ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science"],
              hasEducationalUse: "Interactive Learning",
              learningResourceType: "Interactive Simulation"
            }
          ]}
        />
      </body>
    </html>
  )
}
