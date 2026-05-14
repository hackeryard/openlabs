"use client"

import React from "react"
import Link from "next/link"

export default function ProfileSetupBanner({ onClose }:{ onClose?: ()=>void }){
  return (
    <div className="w-full bg-indigo-700 text-white px-4 py-3 rounded-md mb-6 flex items-center justify-between">
      <div>
        <div className="font-semibold">Finish your profile</div>
        <div className="text-sm text-indigo-100">Add a username, avatar and bio to personalize your OpenLabs profile.</div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/setup-profile" className="bg-white text-indigo-700 px-3 py-1 rounded-md text-sm font-medium">Set up profile</Link>
        <button onClick={onClose} className="text-sm opacity-80">Dismiss</button>
      </div>
    </div>
  )
}
