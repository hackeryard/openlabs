import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Chemistry Virtual Labs & Interactive Experiments',
    description: 'Explore interactive chemistry experiments including periodic table, chemical bonds, reactions, and water quality analysis.',
    keywords: [
        'chemistry experiments', 'interactive chemistry', 'periodic table', 'chemical bonds',
        'chemical reactions', 'water quality analysis', 'virtual chemistry lab', 'chemistry education',
        'STEM chemistry', 'molecular simulations', 'element properties', 'reaction simulation'
    ],
    openGraph: {
        title: 'Chemistry Experiments | OpenLabs',
        description: 'Explore interactive chemistry experiments including periodic table, chemical bonds, reactions, and water quality analysis.',
        url: '/chemistry',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Chemistry Experiments | OpenLabs',
        description: 'Explore interactive chemistry experiments including periodic table, chemical bonds, reactions, and water quality analysis.',
    },
    alternates: {
        canonical: '/chemistry',
    },
}

export default function ChemistryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}