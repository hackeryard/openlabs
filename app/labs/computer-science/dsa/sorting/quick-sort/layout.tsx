import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Quick Sort Visualization | DSA Lab',
    description: 'Interactive Quick Sort visualization. Learn partitioning, pivot selection, and recursion in sorting algorithms.',
    keywords: [
        'quick sort', 'sorting algorithm', 'algorithm visualization', 'data structures',
        'computer science lab', 'interactive sorting', 'quick sort steps', 'sorting tutorial'
    ],
    openGraph: {
        title: 'Quick Sort Visualization | OpenLabs',
        description: 'Interactive Quick Sort visualization for learning partitioning and recursion.',
        url: '/computer-science/dsa/sorting/quick-sort',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Quick Sort Visualization | OpenLabs',
        description: 'Interactive Quick Sort visualization for learning partitioning and recursion.',
    },
    alternates: {
        canonical: '/computer-science/dsa/sorting/quick-sort',
    },
}

export default function QuickSortLayout({ children }: { children: React.ReactNode }) {
    return children
}
