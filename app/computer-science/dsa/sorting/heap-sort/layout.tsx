import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Heap Sort Visualization | DSA Lab',
    description: 'Interactive Heap Sort visualization. Learn how heap data structures enable efficient sorting with heapify and extraction.',
    keywords: [
        'heap sort', 'sorting algorithm', 'algorithm visualization', 'data structures',
        'computer science lab', 'interactive sorting', 'heapify', 'sorting tutorial'
    ],
    openGraph: {
        title: 'Heap Sort Visualization | OpenLabs',
        description: 'Interactive Heap Sort visualization for learning heapify and efficient sorting.',
        url: '/computer-science/dsa/sorting/heap-sort',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Heap Sort Visualization | OpenLabs',
        description: 'Interactive Heap Sort visualization for learning heapify and efficient sorting.',
    },
    alternates: {
        canonical: '/computer-science/dsa/sorting/heap-sort',
    },
}

export default function HeapSortLayout({ children }: { children: React.ReactNode }) {
    return children
}
