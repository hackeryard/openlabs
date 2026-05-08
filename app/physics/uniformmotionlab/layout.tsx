import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Uniform Motion Lab | Physics Simulator',
    description: 'Interactive uniform motion simulation. Explore constant velocity, linear motion, and motion graphs with virtual experiments.',
    keywords: [
        'uniform motion', 'constant velocity', 'linear motion', 'motion simulation',
        'physics lab', 'kinematics', 'interactive physics', 'motion graphs'
    ],
    openGraph: {
        title: 'Uniform Motion Lab | OpenLabs',
        description: 'Interactive uniform motion simulation to explore constant velocity and motion graphs.',
        url: '/physics/uniformmotionlab',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Uniform Motion Lab | OpenLabs',
        description: 'Interactive uniform motion simulation to explore constant velocity and motion graphs.',
    },
    alternates: {
        canonical: '/physics/uniformmotionlab',
    },
}

export default function UniformMotionLayout({ children }: { children: React.ReactNode }) {
    return children
}
