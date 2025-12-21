"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">OL</div>
          <div className="text-xl font-extrabold tracking-tight">OpenLabs</div>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <ul className={`md:flex md:items-center md:gap-8 ${open ? 'flex flex-col absolute top-16 right-4 bg-white text-slate-800 p-4 rounded-lg shadow-lg w-48' : 'hidden'}`}>
          <li>
            <Link href="/" className="block px-3 py-2 rounded hover:bg-slate-50/20 transition" onClick={() => setOpen(false)}>Home</Link>
          </li>
          <li>
            <Link href="/chemistry" className="block px-3 py-2 rounded hover:bg-slate-50/20 transition" onClick={() => setOpen(false)}>Chemistry</Link>
          </li>
          <li>
            <Link href="/physics" className="block px-3 py-2 rounded hover:bg-slate-50/20 transition" onClick={() => setOpen(false)}>Physics</Link>
          </li>
          <li>
            <Link href="/biology" className="block px-3 py-2 rounded hover:bg-slate-50/20 transition" onClick={() => setOpen(false)}>Biology</Link>
          </li>
          <li>
            <Link href="/login" className="block px-3 py-2 rounded bg-white text-indigo-700 font-semibold shadow-sm hover:shadow-md" onClick={() => setOpen(false)}>Log In</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
