import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Computer Science Tools & Interactive Learning | OpenLabs',
    description: 'Explore interactive computer science tools including code visualization, data structures, algorithms, networking, and blockchain simulations.',
    keywords: [
        'computer science tools', 'interactive coding', 'data structures', 'algorithms visualization',
        'networking simulation', 'blockchain demo', 'virtual CS lab', 'programming education',
        'STEM computer science', 'code visualization', 'git simulator', 'logic gates'
    ],
    openGraph: {
        title: 'Computer Science Tools & Interactive Learning | OpenLabs',
        description: 'Explore interactive computer science tools including code visualization, data structures, algorithms, networking, and blockchain simulations.',
        url: 'https://www.openlabs.org.in/computer-science',
        type: 'website',
        images: [{
            url: 'https://www.openlabs.org.in/images/og-image.svg',
            width: 1200,
            height: 630,
            alt: 'Computer Science Virtual Labs | OpenLabs'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        images: ['https://www.openlabs.org.in/images/twitter-image.svg'],
        title: 'Computer Science Tools & Interactive Learning | OpenLabs',
        description: 'Explore interactive computer science tools including code visualization, data structures, algorithms, networking, and blockchain simulations.',
    },
    alternates: {
        canonical: 'https://www.openlabs.org.in/computer-science',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function ComputerScienceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}