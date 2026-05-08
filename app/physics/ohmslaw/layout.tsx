import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Ohm\'s Law Circuit Simulator | Physics Lab',
    description: 'Interactive Ohm\'s Law experiment. Explore voltage-current relationships, measure resistance, and understand electrical circuits.',
    keywords: [
        'ohms law', 'electrical circuits', 'voltage current', 'resistance measurement',
        'physics experiment', 'circuit simulation', 'interactive physics', 'electricity lab'
    ],
    openGraph: {
        title: 'Ohm\'s Law Circuit Simulator | OpenLabs',
        description: 'Interactive Ohm\'s Law experiment for physics education.',
        url: '/physics/ohmslaw',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Ohm\'s Law Circuit Simulator | OpenLabs',
        description: 'Interactive Ohm\'s Law experiment for physics education.',
    },
    alternates: {
        canonical: '/physics/ohmslaw',
    },
}

export default function OhmsLawLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}