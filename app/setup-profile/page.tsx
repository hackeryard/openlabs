"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { analyticsService } from "@/lib/analytics"

const AVATARS = [
  "/images/avatars/avatar-01.png",
  "/images/avatars/avatar-02.png",
  "/images/avatars/avatar-03.png",
  "/images/avatars/avatar-04.png",
  "/images/avatars/avatar-05.png",
  "/images/avatars/avatar-06.png",
  "/images/avatars/avatar-07.png",
  "/images/avatars/avatar-08.png",
  "/images/avatars/avatar-09.png",
  "/images/avatars/avatar-10.png",
  "/images/avatars/avatar-11.png",
  "/images/avatars/avatar-12.png",
]

export default function SetupProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [available, setAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [bio, setBio] = useState("")
  const [keepExistingAvatar, setKeepExistingAvatar] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    analyticsService.trackOnboardingStarted();
  }, []);

  useEffect(() => {
    setError("")
    setAvailable(null)
    if (debounceRef.current) window.clearTimeout(debounceRef.current)

    if (!username || username.length < 3) return

    setChecking(true)
    // debounce
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/profile/check-username?username=${encodeURIComponent(username)}`)
        const data = await res.json()
        setAvailable(Boolean(data.available))
      } catch (e) {
        setAvailable(false)
      } finally {
        setChecking(false)
      }
    }, 450)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [username])

  // Fetch current user to prefill avatar if available (e.g. Google avatar)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) return
        const data = await res.json()
        const u = data?.user
        if (mounted && u?.avatar) {
          setAvatar(u.avatar)
          setKeepExistingAvatar(true)
        }
      } catch (e) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const u = (username || "").toLowerCase().trim()
    if (!/^[a-z0-9_-]{3,30}$/.test(u)) {
      setError("Username must be 3-30 characters: lowercase letters, numbers, - or _")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, avatar, bio, replaceAvatar: !keepExistingAvatar }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to save profile")
        setSubmitting(false)
        return
      }

      // Track onboarding completion
      analyticsService.trackOnboardingCompleted();

      // Redirect to profile page
      router.push(`/profile`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-card rounded-2xl shadow-xl p-8 border border-border">
        <h1 className="text-2xl font-bold mb-2">Set up your profile</h1>
        <p className="text-sm text-muted-foreground mb-6">Add a username, choose an avatar, and write a short bio.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              className="mt-2 w-full rounded-lg bg-muted border border-border px-3 py-2 text-foreground"
            />
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
              {checking ? <span>Checking...</span> : available === null ? <span>Enter a username</span> : available ? <span className="text-emerald-400">Available</span> : <span className="text-rose-400">Taken</span>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Avatar</label>
            <div className="mt-3 grid grid-cols-4 gap-3 sm:gap-4 max-w-sm">
              {AVATARS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => { setAvatar(a); setKeepExistingAvatar(false); }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.25rem] overflow-hidden border-[3px] transition-all duration-300 bg-card p-1 ${avatar === a
                    ? "border-indigo-500 shadow-lg shadow-indigo-500/20 scale-110 ring-4 ring-indigo-500/10"
                    : "border-border hover:border-muted-foreground/40 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 hover:scale-105"
                    }`}
                >
                  <img src={a} alt="avatar" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
            {keepExistingAvatar && (
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={keepExistingAvatar}
                    onChange={() => setKeepExistingAvatar((s) => !s)}
                  />
                  <span>Keep my existing avatar</span>
                </label>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Bio <span className="text-xs text-muted-foreground">(max 160)</span></label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              rows={4}
              className="mt-2 w-full rounded-lg bg-muted border border-border px-3 py-2 text-foreground"
            />
            <div className="mt-1 text-xs text-muted-foreground">{bio.length}/160</div>
          </div>

          {error && <div className="text-sm text-rose-400">{error}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save and Continue"}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm text-muted-foreground hover:underline"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
