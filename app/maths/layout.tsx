import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mathematics Tools & Interactive Learning',
    description: 'Explore interactive mathematics tools and visualizations. Learn algebra, geometry, and mathematical concepts through virtual labs.',
    keywords: [
        'mathematics tools', 'interactive math', 'algebra visualization', 'geometry tools',
        'virtual math lab', 'mathematics education', 'STEM math', 'algebra calculator',
        'mathematical simulations', 'math learning platform'
    ],
    openGraph: {
        title: 'Mathematics Tools | OpenLabs',
        description: 'Explore interactive mathematics tools and visualizations. Learn algebra, geometry, and mathematical concepts through virtual labs.',
        url: '/maths',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Mathematics Tools | OpenLabs',
        description: 'Explore interactive mathematics tools and visualizations. Learn algebra, geometry, and mathematical concepts through virtual labs.',
    },
    alternates: {
        canonical: '/maths',
    },
}

export default function MathsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}