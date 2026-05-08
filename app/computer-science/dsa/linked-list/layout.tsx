import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Linked List Data Structure | CS Lab',
    description: 'Interactive linked list simulation. Learn node insertion, traversal, and list operations in data structures.',
    keywords: [
        'linked list', 'data structure', 'node traversal', 'list operations',
        'computer science', 'interactive data structure', 'linked list simulation', 'singly linked list'
    ],
    openGraph: {
        title: 'Linked List Data Structure | OpenLabs',
        description: 'Interactive linked list simulation to learn node insertion, traversal, and list operations.',
        url: '/computer-science/dsa/linked-list',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Linked List Data Structure | OpenLabs',
        description: 'Interactive linked list simulation to learn node insertion, traversal, and list operations.',
    },
    alternates: {
        canonical: '/computer-science/dsa/linked-list',
    },
}

export default function LinkedListLayout({ children }: { children: React.ReactNode }) {
    return children
}
