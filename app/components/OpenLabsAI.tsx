"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "./ChatContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Mic,
  Send,
  X,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Zap,
  BookOpen,
  HelpCircle,
  Minimize2,
  Maximize2,
  Atom,
  Flame,
  Dna,
  Calculator,
  Binary,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { getPageKnowledgeText } from "@/app/lib/pageKnowledge";
import { analyticsService } from "@/lib/analytics";

// Routes where the chatbot is never shown, regardless of auth status
const HIDDEN_ROUTES = ["/login", "/signup", "/forgot"];

export default function OpenLabsAI() {
  const { experimentData } = useChat();
  const pathname = usePathname();

  // --- Auth-aware visibility ---
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null); // null = loading
  const [remainingQueries, setRemainingQueries] = useState<number | null>(null);

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; id?: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // --- Stream Control State ---
  const [streamingText, setStreamingText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastSnapshotRef = useRef<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/auth/me?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });
        if (!res.ok) {
          if (!cancelled) setIsAuthed(false);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setIsAuthed(!!data.user);
          if (data.user) {
            const todayStr = new Date().toISOString().split("T")[0];
            const hasQueriedToday = data.user.lastAiQueryDate === todayStr;
            const count = hasQueriedToday ? data.user.aiQueriesCount ?? 0 : 0;
            setRemainingQueries(Math.max(0, 10 - count));
          }
        }
      } catch {
        if (!cancelled) setIsAuthed(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Track if user manually scrolled up
  const userScrolledUpRef = useRef(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    userScrolledUpRef.current = !isAtBottom;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    userScrolledUpRef.current = false;
  }, [messages.length, loading]);

  useEffect(() => {
    if (!userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [streamingText, isTyping]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // speech recognition
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      recognition.stop();
      setListening(false);
      setInput(transcript);

      setTimeout(() => {
        sendMessageWithText(transcript);
      }, 200);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.lang = navigator.language || "en-US";
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const buildPageSnapshot = () => {
    if (typeof window === "undefined") return "";

    const url =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : pathname;

    const root =
      (document.querySelector("[data-ol-page-root]") as HTMLElement | null) ??
      document.body;

    const headingEls = Array.from(root.querySelectorAll("h1, h2, h3")).slice(
      0,
      20
    );
    const headings = headingEls
      .map((el) => el.textContent?.trim())
      .filter(Boolean) as string[];

    const keyUiEls = Array.from(
      root.querySelectorAll("button, label, summary, [role='button']")
    ).slice(0, 40);
    const keyUiText = keyUiEls
      .map((el) => el.textContent?.replace(/\s+/g, " ").trim())
      .filter((t) => t && t.length >= 2) as string[];

    const rawText = (root.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4500);

    const knowledge = getPageKnowledgeText(pathname);

    const snapshot = [
      `URL: ${url}`,
      `Document title: ${document.title || "(none)"}`,
      `Curated page knowledge:\n${knowledge ?? "(none)"}`,
      `Headings:\n${headings.length ? headings.map((h) => `- ${h}`).join("\n") : "(none)"}`,
      `Key UI labels:\n${keyUiText.length ? keyUiText.map((t) => `- ${t}`).join("\n") : "(none)"}`,
      `Visible text excerpt:\n${rawText || "(none)"}`,
    ].join("\n\n");

    lastSnapshotRef.current = snapshot;
    return snapshot;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.setTimeout(() => {
      requestAnimationFrame(() => buildPageSnapshot());
    }, 120);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // Context subject detection
  const getContextBadge = () => {
    if (pathname.startsWith("/physics") || pathname.includes("/physics/")) {
      return { label: "Physics Lab Context", icon: Atom, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    }
    if (pathname.startsWith("/chemistry") || pathname.includes("/chemistry/")) {
      return { label: "Chemistry Lab Context", icon: Flame, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    }
    if (pathname.startsWith("/biology") || pathname.includes("/biology/")) {
      return { label: "Biology Lab Context", icon: Dna, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
    }
    if (pathname.startsWith("/mathematics") || pathname.includes("/mathematics/")) {
      return { label: "Math Lab Context", icon: Calculator, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    }
    if (pathname.startsWith("/computer-science") || pathname.includes("/computer-science/")) {
      return { label: "CompSci Lab Context", icon: Binary, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" };
    }
    return { label: "STEM Assistant Active", icon: Sparkles, color: "text-primary bg-primary/10 border-primary/20" };
  };

  const contextInfo = getContextBadge();
  const ContextIcon = contextInfo.icon;

  const isHiddenRoute = HIDDEN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  const shouldHide = isHiddenRoute || !isAuthed;

  if (shouldHide) return null;

  const sendMessage = async () => {
    await sendMessageWithText(input);
    setInput("");
  };

  const runTypewriter = (fullText: string) => {
    setIsTyping(false);
    let currentIdx = 0;
    setStreamingText("");

    const words = fullText.split(/(\s+)/);

    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        setStreamingText((prev) => prev + words[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
        setStreamingText("");
        setLoading(false);
      }
    }, 20);
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);
    setIsTyping(true);

    // Track AI query custom event
    analyticsService.trackAiQueryAsked(contextInfo.label, pathname, text.length);

    try {
      const pageSnapshot = buildPageSnapshot() || lastSnapshotRef.current || "";
      const hasFreshExperimentContext =
        experimentData?.path && experimentData.path === pathname;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
      You are OpenLabs AI Assistant, an elite scientific and educational companion for STEM simulations!

      RELEVANCE & SAFETY RULES:
      - Answer questions enthusiastically and thoroughly about science, physics, chemistry, biology, mathematics, computer science, code algorithms, theories, experiment equations, formulas, and how to operate controls on the page.
      - Decline only if the prompt is entirely off-topic (e.g. pop culture, politics, celebrity gossip).
      - Always respond in the SAME language/dialect as the question (English, Hindi, Hinglish, etc.).
      - Use markdown formatting with clear bold headings, bullet points, and code blocks for formulas where helpful.

      PAGE SNAPSHOT:
      ${pageSnapshot || "(snapshot unavailable)"}

      Experiment info:
      - Path: ${experimentData?.path || "(unknown)"}
      - Title: ${(hasFreshExperimentContext ? experimentData?.title : "") || "General STEM"}
      - Theory: ${(hasFreshExperimentContext ? experimentData?.theory : "") || "N/A"}

      User Question:
      ${text}
        `,
        }),
      });

      const data = await res.json();
      if (typeof data.remainingQueries === "number") {
        setRemainingQueries(data.remainingQueries);
      }
      if (!res.ok && !data.reply) {
        throw new Error("Failed to connect to AI server");
      }
      const reply = data.reply || "I encountered an issue processing your scientific inquiry. Please try again.";

      runTypewriter(reply);
    } catch (err: any) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong connecting to the OpenLabs AI engine. Please try again." },
      ]);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopyMessage = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([]);
    setStreamingText("");
  };

  return (
    <>
      <style>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ─── SLEEK COMPACT FLOATING TRIGGER BUTTON ─── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setOpen(true)}
              className="
                relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full
                bg-primary text-primary-foreground
                shadow-lg shadow-primary/25 border border-primary/20
                transition-all duration-200
              "
              aria-label="Open AI Science Assistant"
              title="OpenLabs AI Tutor"
            >
              <Bot size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-card animate-pulse" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CHAT DIALOG WINDOW ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6
              w-auto sm:w-[480px]
              h-[calc(100dvh-1.5rem)] sm:h-[540px]
              max-h-[calc(100dvh-1.5rem)] sm:max-h-[540px]
              bg-card/95 backdrop-blur-2xl text-foreground
              shadow-2xl rounded-3xl
              flex flex-col z-50
              border border-border
              overflow-hidden
              ring-1 ring-black/5 dark:ring-white/10
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-black text-xs sm:text-sm text-foreground tracking-tight truncate">
                    OpenLabs AI Tutor
                  </h2>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5 truncate">
                    <ContextIcon size={10} className={contextInfo.color.split(" ")[0]} />
                    <span className="truncate">{contextInfo.label}</span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    title="Clear Conversation"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 bg-muted/30 hide-scroll"
            >
              {messages.length === 0 && (
                <div className="py-6 px-2 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-xs">
                    <Sparkles size={22} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-foreground">
                      How can I help with your experiment?
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      Ask about scientific principles, formulas, or how to operate the controls on this page.
                    </p>
                  </div>

                  {/* Context-aware Quick Starter Prompts */}
                  <div className="pt-2 flex flex-col gap-2 max-w-sm mx-auto">
                    <button
                      onClick={() => sendMessageWithText("Explain the core theory and formulas of this simulation in simple terms.")}
                      className="text-left px-3.5 py-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 hover:bg-accent/60 text-xs font-semibold text-foreground transition-all flex items-center justify-between group shadow-xs"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen size={13} className="text-primary" />
                        <span>Explain theory & formulas</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground group-hover:text-primary">&rarr;</span>
                    </button>

                    <button
                      onClick={() => sendMessageWithText("What controls are on this page and how do they affect the experiment output?")}
                      className="text-left px-3.5 py-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 hover:bg-accent/60 text-xs font-semibold text-foreground transition-all flex items-center justify-between group shadow-xs"
                    >
                      <span className="flex items-center gap-2">
                        <Zap size={13} className="text-amber-500" />
                        <span>How to use the controls</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground group-hover:text-primary">&rarr;</span>
                    </button>

                    <button
                      onClick={() => sendMessageWithText("Quiz me with a 1-question concept test based on this lab!")}
                      className="text-left px-3.5 py-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 hover:bg-accent/60 text-xs font-semibold text-foreground transition-all flex items-center justify-between group shadow-xs"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle size={13} className="text-emerald-500" />
                        <span>Quick concept check quiz</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground group-hover:text-primary">&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Render Messages */}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group/msg`}
                >
                  <div
                    className={`
                      max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed relative
                      ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground font-semibold rounded-br-xs shadow-xs"
                          : "bg-card text-foreground border border-border/80 rounded-bl-xs shadow-xs"
                      }
                    `}
                  >
                    <div className="prose prose-xs max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
                          code: ({ children }) => (
                            <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono border border-border/60">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-muted/80 p-2.5 rounded-xl text-[11px] font-mono overflow-x-auto border border-border/80 my-2">
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {msg.role === "assistant" && (
                      <div className="mt-2 pt-1.5 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-bold flex items-center gap-1 text-primary">
                          <Sparkles size={10} />
                          <span>OpenLabs AI</span>
                        </span>
                        <button
                          onClick={() => handleCopyMessage(msg.content, idx)}
                          className="inline-flex items-center gap-1 hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-muted"
                          title="Copy Answer"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check size={11} className="text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Streaming Output */}
              {streamingText && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] p-3.5 rounded-2xl bg-card text-foreground border border-border/80 rounded-bl-xs shadow-xs text-xs leading-relaxed">
                    <div className="prose prose-xs max-w-none dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {streamingText}
                      </ReactMarkdown>
                      <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-primary animate-pulse align-middle" />
                    </div>
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-card border border-border/80 p-3 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Console Area */}
            <div className="p-3 border-t border-border bg-card flex-shrink-0 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    className="w-full pl-3 pr-8 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground placeholder:text-muted-foreground transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about formulas, concepts, or controls..."
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  />
                  {input && (
                    <button
                      onClick={() => setInput("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Voice Input Mic */}
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                    listening
                      ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                      : "bg-muted hover:bg-accent text-foreground border-border"
                  }`}
                  aria-label="Voice question"
                  title="Voice input"
                >
                  <Mic size={15} />
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={`p-2.5 rounded-xl text-primary-foreground font-bold transition-all shrink-0 ${
                    loading || !input.trim()
                      ? "bg-muted text-muted-foreground border border-border cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 shadow-xs hover:scale-105 active:scale-95"
                  }`}
                  aria-label="Send query"
                >
                  <Send size={15} />
                </button>
              </div>

              {/* Bottom Quota & Info Bar */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                <span>AI for STEM &amp; experiments</span>
                {remainingQueries !== null && (
                  <span
                    className={`font-bold ${
                      remainingQueries <= 2
                        ? "text-rose-500 font-black"
                        : "text-primary"
                    }`}
                  >
                    Daily Quota: {remainingQueries}/10 remaining
                  </span>
                )}
              </div>
            </div>

            {/* Listening Overlay */}
            {listening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <div className="flex flex-col items-center gap-3 bg-card p-6 rounded-3xl border border-border shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse shadow-lg">
                    <Mic size={24} />
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="text-xs font-bold text-foreground">Listening to your question...</p>
                    <p className="text-[10px] text-muted-foreground">Speak clearly into your microphone</p>
                  </div>
                  <button
                    onClick={toggleMic}
                    className="mt-1 px-4 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-bold text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}