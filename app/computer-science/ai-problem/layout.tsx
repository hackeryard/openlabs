import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Problem Solvers | Computer Science',
    description: 'Solve interactive AI problems with simulations in search, planning, and optimization. Learn algorithms through hands-on computer science activities.',
    keywords: [
        'AI problems', 'artificial intelligence lab', 'search algorithms', 'optimization',
        'computer science education', 'interactive AI', 'algorithm practice', 'machine learning basics'
    ],
    openGraph: {
        title: 'AI Problem Solvers | OpenLabs',
        description: 'Solve interactive AI problems in search, planning, and optimization. Learn through hands-on simulations.',
        url: '/computer-science/ai-problem',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'AI Problem Solvers | OpenLabs',
        description: 'Solve interactive AI problems in search, planning, and optimization. Learn through hands-on simulations.',
    },
    alternates: {
        canonical: '/computer-science/ai-problem',
    },
}

export default function AIProblemLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}