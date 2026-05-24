"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Mail, MapPin, Send, MessageSquare, Clock, CheckCircle, Github, Twitter, Terminal } from "lucide-react";

/* ---------------- Animations ---------------- */
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ---------------- Contact Info ---------------- */
const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "support@openlabs.org.in",
    subtitle: "We'll respond within 24 hours",
    gradient: "from-blue-100 to-cyan-50",
    iconColor: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: MessageSquare,
    title: "Community",
    detail: "GitHub Discussions",
    subtitle: "Join our open-source community",
    gradient: "from-purple-100 to-pink-50",
    iconColor: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Clock,
    title: "Response Time",
    detail: "Within 24 hours",
    subtitle: "Mon – Sat, 9am – 6pm IST",
    gradient: "from-emerald-100 to-teal-50",
    iconColor: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to send message. Please try again or email us directly at support@openlabs.org.in");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Light Cinematic Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-200/60 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/80 via-white to-white" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] invert" />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600">
              Connection <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">Established</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              System ready. Transmit your queries, bug reports, or feature requests directly to the engineering bay.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="relative z-20 -mt-12 max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {contactInfo.map((ci) => (
            <motion.div
              key={ci.title}
              variants={item}
              className="group bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${ci.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${ci.bg} border border-white flex items-center justify-center mb-4 shadow-sm`}>
                  <ci.icon className={`w-5 h-5 ${ci.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{ci.title}</h3>
                <p className="text-sm font-semibold text-indigo-600 mb-1">{ci.detail}</p>
                <p className="text-xs text-slate-500">{ci.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Form & Terminal UI */}
      <section className="py-24 max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Main Form Area */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="lg:col-span-3"
          >
            <motion.div variants={item} className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Transmission Console</h2>
              <p className="text-slate-600">All communications are encrypted and monitored by the team.</p>
            </motion.div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-3xl p-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white border border-emerald-100 shadow-sm flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Transmission Successful</h3>
                <p className="text-slate-600 mb-8">
                  Data packet received. Our systems are processing your request and we will respond within standard operational parameters.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest"
                >
                  Initiate New Protocol →
                </button>
              </motion.div>
            ) : (
              <motion.form variants={container} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.div variants={item} className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Operator Name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
                    />
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Your Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@domain.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
                    />
                  </motion.div>
                </div>

                <motion.div variants={item} className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Signal Classification</label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
                    >
                      <option value="">Select Classification...</option>
                      <option value="general">General Inquiry</option>
                      <option value="bug">Bug / Anomaly Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Enter transmission data..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all resize-none shadow-sm"
                  />
                </motion.div>

                <motion.div variants={item}>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 group"
                  >
                    {sending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-indigo-200 border-t-white rounded-full animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        Transmit Payload
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            )}
          </motion.div>

          {/* Sidebar / Status Panel */}
          <motion.aside
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="lg:col-span-2 space-y-6"
          >
            <motion.div variants={item} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[30px] pointer-events-none" />

              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Network Status
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-indigo-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Main Comm Array</p>
                    <p className="text-xs text-slate-500 mt-1">support@openlabs.org.in</p>
                  </div>
                </div>

                {/* <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <Github className="text-slate-700 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Source Control</p>
                    <p className="text-xs text-slate-500 mt-1">github.com/openlabs</p>
                  </div>
                </div> */}

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-rose-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Server Location</p>
                    <p className="text-xs text-slate-500 mt-1">India</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-8">
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-3">System Note</h3>
              <p className="text-sm text-indigo-800/80 leading-relaxed font-medium">
                When filing anomaly reports (bugs), please include your client parameters (browser/OS) and the exact temporal coordinates (time) of the incident to expedite debugging.
              </p>
            </motion.div>
          </motion.aside>

        </div>
      </section>
    </main>
  );
}
