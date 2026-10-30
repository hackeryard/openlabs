"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Power,
  Clock,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  Sliders,
  Calendar,
  Info,
  Radio,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminLockScreen from "@/app/components/AdminLockScreen";
import { useAdminSecret } from "@/app/components/AdminSecretContext";
import { getMainSiteHref } from "@/app/lib/adminUrl";

interface EffectiveAdSettings {
  allowed: boolean;
  globalAdsEnabled: boolean;
  isSnoozed: boolean;
  snoozeUntil: string | null;
  snoozeReason: string;
  remainingMs: number;
  networks: {
    googleAdSense: boolean;
    adsterraPopunder: boolean;
    adsterraBanners: boolean;
  };
  lastUpdatedBy: string;
  updatedAt: string;
}

interface AdminAdsResponse {
  settings: EffectiveAdSettings;
  raw?: any;
  serverTime: string;
}

const PRESET_DURATIONS = [
  { label: "15 Mins", value: "15m", desc: "Short testing sweep" },
  { label: "30 Mins", value: "30m", desc: "Quick maintenance" },
  { label: "1 Hour", value: "1h", desc: "Live presentation" },
  { label: "6 Hours", value: "6h", desc: "Peak traffic window" },
  { label: "12 Hours", value: "12h", desc: "Overnight pause" },
  { label: "24 Hours (1 Day)", value: "24h", desc: "Full day ad-free" },
  { label: "3 Days", value: "3d", desc: "Extended testing" },
  { label: "7 Days (1 Week)", value: "7d", desc: "Long hiatus" },
];

export default function AdminAdsControlPage() {
  const { isUnlocked, isHydrated, isAdmin } = useAdminSecret();
  const [data, setData] = useState<AdminAdsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Snooze form state
  const [selectedDuration, setSelectedDuration] = useState("1h");
  const [customValue, setCustomValue] = useState("");
  const [customUnit, setCustomUnit] = useState<"m" | "h" | "d">("h");
  const [isCustom, setIsCustom] = useState(false);
  const [snoozeReason, setSnoozeReason] = useState("");

  // Countdown timer for snooze
  const [remainingTimeStr, setRemainingTimeStr] = useState<string>("");

  const fetchSettings = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/ads", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }
      const json: AdminAdsResponse = await res.json();
      setData(json);
    } catch (err: any) {
      console.error("Failed to load ad settings:", err);
      setError(err?.message || "Failed to load monetization configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      fetchSettings();
    }
  }, [isUnlocked, fetchSettings]);

  // Live countdown timer update
  useEffect(() => {
    if (!data?.settings?.snoozeUntil) {
      setRemainingTimeStr("");
      return;
    }

    const target = new Date(data.settings.snoozeUntil).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setRemainingTimeStr("Expired (refreshing...)");
        fetchSettings();
        return;
      }

      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setRemainingTimeStr(parts.join(" "));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data?.settings?.snoozeUntil, fetchSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const handleAction = async (payload: any) => {
    if (!isAdmin) {
      alert("Monetization mutations are restricted to Administrators only.");
      return;
    }
    setMutating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }

      setData((prev) => (prev ? { ...prev, settings: json.settings } : prev));
      showToast(json.message || "Ad configuration updated successfully");
      await fetchSettings();
    } catch (err: any) {
      console.error("Mutation error:", err);
      setError(err?.message || "Failed to execute ad mutation.");
    } finally {
      setMutating(false);
    }
  };

  const handleSnoozeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = isCustom ? `${customValue}${customUnit}` : selectedDuration;
    handleAction({
      action: "snooze",
      duration,
      reason: snoozeReason || undefined,
    });
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading Monetization Control Console...</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return <AdminLockScreen />;
  }

  const settings = data?.settings;
  const isGlobalActive = settings?.globalAdsEnabled ?? true;
  const isSnoozed = settings?.isSnoozed ?? false;
  const isFullyAllowed = settings?.allowed ?? true;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Toast Alert ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-18 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl shadow-emerald-600/20 text-xs sm:text-sm font-semibold backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Admin Operations
            </span>
            <span>•</span>
            <span>Site-Wide Monetization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Megaphone className="w-7 h-7 text-primary" />
            Ad Monetization & Display Governance
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Manage live advertising tags across OpenLabs, pause ads for custom time windows, toggle individual network scripts, and verify zero-ad shielding on protected surfaces.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchSettings}
            disabled={loading || mutating}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition disabled:opacity-50"
            title="Refresh Ad Status"
          >
            <RefreshCw className={`w-4 h-4 ${mutating ? "animate-spin" : ""}`} />
          </button>
          <Link
            href={getMainSiteHref("/")}
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-accent text-xs font-semibold text-foreground flex items-center gap-2 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Inspect Main Site</span>
          </Link>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold">Error executing ad configuration</div>
            <div className="text-xs mt-0.5">{error}</div>
          </div>
        </div>
      )}

      {/* ── Top Status Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
        {/* Card 1: Live Status */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card/90 border border-border backdrop-blur-md shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Current Live Status
            </span>
            <span className="relative flex h-3 w-3">
              {isFullyAllowed ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </>
              ) : isSnoozed ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              )}
            </span>
          </div>

          <div className="my-4">
            {isFullyAllowed ? (
              <div className="text-2xl font-black text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>Active & Serving</span>
              </div>
            ) : isSnoozed ? (
              <div className="text-2xl font-black text-amber-500 flex items-center gap-2">
                <Clock className="w-6 h-6 animate-pulse" />
                <span>Temporarily Paused</span>
              </div>
            ) : (
              <div className="text-2xl font-black text-rose-500 flex items-center gap-2">
                <Power className="w-6 h-6" />
                <span>Disabled Globally</span>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {isFullyAllowed
                ? "Ads are live and serving across eligible public pages with full lab & admin exclusion shields."
                : isSnoozed
                ? `Paused until ${new Date(settings!.snoozeUntil!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • ${remainingTimeStr} remaining`
                : "Master switch is OFF. All ad scripts and DOM banners are strictly purged site-wide."}
            </p>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Last change:</span>
            <span className="font-semibold text-foreground">
              {new Date(settings?.updatedAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Card 2: Quick Resume / Kill Action */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card/90 border border-border backdrop-blur-md shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Instant Master Control
              </span>
              <Power className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-base font-bold text-foreground mt-2">
              {isFullyAllowed ? "Emergency Ad Kill Switch" : "Instant Reactivation"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {isFullyAllowed
                ? "Need a clean demo or running tests? Instantly suppress all advertisements site-wide with 1 click."
                : "Resume ad serving across all enabled network tags immediately, terminating any active pause."}
            </p>
          </div>

          <div className="mt-4">
            {isFullyAllowed ? (
              <button
                onClick={() => handleAction({ action: "disable" })}
                disabled={mutating}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Power className="w-4 h-4" />
                <span>Disable All Ads Immediately</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction({ action: "resume" })}
                disabled={mutating}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume All Ads Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Shielding Guarantee */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card/90 border border-border backdrop-blur-md shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Protection Invariant
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-foreground mt-2 flex items-center gap-2">
              <span>Admin & Lab Isolation</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Guaranteed 0 Ads
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              No matter what ad settings are active, advertisements are unconditionally blocked on this Admin Console (<code className="font-mono text-[10px] bg-muted px-1 rounded">/admin</code>, <code className="font-mono text-[10px] bg-muted px-1 rounded">admin.*</code>) and in all 101 interactive lab simulations.
            </p>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Enforcement Layers:</span>
            <span className="font-semibold text-emerald-500">CSS + Head + Observer</span>
          </div>
        </div>
      </div>

      {/* ── Main Controls Split Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Snooze / Timed Pause Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Timed Ad Pause (Snooze)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Temporarily disable all ads for a set duration. Ads will automatically resume when the period ends.
                  </p>
                </div>
              </div>
            </div>

            {isSnoozed && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Active Pause in Progress</span>
                  </div>
                  <span className="font-mono font-bold text-sm bg-background/80 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                    {remainingTimeStr}
                  </span>
                </div>
                <div className="text-xs mt-2 leading-relaxed opacity-90">
                  Ends on: <strong>{new Date(settings!.snoozeUntil!).toLocaleString()}</strong>
                  {settings?.snoozeReason && <span> • Reason: <em>"{settings.snoozeReason}"</em></span>}
                </div>
                <div className="mt-3 pt-3 border-t border-amber-500/20 flex justify-end">
                  <button
                    onClick={() => handleAction({ action: "resume" })}
                    disabled={mutating}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Cancel Pause & Resume Now</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSnoozeSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">
                  Select Pause Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_DURATIONS.map((preset) => {
                    const isSelected = !isCustom && selectedDuration === preset.value;
                    return (
                      <button
                        type="button"
                        key={preset.value}
                        onClick={() => {
                          setIsCustom(false);
                          setSelectedDuration(preset.value);
                        }}
                        className={`p-3 rounded-2xl border text-left transition ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-muted/40 hover:bg-accent border-border text-foreground"
                        }`}
                      >
                        <div className="text-xs font-bold">{preset.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {preset.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Duration Selector */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isCustom ? "Use standard presets instead" : "Set custom time duration (mins/hours/days)..."}</span>
                </button>

                {isCustom && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 flex items-center gap-2 p-3 rounded-2xl bg-muted/30 border border-border"
                  >
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 45"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      required={isCustom}
                      className="w-24 px-3 py-2 rounded-xl bg-background border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-background border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="m">Minutes</option>
                      <option value="h">Hours</option>
                      <option value="d">Days</option>
                    </select>
                    <span className="text-xs text-muted-foreground">pause duration</span>
                  </motion.div>
                )}
              </div>

              {/* Optional Reason */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Pause Note / Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Live conference demo, UI audit, or exam week"
                  value={snoozeReason}
                  onChange={(e) => setSnoozeReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={mutating || (isCustom && !customValue)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>
                    Apply Timed Pause (
                    {isCustom ? `${customValue || "0"} ${customUnit}` : PRESET_DURATIONS.find((d) => d.value === selectedDuration)?.label}
                    )
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Network Granular Switches & Surface Verification (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Network Granular Switches */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Individual Ad Networks
                </h2>
                <p className="text-xs text-muted-foreground">
                  Toggle specific ad networks and formats independently.
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-5">
              {/* Google AdSense */}
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span>Google AdSense</span>
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      Auto Ads
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    ca-pub-4121707034074280 script injection
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleAction({
                      action: "update_networks",
                      networks: {
                        googleAdSense: !settings?.networks?.googleAdSense,
                      },
                    })
                  }
                  disabled={mutating}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings?.networks?.googleAdSense ? "bg-emerald-500" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings?.networks?.googleAdSense ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Adsterra Popunder */}
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span>Adsterra Anti-Adblock Popunder</span>
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      Popunder_1
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    abscloud.org anti-adblock source
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleAction({
                      action: "update_networks",
                      networks: {
                        adsterraPopunder: !settings?.networks?.adsterraPopunder,
                      },
                    })
                  }
                  disabled={mutating}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings?.networks?.adsterraPopunder ? "bg-emerald-500" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings?.networks?.adsterraPopunder ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Adsterra Display & Native Banners */}
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span>Adsterra Display & Native Banners</span>
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      Banners
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Leaderboards (728x90, 300x250) & 4-tile native
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleAction({
                      action: "update_networks",
                      networks: {
                        adsterraBanners: !settings?.networks?.adsterraBanners,
                      },
                    })
                  }
                  disabled={mutating}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings?.networks?.adsterraBanners ? "bg-emerald-500" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings?.networks?.adsterraBanners ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Surface Shielding Status */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Surface Delivery Matrix</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground">Admin Console (/admin, admin.*)</span>
                <span className="font-bold text-rose-500 flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" /> 0 Ads (Hard Blocked)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground">Interactive Simulations (/labs/*)</span>
                <span className="font-bold text-rose-500 flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" /> 0 Ads (Shielded)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground">Auth Screens (/login, /signup)</span>
                <span className="font-bold text-rose-500 flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" /> 0 Ads (Clean)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground">Public Hubs & Blog Articles</span>
                <span className={`font-bold flex items-center gap-1 ${isFullyAllowed ? "text-emerald-500" : "text-amber-500"}`}>
                  {isFullyAllowed ? (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Paused/Disabled
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
