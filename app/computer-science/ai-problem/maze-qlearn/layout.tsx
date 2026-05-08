import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Maze Q-Learning AI Problem | CS Lab',
    description: 'Interactive Maze Q-Learning challenge. Explore reinforcement learning, rewards, and pathfinding using AI algorithms.',
    keywords: [
        'maze q-learning', 'reinforcement learning', 'AI problem', 'pathfinding',
        'computer science lab', 'interactive AI', 'maze solver', 'learning agents'
    ],
    openGraph: {
        title: 'Maze Q-Learning AI Problem | OpenLabs',
        description: 'Interactive Maze Q-Learning challenge for exploring reinforcement learning and pathfinding.',
        url: '/computer-science/ai-problem/maze-qlearn',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Maze Q-Learning AI Problem | OpenLabs',
        description: 'Interactive Maze Q-Learning challenge for exploring reinforcement learning and pathfinding.',
    },
    alternates: {
        canonical: '/computer-science/ai-problem/maze-qlearn',
    },
}

export default function MazeQLearningLayout({ children }: { children: React.ReactNode }) {
    return children
}
