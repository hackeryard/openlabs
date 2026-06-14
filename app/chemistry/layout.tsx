import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Chemistry Virtual Labs | Interactive Chemistry Education | OpenLabs',
    description: 'OpenLabs Chemistry offers interactive virtual labs for periodic trends, chemical bonding, reaction simulation, and water quality analysis.',
    keywords: [
        'interactive chemistry', 'chemistry simulations', 'periodic table', 'chemical bond types',
        'water quality analysis', 'reaction simulation', 'virtual chemistry lab', 'chemistry education',
        'STEM learning', 'science virtual labs'
    ],
    openGraph: {
        title: 'Chemistry Virtual Labs | Interactive Chemistry Education | OpenLabs',
        description: 'Explore interactive periodic table simulations, molecular bonding labs, reaction kinetics, and water quality analysis with OpenLabs Chemistry.',
        url: 'https://www.openlabs.org.in/chemistry',
        type: 'website',
        images: [{
            url: 'https://www.openlabs.org.in/images/og-image.svg',
            width: 1200,
            height: 630,
            alt: 'Chemistry Virtual Labs | OpenLabs'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        images: ['https://www.openlabs.org.in/images/twitter-image.svg'],
        title: 'Chemistry Virtual Labs | Interactive Chemistry Education | OpenLabs',
        description: 'Explore interactive periodic table simulations, molecular bonding labs, reaction kinetics, and water quality analysis with OpenLabs Chemistry.',
    },
    alternates: {
        canonical: 'https://www.openlabs.org.in/chemistry',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function ChemistryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}