import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'XNOR Gate Simulator | Logic Gates',
    description: 'Interactive XNOR gate simulator. Learn digital logic, truth tables, and how the XNOR gate outputs true when inputs are equal.',
    keywords: [
        'XNOR gate', 'digital logic', 'logic gate simulator', 'truth table',
        'interactive logic', 'computer science lab', 'logic gate tutorial', 'equivalence logic'
    ],
    openGraph: {
        title: 'XNOR Gate Simulator | OpenLabs',
        description: 'Interactive XNOR gate simulator to learn truth tables and equivalence logic.',
        url: '/computer-science/logic-gates/xnor-gate',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'XNOR Gate Simulator | OpenLabs',
        description: 'Interactive XNOR gate simulator to learn truth tables and equivalence logic.',
    },
    alternates: {
        canonical: '/computer-science/logic-gates/xnor-gate',
    },
}

export default function XnorGateLayout({ children }: { children: React.ReactNode }) {
    return children
}
