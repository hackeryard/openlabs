import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Chemical Bond Types | Chemistry Lab',
    description: 'Interactive chemical bonds simulation. Learn about ionic, covalent, and metallic bonds with 3D visualizations and interactive examples.',
    keywords: [
        'chemical bonds', 'ionic bonds', 'covalent bonds', 'metallic bonds',
        'chemistry simulation', 'bond types', 'interactive chemistry', 'molecular bonds'
    ],
    openGraph: {
        title: 'Chemical Bond Types | OpenLabs',
        description: 'Interactive chemical bonds simulation for chemistry education.',
        url: '/chemistry/chemicalbonds',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Chemical Bond Types | OpenLabs',
        description: 'Interactive chemical bonds simulation for chemistry education.',
    },
    alternates: {
        canonical: '/chemistry/chemicalbonds',
    },
}

export default function ChemicalBondsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}