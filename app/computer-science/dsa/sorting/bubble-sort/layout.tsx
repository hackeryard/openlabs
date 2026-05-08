import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Bubble Sort Visualization | DSA Lab',
    description: 'Interactive Bubble Sort visualization. Learn how the Bubble Sort algorithm works with step-by-step comparisons and swaps.',
    keywords: [
        'bubble sort', 'sorting algorithm', 'algorithm visualization', 'data structures',
        'computer science lab', 'interactive sorting', 'bubble sort steps', 'sorting tutorial'
    ],
    openGraph: {
        title: 'Bubble Sort Visualization | OpenLabs',
        description: 'Interactive Bubble Sort visualization for learning comparisons and swaps.',
        url: '/computer-science/dsa/sorting/bubble-sort',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Bubble Sort Visualization | OpenLabs',
        description: 'Interactive Bubble Sort visualization for learning comparisons and swaps.',
    },
    alternates: {
        canonical: '/computer-science/dsa/sorting/bubble-sort',
    },
}

export default function BubbleSortLayout({ children }: { children: React.ReactNode }) {
    return children
}
