import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Selection Sort Visualization | DSA Lab',
    description: 'Interactive Selection Sort visualization. Learn how the algorithm repeatedly selects the smallest element and sorts arrays step by step.',
    keywords: [
        'selection sort', 'sorting algorithm', 'algorithm visualization', 'data structures',
        'computer science lab', 'interactive sorting', 'selection sort steps', 'sorting tutorial'
    ],
    openGraph: {
        title: 'Selection Sort Visualization | OpenLabs',
        description: 'Interactive Selection Sort visualization for learning element selection and sorting.',
        url: '/computer-science/dsa/sorting/selection-sort',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Selection Sort Visualization | OpenLabs',
        description: 'Interactive Selection Sort visualization for learning element selection and sorting.',
    },
    alternates: {
        canonical: '/computer-science/dsa/sorting/selection-sort',
    },
}

export default function SelectionSortLayout({ children }: { children: React.ReactNode }) {
    return children
}
