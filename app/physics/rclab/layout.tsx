import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'RC Circuit Lab | Physics Simulation',
    description: 'Interactive RC circuit simulation. Explore capacitor charging and discharging, time constants, and circuit response.',
    keywords: [
        'rc circuit', 'capacitor charging', 'capacitor discharging', 'time constant',
        'circuit simulation', 'physics lab', 'electrical experiment', 'interactive physics'
    ],
    openGraph: {
        title: 'RC Circuit Lab | OpenLabs',
        description: 'Interactive RC circuit simulation to explore charging, discharging, and time constants.',
        url: '/physics/rclab',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'RC Circuit Lab | OpenLabs',
        description: 'Interactive RC circuit simulation to explore charging, discharging, and time constants.',
    },
    alternates: {
        canonical: '/physics/rclab',
    },
}

export default function RCLabLayout({ children }: { children: React.ReactNode }) {
    return children
}
