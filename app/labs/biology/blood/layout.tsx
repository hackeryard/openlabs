import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blood Circulation System | Biology Lab',
    description: 'Interactive blood circulation simulation. Explore the cardiovascular system, blood flow, heart function, and circulatory anatomy.',
    keywords: [
        'blood circulation', 'cardiovascular system', 'heart function', 'circulatory system',
        'biology simulation', 'blood flow', 'anatomy lab', 'interactive biology'
    ],
    openGraph: {
        title: 'Blood Circulation System | OpenLabs',
        description: 'Interactive blood circulation simulation for biology education.',
        url: '/biology/blood',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Blood Circulation System | OpenLabs',
        description: 'Interactive blood circulation simulation for biology education.',
    },
    alternates: {
        canonical: '/biology/blood',
    },
}

export default function BloodLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}