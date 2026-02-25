import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import OpenLabsAI from './components/OpenLabsAI'
import { ChatProvider } from './components/ChatContext'
import { SpeedInsights } from '@vercel/speed-insights/next'

const Navbar = dynamic(() => import('./components/Navbar'), { ssr: false })
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })

export const metadata: Metadata = {
  title: 'OpenLabs',
  description: 'Interactive physics and chemistry experiments',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="mx-auto">
          <main data-ol-page-root>
            <ChatProvider>
              {children}
              <OpenLabsAI />
            </ChatProvider>
          </main>
        </div>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  )
}
