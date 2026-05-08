import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Electronic Configuration Explorer | Chemistry',
    description: 'Explore electronic configuration for atoms and learn how electrons fill atomic orbitals with interactive chemistry visualizations.',
    keywords: [
        'electronic configuration', 'atomic orbitals', 'electron shell', 'chemistry education',
        'atomic structure', 'element configuration', 'interactive chemistry', 'electron arrangement'
    ],
    openGraph: {
        title: 'Electronic Configuration Explorer | OpenLabs',
        description: 'Explore electronic configuration for atoms with interactive visualizations.',
        url: '/chemistry/electronic-configuration',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Electronic Configuration Explorer | OpenLabs',
        description: 'Explore electronic configuration for atoms with interactive visualizations.',
    },
    alternates: {
        canonical: '/chemistry/electronic-configuration',
    },
}

export default function ElectronicConfigurationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}