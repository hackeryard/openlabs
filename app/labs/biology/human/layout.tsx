import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Human Anatomy Explorer | Biology Lab',
    description: 'Interactive human anatomy simulation. Explore body systems, organs, tissues, and learn about human physiology through 3D visualizations.',
    keywords: [
        'human anatomy', 'body systems', 'physiology', 'anatomy simulation',
        'biology lab', 'organ systems', 'human body', 'interactive anatomy'
    ],
    openGraph: {
        title: 'Human Anatomy Explorer | OpenLabs',
        description: 'Interactive human anatomy simulation for biology education.',
        url: '/biology/human',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Human Anatomy Explorer | OpenLabs',
        description: 'Interactive human anatomy simulation for biology education.',
    },
    alternates: {
        canonical: '/biology/human',
    },
}

export default function HumanLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}