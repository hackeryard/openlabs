// app/lib/pageKnowledge.ts

import { resolveLabIdFromPath } from "./labs";

export type PageKnowledge = {
  title: string;
  overview: string;
  howToUse?: string[];
  controls?: string[];
  keyConcepts?: string[];
  whatToTry?: string[];
  commonMistakes?: string[];
  glossary?: Record<string, string>;
};

// ── 1. GLOBAL & SUBJECT HUB KNOWLEDGE ─────────────────────────────────────────

const HUB_KNOWLEDGE: Record<string, PageKnowledge> = {
  "/": {
    title: "OpenLabs Home",
    overview:
      "Landing page for OpenLabs, an interactive open-source playground for Physics, Chemistry, Biology, Computer Science, and Mathematics experiments.",
    howToUse: [
      "Select any discipline card (Physics, Chemistry, Biology, Computer Science, Mathematics) to explore subject hub suites.",
      "Click 'Launch Lab' on any experiment card to enter the full interactive simulation workbench.",
      "Check the Daily Challenge banner or leaderboard to participate in daily gamified challenges.",
      "Open the OpenLabs AI Assistant at any time for real-time explanations, formula derivations, and experiment guidance.",
    ],
    keyConcepts: [
      "Interactive in-browser simulations powered by Canvas, WebGL, D3, and Three.js.",
      "Gamification layer: XP rewards, level progression, daily streaks, and skill badges.",
      "Two-tier structure: Public SEO/curriculum landing pages and authenticated simulation labs.",
    ],
    whatToTry: [
      "Ask: 'Which lab should I try first if I want to study for AP Physics 1?'",
      "Ask: 'Show me the recommended learning path for Computer Science.'",
    ],
  },
  "/physics": {
    title: "Physics Discipline Hub",
    overview:
      "Comprehensive suite of interactive physics laboratories spanning Classical Mechanics, Electromagnetism, Wave & Geometric Optics, Thermodynamics, and Quantum Physics.",
    howToUse: [
      "Use the search bar and category filter chips (Mechanics, Electricity & Magnetism, Optics, Thermodynamics, Modern Physics) to locate simulations.",
      "Review the 4-step practical investigation protocols and governing mathematical matrices before entering simulations.",
      "Click 'Launch Experiment' on any card to access full parameter sliders, multimeters, oscilloscopes, and real-time graphs.",
    ],
    keyConcepts: [
      "Newtonian Kinematics & Conservation of Energy/Momentum",
      "Ohm's Law, RC circuit time constants, and Faraday electromagnetic induction",
      "Wave diffraction, thin lens equations, and Young's double-slit interference",
      "Carnot thermodynamic engine cycles and Photoelectric quantum work functions",
    ],
  },
  "/chemistry": {
    title: "Chemistry Discipline Hub",
    overview:
      "Interactive chemistry laboratories covering Periodic Trends, Chemical Bonding, Acid-Base Titrations, Molecular Geometry (VSEPR), Electrochemistry, and Gas Laws.",
    howToUse: [
      "Filter by Physical Chemistry, Inorganic Trends, Organic Mechanisms, or Analytical Titrations.",
      "Open interactive models to manipulate burettes, rotate 3D orbital geometries, and test galvanic cell voltages.",
    ],
    keyConcepts: [
      "Atomic structure, electron configurations, and periodic electronegativity trends",
      "Volumetric acid-base titration equivalence points and indicator transitions",
      "VSEPR molecular geometries, hybridization, and dipole moment vectors",
      "Redox potentials, Nernst equation, and Maxwell-Boltzmann kinetic energy distributions",
    ],
  },
  "/biology": {
    title: "Biology Discipline Hub",
    overview:
      "Interactive life sciences studio featuring 3D Cellular Cytology, Mendelian Genetics, Molecular Biology (Central Dogma), Enzyme Kinetics, and Human Organ Systems.",
    howToUse: [
      "Navigate to dedicated parent subtopic suites: Cell Structure & Cytology, Genetics & Heredity, or Physiology.",
      "Use 3D orbit controls to dissect organelles, execute multi-trait Punnett squares, or simulate mitochondrial electron transport.",
    ],
    keyConcepts: [
      "Eukaryotic animal and plant organelle ultrastructure and membrane transport",
      "Monohybrid/Dihybrid inheritance ratios (3:1, 9:3:3:1) and DNA transcription/translation",
      "Michaelis-Menten enzyme catalysis, competitive inhibition, and Lineweaver-Burk plots",
      "Cellular respiration ATP synthesis and osmotic tonicity pressure gradients",
    ],
  },
  "/computer-science": {
    title: "Computer Science Discipline Hub",
    overview:
      "Interactive computing laboratories spanning Data Structures & Algorithms, Digital Logic Gates, Computer Networking, JavaScript Event Loop, Cryptography, and CPU Micro-Architecture.",
    howToUse: [
      "Select a domain: Sorting & DSA, Digital Logic, Networking Suites, Web Code Labs, or Cryptography.",
      "Step through algorithms line-by-line, manipulate 8-bit CPU registers, build network topologies, or write live code.",
    ],
    keyConcepts: [
      "Big-O asymptotic time and space complexity",
      "JavaScript single-threaded call stack, microtask queue, and event loop ordering",
      "OSI 7-layer protocol stack and packet/circuit switching",
      "Boolean algebra, combinational logic gates, and asymmetric Diffie-Hellman / RSA cryptography",
    ],
  },
  "/mathematics": {
    title: "Mathematics Discipline Hub",
    overview:
      "Interactive pure and applied mathematics laboratory featuring Function Graphers, Trigonometry Unit Circles, Calculus Limits & Riemann Sums, Linear Algebra Matrix Transformations, Complex Fractals, and Differential Equations.",
    howToUse: [
      "Select an interactive mathematical studio (e.g. Function Grapher, Linear Algebra, Differential Equations).",
      "Adjust transformation sliders, drag geometric points, compute roots/extrema, or step through RK4 numerical integrators.",
    ],
    keyConcepts: [
      "2D Cartesian curve transformations: a·f(b(x - h)) + k",
      "Unit Circle trigonometry and Pythagorean identities",
      "Matrix determinants as signed area scaling and eigenvector transformations",
      "Euler/Heun/RK4 slope field integration, Lotka-Volterra orbits, and 3D Lorenz chaos",
    ],
  },
};

// ── 2. COMPREHENSIVE LAB KNOWLEDGE DIRECTORY (ALL 53 LABS) ────────────────────

const LAB_KNOWLEDGE: Record<string, PageKnowledge> = {
  // ────────────────── PHYSICS LABS ──────────────────
  "physics/freefall": {
    title: "Free Fall & Terminal Velocity Physics Studio",
    overview:
      "Comprehensive gravitational kinematics and aerodynamic fluid dynamics simulation. Features vacuum free fall, quadratic drag force, terminal velocity, stroboscopic flash trails, dual-chamber simultaneous drops, and planetary gravity environments (Earth, Moon, Mars, Jupiter, Vacuum).",
    howToUse: [
      "Select a Planetary Gravitational Environment (Earth, Moon, Mars, Jupiter, or Vacuum Chamber).",
      "Choose falling bodies (Bowling Ball, Feather, Tennis Ball, Skydiver, Steel Bearing, or Custom Mass/Cd).",
      "Enable Dual Drop mode to compare 2 objects side-by-side (e.g. Feather vs Bowling Ball).",
      "Set initial drop height (5m to 150m) and initial velocity (-20 m/s to +40 m/s).",
      "Click 'Drop Object' to begin numerical integration and observe real-time vector overlays (v, g, F_drag) and stroboscopic ghost flashes.",
      "Switch telemetry tabs between Velocity v(t), Height y(t), Acceleration a(t), and Energy Conservation (KE vs PE).",
    ],
    controls: [
      "Environment presets: Earth (9.81 m/s², 1.225 kg/m³), Vacuum (9.81 m/s², 0 kg/m³), Moon (1.62 m/s²), Mars (3.72 m/s²), Jupiter (24.79 m/s²)",
      "Object physical properties: Mass (m), Radius (r), Drag Coefficient (Cd), Elastic Restitution (e)",
      "Launch altitude slider (5m to 150m) and Initial velocity slider (-20 m/s to +40 m/s)",
      "Overlay toggles: Kinematic Vectors, Stroboscopic Ghost Trail (Δt interval), Dual Chamber Drop",
      "Telemetry chart selector: y(t), v(t) with terminal velocity asymptote, a(t), Mechanical Energy balance",
      "Guided experiment presets: Galileo Pisa, Apollo 15 Lunar Drop, Skydiver Terminal Velocity, Vertical Toss Apex",
    ],
    keyConcepts: [
      "Galilean Invariance of Free Fall: In vacuum, all bodies fall with equal acceleration a = -g regardless of mass or shape.",
      "Quadratic Fluid Drag: F_drag = ½ · ρ · C_d · A · v² (opposes instantaneous velocity vector).",
      "Terminal Velocity (v_t): Reached when upward drag equals downward weight (F_drag = mg) yielding zero net acceleration: v_t = √((2·m·g) / (ρ·C_d·A)).",
      "Kinematics in Vacuum: v(t) = v₀ - gt, y(t) = y₀ + v₀t - ½gt², v² = v₀² - 2g(y - y₀).",
      "Energy Conservation: In vacuum, total mechanical energy E = KE + PE = ½mv² + mgy is strictly conserved. In atmosphere, mechanical energy dissipates into thermal work: W_drag = ∫ F_drag dy.",
    ],
    whatToTry: [
      "Launch 'Galileo Pisa Experiment' and drop a Feather and Bowling Ball in Vacuum: verify both hit the ground at the exact same millisecond.",
      "Switch to Earth Atmosphere and drop the Feather vs Bowling Ball: observe the feather instantly reach terminal velocity while the bowling ball continues accelerating.",
      "Drop a Skydiver from 120m on Earth and observe the v(t) graph asymptote leveling off at ~54 m/s (194 km/h).",
      "Set initial velocity to +25 m/s upward on Mars and watch the velocity decelerate through zero at maximum apex height.",
    ],
  },

  "physics/projectilemotion": {
    title: "Projectile Motion & Ballistics Studio",
    overview:
      "Comprehensive 2D projectile kinematics and aerodynamic ballistics simulation. Features rotary cannon angle aiming, launch elevation cliffs, quadratic air drag, crosswind/headwind forces, multi-trajectory overlays, dynamic bullseye targets, and planetary gravity presets (Earth, Moon, Mars, Jupiter, Vacuum).",
    howToUse: [
      "Select a Planetary Gravitational Environment (Earth, Moon, Mars, Jupiter, or Vacuum).",
      "Set Rotary Cannon Launch Angle (0° to 90°), Initial Velocity (5 m/s to 100 m/s), and Cliff Platform Elevation (0m to 100m).",
      "Choose a Projectile Payload (Iron Cannonball, Baseball, Golf Ball, Artillery Shell, or Light Vane Arrow).",
      "Adjust Headwind / Tailwind sliders and set target distance.",
      "Click 'Fire Cannon' to launch the projectile and trace real-time parabolic flight path and kinematic vector arrows.",
      "Inspect Multi-Trajectory overlays to compare consecutive shots or switch telemetry tabs to inspect y(x) trajectory and speed curves.",
    ],
    controls: [
      "Rotary Cannon Aim Dial & Angle Slider (0° to 90°)",
      "Launch Velocity Slider (5 m/s to 100 m/s) with real-time (v0x, v0y) decomposition",
      "Elevation Cliff Slider (0m to 100m)",
      "Planetary Gravitation presets: Earth (9.81 m/s²), Vacuum (9.81 m/s²), Moon (1.62 m/s²), Mars (3.72 m/s²), Jupiter (24.79 m/s²)",
      "Headwind / Tailwind speed slider (-20 m/s to +20 m/s)",
      "Draggable Bullseye Landing Target with hit score counter",
      "Overlay toggles: Velocity Vectors, Theoretical Ideal Arc, Distance Grid",
      "Guided Discovery Presets: Max Range at 45°, Complementary Launch Angles, Cliff Elevation, Air Drag Tear-Drop, Lunar Super Range",
    ],
    keyConcepts: [
      "Independence of Orthogonal Axes: Horizontal velocity (vx) and vertical velocity (vy) evolve independently.",
      "Ideal Vacuum Kinematics: x(t) = v0·cos(θ)·t, y(t) = y0 + v0·sin(θ)·t - ½gt².",
      "Horizontal Range in Vacuum: R = (v0²·sin(2θ)) / g (maximum on level ground at θ = 45°).",
      "Complementary Angle Symmetry: sin(2θ) = sin(2(90° - θ)), producing identical horizontal range for angle pairs summing to 90°.",
      "Elevation Platform Optimal Angle: When launching from height y0 > 0, optimal angle shifts below 45°: θ_opt = arctan(v0 / √(v0² + 2gy0)).",
      "Quadratic Fluid Drag: F_drag = ½ · ρ · C_d · A · v² creates an asymmetric tear-drop trajectory with steeper descent.",
    ],
    whatToTry: [
      "Fire the cannon at 30° and then at 60° with 30 m/s in Vacuum: verify both arcs land on the exact same distance marker.",
      "Raise the cliff platform to 30m and find the new optimal launch angle for maximum range (notice it is ~35°, lower than 45°).",
      "Switch from Cannonball to Light Vane Arrow on Earth and observe how high air drag shortens the range and steepens the descent angle.",
      "Switch to Moon gravity (1.62 m/s²) and fire a golf ball at 45° to observe massive ~385m flight range.",
    ],
  },

  "physics/simplependulum": {
    title: "Simple Pendulum & Harmonic Motion Studio",
    overview:
      "Comprehensive Simple Pendulum and Non-Linear Harmonic Oscillator simulation. Features exact Runge-Kutta (RK4) numerical integration, small-angle approximation vs large-angle elliptic period corrections, phase-space trajectories (ω vs θ), energy conservation exchange, photogate laser period timing, and planetary gravitation environments.",
    howToUse: [
      "Select a Planetary Environment (Earth, Moon, Mars, Jupiter, Vacuum) or customize gravity.",
      "Adjust String Length (0.1m to 5.0m), Bob Mass (0.1kg to 10kg), Release Angle (-170° to +170°), and Air Damping via sliders or direct typing.",
      "Click 'Start Swing' to simulate the pendulum motion with tension, gravity, and restoring force vector overlays.",
      "Observe the Photogate Laser Sensor automatically capture zero-crossings at equilibrium (θ = 0) and measure the true oscillation period.",
      "Switch telemetry tabs to inspect the θ(t) wave, the phase-space portrait (ω vs θ limit cycles and damping spirals), and the PE/KE energy balance.",
    ],
    controls: [
      "String Length slider & numeric input (0.1m to 5.0m)",
      "Initial Release Angle slider & numeric input (-170° to +170°)",
      "Bob Mass slider & numeric input (0.1kg to 10kg)",
      "Air Damping friction slider & numeric input (0 to 0.5 s⁻¹)",
      "Planetary Gravitation presets: Earth (9.81 m/s²), Moon (1.62 m/s²), Mars (3.72 m/s²), Jupiter (24.79 m/s²), Vacuum",
      "Overlays: Force Vectors (Gravity, Tension, Restoring), Protractor Angle Dial, Photogate Sensor",
      "Telemetry views: θ(t) Angular Wave, Phase-Space Portrait (ω vs θ), Mechanical Energy Bar",
      "Guided Discovery Presets: Small-Angle Parity, Large-Angle Non-Linearity, Lunar Slow-Motion, Damped Decay Spiral, Mass Independence",
    ],
    keyConcepts: [
      "Exact Non-Linear Equation: d²θ/dt² = -(g/L)sin θ - γ(dθ/dt).",
      "Small-Angle Linear Limit: For θ ≤ 15°, sin θ ≈ θ (in radians), giving Simple Harmonic Motion with period T0 = 2π√(L/g).",
      "Large-Angle Period Elongation: T ≈ T0(1 + ¼sin²(θ0/2) + 9/64sin⁴(θ0/2)), taking ~18% longer at 90° release angle.",
      "Energy Conservation: Continuous exchange between Gravitational Potential Energy Ep = mgL(1 - cos θ) and Kinetic Energy Ek = ½mL²ω².",
      "Phase-Space Representation: Trajectory in (θ, ω) coordinates forms closed orbits for undamped conservative motion, and inward spirals for damped dissipative motion.",
    ],
    whatToTry: [
      "Set release angle to 12° and verify measured period matches T0 = 2π√(L/g) within 0.2% error.",
      "Set release angle to 90° and observe the measured period expand by ~18% due to non-linear restoring force weakening.",
      "Change bob mass from 0.5kg to 5.0kg and verify that the oscillation period remains completely unchanged.",
      "Switch to Moon gravity (1.62 m/s²) with 1.0m length and observe the period increase to ~4.94s.",
    ],
  },

  "physics/hookelaw": {
    title: "Hooke's Law, Springs & Coupled Oscillations Studio",
    overview:
      "Comprehensive multi-spring physics simulator investigating elastic restoring forces, Single, Series, and Parallel spring combinations, exact harmonic motion integration, elastic potential energy, planetary gravities, and mystery mass gravitational calibration.",
    howToUse: [
      "Select a Spring Arrangement: Single Spring (k_eff = k₁), Parallel Springs (k_eff = k₁ + k₂), or Series Springs (1/k_eff = 1/k₁ + 1/k₂).",
      "Adjust spring constants (k₁, k₂ in N/m), suspended load mass (kg), initial release stretch (m), and air damping using sliders or direct numeric inputs.",
      "Switch Planetary Gravity (Earth, Moon, Mars, Jupiter, Zero-G Space Lab) to observe static displacement and natural harmonic oscillations.",
      "Use the Mystery Mass mode (Red, Green, Amber) to weigh unknown masses using Hooke's Law m = (k·Δx_eq)/g.",
      "Inspect the Force vs Displacement (F-x) graph to verify linear slope k and elastic energy area Ue = ½k(Δx)².",
    ],
    controls: [
      "Spring constant sliders & numeric inputs (k₁, k₂: 5 to 150 N/m)",
      "Suspended Mass slider & numeric input (0.1kg to 10kg)",
      "Multi-Spring Arrangement: Single, Parallel (k₁ + k₂), Series (k₁k₂/(k₁ + k₂))",
      "Mystery Mass Weighing Mode: Known Load, Red (0.75kg), Green (1.85kg), Amber (3.20kg)",
      "Initial Release Stretch slider & numeric input (0.05m to 1.5m)",
      "Viscous Damping friction slider & numeric input (0 to 0.5 N·s/m)",
      "Planetary Gravitation presets: Earth (9.81 m/s²), Moon (1.62 m/s²), Mars (3.72 m/s²), Jupiter (24.79 m/s²), Zero-G (0 m/s²)",
      "Overlays: Measuring Ruler, Equilibrium Marker (x_eq), Restoring & Gravity Force Vectors",
      "Telemetry views: x(t) Position Wave, F vs Δx Linear Slope, Energy Conservation Bar",
      "Guided Discovery Presets: Linear Hooke's Law, Parallel Stiffness, Series Compliance, Mystery Mass Calibration, Zero-G Oscillation",
    ],
    keyConcepts: [
      "Hooke's Law: Fs = -k·Δx (restoring force is directly proportional and opposite to displacement).",
      "Static Equilibrium: At rest, upward spring force balances gravity: k·Δx_eq = mg ⇒ Δx_eq = (mg)/k.",
      "Parallel Springs: Share the load with identical stretch: k_eff = k₁ + k₂ (stiffness increases).",
      "Series Springs: Share the same tension with additive stretches: 1/k_eff = 1/k₁ + 1/k₂ (compliance increases).",
      "Harmonic Oscillation Period: T = 2π√(m/k_eff), independent of gravity g and initial amplitude.",
      "Elastic Energy: Ue = ½k(Δx)², representing the area under the F vs Δx line.",
    ],
    whatToTry: [
      "Set k₁ = 20 N/m and m = 2.0kg in Single vs Parallel mode: verify parallel doubles stiffness to 40 N/m and cuts extension in half.",
      "Set arrangement to Series with two 30 N/m springs: verify effective stiffness drops to 15 N/m and doubles total stretch.",
      "Select the Red Mystery Mass on Earth with k = 25 N/m, let it settle at equilibrium, and calculate its mass m = (25 × Δx)/9.81.",
      "Switch to Zero-G (g = 0): verify equilibrium is at x = 0 and mass oscillates symmetrically without gravitational bias.",
    ],
  },

  "physics/ohmslaw": {
    title: "Ohm's Law & Circuit Simulation Workbench",
    overview:
      "Full-featured electrical circuit builder simulating DC and AC circuits, node voltages, resistor networks, transient capacitor dynamics, and real-time multimeter diagnostics.",
    howToUse: [
      "Drag components (DC/AC voltage sources, resistors, capacitors, switches, lightbulbs) onto the grid breadboard.",
      "Click terminals to draw connecting copper wires and build closed loops.",
      "Place the digital multimeter probes across any component to measure Voltage (V) or in series for Current (I).",
      "Use the virtual Oscilloscope to inspect live AC waveforms and capacitor charging transients.",
    ],
    controls: [
      "Component toolbar: Resistor, DC Source, AC Sine Generator, Capacitor, Switch, Ground, Lightbulb",
      "Voltage slider (0V to 120V) and Resistance slider (1Ω to 100kΩ)",
      "Interactive Digital Multimeter (Voltage, Current, Resistance modes)",
      "Dual-channel Oscilloscope with Time/Div and Volts/Div dials",
    ],
    keyConcepts: [
      "Ohm's Law: V = I·R, I = V/R, R = V/I",
      "Joule's Heating / Electric Power: P = V·I = I²R = V²/R",
      "Kirchhoff's Voltage Law (KVL): Sum of potential differences around any closed loop is zero",
      "Kirchhoff's Current Law (KCL): Total current entering any node equals total current leaving",
    ],
    whatToTry: [
      "Build a voltage divider circuit with two resistors in series and measure intermediate node voltage.",
      "Create a short circuit with zero resistance to observe current surge and fuse protection.",
    ],
  },

  "physics/rclab": {
    title: "RC Circuits & Transient Simulation Studio",
    overview:
      "Full-featured series RC circuit simulator modeling capacitor charging, exponential voltage discharge decay, RC time constants (τ = RC), dual-channel oscilloscope telemetry, and low-pass filter frequency response.",
    howToUse: [
      "Select an Operating Signal Mode: DC Switch (Charge / Discharge / Open), Continuous Square Wave Pulse, or AC Sine Wave Filter.",
      "Adjust circuit component values: Resistance (R in Ω), Capacitance (C in μF), and Source Voltage (Vs in V) using sliders or direct numeric inputs.",
      "In DC Switch mode, toggle between Charge (connect to Vs) and Discharge (connect to ground) to observe exponential voltage curves.",
      "Inspect the virtual Dual-Channel Oscilloscope displaying Channel 1 (Vc in yellow), Channel 2 (VR in cyan), and Source Voltage (Vin in purple).",
      "Switch to AC Sine Wave mode to observe low-pass filter cutoff frequency (fc = 1 / 2πRC) and phase lag.",
    ],
    controls: [
      "Resistance slider & manual input (10Ω to 100kΩ)",
      "Capacitance slider & manual input (1μF to 1000μF)",
      "Supply Voltage slider & manual input (1V to 24V)",
      "Signal Mode Selector: DC Switch, Square Wave Generator, AC Low-Pass Filter",
      "SPDT Switch Position: Charge, Discharge, Open (Isolated)",
      "Signal Frequency slider (0.1Hz to 20Hz)",
      "Visual Overlays: Animated Electron Flow, Dielectric Electric Field Lines",
      "Oscilloscope telemetry views: Voltage (Vc & VR), Current I(t), Stored Electrostatic Energy (Uc)",
      "Guided Discovery Presets: 63.2% Charging Rule, Exponential Discharge Decay, Square Wave Integrator, Low-Pass Cutoff, Fast Micro-Transient",
    ],
    keyConcepts: [
      "Time Constant: τ = RC (seconds), representing the time to reach 63.2% full charge or discharge to 36.8%.",
      "Charging Equation: Vc(t) = Vs(1 - e^(-t/τ)), with charging current I(t) = (Vs/R)e^(-t/τ).",
      "Discharging Equation: Vc(t) = V0·e^(-t/τ), with discharging current I(t) = -(V0/R)e^(-t/τ).",
      "Kirchhoff's Voltage Law: Vin(t) = VR(t) + Vc(t) at every instantaneous moment in time.",
      "Stored Electrostatic Energy: Uc = ½CVc² (Joules). Exactly 50% of source energy is stored; 50% is lost to resistor heat.",
      "Low-Pass Filter Cutoff: fc = 1 / (2πRC) (Hz), where output voltage drops to 70.7% (-3dB) of input amplitude.",
    ],
    whatToTry: [
      "Set R = 10kΩ and C = 100μF (τ = 1.00s) with 10V supply, start charging, and verify voltage reaches 6.32V at exactly t = 1.0s.",
      "After full charge, toggle switch to Discharge: observe voltage decay to 3.68V at t = 1.0s and 0.50V at t = 3.0s.",
      "Switch to Square Wave mode at 2.5Hz with τ = 200ms: observe smooth triangular/exponential wave shaping.",
      "Switch to AC Sine mode with fc = 1.0Hz: compare output amplitude at 0.1Hz (passband), 1.0Hz (cutoff 70.7%), and 10Hz (attenuated).",
    ],
  },

  "physics/energyconservation": {
    title: "Conservation of Mechanical Energy & Roller Coaster Studio",
    overview:
      "Full-featured classical mechanics and thermodynamics studio modeling continuous gravitational potential energy (mgh), kinetic energy (½mv²), and thermal friction work dissipation along customizable roller coaster tracks and vertical loops.",
    howToUse: [
      "Select a Track Configuration: Loop-the-Loop Challenge, Double Valley, Single Slope, or Custom Multi-Node Spline.",
      "Configure simulation parameters: Cart Mass (10kg to 2000kg), Track Friction Coefficient (μk), and Planetary Gravity (Earth, Moon, Mars, Jupiter, Zero-G).",
      "Launch the coaster cart from the top of the ramp and observe real-time Energy Conservation bar balances and the floating pie chart above the cart.",
      "Examine Normal Force (FN) and G-Force telemetry during high-speed valley compressions and hill crest weightlessness (0g).",
      "In Loop-the-Loop mode, test whether the initial drop height satisfies the critical condition (h_min = 2.5R) to prevent cart detachment at the loop apex.",
    ],
    controls: [
      "Cart Mass slider & manual input (10kg to 2000kg)",
      "Track Friction slider & manual input (μk = 0 to 0.20)",
      "Planetary Gravitation selector: Earth (9.81 m/s²), Moon (1.62 m/s²), Mars (3.72 m/s²), Jupiter (24.79 m/s²), Zero-G Lab",
      "Track Configuration selector: Loop-the-Loop, Double Valley, Single Slope, Custom Spline",
      "Visualization Overlays: Floating Energy Pie Chart over cart, Velocity & Normal Force Vector arrows",
      "Continuous Mechanical Energy Balance Bar: Potential Energy (sky blue), Kinetic Energy (emerald), Thermal Dissipation (amber)",
      "Telemetry metrics: Total Energy (kJ), Speed (m/s), Altitude (m), Normal G-Force (g)",
      "Guided Discovery Presets: Critical Loop Apex (h_min = 2.5R), Frictionless Hill Interchange, Thermal Dissipation, Lunar Coaster, Apex Weightlessness",
    ],
    keyConcepts: [
      "Law of Conservation of Energy: E_total = PE + KE + E_thermal = constant at all times.",
      "Gravitational Potential Energy: PE = m·g·y (Joules).",
      "Translational Kinetic Energy: KE = ½m·v² (Joules).",
      "Non-Conservative Friction Work: E_thermal = ∫(μk·m·g·cosθ) ds.",
      "Critical Vertical Loop Apex Condition: v_apex ≥ √(gR) requires minimum release height h_min = 2.5R so that normal force FN ≥ 0.",
      "Centripetal Acceleration & G-Forces: FN = m(v²/R + g·cosθ), creating high G-force loads in valleys and 0g weightlessness at hill crests.",
    ],
    whatToTry: [
      "Launch from h = 35m into a loop of radius R = 11.5m (where h_min = 28.75m) and verify the cart completes the loop with positive normal force.",
      "Reduce drop height to h = 20m and observe how normal force drops to 0 and the cart detaches at the top of the loop.",
      "Set μ = 0 (frictionless) and verify that Total Mechanical Energy (PE + KE) remains strictly 100% constant throughout all track undulations.",
      "Increase friction to μ = 0.08 and observe exponential damping of oscillatory motion as mechanical energy converts entirely into heat.",
    ],
  },

  "physics/speedoflight": {
    title: "Speed of Light Measurement & Time-of-Flight Studio",
    overview:
      "Simulates historical and modern speed of light determinations: Fizeau toothed-wheel apparatus (1849), Foucault rotating mirror, multi-media refractive speed races (Vacuum, Air, Water, Glass, Diamond), and picosecond time-of-flight telemetry.",
    howToUse: [
      "Select experiment mode: Fizeau Toothed Wheel, Media Race, or Michelson Interferometer.",
      "In Fizeau mode, adjust baseline distance D (km), wheel teeth count N, and rotation speed ω (rps) to find the first extinction minimum.",
      "In Media Race mode, trigger laser pulses to observe phase velocities v = c / n across different dielectric materials.",
      "Inspect the live time-of-flight Δt, medium speed v, and transmission intensity I/I₀.",
    ],
    controls: [
      "Mode selector: Fizeau Wheel / Media Race / Interferometer",
      "Baseline distance D slider (0.001 km to 384,400 km for Apollo lunar)",
      "Wheel teeth count N slider (100 to 1440 teeth)",
      "Rotation speed ω slider (0 to 100 rev/sec)",
      "Optical medium selector (Vacuum n=1.000, Air n=1.00029, Water n=1.333, Glass n=1.517, Diamond n=2.417)",
    ],
    keyConcepts: [
      "Exact Constant in Vacuum: c = 299,792,458 m/s (1983 SI definition of the metre)",
      "Fizeau Extinction Equation: c = 4 · N · D · ω (at first transmission minimum)",
      "Medium Phase Velocity: v = c / n",
      "Round-Trip Time-of-Flight: Δt = 2D / v",
      "Special Relativity: Speed of light c is invariant across all inertial reference frames",
    ],
    whatToTry: [
      "Recreate Fizeau's 1849 experiment: set D = 8.633 km, N = 720 teeth, and find extinction at ω ≈ 12.6 rps.",
      "Compare photon speeds in Vacuum vs Diamond (n = 2.417) to observe a ~59% velocity drop down to 124,000 km/s.",
      "Switch to Apollo Lunar Laser Ranging preset to measure the 2.564s Earth-Moon round trip time-of-flight.",
    ],
  },

  "physics/uniformmotionlab": {
    title: "Uniform Motion & Multi-Body Kinematics Studio",
    overview:
      "Simulates 1D linear kinematics, constant velocity, uniform acceleration, live velocity/acceleration vector overlays, two-body pursuit races (Car A vs Car B), 50 Hz ticker-tape stroboscopy, and synchronized x-t, v-t, a-t graphs.",
    howToUse: [
      "Select kinematics mode: Single Cart, Pursuit Race, or Ticker Tape.",
      "Adjust initial position (x₀), initial velocity (v₀), and constant acceleration (a) via sliders or direct numeric typing.",
      "In Pursuit mode, configure Car B interceptor parameters (v₀B, aB) to analyze overtaking points.",
      "Toggle between synchronized x-t, v-t, and a-t graphs and inspect live slopes and shaded displacement areas.",
    ],
    controls: [
      "Mode selector: Single Cart / Pursuit Race / Ticker Tape",
      "Initial position x₀ slider (-50m to 100m)",
      "Initial velocity v₀ slider (-30 m/s to 50 m/s)",
      "Acceleration a slider (-15 m/s² to 15 m/s²)",
      "Graph mode selector: x(t) Position / v(t) Velocity / a(t) Acceleration",
    ],
    keyConcepts: [
      "Big 4 Kinematic Equations: v = v₀ + at, x = x₀ + v₀t + ½at², v² = v₀² + 2aΔx, Δx = ½(v₀ + v)t",
      "Calculus Relationships: Instantaneous velocity v = dx/dt; instantaneous acceleration a = dv/dt",
      "Integral Area: Area under v-t graph = ∫ v dt = displacement Δx",
      "Emergency Braking Distance: d_stop = v₀² / (2|a|) (scales quadratically with initial speed)",
      "Pursuit Interception Condition: x_A(t) = x_B(t)",
    ],
    whatToTry: [
      "Run Emergency Braking Preset (v₀ = 25 m/s, a = -5 m/s²) to verify that d_stop = 62.5m and stopping time t = 5.0s.",
      "Test Police Interceptor Pursuit to observe Car B overtake Car A at t = 16.0s at x = 320m.",
      "Set v₀ = 18 m/s with a = -3 m/s² and watch the velocity vector shrink to zero at t = 6s before reversing direction.",
    ],
  },

  "physics/waveoptics": {
    title: "Wave Optics, Diffraction & Young's Double-Slit Studio",
    overview:
      "Simulates electromagnetic wave interference, single-slit Fraunhofer diffraction, Young's double-slit experiments, diffraction gratings, 2D Huygens wavelet propagation, and live spectral intensity envelopes.",
    howToUse: [
      "Select an aperture mode: Double-Slit (Young's), Single-Slit Diffraction, or Diffraction Grating.",
      "Tune laser wavelength λ (380nm to 750nm) or choose a standard laser preset (He-Ne 632.8nm, Argon 488nm, Green 532nm).",
      "Adjust slit width a (µm), slit separation d (µm), and screen distance D (m).",
      "Observe animated 2D Huygens wavelets and hover over the photographic fringe projection screen or graph to inspect exact intensity I/I₀.",
    ],
    controls: [
      "Aperture mode: Double Slit, Single Slit, Diffraction Grating",
      "Laser wavelength slider (380nm Violet to 750nm Deep Red) + standard laser presets",
      "Slit width a slider (5µm to 200µm)",
      "Slit separation d slider (20µm to 800µm)",
      "Grating slit count N (2 to 16 slits)",
      "Screen distance D slider (0.5m to 4.0m)",
      "Toggle overlays: Huygens Wavelets, Diffraction Envelope",
    ],
    keyConcepts: [
      "Double-Slit Intensity: I(θ) = I₀ cos²(π d sinθ / λ) · sinc²(π a sinθ / λ)",
      "Fringe Spacing: β = λD / d",
      "Single-Slit Minima: a·sin(θ) = m·λ (m = ±1, ±2...)",
      "Central Diffraction Maxima Full Width: W₀ = 2λD / a",
      "Diffraction Grating Principal Maxima: d·sin(θ) = m·λ with peak intensity I ∝ N²",
      "Missing Orders: Occurs when d/a is an integer, causing the m-th interference maximum to be extinguished by the diffraction minimum",
    ],
    whatToTry: [
      "Switch from Red (632.8nm) to Violet (405nm) to observe fringe compression due to shorter wavelength.",
      "Set d = 4a to demonstrate missing orders where the 4th interference fringe disappears.",
      "Increase slit count N in Grating mode to observe principal maxima narrowing and intensity scaling with N².",
    ],
  },

  "physics/opticslens": {
    title: "Geometric Optics, Thin Lens & Ray Tracing Studio",
    overview:
      "Simulates image formation through thin convex (converging) and concave (diverging) lenses, 3 principal ray paths (P-Ray, F-Ray, Chief Ray), Lensmaker's equation, and real vs virtual images.",
    howToUse: [
      "Select lens type: Convex (converging) or Concave (diverging).",
      "Adjust focal length f (mm), object distance d_o (mm), and object height h_o (mm) using sliders or direct numeric inputs.",
      "Observe 3 color-coded principal ray paths (Parallel ray, Focal ray, Chief ray) and dashed virtual ray back-tracing.",
      "Inspect the live conjugate curve (d_i vs d_o) and optical telemetry grid for real/virtual status, magnification, and diopter power.",
    ],
    controls: [
      "Lens type toggle: Convex (f > 0) / Concave (f < 0)",
      "Focal length |f| slider (40mm to 250mm)",
      "Object distance d_o slider (20mm to 500mm)",
      "Object height h_o slider (10mm to 80mm)",
      "Refractive index material selector (Crown Glass, Flint Glass, Acrylic, Diamond, Water)",
      "Ray visibility toggles: P-Ray (green), F-Ray (pink), C-Ray (cyan), Virtual extensions",
    ],
    keyConcepts: [
      "Gaussian Thin Lens Equation: 1/f = 1/d_o + 1/d_i => d_i = (f · d_o) / (d_o - f)",
      "Transverse Magnification: M = -d_i / d_o = h_i / h_o",
      "Lensmaker's Equation: 1/f = (n - 1) · (1/R₁ - 1/R₂)",
      "Optical Power: P = 1/f (in meters, units: Diopters D)",
      "Convex Lens Behavior: Real & inverted when d_o > f; Virtual & magnified upright when d_o < f",
      "Concave Lens Behavior: Always produces virtual, erect, and diminished images inside the focal length",
    ],
    whatToTry: [
      "Place object exactly at 2F (d_o = 2f) to verify 1:1 inverted image formation (d_i = 2f, M = -1.0x).",
      "Move object inside F (d_o < f) to simulate a magnifying glass with virtual upright enlarged image.",
      "Switch to Concave Diverging mode and verify that virtual image distance d_i is always negative and |M| < 1.",
    ],
  },

  "physics/faradays-law": {
    title: "Electromagnetic Induction & Faraday's Law Lab",
    overview:
      "Explores magnetic flux, induced electromotive force (EMF), Lenz's Law, and galvanometer deflection using draggable permanent bar magnets and wire coils.",
    howToUse: [
      "Drag the bar magnet into and out of the multi-turn copper coil.",
      "Adjust the speed of motion and observe needle deflection on the zero-center galvanometer.",
      "Change the number of coil turns (N) and flip magnet polarity (N-S).",
      "Observe that faster motion produces greater induced voltage, and stationary magnets produce zero voltage.",
    ],
    controls: [
      "Draggable permanent bar magnet with field line visualization",
      "Coil turns selector: 1 turn, 2 turns, 4 turns",
      "Coil loop area slider and magnet field strength slider",
      "Lightbulb brightness indicator and Zero-Center Analog Galvanometer",
    ],
    keyConcepts: [
      "Magnetic Flux: Φ_B = B·A·cos(θ)",
      "Faraday's Law of Induction: EMF (ℰ) = -N·(dΦ_B / dt)",
      "Lenz's Law (the negative sign): Induced current flows in a direction such that its magnetic field opposes the change in flux that created it",
    ],
    whatToTry: [
      "Hold the magnet stationary inside the center of the coil — observe induced voltage is exactly zero because flux is not changing.",
      "Flip magnet polarity and push the South pole into the coil to see galvanometer needle deflect in the opposite direction.",
    ],
  },

  "physics/photoelectric-effect": {
    title: "Photoelectric Effect & Quantum Photons Lab",
    overview:
      "Explores the quantum particle nature of light, photon energy (E = hf), cathode metal work functions, and stopping potential measurements (Einstein's 1905 Nobel model).",
    howToUse: [
      "Select target cathode metal (Sodium, Cesium, Zinc, Platinum, Copper).",
      "Adjust light frequency / wavelength (λ in nm) and light intensity (%).",
      "Observe ejected photoelectrons traveling across the vacuum phototube to generate electric current.",
      "Adjust the Retarding Battery Voltage until current drops to zero to measure Stopping Voltage (V₀).",
    ],
    controls: [
      "Target metal selector with work function values (2.1 eV to 5.7 eV)",
      "Monochromatic light wavelength slider (200nm UV to 800nm IR)",
      "Light intensity slider (0% to 100% photon flux)",
      "Variable reverse voltage slider (-5.0V to +5.0V)",
      "Live Kinetic Energy vs Frequency graph",
    ],
    keyConcepts: [
      "Photon Energy: E = h·ν = (h·c) / λ",
      "Einstein's Photoelectric Equation: K_max = h·ν - Φ = e·V₀",
      "Threshold Frequency: ν₀ = Φ / h (photons below ν₀ eject zero electrons regardless of intensity)",
      "Intensity increases electron emission rate (current), but does NOT increase electron kinetic energy",
    ],
    whatToTry: [
      "Select Sodium (Φ = 2.28 eV) and shine Red light (650nm = 1.91 eV) at 100% intensity: observe zero emission because photon energy < work function.",
      "Switch to UV light and increase reverse voltage to determine exact stopping potential V₀.",
    ],
  },

  "physics/thermodynamics": {
    title: "Thermodynamic Heat Engines & Carnot Cycle Lab",
    overview:
      "Simulates ideal 4-stroke Carnot heat engines operating between hot and cold thermal reservoirs, displaying live P-V indicator loops and thermodynamic efficiency.",
    howToUse: [
      "Set Hot Reservoir temperature (T_H) and Cold Reservoir temperature (T_C).",
      "Click 'Step Cycle' or 'Auto Run' to advance through the 4 thermodynamic strokes.",
      "Inspect the live P-V (Pressure-Volume) diagram and work output area inside the curve.",
      "Verify that engine efficiency matches theoretical Carnot maximum η = 1 - (T_C / T_H).",
    ],
    controls: [
      "Hot Reservoir temperature slider (300K to 1200K)",
      "Cold Reservoir temperature slider (100K to 500K)",
      "Gas moles (n) and working substance ratio (Monatomic γ=5/3, Diatomic γ=7/5)",
      "P-V indicator diagram with stroke markers: 1→2 Isothermal Expansion, 2→3 Adiabatic Expansion, 3→4 Isothermal Compression, 4→1 Adiabatic Compression",
    ],
    keyConcepts: [
      "Carnot Efficiency: η = W_net / Q_in = 1 - (T_C / T_H)",
      "First Law of Thermodynamics: ΔU = Q - W",
      "Isothermal process: Temperature constant (ΔU = 0, Q = W = nRT·ln(V₂/V₁))",
      "Adiabatic process: No heat exchange (Q = 0, P·V^γ = constant, W = -ΔU)",
    ],
    whatToTry: [
      "Increase T_H while keeping T_C constant and observe how the enclosed area of the P-V curve increases (greater net work).",
    ],
  },

  // ────────────────── CHEMISTRY LABS ──────────────────
  "chemistry/periodictable": {
    title: "Interactive Periodic Table Explorer",
    overview:
      "Interactive Mendeleev periodic table detailing all 118 chemical elements, atomic numbers, electron configurations, electronegativity, ionization energy, and periodic group trends.",
    howToUse: [
      "Hover over or click any element tile to inspect atomic mass, oxidation states, and electron shell diagrams.",
      "Use the 'Property Heatmap' toggle to color-code elements by Electronegativity, First Ionization Energy, Atomic Radius, or Melting Point.",
      "Filter by block (s, p, d, f) or chemical family (Alkali metals, Halogens, Noble gases, Transition metals).",
    ],
    controls: [
      "Search bar by element name, symbol (e.g. Au, Fe), or atomic number",
      "Property Heatmap selector: Electronegativity (Pauling), Ionization Energy (kJ/mol), Atomic Radius (pm), Density",
      "Category filter buttons: Metals, Non-metals, Metalloids, Noble gases, Lanthanides, Actinides",
    ],
    keyConcepts: [
      "Atomic Radius decreases across a period (left to right) and increases down a group",
      "Electronegativity and Ionization Energy increase across a period and decrease down a group",
      "Valence electrons determine group chemical reactivity and common bonding states",
    ],
    whatToTry: [
      "Switch to Electronegativity heatmap and verify Fluorine (F, 3.98) is the most electronegative element.",
    ],
  },

  "chemistry/chemicalbonds": {
    title: "Chemical Bonding & Molecular Studio",
    overview:
      "Explores valence electron interactions forming Ionic, Covalent (polar/non-polar), and Metallic chemical bonds with Lewis dot animations.",
    howToUse: [
      "Select two elements from the periodic picker (e.g. Na + Cl, H + O, C + H, Fe + Fe).",
      "Observe the electronegativity difference (ΔEN) to predict bond character.",
      "Watch valence electrons transfer to form ionic lattices or share orbitals to form covalent molecules.",
      "Inspect 3D electron density clouds and electrostatic potential maps.",
    ],
    controls: [
      "Element A and Element B selector drawers",
      "Bond type mode: Ionic Electron Transfer, Covalent Orbital Sharing, Metallic Electron Sea",
      "Electronegativity difference meter with bond polarity classification",
    ],
    keyConcepts: [
      "Ionic Bond: ΔEN > 1.7 (complete electron transfer forming cations and anions, e.g. NaCl)",
      "Polar Covalent: 0.4 < ΔEN < 1.7 (unequal sharing creating partial charges δ+ and δ-, e.g. H₂O)",
      "Non-Polar Covalent: ΔEN < 0.4 (equal electron sharing, e.g. O₂, CH₄)",
      "Octet Rule: Atoms tend to gain, lose, or share electrons to achieve 8 valence electrons",
    ],
    whatToTry: [
      "Combine Hydrogen and Oxygen to watch two single covalent bonds form with two lone pairs on oxygen.",
    ],
  },

  "chemistry/electronic-configuration": {
    title: "Electronic Configuration & Orbital Filling Lab",
    overview:
      "Visualizes quantum energy levels, subshells (1s, 2s, 2p, 3s, 3p, 4s, 3d...), and orbital box diagrams following quantum mechanical principles.",
    howToUse: [
      "Select any element from Hydrogen (Z=1) to Oganesson (Z=118).",
      "Step through electron filling one-by-one or click 'Auto-Fill'.",
      "Observe Aufbau energy ordering, Pauli spin pairing (↑↓), and Hund's rule spin maximization in degenerate p/d orbitals.",
      "Inspect anomalous configurations (e.g. Chromium Z=24 [Ar] 4s¹ 3d⁵ and Copper Z=29 [Ar] 4s¹ 3d¹⁰).",
    ],
    controls: [
      "Atomic number slider (Z = 1 to 118)",
      "Energy Level Diagram view vs Orbital Box diagram view",
      "Noble gas shorthand notation toggle (e.g. [Ne] 3s² 3p⁴)",
    ],
    keyConcepts: [
      "Aufbau Principle: Electrons occupy lowest energy orbitals first (1s < 2s < 2p < 3s < 3p < 4s < 3d)",
      "Pauli Exclusion Principle: No two electrons can have identical 4 quantum numbers; paired electrons must have opposite spins (ms = +½, -½)",
      "Hund's Rule: Every orbital in a subshell is singly occupied before any orbital is doubly occupied",
    ],
    whatToTry: [
      "Inspect Nitrogen (Z=7) and observe that the three 2p electrons occupy separate orbitals with parallel spins (2px¹ 2py¹ 2pz¹).",
    ],
  },

  "chemistry/reaction-simulation": {
    title: "Chemical Reaction Builder & Stoichiometry Lab",
    overview:
      "Interactive chemical reactor demonstrating synthesis, decomposition, combustion, and single/double replacement reactions with live stoichiometry balancing.",
    howToUse: [
      "Select a reaction type or choose reactants from the chemical warehouse.",
      "Balance the chemical equation using integer coefficient steppers.",
      "Adjust temperature and reactant molar amounts, then click 'Ignite / React'.",
      "Inspect molecular product animations, limiting reagent analysis, and theoretical vs actual percent yields.",
    ],
    controls: [
      "Reaction preset library: Combustion of Methane, Haber-Bosch Ammonia synthesis, Water electrolysis, Rusting of iron",
      "Stoichiometric coefficient steppers",
      "Limiting reagent calculator and energy profile diagram (Exothermic vs Endothermic ΔH)",
    ],
    keyConcepts: [
      "Law of Conservation of Mass: Number of atoms of each element must be equal on both sides",
      "Limiting Reagent: The reactant completely consumed first, limiting total product formed",
      "Enthalpy of Reaction (ΔH): Negative for exothermic (releases heat), positive for endothermic (absorbs heat)",
    ],
    whatToTry: [
      "Provide unequal moles of Hydrogen (4 mol) and Oxygen (1 mol) for 2H₂ + O₂ → 2H₂O to identify Oxygen as the limiting reagent.",
    ],
  },

  "chemistry/water-quality": {
    title: "Water Quality & Environmental Analysis Lab",
    overview:
      "Conducts chemical testing on municipal and river water samples, testing pH, dissolved oxygen, nitrate/phosphate pollutants, and water hardness via EDTA titration.",
    howToUse: [
      "Select a water sample source (Tap Water, River Runoff, Industrial Effluent, Ocean Water).",
      "Dip test probes (digital pH probe, turbidity meter, conductivity TDS sensor).",
      "Add chemical colorimetric reagents to detect heavy metal ions and dissolved nutrients.",
      "Compare results against WHO and EPA drinking water quality standards.",
    ],
    controls: [
      "Water sample source selector",
      "Virtual analytical probes: pH meter, TDS Conductivity meter, Dissolved Oxygen (DO) probe",
      "Chemical test dropper: Silver Nitrate (Chlorides), Barium Chloride (Sulfates), EDTA (Hardness)",
    ],
    keyConcepts: [
      "pH Scale: Neutral = 7.0, Acidic < 7.0, Alkaline > 7.0",
      "Water Hardness: Ca²⁺ and Mg²⁺ concentration measured in ppm / mg/L CaCO₃",
      "Eutrophication: High nitrates/phosphates causing algal blooms and oxygen depletion (hypoxia)",
    ],
    whatToTry: [
      "Test Agricultural Runoff sample to detect elevated phosphate levels and explain its environmental impact.",
    ],
  },

  "chemistry/titration": {
    title: "Virtual Acid-Base Titration Lab",
    overview:
      "Precision analytical titration lab simulating acid-base neutralization with automated dropwise burette delivery, indicator color shifts, and real-time pH titration curves.",
    howToUse: [
      "Select Analyte (Flask: e.g. 25mL unknown HCl) and Titrant (Burette: e.g. 0.100 M NaOH).",
      "Choose a pH indicator (Phenolphthalein, Methyl Orange, Bromothymol Blue).",
      "Use the burette stopcock slider for fast flow, then switch to 'Drop-by-Drop' near the endpoint.",
      "Note the exact titrant volume (V_b) at color transition, and use M_a·V_a = M_b·V_b to compute analyte concentration.",
    ],
    controls: [
      "Titrant burette stopcock slider (Fast flow, Slow flow, Single drop delivery)",
      "Indicator selector with transition pH ranges",
      "Digital pH electrode dipping in Erlenmeyer flask",
      "Real-time pH vs Volume curve plot with First Derivative endpoint peak",
    ],
    keyConcepts: [
      "Equivalence Point: Moles of H⁺ exactly equal moles of OH⁻",
      "End Point: The volume at which the chemical indicator visibly changes color",
      "Strong Acid / Strong Base equivalence occurs at pH = 7.00",
      "Weak Acid / Strong Base equivalence occurs at pH > 7.00 (basic salt hydrolysis)",
    ],
    whatToTry: [
      "Titrate Acetic Acid (CH₃COOH) with NaOH using Phenolphthalein and observe the buffered plateau region before the steep jump.",
    ],
  },

  "chemistry/flame-test": {
    title: "Flame Test & Atomic Emission Spectrometry Lab",
    overview:
      "Simulates burner flame atomic emission spectroscopy, metal cation electron thermal excitation, photon emission, and discrete spectral line detection.",
    howToUse: [
      "Dip the nichrome wire loop into cleaning acid, then into a metal salt powder (NaCl, KCl, CuCl₂, SrCl₂, BaCl₂, CaCl₂).",
      "Adjust the Bunsen burner air collar to get a non-luminous blue heating flame.",
      "Place the wire loop in the flame and observe the characteristic flame color.",
      "Look through the virtual Spectroscope to inspect discrete quantized emission wavelength lines (nm).",
    ],
    controls: [
      "Metal salt sample tray: Lithium (Crimson), Sodium (Intense Yellow), Potassium (Lilac), Copper (Blue-Green), Strontium (Bright Red), Barium (Apple Green)",
      "Bunsen burner air collar toggle: Yellow safety flame vs Blue roaring flame",
      "Digital Spectroscope overlay with nanometer wavelength grating",
    ],
    keyConcepts: [
      "Thermal excitation: Heat excites valence electrons from ground state to higher quantum energy levels",
      "Photon Emission: When electrons de-excite, they release photons of discrete energy: E = h·c / λ",
      "Each element possesses a unique atomic emission 'fingerprint' spectrum",
    ],
    whatToTry: [
      "Test Sodium (589nm doublet) and observe why it masks other colors in contaminated samples.",
    ],
  },

  "chemistry/vsepr-geometry": {
    title: "3D Molecular Geometry & VSEPR Studio",
    overview:
      "Rotatable 3D molecular geometry sandbox applying Valence Shell Electron Pair Repulsion theory to calculate steric numbers, bond angles, orbital hybridizations, and net dipole polarity.",
    howToUse: [
      "Select a central atom and add bonding pairs or lone pairs of electrons.",
      "Rotate the 3D molecule by dragging to inspect spatial domain repulsion minimizing potential energy.",
      "Toggle ideal vs actual bond angles (e.g. 109.5° tetrahedral vs 104.5° in water due to lone pair repulsion).",
      "Enable 'Net Dipole Vector' to see if molecular symmetry cancels individual bond dipoles.",
    ],
    controls: [
      "Bonding domain and Lone pair stepper controls (Steric Number 2 to 6)",
      "3D canvas rotate, pan, and zoom controls",
      "Geometry readouts: Electron geometry, Molecular geometry, Hybridization (sp to sp³d²), Dipole vector",
    ],
    keyConcepts: [
      "VSEPR Principle: Electron pairs repel each other electrostatically and adopt geometries maximizing angular separation",
      "Lone pair - Lone pair repulsion > Lone pair - Bonding pair > Bonding pair - Bonding pair",
      "Linear (180°), Trigonal Planar (120°), Tetrahedral (109.5°), Trigonal Bipyramidal (90°/120°), Octahedral (90°)",
    ],
    whatToTry: [
      "Build Carbon Dioxide (CO₂: 2 bonds, 0 lone pairs = Linear non-polar) and compare to Water (H₂O: 2 bonds, 2 lone pairs = Bent polar).",
    ],
  },

  "chemistry/electrochemistry": {
    title: "Electrochemical Galvanic & Electrolytic Cells Lab",
    overview:
      "Simulates Daniell galvanic voltaic cells and electrolytic cells, electron flow through external wires, salt bridge ion migration, standard reduction potentials, and the Nernst equation.",
    howToUse: [
      "Choose anode and cathode metal half-cells (e.g. Zinc anode in ZnSO₄, Copper cathode in CuSO₄).",
      "Insert the salt bridge (KNO₃) and close the circuit switch.",
      "Observe electron flow from anode to cathode, voltmeter cell potential (E_cell), and mass changes on electrodes.",
      "Change ion concentrations to observe non-standard cell potentials via the Nernst equation.",
    ],
    controls: [
      "Metal electrode selector: Zn, Cu, Ag, Fe, Al, Mg with standard reduction potentials (E°)",
      "Electrolyte molarity sliders (0.001 M to 2.0 M)",
      "Mode toggle: Galvanic Cell (Spontaneous ΔG < 0) vs Electrolytic Cell (External Power Supply)",
      "Digital voltmeter and electron flow animation speed dial",
    ],
    keyConcepts: [
      "Anode = Site of Oxidation (Loss of electrons, AN OX)",
      "Cathode = Site of Reduction (Gain of electrons, RED CAT)",
      "Standard Cell Potential: E°_cell = E°_cathode - E°_anode",
      "Nernst Equation: E_cell = E°_cell - (0.0592 / n)·log(Q)",
      "Salt bridge maintains electrical neutrality by supplying anions to anode and cations to cathode",
    ],
    whatToTry: [
      "Build a standard Daniell Cell (Zn|Zn²⁺ || Cu²⁺|Cu) and verify standard potential is exactly +1.10 V.",
    ],
  },

  "chemistry/gas-laws": {
    title: "Gas Laws & Kinetic Molecular Theory Lab",
    overview:
      "Interactive 2D kinetic gas cylinder with colliding elastic particles, draggable piston volume, thermal heating bath, and real-time Maxwell-Boltzmann molecular velocity curves.",
    howToUse: [
      "Pump gas particles (Light Helium or Heavy Xenon) into the sealed chamber.",
      "Drag the piston handle to change Volume (V), add/remove heat to change Temperature (T), and observe Pressure (P) gauge response.",
      "Lock one variable (e.g. Constant Temperature for Boyle's Law, Constant Pressure for Charles's Law).",
      "Inspect the live Maxwell-Boltzmann distribution plot showing average vs root-mean-square (v_rms) speeds.",
    ],
    controls: [
      "Bicycle pump handle to add gas particles (N)",
      "Draggable piston volume handle (5L to 25L)",
      "Thermostat heat/ice slider (50K to 1000K)",
      "Law isolation modes: Boyle's Law (P vs V), Charles's Law (V vs T), Gay-Lussac's Law (P vs T), Avogadro's Law",
    ],
    keyConcepts: [
      "Ideal Gas Law: P·V = n·R·T",
      "Boyle's Law: P₁V₁ = P₂V₂ (at constant T)",
      "Charles's Law: V₁/T₁ = V₂/T₂ (at constant P)",
      "Root Mean Square Speed: v_rms = √(3RT / M)",
    ],
    whatToTry: [
      "Heat the gas to 600K and observe the Maxwell-Boltzmann distribution curve broaden and shift right toward higher speeds.",
    ],
  },

  // ────────────────── BIOLOGY LABS ──────────────────
  "biology/cell/animal": {
    title: "3D Animal Cell Cytology Explorer",
    overview:
      "Explores eukaryotic animal cell organelles in 3D: nucleus, mitochondria, endoplasmic reticulum, Golgi apparatus, lysosomes, centrosomes, and plasma membrane.",
    howToUse: [
      "Click and drag to orbit the 3D cell; use scroll wheel to zoom.",
      "Click any organelle to open detailed structural anatomy, enzymatic functions, and ATP/protein pathways.",
      "Use the cross-section slice tool to inspect internal nuclear chromatin and mitochondrial cristae.",
    ],
    controls: [
      "3D orbit, pan, and zoom controls",
      "Organelle spotlight directory (Nucleus, Mitochondrion, Rough/Smooth ER, Golgi, Ribosomes, Lysosomes)",
      "Slice cross-section cutaway toggle",
    ],
    keyConcepts: [
      "Mitochondria: ATP generation via oxidative phosphorylation",
      "Nucleus & Nucleolus: DNA storage and ribosome biogenesis",
      "Rough ER & Golgi: Protein translation, folding, glycosylation, and vesicle trafficking",
    ],
    whatToTry: [
      "Click the Mitochondrion to inspect inner/outer membranes and compare with cellular respiration pathways.",
    ],
  },

  "biology/cell/plant": {
    title: "3D Plant Cell Cytology Explorer",
    overview:
      "Explores specialized plant cell structures: rigid cellulose cell wall, large central vacuole, thylakoid chloroplasts, and plasmodesmata.",
    howToUse: [
      "Rotate and zoom around the 3D plant cell model.",
      "Click Chloroplasts to examine double-membrane thylakoid stacks (grana) where photosynthesis occurs.",
      "Inspect the Central Vacuole and observe how water turgor pressure provides structural rigidity.",
    ],
    controls: [
      "3D canvas viewport controls",
      "Plant-specific organelle directory: Cell Wall, Chloroplasts, Central Vacuole, Plasmodesmata, Tonoplast",
    ],
    keyConcepts: [
      "Cell Wall: Rigid cellulose matrix providing mechanical support and resisting osmotic lysis",
      "Chloroplasts: Contain chlorophyll pigments to convert sunlight, CO₂, and H₂O into glucose",
      "Central Vacuole: Regulates cellular turgidity, water storage, and waste degradation",
    ],
    whatToTry: [
      "Compare plant vs animal cell structures and identify the 3 structures present only in plant cells (Cell wall, Chloroplasts, Large central vacuole).",
    ],
  },

  "biology/human": {
    title: "3D Human Anatomy & Organ Systems Lab",
    overview:
      "Comprehensive interactive 3D human anatomy explorer spanning Skeletal, Muscular, Circulatory, Respiratory, Nervous, and Digestive organ systems.",
    howToUse: [
      "Toggle individual anatomical layers on/off (Skeletal, Cardiovascular, Digestive, Respiratory, Nervous).",
      "Click any organ (Heart, Brain, Lungs, Liver, Kidneys) to inspect physiological functions and clinical facts.",
      "Use the opacity slider to view internal organs nested within the ribcage.",
    ],
    controls: [
      "Layer toggles: Skeleton, Muscles, Blood Vessels, Lungs, Heart, Digestive tract, Brain/Nerves",
      "3D rotation and focal target centering",
      "Search tool for specific bones and organs",
    ],
    keyConcepts: [
      "Circulatory system: Double-loop systemic and pulmonary circulation",
      "Respiratory system: Alveolar gas exchange (O₂ absorption, CO₂ exhalation)",
      "Digestive system: Mechanical and enzymatic nutrient breakdown (stomach, duodenum, small intestine villi)",
    ],
    whatToTry: [
      "Isolate the Heart and trace blood flow from Vena Cava → Right Atrium → Right Ventricle → Lungs → Left Atrium → Left Ventricle → Aorta.",
    ],
  },

  "biology/photosynthesis": {
    title: "Photosynthesis & Limiting Factors Lab",
    overview:
      "Simulates photosynthetic oxygen production in aquatic plants (Elodea), applying Blackman's Law of Limiting Factors to light intensity, CO₂ concentration, and temperature.",
    howToUse: [
      "Adjust the Lamp Distance / Light Intensity slider.",
      "Change Sodium Bicarbonate concentration (CO₂ source) and water bath temperature.",
      "Count Oxygen gas bubbles produced per minute or read the digital O₂ rate sensor.",
      "Observe which variable acts as the limiting factor when the rate plateaus.",
    ],
    controls: [
      "Light intensity slider (0 to 1000 Lux) and light wavelength filter (White, Red, Blue, Green)",
      "CO₂ concentration slider (0.0% to 1.0% NaHCO₃)",
      "Temperature slider (5°C to 50°C)",
      "Digital bubble counter and real-time rate graph",
    ],
    keyConcepts: [
      "Photosynthesis Equation: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂",
      "Blackman's Law: When a process is conditioned by several factors, its rate is limited by the slowest factor",
      "Temperature effect: Rate increases up to optimum (~30-35°C), then drops sharply due to RuBisCO enzyme denaturation",
      "Light Spectrum: Chlorophyll absorbs Red and Blue wavelengths strongly, reflecting Green light",
    ],
    whatToTry: [
      "Switch light filter to Green light and observe photosynthesis rate plummet because chlorophyll reflects green.",
    ],
  },

  "biology/blood": {
    title: "Blood Grouping & Transfusion Compatibility Lab",
    overview:
      "Explores ABO and Rh blood typing, antigen-antibody agglutination reactions, and safe transfusion compatibility matrix rules.",
    howToUse: [
      "Select a patient blood sample.",
      "Add Anti-A, Anti-B, and Anti-D (Rh) monoclonal antibodies to the 3 testing wells.",
      "Inspect agglutination (clumping) to determine patient blood group (e.g. clumping in A and D = A+).",
      "Test donor-recipient blood pairings in the virtual transfusion simulator to check for hemolytic transfusion reactions.",
    ],
    controls: [
      "Antibody dropper: Anti-A (Blue), Anti-B (Yellow), Anti-D (Colorless)",
      "Blood sample library (A+, A-, B+, B-, AB+, AB-, O+, O-)",
      "Agglutination microscope inspection zoom",
    ],
    keyConcepts: [
      "Antigens on RBC surface (A, B, Rh/D); Antibodies in plasma (Anti-A, Anti-B)",
      "Universal Donor: O Negative (O-) has no A, B, or Rh antigens",
      "Universal Recipient: AB Positive (AB+) has no anti-A, anti-B, or anti-D antibodies",
      "Agglutination occurs when specific antibody binds corresponding antigen (e.g. Anti-A binds Antigen A)",
    ],
    whatToTry: [
      "Test Type O blood with all three antibodies and observe zero clumping in all wells.",
    ],
  },

  "biology/brainNeuron": {
    title: "3D Brain Neuron & Action Potential Lab",
    overview:
      "Simulates neuron electrophysiology, resting membrane potential (-70mV), voltage-gated Na+/K+ ion channels, action potential propagation, and neurotransmitter synapse exocytosis.",
    howToUse: [
      "Inject current into the soma using the microelectrode stimulus slider.",
      "If stimulus exceeds threshold (-55mV), watch an all-or-none Action Potential fire down the axon.",
      "Observe Na⁺ rushing in during depolarization (+30mV) and K⁺ rushing out during repolarization.",
      "Inspect the synaptic cleft as voltage triggers Ca²⁺ influx and neurotransmitter release.",
    ],
    controls: [
      "Stimulus current injection slider (µA)",
      "Ion channel blocker toggles: TTX (blocks Na⁺ channels), TEA (blocks K⁺ channels)",
      "Oscilloscope membrane potential trace (mV vs time in ms)",
      "Myelin sheath toggle showing Saltatory Conduction at Nodes of Ranvier",
    ],
    keyConcepts: [
      "Resting Potential: -70 mV maintained by Na⁺/K⁺-ATPase pump (3 Na⁺ out, 2 K⁺ in)",
      "Threshold of Excitation: -55 mV triggers voltage-gated Na⁺ channel opening",
      "Depolarization (+30 mV) → Repolarization → Hyperpolarization refractory period",
      "Saltatory conduction: Action potential jumps between Nodes of Ranvier, accelerating signal speed",
    ],
    whatToTry: [
      "Apply sub-threshold stimulus (-60mV) to demonstrate that no action potential fires (All-or-None law).",
    ],
  },

  "biology/genetics/monohybrid": {
    title: "Monohybrid Punnett Square & Mendel's Law Lab",
    overview:
      "Explores single-trait Mendelian genetics, dominant vs recessive alleles, Punnett square matrix calculations, and 100-offspring batch breeding statistical ratios.",
    howToUse: [
      "Select maternal and paternal genotypes (Homozygous Dominant AA, Heterozygous Aa, or Homozygous Recessive aa).",
      "Inspect the 2x2 Punnett Square to view theoretical genotype (1:2:1) and phenotype (3:1) ratios.",
      "Click 'Breed 1 Offspring' or 'Breed 100 Batch' to compare actual statistical drop frequencies to theoretical expectations.",
    ],
    controls: [
      "Parent 1 and Parent 2 allele selectors",
      "Creature trait selector: Eye Color, Fur Color, Wing Shape",
      "Statistical sample size stepper: 1, 10, 50, 100, 500 offspring",
    ],
    keyConcepts: [
      "Law of Segregation: The two alleles for a heritable character segregate during gamete formation",
      "Dominant allele masks recessive allele in heterozygous phenotype (Aa)",
      "Monohybrid Heterozygous Cross (Aa × Aa) yields 3:1 dominant:recessive phenotype ratio",
    ],
    whatToTry: [
      "Cross Aa × Aa and breed 500 offspring to verify actual ratio converges closely to 75% dominant and 25% recessive.",
    ],
  },

  "biology/genetics/dihybrid": {
    title: "Dihybrid Cross & Independent Assortment Lab",
    overview:
      "Explores two-trait inheritance, 16-cell Punnett squares, gamete combinations, and Mendel's Law of Independent Assortment (9:3:3:1 ratio).",
    howToUse: [
      "Select parental genotypes for two independent traits (e.g. Seed Shape R/r and Seed Color Y/y).",
      "Inspect gamete generation (RY, Ry, rY, ry) on the 4x4 matrix axes.",
      "View the resulting 16 offspring cells colored by visual phenotype.",
      "Verify the classic 9:3:3:1 phenotypic ratio for heterozygous dihybrid cross (RrYy × RrYy).",
    ],
    controls: [
      "Trait 1 (Shape: Round R vs Wrinkled r) and Trait 2 (Color: Yellow Y vs Green y) selectors",
      "16-cell Punnett square interactive highlighter",
      "Phenotypic breakdown chart: Round-Yellow (9), Round-Green (3), Wrinkled-Yellow (3), Wrinkled-Green (1)",
    ],
    keyConcepts: [
      "Law of Independent Assortment: Genes for different traits sort independently during gamete formation (if unlinked on different chromosomes)",
      "Dihybrid Cross (AaBb × AaBb) yields 9:3:3:1 phenotypic ratio",
    ],
    whatToTry: [
      "Test a test cross (RrYy × rryy) and verify it produces a 1:1:1:1 ratio across all four phenotypes.",
    ],
  },

  "biology/genetics/transcription-translation": {
    title: "DNA Transcription & Translation Lab",
    overview:
      "Simulates the Central Dogma of Molecular Biology: DNA unzipping, RNA Polymerase mRNA synthesis, and ribosome tRNA translation with mutation testing.",
    howToUse: [
      "Edit the 5'→3' DNA coding template strand or pick a preset gene sequence.",
      "Watch RNA Polymerase transcribe DNA to complementary mRNA (A→U, T→A, C→G, G→C).",
      "Step the Ribosome across mRNA codons; match corresponding tRNA anticodons delivering amino acids.",
      "Introduce Point Mutations (Silent, Missense, Nonsense, Frameshift) to observe downstream polypeptide changes.",
    ],
    controls: [
      "DNA sequence interactive editor",
      "Codon step sequencer and mRNA reader",
      "Genetic Code Wheel and amino acid chain builder",
      "Mutation injector: Substitution, Insertion, Deletion",
    ],
    keyConcepts: [
      "Transcription occurs in nucleus (DNA → mRNA); Translation occurs at ribosome in cytoplasm (mRNA → Protein)",
      "Start Codon: AUG (Methionine); Stop Codons: UAA, UAG, UGA",
      "Point mutations: Silent (no amino acid change), Missense (different amino acid), Nonsense (premature STOP codon), Frameshift (insertion/deletion altering entire downstream reading frame)",
    ],
    whatToTry: [
      "Insert 1 extra nucleotide early in the sequence and observe the catastrophic frameshift mutation altering all following amino acids.",
    ],
  },

  "biology/genetics/pedigree": {
    title: "Pedigree Chart & Genetic Counselor Lab",
    overview:
      "Analyzes 3-generation family pedigree trees to determine inheritance modes (Autosomal Dominant, Autosomal Recessive, X-Linked Recessive, Mitochondrial).",
    howToUse: [
      "Select an inheritance mode or build a custom family pedigree tree.",
      "Click individual family members (Squares = Males, Circles = Females, Shaded = Affected) to inspect alleles.",
      "Use genetic logic to deduce whether unknown individuals are carriers (heterozygous).",
      "Calculate risk probability for future offspring based on pedigree genotypes.",
    ],
    controls: [
      "Inheritance mode selector: Autosomal Dominant (e.g. Huntington's), Autosomal Recessive (e.g. Cystic Fibrosis), X-Linked Recessive (e.g. Hemophilia / Color blindness)",
      "Family generation node editor (P, F1, F2)",
      "Probability calculator for future child risk",
    ],
    keyConcepts: [
      "Autosomal Dominant: Cannot skip generations; affected offspring must have affected parent",
      "Autosomal Recessive: Can skip generations; unaffected parents can have affected child (both parents carriers)",
      "X-Linked Recessive: Affects males far more frequently; carrier mothers pass trait to 50% of sons",
    ],
    whatToTry: [
      "Select X-Linked Recessive and observe how an affected father passes the mutant allele to all daughters (making them carriers) but none of his sons.",
    ],
  },

  "biology/enzyme-kinetics": {
    title: "Enzyme Kinetics & Catalysis Studio Lab",
    overview:
      "Simulates enzyme-substrate active site kinetics, calculating V_max and K_m, and comparing Competitive, Non-Competitive, and Uncompetitive inhibitors on Michaelis-Menten & Lineweaver-Burk plots.",
    howToUse: [
      "Adjust Substrate Concentration [S] and Enzyme Concentration [E].",
      "Add chemical inhibitors (Competitive or Non-Competitive) at varying concentrations [I].",
      "Observe the reaction velocity curve (V vs [S]) and Lineweaver-Burk double reciprocal plot (1/V vs 1/[S]).",
      "Calculate V_max (horizontal asymptote) and K_m (substrate concentration at ½ V_max).",
    ],
    controls: [
      "Substrate concentration slider [S] (0 to 100 mM)",
      "Enzyme concentration slider [E]",
      "Inhibitor type selector: None, Competitive, Non-Competitive, Uncompetitive",
      "Live Michaelis-Menten (V vs [S]) and Lineweaver-Burk (1/V vs 1/[S]) plots",
    ],
    keyConcepts: [
      "Michaelis-Menten Equation: V = (V_max · [S]) / (K_m + [S])",
      "K_m (Michaelis Constant): Inversely related to enzyme-substrate affinity (lower K_m = higher affinity)",
      "Competitive Inhibitor: Binds active site; increases apparent K_m without changing V_max",
      "Non-Competitive Inhibitor: Binds allosteric site; reduces V_max without changing K_m",
    ],
    whatToTry: [
      "Add a competitive inhibitor and increase substrate concentration [S] to high levels to observe that V_max is still reachable.",
    ],
  },

  "biology/cellular-respiration": {
    title: "Cellular Respiration & Mitochondria Lab",
    overview:
      "Simulates aerobic cellular respiration: Glycolysis, Pyruvate oxidation, Krebs Citric Acid Cycle, and mitochondrial Electron Transport Chain (ETC) with ATP Synthase proton pumping.",
    howToUse: [
      "Follow glucose breakdown through Glycolysis in cytosol to generate 2 Pyruvate, 2 NADH, and 2 net ATP.",
      "Track acetyl-CoA into the mitochondrial matrix Krebs cycle to produce NADH and FADH₂ electron carriers.",
      "Observe Complexes I, III, and IV pump protons (H⁺) into intermembrane space creating an electrochemical gradient.",
      "Watch rotary ATP Synthase synthesize ATP via chemiosmosis as protons flow back into matrix.",
    ],
    controls: [
      "Respiration stage selector: Glycolysis, Link Reaction, Krebs Cycle, Oxidative Phosphorylation",
      "Oxygen availability toggle: Aerobic (36-38 ATP) vs Anaerobic Lactic/Alcohol Fermentation (2 ATP)",
      "Metabolic poison toggles: Cyanide (inhibits Complex IV), Oligomycin (blocks ATP Synthase), DNP (uncoupler)",
    ],
    keyConcepts: [
      "Overall Equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~32-36 ATP",
      "Chemiosmosis: Proton motive force across inner mitochondrial membrane drives ATP synthesis",
      "Oxygen acts as the terminal electron acceptor at Complex IV, combining with protons to form water",
    ],
    whatToTry: [
      "Apply Cyanide and watch the electron transport chain stall, stopping proton pumping and halting ATP production.",
    ],
  },

  "biology/osmosis-tonicity": {
    title: "Osmosis, Diffusion & Cell Tonicity Lab",
    overview:
      "Simulates water diffusion across semi-permeable cell membranes, comparing animal red blood cells (RBCs) and plant cells under Hypertonic, Isotonic, and Hypotonic solutions.",
    howToUse: [
      "Place red blood cells or plant cells into the beaker.",
      "Adjust external solute concentration (sucrose/NaCl) to create Hypotonic, Isotonic, or Hypertonic environments.",
      "Observe net water flow direction driven by water potential / osmotic pressure gradients.",
      "Watch animal cells swell/burst (hemolysis) or shrivel (crenation); watch plant cells achieve turgor pressure or undergo plasmolysis.",
    ],
    controls: [
      "Cell type selector: Animal Red Blood Cell vs Plant Epidermal Cell",
      "External solution concentration slider (0.0% Distilled water to 5.0% Hypertonic saline)",
      "Microscope cross-section view with live volume and turgor pressure gauges",
    ],
    keyConcepts: [
      "Osmosis: Net diffusion of water from high water potential (low solute) to low water potential (high solute) across a semi-permeable membrane",
      "Hypotonic: Water flows into cell (Animal cells burst/lyse; Plant cells become healthy and turgid)",
      "Hypertonic: Water flows out of cell (Animal cells crenate; Plant cells undergo plasmolysis)",
      "Isotonic: Zero net water movement (Animal cells normal; Plant cells flaccid)",
    ],
    whatToTry: [
      "Place red blood cells in pure distilled water (0% solute) to observe rapid osmotic influx leading to cell rupture (lysis).",
    ],
  },

  // ────────────────── COMPUTER SCIENCE LABS ──────────────────
  "computer-science/code-lab/html-css-js": {
    title: "HTML/CSS/JavaScript Web Code Lab",
    overview:
      "Interactive multi-tab web code editor powered by Monaco (VS Code engine) with live sandboxed preview, instant CSS styling, and JavaScript console log streaming.",
    howToUse: [
      "Switch between HTML, CSS, and JS tabs in the editor.",
      "Write code and click 'Run Code' or enable auto-run preview.",
      "Inspect the live output iframe and open the integrated Console drawer to view console.log outputs and runtime errors.",
      "Click 'Save Project' to save your work to your OpenLabs account.",
    ],
    controls: [
      "Monaco editor tab bar: index.html, styles.css, script.js",
      "Run Code button and Auto-preview toggle",
      "Integrated Developer Console with clear and log filtering",
      "Project save and export buttons",
    ],
    keyConcepts: [
      "DOM structure (HTML), Visual presentation (CSS), and Dynamic behavior (JavaScript)",
      "Event listeners and DOM manipulation via document.querySelector",
    ],
    whatToTry: [
      "Build an interactive button counter that updates text on click using document.getElementById.",
    ],
  },

  "computer-science/code-lab/js": {
    title: "JavaScript Event Loop & Concurrency Visualizer",
    overview:
      "Visualizes JavaScript's asynchronous single-threaded runtime: Call Stack, Web APIs, Microtask Queue (Promises), Task/Callback Queue (setTimeout), requestAnimationFrame, and Render cycle.",
    howToUse: [
      "Choose an asynchronous code snippet from the preset gallery (e.g. Promises vs setTimeout, async/await, microtask starvation) or write custom JS.",
      "Click 'Step' to advance execution one tick at a time or 'Play' for continuous animated playback.",
      "Watch functions push/pop on the Call Stack, async timers delegate to Web APIs, and microtasks execute before macrotasks.",
      "Use 'Predict Mode' to test your mental model before the visualizer reveals queue resolution order.",
    ],
    controls: [
      "Code editor and preset dropdown",
      "Execution controls: Step Forward, Step Back, Play/Pause, Speed slider",
      "Interactive queues: Call Stack, Web APIs environment, Microtask Queue (Job Queue), Task Queue (Macrotask Queue), rAF Queue",
      "Runtime environment toggle: Browser semantics vs Node.js semantics (process.nextTick, setImmediate)",
    ],
    keyConcepts: [
      "Single-threaded execution: Call Stack processes one frame at a time until empty (Run-to-completion)",
      "Microtasks (Promises, queueMicrotask) have higher priority and drain completely before the next macrotask",
      "Macrotasks (setTimeout, setInterval, I/O) execute one per event loop cycle",
      "Render steps occur between event loop cycles after microtask queue is clear",
    ],
    whatToTry: [
      "Run a snippet containing console.log('1'), setTimeout(..., 0) with console.log('2'), and Promise.resolve().then(console.log('3')) to verify output order: 1 → 3 → 2.",
    ],
  },

  "computer-science/cpu-architecture": {
    title: "8-Bit CPU Micro-Architecture & Assembly Lab",
    overview:
      "Simulates an 8-bit Von Neumann computer architecture, assembly language editor, instruction decoding, ALU arithmetic, register bus transfers, and RAM memory mapping.",
    howToUse: [
      "Write or select an 8-bit assembly program (e.g. Fibonacci, Multiply, Countdown).",
      "Click 'Assemble' to compile instructions into binary machine code loaded into RAM.",
      "Step through the 4-stage instruction cycle: Fetch → Decode → Execute → Writeback.",
      "Watch the Program Counter (PC), Instruction Register (IR), Accumulator (A), Register B, and ALU flags update live.",
    ],
    controls: [
      "Assembly code editor with syntax highlighting",
      "Instruction stepping dials: Clock Frequency (Hz), Single Step, Continuous Run",
      "Registers display: PC, IR, MAR, Accumulator A, Register B, Output Register, Flags (Zero, Carry)",
      "Interactive 256-byte RAM grid with hex view",
    ],
    keyConcepts: [
      "Von Neumann Architecture: Shared memory for program instructions and data",
      "Fetch-Decode-Execute Cycle: PC points to next RAM address, IR holds current opcode, ALU executes operation",
      "ALU operations: ADD, SUB, AND, OR, XOR, CMP, JMP, JZ (Jump if Zero), JNZ",
    ],
    whatToTry: [
      "Load the Fibonacci program and step through loops to watch the accumulator compute 1, 1, 2, 3, 5, 8, 13, 21.",
    ],
  },

  "computer-science/bitwise-operations": {
    title: "Binary & Bitwise Operations Studio",
    overview:
      "Interactive 8-bit register tiles exploring binary number representations, bitwise logic gates (AND, OR, XOR, NOT), arithmetic/logical bit shifts, Two's complement negative numbers, and bitmasking algorithms.",
    howToUse: [
      "Click individual bit tiles (0 or 1) in Register A and Register B to toggle values.",
      "Select a bitwise operation: AND (&), OR (|), XOR (^), NOT (~), Left Shift (<<), Right Shift (>>), Arithmetic Shift (>>>).",
      "Inspect the live calculation result in Binary, Hexadecimal, Unsigned Decimal (0-255), and Signed Two's Complement (-128 to +127).",
      "Try bitmasking presets: Set Bit, Clear Bit, Toggle Bit, Check Odd/Even, Swap without temp variable.",
    ],
    controls: [
      "8-bit interactive toggle registers for Operand A and Operand B",
      "Bitwise operator selector buttons: AND, OR, XOR, NOT, SHL, SHR, SAR, ROL, ROR",
      "Radix conversion panel: Binary (base-2), Hex (base-16), Unsigned int, Signed Two's complement int",
    ],
    keyConcepts: [
      "AND (&): 1 only if both bits 1 (used for masking/clearing bits)",
      "OR (|): 1 if either bit 1 (used for setting bits)",
      "XOR (^): 1 if bits differ (used for toggling bits and parity checks)",
      "Two's Complement: Invert all bits and add 1 (~x + 1) to represent negative integers",
      "Left Shift (x << 1): Multiplies integer by 2; Right Shift (x >> 1): Integer division by 2",
    ],
    whatToTry: [
      "Test (n & (n - 1)) == 0 to verify if a number is a power of 2.",
      "Perform XOR swap: a = a ^ b; b = a ^ b; a = a ^ b to swap two values with zero auxiliary memory.",
    ],
  },

  "computer-science/dsa/sorting/bubble-sort": {
    title: "Bubble Sort Algorithm Visualizer",
    overview:
      "Visualizes the comparison-based Bubble Sort algorithm, repeatedly stepping through the array, comparing adjacent elements, and swapping them if out of order.",
    howToUse: [
      "Generate a random, reversed, or nearly-sorted array of numbers.",
      "Adjust array size and animation speed, then click 'Sort'.",
      "Watch adjacent comparison bars highlight: larger elements 'bubble' to the right end of the array after each pass.",
      "Observe how the sorted partition grows from right to left.",
    ],
    controls: [
      "Array size slider (5 to 50 elements)",
      "Animation speed slider (Slow, Medium, Fast)",
      "Array distribution presets: Random, Nearly Sorted, Reversed, Few Unique",
      "Live comparison and swap counters",
    ],
    keyConcepts: [
      "Best Case Time: O(n) (when already sorted, using swapped flag early exit)",
      "Average & Worst Case Time: O(n²)",
      "Space Complexity: O(1) Auxiliary (In-place sort)",
      "Stability: Stable (equal elements retain relative original order)",
    ],
    whatToTry: [
      "Test a Reverse Sorted array (worst case) and compare total comparisons against a Nearly Sorted array.",
    ],
  },

  "computer-science/dsa/sorting/merge-sort": {
    title: "Merge Sort Algorithm Visualizer",
    overview:
      "Visualizes Divide-and-Conquer Merge Sort: recursively splitting arrays into single-element subarrays and merging sorted halves back together.",
    howToUse: [
      "Generate an input array and click 'Sort'.",
      "Watch the visualization divide the array into halves down the recursion tree.",
      "Observe the merge phase combining two sorted auxiliary subarrays into a single sorted segment.",
    ],
    controls: [
      "Array generator and speed controls",
      "Recursion tree depth breakdown overlay",
      "Auxiliary memory buffer visualization",
    ],
    keyConcepts: [
      "Time Complexity: O(n log n) across Best, Average, and Worst cases (guaranteed)",
      "Space Complexity: O(n) extra memory required for merging",
      "Divide-and-Conquer paradigm: Divide into halves, conquer recursively, combine sorted results",
      "Stability: Stable sort",
    ],
    whatToTry: [
      "Compare Merge Sort vs Bubble Sort on a 50-element array to see the massive performance speedup of O(n log n) over O(n²).",
    ],
  },

  "computer-science/dsa/sorting/quick-sort": {
    title: "Quick Sort Algorithm Visualizer",
    overview:
      "Visualizes in-place divide-and-conquer Quick Sort, picking a pivot element, partitioning the array such that smaller elements move left and larger right, and sorting recursively.",
    howToUse: [
      "Select pivot selection strategy (Last element, First element, Middle, or Median-of-Three).",
      "Click 'Sort' and watch the pivot element lock into place with left/right pointer scans.",
      "Observe the partitioned subarrays sort independently around the fixed pivot.",
    ],
    controls: [
      "Pivot selection strategy dropdown",
      "Step-by-step partition trace",
      "Array size and speed sliders",
    ],
    keyConcepts: [
      "Best & Average Case Time: O(n log n)",
      "Worst Case Time: O(n²) (occurs with poor pivot selection on already sorted arrays)",
      "Space Complexity: O(log n) call stack memory",
      "In-place partitioning (Lomuto or Hoare partition schemes)",
    ],
    whatToTry: [
      "Pick 'First Element' pivot on an already sorted array and observe how it degrades to O(n²) worst-case recursion.",
    ],
  },

  "computer-science/dsa/sorting/selection-sort": {
    title: "Selection Sort Algorithm Visualizer",
    overview:
      "Visualizes Selection Sort: finding the minimum element from the unsorted segment and placing it at the beginning of the array in each pass.",
    howToUse: [
      "Click 'Sort' to watch the algorithm scan the unsorted partition to find the minimum value.",
      "Observe exactly one swap occur per outer loop pass as the minimum element moves to the sorted prefix on the left.",
    ],
    controls: [
      "Array generator presets",
      "Current minimum index marker and scan cursor",
    ],
    keyConcepts: [
      "Time Complexity: O(n²) in Best, Average, and Worst cases (always scans entire remaining array)",
      "Space Complexity: O(1) in-place",
      "Advantage: Performs minimal swaps (at most n swaps), useful when write operations are expensive",
    ],
    whatToTry: [
      "Count the total number of swaps compared to Bubble Sort on the same random array.",
    ],
  },

  "computer-science/dsa/sorting/insertion-sort": {
    title: "Insertion Sort Algorithm Visualizer",
    overview:
      "Visualizes Insertion Sort: building the final sorted array one item at a time by shifting larger elements right and inserting the key into its correct position (like sorting playing cards).",
    howToUse: [
      "Click 'Sort' and watch each key element lift, compare backwards through the sorted prefix, and slide into place.",
      "Notice how fast it completes on Nearly Sorted arrays.",
    ],
    controls: [
      "Array distribution selector: Random vs Nearly Sorted",
      "Key element highlight and shift trace",
    ],
    keyConcepts: [
      "Best Case Time: O(n) (linear when array is already sorted)",
      "Average & Worst Case: O(n²)",
      "Space Complexity: O(1) in-place, Stable sort",
      "Highly efficient for small datasets (n ≤ 16) and nearly-sorted data streams",
    ],
    whatToTry: [
      "Load a 'Nearly Sorted' array and observe how Insertion Sort finishes in a fraction of the time compared to Selection Sort.",
    ],
  },

  "computer-science/dsa/sorting/heap-sort": {
    title: "Heap Sort Algorithm Visualizer",
    overview:
      "Visualizes Heap Sort: building a binary Max-Heap from the array, repeatedly extracting the maximum root element, and sifting down remaining elements.",
    howToUse: [
      "Click 'Sort' to watch the array transform into a visual Complete Binary Tree Max-Heap.",
      "Watch the largest element at root swap with the last leaf and sift down to restore max-heap invariant.",
    ],
    controls: [
      "Dual view: Linear Array representation and 2D Binary Heap Tree diagram",
      "Heapify animation step tracer",
    ],
    keyConcepts: [
      "Time Complexity: O(n log n) across all Best, Average, and Worst cases",
      "Space Complexity: O(1) in-place",
      "Max-Heap property: Parent node value ≥ Child node values (arr[i] ≥ arr[2i+1], arr[2i+2])",
      "Unstable sort",
    ],
    whatToTry: [
      "Watch Phase 1 (Building Heap in O(n)) followed by Phase 2 (n extractions in O(n log n)).",
    ],
  },

  "computer-science/dsa/linked-list": {
    title: "Linked List Data Structure Lab",
    overview:
      "Visualizes dynamic memory node allocation, pointers/references, Singly and Doubly Linked Lists, insertion/deletion operations, and list reversal.",
    howToUse: [
      "Choose operation: Insert Head, Insert Tail, Insert at Index, Delete Value, Search, Reverse.",
      "Enter a value and click 'Execute' to watch pointer updates (`next` and `prev` pointers).",
      "Observe node traversals stepping sequentially from head node (O(n) search time).",
    ],
    controls: [
      "List type toggle: Singly Linked List vs Doubly Linked List",
      "Node operation controls: Push Head, Push Tail, Pop Head, Delete Index, Reverse List",
      "Interactive node value input field",
    ],
    keyConcepts: [
      "Node anatomy: Data field + Next pointer (+ Prev pointer in doubly linked)",
      "Insertion/Deletion at Head: O(1) constant time (no array shifting required)",
      "Search and Random Access by Index: O(n) linear time",
      "No contiguous memory requirement unlike arrays",
    ],
    whatToTry: [
      "Click 'Reverse List' to watch pointers flip one-by-one using three pointers: prev, current, next.",
    ],
  },

  "computer-science/dsa/stack": {
    title: "Stack (LIFO) Data Structure Lab",
    overview:
      "Explores the Last-In, First-Out (LIFO) Stack data structure, visualizing push, pop, peek operations, stack overflow/underflow, and balanced parenthesis matching.",
    howToUse: [
      "Enter a value and click 'Push' to add it to the top of the stack.",
      "Click 'Pop' to remove the top element, or 'Peek' to inspect the top value.",
      "Try the 'Balanced Parentheses' algorithmic solver to watch brackets push and pop.",
    ],
    controls: [
      "Value input box and Push, Pop, Peek, Clear buttons",
      "Stack capacity limiter with Overflow alert",
      "Application demo: Balanced Bracket Evaluator (e.g. `{[()]}`)",
    ],
    keyConcepts: [
      "LIFO Principle: The most recently added element is always the first one removed",
      "Push, Pop, Peek operations are all O(1) constant time",
      "Used in Function Call Stacks, Undo/Redo buffers, and Depth-First Search (DFS)",
    ],
    whatToTry: [
      "Input an unbalanced string like `({[}])` to watch the stack detect mismatch.",
    ],
  },

  "computer-science/dsa/queue": {
    title: "Queue (FIFO) & Circular Buffer Lab",
    overview:
      "Explores the First-In, First-Out (FIFO) Queue data structure, enqueue/dequeue operations, circular array buffer wrap-around, and priority queues.",
    howToUse: [
      "Enter an item and click 'Enqueue' to insert at the rear/tail of the queue.",
      "Click 'Dequeue' to remove the front element.",
      "Watch the Front and Rear pointers advance in the Circular Buffer animation.",
    ],
    controls: [
      "Enqueue, Dequeue, Peek Front, Clear controls",
      "Queue implementation mode: Linear Linked Queue vs Fixed Circular Array Buffer",
      "Application demo: BFS Graph traversal queue",
    ],
    keyConcepts: [
      "FIFO Principle: The oldest element added is always the first one removed",
      "Enqueue and Dequeue operations are O(1) constant time",
      "Circular buffer wraps pointers using modulo arithmetic: `rear = (rear + 1) % capacity`",
      "Used in Breadth-First Search (BFS), print job spoolers, and CPU process scheduling",
    ],
    whatToTry: [
      "Fill a circular queue to capacity, dequeue 2 elements, and enqueue 2 new items to watch the rear pointer wrap around to index 0.",
    ],
  },

  "computer-science/dsa/graph-algorithms": {
    title: "Graph Algorithms & Network Flow Lab",
    overview:
      "Interactive node-edge graph studio: Shortest Paths (Dijkstra, BFS, Bellman-Ford), Minimum Spanning Trees (Kruskal with DSU, Prim), and Vertex Coloring (Chromatic number χ).",
    howToUse: [
      "Click on the canvas to place nodes; drag between nodes to create weighted edges.",
      "Select a start node S and destination T, then click 'Run Dijkstra' to watch edge relaxations.",
      "Switch to 'Spanning Tree' tab to step through Kruskal's greedy edge sorting and cycle rejection.",
      "Check 'Graph Coloring' to find minimum colors needed such that no adjacent vertices share a color.",
    ],
    controls: [
      "Graph presets: Petersen graph, Complete K5, Bipartite K3,3, Road Network, Random Graph",
      "Algorithm tabs: Dijkstra Shortest Path, Kruskal MST, Prim MST, Graph Coloring",
      "Step-by-step execution playback controls",
    ],
    keyConcepts: [
      "Dijkstra's Algorithm: Greedy shortest path using priority queue edge relaxation (O((V + E) log V))",
      "Kruskal's Algorithm: Sorts all edges, adds lowest weight edge that doesn't create a cycle using Disjoint Set Union (DSU)",
      "Four Color Theorem: Every planar graph can be colored with at most 4 colors (χ(G) ≤ 4)",
    ],
    whatToTry: [
      "Load the complete bipartite graph K3,3 and verify its chromatic number is exactly 2.",
    ],
  },

  "computer-science/logic-gates/and-gate": {
    title: "AND Logic Gate Simulator",
    overview:
      "Interactive digital logic laboratory for the fundamental 2-input AND gate, truth tables, transistor schematics, and timing diagrams.",
    howToUse: [
      "Toggle Input A and Input B between 0 (Low / Off) and 1 (High / On).",
      "Observe that Output Q turns 1 ONLY when BOTH Input A AND Input B are 1.",
      "Inspect the live truth table and interactive transistor series switch model.",
    ],
    controls: ["Input A switch (0/1)", "Input B switch (0/1)", "Output LED probe (0/1)"],
    keyConcepts: ["Boolean Equation: Q = A · B (A AND B)", "Truth table: (0,0)→0, (0,1)→0, (1,0)→0, (1,1)→1"],
  },

  "computer-science/logic-gates/or-gate": {
    title: "OR Logic Gate Simulator",
    overview:
      "Interactive digital logic laboratory for the 2-input OR gate, truth tables, and parallel transistor switch circuits.",
    howToUse: [
      "Toggle Input A and Input B switches.",
      "Observe that Output Q turns 1 if EITHER Input A OR Input B (or both) are 1.",
    ],
    controls: ["Input A switch (0/1)", "Input B switch (0/1)", "Output indicator"],
    keyConcepts: ["Boolean Equation: Q = A + B (A OR B)", "Truth table: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→1"],
  },

  "computer-science/logic-gates/not-gate": {
    title: "NOT Logic Gate (Inverter) Simulator",
    overview:
      "Interactive digital inverter: inverts logical high to low and low to high.",
    howToUse: ["Toggle Input A (0 or 1); observe Output Q is always the exact inverted complement."],
    controls: ["Input A switch (0/1)", "Output indicator"],
    keyConcepts: ["Boolean Equation: Q = ¬A = A'", "Truth table: 0→1, 1→0"],
  },

  "computer-science/logic-gates/nand-gate": {
    title: "NAND Universal Gate Simulator",
    overview:
      "Interactive universal NAND gate (NOT-AND): outputs 0 only when both inputs are 1; can be combined to synthesize all other Boolean logic gates.",
    howToUse: [
      "Toggle Input A and Input B; observe output is 0 only when both inputs are 1.",
      "Explore the 'Universal Gate Circuit Builder' to build NOT, AND, and OR gates using only NAND gates.",
    ],
    controls: ["Input switches", "Universal gate circuit presets"],
    keyConcepts: [
      "Boolean Equation: Q = ¬(A · B)",
      "Universality: Any Boolean function can be implemented using exclusively NAND gates",
    ],
  },

  "computer-science/logic-gates/nor-gate": {
    title: "NOR Universal Gate Simulator",
    overview:
      "Interactive universal NOR gate (NOT-OR): outputs 1 only when both inputs are 0.",
    howToUse: ["Toggle inputs to observe NOR behavior and explore building an SR Flip-Flop memory latch."],
    controls: ["Input switches", "SR Latch preset toggle"],
    keyConcepts: ["Boolean Equation: Q = ¬(A + B)", "Universality: Any Boolean function can be implemented using exclusively NOR gates"],
  },

  "computer-science/logic-gates/xor-gate": {
    title: "XOR (Exclusive OR) Gate Simulator",
    overview:
      "Interactive XOR gate: outputs 1 when inputs differ (odd parity), fundamental for binary addition (Half Adders and Full Adders).",
    howToUse: [
      "Toggle inputs; observe output is 1 when inputs are unequal (A ≠ B).",
      "Inspect the Half Adder circuit demo combining XOR (Sum) and AND (Carry).",
    ],
    controls: ["Input switches", "Half Adder circuit demo"],
    keyConcepts: ["Boolean Equation: Q = A ⊕ B = A'B + AB'", "Truth table: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0"],
  },

  "computer-science/logic-gates/xnor-gate": {
    title: "XNOR (Equivalence) Gate Simulator",
    overview:
      "Interactive XNOR gate: outputs 1 when inputs are identical (A = B), used in equality comparators.",
    howToUse: ["Toggle inputs; observe output is 1 when inputs match ((0,0) or (1,1))."],
    controls: ["Input switches", "Equality comparator demo"],
    keyConcepts: ["Boolean Equation: Q = ¬(A ⊕ B) = AB + A'B'"],
  },

  "computer-science/git-simulator": {
    title: "Interactive Git Version Control Simulator",
    overview:
      "Visualizes Git DAG commit trees, branches, HEAD pointers, merges (Fast-Forward vs 3-Way), rebases, and detached HEAD states in a sandbox terminal.",
    howToUse: [
      "Type Git commands in the terminal (e.g. `git commit -m 'feat'`, `git branch dev`, `git checkout dev`, `git merge main`).",
      "Watch the visual DAG node tree update in real-time with moving branch tags and HEAD pointer.",
      "Practice merge conflict resolution and interactive rebasing.",
    ],
    controls: [
      "Interactive bash-style terminal emulator",
      "Visual commit graph with branch tags (main, dev, feature) and HEAD pointer",
      "Command quick buttons: Commit, Branch, Checkout, Merge, Rebase, Reset",
    ],
    keyConcepts: [
      "Git stores snapshots, not deltas, linked in a Directed Acyclic Graph (DAG)",
      "HEAD: Pointer to the currently checked-out commit or branch",
      "Fast-Forward Merge: Simply moves branch pointer forward when no diverging commits exist",
      "3-Way Merge: Creates a new merge commit with two parent references",
    ],
    whatToTry: [
      "Create a feature branch, make 2 commits, checkout main, make 1 commit on main, and merge feature to see a 3-way merge commit created.",
    ],
  },

  "computer-science/networking/osi-model": {
    title: "OSI 7-Layer Model Simulator",
    overview:
      "Interactive network stack visualizer demonstrating data encapsulation/decapsulation across all 7 OSI layers (Application to Physical) for HTTP, TCP, IP, and Ethernet.",
    howToUse: [
      "Select protocol payload (e.g. HTTP GET request) and click 'Send Data'.",
      "Watch the data packet travel DOWN the Sender stack, adding layer headers (Encapsulation).",
      "Watch packets transmit across Physical medium as bits and travel UP the Receiver stack (Decapsulation).",
      "Click any layer to inspect its PDU name, devices (Routers, Switches), and protocols.",
    ],
    controls: [
      "Transport protocol toggle: TCP (Reliable 3-way handshake) vs UDP (Fast datagrams)",
      "Step-by-step encapsulation sequencer",
      "7 Layer interactive cards: 7. Application, 6. Presentation, 5. Session, 4. Transport, 3. Network, 2. Data Link, 1. Physical",
    ],
    keyConcepts: [
      "Encapsulation: Layer 7 Data → Layer 4 Segment → Layer 3 Packet → Layer 2 Frame → Layer 1 Bits",
      "Layer 3 (Network): IP Addressing and routing across networks (Routers)",
      "Layer 2 (Data Link): MAC Addressing and local frame delivery (Switches)",
    ],
    whatToTry: [
      "Compare TCP vs UDP transmission to see how TCP adds sequence numbers and requires acknowledgment packets.",
    ],
  },

  "computer-science/networking/packet-switching": {
    title: "Packet Switching Network Simulator",
    overview:
      "Simulates packet fragmentation, independent routing across mesh router topologies, buffer queuing, latency, and out-of-order packet reassembly.",
    howToUse: [
      "Transmit a file (e.g. 10 KB image) across the network mesh.",
      "Watch the file fragment into numbered packets routed independently across intermediate hops.",
      "Introduce link failures or network congestion to observe dynamic rerouting and packet reordering at the destination.",
    ],
    controls: [
      "Network traffic load slider and link failure injector",
      "Packet size and hop delay controls",
      "Destination reassembly buffer inspector",
    ],
    keyConcepts: [
      "Packet switching: Data is split into packets routed independently over shared infrastructure (the architecture of the Internet)",
      "Store-and-Forward: Routers receive full packet before forwarding to next hop",
      "Stateless routing with TCP reassembly at destination",
    ],
    whatToTry: [
      "Fail a primary backbone router mid-transmission to watch packets automatically take longer alternative paths.",
    ],
  },

  "computer-science/networking/circuit-switching": {
    title: "Circuit Switching Telephony Simulator",
    overview:
      "Simulates traditional circuit-switched networks (e.g. landline PSTN), physical path reservation, dedicated bandwidth, and call blocking when trunks are saturated.",
    howToUse: [
      "Initiate a call between Node A and Node B to establish a dedicated reserved circuit.",
      "Observe continuous zero-jitter transmission along the reserved path.",
      "Simulate high traffic loads to witness call blocking (busy signals) when all trunk lines are occupied.",
    ],
    controls: [
      "Call setup and teardown buttons",
      "Trunk line capacity slider",
      "Comparison toggle: Circuit Switching vs Packet Switching",
    ],
    keyConcepts: [
      "Dedicated bandwidth with zero queueing jitter once connected",
      "Call setup latency and inefficient bandwidth utilization during silence",
      "Blocking occurs when no end-to-end path is available",
    ],
    whatToTry: [
      "Saturate all trunk lines and attempt to place a new call to observe the connection rejection.",
    ],
  },

  "computer-science/networking/topology-builder": {
    title: "Network Topology Builder Lab",
    overview:
      "Build, configure, and stress-test custom network topologies: Star, Bus, Ring, Mesh, and Hybrid networks with subnet IP addressing and packet ping tools.",
    howToUse: [
      "Drag routers, switches, and PCs onto the canvas; connect them with copper or fiber cables.",
      "Assign IP addresses and default gateways.",
      "Use the 'Ping Packet' tool to test end-to-end connectivity across subnets.",
      "Break links to test single points of failure and network redundancy.",
    ],
    controls: [
      "Device palette: Router, Switch, Server, PC, Access Point",
      "Topology templates: Star, Mesh, Ring, Bus",
      "Ping tool with ICMP echo request/reply packet animation",
    ],
    keyConcepts: [
      "Star topology: Central switch; single hub failure affects all, but single cable failure isolates only one node",
      "Mesh topology: Highest redundancy and fault tolerance, but highest cabling cost (n(n-1)/2 links in full mesh)",
    ],
    whatToTry: [
      "Build a Star network and disconnect the central switch to watch all communication collapse.",
    ],
  },

  "computer-science/cryptography": {
    title: "Classical & Modern Cryptography Studio",
    overview:
      "Comprehensive cryptography suite covering Caesar wheel ciphers, Vigenère 26x26 tables, WWII 3-rotor Enigma machines, Diffie-Hellman Key Exchange, and SHA-256 Proof-of-Work Bitcoin mining.",
    howToUse: [
      "Switch between 5 dedicated cryptography modules: Caesar, Vigenère, Enigma, Diffie-Hellman, and SHA-256.",
      "In Caesar: rotate the wheel and click 'Auto-Crack' to see Chi-squared frequency analysis.",
      "In Enigma: set rotor types, starting positions, and plugboard wires; type plaintext to see electrical signal routing.",
      "In Diffie-Hellman: mix public and secret colors to derive shared secret keys over insecure channels.",
      "In SHA-256: modify 1 character to observe the 256-bit avalanche effect, then mine a block with Proof-of-Work.",
    ],
    controls: [
      "Module selector: Caesar Cipher, Vigenère Matrix, Enigma Machine, Diffie-Hellman, SHA-256 Hashing",
      "Cipher wheel rotation handles, rotor wiring dials, and live hash bit-difference maps",
    ],
    keyConcepts: [
      "Symmetric vs Asymmetric Encryption",
      "Frequency Analysis: Single substitution ciphers preserve letter frequency spikes (E, T, A, O, I, N)",
      "Diffie-Hellman: One-way trapdoor discrete logarithm problem: g^ab mod p",
      "Cryptographic Hash: Deterministic, preimage resistant, and exhibits strict avalanche effect",
    ],
    whatToTry: [
      "In Enigma, type 'A' repeatedly and watch how the lampboard illuminates a different letter on every keystroke due to rotor stepping.",
    ],
  },

  "computer-science/ai-problem/maze-qlearn": {
    title: "Q-Learning Reinforcement Learning Maze",
    overview:
      "Simulates an autonomous AI reinforcement learning agent learning to navigate an obstacle maze to reach a goal reward using Q-Table Bellman equation updates.",
    howToUse: [
      "Draw custom walls and place the Reward Goal on the grid.",
      "Adjust Exploration Rate (Epsilon ε), Learning Rate (Alpha α), and Discount Factor (Gamma γ).",
      "Click 'Train Agent' and watch the agent transition from random exploration to optimal shortest-path exploitation.",
      "Inspect the live Q-Table heatmap showing learned directional state-action values.",
    ],
    controls: [
      "Epsilon (ε) exploration slider (0.0 to 1.0) and Decay rate",
      "Learning rate (α) and Discount factor (γ) sliders",
      "Training speed multiplier (1x to 100x episodes)",
      "Q-Table state heatmap overlay on grid tiles",
    ],
    keyConcepts: [
      "Bellman Equation: Q(s, a) ← Q(s, a) + α[R + γ·max Q(s', a') - Q(s, a)]",
      "Exploration vs Exploitation trade-off (ε-greedy policy)",
      "Discount factor γ determines how much the agent values future rewards vs immediate rewards",
    ],
    whatToTry: [
      "Set epsilon ε = 0 (no exploration) from the start and observe the agent fail to discover the goal.",
    ],
  },

  // ────────────────── MATHEMATICS LABS ──────────────────
  "mathematics/functiongrapher": {
    title: "Interactive Function Grapher & Calculus Studio",
    overview:
      "Interactive 2D Cartesian function plotter supporting multi-function overlays, real-time scaling/shifting transformations, root finding, local extrema detection, tangent line derivatives, and definite integration.",
    howToUse: [
      "Enter any formula (e.g. `x^3 - 3*x`, `sin(x)*exp(-0.1*x)`, `2*x^2 - 4*x + 1`) or pick from the preset gallery.",
      "Use the Transformation sliders to adjust amplitude (a), frequency (b), horizontal shift (h), and vertical shift (k) for a·f(b(x - h)) + k.",
      "Hover over the curve to inspect tangent slopes f'(x) and coordinates.",
      "Open the Analysis panel to view detected roots, y-intercepts, critical turning points, and compute definite integrals using Simpson's rule.",
    ],
    controls: [
      "Formula math expression input with multi-function support (f₁(x), f₂(x))",
      "Transformation parameter sliders: a (scale y), b (scale x), h (shift x), k (shift y)",
      "Tangent line probe with live derivative readout",
      "Definite integral bounds slider [a, b] with shaded area display",
    ],
    keyConcepts: [
      "Function Transformations: y = a·f(b(x - h)) + k",
      "Roots (x-intercepts) where f(x) = 0",
      "Turning points (local extrema) where derivative f'(x) = 0 and changes sign",
      "Definite Integral: Represents net signed area under curve: ∫[a to b] f(x) dx",
    ],
    whatToTry: [
      "Plot `sin(x)` and compute the integral from 0 to π: observe the exact bounded area is 2.00.",
      "Plot `x^3 - 3*x` to inspect its 3 real roots (-√3, 0, +√3) and local max at (-1, 2) and min at (1, -2).",
    ],
  },

  "mathematics/trigonometry": {
    title: "Trigonometry & Unit Circle Visualizer",
    overview:
      "Connects the geometric Unit Circle (radius r = 1) to continuous sine, cosine, tangent waves, ASTC quadrant sign rules, Pythagorean identities, and wave transformations.",
    howToUse: [
      "Drag the angle point (θ) around the unit circle or use the angle slider in degrees/radians.",
      "Observe how coordinates (x, y) map directly to (cos θ, sin θ) and right triangle opposite/adjacent ratios.",
      "Watch the continuous sinusoidal wave unfold horizontally along the real axis.",
      "Switch to 'Transformations' tab to adjust amplitude (A), frequency (B), phase shift (C), and vertical offset (D).",
    ],
    controls: [
      "Interactive draggable angle arm on Unit Circle with degree / radian readouts",
      "Special angle quick snap buttons (0°, 30°, 45°, 60°, 90°, 180°, 270°, 360°)",
      "ASTC Quadrant sign highlighter",
      "Sinusoidal wave transformation sliders: y = A·sin(B(x - C)) + D",
    ],
    keyConcepts: [
      "Unit Circle definitions: x = cos(θ), y = sin(θ), tan(θ) = sin(θ)/cos(θ)",
      "Pythagorean Trigonometric Identity: sin²(θ) + cos²(θ) = 1 (from x² + y² = 1)",
      "ASTC Rule: All positive in Q1, Sine in Q2, Tangent in Q3, Cosine in Q4",
      "Period T = 2π / B; Amplitude = |A|",
    ],
    whatToTry: [
      "Rotate angle into Quadrant 2 (120°) to see why sin(120°) > 0 but cos(120°) < 0.",
    ],
  },

  "mathematics/polynomials": {
    title: "Quadratic & Polynomial Explorer",
    overview:
      "Explores quadratic parabolas, vertex form, discriminant analysis (Δ = b² - 4ac), real vs complex conjugate roots, higher-degree polynomials, and synthetic division.",
    howToUse: [
      "Adjust quadratic coefficients a, b, c for f(x) = ax² + bx + c.",
      "Observe the parabola vertex (h, k), axis of symmetry (x = -b/2a), and discriminant Δ.",
      "Switch to cubic/quartic polynomials or use the interactive synthetic division tool.",
    ],
    controls: [
      "Coefficients sliders for a, b, c, d",
      "Discriminant analysis panel with root classification",
      "Parabola geometric overlays: Focus point, Directrix line, Vertex marker",
    ],
    keyConcepts: [
      "Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)",
      "Discriminant Δ = b² - 4ac: Δ > 0 (2 distinct real roots), Δ = 0 (1 repeated root), Δ < 0 (2 complex conjugate roots)",
      "Vertex: (h, k) = (-b / 2a, f(-b / 2a))",
      "Vieta's Formulas: Sum of roots = -b/a, Product of roots = c/a",
    ],
    whatToTry: [
      "Set a = 1, b = 0, c = 4 (x² + 4 = 0) to inspect complex roots x = ±2i and see the parabola float above the x-axis.",
    ],
  },

  "mathematics/calculus": {
    title: "Calculus, Derivatives & Riemann Sums Lab",
    overview:
      "Explores limits, secant-to-tangent line derivative transitions, difference quotients, Riemann sum approximations (Left, Right, Midpoint, Trapezoidal), and the Fundamental Theorem of Calculus.",
    howToUse: [
      "Select a function f(x) and set evaluation point x₀.",
      "Drag step size h toward 0 to watch the secant line smoothly converge into the instantaneous tangent line f'(x).",
      "Switch to 'Integration' tab, set subinterval partitions (n), and compare Left/Right/Midpoint/Trapezoid Riemann sums to the exact integral.",
    ],
    controls: [
      "Evaluation point x₀ slider and secant step size h slider",
      "Riemann sum partition slider n (1 to 100 rectangles)",
      "Riemann sum type selector: Left-endpoint, Right-endpoint, Midpoint, Trapezoidal",
    ],
    keyConcepts: [
      "Derivative definition: f'(x) = lim[h→0] (f(x + h) - f(x)) / h",
      "Definite Integral as limit of Riemann sums: ∫[a to b] f(x) dx = lim[n→∞] Σ f(xᵢ*)·Δx",
      "Fundamental Theorem of Calculus: d/dx ∫[a to x] f(t) dt = f(x) and ∫[a to b] f'(x) dx = f(b) - f(a)",
    ],
    whatToTry: [
      "Increase partition count n from 4 to 100 on a curved function to watch the Riemann sum error shrink toward zero.",
    ],
  },

  "mathematics/linear-algebra": {
    title: "Linear Algebra & 2D Matrix Transformations",
    overview:
      "Visualizes 2D space transformations by manipulating basis vectors î and ĵ, matrix multiplication, determinant signed area scaling, shear/rotation/reflection, and eigenvectors/eigenvalues.",
    howToUse: [
      "Drag the tip of basis vectors î (column 1) and ĵ (column 2) on the 2D coordinate grid.",
      "Watch the entire coordinate space warp, transforming custom shapes, unit squares, and vectors.",
      "Inspect the live determinant (signed area of the transformed unit square).",
      "Toggle 'Eigenvectors' to reveal vectors that remain on their original span during transformation.",
    ],
    controls: [
      "2x2 Matrix entry inputs: [[a, b], [c, d]]",
      "Transformation preset buttons: 90° Rotation, Horizontal Shear, Reflection across y=x, Projection, Singular (det=0)",
      "Eigenvector and span line overlay toggles",
    ],
    keyConcepts: [
      "Matrix multiplication transforms basis vectors: [a b; c d] maps [1; 0] → [a; c] and [0; 1] → [b; d]",
      "Determinant det(A) = ad - bc represents the factor by which areas are scaled (negative det indicates orientation flip)",
      "Eigenvector equation: A·v = λ·v (vector v only scales by factor λ without rotating off its span)",
    ],
    whatToTry: [
      "Set a matrix with det = 0 (e.g. [[1, 2], [2, 4]]) and observe how the entire 2D plane collapses into a 1D line.",
    ],
  },

  "mathematics/statistics": {
    title: "Probability, Statistics & Galton Board Lab",
    overview:
      "Simulates probability distributions, Central Limit Theorem convergence using an interactive Galton Quincunx bean machine, and Ordinary Least Squares (OLS) linear regression.",
    howToUse: [
      "Drop balls through the Galton peg board to watch individual random binary choices accumulate into a smooth Normal bell curve.",
      "Switch to 'Distributions' tab to compare Normal, Binomial, Poisson, and Uniform distributions.",
      "Switch to 'Regression' tab to plot scatter points and fit an OLS regression line with R² correlation.",
    ],
    controls: [
      "Galton board ball drop count (100 to 5000 balls) and drop speed",
      "Distribution parameters: Mean (µ), Standard Deviation (σ), Degrees of Freedom",
      "Linear regression point editor with R² and slope/intercept calculations",
    ],
    keyConcepts: [
      "Central Limit Theorem: Sum/average of independent random variables tends toward a normal distribution regardless of underlying distribution",
      "Standard Normal Curve (68-95-99.7 Empirical Rule)",
      "OLS Regression: Minimizes sum of squared vertical residuals (errors)",
    ],
    whatToTry: [
      "Drop 2000 balls on the Galton board and observe how the resulting histogram matches the theoretical binomial distribution.",
    ],
  },

  "mathematics/complex-numbers": {
    title: "Complex Numbers & Mandelbrot Fractals Lab",
    overview:
      "Visualizes complex arithmetic on the 2D Argand plane, polar form (z = re^(iθ)), Euler's formula, roots of unity, and deep zoomable Mandelbrot/Julia set fractals.",
    howToUse: [
      "Drag complex numbers z₁ and z₂ on the Argand plane to perform addition, multiplication, and inversion.",
      "Observe multiplication as rotation of angles and dilation of magnitudes (|z₁z₂| = |z₁||z₂|, arg(z₁z₂) = θ₁ + θ₂).",
      "Switch to 'Roots of Unity' to inspect regular polygons formed by z^n = 1.",
      "Explore the Mandelbrot fractal canvas: click and zoom to explore infinite recursive boundary self-similarity.",
    ],
    controls: [
      "Complex number coordinate draggers (Real Re(z) vs Imaginary Im(z))",
      "Polar form readout: Modulus (r) and Argument (θ in radians/degrees)",
      "Roots of unity integer stepper n (3 to 12)",
      "Mandelbrot and Julia set interactive zoom canvas",
    ],
    keyConcepts: [
      "Cartesian form: z = a + bi (i² = -1); Polar form: z = r(cos θ + i sin θ) = r·e^(iθ)",
      "Euler's Identity: e^(iπ) + 1 = 0",
      "Mandelbrot set definition: Set of complex numbers c for which z_{n+1} = z_n² + c remains bounded starting from z₀ = 0",
    ],
    whatToTry: [
      "Multiply a complex number by i (0 + 1i) to observe an exact +90° counter-clockwise rotation on the plane.",
    ],
  },

  "mathematics/set-theory": {
    title: "Set Theory & Boolean Algebra Lab",
    overview:
      "Interactive 2-set and 3-set Venn diagram explorer: set operations (Union, Intersection, Difference, Complement, Symmetric Difference), De Morgan's Laws, and function mappings (Injective, Surjective, Bijective).",
    howToUse: [
      "Type elements into Set A, Set B, and Set C, or enter universe U.",
      "Click set operation buttons (A ∪ B, A ∩ B, A \ B, A Δ B, (A ∪ B)') to highlight corresponding Venn regions.",
      "Verify De Morgan's Laws using truth tables and visual shaded regions.",
      "Switch to 'Function Mappings' to test Injective (One-to-One), Surjective (Onto), and Bijective relationships.",
    ],
    controls: [
      "2-Set and 3-Set Venn diagram selector",
      "Set expression builder (Union ∪, Intersection ∩, Difference \\, Complement ', Symmetric Difference Δ)",
      "Domain and Codomain mapping arrow editor",
    ],
    keyConcepts: [
      "Union (A ∪ B): Elements in A OR B; Intersection (A ∩ B): Elements in A AND B",
      "De Morgan's Laws: (A ∪ B)' = A' ∩ B' and (A ∩ B)' = A' ∪ B'",
      "Inclusion-Exclusion Principle: |A ∪ B| = |A| + |B| - |A ∩ B|",
    ],
    whatToTry: [
      "Construct `(A ∪ B)'` and `A' ∩ B'` to verify both expressions shade the exact same external region.",
    ],
  },

  "mathematics/geometry": {
    title: "Interactive Geometry Studio Lab",
    overview:
      "Euclidean geometry laboratory for straightedge-and-compass constructions, triangle centers (Centroid, Circumcenter, Incenter, Orthocenter), Euler line collinearity, circle theorems, and 2D transformations.",
    howToUse: [
      "Drag triangle vertices A, B, C freely on the canvas.",
      "Toggle triangle centers to observe the Centroid (G), Orthocenter (H), and Circumcenter (O).",
      "Enable the 'Euler Line' to verify that H, G, and O remain strictly collinear on any non-equilateral triangle.",
      "Switch to 'Circle Theorems' to explore inscribed angles, tangent-chord angles, and cyclic quadrilaterals.",
    ],
    controls: [
      "Draggable geometric vertices and snap grid",
      "Triangle centers overlay: Centroid (Medians), Incenter (Angle bisectors), Circumcenter (Perpendicular bisectors), Orthocenter (Altitudes)",
      "Circle theorems interactive demonstration gallery",
    ],
    keyConcepts: [
      "Euler Line: Orthocenter (H), Centroid (G), and Circumcenter (O) are collinear with HG : GO = 2 : 1",
      "Inscribed Angle Theorem: Inscribed angle is half the central angle subtending the same arc (θ_inscribed = ½ θ_central)",
      "Angles in the same circle segment are equal; angle in a semicircle is always a right angle (90° Thales' Theorem)",
    ],
    whatToTry: [
      "Drag vertex A on a triangle to make it obtuse and watch the Orthocenter (H) and Circumcenter (O) move outside the triangle while remaining aligned on the Euler line.",
    ],
  },

  "mathematics/vector-algebra": {
    title: "Vector Algebra & 3D Space Lab",
    overview:
      "Interactive 2D and 3D vector sandbox: vector addition (Tip-to-Tail, Parallelogram Law), Dot Product and projections, Cross Product with Right-Hand Rule, Scalar Triple Product, and 3D planes.",
    howToUse: [
      "Drag 2D vector tips u and v or type numerical coordinates.",
      "Watch vector addition (u + v) and subtraction (u - v) with parallelogram geometric overlays.",
      "Inspect the Dot Product (u · v = |u||v|cos θ) and orthogonal scalar/vector projections.",
      "Switch to 3D mode to rotate coordinate space, compute Cross Product (u × v), and visualize the parallelepiped volume from the Scalar Triple Product [u, v, w].",
    ],
    controls: [
      "2D and 3D coordinate vector draggers",
      "Vector operations panel: Addition, Subtraction, Dot Product, Cross Product, Angle between vectors, Scalar projection",
      "3D orbit rotation, zoom, and plane normal visualizer",
    ],
    keyConcepts: [
      "Dot Product: u · v = u_x·v_x + u_y·v_y + u_z·v_z = |u||v|cos(θ) (zero when vectors are orthogonal/perpendicular)",
      "Cross Product: u × v yields a vector perpendicular to both u and v with magnitude |u||v|sin(θ) (area of parallelogram)",
      "Scalar Triple Product: u · (v × w) = det([u; v; w]) represents volume of parallelepiped",
    ],
    whatToTry: [
      "Set two vectors perpendicular (θ = 90°) and verify their dot product is exactly 0.",
      "In 3D mode, reverse vector order to v × u and observe the cross product vector flip direction by 180° (anti-commutativity).",
    ],
  },

  "mathematics/combinatorics": {
    title: "Combinatorics & Discrete Counting Lab",
    overview:
      "Explores permutations P(n,r), combinations C(n,r), Pascal's Triangle with fractal modulo patterns, Binomial Theorem expansion, Dirichlet's Pigeonhole Principle, and Stars & Bars.",
    howToUse: [
      "Select total items n and chosen items r to compute Permutations P(n,r) and Combinations C(n,r).",
      "Inspect Pascal's Triangle up to row 30; toggle modulo colorings (e.g. mod 2 reveals the Sierpinski Triangle fractal).",
      "Explore the Binomial Theorem expansion for (a + b)^n with step-by-step coefficient breakdowns.",
      "Use the 'Stars & Bars' partition generator to distribute indistinguishable items into distinct bins.",
    ],
    controls: [
      "n and r steppers for P(n,r) and C(n,r)",
      "Pascal's Triangle row depth slider and Modulo p color highlighter",
      "Binomial Theorem power expansion slider",
    ],
    keyConcepts: [
      "Permutations (Order matters): P(n, r) = n! / (n - r)!",
      "Combinations (Order does not matter): C(n, r) = n! / (r! · (n - r)!) = (n choose r)",
      "Pascal's Identity: (n choose k) = (n-1 choose k-1) + (n-1 choose k)",
      "Pigeonhole Principle: If n items are put into m containers with n > m, at least one container must contain > 1 item",
    ],
    whatToTry: [
      "Set Pascal's Triangle modulo to 2 to observe the famous self-similar Sierpinski Sieve fractal emerge.",
    ],
  },

  "mathematics/number-theory": {
    title: "Number Theory & Cryptography Lab",
    overview:
      "Explores prime number generation via Sieve of Eratosthenes, Euclidean Algorithm for GCD with geometric rectangle square tiling, Modular Clock arithmetic, Euler's Totient function φ(n), RSA public-key encryption, and Collatz conjecture orbits.",
    howToUse: [
      "Run the Sieve of Eratosthenes up to N = 1000 to watch composite multiples cross out, leaving pure primes.",
      "Enter two integers a and b in Euclidean GCD to watch rectangle square-tiling find gcd(a,b) and Bézout coefficients (ax + by = gcd(a,b)).",
      "Use the Modular Clock to compute modular addition, multiplication, and inverses.",
      "Step through the RSA Cryptography demo: choose primes p and q, generate public key (e, N) and private key (d, N), and encrypt/decrypt numerical messages.",
    ],
    controls: [
      "Sieve upper bound slider N",
      "Euclidean GCD inputs a and b with geometric square tiling visualizer",
      "Modular arithmetic clock modulo modulus m slider",
      "RSA prime selector (p, q, e) with live encryption/decryption terminal",
      "Collatz conjecture starting seed input (3n + 1 trajectory plot)",
    ],
    keyConcepts: [
      "Fundamental Theorem of Arithmetic: Every integer > 1 has a unique prime factorization",
      "Euclidean Algorithm: gcd(a, b) = gcd(b, a mod b)",
      "Euler's Totient Function φ(n): Counts integers k in 1 ≤ k ≤ n coprime to n (φ(p) = p - 1 for prime p)",
      "RSA Cryptography relies on the computational hardness of factoring large semiprimes N = p·q",
    ],
    whatToTry: [
      "Test starting seed 27 in the Collatz 3n+1 simulator to watch it climb to a peak of 9,232 before resolving down to the 4-2-1 loop.",
    ],
  },

  "mathematics/differential-equations": {
    title: "Differential Equations & Dynamical Systems Lab",
    overview:
      "Simulates 1st-order direction slope fields (dy/dx = f(x, y)), Euler/Heun/RK4 numerical integrators, 2D linear phase portraits (ẋ = Ax) with Trace-Determinant stability classifications, Lotka-Volterra predator-prey dynamics, 3D Lorenz Strange Attractor with Butterfly Effect chaos, and SIR epidemic curves.",
    howToUse: [
      "In Slope Fields tab: click anywhere on the vector field to instantiate an initial condition (x₀, y₀) and compare Euler vs Heun vs RK4 trajectories.",
      "In 2D Phase Plane tab: edit matrix coefficients [[a, b], [c, d]] to classify fixed points (saddles, spirals, nodes, centers).",
      "In Lotka-Volterra tab: adjust prey birth and predator death rates to observe population cycle phase portraits.",
      "In 3D Lorenz Chaos tab: rotate the strange attractor in 3D and enable 'Dual Trajectory' (Δx₀ = 10⁻⁴) to watch sensitive dependence on initial conditions.",
      "In SIR Epidemic tab: adjust transmission rate β and recovery rate γ to simulate R₀ reproduction and curve flattening.",
    ],
    controls: [
      "Module tabs: Slope Fields, 2D Phase Plane, Lotka-Volterra, Damped Oscillators, 3D Lorenz Chaos, SIR Epidemic",
      "Matrix coefficients / differential parameters inputs",
      "Integration method toggle: Euler (1st order), Heun (2nd order), RK4 (4th order Runge-Kutta)",
      "3D canvas orbit controls for Lorenz attractor",
    ],
    keyConcepts: [
      "1st-order slope fields indicate tangent slope dy/dx at every grid point (x, y)",
      "2D Linear Stability: Trace τ = tr(A), Determinant Δ = det(A) (saddle if Δ < 0, spiral if τ² - 4Δ < 0)",
      "Lorenz Chaos: Deterministic non-periodic flow exhibiting sensitive dependence on initial conditions (Butterfly Effect)",
      "SIR Epidemic Model: Basic reproduction number R₀ = β / γ (epidemic spreads when R₀ > 1)",
    ],
    whatToTry: [
      "In 3D Lorenz tab, release two particles separated by just 0.0001 units and watch them trace identical paths initially before diverging into completely different lobes.",
    ],
  },
};

// ── 3. RESOLUTION & FORMATTING HELPERS ────────────────────────────────────────

function formatKnowledge(k: PageKnowledge): string {
  const lines: string[] = [];
  lines.push(`Title: ${k.title}`);
  lines.push(`Overview: ${k.overview}`);

  const addList = (label: string, items?: string[]) => {
    if (!items?.length) return;
    lines.push(`${label}:`);
    for (const item of items) lines.push(`- ${item}`);
  };

  addList("How to use & Step-by-step Guide", k.howToUse);
  addList("Controls & Key Tools", k.controls);
  addList("Key scientific/mathematical concepts & Formulas", k.keyConcepts);
  addList("Recommended experiments & What to try", k.whatToTry);
  addList("Common mistakes to avoid", k.commonMistakes);

  if (k.glossary && Object.keys(k.glossary).length) {
    lines.push("Glossary & Terminology:");
    for (const [term, def] of Object.entries(k.glossary)) {
      lines.push(`- ${term}: ${def}`);
    }
  }

  return lines.join("\n");
}

export function getPageKnowledgeText(pathname: string): string | null {
  if (!pathname) return null;

  // 1. Check exact hub match
  if (HUB_KNOWLEDGE[pathname]) {
    return formatKnowledge(HUB_KNOWLEDGE[pathname]);
  }

  // 2. Resolve registered lab ID (handles both /labs/... and /subject/... paths)
  const labId = resolveLabIdFromPath(pathname);
  if (labId && LAB_KNOWLEDGE[labId]) {
    return formatKnowledge(LAB_KNOWLEDGE[labId]);
  }

  // 3. Check partial key matches for sub-routes (e.g. /computer-science/logic-gates/and-gate)
  for (const [key, knowledge] of Object.entries(LAB_KNOWLEDGE)) {
    if (pathname.includes(key)) {
      return formatKnowledge(knowledge);
    }
  }

  // 4. Check top-level hub prefixes
  if (pathname.startsWith("/physics")) return formatKnowledge(HUB_KNOWLEDGE["/physics"]);
  if (pathname.startsWith("/chemistry")) return formatKnowledge(HUB_KNOWLEDGE["/chemistry"]);
  if (pathname.startsWith("/biology")) return formatKnowledge(HUB_KNOWLEDGE["/biology"]);
  if (pathname.startsWith("/computer-science")) return formatKnowledge(HUB_KNOWLEDGE["/computer-science"]);
  if (pathname.startsWith("/mathematics")) return formatKnowledge(HUB_KNOWLEDGE["/mathematics"]);

  // 5. Generic fallback
  return formatKnowledge({
    title: "OpenLabs Workbench",
    overview:
      "This is an interactive OpenLabs learning page. Guide the student step-by-step, explaining how to interact with the UI controls and how they relate to fundamental scientific and mathematical principles.",
    howToUse: [
      "Explain the primary objective of the simulation.",
      "Walk through the key sliders, buttons, and tools visible on the screen.",
      "Propose safe, exploratory experiments the user can perform right now.",
    ],
  });
}
