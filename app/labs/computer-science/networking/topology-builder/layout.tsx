import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Network Topology Builder | CS Lab',
    description: 'Interactive network topology builder. Design network layouts, visualize nodes, and learn about topology types and connectivity.',
    keywords: [
        'network topology', 'topology builder', 'network design', 'networking simulation',
        'computer science lab', 'interactive networking', 'network nodes', 'network topology types'
    ],
    openGraph: {
        title: 'Network Topology Builder | OpenLabs',
        description: 'Interactive network topology builder for designing and visualizing network layouts.',
        url: '/computer-science/networking/topology-builder',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Network Topology Builder | OpenLabs',
        description: 'Interactive network topology builder for designing and visualizing network layouts.',
    },
    alternates: {
        canonical: '/computer-science/networking/topology-builder',
    },
}

export default function TopologyBuilderLayout({ children }: { children: React.ReactNode }) {
    return children
}
