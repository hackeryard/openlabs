import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Computer Science Tools & Interactive Learning',
    description: 'Explore interactive computer science tools including code visualization, data structures, algorithms, networking, and blockchain simulations.',
    keywords: [
        'computer science tools', 'interactive coding', 'data structures', 'algorithms visualization',
        'networking simulation', 'blockchain demo', 'virtual CS lab', 'programming education',
        'STEM computer science', 'code visualization', 'git simulator', 'logic gates'
    ],
    openGraph: {
        title: 'Computer Science Tools | OpenLabs',
        description: 'Explore interactive computer science tools including code visualization, data structures, algorithms, networking, and blockchain simulations.',
        url: '/computer-science',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Computer Science Tools | OpenLabs',
        description: 'Explore interactive computer science tools including code visualization, data structures, algorithms, networking, and blockchain simulations.',
    },
    alternates: {
        canonical: '/computer-science',
    },
}

export default function ComputerScienceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}