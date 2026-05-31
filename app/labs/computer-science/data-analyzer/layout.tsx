import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Data Analyzer Lab | Computer Science',
    description: 'Interactive data analyzer tool. Explore datasets, graphs, and patterns with a hands-on computer science analytics lab.',
    keywords: [
        'data analyzer', 'data analysis', 'computer science lab', 'interactive analytics',
        'dataset exploration', 'data visualization', 'analytics tool', 'data patterns'
    ],
    openGraph: {
        title: 'Data Analyzer Lab | OpenLabs',
        description: 'Interactive data analyzer tool for exploring datasets and patterns.',
        url: '/computer-science/data-analyzer',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Data Analyzer Lab | OpenLabs',
        description: 'Interactive data analyzer tool for exploring datasets and patterns.',
    },
    alternates: {
        canonical: '/computer-science/data-analyzer',
    },
}

export default function DataAnalyzerLayout({ children }: { children: React.ReactNode }) {
    return children
}
