import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Data Science Lab | Computer Science',
    description: 'Interactive data science lab. Explore data cleaning, visualization, and analysis concepts with hands-on experiments.',
    keywords: [
        'data science', 'data cleaning', 'data visualization', 'data analysis',
        'computer science lab', 'interactive data science', 'analytics education', 'data experiments'
    ],
    openGraph: {
        title: 'Data Science Lab | OpenLabs',
        description: 'Interactive data science lab for learning data cleaning, visualization, and analysis.',
        url: '/computer-science/data-science',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Data Science Lab | OpenLabs',
        description: 'Interactive data science lab for learning data cleaning, visualization, and analysis.',
    },
    alternates: {
        canonical: '/computer-science/data-science',
    },
}

export default function DataScienceLayout({ children }: { children: React.ReactNode }) {
    return children
}
