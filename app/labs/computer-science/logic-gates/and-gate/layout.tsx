import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AND Gate Simulator | Logic Gates',
    description: 'Interactive AND gate simulator. Learn digital logic with truth tables, inputs, and outputs for the AND logic gate.',
    keywords: [
        'AND gate', 'digital logic', 'logic gate simulator', 'truth table',
        'computer science lab', 'interactive logic', 'logic gate tutorial', 'AND logic'
    ],
    openGraph: {
        title: 'AND Gate Simulator | OpenLabs',
        description: 'Interactive AND gate simulator to learn digital logic and truth tables.',
        url: '/computer-science/logic-gates/and-gate',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'AND Gate Simulator | OpenLabs',
        description: 'Interactive AND gate simulator to learn digital logic and truth tables.',
    },
    alternates: {
        canonical: '/computer-science/logic-gates/and-gate',
    },
}

export default function AndGateLayout({ children }: { children: React.ReactNode }) {
    return children
}
