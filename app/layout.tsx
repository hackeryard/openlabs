import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

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
        <div className="max-w-7xl mx-auto rounded-xl p-4 md:p-10 my-6 w-full mt-6">
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
