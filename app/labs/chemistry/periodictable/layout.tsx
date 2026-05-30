import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
    title: 'Interactive Periodic Table | OpenLabs',
    description: 'Explore the interactive periodic table with detailed information about chemical elements, their properties, atomic structure, and more. Perfect for chemistry education.',
    keywords: [
        'periodic table', 'chemical elements', 'interactive periodic table', 'element properties',
        'atomic number', 'atomic mass', 'chemistry education', 'chemical elements database',
        'periodic table quiz', 'element information', 'chemistry learning'
    ],
    openGraph: {
        title: 'Interactive Periodic Table | OpenLabs',
        description: 'Explore the interactive periodic table with detailed information about chemical elements.',
        url: '/chemistry/periodictable',
        type: 'website',
        images: [
            {
                url: '/images/chemistry/periodic-table-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Interactive Periodic Table',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Interactive Periodic Table | OpenLabs',
        description: 'Explore the interactive periodic table with detailed information about chemical elements.',
    },
    alternates: {
        canonical: '/chemistry/periodictable',
    },
}

export default function PeriodicTableLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            <Script
                id="periodic-table-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebPage',
                        name: 'Interactive Periodic Table',
                        description: 'Interactive periodic table with detailed chemical element information',
                        url: 'https://www.openlabs.org.in/chemistry/periodictable',
                        isPartOf: {
                            '@type': 'WebSite',
                            name: 'OpenLabs',
                            url: 'https://www.openlabs.org.in'
                        },
                        about: {
                            '@type': 'DefinedTermSet',
                            name: 'Periodic Table of Elements',
                            description: 'Systematic arrangement of chemical elements'
                        },
                        educationalUse: 'Chemistry Education',
                        learningResourceType: 'Interactive Tool'
                    })
                }}
            />
        </>
    )
}