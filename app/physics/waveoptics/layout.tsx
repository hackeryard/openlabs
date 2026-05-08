import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Wave Optics Simulation | Physics Lab',
    description: 'Interactive wave optics lab. Explore diffraction, interference, and light wave behavior with virtual simulations.',
    keywords: [
        'wave optics', 'diffraction simulation', 'interference', 'light waves',
        'optics lab', 'physics education', 'wave behavior', 'interactive physics'
    ],
    openGraph: {
        title: 'Wave Optics Simulation | OpenLabs',
        description: 'Interactive wave optics simulations to learn diffraction, interference, and wave behavior.',
        url: '/physics/waveoptics',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Wave Optics Simulation | OpenLabs',
        description: 'Interactive wave optics simulations to learn diffraction, interference, and wave behavior.',
    },
    alternates: {
        canonical: '/physics/waveoptics',
    },
}

export default function WaveOpticsLayout({ children }: { children: React.ReactNode }) {
    return children
}
