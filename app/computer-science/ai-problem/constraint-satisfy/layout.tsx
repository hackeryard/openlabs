import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Constraint Satisfaction AI Problem | CS Lab',
    description: 'Interactive constraint satisfaction problem solver. Explore AI search, constraint propagation, and solution finding for complex puzzles.',
    keywords: [
        'constraint satisfaction', 'AI problem', 'constraint propagation', 'search algorithms',
        'computer science lab', 'interactive AI', 'problem solving', 'puzzle solver'
    ],
    openGraph: {
        title: 'Constraint Satisfaction AI Problem | OpenLabs',
        description: 'Interactive constraint satisfaction problem solver to explore AI search and constraint propagation.',
        url: '/computer-science/ai-problem/constraint-satisfy',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Constraint Satisfaction AI Problem | OpenLabs',
        description: 'Interactive constraint satisfaction problem solver to explore AI search and constraint propagation.',
    },
    alternates: {
        canonical: '/computer-science/ai-problem/constraint-satisfy',
    },
}

export default function ConstraintSatisfyLayout({ children }: { children: React.ReactNode }) {
    return children
}
