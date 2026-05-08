import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Fall Lab | Physics Simulator',
    description: 'Interactive free fall simulation. Explore gravity, acceleration, and falling motion with hands-on virtual experiments.',
    keywords: [
        'free fall', 'gravity simulation', 'acceleration', 'falling motion',
        'physics lab', 'kinematics', 'interactive physics', 'gravity experiment'
    ],
    openGraph: {
        title: 'Free Fall Lab | OpenLabs',
        description: 'Interactive free fall simulation to explore gravity, acceleration, and falling motion.',
        url: '/physics/freefall',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Free Fall Lab | OpenLabs',
        description: 'Interactive free fall simulation to explore gravity, acceleration, and falling motion.',
    },
    alternates: {
        canonical: '/physics/freefall',
    },
}

export default function FreeFallLayout({ children }: { children: React.ReactNode }) {
    return children
}
