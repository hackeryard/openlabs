"use client"

import React, { useEffect, useState } from "react"
import ProfileSetupBanner from "./ProfileSetupBanner"

export default function ProfileSetupBannerClient(){
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    let mounted = true
    async function check() {
      try{
        const res = await fetch('/api/auth/me')
        if (!res.ok) return
        const data = await res.json()
        if (mounted && data?.user && data.user.profileSetupComplete === false) setVisible(true)
      }catch(e){/* ignore */}
    }
    check()
    return ()=>{ mounted=false }
  }, [])

  if (!visible) return null
  return <ProfileSetupBanner onClose={()=>setVisible(false)} />
}
