import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Physics Virtual Labs and Interactive Experiments',
    description: 'Explore free interactive physics virtual labs for mechanics, electricity, optics, pendulum motion, projectile motion, circuits, lenses, and waves.',
    keywords: [
        'physics experiments', 'interactive physics', 'mechanics simulation', 'optics lab',
        'electricity experiments', 'virtual physics lab', 'physics education', 'STEM physics',
        'pendulum simulation', 'projectile motion', 'hookes law', 'ohms law', 'wave optics'
    ],
    openGraph: {
        title: 'Physics Virtual Labs and Interactive Experiments | OpenLabs',
        description: 'Explore free interactive physics labs for mechanics, electricity, optics, circuits, lenses, and waves.',
        url: 'https://www.openlabs.org.in/physics',
        type: 'website',
        images: [
            {
                url: 'https://www.openlabs.org.in/images/og-image.svg',
                width: 1200,
                height: 630,
                alt: 'OpenLabs physics virtual experiments',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        images: ['https://www.openlabs.org.in/images/twitter-image.svg'],
        title: 'Physics Virtual Labs and Interactive Experiments | OpenLabs',
        description: 'Explore free interactive physics labs for mechanics, electricity, optics, circuits, lenses, and waves.',
    },
    alternates: {
        canonical: 'https://www.openlabs.org.in/physics',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function PhysicsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
