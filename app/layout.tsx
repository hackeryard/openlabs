// @ts-ignore
import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import OpenLabsAILoader from './components/OpenLabsAILoader'
import FloatingLabFeedback from './components/FloatingLabFeedback'
import { ChatProvider } from './components/ChatContext'
import AppAnalytics from './components/AppAnalytics'
import GoogleAdSense from './components/GoogleAdSense'
import AdsterraPopunder from './components/AdsterraPopunder'
import ThemeProvider from '@/components/ThemeProvider'
import AmbientBackground from '@/components/ui/AmbientBackground'
import StructuredData from './components/seo/StructuredData'
import TranslationGuard from './components/TranslationGuard'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.openlabs.org.in'

export const metadata: Metadata = {
  title: {
    default: 'OpenLabs - Virtual Lab Experience Platform for Science & Technology',
    template: '%s'
  },
  description: 'Experience interactive virtual laboratories for Physics, Chemistry, Biology, Computer Science, and Mathematics. Master concepts through simulation-based learning.',
  keywords: [
    "virtual labs",
    "science simulations",
    "physics experiments online",
    "chemistry lab simulation",
    "interactive science education",
    "STEM learning platform",
    "STEM education",
    "CBSE science practicals",
    "NCERT virtual experiments",
    "AP physics simulations",
    "IB science labs",
    "computer science visualizer",
    "biology interactive models",
    "mathematics dynamic grapher",
    "Ohm's law simulation",
    "periodic table 3D",
    "DNA replication model",
    "sorting algorithm visualizer",
    "free STEM education"
  ],
  authors: [{ name: "OpenLabs Team", url: siteUrl }],
  creator: "OpenLabs",
  publisher: "OpenLabs",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: 'https://www.openlabs.org.in/',
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.openlabs.org.in/',
    siteName: 'OpenLabs',
    title: 'OpenLabs - Virtual Lab Experience Platform for Science & Technology',
    description: 'Experience interactive virtual laboratories for Physics, Chemistry, Biology, Computer Science, and Mathematics. Master concepts through simulation-based learning.',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'OpenLabs - Virtual Science Laboratories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenLabs - Virtual Lab Experience Platform for Science & Technology',
    description: 'Experience interactive virtual laboratories for Physics, Chemistry, Biology, Computer Science, and Mathematics. Master concepts through simulation-based learning.',
    images: ['/logo.svg'],
    creator: '@openlabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'iAVkmM8erPgrIq7AOILu',
    yandex: 'dec6f568bf371741',
    other: {
      bing: 'DB3814EA47FB786C9197CFE5A3FC3BFC',
      'google-adsense-account': 'ca-pub-4121707034074280',
    },
  },
  applicationName: "OpenLabs",
}

import { AuthProvider } from '@/components/AuthProvider'
import { AdminSecretProvider } from './components/AdminSecretContext'

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          defer
          src="https://api.openanalytics.org.in/open.js"
          data-project-id="OA-7E5FC8DC2298918A"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4121707034074280"
          crossOrigin="anonymous"
        />
        {/* Adsterra Anti-Adblock Popunder JS Sync Tag */}
        <script
          src="https://disregardpervertmural.com/08/e6/db/08e6dbca5d9532e90ba54ed38592f7b0.js"
        />
      </head>
      <body className="bg-background text-foreground">
        <TranslationGuard />
        <AuthProvider>
          <AdminSecretProvider>
            <ThemeProvider>
              <AmbientBackground />
              <Navbar />
              <div className="mx-auto">
                <div data-ol-page-root>
                  <ChatProvider>
                    {children}
                    <OpenLabsAILoader />
                    <FloatingLabFeedback />
                    {/* Analytics conditionally initialized only on live production domain (never localhost or yarn start) */}
                    <AppAnalytics />
                    {/* Google AdSense script integration with automatic lab page exclusions */}
                    <GoogleAdSense />
                    {/* Adsterra popunder integration with automatic lab page exclusions */}
                    <AdsterraPopunder />
                  </ChatProvider>
                </div>
              </div>
              <Footer />
            </ThemeProvider>
          </AdminSecretProvider>
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
              alternateName: "OpenLabs Virtual Labs",
              description: "Interactive science and technology learning platform with virtual labs and simulations",
              url: siteUrl,
              logo: `${siteUrl}/images/logo.png`,
              sameAs: [
                "https://twitter.com/openlabs",
                "https://github.com/hackeryard/openlabs"
              ],
              knowsAbout: [
                "Physics Simulations",
                "Chemistry Experiments",
                "Biology Cytology & Genetics",
                "Computer Science & Algorithms",
                "Mathematics Dynamic Graphing"
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "STEM Virtual Laboratories & Interactive Curriculums",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Physics Laboratory Simulations",
                      description: "Interactive online physics simulations covering mechanics, wave optics, electricity, and thermodynamics.",
                      provider: {
                        "@type": "EducationalOrganization",
                        name: "OpenLabs",
                        url: siteUrl
                      }
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Chemistry Virtual Experiments",
                      description: "Interactive chemistry simulations covering titration, periodic table structure, bonding, and kinetics.",
                      provider: {
                        "@type": "EducationalOrganization",
                        name: "OpenLabs",
                        url: siteUrl
                      }
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Biology & Life Sciences Laboratories",
                      description: "Interactive biology simulations covering cytology, genetics, mitosis, and cardiac cycle dynamics.",
                      provider: {
                        "@type": "EducationalOrganization",
                        name: "OpenLabs",
                        url: siteUrl
                      }
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Computer Science & Discrete Mathematics Studios",
                      description: "Interactive computer science visualizers for algorithms, pathfinding, networking, and machine learning.",
                      provider: {
                        "@type": "EducationalOrganization",
                        name: "OpenLabs",
                        url: siteUrl
                      }
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Mathematics Dynamic Graphers & Visualizations",
                      description: "Interactive mathematics tools for calculus, linear algebra, trigonometry, and polynomial exploration.",
                      provider: {
                        "@type": "EducationalOrganization",
                        name: "OpenLabs",
                        url: siteUrl
                      }
                    }
                  }
                ]
              }
            }
          ]}
        />
      </body>
    </html>
  )
}
