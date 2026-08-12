"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthPage({ initialMode = "login" }: { initialMode?: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || searchParams?.get("callbackUrl") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSignup = initialMode === "signup";
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  // Colors
  const cIndigo = "#5B4FE9";
  const cIndigo2 = "#8B7CFF";
  const cSky = "#38BDF8";
  const cTeal = "#2DD4BF";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      setEmailError(true);
      return;
    }

    if (!password || password.length < 6) {
      setServerError("Password must be at least 6 characters long.");
      return;
    }

    if (isSignup && !name.trim()) {
      setServerError("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        // 1. Submit Signup
        const signupRes = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!signupRes.ok) {
          const signupData = await signupRes.json();
          throw new Error(signupData.error || "Signup failed");
        }

        // 2. Send OTP for verification and redirect
        await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        router.push(`/verify-email?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`);
        return;
      } else {
        // 1. Submit Login
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          if (loginRes.status === 403 && loginData.requiresVerification) {
            await fetch("/api/auth/send-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            router.push(`/verify-email?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`);
            return;
          }
          throw new Error(loginData.error || "Invalid email or password");
        }
      }

      // Redirect to original intended path or home
      router.push(nextPath);
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Background inline styles
  const leftPanelBg = isDark
    ? `radial-gradient(ellipse 70% 60% at 25% 15%, rgba(91,79,233,0.55), transparent 60%), radial-gradient(ellipse 60% 55% at 80% 85%, rgba(56,189,248,0.35), transparent 60%), radial-gradient(ellipse 80% 70% at 50% 100%, rgba(45,212,191,0.18), transparent 65%), #0d0b1c`
    : `radial-gradient(ellipse 70% 60% at 25% 15%, rgba(91,79,233,0.15), transparent 60%), radial-gradient(ellipse 60% 55% at 80% 85%, rgba(56,189,248,0.15), transparent 60%), radial-gradient(ellipse 80% 70% at 50% 100%, rgba(45,212,191,0.1), transparent 65%), #f4f6f8`;

  const gridOverlayStyle = isDark
    ? {
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      backgroundSize: '42px 42px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 40% 40%, black 40%, transparent 85%)',
      maskImage: 'radial-gradient(ellipse 80% 70% at 40% 40%, black 40%, transparent 85%)'
    }
    : {
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
      backgroundSize: '42px 42px',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 40% 40%, black 40%, transparent 85%)',
      maskImage: 'radial-gradient(ellipse 80% 70% at 40% 40%, black 40%, transparent 85%)'
    };

  const redirectQuery = nextPath && nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : "";

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)] lg:overflow-hidden bg-white dark:bg-[#0A0A12] text-[#0A0A12] dark:text-[#F3F3FA] font-[family-name:Inter,ui-sans-serif,-apple-system,sans-serif] antialiased">
      {/* ============ LAYOUT ============ */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[0.9fr_1fr] lg:grid-cols-[1.05fr_1fr] min-h-0">

        {/* LEFT PANEL */}
        <div
          className="relative overflow-hidden flex flex-col justify-start px-6 py-[20px] md:px-[36px] md:py-[50px] lg:px-[60px] lg:py-[70px] min-h-0 md:min-h-full"
          style={{ background: leftPanelBg }}
        >
          {/* Mobile masking fix using style */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @media (max-width: 760px) {
              .left-overlay { mask-image: radial-gradient(ellipse 100% 100% at 30% 20%, black 30%, transparent 80%) !important; -webkit-mask-image: radial-gradient(ellipse 100% 100% at 30% 20%, black 30%, transparent 80%) !important; }
            }
          `}} />
          <div
            className="absolute inset-0 left-overlay pointer-events-none"
            style={gridOverlayStyle}
          />

          <div className="absolute opacity-50 md:opacity-55 lg:opacity-90 w-[200px] h-[200px] md:w-[320px] md:h-[320px] lg:w-[440px] lg:h-[440px] -top-5 -right-[50px] md:top-1/2 md:-translate-y-1/2 md:-right-[90px] lg:-right-[60px] pointer-events-none">
            <svg viewBox="0 0 440 440" className="w-full h-full">
              <g className="origin-[220px_220px] animate-[spin_22s_linear_infinite]">
                <ellipse cx="220" cy="220" rx="190" ry="80" transform="rotate(0 220 220)" fill="none" stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"} strokeWidth="1" />
                <circle cx="410" cy="220" r="5" fill="#8B7CFF" className="drop-shadow-[0_0_6px_#8B7CFF] text-[#8B7CFF]" />
              </g>
              <g className="origin-[220px_220px] animate-[spin_34s_linear_infinite_reverse]">
                <ellipse cx="220" cy="220" rx="190" ry="80" transform="rotate(60 220 220)" fill="none" stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"} strokeWidth="1" />
                <circle cx="220" cy="220" r="5" fill="#38BDF8" transform="translate(190,0) rotate(60 30 220)" className="drop-shadow-[0_0_6px_#38BDF8] text-[#38BDF8]" />
              </g>
              <g className="origin-[220px_220px] animate-[spin_46s_linear_infinite]">
                <ellipse cx="220" cy="220" rx="190" ry="80" transform="rotate(120 220 220)" fill="none" stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"} strokeWidth="1" />
                <circle cx="30" cy="220" r="5" fill="#2DD4BF" transform="rotate(120 220 220)" className="drop-shadow-[0_0_6px_#2DD4BF] text-[#2DD4BF]" />
              </g>
              <circle cx="220" cy="220" r="14" fill={isDark ? "#F3F3FA" : "#0A0A12"} />
              <circle cx="220" cy="220" r="14" fill="url(#coreGlow)" />
              <defs>
                <radialGradient id="coreGlow">
                  <stop offset="0%" stopColor={isDark ? "#ffffff" : "#ffffff"} />
                  <stop offset="100%" stopColor="#8B7CFF" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10 inline-flex items-center gap-2 bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.06)] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] py-[7px] pr-[14px] pl-[10px] rounded-full text-[11.5px] md:text-[12.5px] font-semibold text-[#63647C] dark:text-[#D8D9EE] w-fit mb-4 md:mb-[26px]">
            <span className="w-5 h-5 rounded-full bg-black/5 dark:bg-[rgba(255,255,255,0.9)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke={cIndigo} strokeWidth="2.4" className="w-[11px] h-[11px]">
                <path d="M12 2v20M2 12h20" />
              </svg>
            </span>
            Trusted by 40,000+ researchers
          </div>

          <h1 className="relative z-10 text-[26px] md:text-[34px] lg:text-[44px] leading-[1.12] font-[800] tracking-[-0.025em] max-w-full md:max-w-full lg:max-w-[460px]">
            Welcome back to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--indigo-2)] to-[var(--sky)]" style={{ backgroundImage: `linear-gradient(90deg, ${cIndigo2}, ${cSky})` }}>OpenLabs.</span>
          </h1>
          <p className="relative z-10 mt-3 md:mt-[18px] text-[14px] md:text-[15.5px] leading-[1.65] text-[#63647C] dark:text-[#ADAECB] max-w-full md:max-w-full lg:max-w-[400px]">
            Sign in to reach your custom workspace, saved lab variations, and cloud-compiled analysis datasets — right where you left off.
          </p>

          <div className="relative z-10 flex flex-col min-[400px]:flex-row flex-wrap gap-2 md:gap-[10px] lg:gap-[14px] mt-[22px] md:mt-[40px] items-start min-[400px]:items-center">
            <div className="flex items-center gap-[9px] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] py-[8px] px-[11px] md:py-[9px] md:px-[12px] lg:py-[11px] lg:px-[15px] rounded-xl text-[11.5px] md:text-[12px] lg:text-[13px] text-[#63647C] dark:text-[#C7C8DA] backdrop-blur-[6px]">
              <span className="w-2 h-2 rounded-full" style={{ background: cIndigo2 }}></span>Cloud-synced experiments
            </div>
            <div className="flex items-center gap-[9px] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] py-[8px] px-[11px] md:py-[9px] md:px-[12px] lg:py-[11px] lg:px-[15px] rounded-xl text-[11.5px] md:text-[12px] lg:text-[13px] text-[#63647C] dark:text-[#C7C8DA] backdrop-blur-[6px]">
              <span className="w-2 h-2 rounded-full" style={{ background: cSky }}></span>Real-time collaboration
            </div>
            <div className="flex items-center gap-[9px] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] py-[8px] px-[11px] md:py-[9px] md:px-[12px] lg:py-[11px] lg:px-[15px] rounded-xl text-[11.5px] md:text-[12px] lg:text-[13px] text-[#63647C] dark:text-[#C7C8DA] backdrop-blur-[6px]">
              <span className="w-2 h-2 rounded-full" style={{ background: cTeal }}></span>Zero setup required
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-[#F9FAFB] dark:bg-[#0D0D18] flex items-center justify-center px-5 py-[34px] md:px-[32px] md:py-[50px] lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full max-w-[400px]">
            <h2 className={`text-[29px] font-[800] tracking-[-0.02em] mb-2 ${isSignup ? "mt-14" : ""}`}>
              {isSignup ? "Create your account" : "Sign in"}
            </h2>
            <p className="text-[#63647C] dark:text-[#8E8FA6] text-[14px] mb-[28px]">
              {isSignup
                ? "Start running experiments in the OpenLabs workspace."
                : "Welcome back. Choose a method to continue."}
            </p>

            {/* Social OAuth Buttons */}
            <div className="flex flex-row gap-[10px] mb-[22px]">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: nextPath })}
                className="flex items-center justify-center gap-[10px] w-full bg-white dark:bg-[#14141F] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0A0A12] dark:text-[#F3F3FA] text-[13px] min-[400px]:text-[14px] font-semibold py-[11px] min-[400px]:py-[12px] rounded-[10px] cursor-pointer hover:bg-[#f3f4f6] dark:hover:bg-[#181826] hover:border-[#cfd1dc] dark:hover:border-[#33344a] transition-all duration-150 ease-out active:translate-y-[-1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7CFF]">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0"><path fill="#4285F4" d="M23.52 12.27c0-.82-.07-1.42-.22-2.05H12v3.72h6.53c-.13 1.03-.85 2.6-2.44 3.65l-.02.15 3.54 2.68.25.02c2.25-2.02 3.66-5 3.66-8.17z" /><path fill="#34A853" d="M12 24c3.24 0 5.95-1.05 7.93-2.86l-3.78-2.85c-1.02.7-2.4 1.19-4.15 1.19-3.17 0-5.86-2.04-6.82-4.87l-.14.01-3.68 2.78-.05.13C3.35 21.3 7.34 24 12 24z" /><path fill="#FBBC05" d="M5.18 14.6a6.9 6.9 0 0 1-.38-2.6c0-.9.15-1.78.37-2.6l-.01-.17-3.72-2.83-.12.06A11.94 11.94 0 0 0 0 12c0 1.93.47 3.76 1.32 5.53l3.86-2.93z" /><path fill="#EA4335" d="M12 4.75c2.26 0 3.78.94 4.65 1.73l3.4-3.24C17.94 1.2 15.24 0 12 0 7.34 0 3.35 2.7 1.32 6.47l3.85 2.93C6.14 6.8 8.83 4.75 12 4.75z" /></svg>
              </button>
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: nextPath })}
                className="flex items-center justify-center gap-[10px] w-full bg-white dark:bg-[#14141F] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0A0A12] dark:text-[#F3F3FA] text-[13px] min-[400px]:text-[14px] font-semibold py-[11px] min-[400px]:py-[12px] rounded-[10px] cursor-pointer hover:bg-[#f3f4f6] dark:hover:bg-[#181826] hover:border-[#cfd1dc] dark:hover:border-[#33344a] transition-all duration-150 ease-out active:translate-y-[-1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7CFF]">
                <svg viewBox="0 0 24 24" fill={isDark ? "#F3F3FA" : "#0A0A12"} className="w-[18px] h-[18px] shrink-0"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.3-1.4-1.7-1.4-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.4 1.2a11.6 11.6 0 0 1 6.2 0c2.3-1.6 3.4-1.2 3.4-1.2.6 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" /></svg>
              </button>
            </div>

            <div className="flex items-center gap-[14px] text-[#8E8FA6] dark:text-[#63647C] text-[11.5px] font-[700] tracking-[0.06em] my-[22px] before:content-[''] before:flex-1 before:h-[1px] before:bg-[rgba(0,0,0,0.08)] dark:before:bg-[rgba(255,255,255,0.08)] after:content-[''] after:flex-1 after:h-[1px] after:bg-[rgba(0,0,0,0.08)] dark:after:bg-[rgba(255,255,255,0.08)]">
              OR USE EMAIL
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
                {serverError}
              </div>
            )}

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-[17px]">

              {isSignup && (
                <div>
                  <label htmlFor="name" className="block text-[11.5px] font-[700] tracking-[0.06em] text-[#63647C] dark:text-[#8E8FA6] mb-[7px]">
                    FULL NAME
                  </label>
                  <div className="relative flex items-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="absolute left-[13px] w-4 h-4 text-[#8E8FA6] dark:text-[#63647C] pointer-events-none">
                      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                    </svg>
                    <input
                      type="text"
                      id="name"
                      placeholder="e.g. Marie Curie"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white dark:bg-[#131320] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-[10px] py-[12px] pr-[14px] pl-[38px] text-[14px] text-[#0A0A12] dark:text-[#F3F3FA] outline-none transition-all duration-200 placeholder:text-[#8E8FA6] dark:placeholder:text-[#63647C] focus:border-[#8B7CFF] focus:shadow-[0_0_0_3px_rgba(139,124,255,0.15)]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-[11.5px] font-[700] tracking-[0.06em] text-[#63647C] dark:text-[#8E8FA6] mb-[7px]">
                  EMAIL ADDRESS
                </label>
                <div className="relative flex items-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="absolute left-[13px] w-4 h-4 text-[#8E8FA6] dark:text-[#63647C] pointer-events-none">
                    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full bg-white dark:bg-[#131320] border rounded-[10px] py-[12px] pr-[14px] pl-[38px] text-[14px] text-[#0A0A12] dark:text-[#F3F3FA] outline-none transition-all duration-200 placeholder:text-[#8E8FA6] dark:placeholder:text-[#63647C] focus:border-[#8B7CFF] focus:shadow-[0_0_0_3px_rgba(139,124,255,0.15)] ${emailError ? 'border-[#EF4444] dark:border-[#FF6B6B] shadow-[0_0_0_3px_rgba(239,68,68,0.12)] dark:shadow-[0_0_0_3px_rgba(255,107,107,0.12)]' : 'border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]'}`}
                  />
                </div>
                {emailError && (
                  <div className="text-[11.5px] text-[#EF4444] dark:text-[#FF6B6B] mt-[6px] block">
                    Enter a valid email address to continue.
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-[11.5px] font-[700] tracking-[0.06em] text-[#63647C] dark:text-[#8E8FA6] mb-[7px]">
                  PASSWORD
                </label>
                <div className="relative flex items-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="absolute left-[13px] w-4 h-4 text-[#8E8FA6] dark:text-[#63647C] pointer-events-none">
                    <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-[#131320] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-[10px] py-[12px] pr-[14px] pl-[38px] text-[14px] text-[#0A0A12] dark:text-[#F3F3FA] outline-none transition-all duration-200 placeholder:text-[#8E8FA6] dark:placeholder:text-[#63647C] focus:border-[#8B7CFF] focus:shadow-[0_0_0_3px_rgba(139,124,255,0.15)]"
                  />
                  <button
                    type="button"
                    className="absolute right-[12px] bg-transparent border-none text-[#8E8FA6] dark:text-[#63647C] cursor-pointer flex p-[2px] hover:text-[#0A0A12] dark:hover:text-[#C7C8DA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7CFF]"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {!isSignup && (
                <div className="flex items-center justify-between text-[13px] -mt-[4px]">
                  <label className="flex items-center gap-[8px] text-[#63647C] dark:text-[#B7B8CE] cursor-pointer">
                    <input type="checkbox" className="w-[14px] h-[14px] accent-[#8B7CFF]" /> Remember for 30 days
                  </label>
                  <Link href="/forgotpassword" className="text-[#8B7CFF] font-[600] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7CFF]">Forgot password?</Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-[6px] flex items-center justify-center gap-[8px] w-full py-[13.5px] border-none rounded-[10px] text-white text-[14.5px] font-[700] cursor-pointer transition-all duration-200 ease-out hover:brightness-110 active:scale-[0.985] group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7CFF] disabled:opacity-60"
                style={{ background: `linear-gradient(95deg, ${cIndigo}, ${cIndigo2})` }}
              >
                <span>{loading ? (isSignup ? "Creating..." : "Signing In...") : (isSignup ? "Create Account" : "Sign In")}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-[3px]">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>

            <div className="text-center text-[13.5px] text-[#63647C] dark:text-[#8E8FA6] mt-[26px]">
              {isSignup ? (
                <>Already have an account? <Link href={`/login${redirectQuery}`} className="bg-transparent border-none text-[#8B7CFF] font-[700] text-[13.5px] cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7CFF]">Log in</Link></>
              ) : (
                <>New here? <Link href={`/signup${redirectQuery}`} className="bg-transparent border-none text-[#8B7CFF] font-[700] text-[13.5px] cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B7CFF]">Create an account</Link></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
