import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Algebra Tools & Interactive Learning | Mathematics',
    description: 'Interactive algebra tools and visualizations. Learn algebraic concepts, equations, functions, and mathematical problem-solving.',
    keywords: [
        'algebra tools', 'algebra learning', 'mathematical equations', 'algebra functions',
        'interactive math', 'algebra visualization', 'mathematics education', 'algebra problems'
    ],
    openGraph: {
        title: 'Algebra Tools & Interactive Learning | OpenLabs',
        description: 'Interactive algebra tools and visualizations for mathematics education.',
        url: '/maths/alzebra',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Algebra Tools & Interactive Learning | OpenLabs',
        description: 'Interactive algebra tools and visualizations for mathematics education.',
    },
    alternates: {
        canonical: '/maths/alzebra',
    },
}

export default function AlzebraLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}