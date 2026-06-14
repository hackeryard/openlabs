"use client"

import React, { useEffect, useState } from "react"
import ProfileSetupBanner from "./ProfileSetupBanner"

export default function ProfileSetupBannerClient(){
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    let mounted = true
    let timeoutId: ReturnType<typeof window.setTimeout> | undefined
    let idleId: number | undefined

    async function check() {
      try{
        const res = await fetch('/api/auth/me')
        if (!res.ok) return
        const data = await res.json()
        if (mounted && data?.user && data.user.profileSetupComplete === false) setVisible(true)
      }catch(e){/* ignore */}
    }

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(check, { timeout: 2000 })
    } else {
      timeoutId = setTimeout(check, 1200)
    }

    return ()=>{
      mounted=false
      if (idleId !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  if (!visible) return null
  return <ProfileSetupBanner onClose={()=>setVisible(false)} />
}
