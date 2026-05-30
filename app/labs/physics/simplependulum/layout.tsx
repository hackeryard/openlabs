import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Simple Pendulum Simulation | Physics Lab',
    description: 'Interactive simple pendulum simulation. Explore pendulum motion, measure period, and understand the relationship between length and oscillation time.',
    keywords: [
        'simple pendulum', 'pendulum simulation', 'physics experiment', 'oscillation',
        'pendulum period', 'harmonic motion', 'physics lab', 'interactive physics'
    ],
    openGraph: {
        title: 'Simple Pendulum Simulation | OpenLabs',
        description: 'Interactive simple pendulum simulation for physics education.',
        url: '/physics/simplependulum',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Simple Pendulum Simulation | OpenLabs',
        description: 'Interactive simple pendulum simulation for physics education.',
    },
    alternates: {
        canonical: '/physics/simplependulum',
    },
}

export default function SimplePendulumLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}