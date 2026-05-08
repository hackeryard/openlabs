import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cell Structure & Function | Biology Lab',
    description: 'Interactive cell biology simulation. Explore plant and animal cell structures, organelles, and cellular processes.',
    keywords: [
        'cell structure', 'cell biology', 'organelles', 'plant cells', 'animal cells',
        'cellular processes', 'biology simulation', 'microbiology', 'cell function'
    ],
    openGraph: {
        title: 'Cell Structure & Function | OpenLabs',
        description: 'Interactive cell biology simulation for biology education.',
        url: '/biology/cell',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Cell Structure & Function | OpenLabs',
        description: 'Interactive cell biology simulation for biology education.',
    },
    alternates: {
        canonical: '/biology/cell',
    },
}

export default function CellLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}