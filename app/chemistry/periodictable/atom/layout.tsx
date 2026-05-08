import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Element Details | Periodic Table',
    description: 'Explore detailed element information from the interactive periodic table. Learn about atomic number, mass, electron configuration, and properties.',
    keywords: [
        'element details', 'periodic table', 'chemical elements', 'atomic number',
        'electron configuration', 'element properties', 'chemistry education', 'interactive table'
    ],
    openGraph: {
        title: 'Element Details | OpenLabs',
        description: 'Explore detailed element information from the interactive periodic table.',
        url: '/chemistry/periodictable/atom',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Element Details | OpenLabs',
        description: 'Explore detailed element information from the interactive periodic table.',
    },
    alternates: {
        canonical: '/chemistry/periodictable/atom',
    },
}

export default function AtomLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}