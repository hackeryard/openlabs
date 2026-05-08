import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Energy Conservation Lab | Physics Simulator',
    description: 'Interactive energy conservation simulation. Explore energy transfer, potential and kinetic energy, and conservation principles.',
    keywords: [
        'energy conservation', 'physics simulation', 'potential energy', 'kinetic energy',
        'energy transfer', 'physics lab', 'conservation principles', 'interactive physics'
    ],
    openGraph: {
        title: 'Energy Conservation Lab | OpenLabs',
        description: 'Interactive energy conservation simulation to explore energy transfer and conservation principles.',
        url: '/physics/energyconservation',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Energy Conservation Lab | OpenLabs',
        description: 'Interactive energy conservation simulation to explore energy transfer and conservation principles.',
    },
    alternates: {
        canonical: '/physics/energyconservation',
    },
}

export default function EnergyConservationLayout({ children }: { children: React.ReactNode }) {
    return children
}
