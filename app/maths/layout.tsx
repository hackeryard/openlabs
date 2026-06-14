import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mathematics Tools & Interactive Learning | OpenLabs',
    description: 'Explore interactive mathematics tools and visualizations. Learn algebra, geometry, and mathematical concepts through virtual labs.',
    keywords: [
        'mathematics tools', 'interactive math', 'algebra visualization', 'geometry tools',
        'virtual math lab', 'mathematics education', 'STEM math', 'algebra calculator',
        'mathematical simulations', 'math learning platform'
    ],
    openGraph: {
        title: 'Mathematics Tools & Interactive Learning | OpenLabs',
        description: 'Explore interactive mathematics tools and visualizations. Learn algebra, geometry, and mathematical concepts through virtual labs.',
        url: 'https://www.openlabs.org.in/maths',
        type: 'website',
        images: [{
            url: 'https://www.openlabs.org.in/images/og-image.svg',
            width: 1200,
            height: 630,
            alt: 'Mathematics Virtual Labs | OpenLabs'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        images: ['https://www.openlabs.org.in/images/twitter-image.svg'],
        title: 'Mathematics Tools & Interactive Learning | OpenLabs',
        description: 'Explore interactive mathematics tools and visualizations. Learn algebra, geometry, and mathematical concepts through virtual labs.',
    },
    alternates: {
        canonical: 'https://www.openlabs.org.in/maths',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function MathsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}