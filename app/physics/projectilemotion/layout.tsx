import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Projectile Motion Simulator | Physics Lab',
    description: 'Interactive projectile motion simulation. Launch projectiles, analyze trajectories, and understand the effects of initial velocity, angle, and gravity.',
    keywords: [
        'projectile motion', 'physics simulation', 'trajectory analysis', 'kinematics',
        'physics experiment', 'motion physics', 'interactive lab', 'physics education'
    ],
    openGraph: {
        title: 'Projectile Motion Simulator | OpenLabs',
        description: 'Interactive projectile motion simulation for physics education.',
        url: '/physics/projectilemotion',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Projectile Motion Simulator | OpenLabs',
        description: 'Interactive projectile motion simulation for physics education.',
    },
    alternates: {
        canonical: '/physics/projectilemotion',
    },
}

export default function ProjectileMotionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}