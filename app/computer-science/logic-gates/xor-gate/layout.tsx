import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'XOR Gate Simulator | Logic Gates',
    description: 'Interactive XOR gate simulator. Learn digital logic, truth tables, and how the XOR gate outputs true when inputs differ.',
    keywords: [
        'XOR gate', 'digital logic', 'logic gate simulator', 'truth table',
        'interactive logic', 'computer science lab', 'logic gate tutorial', 'exclusive or'
    ],
    openGraph: {
        title: 'XOR Gate Simulator | OpenLabs',
        description: 'Interactive XOR gate simulator to learn truth tables and exclusive-or logic.',
        url: '/computer-science/logic-gates/xor-gate',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'XOR Gate Simulator | OpenLabs',
        description: 'Interactive XOR gate simulator to learn truth tables and exclusive-or logic.',
    },
    alternates: {
        canonical: '/computer-science/logic-gates/xor-gate',
    },
}

export default function XorGateLayout({ children }: { children: React.ReactNode }) {
    return children
}
