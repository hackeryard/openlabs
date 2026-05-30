import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Data Structures & Algorithms Visualizer | CS Lab',
    description: 'Interactive data structures and algorithms visualization. Learn sorting, searching, trees, graphs, and algorithm complexity analysis.',
    keywords: [
        'data structures', 'algorithms', 'algorithm visualization', 'sorting algorithms',
        'data structure visualization', 'computer science', 'algorithm analysis', 'programming concepts'
    ],
    openGraph: {
        title: 'Data Structures & Algorithms Visualizer | OpenLabs',
        description: 'Interactive data structures and algorithms visualization for computer science education.',
        url: '/computer-science/dsa',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Data Structures & Algorithms Visualizer | OpenLabs',
        description: 'Interactive data structures and algorithms visualization for computer science education.',
    },
    alternates: {
        canonical: '/computer-science/dsa',
    },
}

export default function DSALayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}