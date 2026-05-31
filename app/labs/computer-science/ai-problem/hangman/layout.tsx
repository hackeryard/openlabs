import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Hangman AI Problem | CS Lab',
    description: 'Interactive Hangman AI challenge. Explore word guessing strategies, search, and AI decision-making in a classic game.',
    keywords: [
        'hangman AI', 'AI problem', 'word guessing', 'search strategies',
        'computer science lab', 'interactive AI', 'game AI', 'decision making'
    ],
    openGraph: {
        title: 'Hangman AI Problem | OpenLabs',
        description: 'Interactive Hangman AI challenge to explore word guessing strategies and decision-making.',
        url: '/computer-science/ai-problem/hangman',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Hangman AI Problem | OpenLabs',
        description: 'Interactive Hangman AI challenge to explore word guessing strategies and decision-making.',
    },
    alternates: {
        canonical: '/computer-science/ai-problem/hangman',
    },
}

export default function HangmanLayout({ children }: { children: React.ReactNode }) {
    return children
}
