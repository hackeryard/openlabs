import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Monkey Banana AI Problem | CS Lab',
    description: 'Interactive Monkey Banana AI challenge. Explore planning and search strategies in a classic problem-solving simulation.',
    keywords: [
        'monkey banana problem', 'AI problem', 'planning', 'search strategies',
        'computer science lab', 'interactive AI', 'problem solving', 'artificial intelligence'
    ],
    openGraph: {
        title: 'Monkey Banana AI Problem | OpenLabs',
        description: 'Interactive Monkey Banana AI challenge for exploring planning and search strategies.',
        url: '/computer-science/ai-problem/monkey-banana',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Monkey Banana AI Problem | OpenLabs',
        description: 'Interactive Monkey Banana AI challenge for exploring planning and search strategies.',
    },
    alternates: {
        canonical: '/computer-science/ai-problem/monkey-banana',
    },
}

export default function MonkeyBananaLayout({ children }: { children: React.ReactNode }) {
    return children
}
