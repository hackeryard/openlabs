import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'NOR Gate Simulator | Logic Gates',
    description: 'Interactive NOR gate simulator. Learn digital logic, truth tables, and how the NOR gate outputs true only when all inputs are false.',
    keywords: [
        'NOR gate', 'digital logic', 'logic gate simulator', 'truth table',
        'interactive logic', 'computer science lab', 'logic gate tutorial', 'boolean logic'
    ],
    openGraph: {
        title: 'NOR Gate Simulator | OpenLabs',
        description: 'Interactive NOR gate simulator to learn truth tables and inverter logic.',
        url: '/computer-science/logic-gates/nor-gate',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'NOR Gate Simulator | OpenLabs',
        description: 'Interactive NOR gate simulator to learn truth tables and inverter logic.',
    },
    alternates: {
        canonical: '/computer-science/logic-gates/nor-gate',
    },
}

export default function NorGateLayout({ children }: { children: React.ReactNode }) {
    return children
}
