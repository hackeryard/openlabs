import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Merge Sort Visualization | DSA Lab',
    description: 'Interactive Merge Sort visualization. Learn how divide and conquer sorting merges sorted subarrays step by step.',
    keywords: [
        'merge sort', 'sorting algorithm', 'algorithm visualization', 'data structures',
        'computer science lab', 'interactive sorting', 'merge sort steps', 'sorting tutorial'
    ],
    openGraph: {
        title: 'Merge Sort Visualization | OpenLabs',
        description: 'Interactive Merge Sort visualization for learning divide and conquer sorting.',
        url: '/computer-science/dsa/sorting/merge-sort',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Merge Sort Visualization | OpenLabs',
        description: 'Interactive Merge Sort visualization for learning divide and conquer sorting.',
    },
    alternates: {
        canonical: '/computer-science/dsa/sorting/merge-sort',
    },
}

export default function MergeSortLayout({ children }: { children: React.ReactNode }) {
    return children
}
