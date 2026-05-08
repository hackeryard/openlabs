import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Water Jug AI Problem | CS Lab',
    description: 'Interactive Water Jug AI problem solver. Explore state-space search and problem solving with a classic AI challenge.',
    keywords: [
        'water jug problem', 'AI problem', 'state space search', 'search algorithms',
        'computer science lab', 'interactive AI', 'problem solving', 'artificial intelligence'
    ],
    openGraph: {
        title: 'Water Jug AI Problem | OpenLabs',
        description: 'Interactive Water Jug AI problem solver for exploring search strategies and state-space search.',
        url: '/computer-science/ai-problem/water-jug',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Water Jug AI Problem | OpenLabs',
        description: 'Interactive Water Jug AI problem solver for exploring search strategies and state-space search.',
    },
    alternates: {
        canonical: '/computer-science/ai-problem/water-jug',
    },
}

export default function WaterJugLayout({ children }: { children: React.ReactNode }) {
    return children
}
