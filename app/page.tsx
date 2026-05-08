import React from 'react'
import type { Metadata } from 'next'
import Hero from './components/Hero'

export const metadata: Metadata = {
  title: 'OpenLabs - Virtual Lab Experience Platform for Science & Technology',
  description: 'Welcome to OpenLabs - A gateway to interactive science and technology education. Explore virtual labs in physics, chemistry, biology and computer science.',
  keywords: [
    'science education', 'interactive learning', 'virtual labs', 'STEM education',
    'physics labs', 'chemistry experiments', 'biology simulations', 'computer science tools',
    'mathematics interactive', 'educational platform', 'online learning'
  ],
  openGraph: {
    title: 'OpenLabs - Interactive Science & Technology Learning',
    description: 'Explore virtual labs in physics, chemistry, biology, computer science, and mathematics.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/twitter-image.svg'],
    title: 'OpenLabs - Interactive Science & Technology Learning',
    description: 'Explore virtual labs in physics, chemistry, biology, computer science, and mathematics.',
  },
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  )
}
