import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Stack Data Structure | CS Lab',
    description: 'Interactive stack data structure simulation. Learn how push, pop, and stack behavior works with examples.',
    keywords: [
        'stack data structure', 'stack simulation', 'stack push', 'stack pop',
        'computer science', 'data structure lab', 'interactive learning', 'stack operations'
    ],
    openGraph: {
        title: 'Stack Data Structure | OpenLabs',
        description: 'Interactive stack data structure simulation to learn push, pop, and stack behavior.',
        url: '/computer-science/dsa/stack',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Stack Data Structure | OpenLabs',
        description: 'Interactive stack data structure simulation to learn push, pop, and stack behavior.',
    },
    alternates: {
        canonical: '/computer-science/dsa/stack',
    },
}

export default function StackLayout({ children }: { children: React.ReactNode }) {
    return children
}
