import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'JS Event Loop Visualizer | Interactive Learning',
    description: 'Interactive JavaScript event loop visualizer. See how the Call Stack, Web APIs, Microtask Queue, and Macrotask Queue work together step-by-step.',
    keywords: [
        'javascript event loop', 'event loop visualizer', 'call stack', 'microtask queue',
        'macrotask queue', 'web apis', 'promise vs settimeout', 'async await',
        'javascript runtime', 'computer science lab'
    ],
    openGraph: {
        title: 'JS Event Loop Visualizer | OpenLabs',
        description: 'Interactive visualization of the JavaScript event loop. Understand Call Stack, Web APIs, and task queues.',
        url: '/computer-science/code-lab/js',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'JS Event Loop Visualizer | OpenLabs',
        description: 'Interactive visualization of the JavaScript event loop with step-by-step animation.',
    },
    alternates: {
        canonical: '/computer-science/code-lab/js',
    },
}

export default function CodeLabJsLayout({ children }: { children: React.ReactNode }) {
    return children
}
