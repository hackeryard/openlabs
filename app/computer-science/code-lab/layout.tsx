import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Interactive Code Lab | Computer Science',
    description: 'Interactive coding environment for learning programming. Write, run, and visualize code with real-time feedback and debugging tools.',
    keywords: [
        'code lab', 'interactive coding', 'programming environment', 'code visualization',
        'debugging tools', 'coding education', 'programming lab', 'code editor'
    ],
    openGraph: {
        title: 'Interactive Code Lab | OpenLabs',
        description: 'Interactive coding environment for computer science education.',
        url: '/computer-science/code-lab',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Interactive Code Lab | OpenLabs',
        description: 'Interactive coding environment for computer science education.',
    },
    alternates: {
        canonical: '/computer-science/code-lab',
    },
}

export default function CodeLabLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}