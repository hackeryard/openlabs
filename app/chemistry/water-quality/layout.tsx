import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Water Quality Analysis | Chemistry Lab',
    description: 'Interactive water quality testing simulation. Analyze pH, turbidity, contaminants, and learn about water treatment processes.',
    keywords: [
        'water quality', 'water analysis', 'chemistry lab', 'water testing',
        'pH measurement', 'water contaminants', 'environmental chemistry', 'water treatment'
    ],
    openGraph: {
        title: 'Water Quality Analysis | OpenLabs',
        description: 'Interactive water quality testing simulation for chemistry education.',
        url: '/chemistry/water-quality',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Water Quality Analysis | OpenLabs',
        description: 'Interactive water quality testing simulation for chemistry education.',
    },
    alternates: {
        canonical: '/chemistry/water-quality',
    },
}

export default function WaterQualityLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}