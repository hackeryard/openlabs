import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Queue Data Structure | CS Lab',
    description: 'Interactive queue simulation. Learn FIFO behavior, enqueue, dequeue, and queue operations in data structures.',
    keywords: [
        'queue data structure', 'queue simulation', 'fifo', 'enqueue', 'dequeue',
        'computer science', 'data structure lab', 'interactive learning', 'queue operations'
    ],
    openGraph: {
        title: 'Queue Data Structure | OpenLabs',
        description: 'Interactive queue simulation to learn FIFO behavior, enqueue, and dequeue operations.',
        url: '/computer-science/dsa/queue',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Queue Data Structure | OpenLabs',
        description: 'Interactive queue simulation to learn FIFO behavior, enqueue, and dequeue operations.',
    },
    alternates: {
        canonical: '/computer-science/dsa/queue',
    },
}

export default function QueueLayout({ children }: { children: React.ReactNode }) {
    return children
}
