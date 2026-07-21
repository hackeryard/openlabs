import type { Metadata } from 'next'

export const metadata: Metadata = {
    // No "| OpenLabs" suffix — the root layout's title.template already
    // appends it for /biology (page.tsx there has no metadata of its
    // own, so this layout title is what's used); baking it in doubled
    // it live ("...| OpenLabs | OpenLabs").
    title: 'Biology Virtual Labs & Interactive Experiments',
    description: 'Explore interactive biology experiments including cell structure, human anatomy, blood circulation, and brain neuron simulations.',
    keywords: [
        'biology experiments', 'interactive biology', 'cell structure', 'human anatomy',
        'blood circulation', 'brain neurons', 'virtual biology lab', 'biology education',
        'STEM biology', 'anatomy simulation', 'neuroscience', 'cellular biology'
    ],
    openGraph: {
        title: 'Biology Virtual Labs & Interactive Experiments | OpenLabs',
        description: 'Explore interactive biology experiments including cell structure, human anatomy, blood circulation, and brain neuron simulations.',
        url: 'https://www.openlabs.org.in/biology',
        type: 'website',
        images: [{
            url: 'https://www.openlabs.org.in/images/og-image.svg',
            width: 1200,
            height: 630,
            alt: 'Biology Virtual Labs | OpenLabs'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        images: ['https://www.openlabs.org.in/images/twitter-image.svg'],
        title: 'Biology Virtual Labs & Interactive Experiments | OpenLabs',
        description: 'Explore interactive biology experiments including cell structure, human anatomy, blood circulation, and brain neuron simulations.',
    },
    alternates: {
        canonical: 'https://www.openlabs.org.in/biology',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function BiologyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}