import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Insertion Sort Visualization | DSA Lab',
    description: 'Interactive Insertion Sort visualization. Learn how the algorithm inserts elements and sorts arrays step by step.',
    keywords: [
        'insertion sort', 'sorting algorithm', 'algorithm visualization', 'data structures',
        'computer science lab', 'interactive sorting', 'insertion sort steps', 'sorting tutorial'
    ],
    openGraph: {
        title: 'Insertion Sort Visualization | OpenLabs',
        description: 'Interactive Insertion Sort visualization for learning how elements are inserted and sorted.',
        url: '/computer-science/dsa/sorting/insertion-sort',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Insertion Sort Visualization | OpenLabs',
        description: 'Interactive Insertion Sort visualization for learning how elements are inserted and sorted.',
    },
    alternates: {
        canonical: '/computer-science/dsa/sorting/insertion-sort',
    },
}

export default function InsertionSortLayout({ children }: { children: React.ReactNode }) {
    return children
}
