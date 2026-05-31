import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Git Simulator | Computer Science Lab',
    description: 'Interactive Git simulator. Learn commits, branches, merges, and version control workflows through hands-on scenarios.',
    keywords: [
        'git simulator', 'version control', 'git branches', 'git commits',
        'computer science lab', 'interactive Git', 'Git tutorial', 'software development'
    ],
    openGraph: {
        title: 'Git Simulator | OpenLabs',
        description: 'Interactive Git simulator to learn commits, branches, merges, and version control workflows.',
        url: '/computer-science/git-simulator',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Git Simulator | OpenLabs',
        description: 'Interactive Git simulator to learn commits, branches, merges, and version control workflows.',
    },
    alternates: {
        canonical: '/computer-science/git-simulator',
    },
}

export default function GitSimulatorLayout({ children }: { children: React.ReactNode }) {
    return children
}
