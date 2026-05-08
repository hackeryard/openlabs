import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Forward-Backward AI Problem | CS Lab',
    description: 'Interactive forward-backward search AI challenge. Explore bidirectional search and efficient problem solving techniques.',
    keywords: [
        'forward backward search', 'AI problem', 'bidirectional search', 'search algorithms',
        'computer science lab', 'interactive AI', 'problem solving', 'search strategy'
    ],
    openGraph: {
        title: 'Forward-Backward AI Problem | OpenLabs',
        description: 'Interactive forward-backward search AI challenge to explore bidirectional search techniques.',
        url: '/computer-science/ai-problem/forward-backward',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Forward-Backward AI Problem | OpenLabs',
        description: 'Interactive forward-backward search AI challenge to explore bidirectional search techniques.',
    },
    alternates: {
        canonical: '/computer-science/ai-problem/forward-backward',
    },
}

export default function ForwardBackwardLayout({ children }: { children: React.ReactNode }) {
    return children
}
