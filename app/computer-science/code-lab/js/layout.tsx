import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'JavaScript Code Lab | Interactive Coding',
    description: 'Interactive JavaScript coding environment. Write, run, and visualize JavaScript code in a browser-based learning lab.',
    keywords: [
        'javascript code lab', 'interactive coding', 'javascript editor', 'code visualization',
        'computer science lab', 'programming practice', 'web development', 'javascript learning'
    ],
    openGraph: {
        title: 'JavaScript Code Lab | OpenLabs',
        description: 'Interactive JavaScript coding environment for learning code and development.',
        url: '/computer-science/code-lab/js',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'JavaScript Code Lab | OpenLabs',
        description: 'Interactive JavaScript coding environment for learning code and development.',
    },
    alternates: {
        canonical: '/computer-science/code-lab/js',
    },
}

export default function CodeLabJsLayout({ children }: { children: React.ReactNode }) {
    return children
}
