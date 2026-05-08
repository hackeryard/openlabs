import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Hill Climbing AI Problem | CS Lab',
    description: 'Interactive hill climbing AI challenge. Explore local search, heuristics, and optimization in a machine learning simulation.',
    keywords: [
        'hill climbing', 'AI problem', 'local search', 'heuristics',
        'computer science lab', 'interactive AI', 'optimization', 'search algorithms'
    ],
    openGraph: {
        title: 'Hill Climbing AI Problem | OpenLabs',
        description: 'Interactive hill climbing AI challenge for experimenting with local search and optimization.',
        url: '/computer-science/ai-problem/hill-climb',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Hill Climbing AI Problem | OpenLabs',
        description: 'Interactive hill climbing AI challenge for experimenting with local search and optimization.',
    },
    alternates: {
        canonical: '/computer-science/ai-problem/hill-climb',
    },
}

export default function HillClimbLayout({ children }: { children: React.ReactNode }) {
    return children
}
