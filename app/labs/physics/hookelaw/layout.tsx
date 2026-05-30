import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Hooke\'s Law Experiment | Physics Lab',
    description: 'Interactive Hooke\'s Law simulation. Explore spring-mass systems, measure force vs displacement, and understand elastic behavior.',
    keywords: [
        'hookes law', 'spring constant', 'elastic force', 'physics experiment',
        'spring simulation', 'force displacement', 'interactive physics', 'physics lab'
    ],
    openGraph: {
        title: 'Hooke\'s Law Experiment | OpenLabs',
        description: 'Interactive Hooke\'s Law simulation for physics education.',
        url: '/physics/hookelaw',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Hooke\'s Law Experiment | OpenLabs',
        description: 'Interactive Hooke\'s Law simulation for physics education.',
    },
    alternates: {
        canonical: '/physics/hookelaw',
    },
}

export default function HookeLawLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}