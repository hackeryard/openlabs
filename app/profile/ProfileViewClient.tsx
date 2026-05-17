"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit2, LogOut, Award, Beaker, Zap, Mail, Calendar, Target, Activity, Clock, CheckCircle2 } from "lucide-react"

function XPBar({ xp, level, color = "bg-indigo-500" }: { xp: number; level: number; color?: string }) {
  const next = level * 100
  const pct = Math.min(100, Math.round((xp / next) * 100))
  return (
    <div className="relative w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
      <div
        className={`${color} h-full transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

const AVATARS = [
  "/images/avatars/avatar1.svg",
  "/images/avatars/avatar2.svg",
  "/images/avatars/avatar3.svg",
  "/images/avatars/avatar4.svg",
]

export default function ProfileViewClient() {
  const [user, setUser] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ username: '', bio: '', avatar: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) return
        const data = await res.json()
        setUser(data.user)
      } catch (e) { }
    }
    load()
  }, [])

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || AVATARS[0]
      })
    }
  }, [user])

  if (!user) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )

  const handleSave = async () => {
    setError('')
    const raw = (form.username || '').toLowerCase().trim()
    const payload: any = {}
    if (raw && raw !== (user.username || '')) payload.username = raw
    if ((form.bio || '') !== (user.bio || '')) payload.bio = form.bio
    if (form.avatar && form.avatar !== user.avatar) {
      payload.avatar = form.avatar
      payload.replaceAvatar = true
    }

    if (Object.keys(payload).length === 0) return setEditing(false)

    setSaving(true)
    try {
      const res = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setUser(data.user)
      setEditing(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  // Formatting helpers
  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'
  const totalCompleted = user.completedExperiments?.length || 0
  const dailyCompleted = user.dailyChallenges?.filter((c: any) => c.completed).length || 0

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4 pt-8">
      {/* Profile Header Card */}
      <div className="relative bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-slate-50 overflow-hidden relative">
                <img
                  key={editing ? form.avatar : user.avatar}
                  src={editing ? form.avatar : (user.avatar || AVATARS[0])}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover transition-opacity duration-300 bg-white"
                />
              </div>
              {editing && (
                <div className="absolute inset-0 bg-indigo-600/10 rounded-2xl border-2 border-indigo-500 pointer-events-none" />
              )}
            </div>

            <div className="flex-1 pb-2">
              {!editing ? (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 leading-tight">{user.name}</h2>
                  <p className="text-indigo-600 font-medium">@{user.username || 'unnamed'}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {user.email}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {joinDate}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-4 w-full max-w-md">
                  <input
                    className="block w-full text-2xl font-bold border-b-2 border-indigo-200 focus:border-indigo-500 outline-none transition-colors bg-transparent text-slate-900"
                    value={form.username}
                    placeholder="Username"
                    onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pb-2">
              {!editing ? (
                <>
                  <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all shadow-sm">
                    <Edit2 size={16} /> Edit Profile
                  </button>
                  <button onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => router.push('/'))} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-rose-200 hover:text-rose-600 text-slate-600 rounded-xl font-medium transition-all shadow-sm">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditing(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {!editing ? (
            <p className="text-slate-600 max-w-2xl text-lg leading-relaxed mt-2">{user.bio || "No bio yet. Tell the world about your scientific journey!"}</p>
          ) : (
            <div className="space-y-6 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">About You</label>
                <textarea
                  className="mt-2 w-full rounded-xl border-slate-200 border p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700"
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Share your goals..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Choose Your Avatar</label>
                <div className="flex flex-wrap gap-4">
                  {AVATARS.map((path) => (
                    <button
                      key={path}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, avatar: path }))}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 bg-slate-50 ${form.avatar === path ? 'border-indigo-500 shadow-md scale-110' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                    >
                      <img
                        src={path}
                        alt="Avatar Option"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-rose-500 text-sm font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          {/* Quick Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Zap size={24} /></div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Level</p>
              <h4 className="text-2xl font-bold text-slate-900">{user.level}</h4>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><Award size={24} /></div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Streak</p>
              <h4 className="text-2xl font-bold text-slate-900">{user.streak}</h4>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-green-50 flex items-center justify-center text-green-600"><Beaker size={24} /></div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Labs Done</p>
              <h4 className="text-2xl font-bold text-slate-900">{totalCompleted}</h4>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Target size={24} /></div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total XP</p>
              <h4 className="text-2xl font-bold text-slate-900">{user.xp}</h4>
            </div>
          </div>

          {/* Subject Mastery */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Beaker className="text-indigo-500" size={24} /> Subject Mastery
            </h3>

            {(!user.subjectProgress || user.subjectProgress.length === 0) ? (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                No subjects explored yet. Start an experiment to earn XP!
              </div>
            ) : (
              <div className="space-y-6">
                {user.subjectProgress.map((s: any) => (
                  <div key={s.subject}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-slate-900 uppercase">{s.subject}</span>
                      <span className="text-xs font-bold text-slate-600">Level {s.level} • {s.xp} XP</span>
                    </div>
                    <XPBar xp={s.xp} level={s.level} color="bg-gradient-to-r from-indigo-500 to-blue-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Experiments List */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={24} /> Recent Experiments
              </h3>
            </div>

            {(!user.completedExperiments || user.completedExperiments.length === 0) ? (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                No experiments completed yet.
              </div>
            ) : (
              <div className="space-y-3">
                {user.completedExperiments.slice(0, 5).map((exp: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                        <Beaker size={18} className="text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 capitalize text-sm">{exp.experimentId?.replace(/-/g, ' ')}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="uppercase font-medium text-indigo-600">{exp.subject}</span>
                          <span>•</span>
                          <span>{new Date(exp.completedAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-full">
                        +{exp.xpEarned || 0} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">

          {/* Badges Section */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Award className="text-yellow-400" size={24} /> Badges & Achievements</h3>

              {(!user.badges || user.badges.length === 0) ? (
                <div className="text-center py-8 text-slate-400 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                  Complete labs and challenges to earn badges.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                  {user.badges.map((b: any) => (
                    <div key={b.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center hover:bg-white/10 transition-colors cursor-default group">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full mb-3 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform flex items-center justify-center">
                        <Award size={24} className="text-white drop-shadow-md" />
                      </div>
                      <span className="text-xs font-bold text-center uppercase tracking-wide opacity-90">{b.name}</span>
                      {b.earnedAt && <span className="text-[10px] text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{new Date(b.earnedAt).toLocaleDateString()}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Daily Challenges */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Target className="text-rose-500" size={24} /> Daily Challenges
            </h3>
            <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 text-center">
              <div className="text-rose-500 mb-2 flex justify-center"><Target size={32} /></div>
              <h4 className="font-bold text-rose-900 text-2xl mb-1">{dailyCompleted}</h4>
              <p className="text-rose-700 text-sm font-medium">Challenges Completed All-Time</p>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="text-blue-500" size={24} /> Recent Activity
            </h3>

            {(!user.activityLog || user.activityLog.length === 0) ? (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                No activity recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {user.activityLog.slice().reverse().slice(0, 5).map((log: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {log.count} interaction{log.count !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-slate-500">
                        {log.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}