import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Optics Lens Lab | Physics Simulation',
    description: 'Interactive optics lens lab. Explore ray tracing, focal length, and lens behavior using virtual optical experiments.',
    keywords: [
        'optics lens', 'ray tracing', 'focal length', 'lens simulation',
        'optical experiments', 'physics lab', 'interactive physics', 'lens behavior'
    ],
    openGraph: {
        title: 'Optics Lens Lab | OpenLabs',
        description: 'Interactive optics lens lab for exploring ray tracing, focal length, and lens behavior.',
        url: '/physics/opticslens',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Optics Lens Lab | OpenLabs',
        description: 'Interactive optics lens lab for exploring ray tracing, focal length, and lens behavior.',
    },
    alternates: {
        canonical: '/physics/opticslens',
    },
}

export default function OpticsLensLayout({ children }: { children: React.ReactNode }) {
    return children
}
