import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Packet Switching Simulator | CS Lab',
    description: 'Interactive packet switching simulator. Explore packet flow, routing, and network traffic behavior in data networks.',
    keywords: [
        'packet switching', 'network routing', 'packet flow', 'network traffic',
        'computer networking', 'interactive simulation', 'networking lab', 'data networks'
    ],
    openGraph: {
        title: 'Packet Switching Simulator | OpenLabs',
        description: 'Interactive packet switching simulator to explore packet flow, routing, and network traffic behavior.',
        url: '/computer-science/networking/packet-switching',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Packet Switching Simulator | OpenLabs',
        description: 'Interactive packet switching simulator to explore packet flow, routing, and network traffic behavior.',
    },
    alternates: {
        canonical: '/computer-science/networking/packet-switching',
    },
}

export default function PacketSwitchingLayout({ children }: { children: React.ReactNode }) {
    return children
}
