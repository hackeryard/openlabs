import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Speed of Light Lab | Physics Simulation',
    description: 'Interactive speed of light simulation. Explore light propagation, speed measurements, and optical phenomena in virtual experiments.',
    keywords: [
        'speed of light', 'light propagation', 'optical simulation', 'physics lab',
        'light speed measurement', 'interactive physics', 'optics', 'light experiment'
    ],
    openGraph: {
        title: 'Speed of Light Lab | OpenLabs',
        description: 'Interactive speed of light simulation to explore light propagation and optical phenomena.',
        url: '/physics/speedoflight',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Speed of Light Lab | OpenLabs',
        description: 'Interactive speed of light simulation to explore light propagation and optical phenomena.',
    },
    alternates: {
        canonical: '/physics/speedoflight',
    },
}

export default function SpeedOfLightLayout({ children }: { children: React.ReactNode }) {
    return children
}
