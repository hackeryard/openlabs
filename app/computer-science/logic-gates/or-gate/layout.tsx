import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'OR Gate Simulator | Logic Gates',
    description: 'Interactive OR gate simulator. Learn digital logic with inputs, outputs, and the OR gate truth table.',
    keywords: [
        'OR gate', 'digital logic', 'logic gate simulator', 'truth table',
        'interactive logic', 'computer science lab', 'logic gate tutorial', 'OR logic'
    ],
    openGraph: {
        title: 'OR Gate Simulator | OpenLabs',
        description: 'Interactive OR gate simulator to learn digital logic and truth tables.',
        url: '/computer-science/logic-gates/or-gate',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'OR Gate Simulator | OpenLabs',
        description: 'Interactive OR gate simulator to learn digital logic and truth tables.',
    },
    alternates: {
        canonical: '/computer-science/logic-gates/or-gate',
    },
}

export default function OrGateLayout({ children }: { children: React.ReactNode }) {
    return children
}
