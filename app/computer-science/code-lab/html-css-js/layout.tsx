import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'HTML/CSS/JS Code Lab | Interactive Coding',
    description: 'Interactive HTML, CSS, and JavaScript coding environment. Build web pages and learn front-end development through live editing.',
    keywords: [
        'html css js code lab', 'front-end coding', 'web development', 'interactive coding',
        'computer science lab', 'html editor', 'css editor', 'javascript editor'
    ],
    openGraph: {
        title: 'HTML/CSS/JS Code Lab | OpenLabs',
        description: 'Interactive HTML, CSS, and JavaScript coding environment for front-end learning.',
        url: '/computer-science/code-lab/html-css-js',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'HTML/CSS/JS Code Lab | OpenLabs',
        description: 'Interactive HTML, CSS, and JavaScript coding environment for front-end learning.',
    },
    alternates: {
        canonical: '/computer-science/code-lab/html-css-js',
    },
}

export default function CodeLabHtmlCssJsLayout({ children }: { children: React.ReactNode }) {
    return children
}
