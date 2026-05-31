import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Chemical Reactions Simulator | Chemistry Lab',
    description: 'Interactive chemical reactions simulation. Visualize and understand chemical reactions, balancing equations, and reaction mechanisms.',
    keywords: [
        'chemical reactions', 'reaction simulation', 'chemistry lab', 'chemical equations',
        'reaction mechanisms', 'interactive chemistry', 'chemical processes', 'reaction visualization'
    ],
    openGraph: {
        title: 'Chemical Reactions Simulator | OpenLabs',
        description: 'Interactive chemical reactions simulation for chemistry education.',
        url: '/chemistry/reaction-simulation',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Chemical Reactions Simulator | OpenLabs',
        description: 'Interactive chemical reactions simulation for chemistry education.',
    },
    alternates: {
        canonical: '/chemistry/reaction-simulation',
    },
}

export default function ReactionSimulationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}