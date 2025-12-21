import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import scientist from '../../public/images/scientist.png'

export default function Hero() {
  return (
    <section className="mt-8 px-4">
      <div className="bg-gradient-to-br rounded-2xl p-8 max-w-7xl mx-auto shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-5xl font-extrabold">Experience Science — anywhere, anytime</h1>
            <p className="text-lg md:text-2xl mt-4 mb-4 text-gray-700">A web-based visual science laboratory built for learning and exploration.</p>
            {/* <div className="flex items-center gap-3">
              <Link href="/physics" className="inline-block bg-indigo-600 text-white px-5 py-3 rounded-lg shadow hover:shadow-lg transform-gpu hover:scale-105">Explore Experiments</Link>
              <Link href="/chemistry" className="inline-block bg-white/80 text-indigo-700 px-4 py-2 rounded-md">View Chemistry</Link>
            </div> */}

            <ul className="flex mt-6 md:mt-10 flex-wrap gap-3 md:gap-4">
              <Link href="/physics" className="inline-block bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md">Physics</Link>
              <Link href="/chemistry" className="inline-block bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md">Chemistry</Link>
              <Link href="/biology" className="inline-block bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md">Biology</Link>
            </ul>
          </div>
          <div className="md:w-1/2 flex justify-end items-center">
            <div className="w-full max-w-[520px] rounded-lg shadow overflow-hidden">
              <Image src="/images/scientist.png" width={1000} height={1000} alt="Scientist illustration" className="w-full h-auto object-cover" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
