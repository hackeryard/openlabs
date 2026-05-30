import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Java Code Lab | Interactive Coding',
    description: 'Interactive Java coding environment. Write and run Java code with instant feedback in a hands-on learning lab.',
    keywords: [
        'java code lab', 'interactive coding', 'java editor', 'code visualization',
        'computer science lab', 'programming practice', 'java learning', 'software development'
    ],
    openGraph: {
        title: 'Java Code Lab | OpenLabs',
        description: 'Interactive Java coding environment for learning programming and development.',
        url: '/computer-science/code-lab/java',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Java Code Lab | OpenLabs',
        description: 'Interactive Java coding environment for learning programming and development.',
    },
    alternates: {
        canonical: '/computer-science/code-lab/java',
    },
}

export default function CodeLabJavaLayout({ children }: { children: React.ReactNode }) {
    return children
}
