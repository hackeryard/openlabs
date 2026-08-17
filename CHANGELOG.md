# Changelog

All notable changes to OpenLabs are documented in this file. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); since the project has no version tags yet, entries are grouped by date instead of version number. Generated from git history; merge commits and duplicate/typo commits are omitted.

## Unreleased

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
