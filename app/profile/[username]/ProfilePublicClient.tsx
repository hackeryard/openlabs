"use client"

import React, { useEffect, useState } from "react"

export default function ProfilePublicClient({ username }:{ username: string }){
  const [user, setUser] = useState<any>(null)

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch(`/api/profile/${encodeURIComponent(username)}`)
        if (!res.ok) return
        const data = await res.json()
        setUser(data.user)
      }catch(e){}
    }
    load()
  },[username])

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <header className="flex items-center gap-4 mb-6">
        <img src={user.avatar || '/images/avatars/avatar1.svg'} alt="avatar" className="w-24 h-24 rounded-lg object-cover" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
          <div className="text-sm text-slate-600">@{user.username}</div>
          <p className="mt-2 text-slate-700 max-w-xl">{user.bio}</p>
        </div>
      </header>

      <section className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2 text-slate-800">About</h3>
        <div className="text-slate-700">Level {user.level} • {user.xp} XP</div>
      </section>
    </div>
  )
}
