import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blockchain Block Explorer | CS Lab',
    description: 'Interactive blockchain block explorer. Inspect block details, hashes, and transaction flow in a decentralized chain.',
    keywords: [
        'blockchain', 'blockchain explorer', 'decentralized ledger', 'blockchain lab',
        'computer science', 'interactive blockchain', 'block details', 'crypto education'
    ],
    openGraph: {
        title: 'Blockchain Block Explorer | OpenLabs',
        description: 'Interactive blockchain block explorer for inspecting block details and transaction flow.',
        url: '/computer-science/blockchain',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Blockchain Block Explorer | OpenLabs',
        description: 'Interactive blockchain block explorer for inspecting block details and transaction flow.',
    },
    alternates: {
        canonical: '/computer-science/blockchain',
    },
}

export default function BlockchainBlockLayout({ children }: { children: React.ReactNode }) {
    return children
}
