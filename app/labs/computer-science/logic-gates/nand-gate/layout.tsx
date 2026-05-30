import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'NAND Gate Simulator | Logic Gates',
    description: 'Interactive NAND gate simulator. Learn digital logic, truth tables, and how the NAND gate outputs false only when all inputs are true.',
    keywords: [
        'NAND gate', 'digital logic', 'logic gate simulator', 'truth table',
        'interactive logic', 'computer science lab', 'logic gate tutorial', 'boolean logic'
    ],
    openGraph: {
        title: 'NAND Gate Simulator | OpenLabs',
        description: 'Interactive NAND gate simulator to learn truth tables and inverter logic.',
        url: '/computer-science/logic-gates/nand-gate',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'NAND Gate Simulator | OpenLabs',
        description: 'Interactive NAND gate simulator to learn truth tables and inverter logic.',
    },
    alternates: {
        canonical: '/computer-science/logic-gates/nand-gate',
    },
}

export default function NandGateLayout({ children }: { children: React.ReactNode }) {
    return children
}
