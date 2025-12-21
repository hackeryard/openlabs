import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-12 bg-gradient-to-r from-slate-800 to-indigo-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-lg font-bold">OpenLabs</div>
          <p className="text-sm text-slate-300 mt-2">Interactive science labs for students and educators. Visualize and measure experiments across physics, chemistry and biology.</p>
        </div>
        <div>
          <div className="font-semibold">Explore</div>
          <ul className="mt-2 text-sm text-slate-200">
            <li className="mt-1">Physics</li>
            <li className="mt-1">Chemistry</li>
            <li className="mt-1">Biology</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Connect</div>
          <p className="text-sm text-slate-200 mt-2">Email: <a className="underline" href="mailto:hello@openlabs.local">hello@openlabs.local</a></p>
        </div>
      </div>
      <div className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} OpenLabs — Built with ❤️</div>
    </footer>
  )
}
