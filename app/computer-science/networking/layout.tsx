import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Computer Networking Simulator | CS Lab',
    description: 'Interactive computer networking simulation. Learn about network topologies, protocols, data transmission, and network architecture.',
    keywords: [
        'computer networking', 'network simulation', 'network topology', 'network protocols',
        'data transmission', 'network architecture', 'computer science', 'networking lab'
    ],
    openGraph: {
        title: 'Computer Networking Simulator | OpenLabs',
        description: 'Interactive computer networking simulation for computer science education.',
        url: '/computer-science/networking',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Computer Networking Simulator | OpenLabs',
        description: 'Interactive computer networking simulation for computer science education.',
    },
    alternates: {
        canonical: '/computer-science/networking',
    },
}

export default function NetworkingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}