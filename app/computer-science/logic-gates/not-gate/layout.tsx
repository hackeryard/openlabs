import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'NOT Gate Simulator | Logic Gates',
    description: 'Interactive NOT gate simulator. Learn about inverter logic, single input behavior, and how the NOT gate flips output values.',
    keywords: [
        'NOT gate', 'inverter logic', 'digital logic', 'logic gate simulator',
        'interactive logic', 'computer science lab', 'logic gate tutorial', 'boolean inversion'
    ],
    openGraph: {
        title: 'NOT Gate Simulator | OpenLabs',
        description: 'Interactive NOT gate simulator to learn inverter logic and output inversion.',
        url: '/computer-science/logic-gates/not-gate',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'NOT Gate Simulator | OpenLabs',
        description: 'Interactive NOT gate simulator to learn inverter logic and output inversion.',
    },
    alternates: {
        canonical: '/computer-science/logic-gates/not-gate',
    },
}

export default function NotGateLayout({ children }: { children: React.ReactNode }) {
    return children
}
