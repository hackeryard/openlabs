/**
 * physics/page.tsx – Physics Virtual Lab (Professional Edition)
 * 
 * Professional design with improved hero layout, subtle visualization,
 * no emojis, clean typography.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, Variants, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   1.  SEO – JSON-LD Structured Data
═══════════════════════════════════════════════════════════ */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Physics Virtual Laboratory – Interactive Experiments",
  description:
    "Free interactive virtual physics experiments covering mechanics, electricity and optics. Ideal for students, teachers and self-learners.",
  inLanguage: "en",
  about: { "@type": "Thing", name: "Physics" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Physics", item: "/physics" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   2.  Data – All Experiments
═══════════════════════════════════════════════════════════ */
type Experiment = {
  href: string;
  title: string;
  desc: string;
  formula: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
};

const experiments: Experiment[] = [
  {
    href: "/physics/simplependulum",
    title: "Simple Pendulum",
    desc: "Simulate pendulum motion and compare theoretical period with measured values using virtual sensors.",
    formula: "T = 2π√(L/g)",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/physics/projectilemotion",
    title: "Projectile Motion",
    desc: "Analyze trajectories, range, and time-of-flight under varying launch angles and initial velocities.",
    formula: "R = v₀² sin 2θ / g",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "12 min",
  },
  {
    href: "/physics/hookelaw",
    title: "Hooke's Law",
    desc: "Investigate spring-mass systems, measure spring constants, and validate Hooke's law.",
    formula: "F = -kx",
    category: "Mechanics",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/energyconservation",
    title: "Energy Conservation",
    desc: "Track kinetic and potential energy through motion and verify conservation principles.",
    formula: "KE + PE = const",
    category: "Mechanics",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/uniformmotionlab",
    title: "Uniform Motion",
    desc: "Study constant-velocity motion and generate distance-time graphs for linear kinematics.",
    formula: "v = Δx / Δt",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "8 min",
  },
  {
    href: "/physics/freefall",
    title: "Free Fall Lab",
    desc: "Measure gravitational acceleration through video analysis and data fitting.",
    formula: "h = ½gt²",
    category: "Mechanics",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/physics/ohmslaw",
    title: "Ohm's Law",
    desc: "Construct virtual circuits, sweep voltage, and plot current-voltage characteristics.",
    formula: "V = IR",
    category: "Electricity",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/physics/rclab",
    title: "RC Circuit Lab",
    desc: "Observe capacitor charging and discharging curves; determine time constants.",
    formula: "τ = RC",
    category: "Electricity",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/waveoptics",
    title: "Wave Optics",
    desc: "Simulate Fraunhofer diffraction and double-slit interference patterns.",
    formula: "d·sinθ = mλ",
    category: "Optics",
    difficulty: "Advanced",
    duration: "20 min",
  },
  {
    href: "/physics/opticslens",
    title: "Optics Lens",
    desc: "Explore thin lens equation, focal points, and real/virtual image formation.",
    formula: "1/f = 1/v + 1/u",
    category: "Optics",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/physics/speedoflight",
    title: "Speed of Light",
    desc: "Measure light propagation speed in various media using wave-based simulations.",
    formula: "c = λf",
    category: "Optics",
    difficulty: "Advanced",
    duration: "18 min",
  },
];

const faqs = [
  {
    q: "What physics principles are used in the simulations?",
    a: "Each simulation implements standard differential equations: Newtonian mechanics (Euler or Runge-Kutta integration), Kirchhoff's laws for circuits, and wave optics approximations. Results are validated against analytical solutions.",
  },
  {
    q: "What are the system requirements?",
    a: "The virtual lab runs in any modern web browser with JavaScript enabled. No plugins or installations required. Recommended: desktop or tablet with at least 8GB RAM for complex optics simulations.",
  },
  {
    q: "Can these experiments be used for coursework?",
    a: "Yes. Each lab includes learning objectives, procedural steps, and data export features. Many instructors assign these as pre-lab exercises or for remote learning scenarios.",
  },
  {
    q: "How accurate are the measurements?",
    a: "Measurement precision depends on the simulation: pendulum period errors < 0.5%, circuit voltages ±1%, and optical diffraction patterns match theoretical intensities within 2%.",
  },
  {
    q: "Is there a cost or registration required?",
    a: "No. All experiments are completely free and do not require any user account. Source code is available for educational institutions upon request.",
  },
];

const categories = ["All", "Mechanics", "Electricity", "Optics"];

/* ═══════════════════════════════════════════════════════════
   3.  Animation Variants
═══════════════════════════════════════════════════════════ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: d * 0.04 },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

/* ═══════════════════════════════════════════════════════════
   4.  Subtle Visualization Component (Minimal SVG)
═══════════════════════════════════════════════════════════ */
function PhysicsVisualization() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-visual">
      {/* Background grid */}
      <g opacity="0.15">
        <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeWidth="0.5"/>
        <line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" strokeWidth="0.5"/>
        <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" strokeWidth="0.5"/>
        <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="0.5"/>
        <line x1="0" y1="250" x2="400" y2="250" stroke="currentColor" strokeWidth="0.5"/>
        <line x1="80" y1="0" x2="80" y2="300" stroke="currentColor" strokeWidth="0.5"/>
        <line x1="160" y1="0" x2="160" y2="300" stroke="currentColor" strokeWidth="0.5"/>
        <line x1="240" y1="0" x2="240" y2="300" stroke="currentColor" strokeWidth="0.5"/>
        <line x1="320" y1="0" x2="320" y2="300" stroke="currentColor" strokeWidth="0.5"/>
      </g>
      {/* Pendulum arc trace */}
      <path d="M200 80 L160 180 L200 180 L240 180 L200 80" stroke="#2c5f8a" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <circle cx="200" cy="80" r="4" fill="#2c5f8a" opacity="0.6"/>
      <line x1="200" y1="80" x2="175" y2="155" stroke="#2c5f8a" strokeWidth="1" opacity="0.5" strokeDasharray="3 3"/>
      {/* Sine wave */}
      <path d="M40 220 C60 190, 100 250, 120 220 C140 190, 180 250, 200 220 C220 190, 260 250, 280 220 C300 190, 340 250, 360 220" stroke="#2c5f8a" strokeWidth="1.2" fill="none" opacity="0.5"/>
      {/* Dots on curve */}
      <circle cx="120" cy="220" r="2" fill="#2c5f8a" opacity="0.6"/>
      <circle cx="200" cy="220" r="2" fill="#2c5f8a" opacity="0.6"/>
      <circle cx="280" cy="220" r="2" fill="#2c5f8a" opacity="0.6"/>
      {/* Axes */}
      <line x1="40" y1="270" x2="360" y2="270" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <line x1="40" y1="270" x2="40" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <text x="370" y="274" fontSize="8" fill="currentColor" opacity="0.4">t</text>
      <text x="36" y="36" fontSize="8" fill="currentColor" opacity="0.4">x</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   5.  Experiment Card Component
═══════════════════════════════════════════════════════════ */
function ExperimentCard({ exp, index }: { exp: Experiment; index: number }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mechanics": return "#2c5f8a";
      case "Electricity": return "#2d6a4f";
      case "Optics": return "#6d28d9";
      default: return "#475569";
    }
  };

  const accentColor = getCategoryColor(exp.category);

  return (
    <motion.article variants={fadeUp} custom={index}>
      <Link href={exp.href} className="exp-card" style={{ borderTopColor: accentColor }}>
        <div className="exp-meta">
          <span className="exp-category" style={{ color: accentColor }}>{exp.category}</span>
          <span className="exp-duration">{exp.duration}</span>
        </div>
        <h3 className="exp-title">{exp.title}</h3>
        <p className="exp-desc">{exp.desc}</p>
        <div className="exp-footer">
          <code className="exp-formula">{exp.formula}</code>
          <span className="exp-cta">
            Launch experiment
            <span className="exp-arrow">→</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════════════════
   6.  FAQ Accordion
═══════════════════════════════════════════════════════════ */
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div variants={fadeUp} custom={index} className="faq-item">
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{q}</span>
        <span className="faq-icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>
      <div className="faq-answer" hidden={!isOpen}>
        <p>{a}</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   7.  Main Page Component
═══════════════════════════════════════════════════════════ */
export default function PhysicsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredExperiments = experiments.filter((exp) => {
    const matchesCategory = activeCategory === "All" || exp.category === activeCategory;
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="phys-root">
        <a href="#main-content" className="skip-link">Skip to main content</a>

        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol className="bc-list">
            <li><Link href="/">Home</Link></li>
            <li className="bc-sep">/</li>
            <li aria-current="page">Physics Virtual Laboratory</li>
          </ol>
        </nav>

        {/* Hero – Two-column layout */}
        <motion.header
          id="main-content"
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="hero"
        >
          <div className="hero-container">
            <div className="hero-content">
              <motion.div variants={fadeUp} className="hero-badge">
                Virtual Laboratory
              </motion.div>
              <motion.h1 variants={fadeUp} className="hero-title">
                Physics<br />Experiments
              </motion.h1>
              <motion.p variants={fadeUp} className="hero-sub">
                Interactive simulations grounded in standard physics equations.<br />
                Measure, analyze, and validate — all in your browser.
              </motion.p>

              <motion.div variants={fadeUp} className="hero-stats">
                <div className="stat">
                  <span className="stat-value">{experiments.length}</span>
                  <span className="stat-label">experiments</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-value">3</span>
                  <span className="stat-label">domains</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-value">0</span>
                  <span className="stat-label">cost / registration</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="search-container">
                <input
                  type="text"
                  placeholder="Search by experiment name or concept"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </motion.div>

              <motion.div variants={fadeUp} className="category-filters">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            </div>

            <div className="hero-visual-area" aria-hidden="true">
              <PhysicsVisualization />
            </div>
          </div>
        </motion.header>

        {/* Experiments Section Header */}
        <div className="experiments-header-wrapper">
          <div className="experiments-header">
            <h2 className="experiments-title">Available experiments</h2>
            <p className="experiments-count">
              {filteredExperiments.length} of {experiments.length} experiments
            </p>
          </div>
        </div>

        {/* Experiments Grid */}
        <main className="experiments-main">
          {filteredExperiments.length === 0 ? (
            <div className="no-results">
              <h3>No matching experiments</h3>
              <p>Try a different search term or category.</p>
            </div>
          ) : (
            <motion.div
              className="experiments-grid"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {filteredExperiments.map((exp, idx) => (
                <ExperimentCard key={exp.href} exp={exp} index={idx} />
              ))}
            </motion.div>
          )}
        </main>

        {/* Key Features */}
        <section className="features-section">
          <div className="features-container">
            <div className="feature">
              <div className="feature-line"></div>
              <h3>Real-time parameter adjustment</h3>
              <p>Change variables and see immediate effects on simulation outcomes.</p>
            </div>
            <div className="feature">
              <div className="feature-line"></div>
              <h3>Live data & graphs</h3>
              <p>View measurements, export data, and compare with theoretical models.</p>
            </div>
            <div className="feature">
              <div className="feature-line"></div>
              <h3>Curriculum aligned</h3>
              <p>Each experiment includes learning objectives and discussion prompts.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="faq-container">
            <div className="faq-header">
              <h2 className="faq-title">Frequently asked questions</h2>
              <p className="faq-sub">Technical and pedagogical details</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
            <div className="faq-footer">
              <Link href="/contact" className="faq-link">Contact research team →</Link>
            </div>
          </div>
        </section>

        <footer className="lab-footer">
          <p>All simulations are free for educational use. Validated against experimental data.</p>
        </footer>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   8.  Updated CSS – Two-column hero, better spacing
═══════════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600&family=Source+Code+Pro:wght@400;500&display=swap');

.phys-root {
  --bg: #f5f7fa;
  --surface: #ffffff;
  --surface-hover: #fafcff;
  --border: #e4e7ec;
  --border-light: #edf2f7;
  --text: #1a2a3a;
  --text-muted: #4a5b6e;
  --text-light: #7e8c9e;
  --accent: #2c5f8a;
  --accent-light: #eef3fc;
  --radius: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.03);
  --shadow-md: 0 2px 6px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.05);
  --shadow-hover: 0 8px 24px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.02);
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.skip-link {
  position: absolute;
  top: -40px; left: 1rem;
  background: var(--accent);
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  text-decoration: none;
  border-radius: 4px;
  z-index: 100;
}
.skip-link:focus { top: 0.75rem; }

.breadcrumb {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
}
.bc-list {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
  color: var(--text-light);
}
.bc-list a {
  color: var(--text-light);
  text-decoration: none;
}
.bc-list a:hover { color: var(--accent); }
.bc-sep { color: var(--border); }

/* Hero – two columns */
.hero {
  padding: 2rem 2rem 3rem;
  border-bottom: 1px solid var(--border-light);
  background: linear-gradient(to bottom, #ffffff, var(--bg));
}
.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 3rem;
  align-items: center;
}
.hero-content {
  flex: 1.2;
}
.hero-visual-area {
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hero-visual {
  width: 100%;
  max-width: 380px;
  height: auto;
  color: var(--accent);
}

.hero-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-light);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
}
.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0 0 1rem;
  line-height: 1.2;
}
.hero-sub {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 1.75rem;
  line-height: 1.5;
}
.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.65rem 1.75rem;
  margin-bottom: 1.75rem;
}
.stat {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}
.stat-value {
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--text);
}
.stat-label {
  font-size: 0.8rem;
  color: var(--text-light);
}
.stat-divider {
  width: 1px;
  height: 24px;
  background: var(--border);
}
.search-container {
  max-width: 440px;
  margin-bottom: 1.5rem;
}
.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 40px;
  font-size: 0.875rem;
  background: var(--surface);
  transition: all 0.2s;
}
.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(44,95,138,0.1);
}
.category-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.filter-chip {
  padding: 0.4rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.filter-chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.filter-chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

/* Experiments Header */
.experiments-header-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 0 2rem;
}
.experiments-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}
.experiments-title {
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0;
}
.experiments-count {
  font-size: 0.8rem;
  color: var(--text-light);
}

.experiments-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem 3rem;
}
.experiments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.no-results {
  text-align: center;
  padding: 4rem;
  color: var(--text-light);
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}
.no-results h3 {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.exp-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-top-width: 3px;
  border-radius: var(--radius);
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  height: 100%;
}
.exp-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: var(--border);
}
.exp-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.7rem;
}
.exp-category {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.exp-duration {
  color: var(--text-light);
}
.exp-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  line-height: 1.4;
}
.exp-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 1rem;
  flex: 1;
}
.exp-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-light);
}
.exp-formula {
  font-family: 'Source Code Pro', monospace;
  font-size: 0.7rem;
  background: var(--bg);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: var(--accent);
}
.exp-cta {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}
.exp-arrow {
  transition: transform 0.2s;
}
.exp-card:hover .exp-arrow {
  transform: translateX(3px);
}

.features-section {
  background: var(--surface);
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  padding: 3rem 2rem;
}
.features-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}
.feature {
  text-align: center;
  max-width: 240px;
}
.feature-line {
  width: 32px;
  height: 2px;
  background: var(--accent);
  margin: 0 auto 1rem;
}
.feature h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}
.feature p {
  font-size: 0.8rem;
  color: var(--text-light);
  line-height: 1.5;
  margin: 0;
}

.faq-section {
  background: #ffffff;
  padding: 4rem 2rem;
}
.faq-container {
  max-width: 760px;
  margin: 0 auto;
}
.faq-header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.faq-title {
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0 0 0.25rem;
}
.faq-sub {
  font-size: 0.9rem;
  color: var(--text-light);
}
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.faq-item {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  color: var(--text);
}
.faq-question:hover {
  background: var(--surface-hover);
}
.faq-icon {
  font-size: 1.2rem;
  color: var(--accent);
}
.faq-answer {
  padding: 0 1.25rem 1.25rem 1.25rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border-light);
}
.faq-footer {
  text-align: center;
  margin-top: 2rem;
}
.faq-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
}
.faq-link:hover {
  text-decoration: underline;
}

.lab-footer {
  text-align: center;
  padding: 2rem;
  background: var(--bg);
  border-top: 1px solid var(--border);
  font-size: 0.75rem;
  color: var(--text-light);
}

@media (max-width: 768px) {
  .hero { padding: 1.5rem 1rem 2rem; }
  .hero-container { flex-direction: column; gap: 2rem; }
  .hero-visual-area { order: -1; max-width: 280px; margin: 0 auto; }
  .hero-stats { gap: 1rem; padding: 0.5rem 1rem; width: 100%; justify-content: center; }
  .stat { flex-direction: column; align-items: center; gap: 0; }
  .stat-value { font-size: 1rem; }
  .stat-label { font-size: 0.7rem; }
  .experiments-header-wrapper { padding: 1.5rem 1rem 0 1rem; }
  .experiments-main { padding: 1.5rem 1rem 2rem; }
  .experiments-grid { grid-template-columns: 1fr; }
  .features-container { gap: 1.5rem; }
  .faq-section { padding: 2rem 1rem; }
}
`;