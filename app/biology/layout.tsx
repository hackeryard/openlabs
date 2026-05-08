import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Biology Virtual Labs & Interactive Experiments',
    description: 'Explore interactive biology experiments including cell structure, human anatomy, blood circulation, and brain neuron simulations.',
    keywords: [
        'biology experiments', 'interactive biology', 'cell structure', 'human anatomy',
        'blood circulation', 'brain neurons', 'virtual biology lab', 'biology education',
        'STEM biology', 'anatomy simulation', 'neuroscience', 'cellular biology'
    ],
    openGraph: {
        title: 'Biology Experiments | OpenLabs',
        description: 'Explore interactive biology experiments including cell structure, human anatomy, blood circulation, and brain neuron simulations.',
        url: '/biology',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Biology Experiments | OpenLabs',
        description: 'Explore interactive biology experiments including cell structure, human anatomy, blood circulation, and brain neuron simulations.',
    },
    alternates: {
        canonical: '/biology',
    },
}

export default function BiologyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}