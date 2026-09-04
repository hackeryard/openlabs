# Changelog

All notable changes to OpenLabs are documented in this file. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); since the project has no version tags yet, entries are grouped by date instead of version number. Generated from git history; merge commits and duplicate/typo commits are omitted.

- **Visual Geo-Distribution, Interactive SVG World Map & Regional Analytics (`worldAtlas.ts`, `WorldMapAnalytics.tsx`, `countries.ts`, `analyticsDb.ts`, `/admin/analytics`)**:
  - **Mobile Responsive Engine & Touch Gestures (`app/components/admin/WorldMapAnalytics.tsx`, `app/admin/analytics/page.tsx`)**:
    - **Adaptive Viewport & Canvas**: Adapted the map canvas with responsive aspect ratio (`aspect-[16/10] sm:aspect-[2.05/1]` and `min-h-[260px] sm:min-h-[460px]`) ensuring full mobile viewport fitting without vertical letterboxing or horizontal clipping.
    - **Touchscreen Pan & Pinch-to-Zoom**: Implemented 1-finger touch pan drag when zoomed in (`zoom > 1`) with bounded pan limits, 2-finger touch pinch-to-zoom, and dynamic `touchAction` management (`none` during active zoom, `pan-y` at 1x to permit seamless page scrolling).
    - **Mobile Docked Inspection Drawer**: On mobile screens (<640px), replaced the cursor-following floating card with a docked bottom inspection drawer (`bottom-2 inset-x-2 max-w-[360px] mx-auto`) with a dedicated `✕` dismiss button, tap-to-filter / tap-to-clear action CTA, and tap-outside canvas dismissal.
    - **Scrollable Continent Presets**: Converted continent preset jumps (World, Asia-Pac, Europe, Americas, Africa) into a horizontally scrollable pills bar (`overflow-x-auto no-scrollbar`) accessible on all screen sizes.
    - **Interactive Executive KPI Cards**: Upgraded all 7 overview metric cards (**Total Pageviews**, **Unique Visitors**, **Returning Users**, **Total Sessions**, **Avg Dwell Time**, **Avg Scroll Depth**, **Runtime Errors**) into interactive, clickable cards with `View →` hover transitions, tooltip indicators, and smooth scrolling to their corresponding analytics tabs (`live_feed`, `acquisition`, `returning_users`, `journeys`, `engagement`, `errors`).
    - **Bulk Actions & Export Dropdown Mobile Alignment**: Resolved mobile screen overflow where the Bulk Actions menu hung off the left edge of the viewport when wrapped onto a new line by applying responsive anchor alignment (`left-0 sm:left-auto sm:right-0`), maximum width bounds (`max-w-[calc(100vw-2rem)]`), and touch backdrop dismiss handlers.
    - **Responsive Custom Date Range Selectors (`DateRangeNavigator`)**:
      - **Mobile Bottom Sheet Modal**: Upgraded custom date picker from an overflowing popover to a native-feeling mobile bottom sheet drawer (`fixed inset-x-3 bottom-3 sm:bottom-auto sm:inset-x-auto sm:right-0 sm:top-full sm:absolute`) with a drag pill handle, 1-tap darkened backdrop dismiss (`fixed inset-0 z-50 bg-black/60`), and keyboard `Escape` dismissal.
      - **Space-Efficient Range Formatting**: Added `formatRangeLabel()` converting unwieldy timestamps (e.g. `2026-08-01 to 2026-09-04`) into compact, human-readable spans (e.g. `Aug 1 – Sep 4`) that fit cleanly without wrapping or truncation on narrow mobile screens (320px–375px).
      - **Window Stepper Navigation**: Enhanced the `<` / `>` day stepper to dynamically shift custom date range windows backward or forward by the active interval span, capped safely at today's date.
      - **Touch-Friendly Ergonomics & Quick Presets**: Integrated horizontal quick preset chips ("Last 3 Days", "Last 7 Days", "Last 14 Days", "Last 30 Days", "This Month", "Last Month") with live selected span badge (`Nd span`), full 44px (`h-11`) touch target heights on mobile inputs, and native dark/light theme calendar scheme support (`dark:[color-scheme:dark] [color-scheme:light]`).
    - **Responsive Geo KPI Metrics**: Optimized padding, typography, and icon sizing across executive Geo KPI cards (`Nations Reached`, `Top Country`, `Top Active City`, `International Share`) to prevent text truncation or multi-line overflow on narrow mobile screens.
  - **Command-Center Vector World Map & Glassmorphic HUD Tooltip (`app/lib/geo/worldAtlas.ts`, `app/components/admin/WorldMapAnalytics.tsx`)**:
    - Created an offline, zero-CDN vector World Map in Natural Earth projection with deep space radial vignette canvas, cartographic parallels (Equator, Tropics, Prime Meridian), and 1-click graticule toggle control.
    - Added 1-click Continent Quick-Jump presets (World, Asia-Pac, Europe, Americas, Africa), interactive mouse pan-and-drag navigation, and native non-passive touchpad pinch-to-zoom and mouse-wheel zoom scaling towards the cursor position.
    - Engineered 5-tier bioluminescent neon choropleth heatmap gradient fills (`#22d3ee` to `rgba(14,165,233,0.35)`).
    - Redesigned the country hover card to float dynamically around the cursor with a 22px side clearance on desktop (preventing the card from being under the cursor or docked in corners), automatic right-to-left flipping near boundaries, vertical clamping, and zero emojis throughout.
  - **Reverse ISO Lookup & Continent Region Engine (`app/lib/countries.ts`)**:
    - Added `getCountryIsoCode()` supporting bidirectional resolution of full country names (e.g. `"India"` → `"IN"`, `"United States"` → `"US"`) and 2-letter codes.
    - Added `getContinentForCountry()` categorizing traffic into 6 global zones ("Asia-Pacific", "Europe", "North America", "South America", "Africa", "Middle East", "Oceania").
    - Enhanced `getCountryFlag()` with ISO code point math to render country flag emojis.
  - **Database Geo Aggregations & City Telemetry (`app/lib/analyticsDb.ts`)**:
    - Added `citiesPromise` pipeline grouping pageviews by `{ city, country }` to generate the top active cities leaderboard with view counts and percentage shares.
    - Computed executive Geo KPIs: **Nations Reached** count, **Top Country**, **Top Active City**, and **International Traffic Share %** (ratio of traffic originating outside the #1 country).
  - **Admin Geo & Systems Command Center (`app/admin/analytics/page.tsx`)**:
    - Upgraded the Tech tab into **Geo & Systems** featuring 4 executive Geo KPI metric cards, the full interactive vector World Map, Top Countries leaderboard, Top Active Cities leaderboard, and Continents breakdown.
    - Added interactive map filtering with active filter badges and 1-click filter reset.
    - Retained and organized client device types, browsers, operating systems, and screen resolution diagnostics.

- **Blog Markdown Hydration Error Fix (`app/components/blog/BlogPostInteractive.tsx`)**:
  - **Resolved `<p>` Cannot Contain `<div>` Hydration Mismatch**: In `react-markdown` v10, the deprecated `inline` prop was removed from the `code` component callback. As a result, inline code snippets (e.g. `` `A + B → AB` ``) inside paragraphs erroneously fell through to `<CodeBlock>`, injecting `<div>` elements inside `<p>` tags and triggering client hydration crashes.
  - **Separated `pre` and `code` Handlers**: Moved the custom `<CodeBlock>` wrapper to `components.pre` to intercept fenced code blocks at the block level where `<div>` is valid HTML. Configured `components.code` to render standard inline `<code>` elements within paragraphs. Added recursive `getCodeString` helper to safely extract plain text for the 1-click clipboard copy feature.

- **Enterprise Web Analytics, Core Web Vitals RUM & STEM Lab Learning Telemetry (`PageView.js`, `AnalyticsEvent.js`, `tracker.ts`, `OpenLabsTracker.tsx`, `useXP.ts`, `route.ts`, `analyticsDb.ts`, `/admin/analytics`)**:
  - **Real User Monitoring (RUM) & Core Web Vitals**:
    - Integrated native `PerformanceObserver` instances in `OpenLabsTracker.tsx` collecting Real User Monitoring (RUM) vitals: Largest Contentful Paint (LCP), First Contentful Paint (FCP), Cumulative Layout Shift (CLS), Interaction to Next Paint (INP), and Navigation Timing (TTFB, DOM Content Loaded, Window Load).
    - Added rating classification (Good, Needs Improvement, Poor) matching Google Web Vitals performance budgets.
  - **Hardware & Network Diagnostics**:
    - Client environment detector extracts unmasked WebGL GPU renderers (Apple M-series, Nvidia RTX, Intel Iris, AMD Radeon, Mali, Adreno) via `WEBGL_debug_renderer_info`.
    - Captured client device memory (RAM in GB), logical CPU cores, device pixel ratio (DPR), viewport dimensions, and Network Information API connection profiles (4G, 3G, 2G, downlink speed, RTT).
  - **Engagement Dwell & Frustration UX Telemetry**:
    - Added 1-second active vs. idle interval ticker isolating genuine user interaction time from backgrounded tabs.
    - Added scroll depth milestone tracker (`25%`, `50%`, `75%`, `90%`, `100%`) logging progressive student reading breadcrumbs.
    - Implemented Rage Click Radar detecting frustrated rapid clicks ($\ge 3$ clicks within 500ms and radius $< 40$px) with element CSS selectors and text snippets.
    - Added desktop exit-intent detection and outbound external documentation click telemetry.
  - **Interactive STEM Lab Intelligence (`useXP.ts`)**:
    - Auto-dispatches `lab_started` upon student entry to any virtual science simulation.
    - Dispatches `lab_completed` on experiment completion with XP earned and duration.
    - Exported granular learning telemetry hooks: `trackParameterChange` (slider/input changes), `trackLabStep` (checkpoint progressions), `trackQuizAttempt` (knowledge checks), and `trackLabReset`.
  - **Analytics Database Aggregation Pipelines (`analyticsDb.ts`)**:
    - Added parallel aggregation pipelines: `webVitalsSummaryPromise` (LCP/INP/CLS/FCP/TTFB averages & Good/Needs/Poor distribution tiers), `webVitalsPagesPromise` (matrix of Web Vitals per route), `networkTypesPromise`, `hardwareGpuPromise`, `hardwareCoresPromise`, `labFunnelPromise` (starts, completions, completion rate %, parameter tweaks, quiz attempts), `rageClicksPromise`, `outboundClicksPromise`, `behavioralSummaryPromise` (bounce rate, exit intent rate, active/idle ratio), and `sessionPathsPromise` (top landing entry pages and top exit drop-off pages).
  - **Executive Analytics Dashboard Tabs (`/admin/analytics`)**:
    - Added **⚡ Core Web Vitals & RUM Tab**: Interactive performance gauges for LCP, INP, CLS, FCP, TTFB with budget progress bars, route-by-route Web Vitals matrix table, and hardware/network distribution cards.
    - Added **🔬 Lab Intelligence & Learning Funnel Tab**: Executive KPIs for lab starts, experiment completions, completion rate %, parameter tweaks, quiz attempts, and a per-lab telemetry table with live links to simulations.
    - Added **🧠 Behavioral UX Signals Tab**: Bounce rate %, exit intent %, active dwell ratio, and a live Rage Click Radar table highlighting frustrated clicks with CSS selectors.
    - Added **🗺️ User Journeys & Paths Tab**: Top entry pages (session starters) and top exit drop-off pages with traffic share percentages.
    - Enhanced Live Stream Feed with badges for active vs. idle dwell, network connection type (4G), GPU renderer, and Web Vitals score.

- **Admin Panel Dark Mode Dropdowns & Responsive Layout Fixes (`app/globals.css`, `app/admin/analytics/page.tsx`, `app/admin/users/page.tsx`, `app/admin/feedback/page.tsx`, `app/admin/contacts/page.tsx`, `app/admin/blogs/create/page.tsx`, `app/admin/blogs/[slug]/edit/page.tsx`, `app/admin/page.tsx`)**:
  - **Native Dark Mode Select Popups (`app/globals.css`)**: Defined `color-scheme: light` in `:root` and `color-scheme: dark` in `.dark` and `.dark select`, instructing Chromium, WebKit, and Gecko to render native `<select>` popups in OS dark canvas mode. Added explicit global `.dark select option` rules (`#0f172a` background and `#f8fafc` text) and `select option:checked` highlighting, eliminating unreadable white-on-white text in Windows/Chrome dark mode.
  - **Explicit Option Theming Across Admin Pages**: Added `cursor-pointer [&>option]:bg-card [&>option]:text-foreground [&>option]:dark:bg-slate-900 [&>option]:dark:text-slate-100` classes to all `<select>` inputs across Analytics, Users, Feedback, Contacts, and Roles drawers.
  - **Date Range Navigator Overflow Guard (`app/admin/analytics/page.tsx`)**: Enabled smooth horizontal scrolling (`overflow-x-auto no-scrollbar max-w-full`) for quick preset buttons and bounded the custom date range picker popover to `max-w-[calc(100vw-2rem)]`, preventing horizontal layout breaking on mobile devices.
  - **Users Detailed Filter Grid & Drawer (`app/admin/users/page.tsx`)**: Converted the 5-filter strip from `grid-cols-2` to `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5` with comfortable touch targets. Added mobile drawer padding (`p-4 sm:p-6`), `break-all` on user IDs and emails, and responsive stacking on the role selection row.
  - **Feedback & Contacts Control Bars (`app/admin/feedback/page.tsx`, `app/admin/contacts/page.tsx`)**: Upgraded filter toolbars to flex wrap (`flex-col sm:flex-row`) with responsive search inputs and scrollable view mode pills.
  - **Blog Creation & Edit Forms (`app/admin/blogs/create/page.tsx`, `app/admin/blogs/[slug]/edit/page.tsx`)**: Replaced hardcoded light alerts (`bg-red-50`, `bg-emerald-50`) with dark-friendly semantic tokens (`bg-rose-500/10 text-rose-600 dark:text-rose-400`, `bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`), and adjusted container padding from fixed `p-8` to responsive `p-4 sm:p-6 md:p-8`.
  - **Admin Overview KPI Cards (`app/admin/page.tsx`)**: Adjusted padding from `p-4` to `p-3.5 sm:p-4` for optimal mobile screen fit.

- **Returning Users Tracking, Retention & Profiles Directory (`app/models/PageView.js`, `app/lib/tracker.ts`, `app/api/analytics/collect/route.ts`, `app/lib/analyticsDb.ts`, `app/api/admin/analytics/pageviews/route.ts`, `app/admin/analytics/page.tsx`)**:
  - **Client-Side Visitor Lifecycle & Visit Counting**: Enhanced `tracker.ts` with `getVisitorMetadata()` using persistent storage keys (`openlabs_vc`, `openlabs_ls`, `openlabs_v_trans`) to count lifetime visit sessions, track last-seen timestamps, and tag pageviews with `isReturning: boolean` and `visitCount: number`.
  - **Telemetry Ingestion & Database Resilience**: Updated `PageView` schema with `isReturning` and `visitCount` compound indexes, and updated `/api/analytics/collect` to persist returning status with database fallback looking up historical sessions for the visitor.
  - **Analytics Aggregation Engine**: Added `retentionPromise` aggregation in `analyticsDb.ts` computing total unique visitors, returning visitors, new visitors, return rate %, and visit frequency loyalty distribution tiers (1 visit, 2 visits, 3–5 visits, 6+ visits). Added returning visitors and views to the timeseries aggregation.
  - **Returning Users Profiles & Directory Pipeline**: Added `returningUsersPromise` aggregation pipeline grouping returnees by `visitorId`, populating registered accounts (`User` model: name, email, username, avatar, level, xp), calculating lifetime visits, sessions in range, total dwell time, top explored labs, and country/city/device/OS attribution.
  - **Executive Analytics Dashboard UI**:
    - Added dedicated **Returning Users Directory Tab (`/admin/analytics`)**: Searchable and filterable directory (Registered Members vs. Anonymous Guests) sorted by lifetime visits, recent activity, pageviews, or dwell time.
    - Features user cards/rows showing student names, emails, avatars, XP, guest visitor IDs, visit frequencies, top explored science labs, and a 1-click **Inspect Timeline** button that filters the live pageview stream for that visitor.
    - Added dedicated **Returning Users Overview Card** displaying total returning visitors, return rate %, new vs. returning breakdown, and 1-click link to the directory.
    - Added stacked returning pageviews visualization and detailed returning/new visitor tooltips to the **Traffic & Returning Users Trend** time-series graph.
    - Added interactive **Visitor Retention & Loyalty Breakdown** card in the Engagement tab with new vs. returning split bars and loyalty milestone distributions.
    - Added `New Visitors Only` and `Returning Visitors Only` filters to the Live Feed query selector, and tagged every live stream pageview row with `🟢 New` or `🔄 Return (#visitCount)` badges.

- **Error Triage Fixes & WebGL Stability Patch (`AnimalCell.tsx`, `PlantCell.tsx`, `OpenLabsTracker.tsx`, `/labs/biology/cell`)**:
  - **Resolved 1499 Safari WebGL Crashes (Bug #9, #10)**: Replaced external HDR `<Environment preset="city" />` and `preset="park"` in `AnimalCell.tsx` and `PlantCell.tsx` with studio directional and hemisphere lighting, eliminating Three.js PMREM shader compilation crashes (`u.getProgramInfoLog(T).trim`) and WebGL context loss.
  - **Auto-Recovery on Stale Deployment Chunks (Bug #1, #2, #3)**: Added automatic one-time session page reload and error suppression for Next.js `ChunkLoadError` and stale script hash 404s after redeployments.
  - **Ad-Blocker & Analytics Script Suppression (Bug #5, #6, #11, #12, #13, #14, #23)**: Suppressed false-positive resource errors for blocked third-party telemetry scripts (`_vercel/insights`, `_vercel/speed-insights`, `clarity.ms`, extensions).
  - **Network Disconnect & Background Auth Probe Guard (Bug #4, #7, #8, #15, #16, #17, #18, #19, #20, #22)**: Prevented `TypeError: Failed to fetch` on `/api/auth/me` from being logged as server errors when clients go offline or background tabs disconnect.
  - **Fixed Broken Route 404 (Bug #21)**: Created `app/labs/biology/cell/page.tsx` redirecting to `/biology/cell`.

- **Lab Feedback System Business Rules & Data Integrity Fix (`app/components/FloatingLabFeedback.tsx`, `app/components/FeedbackPulse.tsx`, `app/hooks/useFeedback.ts`, `app/api/feedback/route.ts`)**:
  - **Eliminated Premature Pulse Submissions**: Removed premature `submitPulse()` background calls on initial "Yes, Helpful" / "Not Helpful" button clicks in `FloatingLabFeedback` and `FeedbackPulse`. Choices now purely advance the modal state without creating premature, unrated, or unannotated records in MongoDB.
  - **Helpful Flow Enforcement**: Star rating (1–5) is strictly mandatory. If rating is $< 3$ stars, detailed comment is mandatory. If $\ge 3$ stars, comment is optional.
  - **Not Helpful Flow Enforcement**: Detailed comment describing what went wrong is strictly mandatory. Added optional star rating (1–5) in the not-helpful view.
  - **Backend API Validation (`/api/feedback`)**: Enforced server-side validation rejecting requests missing mandatory ratings or comments with clear 400 Bad Request responses.
  - **Race Condition & Concurrency Guard**: Replaced state-only tracking with `isSubmittingRef` in `useFeedback.ts` and made `submitDeep` return boolean completion status to prevent silent drop of user submissions.
  - **Admin Feedback Triage Enhancement (`app/admin/feedback/page.tsx`, `app/api/admin/feedback/[id]/route.ts`)**: Added a `DELETE` endpoint and UI button to allow administrators to permanently purge invalid/test feedback entries.

- **Information-Theoretic Hangman AI Studio (`app/labs/computer-science/ai-problem/hangman/page.tsx`)**:
  - Rebuilt the Hangman laboratory into an Information-Theoretic AI and NLP search engine leveraging Shannon Entropy and Bayesian lexicon candidate pruning.
  - **Optimal AI Solver Engine**: Computes exact letter probability distributions $P(c)$ and Shannon Information Gain $H(c) = -\sum P(p \mid c) \log_2 P(p \mid c)$ over the candidate lexicon to partition search space logarithmically.
  - **Interactive High-DPI Vector Gallows Canvas**: Progressive stick figure rendering with dynamic error tracking, scaffold structure, and end-of-game victory/loss face states.
  - **Live Letter Probability & Entropy Tensor Matrix**: Real-time ranking of candidate letters by expected entropy reduction and candidate word count.
  - **Information Theory & Equivalence Class Formulary**: Mathematical derivations of mutual information, Shannon entropy, and adversarial "Evil Hangman" partition selection.

- **STRIPS Classical Planning & State-Space Studio (`app/labs/computer-science/ai-problem/monkey-banana/page.tsx`)**:
  - Rebuilt the classic Monkey & Banana problem laboratory with automated STRIPS planning, Means-Ends Analysis (MEA), and 2D physics animation.
  - **Automated STRIPS Planning Engine**: Implemented state transition operators (`Walk(X, Y)`, `Push(Box, X, Y)`, `ClimbUp(Box, X)`, `GraspBanana(Center)`) with formal Preconditions, Add-Lists, and Delete-Lists.
  - **Interactive High-DPI 2D Environment Canvas**: Visualized room anchors (Door, Window, Center ceiling hook), moveable wooden crate, procedural walking/pushing/climbing animations, and banana grasping effects.
  - **Means-Ends Goal Stack Synthesizer**: Animated decomposition of master goals into sub-goals and precondition alignment.
  - **STRIPS Theory & Frame Problem Formulary**: Mathematical formulations of state transition functions $\text{Result}(S, a) = (S \setminus \text{Del}(a)) \cup \text{Add}(a)$ and frame problem resolutions.

- **Inference Engines & Rule-Based Reasoning Studio (`app/labs/computer-science/ai-problem/forward-backward/page.tsx`)**:
  - Rebuilt the Forward and Backward Chaining laboratory with dual inference paradigms, conflict resolution strategies, and dynamic DAG knowledge graph visualization.
  - **Multiple Expert System Domains**: Integrated Medical Diagnostic Expert System (MYCIN-style clinical inference), Zoological Taxonomy (Russell & Norvig animal classification), and Cybersecurity Threat Response (SIEM/SOC incident detection).
  - **Dual Inference Paradigms**: Implemented Forward Chaining (data-driven Generalized Modus Ponens with fixed-point $\Delta WM = \emptyset$) and Backward Chaining (goal-directed top-down AND-OR tree search).
  - **Conflict Resolution Engine**: Added Specificity (most antecedents first), Recency, and Rule Index priorities.
  - **High-DPI Directed Acyclic Knowledge Graph**: Rendered DAG with glowing rule hyperedges, color-coded fact nodes (cyan observed, green derived, purple hypothesis), and real-time step deduction traces.
  - **Horn Clause & Linear Tractability Formulary**: Formal mathematical proofs of definite Horn clause tractability ($\mathcal{O}(n)$ time) and sound Modus Ponens derivations.

- **Water Jug State-Space Search & Production Rules Studio (`app/labs/computer-science/ai-problem/water-jug/page.tsx`)**:
  - Rebuilt the Water Jug problem laboratory with realistic fluid dynamics, production rule systems (R1–R8), and state-space graph search.
  - **Multi-Algorithm Search Engine**: Integrated BFS (shortest-path minimal decanting sequence), DFS, and A* Heuristic Search ($h(s) = \min(|j_1 - T|, |j_2 - T|) / \gcd(a, b)$).
  - **Interactive High-DPI Fluid Decanting Canvas**: Realistic glass containers with liquid wave meniscus, graduation measurement marks, and pouring animations.
  - **2D State Lattice $(J_1, J_2) \in \mathbb{Z}^2$ Visualizer**: Graph visualizer displaying visited nodes, solution trajectory paths, and unvisited state boundaries.
  - **Bézout's Identity & Diophantine Solvability Formulary**: Formal mathematical proof via Extended Euclidean Algorithm verifying $T \le \max(a, b)$ and $T \equiv 0 \pmod{\gcd(a, b)}$.

- **Constraint Satisfaction Problems (CSP) & AC-3 Studio (`app/labs/computer-science/ai-problem/constraint-satisfy/page.tsx`)**:
  - Completely reworked the Constraint Satisfaction Laboratory with AC-3 Arc Consistency, MRV, Degree, and LCV heuristics.
  - **Multiple Canonical AI Benchmarks**: Integrated Australia 7-Region Map Coloring (Russell & Norvig), 5-Node Wheel Graph, 4-Queens Column Allocation, and K4 Complete Graph unsolvable trap.
  - **Heuristic Search & Inference Engine**: Implemented Backtracking with MRV (Fail-First) and Degree tie-breaking, Forward Checking (FC) domain pruning, and AC-3 Arc Consistency queue reduction ($\mathcal{O}(cd^3)$).
  - **Interactive High-DPI Topological Graph Canvas**: Crisp Retina canvas rendering with dynamic constraint edges (red conflicts, green consistent links), glowing variable nodes, domain size badges, and real-time backtracking animation.
  - **Domain Tensor Matrix & Formulary**: Detailed inspector showing active variable domains, constraint neighbors, and mathematical formulations of CSP triples $\langle X, D, C \rangle$.

- **Retina / High-DPI Canvas Rendering Engine Upgrade (`app/labs/computer-science/ai-problem/`)**:
  - Implemented dynamic `window.devicePixelRatio` buffer scaling across all AI Problem lab canvases (`hill-climb`, `maze-qlearn`, and `neural-network`).
  - Completely eliminated browser bitmap interpolation blurriness on Retina, 2K/4K, and high-density displays by syncing internal canvas buffer resolutions to physical hardware pixels.

- **B.Tech Level Hill Climbing & Simulated Annealing Lab (`app/labs/computer-science/ai-problem/hill-climb/page.tsx`)**:
  - Rebuilt the Local Search & Optimization laboratory to undergraduate B.Tech Computer Science curriculum standard.
  - **Multi-Strategy Optimization Engine**: Added Steepest-Ascent Greedy, Stochastic Hill Climbing, Multi-Seed Random Restarts, and Simulated Annealing with the Metropolis-Hastings acceptance criterion ($P = \exp(\Delta E / T)$).
  - **Continuous Benchmark Landscapes**: Multi-modal Ackley benchmark, Asymmetric Foothills, Saddle/Shoulder Plateaus, Rastrigin high-frequency landscape, and Convex Paraboloid.
  - **Interactive High-DPI Landscape Studio**: Canvas visualization with continuous Bezier curves, illuminated agent beacon, trajectory breadcrumbs, candidate neighbor evaluation brackets, and interactive canvas seed clicker.
  - **State Transition Tensor Inspector & Formulary**: Detailed step-by-step tensor table recording candidate energy deltas, Metropolis acceptance probabilities, cooling schedules, and asymptotic completeness proofs.

- **B.Tech Level Reinforcement Learning Lab (`app/labs/computer-science/ai-problem/maze-qlearn/page.tsx`)**:
  - Completely reworked the Q-Learning and SARSA Reinforcement Learning simulation to undergraduate B.Tech Computer Science curriculum standard.
  - **Multi-Algorithm TD Engine**: Added support for Off-Policy Q-Learning, On-Policy SARSA, and Expected SARSA with $\epsilon$-Greedy and Boltzmann Softmax ($\tau$) exploration policies.
  - **Interactive GridWorld Surface**: High-DPI GridWorld with directional Q-value triangles for each action $(s, a)$, real-time derived optimal policy $\pi^*(s)$ vector arrows, step costs, and trap penalties.
  - **Classic Benchmarks**: Integrated Sutton & Barto's Cliff Walking (4x8), Obstacle Course (6x6), Frozen Lake (4x4), and Deep Multi-Room Maze (7x7).
  - **Q-Table Tensor Inspector & Bellman Formulary**: Tabbed matrix explorer showing complete discrete state-action parameters and mathematical derivations of the Bellman Optimality Equation.

- **B.Tech Level Multilayer Perceptron Neural Network Lab (`app/labs/computer-science/ai-problem/neural-network/page.tsx`)**:
  - Elevated the Neural Network interactive laboratory to undergraduate B.Tech Computer Science / Deep Learning standard.
  - **Vector Calculus & Backpropagation Formulation**: Complete derivations for forward tensor propagation ($\mathbf{z}^{[l]} = \mathbf{W}^{[l]}\mathbf{a}^{[l-1]} + \mathbf{b}$), Binary Cross-Entropy loss ($J$), and recursive error deltas ($\boldsymbol{\delta}^{[l]} = (\mathbf{W}^{[l+1]T}\boldsymbol{\delta}^{[l+1]}) \odot \sigma'$).
  - **Multi-Optimizer Engine**: Implemented Mini-Batch SGD, Momentum ($\beta=0.9$), RMSprop, and Adam with adaptive bias-corrected moments ($m_t, v_t$).
  - **Synaptic Weight Matrix & Gradient Tensor Inspector**: Interactive matrix table visualizing raw weight tensors $\mathbf{W}^{[l]}$ and backpropagated Jacobian gradients $\nabla_\mathbf{W} \mathcal{L}$.
  - **Vanishing / Exploding Gradient Diagnostics**: Real-time gradient L2 norm gauge tracking saturation across deep Sigmoid vs. non-saturating ReLU/Leaky ReLU layers.
  - **Statistical Metrics & Confusion Matrix**: Real-time 80/20 train-test evaluation with Precision, Recall, F1 Score, and dual train-vs-test loss convergence curves.

- **Neural Network AI Problem Landing Page (`app/computer-science/ai-problem/neural-network/`)**:
  - Added the dedicated SEO landing page and Schema.org structured metadata for the Multilayer Perceptron Neural Network visualizer.
  - Resolved broken subtopic hub link and connected the landing page directly to `/labs/computer-science/ai-problem/neural-network`.

- **Error Diagnostics Pagination & Telemetry Noise Filtering (`app/admin/analytics/page.tsx`, `app/components/OpenLabsTracker.tsx`)**:
  - Added full pagination controls (10, 20, 50, 100 per page, dynamic jump, and filter reset) to the Error Diagnostics tab in the Admin Analytics portal.
  - Cleaned telemetry ingest filters to ignore ad-blocker blocked scripts (`_vercel/insights`, `_vercel/speed-insights`, `clarity.ms`) and third-party extension DOM mutations.

- **Admin Blog Editor Unsaved Changes Protection (`app/admin/blogs/`, `app/hooks/useFormDirtyWarning.ts`)**:
  - Implemented dirty-state tracking for New Blog Post creation and Blog Post editing forms.
  - Prevents accidental navigation away, route switching (internal Next.js links / browser back-forward), tab close, and hard reloads when there are unsaved edits.
  - Automatically clears warnings upon successful publication or update.

- **Streamlined Role-Based Admin Access (RBAC) & Admin Secret Removal**:
  - Removed secondary `ADMIN_SECRET` passcode requirement and `x-admin-secret` headers across all administrative routes (`/admin/*`) and APIs (`/api/admin/*`).
  - Streamlined authorization directly to standard JWT session verification: users with `role: "admin"` or `role: "moderator"` access the admin console automatically upon signing in.
  - Removed secret passkey lockscreens and replaced with clean staff authentication gateways and 403 access restriction screens for non-staff accounts.

- **Cardiac Cycle, ECG & Heart Hemodynamics Virtual Lab (`app/components/biology/heart-cardiac-cycle/`, `/labs/biology/heart-cardiac-cycle`, `/biology/heart-cardiac-cycle`)**:
  - **4-Chamber Anatomical Heart Engine**:
    - Real-time animated vector cardiac cross-section with Right Atrium, Right Ventricle, Left Atrium, Left Ventricle, Vena Cava, Pulmonary Artery/Veins, and Systemic Aorta.
    - Synchronized mechanical valve kinematics (Tricuspid, Mitral/Bicuspid, Aortic, and Pulmonic valves) reacting dynamically to chamber pressure differentials.
    - SA Node, AV Node, and Purkinje electrical conduction network visualization with traveling excitation glow.
  - **Synchronized Multi-Channel Curves & Wiggers Diagram**:
    - Real-time Lead II ECG waveform generator ($P, Q, R, S, T$ waves) synchronized to cardiac phase fraction.
    - Wiggers pressure diagram mapping Left Ventricular and Aortic pressures with dicrotic notch (incisura).
    - Calculated hemodynamic telemetry: Cardiac Output ($CO = HR \times SV$), Stroke Volume ($SV = EDV - ESV$), Ejection Fraction ($EF$), and Mean Arterial Pressure ($MAP$).
  - **Interactive Stethoscope Auscultation & Heart Sounds**:
    - Anterior chest wall auscultation landmarks (Aortic, Pulmonic, Tricuspid, Mitral).
    - Synthesized Web Audio heart sounds (S1 "Lub" and S2 "Dub") and pathological murmurs.
  - **Clinical Pathology & Diagnostics Sandbox**:
    - Presets for Normal Sinus Rhythm, Exercise Tachycardia, Aortic Valve Stenosis, Mitral Regurgitation, Systolic Heart Failure (HFrEF), and Complete AV Block.
    - Diagnostic challenge quiz and full gamification integration with `useLab()`.

- **Universal STEM Landing Page Architecture & Design System Elevation (`components/STEMExperimentLanding.tsx`, Chemistry, Biology, Mathematics)**:
  - **Unified Multi-Discipline Landing Template (`components/STEMExperimentLanding.tsx`)**:
    - Standardized all 36 STEM experiment landing pages across Chemistry, Biology, and Mathematics to match the premium Physics design standard.
    - Discipline-specific dynamic CSS variable color themes:
      - **Chemistry**: Emerald (`#059669`), Teal (`#0d9488`), Amber (`#d97706`)
      - **Biology**: Ruby Rose (`#e11d48`), Purple (`#9333ea`), Amber (`#f59e0b`)
      - **Mathematics**: Amber (`#d97706`), Indigo (`#4f46e5`), Sky (`#0284c7`)
    - Interactive hero cards with breadcrumbs, gradient typography, kicker pill tags, dual CTAs, Fast Facts telemetry bars, Theory & Background (01), Experiment Execution & Mathematical Foundations (02), and single-open FAQ accordions (03).
    - Structured Schema.org JSON-LD data (`LearningResource`, `FAQPage`, `BreadcrumbList`) across every landing page.
    - Integrated with dynamic `FormulaSection` LaTeX renderer and `EducationalGraphSection` knowledge graphs.
  - **Complete STEM Hero Asset Library (`public/images/`)**:
    - **10 Chemistry Labs**: `periodictable`, `chemicalbonds`, `electronic-configuration`, `reaction-simulation`, `water-quality`, `titration`, `flame-test`, `vsepr-geometry`, `electrochemistry`, `gas-laws`.
    - **13 Biology Labs**: `blood`, `brainNeuron`, `cell/animal`, `cell/plant`, `human`, `photosynthesis`, `monohybrid`, `dihybrid`, `transcription-translation`, `pedigree`, `enzyme-kinetics`, `cellular-respiration`, `osmosis-tonicity`.
    - **13 Mathematics Labs**: `functiongrapher`, `trigonometry`, `polynomials`, `calculus`, `linear-algebra`, `statistics`, `complex-numbers`, `set-theory`, `geometry`, `vector-algebra`, `combinatorics`, `number-theory`, `differential-equations`.

  - **Acoustic & Relativistic Wave Mechanics Engine**:
    - Real-time 2D Doppler frequency pitch calculation $f' = f_0 [c / (c \mp v_s \cos\theta)]$.
    - Frontal wavelength compression ($\lambda_f = (c - v_s)/f_0$) and trailing expansion.
    - Supersonic shock wave **Mach cone** geometry with half-angle $\sin\mu = 1/M = c/v_s$.
  - **Interactive 4-Mode Vector SVG Acoustic Workbench**:
    - *Mode 1: Wavefront Propagation* with expanding concentric wave rings and moving vehicle craft.
    - *Mode 2: Sonic Boom & Mach Cone* with high-pressure shock envelope lines ($M \ge 1.0$).
    - *Mode 3: Redshift / Blueshift* optical and relativistic Doppler shift spectrum.
    - *Mode 4: Audio Oscilloscope* with live Web Audio API tone pitch synthesizer.
  - **4 Bottom Telemetry Readout Cards**: Observed Frequency ($f'$), Mach Number ($M$), Mach Cone Angle ($\mu$), and Frequency Shift ($\Delta f / f_0$).
  - **Multi-Medium Atmosphere Selector**: Earth Air ($343\text{ m/s}$), Martian $\text{CO}_2$ Atmosphere ($240\text{ m/s}$), Freshwater ($1482\text{ m/s}$).


- **Kepler Orbit & Gravitational Mechanics Physics Simulation Studio (`app/components/physics/kepler-orbit/KeplerOrbitLab.tsx`, `engine.ts`, `types.ts`, `/labs/physics/kepler-orbit`, `/physics/kepler-orbit`)**:
  - **Analytical Celestial Mechanics Engine**:
    - High-order Newton-Raphson transcendental Kepler equation solver ($M = E - e\sin E$).
    - Exact Vis-Viva orbital speed calculation ($v = \sqrt{GM(2/r - 1/a)}$) and true anomaly tracking ($\nu$).
    - Specific mechanical orbital energy ($\mathcal{E} = -GM / 2a$) and Kepler harmonic ratio ($T^2/a^3 = 4\pi^2 / GM$).
  - **Interactive 4-Mode Vector SVG Orbital Workbench**:
    - *Mode 1: Elliptical Trajectory* with glowing central star at Focus 1, empty secondary Focus 2, major/minor axes, and perihelion/aphelion markers.
    - *Mode 2: Equal Areas Sweep* with 6 dynamically shaded geometric sector wedges demonstrating Kepler's 2nd Law ($\Delta A_1 = \Delta A_2$).
    - *Mode 3: Vector Dynamics* with live tangent velocity vector $\vec{v}(t)$ and central gravitational acceleration vector $\vec{a}(t)$.
    - *Mode 4: Harmonic Ratio Validator* displaying live $T^2 \text{ vs } a^3$ scaling curves.
  - **4 Bottom Telemetry Readout Cards**: Orbital Period ($T$), Orbital Speed ($v$), Specific Energy ($\mathcal{E}$), and Kepler Ratio ($T^2/a^3$).
  - **Presets & CSV Logger**: Instant configurations for Earth-Sun, Halley's Extreme Comet, and Mercury Precession, with CSV snapshot export.


- **Global Lab Inventory & Navigation Synchronization**:
  - Updated all platform-wide lab counts, hero banners, navbar navigations, and curriculum track headers to reflect the accurate total of **94 interactive labs** (CS: 42, Physics: 14, Math: 13, Biology: 13, Chemistry: 12).


- **Thermodynamic Heat Engines & Carnot Cycle Physics Simulation Studio Upgrade (`app/components/physics/thermodynamics/ThermodynamicsLab.tsx`, `engine.ts`, `types.ts`)**:
  - **4 Classic Heat Engine Cycles**:
    - *Carnot Cycle (Ideal Reversible Limit)* with isothermal expansion/compression and isentropic adiabats.
    - *Otto Cycle (4-Stroke Gasoline ICE)* with adiabatic compression, isochoric spark ignition, and exhaust blowdown.
    - *Diesel Cycle (Compression Ignition)* with isobaric fuel injection and high compression ratios ($r = 4 - 24$).
    - *Stirling Closed-Cycle Engine* with isothermal heat exchange and internal regenerator matrix.
  - **Interactive Cylinder-Piston Engine & Flywheel**:
    - Moving piston head, connecting rod, and rotating heavy flywheel with live RPM counter.
    - Gas kinetic particles inside chamber with thermal velocities scaling as $\sqrt{T}$.
    - Thermal reservoir switching at base ($T_H$ hot source flame vs $T_C$ cold sink ice crystal).
  - **Synchronized Real-Time Indicator Diagrams**:
    - Toggle between *P-V Indicator Loop ($W_{net} = \oint P\,dV$)* and *T-S Temperature-Entropy Diagram*.
    - Shaded enclosed loop area, corner state points ($1, 2, 3, 4$), and real-time state tracer dot.
  - **Right-Column Telemetry Dock & Controls**:
    - 4 live cards placed at the bottom of the right column: *Thermal Efficiency ($\eta$)*, *Carnot Limit ($\eta_{max}$)*, *Net Work Output ($W_{net}$)*, and *Heat Input ($Q_{in}$)*.
    - Full parameter controls for $T_H$, $T_C$, compression ratio $r$, working gas mixture (monatomic, diatomic, polyatomic), and RPM.


- **Electromagnetic Induction & Faraday's Law Physics Simulation Studio Upgrade (`app/components/physics/faradays-law/FaradaysLawLab.tsx`, `InductionCanvas.tsx`, `ControlPanel.tsx`, `OscilloscopePanel.tsx`, `TheoryPanel.tsx`, `DataTable.tsx`, `engine.ts`, `types.ts`)**:
  - **4 Dedicated Simulation Modes**:
    - *Mode 1: Solenoid & Bar Magnet Plunger* with manual drag, harmonic plunger oscillator ($f = 0.2 - 4\text{ Hz}$), magnetic field streamlines, permeable cores (Air, Ferrite, Soft Iron), Lenz's Law opposing field vector ($\mathbf{B}_{ind}$), and load devices (Incandescent bulb, Galvanometer, Buzzer).
    - *Mode 2: AC Dynamo & DC Generator* with turbine rotor, adjustable RPM ($0 - 3000\text{ RPM}$), slip rings vs split-ring commutator (sinusoidal vs full-wave rectified DC), and peak/RMS telemetry.
    - *Mode 3: Mutual Induction & Iron-Core Transformer* with primary ($N_p$) and secondary ($N_s$) windings on a laminated ferromagnetic core, voltage transformation ($\frac{V_s}{V_p} = \frac{N_s}{N_p}$), core coupling factor $k$, and efficiency metrics.
    - *Mode 4: Lenz's Law Eddy Current Tube Drop* comparing Neodymium magnet vs Brass slug in Copper, Aluminum, and Acrylic tubes with live eddy current magnetic braking force and terminal velocity.
  - **Multi-Channel Virtual Oscilloscope**: Live plotting of Induced EMF $\mathcal{E}(t)$, Magnetic Flux $\Phi_B(t)$, and Current $I(t)$ with voltage/time scaling, pause/freeze triggers, and RMS readouts.
  - **Web Audio Hum Synthesizer**: Interactive inductive acoustic hum whose frequency and volume scale dynamically with rotational speed, AC frequency, and induced EMF.
  - **Comprehensive Theory Matrix & Data Logger**: Maxwell-Faraday differential equation, Lenz's conservation rule, transformer ratio derivations, experiment trial recorder, and CSV export.
  - **Full 9-Step Integration**: Connected to `useLab()` XP gamification, `<DailyChallengeCard />`, AI Tutor page knowledge context, and curriculum tracks.


- **Uniform Motion & Multi-Body Kinematics Physics Simulation Studio Upgrade (`app/components/physics/uniformmotion/UniformMotionStudio.tsx`, `app/components/physics/UniformMotionLab.jsx`, `app/labs/physics/uniformmotionlab/page.tsx`, `app/physics/uniformmotionlab/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`, `app/physics/page.tsx`)**:
  - **1D Kinematics & Analytical Solver Engine**: Real-time integration of the Big 4 Kinematic Equations ($x(t) = x_0 + v_0 t + \frac{1}{2}at^2$, $v(t) = v_0 + at$, $v^2 = v_0^2 + 2a\Delta x$), stopping distance formulas ($d_{\text{stop}} = \frac{v_0^2}{2|a|}$), and two-body overtaking interception mathematics ($x_A(t) = x_B(t)$).
  - **Interactive Multi-Mode Kinematics Stage**:
    - *Mode 1: Single Cart Kinematics with Dynamic Vector Overlays* (Velocity vector $\vec{v}$ in emerald green, acceleration vector $\vec{a}$ in amber, and dual optical photogate flags).
    - *Mode 2: Two-Vehicle Pursuit / Overtaking Race* with simultaneous simulation of Cruiser Car A ($v_A = \text{const}$) vs Interceptor Car B ($a_B > 0$) with live gap distance indicator $\Delta x(t)$.
    - *Mode 3: 50 Hz Ticker-Tape Timer & Stroboscope* rendering physical dot spacing trails on moving paper tape.
  - **Synchronized Multi-Graph Analysis**: Real-time canvas switcher for Position-Time $x(t)$, Velocity-Time $v(t)$ (with dynamic slope $= a$ and shaded displacement area $= \Delta x$), and Acceleration-Time $a(t)$.
  - **Dual Precision Controls & 5 Guided Presets**: Initial Position $x_0$ ($-50\text{m} \dots 100\text{m}$), Initial Velocity $v_0$ ($-30\text{m/s} \dots 50\text{m/s}$), and Acceleration $a$ ($-15\text{m/s}^2 \dots 15\text{m/s}^2$) with sliders + direct numeric typing and presets (Pure Uniform Motion, Constant Acceleration Drag Launch, Emergency Braking, Police Interceptor Pursuit, and Velocity Reversal at Apex).
  - **Left-Bottom Docked Metrics Grid**: All live kinematics metrics (Position $x(t)$, Velocity $v(t)$, Acceleration $a$, and Displacement $\Delta x$) docked at the left column beneath the motion canvas and synchronized graph.
  - **Full 9-Step Integration**: Connected to `useLab()` XP rewards, `<DailyChallengeCard />`, AI Tutor knowledge base, updated SEO landing page, and curriculum tracks.

- **Speed of Light Measurement & Time-of-Flight Physics Simulation Studio Upgrade (`app/components/physics/speedoflight/SpeedOfLightStudio.tsx`, `app/components/physics/SpeedOfLightLab.jsx`, `app/labs/physics/speedoflight/page.tsx`, `app/physics/speedoflight/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`, `app/physics/page.tsx`)**:
  - **Fizeau Toothed-Wheel Extinction & Medium Refraction Engine**: Continuous numerical solver computing light propagation time ($t = 2D/v$), toothed-wheel extinction condition ($c = 4ND\omega$), transmission intensity $I(\omega)$, and medium phase velocities ($v = c/n$) across Vacuum, Air, Water, Glass, and Diamond.
  - **Interactive Multi-Mode Optical Apparatus Canvas**: 3 distinct experimental modes:
    - *Mode 1: Historical Fizeau Toothed-Wheel (1849)* with rotating slotted gear wheel ($N$ teeth), pulsed laser emitter, distant retroreflector mirror at baseline $D$, beam splitter, and analog photodetector transmission meter.
    - *Mode 2: Modern Multi-Media Refractive Race* with 5 simultaneous optical conduits and live photon wave packets travelling at $v = c/n$.
    - *Mode 3: Michelson Interferometer* with orthogonal arms and circular interference fringes displaying the null aether drift result.
  - **Dual Precision Controls & 5 Guided Presets**: Baseline Distance $D$ ($0.001\text{km}$ to $384,400\text{km}$), Teeth Count $N$ ($100 \dots 1440$), and Rotation Speed $\omega$ ($0 \dots 100\text{ rps}$) with sliders + direct numeric typing and presets (Fizeau 1849 Suresnes-Montmartre, Foucault Rotating Mirror, Diamond Refraction Slowdown, Subsea Fiber Latency, Apollo 11 Lunar Laser Ranging).
  - **Right-Bottom Metric Cards Dock**: All live optical metrics (Speed of Light $c = 299,792\text{ km/s}$, Time of Flight $\Delta t$, Medium Speed $v$, and Ratio $v/c$) docked at the right column beneath the console deck.
  - **Full 9-Step Integration**: Connected to `useLab()` XP rewards, `<DailyChallengeCard />`, AI Tutor knowledge base, updated SEO landing page, and curriculum tracks.

- **Geometric Optics, Thin Lens & Ray Tracing Physics Simulation Studio Upgrade (`app/components/physics/opticslens/OpticsLensStudio.tsx`, `app/components/physics/OpticsLensLab.jsx`, `app/labs/physics/opticslens/page.tsx`, `app/physics/opticslens/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`, `app/physics/page.tsx`)**:
  - **Gaussian Optics & Ray Tracing Solver**: High-precision solver calculating conjugate image distance ($d_i = \frac{f \cdot d_o}{d_o - f}$), transverse magnification ($M = -\frac{d_i}{d_o}$), and optical refractive power in diopters ($P = \frac{1}{f}$).
  - **Interactive Precision Optical Bench Canvas**: Draggable illuminated object candle with live height $h_o$ and position $d_o$, symmetric biconvex / biconcave lens elements with dynamic glass gradient shaders, and real/virtual focal points ($F_1, F_2, 2F_1, 2F_2$).
  - **3 Color-Coded Principal Ray Tracers**: Real-time rendering of Parallel Ray (P-Ray, Green), Focal Ray (F-Ray, Pink), and Chief Ray (C-Ray, Cyan) passing undeviated through the optical center $(0,0)$, plus dashed virtual ray back-projections for virtual images.
  - **Live Conjugate Curve ($d_i$ vs $d_o$) Graph**: Real-time asymptotic hyperbolic plot illustrating the focal boundary ($d_o = f$), real image branch ($d_o > f$), and virtual image domain ($d_o < f$).
  - **Lensmaker's Equation & Glass Material Presets**: Live calculation of radius of curvature $R$ and optical power $P$ with Crown Glass ($n=1.523$), Flint Glass ($n=1.660$), Acrylic PMMA ($n=1.491$), Diamond ($n=2.417$), and Water ($n=1.333$).
  - **Dual Precision Controls & 5 Guided Presets**: Focal Length $|f|$ ($40\text{mm}$ to $250\text{mm}$), Object Distance $d_o$ ($20\text{mm}$ to $500\text{mm}$), and Object Height $h_o$ ($10\text{mm}$ to $80\text{mm}$) with sliders + direct numeric typing and presets (Beyond 2F Camera, At 2F Unit Inverter, Between F & 2F Projector, Magnifying Glass, Concave Eyeglasses).
  - **Right-Bottom Metric Cards Dock**: All live optical telemetry metrics (Image Distance $d_i$, Magnification $M$, Image Height $h_i$, and Power $P$) docked at the right column beneath the console deck.
  - **Full 9-Step Integration**: Connected to `useLab()` XP rewards, `<DailyChallengeCard />`, AI Tutor knowledge base, updated SEO landing page, and curriculum tracks.

- **Wave Optics, Diffraction & Young's Double-Slit Physics Simulation Studio Upgrade (`app/components/physics/waveoptics/WaveOpticsStudio.tsx`, `app/components/physics/WaveOpticsLab.jsx`, `app/labs/physics/waveoptics/page.tsx`, `app/physics/waveoptics/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`, `app/physics/page.tsx`)**:
  - **Electromagnetic Wave Propagation & Fraunhofer Diffraction Solver**: Real-time analytical calculation of double-slit interference ($I = I_0 \cos^2\alpha \cdot \text{sinc}^2\beta$), single-slit Fraunhofer diffraction ($I = I_0 \text{sinc}^2\beta$), and multi-slit diffraction grating factors ($I = I_0 \left(\frac{\sin N\gamma}{N\sin\gamma}\right)^2 \text{sinc}^2\beta$).
  - **2D Huygens Wavelet Propagator Canvas**: Animated monochromatic laser beam ($\lambda = 380\text{nm} \dots 750\text{nm}$) emitting plane waves towards aperture masks with propagating cylindrical wavelets interfering across space.
  - **Photographic Fringe Projection Screen**: Realistic optical projection screen with intensity-mapped glowing laser bands, metric millimeter ruler, and hover inspection reticle measuring local irradiance $I/I_0$ and position $y$.
  - **Fraunhofer Spectral Intensity Envelope**: Continuous oscilloscope-style intensity distribution graph displaying the high-frequency interference oscillations modulated by the dashed single-slit diffraction envelope.
  - **Multi-Spectral Laser Tuning & Standard Sources**: Continuous wavelength sweep ($380\text{nm}$ to $750\text{nm}$) with physical sRGB spectral rendering, plus quick-select laser sources (Violet Diode $405\text{nm}$, Argon Ion $488\text{nm}$, DPSS Green $532\text{nm}$, He-Ne Red $632.8\text{nm}$, Ruby $694.3\text{nm}$).
  - **Dual Precision Controls & 5 Guided Presets**: Slit Width $a$ ($5\mu\text{m}$ to $200\mu\text{m}$), Slit Spacing $d$ ($20\mu\text{m}$ to $800\mu\text{m}$), Slit Count $N$ ($1 \dots 20$), and Screen Distance $D$ ($0.5\text{m}$ to $4.0\text{m}$) with sliders + direct numeric typing and presets (Young's Classic, Fraunhofer Single Slit, Grating Spectroscopy, Missing Orders $d=4a$, Wavelength Dispersion).
  - **Right-Bottom Metric Cards Dock**: All live optical metrics (Fringe Spacing $\beta = \frac{\lambda D}{d}$, Central Maxima $W_0$, Angular Separation $\theta_1$, Resolving Power $R$) docked at the right column beneath the console deck.
  - **Full 9-Step Integration**: Connected to `useLab()` XP rewards, `<DailyChallengeCard />`, AI Tutor knowledge base, updated SEO landing page, and curriculum tracks.

- **Conservation of Mechanical Energy & Roller Coaster Dynamics Physics Simulation Studio Upgrade (`app/components/physics/energyconservation/EnergyConservationStudio.tsx`, `app/components/physics/EnergyConservationLab.jsx`, `app/labs/physics/energyconservation/page.tsx`, `app/physics/energyconservation/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`, `app/physics/page.tsx`)**:
  - **Mechanical Energy Conservation Solver**: Continuous numerical simulation of gravitational potential energy ($E_p = mgy$), translational kinetic energy ($E_k = \frac{1}{2}mv^2$), and friction thermal dissipation ($E_{\text{th}} = \int \mu_k mg\cos\theta \, ds$) maintaining exact conservation $E_{\text{total}} = \text{const}$.
  - **Interactive Roller Coaster Canvas & Spline Modes**: 4 track geometries (Loop-the-Loop Challenge, Double Valley, Single Slope, and Custom Multi-Node Spline) with dynamic track ties and support pillars.
  - **Loop-the-Loop Critical Apex Dynamics**: Evaluates apex velocity condition $v_{\text{apex}} \ge \sqrt{gR}$ and critical drop height $h_{\text{min}} = 2.5R$ with cart detachment physics when normal force $F_N < 0$.
  - **Floating Energy Pie Chart & Real-Time Vectors**: Live pie chart hovering over the cart breaking down $E_k, E_p, E_{\text{th}}$, along with velocity vector $\vec{v}$ and normal force $\vec{F}_N$.
  - **Continuous Energy Balance Bar**: Continuous split horizontal energy bar graph displaying real-time potential, kinetic, and thermal energy proportions.
  - **Right-Bottom Metric Cards Dock**: All live telemetry metrics (Total Energy $E_{\text{total}}$, Speed $v$, Altitude $y$, G-Force $F_N$) docked at the right column beneath the console deck.
  - **Dual Precision Controls & 5 Guided Presets**: Cart Mass $m$ ($10\text{kg}$ to $2000\text{kg}$), Friction $\mu_k$, and Planetary Gravity (Earth, Moon, Mars, Jupiter, Zero-G) with sliders + direct numeric typing and presets (Critical Loop Apex, Frictionless Hill Interchange, Thermal Friction Dissipation, Lunar Coaster, Apex Weightlessness).
  - **Full 9-Step Integration**: Connected to `useLab()` XP rewards, `<DailyChallengeCard />`, AI Tutor knowledge base, updated SEO landing page, and curriculum tracks.

- **RC Circuits & Transient Response Physics Simulation Studio Upgrade (`app/components/physics/rc/RCStudio.tsx`, `app/components/physics/RCLab.jsx`, `app/labs/physics/rclab/page.tsx`, `app/physics/rclab/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`, `app/physics/page.tsx`)**:
  - **Circuit Physics & Differential Solver**: Continuous differential integration of capacitor charging ($V_c(t) = V_s(1 - e^{-t/\tau})$) and exponential discharge decay ($V_c(t) = V_0 e^{-t/\tau}$) with time constant $\tau = RC$, current $I(t)$, and stored electrostatic energy $U_c = \frac{1}{2}CV_c^2$.
  - **Interactive Animated Schematic**: Live moving electron charge drift dots whose drift velocity scales in real time with current $I(t)$, interactive 3-way SPDT switch (Charge / Discharge / Open), dielectric plate charge accumulation ($+Q/-Q$), and dynamic resistor color codes.
  - **Dual-Channel Oscilloscope & Multi-Waveform Suite**: Real-time virtual digital oscilloscope display plotting Channel 1 ($V_c$), Channel 2 ($V_R$), Source Voltage ($V_{in}$), current waveform $I(t)$, and electrostatic energy storage curve.
  - **Signal Modes**: DC Step Switch, Continuous Square Wave Pulse Generator, and AC Sine Wave Low-Pass Filter mode with cutoff frequency $f_c = \frac{1}{2\pi RC}$.
  - **Right-Bottom Metric Cards Dock**: All live circuit metrics (Time Constant $\tau = RC$, Capacitor Voltage $V_c$, Current $I$, Stored Energy $U_c$) docked at the right column beneath the console deck.
  - **Dual Precision Controls & 5 Guided Presets**: Resistance $R$ ($10\,\Omega$ to $100\,\text{k}\Omega$), Capacitance $C$ ($1\,\mu\text{F}$ to $1000\,\mu\text{F}$), and Supply Voltage $V_s$ ($1\text{V}$ to $24\text{V}$) with sliders + direct numeric typing and presets (63.2% Rule, 36.8% Decay, Square Wave Integrator, Low-Pass Cutoff, Fast Micro-Transient).
  - **Full 9-Step Integration**: Connected to `useLab()` XP rewards, `<DailyChallengeCard />`, AI Tutor knowledge base, updated SEO landing page, and curriculum tracks.

- **Hooke's Law, Springs & Coupled Oscillations Physics Simulation Studio Upgrade (`app/components/physics/hookelaw/HookeLawStudio.tsx`, `app/components/physics/HookeLaw.jsx`, `app/labs/physics/hookelaw/page.tsx`, `app/physics/hookelaw/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`, `app/physics/page.tsx`)**:
  - **Multi-Spring Configurations**: Full support for Single Spring ($k_{\text{eff}} = k_1$), Parallel Springs ($k_{\text{eff}} = k_1 + k_2$), and Series Springs ($\frac{1}{k_{\text{eff}}} = \frac{1}{k_1} + \frac{1}{k_2}$).
  - **Coiled Vector Spring Canvas**: Physical spring geometry dynamically computed from instantaneous stretch, draggable suspended load, movable measuring millimeter ruler, and zero-equilibrium / unstretched reference markers.
  - **Mystery Mass Calibration**: Weigh unknown calibrated masses ($M_1, M_2, M_3$) by measuring static displacement at equilibrium ($\Delta x_{\text{eq}} = \frac{mg}{k_{\text{eff}}}$).
  - **Force-Displacement & Telemetry Suite**: $F$ vs $\Delta x$ curve with linear regression slope indicating spring stiffness $k$ and triangular work area ($U_e = \frac{1}{2}k x^2$), position wave $x(t)$, and live Energy Conservation breakdown ($U_e, E_k, U_g, E_{\text{total}}$).
  - **Right-Bottom Metric Cards Dock**: All live kinematics metrics (Displacement $\Delta x$, Restoring Force $F_s$, Effective Stiffness $k_{\text{eff}}$, and Frequency $f$) docked at the right column beneath the console deck.
  - **Planetary Gravities & Dual Controls**: Earth ($9.81\text{ m/s}^2$), Moon ($1.62\text{ m/s}^2$), Mars ($3.72\text{ m/s}^2$), Jupiter ($24.79\text{ m/s}^2$), and Zero-G Space Station ($0\text{ m/s}^2$) with sliders + direct numeric typing and 5 Guided Presets.
  - **Full 9-Step Integration**: Connected to `useLab()` XP rewards, `<DailyChallengeCard />`, AI Tutor knowledge base, updated SEO landing page, and curriculum tracks.

- **Simple Pendulum & Harmonic Motion Physics Simulation Studio Upgrade (`app/components/physics/pendulum/PendulumStudio.tsx`, `app/components/physics/SimplePendulum.jsx`, `app/labs/physics/simplependulum/page.tsx`, `app/physics/simplependulum/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`, `app/physics/page.tsx`)**:
  - **Non-Linear Runge-Kutta (RK4) Numerical Solver**: Exact differential solver integrating $\frac{d^2\theta}{dt^2} = -\frac{g}{L}\sin\theta - \gamma \frac{d\theta}{dt}$, providing high-precision comparison between small-angle SHM ($T_0 = 2\pi\sqrt{L/g}$) and exact Borda large-angle period expansion ($T \approx T_0(1 + \frac{1}{4}\sin^2\frac{\theta_0}{2} + \frac{9}{64}\sin^4\frac{\theta_0}{2})$).
  - **Interactive Canvas Stage**: Draggable pendulum bob with rotary protractor dial ($-170^\circ$ to $+170^\circ$), force vector overlays (Tension $\vec{T}$, Gravity $m\vec{g}$, and Restoring Force $\vec{F}_{net} = -mg\sin\theta$), and equilibrium photogate laser sensor with automatic period detector.
  - **Phase-Space Portrait & Multi-Graphing Suite**: Real-time phase portraits ($\omega = \dot{\theta}$ vs $\theta$) illustrating energy limit cycles and damping spirals, angular wave timeseries $\theta(t)$, and continuous Potential vs Kinetic energy balance tracking ($E_p$ vs $E_k$).
  - **Manual Numeric Inputs & Planetary Gravity**: Sliders and direct typing numeric boxes for String Length ($0.1\text{m}$ to $5.0\text{m}$), Bob Mass ($0.1\text{kg}$ to $10\text{kg}$), Release Angle ($-170^\circ$ to $+170^\circ$), and Damping Friction ($\gamma$) across Earth, Moon, Mars, Jupiter, and Vacuum.
  - **5 Guided Discovery Presets**: Small-Angle Harmonic Parity, Large-Angle Nonlinearity ($90^\circ$), Apollo Lunar Slow-Motion, Damped Decay Spiral, and Galileo's Mass Independence Theorem.
  - **Full 9-Step Integration**: Connected to `useLab()` XP reward triggers, `<DailyChallengeCard />`, AI Tutor knowledge base, updated SEO landing page, and curriculum tracks.

- **Dynamic Island Morphing Feedback Badge (`app/components/FloatingLabFeedback.tsx`)**:
  - **Apple Dynamic Island Pill Morph**: Upgraded floating action button with Framer Motion `layout` spring physics (`stiffness: 450, damping: 28, mass: 0.8`), seamlessly expanding from a compact $40\text{px}$ circular icon into a full feedback pill on hover and keyboard focus.
  - **Staggered Text & Shortcut Reveal**: Unclips label text and a styled keyboard shortcut badge `<kbd>F</kbd>`.
  - **Global Keyboard Shortcut**: Pressing <kbd>F</kbd> anywhere on a lab page toggles the feedback modal immediately.
  - **Removed All Artificial Glow Halos & Pings**: Built with crisp semantic borders, backdrop blur glassmorphism, and clean tactile micro-animations.

- **Projectile Motion & Ballistics Physics Simulation Studio Upgrade (`app/components/physics/projectilemotion/ProjectileMotionStudio.tsx`, `app/labs/physics/projectilemotion/page.tsx`, `app/physics/projectilemotion/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`)**:
  - **Comprehensive 2D Kinematics & Aerodynamic Ballistics Solver**: Numerical Runge-Kutta 2D integrator computing horizontal and vertical displacement, quadratic air resistance ($F_d = \frac{1}{2} \rho C_d A v^2$), crosswind/headwind forces ($w_x$), and theoretical vacuum parity checks.
  - **Rotary Cannon & Launch Elevation Cliff**: Adjustable aiming angle dial ($0^\circ$ to $90^\circ$), velocity slider ($5\text{ m/s}$ to $100\text{ m/s}$), and launch platform elevation cliff ($0\text{ m}$ to $100\text{ m}$).
  - **Multi-Trajectory Tracer & History Archive**: Compare multiple consecutive arcs on a single canvas, enabling visual proofs of complementary angle pairs ($30^\circ$ vs $60^\circ$) having identical range in vacuum.
  - **Interactive Target Range & Challenges**: Draggable bullseye landing target, real-time strike detection, hit accuracy tracking, and score counter.
  - **Planetary Gravitation Environments**: Earth ($9.81\text{ m/s}^2$), Vacuum ($9.81\text{ m/s}^2$), Moon ($1.62\text{ m/s}^2$), Mars ($3.72\text{ m/s}^2$), and Jupiter ($24.79\text{ m/s}^2$).
  - **5 Guided Historical Discovery Presets**: Maximum Range at $45^\circ$, Complementary Launch Angles Equivalence, Elevated Cliff Toss, Atmospheric Drag Tear-Drop Trajectory, and Apollo Lunar Super Range.
  - **Full 9-Step Integration**: Connected to `useLab()` XP reward triggers, `<DailyChallengeCard />`, AI Tutor knowledge base, updated SEO landing page, and curriculum tracks.

- **Free Fall & Terminal Velocity Physics Simulation Studio Upgrade (`app/components/physics/freefall/FreeFallStudio.tsx`, `app/labs/physics/freefall/page.tsx`, `app/physics/freefall/page.tsx`, `app/lib/pageKnowledge.ts`, `app/lib/labs.ts`, `app/lib/tracks.ts`)**:
  - **Comprehensive Kinematics & Aerodynamic Solver**: Built high-precision Runge-Kutta numerical solver supporting pure vacuum Galilean motion ($a = -g$) and quadratic fluid drag ($F_d = \frac{1}{2} \rho C_d A v^2$) with automatic terminal velocity asymptotes ($v_t = \sqrt{2mg / (\rho C_d A)}$) and ground restitution elasticity.
  - **Planetary Gravity & Atmosphere Environments**: Selectable surface environments across Earth ($9.81\text{ m/s}^2, 1.225\text{ kg/m}^3$), Vacuum Chamber ($9.81\text{ m/s}^2, 0\text{ kg/m}^3$), Moon Apollo 15 ($1.62\text{ m/s}^2$), Mars ($3.72\text{ m/s}^2$), Jupiter ($24.79\text{ m/s}^2$), and Custom Worlds.
  - **Dual Drop Comparison Chamber**: Recreate Galileo's Leaning Tower of Pisa and Commander David Scott's Apollo 15 Lunar drop by dropping two distinct bodies (e.g. Falcon Feather vs Bowling Ball) simultaneously to witness drag vs vacuum dynamics.
  - **Object Presets & Vector Overlays**: Bowling Ball, Falcon Feather, Tennis Ball, Skydiver (Belly), Steel Bearing, and Custom Objects with real-time velocity ($\vec{v}$), gravity ($\vec{g}$), and drag ($\vec{F}_d$) vector arrows.
  - **Stroboscopic Ghost Flash Trail**: Captures multi-exposure ghost frames at equal time intervals ($\Delta t$) visually illustrating quadratic distance spacing ($\Delta y \propto t^2$) in vacuum vs linear spacing at terminal velocity.
  - **Real-Time Telemetry & Multi-Graphing Suite**: Interactive timeseries plotting for Height $y(t)$, Velocity $v(t)$, Acceleration $a(t)$, and Mechanical Energy Conservation (Potential, Kinetic, Total Energy, and Drag Dissipation) with one-click CSV export.
  - **5 Guided Historical Discovery Presets**: Galileo's Pisa Experiment, Apollo 15 Lunar Drop, Skydiver Terminal Velocity, Vertical Projectile Toss & Apex, and Superball Restitution.
  - **Full 9-Step Integration**: Connected to `useLab()` XP reward triggers, `<NextLabModal />`, `<DailyChallengeCard />`, AI Tutor knowledge base, and updated SEO landing page.

- **Error Triage Verification & System Bugfixes (`app/components/OpenLabsTracker.tsx`, `app/models/Feedback.js`, `app/biology/genetics/page.tsx`, `app/api/leaderboard/me/route.ts`, `public/images/avatars/*`)**:
  - **Fixed Missing Chemistry Route**: Added default redirection on `/labs/chemistry/electronic-configuration` $\to$ `/labs/chemistry/electronic-configuration/1` (Hydrogen).
  - **Fixed Broken Genetics Route**: Updated genetics card link `/biology/genetics/dna-transcription` to `/biology/genetics/transcription-translation` and added route redirect.
  - **Fixed Avatar 404s**: Created backwards-compatible aliases for `avatar1.png` – `avatar12.png` matching `avatar-01.png` – `avatar-12.png`.
  - **Fixed Feedback API 500 Error**: Added `"helpful"` and `"general"` to the Mongoose `category` enum in `Feedback.js` so user chip selections submit without schema validation errors.
  - **Fixed Leaderboard 404 False Alarm**: `/api/leaderboard/me` now returns 200 `{ notRanked: true }` when a user has not set a username rather than throwing an HTTP 404 client error.
  - **Refined Error Telemetry Filters (`OpenLabsTracker.tsx`)**: Filtered out benign browser layout notifications (`ResizeObserver loop`), third-party adblocker blocks (`clarity.ms`, `googletagmanager`, `google-analytics`), DOM mutations by translation extensions (`removeChild`), and standard unauthenticated guest status checks (`/api/auth/me` 401/403).

- **Error Diagnostics Export & AI Fix Triage Engine (`app/admin/analytics/page.tsx`, `app/api/admin/analytics/errors/route.ts`)**:
  - **One-Click "Copy AI Fix Prompt" on Error Cards**: Added direct prompt generator to each tracked error card. Formats an actionable markdown prompt including affected route, error type, occurrences, environment (browser/OS/device), digest code, full client/server stack trace, and concrete step-by-step instructions for AI agents (Antigravity, Cursor, Claude Code) to pinpoint and fix the bug immediately.
  - **Copy All AI Fix Prompts**: Added master batch button to copy all currently filtered errors in a single consolidated report to clipboard.
  - **Multi-Format Error Exporter**:
    - 🤖 **AI Debug Report (`.md`)**: Formatted Markdown document summarizing active issues with diagnostic prompts and reproduction context.
    - 📦 **Raw JSON Export (`.json`)**: Complete raw telemetry dataset.
    - 📊 **Spreadsheet Table (`.csv`)**: Excel and Google Sheets ready export.
  - **Real-Time Error Filtering & Search**: Filter by status (`All`, `Active`, `New`, `Investigating`, `Resolved`, `Ignored`), by error type (`404 Not Found`, `Runtime Exception`, `React Boundary`, `Server 5xx`, `Client 4xx`, `API`, `Hydration`, `Console`, `Unhandled Promise`, `Network`, `Resource`, `WebGL`), and instant search across error messages, route paths, stack traces, and digests.
  - **Bulk Triage & Purge API (`app/api/admin/analytics/errors/route.ts`)**: Supports bulk status transitions (`Mark Filtered as Resolved`, `Mark Filtered as Investigating`) and admin purge actions (`Purge Resolved`, `Purge All`).

- **Universal Mobile Responsiveness & Automatic Subdomain Redirection Across All Admin Pages (`middleware.ts`, `app/lib/adminUrl.ts`, `app/components/AdminNavbar.tsx`, `app/admin/*`)**:
  - **Automatic Subdomain Redirection (`middleware.ts`)**: Accessing any `/admin` or `/admin/*` sub-route on the main domain (e.g. `openlabs.org.in/admin/users`, `localhost:3000/admin/analytics`) automatically redirects the user to the dedicated admin subdomain with clean URLs (e.g. `admin.openlabs.org.in/users`, `admin.localhost:3000/analytics`), preserving query parameters.
  - **Subdomain Path Normalizer**: If `/admin/*` prefix is accessed while already on the subdomain (e.g. `admin.openlabs.org.in/admin/blogs`), it cleanly normalizes to `admin.openlabs.org.in/blogs`.
  - **Universal Admin URL Helper (`app/lib/adminUrl.ts`)**: Implemented `getAdminHref(path)` and `getMainSiteHref(path)` enabling all internal and external links in the Admin Portal to resolve cleanly on both root path (`openlabs.org.in/admin/...`) and dedicated subdomain (`admin.openlabs.org.in/...`) setups.
  - **External Student/Public Route Safeguards**: External links to student profiles (`/profile/[username]`), interactive labs (`/labs/[labId]`), published articles (`/blog/[slug]`), and live platform buttons now route directly to the main platform domain rather than dead-ending on the admin subdomain.
  - **Mobile & Tablet Responsive Grid Upgrades**: Fully optimized all admin surfaces (`/admin`, `/admin/analytics`, `/admin/users`, `/admin/blogs`, `/admin/feedback`, `/admin/contacts`, `/admin/seo-dashboard`) for mobile viewports (360px–480px) with responsive card grids, touch-friendly tap targets, and smooth scrollable table/tab containers.
  - **Admin Users Table Ergonomics**: Enabled row-click navigation to the user telemetry drawer, outside click dismissal, `Escape` key close shortcut, and removed obsolete action columns.

- **Admin Users Joined Date & Exact Time Display (`app/admin/users/page.tsx`)**:
  - **Joined Date & Time Table Cell**: Formatted the Joined Date column to display exact local time (`hh:mm:ss a`) with clock icon alongside the formatted date (`MMM D, YYYY`).
  - **User Detail Drawer Telemetry**: Updated user profile drawer header to display both exact join date and time timestamp.

- **Custom Date Range Filter & Day-by-Day Navigator in Analytics (`app/admin/analytics/page.tsx`, `app/lib/analyticsDb.ts`, `app/api/admin/analytics/route.ts`, `app/api/admin/analytics/pageviews/route.ts`)**:
  - **Unified `<DateRangeNavigator />` Component**: Integrated into both the **Top Executive Dashboard Header** and the **Live Feed Pageviews Filter Bar**.
  - **Day-by-Day Stepper Navigation**: Added `<` (Previous Day) and `>` (Next Day) navigation buttons to inspect analytics day-by-day with dynamic labels (`Today`, `Yesterday`, `Aug 22, 2026`, etc.) and future-date guards.
  - **Arbitrary Custom Date Range Picker**: Added date range popover allowing administrators to select exact `From:` and `To:` calendar dates to inspect any historical timeframe.
  - **Quick Presets**: Reorganized one-click presets (`Today`, `Yesterday`, `7 Days`, `30 Days`, `All Time`).
  - **Backend Date Engine (`parseDateFilter`)**: Supports single-day hourly views (`date:YYYY-MM-DD`), custom ranges (`custom:YYYY-MM-DD_YYYY-MM-DD` or `startDate`/`endDate`), and presets across both aggregate statistics and paginated pageviews.

- **Comprehensive 360-Degree Error Telemetry & Diagnostics (`app/components/OpenLabsTracker.tsx`, `app/lib/tracker.ts`, `app/models/ErrorLog.js`, `app/not-found.tsx`, `app/global-error.tsx`, `app/admin/analytics/page.tsx`)**:
  - **400-Series Client & API Errors (`http_4xx`)**: Automatically intercepts and tracks HTTP 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 API Not Found, 422 Unprocessable Entity, and 429 Rate Limit Exceeded on `/api/*` endpoints with HTTP status codes and route URLs.
  - **500-Series Server Faults (`http_5xx`)**: Intercepts HTTP 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, and 504 Gateway Timeout on all API requests.
  - **404 Broken Page Route Tracking (`not_found`)**: Automated telemetry in `app/not-found.tsx` reporting every missing or broken page route visited along with referrer data.
  - **Resource Load Failure Interception (`resource`)**: Capture-phase listener intercepting broken/missing asset loading failures on `<img>`, `<script>`, `<link>`, `<audio>`, and `<video>` tags with asset URL and DOM element tag metadata.
  - **WebGL / 3D Canvas Context Loss (`webgl`)**: Global `webglcontextlost` event capturing for 3D physics, chemistry molecular models, and periodic table GPU crashes.
  - **Hydration & Critical Console Error Capture (`hydration` & `console`)**: Intercepts React hydration mismatches and unhandled errors logged to console with rate-limited deduplication.
  - **Root Layout Boundary Integration (`boundary`)**: Connected `app/global-error.tsx` root layout error boundary to automated MongoDB error telemetry via `trackError()`.
  - **Admin Diagnostic Visuals**: Added distinct badge styling and color coding for each error category (404, 4xx, 5xx, WebGL, Hydration, Resources, etc.) in the Admin Analytics Diagnostic panel.

- **Two-Phase Adaptive Feedback Flow (`app/components/FloatingLabFeedback.tsx`)**:
  - **Initial Pulse Prompt**: Displays a clean, compact *"Was this lab helpful?"* prompt (`👍 Yes, Helpful` vs `👎 Not Helpful`) with a manual expansion toggle.
  - **Helpful Flow (Mandatory 1–5 Star Rating)**: Clicking *"Yes, Helpful"* transitions to the rating screen where selecting at least 1 star is mandatory to submit (`selectedRating >= 1`).
  - **Not Helpful Flow (Optional Details & Skip)**: Clicking *"Not Helpful"* automatically logs the initial response in the background and opens optional category chips (`🐛 Found a Bug`, `😕 Confusing`, `⚡ Too Slow`, `💡 Suggestion`) and comments, with a frictionless *"Skip & Exit"* button to leave anytime without mandatory input.

- **Strict Lab Exit Trigger Refinement (`app/components/FloatingLabFeedback.tsx`)**:
  - **Eliminated In-Experiment Triggers**: Completely removed `mouseleave` cursor tracking so the feedback modal never pops up while the student is actively interacting with the simulation or moving the cursor across canvas tools/controls.
  - **Exclusive Departure Navigation Intercept**: The feedback modal now triggers *strictly and exclusively* when the student clicks to leave the simulation page (`/labs/...` ➔ Navbar, Subject Hub, Home, Profile, Tracks, or external routes).
  - **Voluntary Access Retained**: The discrete bottom-left floating feedback trigger pill remains available for voluntary feedback submissions anytime.

- **Chemistry Hub Routing & Simulation Scope Optimization (`app/chemistry/page.tsx`, `app/lib/labs.ts`, `app/components/FloatingLabFeedback.tsx`)**:
  - **Fixed 404 Route Links in Chemistry Hub (`app/chemistry/page.tsx`)**: Replaced deprecated/unmapped paths with active interactive chemistry simulations:
    - `/chemistry/salt-analysis` ➔ `/chemistry/flame-test` (*Flame Test & Atomic Emission Spectrometry*).
    - `/chemistry/redox` ➔ `/chemistry/electrochemistry` (*Electrochemistry & Galvanic Cells*).
    - `/chemistry/organic-reactions` ➔ `/chemistry/vsepr-geometry` (*3D Molecular Geometry & VSEPR Studio*).
  - **Strict Simulation Route Scoping for Feedback Modal (`FloatingLabFeedback.tsx`, `labs.ts`)**:
    - Restricted the exit-intent feedback triggers and docked pill strictly to interactive simulations (`/labs/...`).
    - Fixed `resolveLabIdFromPath()` in `app/lib/labs.ts` to prevent general subject landing pages (like `/chemistry` or `/physics`) from falsely matching simulation IDs.
    - Removed extraneous history state modifications to avoid triggering false popups upon initial page visits.

- **Lab Exit-Intent & Page Transition Feedback Mechanism (`app/components/FloatingLabFeedback.tsx`, `app/hooks/useFeedback.ts`)**:
  - **Automated Exit-Intent Feedback Modal**: Automatically prompts students when they attempt to exit or navigate away from an interactive simulation lab (`/labs/...`):
    - **Desktop Mouse Exit-Intent**: Detects cursor movement toward top browser tab / address bar (`clientY <= 15`).
    - **Navigation Intercept Protocol**: Intercepts internal links pointing away from the lab (e.g. Navbar, Breadcrumbs, Subject hubs) to prompt for a quick rating before smoothly redirecting to the intended destination.
    - **Smart Engagement Gate**: Enforces a minimum 8-second engagement threshold to prevent prompt fatigue on accidental bounces, respects 24-hour rate limits, and honors session-level dismissals.
  - **High-Conversion 1-Click Interactive Feedback Modal**:
    - Interactive 5-star rating with real-time emoji descriptors (`1: Needs Work` to `5: Masterpiece!`).
    - Instant category reaction chips (`❤️ Loved It!`, `✨ Super Clear`, `💡 Suggestion`, `😕 Confusing`, `🐛 Found a Bug`).
    - Background submission with celebratory thank-you screen and **+10 Contributor XP** gamification reward.
    - Preserved discrete bottom-left floating feedback trigger pill for manual submissions anytime.

- **OAuth Referrer Sanitization & Anonymous Session Tracking Engine (`app/components/OpenLabsTracker.tsx`, `app/api/analytics/collect/route.ts`, `app/lib/analyticsDb.ts`, `app/api/admin/analytics/pageviews/route.ts`, `app/admin/analytics/page.tsx`)**:
  - **Fixed OAuth Google/Apple Authentication Referrer Pollution**:
    - Eliminated `accounts.google.com`, `appleid.apple.com`, and internal subdomains from corrupting Top Referring Domains and traffic attribution.
    - Added client-side `sessionStorage` acquisition referrer preservation in `OpenLabsTracker.tsx` so external traffic sources (e.g., Google Search, Twitter, Reddit) are retained even after users complete Google OAuth sign-in redirects.
    - Updated backend ingestion (`/api/analytics/collect`) and aggregation pipelines (`analyticsDb.ts`) to normalize OAuth redirect domains to `"Direct"` and filter them from acquisition tables.
  - **Anonymous / Unknown Session Tracking & Filtering**:
    - Added dedicated **User Type Filter** (`[All Visitors | Guests / Anonymous Only | Logged-In Users Only]`) to the Analytics Event Stream and PageViews API.
    - Enhanced table UI with visual **Guest / Anonymous Learner** badges, separate copyable `vid:` (Visitor ID) and `sid:` (Session ID) hashes.
    - Added real-time breakdown of **Guest vs Logged-In Sessions** in top KPI telemetry overview cards.

- **Server-Side Pagination & Live Stream Browser for Analytics (`app/admin/analytics/page.tsx`, `app/api/admin/analytics/pageviews/route.ts`)**:
  - **Full Server-Side Pagination**: Implemented complete pagination for pageview telemetry events with configurable page size (25, 50, 100, 200 items/page), numbered pagination pills, direct jump-to-page navigation, and total event counters.
  - **Dedicated Paginated PageViews API (`/api/admin/analytics/pageviews`)**: Supports text search filtering (path, title, visitor ID, email, country, referrer, device, browser), date range filters (today, 24h, 7d, 30d, all), device filters, and multi-mode sorting (newest, oldest, dwell time, scroll depth).
  - **Live Auto-Streaming Mode**: Built an automated live-stream toggle with pulsing beacon that polls every 5 seconds for incoming real-time pageviews without resetting page state or flickering.
  - **Rich Event Inspection**: Detailed event rows displaying exact millisecond timestamps, dwell time progress bars, scroll percentages, referrer/UTM attribution, device icons, browser/OS, country & city, and 1-click visitor ID copy.

- **Master Admin Portal Home Dashboard & Unauthenticated Login Gate (`app/admin/page.tsx`, `app/api/admin/summary/route.ts`, `app/components/AdminLockScreen.tsx`, `app/components/AdminNavbar.tsx`, `middleware.ts`)**:
  - **Fixed Unauthenticated Secret Key Leak/Exposure (`app/components/AdminLockScreen.tsx`)**: Unauthenticated users visiting the admin portal or admin subdomain are now presented with a clear **Staff Authentication Required** login prompt. The Admin Secret input modal is never displayed to unauthenticated visitors.
  - **Master Operations Home Dashboard (`/admin` / `app/admin/page.tsx`)**: Built an executive overview dashboard replacing the blank redirect. Displays real-time operational status across all 6 admin modules:
    1. **Top KPI Ribbon**: Total Users, 24h & All-time Pageviews, Student XP earned, Pending Feedback Issues, Unread Contact Inquiries, and Published Stories.
    2. **6 Modular Service Command Cards**: Telemetry & Top Simulations, User & Role Management, Editorial & Blog Posts, Lab Feedback & Triage, Support & Contact Inquiries, and SEO Search Graph (53/53 labs coverage).
    3. **Live Activity Feeds**: Real-time user registrations list and recent feedback/support inquiries.
  - **Unified Summary Telemetry API (`/api/admin/summary`)**: Aggregates multi-service health, metrics, and MongoDB collections in parallel.
  - **Admin Navigation (`app/components/AdminNavbar.tsx`)**: Added `Overview` tab linked to `/admin` and updated brand home target.

- **Strict Page-Context Enclosure & AI Tutor Lock (`app/api/chat/route.ts`, `app/components/OpenLabsAI.tsx`)**:
  - **Uncompromising Context Lock**: The AI Tutor is now strictly bounded to the active page/simulation context (`pageContext`). It will **under no condition** answer questions outside the current lab/page topic—even if the question is related to education, science, or programming.
  - **Refusal & Redirection Protocol**: If a student is on a Physics lab (e.g. *Ohm's Law*) and asks about an unrelated topic (e.g. *Factorial in Java* or *Photosynthesis*), the AI strictly declines and redirects them back to the active lab's formulas, controls, and concepts.
  - **Zero-Fluff & Pedagogical Clarity**: Responses jump directly into the active simulation's mechanisms, sliders, plots, and derivations without filler introductions.
  - **Multi-Turn Memory**: Preserves the last 8 conversation turns within the active lab session.

- **Guided Curriculum Tracks & Next-Lab Progression Engine (`app/lib/tracks.ts`, `app/components/CurriculumTracksExplorer.tsx`, `app/components/NextLabModal.tsx`, `app/hooks/useXP.ts`, `app/profile/ProfileViewClient.tsx`, `app/<subject>/page.tsx`)**:
  - Structured all 53 OpenLabs simulations into **13 Guided Curriculum Tracks** across Physics, Chemistry, Biology, Computer Science, and Mathematics with learning sequence steps, estimated times, difficulty tags, and track completion badges.
  - **Interactive Tracks Explorer (`<CurriculumTracksExplorer />`)**: Renders visual step-by-step node timelines (completed checkmarks, active pulsing target nodes, upcoming steps), real-time percentage progress bars, and 1-click *"Resume Track (Step X of Y) →"* direct links.
  - **Post-Lab Continuation Modal (`<NextLabModal />`)**: An automated celebratory modal that fires upon completing an experiment or daily challenge, celebrating earned XP, updating track progress, and providing a single-click bridge to the next experiment.
  - **Profile Dashboard Integration (`/profile`)**: Added dedicated **"Learning Tracks"** tab with full track catalog and embedded active track progress cards on the main Dashboard Overview.
  - **Discipline Landing Page Placements (`/physics`, `/chemistry`, `/biology`, `/computer-science`, `/mathematics`)**: Embedded each subject's guided tracks prominently above the simulation cards.

- **Comprehensive Lab Usage Guide & Knowledge Base for AI Assistant (`app/lib/pageKnowledge.ts`)**:
  - Implemented comprehensive, structured interactive lab knowledge across all **53 registered OpenLabs experiments** spanning Physics, Chemistry, Biology, Computer Science, and Mathematics.
  - Whenever a student opens the AI Assistant on any experiment or landing page and asks *"How do I use this lab?"*, the assistant now receives detailed, curated context including:
    - **Step-by-step Usage Protocols** (what sliders to drag, buttons to click, and measurement steps).
    - **Controls & Tool Breakdowns** (multimeters, oscilloscopes, burettes, 3D orbit controls, ray tracers).
    - **Governing Equations & Core Scientific Concepts** (kinematics, Ohm's law, VSEPR geometries, Michaelis-Menten kinetics, Central Dogma, Big-O complexity, calculus integration).
    - **Recommended "What to Try" Experiments** to guide open-ended student inquiry.
    - **Common Pitfalls & Mistakes to Avoid**.
  - Seamlessly resolves route paths via `resolveLabIdFromPath()` across both simulation routes (`/labs/*`) and landing routes (`/<subject>/*`).

- **Strict Role-Based Access Control (RBAC) & In-Place Soft 403 Access Denied (`middleware.ts`, `app/lib/adminAuth.ts`, `app/components/AdminAccessDenied.tsx`, `app/components/AdminLockScreen.tsx`, `app/api/admin/*`, `app/components/AdminSecretContext.tsx`)**:
  - **In-Place Soft 403 (`app/components/AdminAccessDenied.tsx`)**: When a regular user (`role: "user"`) visits any admin dashboard or subdomain, the page stays on the current URL and immediately renders a soft, elegant *"Access Restricted"* card without redirecting or flashing.
  - **Admin Navbar & Footer Suppression**: Users without `admin` or `moderator` roles never see the [`AdminNavbar`](file:///d:/openlabs/app/components/AdminNavbar.tsx) or [`AdminFooter`](file:///d:/openlabs/app/components/AdminFooter.tsx) anywhere on the subdomain or admin paths.
  - **Admin Users (`role: "admin"`)**: Granted instant full access to all admin dashboards and APIs **without being prompted for an admin secret key**, with full authority to promote/demote user roles and permanently delete accounts, publications, error logs, and contact submissions.
  - **Moderator Users (`role: "moderator"`)**: Allowed to access admin pages by **entering the Admin Secret (`ADMIN_SECRET`)**, with granular permission boundaries:
    - **User Role Mutation Lock**: Restricted to viewing roles in [`/admin/users`](file:///d:/openlabs/app/admin/users/page.tsx); only administrators can promote/demote user roles.
    - **Hard Deletion Lock**: Prevented from permanently deleting user accounts, blog publications, telemetry error logs, and contact inquiries (moderators are limited to operational status workflows such as `investigating`, `resolved`, `replied`, `archived`).
    - **Read-Only SEO Audit Clearance**: Displays read-only audit badges on [`/admin/seo-dashboard`](file:///d:/openlabs/app/admin/seo-dashboard/page.tsx).
  - Centralized RBAC + secret validation in [`verifyAdminAccess()`](file:///d:/openlabs/app/lib/adminAuth.ts) across all `/api/admin/*` endpoints (`analytics`, `users`, `blogs`, `feedback`, `contacts`).

- **Global Zero-Flash Admin Secret State Management (`app/components/AdminSecretContext.tsx`, `app/layout.tsx`, `app/admin/*`)**:
  - Implemented global [`AdminSecretProvider`](file:///d:/openlabs/app/components/AdminSecretContext.tsx) context wrapping the application root.
  - Persists and synchronizes admin clearance in React state and `localStorage` so entering the secret once unlocks all admin routes (**Analytics**, **Users**, **Blogs**, **Feedback**, **Contacts**, and **SEO Graph**) with zero flash, zero popups, and no redundant re-verifications between page navigations.
  - Automatically clears credentials and shows lock screen if and only if an API responds with `401 Unauthorized`.
  - Added instant **Lock Admin Console** action in [`AdminNavbar.tsx`](file:///d:/openlabs/app/components/AdminNavbar.tsx) to immediately revoke clearance on demand.
  - Removed duplicate in-page breadcrumbs and tab navigation bars across all admin pages in favor of the unified header.
  - Added fixed navbar layout spacer to prevent admin dashboards from sliding underneath the top navigation bar.

- **Dedicated Admin Navbar & Footer Components (`app/components/AdminNavbar.tsx`, `app/components/AdminFooter.tsx`, `app/components/Navbar.tsx`, `app/components/Footer.tsx`)**:
  - Created dedicated [`AdminNavbar.tsx`](file:///d:/openlabs/app/components/AdminNavbar.tsx) with executive OpenLabs branding, telemetry status indicator, direct navigation tabs (`Analytics`, `Users`, `Blogs`, `Feedback`, `Contacts`, `SEO Graph`), "Live Site" quick launcher, theme toggle, and an Admin profile dropdown with role badge & sign-out action.
  - Created dedicated [`AdminFooter.tsx`](file:///d:/openlabs/app/components/AdminFooter.tsx) with high-security access notices, telemetry status, and quick admin route navigation.
  - Automatically switches between student and admin navbars/footers based on `/admin` route or subdomain context.
  - Enhanced student [`Navbar.tsx`](file:///d:/openlabs/app/components/Navbar.tsx) profile avatar resolution to display user initials and fallback icons when authenticated.

- **Admin Subdomain Next.js Routing (`admin.openlabs.org.in`) & Cross-Subdomain Auth (`middleware.ts`, `app/admin/page.tsx`, `app/api/auth/*`)**:
  - Implemented Next.js App Router host-level middleware interception for `admin.openlabs.org.in` (and `admin.localhost`).
  - Automatically rewrites incoming subdomain traffic:
    - Root `admin.openlabs.org.in/` &rarr; rewrites internally to executive dashboard [`/admin/analytics`](file:///d:/openlabs/app/admin/analytics/page.tsx).
    - Subpaths (`/users`, `/blogs`, `/analytics`, `/contacts`, `/feedback`, `/seo-dashboard`) &rarr; rewrite to `/admin/*`.
    - Injects `X-Robots-Tag: noindex, nofollow, noarchive` security header across all admin routes.
  - Completely hid `/admin/*` on the main domain (`openlabs.org.in`), returning an immediate 404 Not Found response (no redirect) so the admin path is invisible to external visitors.
  - Added wildcard cross-subdomain cookie domain (`domain: ".openlabs.org.in"`) across [`login`](file:///d:/openlabs/app/api/auth/login/route.js), [`verify-otp`](file:///d:/openlabs/app/api/auth/verify-otp/route.js), [`logout`](file:///d:/openlabs/app/api/auth/logout/route.js), and [`nextauth sync`](file:///d:/openlabs/app/api/auth/nextauth/sync/route.ts) for unified single-sign-on (SSO).

- **User Schema Role Field & Database Migration (`app/models/User.js`, `app/lib/auth.js`, `app/api/admin/users`)**:
  - Added `role` field (`enum: ["user", "admin", "moderator"]`, `default: "user"`, indexed) to Mongoose [`User.js`](file:///d:/openlabs/app/models/User.js) schema.
  - Updated [`generateToken()`](file:///d:/openlabs/app/lib/auth.js) JWT signing to embed `role` directly inside authenticated session payloads.
  - Executed database migration across MongoDB collection, successfully backfilling and updating all **614 existing user accounts** with `role: "user"`.
  - Updated Admin Users API ([`/api/admin/users`](file:///d:/openlabs/app/api/admin/users/route.ts)) and dashboard ([`/admin/users`](file:///d:/openlabs/app/admin/users/page.tsx)) to project, display, and manage user roles with visual admin/moderator badges and PATCH support.

- **Full Country Name Resolution in Analytics (`app/lib/countries.ts`, `app/lib/analyticsDb.ts`, `app/admin/analytics`)**:
  - Implemented automatic ISO 3166-1 alpha-2 country code resolution (`getFullCountryName`, `getCountryFlag`) converting raw edge geo codes (e.g. `IN`, `US`, `GB`, `DE`, `CA`, `AU`, `SG`) into full, readable country names (`India`, `United States`, `United Kingdom`, `Germany`, etc.) across all telemetry data ingestion pipelines, database aggregation feeds, and the executive Admin Analytics Dashboard.
  - Normalized database country groupings to automatically consolidate legacy 2-letter codes with full names without duplication.

- **Integrated First-Party Custom Event Tracking Pipeline (`app/lib/tracker.ts`, `lib/analytics.ts`, `app/hooks/useXP.ts`, `app/hooks/useDailyChallenge.ts`, `app/components/OpenLabsAI.tsx`, `app/hooks/useFeedback.ts`)**:
  - Bridged all high-level business and learning events directly into the first-party MongoDB Analytics Engine (`AnalyticsEvent` schema) alongside Microsoft Clarity.
  - Wired live event dispatchers across key user interactions:
    - **Lab & Simulation Completions** (`lab_completed` with `labId`, `subject`, `xpEarned`, `leveledUp`).
    - **Daily Challenge Submissions & Solutions** (`challenge_completed` with `labId`, `difficulty`, `xpEarned`, `correct`).
    - **AI Chat Assistant Queries** (`ai_query_asked` with `subject`, `labId`, `queryLength`).
    - **Lab Feedback & Rating Submissions** (`feedback_submitted` with `labId`, `rating`, `category`).
    - **Code Lab Project Actions** (`project_created`, `project_deleted`, `workspace_created`).
    - **Authentication & Onboarding Milestones** (`signup_started`, `signup_completed`, `login_completed`, `logout_completed`, `onboarding_completed`).

- **Disabled Analytics & Error Telemetry in Admin Panel and Local Environments (`yarn dev`, `yarn start`, `localhost`, `admin.*`, `/admin/*`)**:
  - Created centralized [`AppAnalytics.tsx`](file:///d:/openlabs/app/components/AppAnalytics.tsx) client controller to strictly isolate all tracking services: Google Analytics 4, Microsoft Clarity, Vercel Analytics, Vercel Speed Insights, and OpenLabs first-party telemetry observer.
  - Added multi-point hostname & port guards (`localhost`, `127.0.0.1`, `0.0.0.0`, `*.local`, `port: 3000`, `port: 5000`, `admin.*`, `/admin/*`, `/403`) across [`app/layout.tsx`](file:///d:/openlabs/app/layout.tsx), [`app/components/AppAnalytics.tsx`](file:///d:/openlabs/app/components/AppAnalytics.tsx), [`app/lib/tracker.ts`](file:///d:/openlabs/app/lib/tracker.ts), [`lib/analytics.ts`](file:///d:/openlabs/lib/analytics.ts), [`components/ClarityProvider.tsx`](file:///d:/openlabs/components/ClarityProvider.tsx), and [`components/ClarityTrackerObserver.tsx`](file:///d:/openlabs/components/ClarityTrackerObserver.tsx) so analytics never load or fire during `yarn start`, local testing, or admin operations.
  - Added request `host` and `pathname` inspection to backend ingestion endpoints ([`/api/analytics/collect`](file:///d:/openlabs/app/api/analytics/collect/route.ts), [`/api/analytics/error`](file:///d:/openlabs/app/api/analytics/error/route.ts)) to completely bypass telemetry database writes for local/preview traffic and admin dashboard routes.

- **Fixed Next.js App Router Static Export Error (`app/500`)**:
  - Removed obsolete `app/500/page.tsx` route which caused Next.js Pages-Router internal error export collisions (`ENOENT: rename 500.html`). Standardized full 500 error handling inside Next.js App Router boundaries `app/error.tsx` and `app/global-error.tsx`.
  - Verified production build completes cleanly across all 253 static routes.

- **Fixed Light/Dark Mode Theming in Blog CTA Banner (`app/components/blog/BlogPostInteractive.tsx`)**:
  - Replaced hardcoded dark indigo/purple gradients, `text-white`, and `text-slate-300` with semantic tokens (`bg-card`, `border-primary/20`, `text-foreground`, `text-muted-foreground`, and radial dot matrix styling) for proper contrast in both light and dark modes.

- **Refactored Biology Subject Hub Hierarchy (`app/biology/page.tsx`)**:
  - Replaced fragmented child experiment cards (`/biology/cell/animal`, `/biology/cell/plant`, `/biology/genetics/monohybrid`, `/biology/genetics/dihybrid`, `/biology/genetics/dna-transcription`, `/biology/genetics/pedigree`) on the main `/biology` landing page with their dedicated parent subtopic hub suites:
    - **Cell Structure & Cytology Suite** ([`/biology/cell`](file:///d:/openlabs/app/biology/cell/page.tsx))
    - **Genetics & Heredity Studio** ([`/biology/genetics`](file:///d:/openlabs/app/biology/genetics/page.tsx))
  - Linked standalone full biology labs: Cellular Respiration & Mitochondrial ETC ([`/biology/cellular-respiration`](file:///d:/openlabs/app/biology/cellular-respiration/page.tsx)), Enzyme Kinetics & Catalysis ([`/biology/enzyme-kinetics`](file:///d:/openlabs/app/biology/enzyme-kinetics/page.tsx)), and Osmosis & Cell Tonicity ([`/biology/osmosis-tonicity`](file:///d:/openlabs/app/biology/osmosis-tonicity/page.tsx)).

- **Standardized All Sub-Topic Hub Pages with `/physics` Design & Rich SEO/GEO/AEO (`app/components/SubtopicHubLayout.tsx`)**:
  - Replaced basic card grids across all 9 subtopic hub pages with the comprehensive laboratory design system:
    - **Computer Science**: Networking ([`/computer-science/networking`](file:///d:/openlabs/app/computer-science/networking/page.tsx)), Logic Gates ([`/computer-science/logic-gates`](file:///d:/openlabs/app/computer-science/logic-gates/page.tsx)), Data Structures & Algorithms ([`/computer-science/dsa`](file:///d:/openlabs/app/computer-science/dsa/page.tsx)), Sorting Algorithms ([`/computer-science/dsa/sorting`](file:///d:/openlabs/app/computer-science/dsa/sorting/page.tsx)), Cryptography ([`/computer-science/cryptography`](file:///d:/openlabs/app/computer-science/cryptography/page.tsx)), Code Lab ([`/computer-science/code-lab`](file:///d:/openlabs/app/computer-science/code-lab/page.tsx)), and AI Problems ([`/computer-science/ai-problem`](file:///d:/openlabs/app/computer-science/ai-problem/page.tsx)).
    - **Biology**: Genetics & Heredity ([`/biology/genetics`](file:///d:/openlabs/app/biology/genetics/page.tsx)) and Cell Structure & Cytology ([`/biology/cell`](file:///d:/openlabs/app/biology/cell/page.tsx)).
  - Injected complete SEO/GEO/AEO content: 4-step practical investigation protocols, computational & mathematical foundation matrices, academic curriculum alignment (CBSE, AP, IB, Cambridge), single-open FAQs, and complete Schema.org JSON-LD (`CollectionPage`, `ItemList`, `HowTo`, `FAQPage`, `BreadcrumbList`).

- **Enriched SEO, GEO & AEO Architecture on All Subject Landing Pages (`/physics`, `/chemistry`, `/biology`, `/mathematics`, `/computer-science`)**:
  - **AEO & Featured Snippets**: Added step-by-step practical laboratory methodology guides (*"How to Conduct Virtual Experiments Online"*) with 4 structured procedural steps and Schema.org `HowTo` structured data.
  - **GEO (Generative Engine Optimization)**: Added comprehensive computational foundations and governing laws matrices detailing theoretical principles, equations, and exact numerical solvers (e.g. RK4 ODE, Henderson-Hasselbalch, Hodgkin-Huxley, Durand-Kerner polynomial roots, Master Theorem).
  - **Global Schema & Knowledge Graph**: Added Google Sitelinks `SearchAction` and included Mathematics in the root `EducationalOrganization` course catalog (`app/layout.tsx`).
  - **Curriculum Cross-Referencing**: Aligned each discipline's experiments against NCERT Class 11/12, AP, IB DP, and Cambridge A-Levels.

- **Unified Subject Landing Pages Design System (`/chemistry`, `/biology`, `/mathematics`, `/computer-science`)**:
  - Harmonized all 4 STEM discipline landing pages to match the layout and design standard established in `/physics`.
  - Built dedicated live search & category filter explorers (`ChemistryExperimentExplorer`, `BiologyExperimentExplorer`, `MathematicsExperimentExplorer`, `ComputerScienceExperimentExplorer`) with dynamic metadata pills, difficulty tags, and equations.
  - Added ambient radial dot grids, themed gradient hero titles, 3-metric statistics pills, feature value cards, academic curriculum alignment sections, and single-open FAQ accordions across all subjects.

- **Redesigned Global Scientific Leaderboard (`app/leaderboard/LeaderboardClient.tsx`)**:
  - Added interactive Top 3 Champions Podium with Gold, Silver, and Bronze pedestals, animated crowns, and direct profile links.
  - Added real-time user standing card showcasing personal rank, current scientist title, and lifetime XP score.
  - Added 6-discipline filter matrix (All Disciplines, Physics, Chemistry, Biology, Mathematics, Computer Science).
  - Enhanced ranked roster list with level pills, researcher handles, and smooth click-throughs to public researcher profiles.

- **Upgraded OpenLabs AI Science Tutor (`app/components/OpenLabsAI.tsx`)**:
  - Redesigned floating AI trigger pill with real-time remaining query quota badge (`X/10 left`) and pulsing scientific aura.
  - Added live context detection automatically identifying current active STEM suite (Physics, Chemistry, Biology, Mathematics, Computer Science).
  - Added smart starter quick prompts ("Explain theory & formulas", "How to use controls", "Quick concept check quiz").
  - Enhanced markdown responses with 1-click **Copy Answer** button, formatted formula codes, clear conversation action, and smooth streaming typewriter animation.

- **Redesigned Public Researcher Profile (`app/profile/[username]/page.tsx`, `ProfilePublicClient.tsx`)**:
  - Upgraded public researcher page with wide responsive container, sleek hero card, scientist rank verification badge, and 1-click share trigger.
  - Added 4-card KPI summary (Level & Progress, Active Streak, Simulations Completed, Trophies Unlocked).
  - Added full 5-discipline STEM Subject Mastery matrix and interactive trophy case with unlocked and locked achievements.

- **Refreshed User Profile Workspace (`app/profile/ProfileViewClient.tsx`)**:
  - Full redesign with glassmorphic hero card, avatar selector (12 avatars), real-time username & bio editing, and 1-click **Share Public Profile** clipboard copy.
  - Added 4-card KPI metric summary (Scientist Level, Active Streak, Total Completed Simulations, Lifetime XP).
  - Upgraded **STEM Subject Mastery** matrix covering all 5 disciplines (Physics, Chemistry, Biology, Mathematics, Computer Science) with animated progress rings.
  - Interactive **Scientific Badges & Achievements** showcase, daily quest progress bar, weekly throughput SVG curve, and recent simulation execution history log.

- **Modernized Global Navbar (`app/components/Navbar.tsx`)**:
  - Full redesign with translucent glassmorphic background (`bg-background/85 backdrop-blur-xl border-b border-border/80 text-foreground`) replacing solid saturated gradients for seamless dark and light mode harmony.
  - Upgraded Virtual Labs mega dropdown featuring all 5 STEM disciplines (Physics, Chemistry, Biology, Mathematics, Computer Science) with lab counts, quick links, and Quests & Leaderboard hub card.
  - Refined mobile navigation drawer with expandable lab suites accordion, direct auth actions, and smooth animation transitions.

- **Redesigned Global Footer (`app/components/Footer.tsx`)**:
  - Full modern redesign replacing outdated hardcoded gradients with semantic dark/light tokens (`bg-card/95`, `border-border`, `text-foreground`).
  - Added comprehensive directory links for all 5 STEM disciplines (Physics, Chemistry, Biology, Mathematics, Computer Science) with lab counts and category icons.
  - Added live simulation cloud status badge (`Simulation Cloud Active`), open-access badge, direct support email trigger, and clean legal/navigation links.

- **Exclusive Single-Open FAQ Accordions (Site-Wide)**:
  - Enabled native grouped accordion behavior across all pages (`app/page.tsx`, `app/blog/[slug]/page.tsx`, `app/physics/page.tsx`, `app/chemistry/periodictable/page.tsx`, and Computer Science simulation landing pages) using the standard `name` attribute on `<details>`.
  - Opening any FAQ question automatically collapses any currently opened question, ensuring only one accordion item remains open at a time.

- **Refreshed Home Page (`app/page.tsx`, `app/components/Hero.tsx`)**:
  - Upgraded home page and hero section with symmetrical 5-discipline simulation suites across Physics (14), Chemistry (4), Biology (3), Mathematics (12), and Computer Science (19+).
  - Added **Latest Articles & Research Insights** section dynamically fetching the 3 most recent published articles from MongoDB with responsive cards, category badges, reading times, and cover images.
  - Added live platform statistics matrix (50+ Virtual Labs, 5 STEM Disciplines, 100% Free Access, 24/7 Browser Execution).
  - Streamlined vertical spacing, improved dark/light mode token compatibility, and expanded FAQ accordions with structured Schema.org JSON-LD data (`WebSite`, `WebPage`, `FAQPage`, `BreadcrumbList`).

- **Dedicated 500 Error Page (`app/500/page.tsx`)**:
  - Built dedicated interactive 500 Server Error page with terminal diagnostics scanner, animated fault flask, automated error telemetry dispatch via `trackError()`, single-click experiment reinitialization, and quick directory links to active STEM lab suites.

- **Refreshed Blog Page (`app/blog/page.tsx`, `app/components/blog/BlogGrid.tsx`)**:
  - Redesigned blog page with streamlined vertical padding, dark/light mode token alignment, and clean hero header.
  - Added interactive client-side **Search Bar** and dynamic **Category Filter Pills** with live matching and filter reset actions.
  - Upgraded article cards with responsive aspect ratio previews, topic badge icons, estimated reading times, and smooth elevation hover effects.
  - Preserved Schema.org JSON-LD structured schemas (`Blog`, `BreadcrumbList`).

- **Redesigned Blog Post Page (`app/blog/[slug]/page.tsx`, `app/components/blog/BlogPostInteractive.tsx`)**:
  - **Full Layout & UX Redesign**: 2-column desktop layout (`max-w-7xl`) with sticky sidebar, dynamic Table of Contents with scroll-spy heading tracking, live top reading progress bar, 1-click code block copying, and quick social sharing triggers (X/Twitter, LinkedIn, WhatsApp, Copy Link).
  - **AEO & SEO Optimization**: Executive Key Takeaways summary card for Answer Engine Optimization (AEO / Perplexity / Google SGE), anchor IDs on all headings, author E-E-A-T credentials card, and deep Schema.org structured data (`BlogPosting`, `FAQPage`, `BreadcrumbList`).
  - **GEO & Regional Signals**: Regional geotargeting metadata and international student applicability tags.
  - **Interactive Learning & Discovery**: Dynamic simulation launch CTA matching the article's STEM category, interactive FAQ accordions, and 3-column related publications grid.

- **Refreshed Contact Page (`app/contact/page.tsx`, `app/contact/ContactForm.tsx`)**:
  - Streamlined hero, contact channels, and form section with compact vertical spacing and responsive layouts matching the updated design system.
  - Aligned all styling with semantic Tailwind tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-accent`) for seamless light/dark mode switching.
  - Added live simulation network status card, bug reporting triage guidance, accessible field labels with iconography, and responsive feedback states.
  - Preserved structured Schema.org JSON-LD schemas (`ContactPage`, `EducationalOrganization`, `BreadcrumbList`).

- **Refreshed About Page (`app/about/page.tsx`)**:
  - Updated platform statistics to reflect **50+ virtual labs** across **5 active STEM disciplines** (Physics, Chemistry, Biology, Mathematics, and Computer Science).
  - Modernized hero section with vibrant gradients, dark/light theme token alignment, and quick navigation CTAs.
  - Added interactive active disciplines matrix showcasing all 5 subject suites with lab counts and descriptions.
  - Added authentic **"What's Coming to OpenLabs"** section highlighting Advanced STEM Lab Suites, Verifiable Skill Certificates, and Real-Time Collaborative Labs.
  - Preserved structured JSON-LD schemas (`AboutPage`, `EducationalOrganization`, `BreadcrumbList`).

- **First-Party Web Analytics & Runtime Error Diagnostics Dashboard (`/api/analytics/collect`, `/api/analytics/error`, `/admin/analytics`)**:
  - **Client-Side Telemetry Engine (`app/components/OpenLabsTracker.tsx`, `app/lib/tracker.ts`)**: Lightweight, non-blocking beacon observer capturing pageviews, active dwell time, scroll depth milestones (25%, 50%, 75%, 100%), traffic referrers, UTM parameters, devices, and countries.
  - **Global Runtime Error & Boundary Capture**: Automated error reporting for uncaught window exceptions, unhandled Promise rejections, and Next.js React Error Boundaries (`app/error.tsx`), with 24h smart deduplication on `{ message, pathname }` to prevent database bloat.
  - **Data Layer (`app/models/PageView.js`, `app/models/AnalyticsEvent.js`, `app/models/ErrorLog.js`, `app/lib/analyticsDb.ts`)**: High-performance Mongoose models with compound indexes and parallel aggregation pipelines.
  - **Executive Admin Analytics & Error Triage Dashboard (`/admin/analytics`)**: Real-time active users pulse (`online now`), multi-timeframe traffic trend charts, top labs and pages ranking table, traffic acquisition channels, device & tech matrix, custom learning events stream, and complete Error Log Triage panel with 1-click status actions (`new` &rarr; `investigating` &rarr; `resolved` &rarr; `ignored`).
  - **Unified Admin Header Navigation**: Synchronized 6-tab header navigation across all admin views (`Users`, `Blogs`, `SEO`, `Feedback`, `Contacts`, `Analytics`).

- **Contact Form Database Persistence & Admin Inbox Dashboard (`/api/contact`, `/admin/contacts`, `app/models/Contact.js`)**:
  - Added Mongoose `Contact` model with fields for `name`, `email`, `subject`, `message`, `userId` (optional association), `status` (`new`/`read`/`replied`/`archived`), `emailSent`, `emailError`, and client telemetry.
  - Upgraded `POST /api/contact` to persist all inquiries in MongoDB before sending notification emails, ensuring submissions are never lost even if SMTP experiences network timeouts.
  - Built dedicated Admin Inbox Dashboard at `/admin/contacts` with search, multi-status filtering, 1-click email replies, message text copying, deletion, and rich sender cards.

- **Two-Tier Lab Feedback System & Admin Triage Dashboard (`/api/feedback`, `/admin/feedback`)**:
  - **Data Model & Schema (`app/models/Feedback.js`)**: Mongoose schema with `helpful` boolean pulse, `rating` (1–5 stars), `category` (bug, confusing, wrong-content, suggestion, praise), `comment`, `labStep`, and status lifecycle (`new` &rarr; `reviewed` &rarr; `fixed`).
  - **Public & Admin APIs (`/api/feedback`, `/api/feedback/[labId]`, `/api/admin/feedback`)**: Single endpoint supporting pulse and deep feedback with 24h rate-limiting/upserting, aggregation stats helper (`app/lib/feedback.ts`), and status patching.
  - **Frontend UI Components (`FeedbackPulse.tsx`, `FeedbackForm.tsx`, `FloatingLabFeedback.tsx`)**: Non-intrusive thumbs up/down pulse widget and globally mounted floating feedback trigger for 100% of labs in Physics, Chemistry, Biology, Math, and CS.
  - **Gamification & XP Tie-in**: Automatically awards `+10 XP` for first feedback on a lab and grants the `Contributor` badge upon 5+ submissions.
  - **Admin Triage Dashboard (`/admin/feedback`)**: Full sortable/filterable triage interface with global metrics, per-lab ratings and helpfulness %, rich user profile cards (avatar, full name, email, @username, level & XP badge, profile links), client device tags, dual Live Stream / Lab Summary view modes, and instant status updates.


- **Electrochemistry Lab Voltage & Resistance Dynamics (`/labs/chemistry/electrochemistry`)**:
  - Integrated internal cell resistance ($r_{\text{int}} = 2.0\text{ }\Omega$) so terminal voltage $V_{\text{terminal}} = \mathcal{E}_{\text{cell}} \cdot \frac{R_{\text{load}}}{R_{\text{load}} + r_{\text{int}}}$ actively responds to the load resistance slider ($1\text{ }\Omega$ to $100\text{ }\Omega$).
  - Added live telemetry matrix showing Terminal Voltage, Open-Circuit EMF, Current ($I$), Power ($P$), and Internal Voltage Drop ($I \cdot r_{\text{int}}$).
  - Added dynamic glowing Lightbulb load on the circuit wire whose illumination scales with electric power.

- **Monohybrid Punnett Square & Creature Breeder Redesign (`/labs/biology/genetics/monohybrid`)**:
  - Redesigned the lab from scratch into an intuitive 4-step genetic breeding experience.
  - **Step 1 Parents**: Maternal (Mom) & Paternal (Dad) creature avatar customizers with instant genotype selection (`BB`, `Bb`, `bb`) and gamete split displays.
  - **Step 2 Punnett Matrix**: High-contrast 2×2 gamete fusion grid showing baby creature avatars and genotype/phenotype in each cell.
  - **Step 3 Mendelian Ratios**: Real-time percentage bars for Genotypic Ratio ($1:2:1$) and Phenotypic Ratio ($3:1$).
  - **Step 4 Creature Nursery**: Live population breeder allowing users to breed batches of 1, 10, 50, or 100 baby creatures to observe statistical convergence toward Mendelian ratios.
  - **Inheritance Modes**: Complete Dominance, Incomplete Dominance (Pink blend), and Co-Dominance (Spots).


- **Periodic Table & Atom Lab Dark Mode & 3D Centering Polish**:
  - **Periodic Table Matrix (`/labs/chemistry/periodictable`)**: Full dark/light mode glassmorphic styling across all 118 element cards, family filters, and detailed monograph modal.
  - **Atom Monograph Redesign (`/chemistry/periodictable/atom/[atomicNumber]`)**: Redesigned scientific profile while preserving the left atom card, featuring interactive Bohr Model SVG, previous/next element switcher, high-impact CTA launcher buttons, thermodynamic matrix, and structured FAQs.
  - **3D Bohr Atom Model Lab (`/labs/chemistry/periodictable/atom/[atomicNumber]`)**: Removed hardcoded canvas background, enabled transparent WebGL viewport, locked camera orbit target to `(0, 0, 0)`, and aligned decoupled electron orbital planes for centered rendering in dark and light modes.
  - **Electronic Configuration Simulator (`/labs/chemistry/electronic-configuration/[atomicNumber]`)**: Full light/dark mode theming for Aufbau subshell boxes, orbital diagrams, and exception alerts.


- **SEO, AEO, & GEO Landing Page Optimization Across All 12 Labs**:
  - Upgraded all 12 newly developed lab landing pages to full `EducationalLandingLayout` architecture with rich scientific theory, step-by-step mathematical foundations, industrial real-world applications, structured AEO/GEO FAQs, and JSON-LD schema markup.
  - **Chemistry**: Flame Test & Atomic Emission (`/chemistry/flame-test`), 3D VSEPR Geometry (`/chemistry/vsepr-geometry`), Electrochemical Cells (`/chemistry/electrochemistry`), Gas Laws & Maxwell-Boltzmann (`/chemistry/gas-laws`).
  - **Physics**: Faraday's Law & Induction (`/physics/faradays-law`), Photoelectric Effect (`/physics/photoelectric-effect`), Thermodynamic Heat Engines (`/physics/thermodynamics`).
  - **Biology**: Enzyme Kinetics (`/biology/enzyme-kinetics`), Cellular Respiration & ETC (`/biology/cellular-respiration`), Osmosis & Tonicity (`/biology/osmosis-tonicity`).
  - **Computer Science**: Intel 8085 & SAP-1 Architecture (`/computer-science/cpu-architecture`), Binary & Bitwise Operations (`/computer-science/bitwise-operations`).
  - **Title Duplication Fix**: Fixed root layout metadata `title.template` in `app/layout.tsx` from `'%s | OpenLabs'` to `'%s'` so that pages with custom branding and keywords do not suffer from double `| OpenLabs` suffixes in search engine results.

  - Added the **Genetics & Heredity Studio Suite** under Biology (`/biology/genetics` and `/labs/biology/genetics/*`):
    - **Monohybrid Punnett Square & Creature Breeder** (`/biology/genetics/monohybrid`): Single-gene inheritance ($BB, Bb, bb$), live alien creature avatar rendering (purple vs orange fur), animated gamete meiosis and fertilization, theoretical $3:1$ and $1:2:1$ ratios, plus a **100-Offspring Population Breeder** demonstrating experimental statistical convergence.
    - **Dihybrid Cross & Independent Assortment** (`/biology/genetics/dihybrid`): 16-cell interactive Punnett matrix tracking two unlinked traits simultaneously (Seed Shape $R/r$ and Color $Y/y$) with live animated fertilizations and classic Mendelian $9:3:3:1$ phenotype breakdowns.
    - **DNA Transcription & Translation (Central Dogma)** (`/biology/genetics/transcription-translation`): Molecular biology simulator with DNA double-strand unzipping, complementary mRNA transcription ($A \to U, T \to A, C \to G, G \to C$), ribosomal tRNA codon reading, and growing peptide polypeptide chain, plus an interactive mutation sandbox (Silent, Missense, Nonsense, Frameshift).
    - **Pedigree Tree & Inheritance Patterns** (`/biology/genetics/pedigree`): 3-generation interactive clinical pedigree family tree analyzing Autosomal Dominant (Huntington's), Autosomal Recessive (Cystic Fibrosis), and X-Linked Recessive (Color Blindness/Hemophilia) with individual health status inspection.
    - **Dedicated Hub**: Hub page (`/biology/genetics`) displaying all 4 standalone lab cards with `ClientGrid`.

- **Classical & Modern Cryptography Studio Lab**:
  - Added the **Classical & Modern Cryptography Studio** lab (`/computer-science/cryptography` and `/labs/computer-science/cryptography`):
    - **Caesar Cipher Wheel & Chi-Squared Cracker**: Interactive rotatable SVG double-ring cipher wheel, real-time message encoding/decoding, ciphertext letter frequency histogram, and 1-click Chi-squared ($\chi^2$) frequency attack auto-cracker.
    - **Polyalphabetic Vigenère Tableau**: $26 \times 26$ Tabula Recta grid with live row/column coordinate intersection highlighting, keyword stream repeater, and Index of Coincidence (IoC) explanation.
    - **WWII Enigma Machine Simulator**: 3 stepping rotors (I, II, III) with turnover notches, Reflector UKW-B (demonstrating why a letter never encrypts to itself), customizable Steckerbrett plugboard, glowing lampboard, and step-by-step electrical current trace.
    - **Diffie-Hellman Key Exchange**: Paint color-mixing visualizer + discrete logarithm math sandbox ($g^{ab} \pmod p$) with Eve eavesdropper security inspector.
    - **SHA-256 Avalanche Effect & Mining**: Bit-level 256-cell difference map demonstrating the avalanche effect and Bitcoin Proof-of-Work block mining mini-game.
    - **Student Guided Missions & Concept Check Quizzes**: Interactive missions with completion badges and active recall quizzes.

- **Differential Equations & Dynamical Systems Studio Lab**:
  - Added the **Differential Equations & Dynamical Systems Studio** lab (`/mathematics/differential-equations` and `/labs/mathematics/differential-equations`):
    - **1st-Order Slope Fields & Numerical Integrators**: Interactive direction field canvas with click-to-spawn solution curves, equation presets ($y' = x - y, y' = y(1-y), y' = \sin(x) - y, y' = x^2 - y^2$), and step size error comparison across **Euler's Method**, **Heun's 2nd-Order Method**, and classical **4th-Order Runge-Kutta (RK4)**.
    - **2D Linear Systems & Phase Plane Portraits ($\dot{\mathbf{x}} = A\mathbf{x}$)**: Two-way editable matrix inputs, Trace-Determinant stability diagram ($\tau = \text{tr}(A), \Delta = \det(A)$) classifying Saddles, Spirals, Nodes, and Neutral Centers, with real-time eigenvalue computations and stream particle trajectories.
    - **Lotka-Volterra Predator-Prey Dynamics**: Non-linear cyclic orbits in $(x, y)$ phase space surrounding interior coexistence equilibrium, with dual time-series population waveforms demonstrating ecological phase lags.
    - **Damped & Driven Harmonic Oscillators ($m\ddot{x} + c\dot{x} + kx = F_0\cos(\omega t)$)**: Underdamped ($\zeta < 1$), critically damped ($\zeta = 1$), and overdamped ($\zeta > 1$) regimes, driving force frequency resonance response sweeps, and $(x, v)$ phase-space ellipses.
    - **3D Lorenz Strange Attractor (Chaos Theory)**: 3D rotatable Strange Attractor (Butterfly attractor) with mouse rotation, Lyapunov exponent sensitive dependence, and dual-trajectory Butterfly Effect divergence simulator ($\Delta x_0 = 10^{-4}$).
    - **Epidemiological SIR Dynamics**: Kermack-McKendrick infection transmission curves ($S, I, R$), basic reproduction number $R_0 = \beta / \gamma$, herd immunity thresholds, and social distancing "Flatten the Curve" slider.


- **OpenRouter Multi-Key Automatic Fallback & Rotation**:
  - Implemented multi-key failover system in `app/lib/openrouter.ts`:
    - Reads single or multiple comma-separated keys from `CHATBOT_API_KEY`, `CHATBOT_API_KEYS`, `OPENROUTER_API_KEY`, `OPENROUTER_API_KEYS`, or enumerated env vars (`CHATBOT_API_KEY_1`, `CHATBOT_API_KEY_2`, etc.).
    - Automatically catches API errors (402 Insufficient Credits, 429 Rate Limits, 401 Unauthorized) and seamlessly falls back to the next configured key without dropping user requests.
    - Integrated across both AI Chat Assistant (`/api/chat`) and Daily Challenge Generator (`/api/challenges/generate`).

- **Number Theory & Cryptography Studio Lab**:
  - Added the **Number Theory & Cryptography Studio** lab (`/mathematics/number-theory` and `/labs/mathematics/number-theory`):
    - **Prime Factorization & Sieve of Eratosthenes**: Sieve of Eratosthenes grid up to $N = 200$, unique prime factor trees (Fundamental Theorem of Arithmetic), divisor counts $d(n)$, divisor sums $\sigma(n)$, and number classifications.
    - **Euclidean Algorithm & Bézout's Identity**: Step-by-step division algorithm, Extended Euclidean Algorithm (EEA) for Bézout coefficients ($ax + by = \gcd(a, b)$), $\text{LCM}(a, b)$, and **geometric rectangle square tiling visualizer**.
    - **Modular Arithmetic & Chinese Remainder Theorem**: Interactive modular clock wheel for $\mathbb{Z}_m$, multiplicative inverses $a^{-1} \pmod m$, and Chinese Remainder Theorem simultaneous system solver.
    - **Euler's Totient $\phi(n)$ & Modular Theorems**: Coprimality spoke wheel, Euler's totient theorem ($a^{\phi(n)} \equiv 1 \pmod n$), Fermat's Little Theorem, and Wilson's theorem.
    - **RSA Public-Key Cryptography**: Step-by-step key generation ($p, q \to n, \phi(n), e, d$), live text encryption and decryption ($C = M^e \pmod n \implies M = C^d \pmod n$), and Square-and-Multiply modular exponentiation trace.
    - **Collatz Conjecture & Continued Fractions**: Dynamic trajectory orbit plot ($3n + 1$) with stopping time and maximum peak height, plus continued fraction expansions for rational and irrational numbers.
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`primesFactored`, `gcdsComputed`, `ciphersTested`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Combinatorics & Discrete Counting Studio Lab**:
  - Added the **Combinatorics & Discrete Counting Studio** lab (`/mathematics/combinatorics` and `/labs/mathematics/combinatorics`):
    - **Permutations ($P(n, r)$) & Combinations ($C(n, r)$) & Anagrams**: Fully customizable item element pool (custom additions, removals, and color tagging), multiset anagram generator with letter frequency breakdown ($\frac{n!}{n_1! n_2! \dots n_k!}$), circular permutations ($(n-1)!$), and searchable enumeration gallery.
    - **Pascal's Triangle & Binomial Theorem**: Interactive matrix ($n \le 12$) with **Modulo $p$ prime fractal explorer** (Sierpinski carpet), **Fibonacci Diagonals**, **Hockey-Stick Identity**, and live algebraic **Binomial Theorem Expansion Generator** ($(ax + by)^n$).
    - **Pigeonhole Principle & Ramsey Graph Theory**: Interactive Dirichlet box distributor ($\lceil n/k \rceil$) plus **Party Problem Ramsey Theorem $R(3, 3) = 6$** with interactive $K_6$ red/blue friend-stranger edge toggling.
    - **Stars & Bars & Integer Partitions**: Candy/bars divider simulator for non-negative ($\binom{n+k-1}{k-1}$) and positive ($\binom{n-1}{k-1}$) integer equations, plus **Integer Partitions $p(n)$ with Ferrers & Young Diagrams**.
    - **Catalan Numbers & Dyck Paths / Expressions**: Live $C_n = \frac{1}{n+1}\binom{2n}{n}$ generator with interactive Dyck monotonic grid paths, balanced parentheses expressions, and convex polygon triangulations.
    - **Derangements ($!n$) & Hat-Check Problem**: Subfactorial $!n$ engine, zero-fixed-point permutation generator, and empirical $1/e \approx 0.367879$ probability convergence simulator.
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`countsComputed`, `trianglesExplored`, `partitionsGenerated`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Vector Algebra & 3D Space Studio Lab**:
  - Added the **Vector Algebra & 3D Space Studio** lab (`/mathematics/vector-algebra` and `/labs/mathematics/vector-algebra`):
    - **2D Vector Operations & Parallelogram Law**: Draggable vector heads $\vec{u}$ and $\vec{v}$ with **two-way editable numerical inputs**, custom vector renamers (e.g. $\vec{F}_1, \vec{F}_2$), **Tip-to-Tail addition**, **Parallelogram Law of forces**, vector subtraction, scalar linear combinations ($c_1\vec{u} + c_2\vec{v}$), and on-canvas magnitude badges and direction angles ($\theta_u, \theta_v, \theta_R$).
    - **Dot Product & Orthogonal Projections**: Live computation of $\vec{u} \cdot \vec{v} = |\vec{u}||\vec{v}|\cos\theta$ with **editable component inputs**, angle classification gauge (Acute, Orthogonal, Obtuse), right-angle projection shadow $\text{proj}_{\vec{v}}(\vec{u})$, and work done formula.
    - **3D Cross Product & Right-Hand Rule**: Interactive 3D rotation canvas with editable components rendering $\vec{w} = \vec{u} \times \vec{v}$ perpendicular to both inputs, spanned parallelogram surface area ($|\vec{u} \times \vec{v}|$), and triangle area ($\frac{1}{2}|\vec{u} \times \vec{v}|$).
    - **Scalar Triple Product & Parallelepiped Volume**: $[\vec{u}, \vec{v}, \vec{w}] = \det(M)$ with 3D wireframe volume box and live **Coplanarity Indicator**.
    - **3D Lines & Planes Geometry**: **Directly editable 3D parametric lines** ($\vec{r} = \vec{a} + t\vec{d}$) and **Cartesian plane equations** ($Ax + By + Cz = D$) with shortest point-to-plane distance calculations.
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`operationsPerformed`, `productsComputed`, `projectionsTested`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Interactive Geometry Studio Lab**:
  - Added the **Interactive Geometry Studio** lab (`/mathematics/geometry` and `/labs/mathematics/geometry`):
    - **GeoGebra-Style Construction Studio**: Dynamic construction canvas for Points, Segments, Lines, Circles, and Midpoints with real-time draggable precision points, coordinate table, and Euclidean distance readouts.
    - **Triangle Centers & Euler Line Explorer**: Real-time computation of **Centroid ($G$)**, **Incenter ($I$)**, **Circumcenter ($O$)**, **Orthocenter ($H$)**, **Nine-Point Circle**, and the collinear **Euler Line** with constant ratio $HG = 2 \cdot GO$, plus **direct on-canvas SVG angle arcs with degree tags** and **edge length dimension badges**.
    - **Circle Theorems Interactive Playground**: Draggable points on circumferences verifying the **Inscribed Angle Theorem** ($\angle AOB = 2\angle ACB$), **Thales' Theorem** (right angle $90^\circ$ in semicircle), **Angles in Same Segment**, and **Cyclic Quadrilaterals** with direct arc badges.
    - **Pythagorean Theorem Area Decomposition**: Right triangle simulator rendering geometric squares on legs $a^2$ (blue) and $b^2$ (pink) and hypotenuse $c^2$ (purple) verifying $a^2 + b^2 = c^2$, plus standard triples (3-4-5, 5-12-13, 8-15-17).
    - **2D Geometric Transformations Sandbox**: Real-time **Translation**, **Rotation**, **Reflection**, and **Dilation** on polygons with coordinate matrices and ghost pre-image overlays.
    - **Regular Polygons & Metric Analyzer**: Sides $n \in [3, 16]$ with apothem, perimeter, interior/exterior angle formulas, and exact trigonometric area.
    - **3D Solid Polyhedra Explorer**: Interactive 3D wireframe projection for Cube, Tetrahedron, Octahedron, and Cylinder with mouse rotation, surface area, volume formulas, and **Euler's Polyhedral Formula** ($V - E + F = 2$).
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`constructionsMade`, `centersExplored`, `theoremsTested`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Set Theory & Boolean Algebra Lab**:
  - Added the **Set Theory & Boolean Algebra** interactive lab (`/mathematics/set-theory` and `/labs/mathematics/set-theory`):
    - **Interactive 2-Set & 3-Set Venn Diagram Sandbox**: Full clickable SVG region overlays for all 8 partitions ($A_{only}, B_{only}, C_{only}, AB_{only}, AC_{only}, BC_{only}, ABC, \text{outside}$), dynamic element token placement, custom set naming (e.g. Football, Basketball, Tennis) and color pickers.
    - **Set Operations & Expression Evaluator**: Real-time parser for arbitrary set expressions (`(A | B) & ~C`, `A ^ B`, etc.), matching elements summary, and interactive visual proofs for **De Morgan's Laws** and **Distributive Laws**.
    - **Principle of Inclusion-Exclusion (PIE) Solver**: Cardinality calculations for $|A \cup B|$ and $|A \cup B \cup C|$ with step-by-step addition/subtraction breakdown to prevent double-counting, plus hypothetical survey counting problem solver.
    - **Relations & Functions Mapping Studio**: Domain-to-codomain ($X \to Y$) bipartite arrow editor with live automated classification of **Injective (One-to-One)**, **Surjective (Onto)**, **Bijective (Invertible)**, and **Equivalence Relations** (Reflexive, Symmetric, Transitive).
    - **Propositional Logic & Truth Table Builder**: Dynamic arbitrary proposition parser ($p, q, r, s$), interactive logic operator keypad ($\land, \lor, \neg, \to, \leftrightarrow, \oplus$), truth table generator, and tautology/contradiction detector.
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`regionsShaded`, `operationsEvaluated`, `functionsMapped`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Graph Algorithms & Network Flow Lab (Computer Science - DSA)**:
  - Relocated and integrated the **Graph Algorithms & Network Flow** lab into Computer Science DSA (`/computer-science/dsa/graph-algorithms` and `/labs/computer-science/dsa/graph-algorithms`):
    - **Interactive Graph Studio Canvas**: Add/delete/drag nodes with live Coulomb-Hooke **Spring Physics Force Relaxation** simulation, construct directed & undirected weighted edges with SVG arrows, edit weights, clear canvas, load 8 presets (Petersen, Complete $K_5$, Bipartite $K_{3,3}$, Binary Tree, Wheel $W_6$, Grid $2\times 3$, Weighted Network, Flow Network), and inspect invariants (Degrees, Density, Connectedness, Adjacency Matrix).
    - **Multi-Algorithm Shortest Path Visualizer**: Step-by-step priority queue trace for **Dijkstra's Algorithm**, **Breadth-First Search (BFS)**, and **Bellman-Ford Algorithm** with distance table ($dist[v]$, $prev[v]$) and golden shortest path glow.
    - **Minimum Spanning Tree (MST) Visualizer**: Kruskal's (DSU cycle detection) and Prim's cut-property algorithms with step-by-step edge acceptance/rejection and total weight counter.
    - **Interactive Vertex Coloring & Conflict Checker**: Manual painting mode with color swatches, live edge conflict detection (warning lines when adjacent nodes share identical colors), Welsh-Powell greedy coloring, and Bipartite 2-coloring test.
    - **Ford-Fulkerson Maximum Network Flow**: Residual network visualizer with Edmonds-Karp BFS augmenting paths, bottleneck capacity tracking, and maximum throughput computation.
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`pathsFound`, `mstsComputed`, `graphsColored`), and `useChat().setExperimentData` context registration.
    - SEO Landing page using `DsaLanding` and `dsaContent.ts`, curriculum alignment, and FAQs.

- **Complex Numbers & Fractals Explorer Lab**:
  - Added the **Complex Numbers & Fractals Explorer** interactive lab (`/mathematics/complex-numbers` and `/labs/mathematics/complex-numbers`):
    - **Interactive Argand Complex Plane**: Dual coordinate modes (Cartesian $a + bi$ and Polar $r \angle \theta$ sliders/inputs), draggable complex numbers $z_1, z_2$, expanded operation suite (Addition, Subtraction, Multiplication with rotation/dilation, Division, Power $z^n$, Square Root $\sqrt{z}$, Natural Logarithm $\text{Ln}(z)$, and Linear Combinations $\alpha z_1 + \beta z_2$ with $\alpha, \beta$ sliders), and layer toggles for Parallelogram, Conjugate, and Axis Projections.
    - **General Polynomial Roots of Equations ($z^n = W$)**: Solve arbitrary complex polynomial equations for any target constant $W = u + vi$ ($n \in [1, 20]$), inscribed regular polygon geometry, customizable cycle speed, and cyclic power orbits.
    - **Euler's Formula & Taylor Phasor ($r e^{i\theta}$)**: Amplitude radius slider $r \in [0.2, 3.0]$, continuous rotation angle $\theta \in [0^\circ, 720^\circ]$, automated phasor rotation with speed controls, and customizable Taylor expansion order ($N \in [1, 16]$).
    - **Fractal Universe Engine**: Real-time Canvas escape-time renderer supporting **Mandelbrot ($z^2+c$)**, **Julia Sets (custom $c$)**, **Burning Ship**, and **Multibrot ($z^3+c$)**, interactive Orbit Trajectory Inspector, PNG snapshot downloads, 6 color palettes (Cosmic, Fire, Emerald, Electric, Rainbow, Monochrome), and landmark presets.
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`complexOperationsPerformed`, `rootsExplored`, `fractalsRendered`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Probability & Statistics Sandbox Lab**:
  - Added the **Probability & Statistics Sandbox** interactive lab (`/mathematics/statistics` and `/labs/mathematics/statistics`):
    - **Physics Bean Machine (Galton Board)**: Canvas 2D particle physics engine with elastic peg collisions, lateral Bernoulli deflection bias ($p \in [0.1, 0.9]$), continuous cascade streams and instant 500-ball batch drops, glowing peg lattice, and stacked binomial histogram tubes with theoretical Gaussian envelope.
    - **Central Limit Theorem (CLT) Sandbox**: Sampling distribution generator with parent populations (Uniform, Exponential, Bimodal, Discrete Dice), live animated single-trial rolls, gradient histogram bins, and variance reduction tracking ($\sigma_{\bar{x}} = \sigma/\sqrt{n}$).
    - **Probability Distributions & Confidence Intervals**: Interactive PDF/CDF model views (Normal, Binomial, Poisson, Uniform) with draggable integral bounds $[x_1, x_2]$, $Z$-score calculations, and $1\sigma/2\sigma/3\sigma$ empirical rule presets ($68.3\%, 95.5\%, 99.7\%$).
    - **Linear Regression & Error Squares Studio**: Interactive 2D scatter plot with Ordinary Least Squares (OLS) line of best fit, vertical residual error lines, literal geometric Error Squares mode (SSE visualization), Pearson's $r$, and determination $R^2$.
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`samplesGenerated`, `distributionsExplored`, `regressionsFitted`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Linear Algebra & Matrix Transformations Lab**:
  - Added the **Linear Algebra & Matrix Transformations** interactive lab (`/mathematics/linear-algebra` and `/labs/mathematics/linear-algebra`):
    - **Interactive 2D Transformation Canvas**: Live warped coordinate grid, draggable standard basis vectors $\hat{i} = [a, c]^T$ and $\hat{j} = [b, d]^T$, customizable shapes (Unit Square, Circle $\to$ Ellipse, House Polygon, Letter 'F' Chirality Indicator, Grid Dots), and manual scrub slider ($t \in [0, 1]$) with play/pause animations.
    - **Determinant & Orientation Engine ($\det(A) = ad - bc$)**: Live area scaling factor ($|\det(A)|$), chiral orientation flip detection ($\det(A) < 0$), singular collapsed space detection ($\det(A) = 0$), and step-by-step matrix inverse $A^{-1}$.
    - **Linear System of Equations Solver ($A\vec{x} = \vec{b}$)**: Interactive draggable target vector $\vec{b}$ with real-time solution vector $\vec{x} = A^{-1}\vec{b}$ visualizer and column space collapse warnings.
    - **Eigenvalues ($\lambda$), Invariant Eigen-Lines & SVD ($\sigma_1, \sigma_2$)**: Characteristic polynomial solver, real and complex eigenvalue classification, invariant eigen-lines ($A\vec{v} = \lambda \vec{v}$), and Singular Value Decomposition (SVD) principal semi-major/minor ellipse axes.
    - **Transformation Gallery & Presets**: Continuous rotation angle slider ($\theta \in [0^\circ, 360^\circ]$), horizontal/vertical shears, non-uniform scaling, squeeze mapping, reflections, and 1D projections.
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`determinantsComputed`, `eigenvectorsFound`, `transformsApplied`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Calculus & Derivatives Sandbox Lab**:
  - Added the **Calculus & Derivatives Sandbox** interactive lab (`/mathematics/calculus` and `/labs/mathematics/calculus`):
    - **Differential Calculus & Secant Limits**: Interactive limit explorer ($f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}$) with a variable step size slider ($h \to 0$), pivoting secant lines snapping to the instantaneous tangent line, difference quotient readout ($\frac{\Delta y}{\Delta x}$), and $f'(x)$ derivative curve overlay.
    - **Riemann Sums & Definite Integrals**: 5 numerical partition rules (**Left Sum**, **Right Sum**, **Midpoint Rule**, **Trapezoidal Rule**, **Simpson's Parabolic Rule**) with variable partition slider ($N \in [2, 80]$), color-coded SVG rectangular/trapezoidal slices, and error convergence tracking against the exact definite integral $\int_a^b f(x) dx$.
    - **Optimization & Critical Extrema Studio**: Stationary critical points detector ($f'(x) = 0$), Second Derivative concavity test ($f''(x) > 0 \implies \text{Local Min}$, $f''(x) < 0 \implies \text{Local Max}$), function presets, and calculus rule quick-reference table.
    - Gamification & AI Integration: `useLab` XP awards, `DailyChallengeCard` metrics (`limitsApproached`, `integralsComputed`, `extremaFound`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Quadratic & Polynomial Explorer Lab**:
  - Added the **Quadratic & Polynomial Explorer** interactive lab (`/mathematics/polynomials` and `/labs/mathematics/polynomials`):
    - **Interactive Parabola Sandbox**: Standard form ($y = ax^2 + bx + c$) and Vertex form ($y = a(x - h)^2 + k$) with live coefficient sliders, vertex $(h, k)$ markers, axis of symmetry ($x = -b/(2a)$), focus & directrix line ($y = k - 1/(4a)$), and instantaneous tangent line slope preview.
    - **Discriminant & Complex Roots Engine ($\Delta = b^2 - 4ac$)**: Real-time classification gauge for 2 distinct real roots ($\Delta > 0$), 1 repeated real root ($\Delta = 0$), and 2 complex conjugate roots ($\Delta < 0$) with Argand complex plane decomposition ($x = \alpha \pm \beta i$).
    - **Higher-Degree Polynomial Explorer**: Curve visualizer for Linear ($n=1$), Quadratic ($n=2$), Cubic ($n=3$), Quartic ($n=4$), and Quintic ($n=5$) polynomials with numerical critical points detection (Local Minima, Maxima, Inflection Points) and end-behavior analysis.
    - **Step-by-Step Synthetic Division Tableau**: Interactive polynomial division by $(x - c)$ demonstrating the Remainder Theorem ($P(c) = R$) and Factor Theorem root confirmation ($R = 0$).
    - Gamification & AI Integration: `useLab` XP progression, `DailyChallengeCard` metrics (`rootsFound`, `discriminantAnalyzed`, `polynomialsSolved`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, theory, formulas, and FAQs.

- **Trigonometry Visualizer Lab**:
  - Added the **Trigonometry Visualizer** interactive lab (`/mathematics/trigonometry` and `/labs/mathematics/trigonometry`):
    - Interactive SVG **Unit Circle** ($r = 1$) with draggable angle arm, exact angle snapping ($0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ\dots$), right-triangle decomposition ($\sin, \cos, \tan$ legs), and quadrant rules (ASTC sign convention).
    - Real-time **Wave Unfolding Engine**: Synchronized continuous projection drawing periodic $\sin(\theta), \cos(\theta), \tan(\theta)$ waves on the adjacent Cartesian grid as the point rotates around the circle.
    - **Wave Transformation Sandbox**: Interactive sliders for Amplitude ($A$), Frequency ($B$, with period $T = 2\pi/B$), Phase Shift ($C$), Vertical Shift ($D$), and Fourier 2nd-harmonic superposition ($A_1\sin(x) + A_2\sin(2x)$).
    - **Identities & Reference Matrix**: Real-time Pythagorean ($\sin^2\theta + \cos^2\theta = 1$, $1 + \tan^2\theta = \sec^2\theta$) and double-angle identity verifiers with live numeric calculations, plus interactive 16-angle exact radical table.
    - Gamification & AI Chat Assistant: `useLab` XP awards, `DailyChallengeCard` integration (`anglesExplored`, `identitiesVerified`, `wavesTransformed`), and `useChat().setExperimentData` context registration.
    - SEO Landing page with `EducationalLandingLayout`, JSON-LD schema markup, NCERT/AP calculus curriculum alignment, theory, and FAQs.

- **Navbar Mega-Dropdown & Hover Expansion**:
  - Redesigned the main desktop navbar "Labs" dropdown into a rich, modern mega-menu with glassmorphism backdrop blur, categorized subject cards, icons, concise descriptions, and quick-access highlight links for top simulations.
  - Added seamless hover-to-expand support with grace-period timeout debounce on desktop, as well as toggle support for click and keyboard navigation.
  - Enhanced the mobile navigation accordion with categorized icons, stylish pill badges, and direct access links.
  - Integrated theme token styling (`bg-card`, `text-foreground`, `border-border`, `bg-accent`, `text-primary`) for seamless Light and Dark mode transitions.


- **Mathematics Subject & Function Grapher Lab**:
  - Introduced the new **Mathematics** subject category with dedicated portal page (`/mathematics`) and themed error boundary (`app/mathematics/error.tsx`).
  - Added the **Function Grapher** lab (`/mathematics/functiongrapher` and `/labs/mathematics/functiongrapher`):
    - Real-time 2D mathematical curve plotting built with D3 and safe symbolic math AST parsing via `mathjs`.
    - Live function transformations ($a \cdot f(b(x - h)) + k$) with interactive sliders, reflections, and automatic plain-English explanations.
    - Numerical calculus engine with bisection root-finding ($f(x) = 0$), $y$-intercepts, local extrema detection (turning points), instantaneous tangent lines ($f'(x)$), and Simpson's composite rule definite integration ($\int_a^b f(x) dx$).
    - Point inspector with click-to-pin coordinate lock, live tangent readout, and multi-function evaluation comparison table.
    - Mathematical function preset gallery (Polynomials, Trigonometric, Rational, Exponential, Gaussians, Dampened Oscillators) and quick keypad.
    - Daily Challenge and XP integration (`mathematics/functiongrapher` registry entry, `rootsFound`, `functionsPlotted`, `transformationsApplied` challenge metrics).
    - SEO landing page with schema markup, curriculum alignment (NCERT, AP Calculus, IB Math, A-Levels), and AI assistant context integration (`useChat().setExperimentData`).

- **Virtual Titration Lab**:
  - Added interactive Virtual Titration Lab (`/chemistry/titration` and `/labs/chemistry/titration`) featuring unified SVG apparatus (burette, stopcock drop animation, Erlenmeyer flask, and live indicator color transitions).
  - Integrated live pH curve graphing (Chart.js), stoichiometry calculations ($C_1 V_1 = C_2 V_2$), practice modes, and human-readable indicator color observation log exporter.
  - Fully mobile & tablet responsive layout (desktop 3-column application layout, mobile vertical scroll).

- **Single Source of Truth Auth Architecture & Cookie Invalidation**:
  - Implemented global `AuthProvider` (`components/AuthProvider.tsx`) providing explicit 4-state state machine: `LOADING`, `UNAUTHENTICATED`, `AUTHENTICATED_BUT_UNVERIFIED`, and `AUTHENTICATED`.
  - Added automatic cookie invalidation: whenever `/api/auth/me` rejects a session with HTTP status 401 (invalid/expired JWT), 403 (unverified email / `emailVerified` flipped to false in DB), or 404 (user deleted), `AuthProvider` automatically calls `POST /api/auth/logout` to destroy stale `auth-token` and `next-auth` cookies from the browser.
  - Hardened `middleware.ts` to decode JWT expiration in Edge Runtime (`isJwtExpired`) and delete expired cookies on response, completely eliminating stale cookie presence and preventing redirect loops to `/`.
  - Unified `Navbar.tsx`, `AuthPage.tsx`, `ProfileViewClient.tsx`, and `verify-email/page.tsx` around `useAuth()`.

- **Auth, Email Verification & Login Security Enforcement**:
  - Enforced strict `emailVerified` checking in `POST /api/auth/login` and `GET /api/auth/me`. Attempting to log in to an unverified email account is now denied with HTTP status 403 Forbidden (`requiresVerification: true`).
  - Integrated automatic OTP trigger (`POST /api/auth/send-otp`) and automatic redirection to `/verify-email?email=...` in `AuthPage.tsx` and `LoginFormWithParams.tsx` whenever an unverified user submits login or completes signup.
  - Fixed `AuthPage.tsx` hardcoding `callbackUrl: "/"` for Google and GitHub OAuth providers. It now extracts `next` or `callbackUrl` from search parameters (`useSearchParams()`), ensuring users who get redirected to login from protected labs (e.g. `/labs/chemistry/titration` or `/labs/physics/ohmslaw`) are returned directly back to their target lab post-login instead of the homepage.
  - Wired up password & signup form handling in `AuthPage.tsx` to submit to `/api/auth/login` and `/api/auth/signup`, set authentication cookies, handle errors gracefully, and perform dynamic redirection to `nextPath`.
  - Wrapped `AuthPage` in `<Suspense>` boundaries in `app/login/page.tsx` and `app/signup/page.tsx` for proper SSR/CSR hydration.

- **Admin User Management & Telemetry Dashboard** (`/admin/users`, `/api/admin/users`):
  - **Admin Route UI** (`app/admin/users/page.tsx`): Built a comprehensive user management portal gated by Admin Secret authentication. Includes real-time search, email verification filters, aggregated platform statistics (Total Users, Verified Count, Profile Setup %, Platform XP, Completed Labs, AI Queries), tabular user telemetry view, and a slide-over telemetry drawer for inspecting complete user metadata (XP, Level, Streak, Completed Experiments, Subject Mastery, Badges, AI Assistant activity, and Account deletion).
  - **Admin API Endpoints** (`app/api/admin/users/route.ts`, `app/api/admin/users/[id]/route.ts`): Built secure endpoints gated by `x-admin-secret` to query MongoDB user documents, calculate platform statistics, fetch individual user telemetry, and support account deletion.

- **Enterprise Technical SEO & Modular Educational Knowledge Graph Architecture**:
  - **Site-Wide Layout Rollout**: Integrated `<Breadcrumbs />`, `<FormulaSection />`, and `<EducationalGraphSection />` directly into both shared landing layouts (`EducationalLandingLayout.tsx` and `PhysicsExperimentLanding.tsx`). Every single lab page across Physics, Chemistry, Biology, and Computer Science now automatically renders breadcrumb navigation, formula tables, and the Educational Knowledge Graph (Prerequisites, Next Steps, and Related Labs).
  - **Schema Deduplication**: Consolidated schema injection into a single `<StructuredData />` script wrapper inside `SchemaMarkup.tsx` and `PhysicsExperimentLanding.tsx`, eliminating duplicate JSON-LD script tags across all lab pages.
  - **Shared Type System & Constants** (`app/lib/types/`, `app/lib/constants/`): Centralized interfaces (`knowledge.ts`, `seo.ts`, `schema.ts`) and subject metadata constants (`subjects.ts`, `difficulty.ts`, `levels.ts`).
  - **Focused SEO Builders & Recommendation Engine** (`app/lib/seo/`): Normalizing canonical builder (`canonicalBuilder.ts`), intent-based keyword builder (`keywordBuilder.ts`), focused metadata creators (`metadata/lab.ts`, `metadata/subject.ts`, `metadata/article.ts`), and schema creators (`schema/breadcrumb.ts`, `schema/learning.ts`, `schema/faq.ts`, `schema/article.ts`). Fixed brand title template duplication (`%s | OpenLabs`).
  - **Recommendations API** (`app/lib/seo/relatedContent.ts`): Clean internal linking API (`getRelatedContent()`, `getRelatedLabs()`).
  - **Modular Knowledge Graph** (`app/lib/knowledge/`): Domain concept registries (`concepts/`), learning paths (`paths/`), formula registries (`formulas/`), graph query engine (`graph.ts`), and build-time validator (`validator.ts`).
  - **Robots, Sitemap, Edge OG & AI Discoverability**: Dynamic sitemap (`sitemap.ts`) iterating LABS registry and blogs, updated `robots.ts`, Edge OG Image Generator (`app/api/og/route.tsx`) with 1-year immutable CDN headers, AI search crawler markdown route (`/llms.txt`), internal SEO dashboard (`app/admin/seo-dashboard`), and build-time CI audit script (`scripts/seo-audit.ts`).


- **Ohm's Law Simulator Overhaul**: 
  - Refactored the Ohm's Law physics lab (`/physics/ohmslaw`) into a freeform, full-screen interactive circuit builder.
  - Replaced the simple static DC calculation with a dynamic node-voltage simulation engine (`engine.ts`), supporting real-time transient simulation with Backward Euler integration for Capacitors.
  - Added support for AC (sine wave) batteries with adjustable frequency and amplitude.
  - Built an interactive Component Tray with drag-and-drop components (Resistor, Variable Resistor, Capacitor, Bulb, Switch, Fuse, Wire) and probes.
  - Added a draggable Multimeter widget with independent red and black probes to measure voltage drops across arbitrary nodes in real-time.
  - Added a live Oscilloscope view in the Circuit Canvas to graph voltages across components over time.
  - Added a global Properties Panel for live stats and a Voltage Sweep plot analyzer.

- **Profile & Leaderboard Polish**:
  - Restructured the public profile view (`/profile/[username]`) for better privacy by removing sensitive data (activity logs, throughput metrics, experiment timelines, daily targets, and join date) from both the UI and the API response. Guest viewers now only see core stats, subject mastery, and badges.
  - Fixed hardcoded theme colors (`bg-indigo-50`, `text-indigo-600`, `text-white`) across both the private and public profile dashboards. They now use adaptive semantic CSS variable tokens (`bg-primary/10`, `text-primary`, `text-foreground`) to render beautifully in both Light and Dark mode.
  - Fixed a UI crash in the profile editing menu where the `AVATARS` array wasn't imported.
  - Added a filter to the global leaderboard (`/api/leaderboard`) to only list users who have completed their initial profile setup (`profileSetupComplete: true`). Logged-in users who haven't completed setup now see a prominent "Setup your profile to join the race" banner.

- SEO audit remediation (from a third-party crawler report, 125 findings): fixed `components/PhysicsExperimentLanding.tsx`, a Client Component that server-rendered an empty `<main>` shell (mount-gated behind `useState`/`useEffect`) — root cause of "missing H1," "thin content" (24 words), and "duplicate content" findings across all 11 physics lab pages simultaneously; converted to a Server Component, now renders ~370+ words of real theory/FAQ content server-side. Fixed `app/computer-science/ClientGrid.tsx`'s heading skip (h1→h3, no h2) and added an optional `intro` paragraph, applied to all 6 hub pages using it (computer-science, code-lab, dsa, logic-gates, networking, ai-problem) to resolve "thin content." Found and fixed a metadata-inheritance bug the crawler under-reported: `/computer-science/dsa` and `/computer-science/dsa/sorting` were unnecessarily Client Components with no metadata of their own, silently inheriting the parent hub's title/description/canonical wholesale — gave both their own metadata following the working `logic-gates`/`networking` pattern, and replaced dsa/sorting's duplicated hand-rolled grid markup with the shared `ClientGrid`. Found (not in the crawler report) and fixed a `"| OpenLabs"` title-doubling bug live on `/chemistry`, `/biology`, and `/computer-science` (root layout's `title.template` was appending the site name a second time on top of an already-baked-in suffix) — empirically verified via live curl that Next's `title.template` does NOT cascade past one intervening layout with its own title, so nested subpages need the suffix baked in directly while top-level hub pages must not. Fixed `chemistry/periodictable`'s independent H2→H4 heading skip (4 separate instances). Trimmed title/meta-description length on ~20 static pages and 5 blog posts (via the admin API) to fit within typical SERP snippet limits.
- SEO fixes driven by real Google Search Console data (3-month export): added a `next.config.js` redirect sending the apex domain (`openlabs.org.in`) to the canonical `www.openlabs.org.in` host — GSC showed both being indexed as separate URLs, splitting ranking signal for identical content. Retitled `/computer-science/code-lab/js` (title/OG/twitter) to front-load "JavaScript Visualizer", the exact short phrase GSC showed real search volume for (171 impressions, 0.58% CTR at position ~7.5) that the old title wasn't converting. Added "Visualization" as explicit synonym coverage to the merge-sort DSA page's title/description (164 impressions, 0 clicks at position 9.49 for "merge sort visualization"). Rewrote the `edtech-labs-virtual-science-labs` blog post's `metaTitle`/`metaDescription` (via the admin API, content untouched) — that single post was ~25% of the entire site's search impressions (2,407) at a 0.08% CTR, badly dragging down aggregate site CTR.
- SEO cleanup: added 13 landing pages missing from `app/sitemap.ts` (all 6 AI-problem labs, all 7 logic-gate labs) that were previously undiscoverable via sitemap. Removed the Mathematics subject (`/maths/alzebra` — landing and interactive pages were both unfinished placeholder stubs) and the Java code lab (`/computer-science/code-lab/java` — interactive page was an empty stub) entirely: deleted the routes, dropped `/maths` from `robots.ts`/`middleware.ts`'s public-path lists, dropped `mathematics` from `app/lib/labs.ts`'s `Lab["subject"]` union, and removed every marketing/metadata/JSON-LD/`llms.txt` claim that either was a working feature (`app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `lib/llms.ts`, `README.md`, `REQUIREMENTS.md`) — both were reachable pages with SEO metadata promising functionality that didn't exist.
- Redesigned the site-wide `DailyChallengeCard` from a full-width in-flow banner (which covered a large share of each lab's initial view) into a floating, fixed-position widget: a pulsing "Daily Challenge" pill docked above the OpenLabsAI chat button (bottom-right) that expands into a compact popover panel on click. Zero page-space cost on every lab; same public props (`labId`, `currentParams`), so no lab needed changes.
- Completed the 4-phase JS Event Loop Visualizer rebuild (`app/labs/computer-science/code-lab/js`): (A) wired the `lib/runtime/*` sandbox engine into the UI with a free-form "write your own code" mode plus loop/recursion safety guards; (B) theme migration + responsive shell; (C) new event-loop concepts — simulated `fetch`, `requestAnimationFrame`, DOM click events, Node runtime mode (`process.nextTick`/`setImmediate`), unhandled-rejection tracking; (D) presets now execute through the same runtime engine as user code (single source of truth — hand-authored instruction timelines removed) with 4 new presets and a category-grouped example picker.
- Fully redesigned the JS Event Loop Visualizer UI as a "Live Dashboard": every runtime panel (code with active-line follow, Call Stack, Web APIs, Micro/Macro/rAF/Node queues, animated event-loop hub with per-step narration, console) is simultaneously visible on all viewports with zero page scroll; task chips animate between panels via Framer Motion `layoutId`; static help moved to a modal; playback bar (pinned, with console-output timeline markers) gained a compact mobile variant. Replaced 12 components with 9 new ones; engine/state logic untouched.
- JS Event Loop Visualizer shell sizing: the dashboard fills exactly one viewport (complete initial view, playback bar always visible on load) while the page remains scrollable below it to reach the global site footer.
- Added a new Biology lab: photosynthesis simulation.
- Added a simulator engine and core types for a JavaScript event-loop visualization lab.
- Added `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md`, `REQUIREMENTS.md`, and six Claude Code skills (`new-lab`, `sync-docs`, `audit-labs-registry`, `seo-page`, `env-doctor`, `new-blog-post`); fixed several README inaccuracies (broken TOC anchor, wrong model filename, wrong AI chat env var).
- Deep-crawled the full codebase (all API routes, models, hooks, lib helpers, every subject's lab components) to verify and substantially expand `CLAUDE.md`: full auth-bridge writeup (custom JWT ↔ NextAuth Google OAuth sync), exact XP/level formulas, both AI-chat integrations documented separately (`/api/chat` vs. the unauthenticated dead `/api/agent`), per-subject component conventions, complete env var list, and additional known-drift items (`useXP.ts` exporting a hook called `useLab`, `Navbar`/`Hero` hardcoding their own lab lists instead of reading `labs.ts`, `Project.ts`'s unguarded model-cache-clearing pattern, the `app/lib/devMock.js` dev-login bypass, and the Mathematics subject being an unfinished stub). Updated `AGENTS.md` and `REQUIREMENTS.md` with the same findings, kept short per each file's own scope.
- Added a seventh skill, `gamification-change`, documenting the duplicated streak/activity-log/XP-application logic between `/api/challenges/validate` and `/api/xp/complete` so future edits update both paths instead of drifting.
- Updated `README.md`: added the previously-undocumented Biology labs (photosynthesis, brain/neuron, blood), Chemistry's water-quality lab, and Physics' unregistered opticslens lab to the feature/route lists; corrected the Computer Science JS lab description (it's now an Event Loop Visualizer, not the older step-through debugger); added a Mathematics routes section flagging `alzebra` as an unfinished placeholder; refreshed the "Latest Updates" teaser and date stamp.
- Rolled out a site-wide light/dark theme toggle: added `next-themes`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`, and `animejs`; added `components/ThemeProvider.tsx`, `components/ui/{ThemeToggle,AmbientBackground,AnimatedCard}.tsx`, and `lib/utils.ts` (`cn()` helper); defined light/dark CSS custom properties in `app/globals.css` and matching semantic Tailwind tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-accent`, etc.) in `tailwind.config.js`; wired the provider and toggle into `app/layout.tsx`/`Navbar.tsx`. Converted the bulk of the site to the new tokens: all Physics and Chemistry lab components, most Biology components (most of that subject was already a self-contained dark UI and needed no change), most Computer Science lab components (DSA linked-list/queue/stack, all `git-simulator` panels, both `networking` switching labs), 23 of 58 `app/labs/**` wrapper pages, the admin blog CRUD pages, the profile pages, `setup-profile`, and the `OpenLabsAI`/`DailyChallengeCard` shared components. Verified with a full-project `tsc --noEmit` (zero errors) after each batch. Left several surfaces deliberately unconverted because they're permanently dark by design (code editors, terminals, a handful of labs with a fixed dark aesthetic) or because the color is data-encoding rather than chrome (sort/signal-state highlighting, periodic-table category colors, badge tiers) — see `CLAUDE.md` § Theming for the full list. Notable open item: the six DSA sorting-algorithm labs have their own pre-existing, independent light/dark toggle that is not yet reconciled with the new site-wide one.
- Registered the `physics/opticslens` lab in the central catalog (`app/lib/labs.ts`), enabling it to earn XP and receive daily challenges.
- Redesigned the login and signup pages to use a shared `components/AuthPage.tsx`, and expanded NextAuth to support GitHub and Azure AD OAuth providers alongside Google.

## 2026-06-25 — Analytics & CI stabilization

- Integrated Microsoft Clarity analytics with custom event tracking and user profile dashboard components; updated `llms.txt` generation to follow current recommendations.
- Fixed the GitHub Actions guard workflow (npm auth/env issues) after several iterations.

## 2026-06-10 — 2026-06-14 — Branding & UX polish

- Updated favicon/nav logo and general SEO tuning.
- Added `OpenLabsAILoader` for conditional AI chat loading based on auth state.
- Updated educational landing-page layout styles and added schema.org markup for learning resources.
- Redesigned the profile page UI.

## 2026-05-30 — 2026-06-01 — Site-wide restructure for SEO

- Restructured the project layout for better Google/AI search ranking.
- Fixed sitemap regeneration cadence (every 12h) and revised daily-challenge/XP logic.
- Refactored logic-gate pages to use centralized gate content and metadata generation.
- Added/redesigned Physics and Chemistry lab pages; fixed CS pages and periodic-table element modal responsiveness.
- Reorganized the blockchain lab's ID in `labs.ts` for better categorization; added `sharp` for image processing.

## 2026-05-24 — 2026-05-31 — Blog, gamification polish, chatbot hardening

- Integrated a Cloudinary-powered blog engine, a responsive profile dashboard, and further SEO optimizations.
- Added auth gating, rate-limiting, off-topic filters, and scrolling UX improvements to the AI chatbot.
- Redesigned the daily-challenge card; updated README.
- Fixed blog visibility, robots.txt, and middleware rules to make blog pages public.

## 2026-05-09 — 2026-05-18 — Accounts, profiles, gamification

- Implemented user authentication and profile management (username setup, avatar, bio).
- Introduced the daily-challenges, XP, levels, and badges system.
- Improved searchability: sitemap/canonical URL fixes, meta title/description fixes, removed a dead maths URL from the sitemap.

## 2026-03-29 — Infra fixes

- Fixed a database connection problem and upgraded the guard package version.
- Updated the GitHub Actions workflow for npm authentication and added required permissions.

## 2026-02-21 — 2026-02-28 — Computer Science & Biology expansion

- Added logic gates (AND/OR/NAND/NOR/XOR/XNOR) pages.
- Added a JavaScript execution visualizer, a Git command simulator, and Vercel Speed Insights/Analytics.
- Added an AI chatbot for explaining experiments, including speech-to-text input.
- Added sorting algorithm visualizations and a Stack/Queue/Linked-List data structure visualizer; later redesigned the sorting simulations.
- Added computer networking pages (circuit builder, packet switching, topology builder, OSI model).
- Added AI problems, blockchain understanding, data science, and data analysis sections.
- Added water-quality assessor, blood group simulator, and brain-neuron signal simulator (Biology).

## 2026-02-06 — 2026-02-08 — Auth hardening & polish

- Added a Computer Science code lab with an HTML/CSS/JS editor and project management.
- Added the private `@hackeryard` auth/guard package and GitHub Packages npm configuration.
- Added LICENSE (later changed to Proprietary with a trademark notice).
- Added professional custom error pages, enhanced navigation, and a lab discovery hub; added a JS debugger and subject-specific error pages.

## 2026-01-20 — 2026-02-03 — Auth & Biology foundations

- Added the authentication system with email OTP verification.
- Added interactive Biology pages: human anatomy and cell structures, including a 3D human anatomy model.

## 2025-12-21 — 2026-01-04 — Project bootstrap

- Initial commit and project scaffold.
- Added Chemistry reaction-simulation page with Framer Motion animation.
- Added 3D lab/atomic views for chemical reaction simulations.
