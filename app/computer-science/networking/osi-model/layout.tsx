import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'OSI Model Explorer | CS Networking',
    description: 'Interactive OSI model explorer. Learn the seven network layers, protocols, and how data travels through network architecture.',
    keywords: [
        'osi model', 'network layers', 'network protocols', 'data transmission',
        'computer networking', 'interactive networking', 'network architecture', 'network layers explained'
    ],
    openGraph: {
        title: 'OSI Model Explorer | OpenLabs',
        description: 'Interactive OSI model explorer to learn network layers, protocols, and data transmission.',
        url: '/computer-science/networking/osi-model',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'OSI Model Explorer | OpenLabs',
        description: 'Interactive OSI model explorer to learn network layers, protocols, and data transmission.',
    },
    alternates: {
        canonical: '/computer-science/networking/osi-model',
    },
}

export default function OSIModelLayout({ children }: { children: React.ReactNode }) {
    return children
}
