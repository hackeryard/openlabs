import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blockchain Learning Lab | Computer Science',
    description: 'Explore blockchain concepts, block creation, and decentralized systems with interactive simulations. Learn about blocks, mining, and distributed ledgers.',
    keywords: [
        'blockchain simulation', 'blockchain learning', 'decentralized systems', 'distributed ledger',
        'block mining', 'blockchain education', 'crypto technology', 'computer science'
    ],
    openGraph: {
        title: 'Blockchain Learning Lab | OpenLabs',
        description: 'Explore blockchain concepts, block creation, and decentralized systems in an interactive lab.',
        url: '/computer-science/blockchain',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Blockchain Learning Lab | OpenLabs',
        description: 'Explore blockchain concepts, block creation, and decentralized systems in an interactive lab.',
    },
    alternates: {
        canonical: '/computer-science/blockchain',
    },
}

export default function BlockchainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}