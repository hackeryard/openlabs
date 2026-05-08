import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Circuit Switching Simulator | CS Networking',
    description: 'Interactive circuit switching simulator. Explore dedicated connection networks, switching behavior, and data flow control.',
    keywords: [
        'circuit switching', 'network switching', 'dedicated connection', 'data flow',
        'computer networking', 'interactive simulation', 'network protocols', 'networking lab'
    ],
    openGraph: {
        title: 'Circuit Switching Simulator | OpenLabs',
        description: 'Interactive circuit switching simulator to explore dedicated connections and switching behavior.',
        url: '/computer-science/networking/circuit-switching',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Circuit Switching Simulator | OpenLabs',
        description: 'Interactive circuit switching simulator to explore dedicated connections and switching behavior.',
    },
    alternates: {
        canonical: '/computer-science/networking/circuit-switching',
    },
}

export default function CircuitSwitchingLayout({ children }: { children: React.ReactNode }) {
    return children
}
