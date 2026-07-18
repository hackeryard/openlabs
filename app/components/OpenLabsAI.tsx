"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "./ChatContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Mic } from "lucide-react";
import { usePathname } from "next/navigation";
import { getPageKnowledgeText } from "@/app/lib/pageKnowledge";

// Routes where the chatbot is never shown, regardless of auth status
const HIDDEN_ROUTES = ["/login", "/signup", "/forgot"];

export default function OpenLabsAI() {
  const { experimentData } = useChat();
  const pathname = usePathname();

  // --- Auth-aware visibility ---
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null); // null = loading
  const [remainingQueries, setRemainingQueries] = useState<number | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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
            "Pragma": "no-cache"
          }
        });
        if (!res.ok) { if (!cancelled) setIsAuthed(false); return; }
        const data = await res.json();
        if (!cancelled) {
          setIsAuthed(!!data.user);
          if (data.user) {
            const todayStr = new Date().toISOString().split("T")[0];
            const hasQueriedToday = data.user.lastAiQueryDate === todayStr;
            const count = hasQueriedToday ? (data.user.aiQueriesCount ?? 0) : 0;
            setRemainingQueries(Math.max(0, 10 - count));
          }
        }
      } catch {
        if (!cancelled) setIsAuthed(false);
      }
    })();
    return () => { cancelled = true; };
  }, [pathname]); // re-check on navigation

  // Track if user manually scrolled up
  const userScrolledUpRef = useRef(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // If user is more than 50px from the bottom, consider them scrolled up
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
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

      recognition.stop(); // stop immediately
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

  const detectLanguage = (text: string) => {
    if (/[\u0900-\u097F]/.test(text)) return "hi-IN"; // Hindi
    if (/[\u0600-\u06FF]/.test(text)) return "ar-SA"; // Arabic
    if (/[\u4E00-\u9FFF]/.test(text)) return "zh-CN"; // Chinese
    if (/[\u3040-\u30FF]/.test(text)) return "ja-JP"; // Japanese
    if (/[\uAC00-\uD7AF]/.test(text)) return "ko-KR"; // Korean
    return navigator.language || "en-US";
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

    // Text snapshot: keep it small and readable (avoid huge prompts).
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

  // Keep a reasonably fresh snapshot after navigation/render settles.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.setTimeout(() => {
      requestAnimationFrame(() => buildPageSnapshot());
    }, 120);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // --- Visibility gate (must come after all hooks) ---
  const isHiddenRoute = HIDDEN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  // Hide the chatbot if it's a hidden route or if the user is not authenticated (or auth state is still loading)
  const shouldHide = isHiddenRoute || !isAuthed;

  if (shouldHide) return null;

  const sendMessage = async () => {
    await sendMessageWithText(input);
    setInput("");
  };

  // Runs typing progression framework mimicking live generation streams
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
    }, 25);
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);
    setIsTyping(true);

    try {
      const pageSnapshot = buildPageSnapshot() || lastSnapshotRef.current || "";
      const hasFreshExperimentContext =
        experimentData?.path && experimentData.path === pathname;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
      You are OpenLabs AI Assistant, a friendly and highly educational companion for STEM learning!

      RELEVANCE & SAFETY RULES:
      - You should enthusiastically and thoroughly answer any questions about science, technology, engineering, mathematics, physics, chemistry, biology, computer science, programming, theories on this page, or active concepts. Always be as helpful and informative as possible for STEM learning!
      - Decline to answer ONLY if the question is completely off-topic and has absolutely nothing to do with science, STEM, coding, academic learning, or the platform (such as recipes, pop-culture, general non-scientific history, sports, or purely social chitchat). In those off-topic cases, politely state that you are designed specifically to assist with STEM learning and lab experiments.

      IMPORTANT:
      - Always respond in the SAME language as the user's question.
      - If user writes in Hindi, respond in Hindi.
      - If Hinglish → respond in Hinglish.
      - If English → respond in English.
      - Match tone and clarity.
      - Use the PAGE SNAPSHOT and CURATED PAGE KNOWLEDGE to explain what is happening on the current page.
      - If experiment info conflicts with the snapshot, trust the snapshot (experiment info can be stale).
      - Explain UI controls and what changes when user interacts with them.

      PAGE SNAPSHOT (live context of current page):
      ${pageSnapshot || "(snapshot unavailable)"}

      Experiment info (may be empty on some pages):
      - Path when set: ${experimentData?.path || "(unknown)"}
      - Title: ${(hasFreshExperimentContext ? experimentData?.title : "") || "General Question"}
      - Theory: ${(hasFreshExperimentContext ? experimentData?.theory : "") || "No theory provided"}
      - Extra Context: ${(hasFreshExperimentContext ? experimentData?.extraContext : "") || "None"}

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
        throw new Error(data.error || "Failed to connect to AI server");
      }
      const reply = data.reply || "⚠️ AI returned empty response";

      runTypewriter(reply);
    } catch (err: any) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: " + err.message },
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
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
            aria-label="Open AI Assistant"
          >
            <Bot />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            /* 
              DIMENSION CHANGES MET:
              - Width increased on desktop: sm:w-[460px] (from sm:w-96)
              - Height decreased on desktop: sm:h-[480px] / sm:max-h-[480px] (from sm:h-[550px])
              - Layout integrity metrics fully locked to avoid screen cut-off bounds.
            */
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 w-auto sm:w-[460px] h-[calc(100dvh-2rem)] sm:h-[480px] max-h-[calc(100dvh-2rem)] sm:max-h-[480px] bg-card shadow-2xl rounded-2xl flex flex-col z-50 border border-border overflow-hidden"
          >
            {/* Header - Original Style */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8V4H8" />
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-sm">OpenLabs AI Assistant</h2>
                  <p className="text-[10px] text-blue-100">Powered by Advanced AI</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-colors"
                aria-label="Close"
              >
                ✕
              </motion.button>
            </div>

            {/* Messages Container */}
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-muted hide-scroll"
            >
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    How can I help you?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about your experiment or theory
                  </p>
                </div>
              )}

              {/* Render Logs */}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-card text-foreground border border-border rounded-bl-none shadow-sm"
                      }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                              {children}
                            </a>
                          ),
                          code: ({ children }) => (
                            <code className="bg-foreground/10 rounded px-1 py-0.5">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Live Streaming Typewriter Output Segment */}
              {streamingText && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-2xl bg-card text-foreground border border-border rounded-bl-none shadow-sm">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{children}</a>,
                          code: ({ children }) => <code className="bg-foreground/10 rounded px-1 py-0.5">{children}</code>,
                        }}
                      >
                        {streamingText}
                      </ReactMarkdown>
                      <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-primary animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-card border border-border p-4 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Input Console - Fixed Height */}
            <div className="p-4 border-t border-border bg-card flex-shrink-0">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    className="w-full p-3 pr-12 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder-muted-foreground transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  />
                  {input && (
                    <button
                      onClick={() => setInput("")}
                      className="absolute right-3 bottom-3 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMic}
                  className={`px-3 py-3 rounded-xl transition-all flex-shrink-0 ${listening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-muted text-foreground"
                    }`}
                  aria-label="Voice input"
                >
                  <Mic size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={`px-4 py-3 rounded-xl text-white transition-all flex-shrink-0 ${loading || !input.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg"
                    }`}
                  aria-label="Send message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </motion.button>
              </div>

              {/* Quick Actions */}
              {messages.length === 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setInput("Explain the theory in simple terms")}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors whitespace-nowrap"
                  >
                    📚 Explain theory
                  </button>
                  <button
                    onClick={() => setInput("What are the key concepts?")}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors whitespace-nowrap"
                  >
                    🔑 Key concepts
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 text-[11px] flex justify-between items-center text-muted-foreground border-t border-border bg-muted flex-shrink-0">
              <span>AI responses may not always be accurate</span>
              {remainingQueries !== null && (
                <span className={`font-semibold transition-all duration-300 ${remainingQueries <= 2 ? "text-red-500 dark:text-red-400 font-bold" : "text-primary"}`}>
                  Quota: {remainingQueries}/10 left
                </span>
              )}
            </div>

            {/* Microphone Overlay */}
            {listening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <div className="flex flex-col items-center gap-4 bg-card px-8 py-6 rounded-2xl shadow-xl m-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
                  >
                    <Mic className="text-white" size={28} />
                  </motion.div>
                  <p className="text-sm font-medium text-foreground">
                    Listening...
                  </p>
                  <button
                    onClick={toggleMic}
                    className="text-xs px-4 py-2 rounded-full bg-muted text-foreground"
                  >
                    Tap to stop
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