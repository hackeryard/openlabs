import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Physics Virtual Labs & Interactive Experiments',
    description: 'Explore interactive physics experiments including mechanics, optics, electricity, and more. Learn through hands-on virtual labs and simulations.',
    keywords: [
        'physics experiments', 'interactive physics', 'mechanics simulation', 'optics lab',
        'electricity experiments', 'virtual physics lab', 'physics education', 'STEM physics',
        'pendulum simulation', 'projectile motion', 'hookes law', 'ohms law', 'wave optics'
    ],
    openGraph: {
        title: 'Physics Experiments | OpenLabs',
        description: 'Explore interactive physics experiments including mechanics, optics, electricity, and more.',
        url: '/physics',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Physics Experiments | OpenLabs',
        description: 'Explore interactive physics experiments including mechanics, optics, electricity, and more.',
    },
    alternates: {
        canonical: '/physics',
    },
}

export default function PhysicsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}