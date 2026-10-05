import {
  CelestialPreset,
  GeodesicParticle,
  RelativisticTelemetry,
  SpectralLine,
  EffectivePotentialPoint,
  TidalForceMetrics,
  MetricTensorValues,
  BinaryChirpParams,
  GuidedInvestigation,
} from "./types";

export const G_CONSTANT = 6.6743e-11; // m^3 kg^-1 s^-2
export const C_SPEED = 2.99792458e8;  // m/s
export const SOLAR_MASS_KG = 1.98847e30; // kg
export const EARTH_MASS_KG = 5.9722e24;  // kg
export const SOLAR_RADIUS_KM = 696340;   // km
export const EARTH_RADIUS_KM = 6371;     // km
export const STANDARD_G = 9.80665;       // m/s^2

// Schwarzschild radius calculation: r_s = 2GM / c^2
// For 1 solar mass: r_s ≈ 2.9532 km
export function computeSchwarzschildRadiusKm(massSolar: number): number {
  return (2 * G_CONSTANT * (massSolar * SOLAR_MASS_KG)) / (C_SPEED * C_SPEED * 1000);
}

export const CELESTIAL_PRESETS: CelestialPreset[] = [
  {
    id: "sun",
    name: "Sun (G-Type Main Sequence)",
    category: "star",
    massSolar: 1.0,
    radiusKm: 696340,
    description: "Our yellow dwarf star. Spacetime curvature produces Mercury's 42.98 arcsec/century anomalous precession and 1.75 arcsec light deflection during eclipses.",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.4)",
    defaultProbeDistanceRs: 250000,
    spinParam: 0.05,
  },
  {
    id: "sirius-b",
    name: "Sirius B (White Dwarf)",
    category: "compact",
    massSolar: 1.02,
    radiusKm: 5800,
    description: "Dense Earth-sized stellar remnant. Surface gravitational redshift z = 3.0×10⁻⁴ was measured in 1925 by Adams, providing historic confirmation of the Equivalence Principle.",
    color: "#60a5fa",
    glowColor: "rgba(96, 165, 250, 0.4)",
    defaultProbeDistanceRs: 2000,
    spinParam: 0.1,
  },
  {
    id: "neutron-star",
    name: "Vela Pulsar (Neutron Star)",
    category: "compact",
    massSolar: 1.4,
    radiusKm: 12.0,
    description: "Ultra-dense nuclear matter core. Surface gravity is ~2×10¹¹ g, escape velocity exceeds 0.6c, and relativistic frame dragging spins surrounding spacetime at 11 rotations per second.",
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.6)",
    defaultProbeDistanceRs: 2.8,
    spinParam: 0.35,
  },
  {
    id: "cygnus-x1",
    name: "Cygnus X-1 (Stellar Black Hole)",
    category: "blackhole",
    massSolar: 21.2,
    radiusKm: 62.6, // r_s
    description: "Classic stellar-mass black hole. Features a blazing X-ray accretion disk, a photon sphere at 1.5 r_s, and an Innermost Stable Circular Orbit (ISCO) at 3.0 r_s.",
    color: "#1e1b4b",
    glowColor: "rgba(147, 51, 234, 0.6)",
    defaultProbeDistanceRs: 3.5,
    spinParam: 0.95,
  },
  {
    id: "sagittarius-a",
    name: "Sagittarius A* (Supermassive Black Hole)",
    category: "blackhole",
    massSolar: 4150000, // 4.15 million M_sun
    radiusKm: 12250000, // r_s ≈ 12.25 million km (~0.08 AU)
    description: "Supermassive black hole at the center of the Milky Way, imaged by the Event Horizon Telescope. Due to its enormous mass, tidal forces at the event horizon are mild enough for humans to survive crossing.",
    color: "#030712",
    glowColor: "rgba(234, 88, 12, 0.7)",
    defaultProbeDistanceRs: 3.0,
    spinParam: 0.9,
  },
  {
    id: "gargantua",
    name: "Miller's Planet Host (Extreme Kerr Regime)",
    category: "blackhole",
    massSolar: 100000000, // 100 million M_sun
    radiusKm: 295320000,
    description: "Ultra-relativistic Kerr spinning black hole where 1 hour on the surface equals 7 Earth years (time dilation factor γ ≈ 61,320).",
    color: "#09090b",
    glowColor: "rgba(244, 63, 94, 0.7)",
    defaultProbeDistanceRs: 1.00000000026,
    spinParam: 0.998,
  },
];

export const SPECTRAL_LINES: SpectralLine[] = [
  {
    id: "h-alpha",
    name: "Hydrogen-α (Balmer Series)",
    element: "Hydrogen",
    restWavelengthNm: 656.28,
    restColorHex: "#ef4444", // Crimson Red
    description: "Prominent stellar absorption line produced when an electron transitions between n=3 and n=2.",
  },
  {
    id: "na-d",
    name: "Sodium-D Doublet",
    element: "Sodium",
    restWavelengthNm: 589.29,
    restColorHex: "#f59e0b", // Amber Yellow
    description: "Intense doublet signature observed in stellar atmospheres and laboratory gas discharge tubes.",
  },
  {
    id: "h-beta",
    name: "Hydrogen-β (Cyan)",
    element: "Hydrogen",
    restWavelengthNm: 486.13,
    restColorHex: "#06b6d4", // Cyan
    description: "Balmer series transition n=4 to n=2, providing sensitive stellar temperature diagnostics.",
  },
  {
    id: "hg-green",
    name: "Mercury Green Line",
    element: "Mercury",
    restWavelengthNm: 546.07,
    restColorHex: "#10b981", // Emerald Green
    description: "High-precision laboratory reference line from excited mercury vapor.",
  },
  {
    id: "lyman-alpha",
    name: "Lyman-α (Far Ultraviolet)",
    element: "Hydrogen",
    restWavelengthNm: 121.57,
    restColorHex: "#8b5cf6", // Deep Violet / UV proxy
    description: "Ground-state hydrogen resonance transition (n=2 to n=1) ubiquitous in high-redshift cosmology.",
  },
];

// ── Tidal Forces & Spaghettification Physics ───────────────────────────────
// Delta_a = (2 * G * M * Delta_r) / r^3
export function computeTidalForceMetrics(
  massSolar: number,
  probeRadiusKm: number
): TidalForceMetrics {
  const mKg = massSolar * SOLAR_MASS_KG;
  const rMeters = Math.max(1000, probeRadiusKm * 1000);
  const humanHeightMeters = 1.8;

  // Tidal acceleration difference across head and feet:
  const deltaA = (2 * G_CONSTANT * mKg * humanHeightMeters) / Math.pow(rMeters, 3);
  const humanTidalG = deltaA / STANDARD_G;

  let spaghettificationStatus: "negligible" | "noticeable" | "lethal" | "extreme" = "negligible";
  let statusColor = "#22c55e"; // Green

  if (humanTidalG > 50) {
    spaghettificationStatus = "extreme";
    statusColor = "#ef4444"; // Red (Spaghettification)
  } else if (humanTidalG > 5) {
    spaghettificationStatus = "lethal";
    statusColor = "#f97316"; // Orange
  } else if (humanTidalG > 0.1) {
    spaghettificationStatus = "noticeable";
    statusColor = "#eab308"; // Yellow
  }

  // Fluid Roche radius: d_roche ≈ 2.44 * R_star * (rho_M / rho_m)^(1/3)
  const rsKm = computeSchwarzschildRadiusKm(massSolar);
  const rocheRadiusKm = rsKm * 2.44;

  return {
    humanTidalG,
    spaghettificationStatus,
    statusColor,
    rocheRadiusKm,
  };
}

// ── Relativistic Effective Potential Curve ─────────────────────────────────
// V_eff(r) = (1 - r_s / r) * (1 + L^2 / (c^2 * r^2))
export function computeEffectivePotentialCurve(
  rsKm: number,
  angularMomentumL: number = 3.6
): EffectivePotentialPoint[] {
  const points: EffectivePotentialPoint[] = [];
  const minR = 1.05;
  const maxR = 9.0;
  const step = 0.15;

  for (let r = minR; r <= maxR; r += step) {
    const term1 = 1 - 1 / r;
    const term2 = 1 + (angularMomentumL * angularMomentumL) / (r * r);
    const potential = term1 * term2;
    points.push({ rRs: r, potential });
  }

  return points;
}

// Convert wavelength (nm) to approximate RGB color hex string
export function wavelengthToRGB(wavelengthNm: number): string {
  let r = 0, g = 0, b = 0;

  if (wavelengthNm >= 380 && wavelengthNm < 440) {
    r = -(wavelengthNm - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wavelengthNm >= 440 && wavelengthNm < 490) {
    r = 0.0;
    g = (wavelengthNm - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelengthNm >= 490 && wavelengthNm < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wavelengthNm - 510) / (510 - 490);
  } else if (wavelengthNm >= 510 && wavelengthNm < 580) {
    r = (wavelengthNm - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wavelengthNm >= 580 && wavelengthNm < 645) {
    r = 1.0;
    g = -(wavelengthNm - 645) / (645 - 580);
    b = 0.0;
  } else if (wavelengthNm >= 645 && wavelengthNm <= 750) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else if (wavelengthNm > 750) {
    // Infrared (dim crimson/burgundy indicator)
    return "#7f1d1d";
  } else {
    // Ultraviolet (deep violet indicator)
    return "#581c87";
  }

  // Intensity ramp-down near optical edges
  let factor = 1.0;
  if (wavelengthNm >= 380 && wavelengthNm < 420) {
    factor = 0.3 + (0.7 * (wavelengthNm - 380)) / (420 - 380);
  } else if (wavelengthNm >= 700 && wavelengthNm <= 750) {
    factor = 0.3 + (0.7 * (750 - wavelengthNm)) / (750 - 700);
  }

  const red = Math.round(255 * Math.pow(r * factor, 0.8));
  const green = Math.round(255 * Math.pow(g * factor, 0.8));
  const blue = Math.round(255 * Math.pow(b * factor, 0.8));

  return `rgb(${red}, ${green}, ${blue})`;
}

export function computeRelativisticTelemetry(
  massSolar: number,
  probeRadiusRs: number,
  spinParam: number = 0
): RelativisticTelemetry {
  const rsKm = computeSchwarzschildRadiusKm(massSolar);
  const probeRadiusKm = Math.max(rsKm * 1.00001, probeRadiusRs * rsKm);
  const ratio = rsKm / probeRadiusKm;

  // Escape velocity: v_esc / c = sqrt(r_s / r)
  const escapeVelocityC = Math.min(1.0, Math.sqrt(Math.min(1.0, ratio)));
  const escapeVelocityKms = escapeVelocityC * (C_SPEED / 1000);

  // Time dilation factor: gamma = 1 / sqrt(1 - r_s / r)
  const denom = Math.max(0.00001, 1 - ratio);
  const timeDilationFactor = 1 / Math.sqrt(denom);

  // Gravitational redshift z = 1 / sqrt(1 - r_s/r) - 1
  const gravitationalRedshiftZ = timeDilationFactor - 1;

  // Photon sphere and ISCO
  const photonSphereKm = 1.5 * rsKm;
  const iscoKm = 3.0 * rsKm;

  // Kerr metric event horizon and ergosphere
  const clampedSpin = Math.max(0, Math.min(0.998, spinParam));
  const kerrHorizonFraction = 0.5 * (1 + Math.sqrt(Math.max(0, 1 - clampedSpin * clampedSpin)));
  const kerrEventHorizonKm = rsKm * kerrHorizonFraction;
  const ergosphereEquatorKm = rsKm; // r_E = 2M = r_s at equator

  // Light deflection angle: alpha = 4GM / (c^2 b) = 2 r_s / b (in radians)
  const deflectionRad = (2 * rsKm) / probeRadiusKm;
  const deflectionDeg = (deflectionRad * 180) / Math.PI;
  const deflectionArcsec = deflectionDeg * 3600;

  // Mercury perihelion precession rate
  const mercuryPrecessionArcsecCentury = 42.98 * (massSolar / 1.0);

  // GPS precision values (Earth-based benchmarks)
  const gpsGravitationalDriftUsDay = 45.9;
  const gpsKinematicDriftUsDay = -7.2;
  const gpsNetDriftUsDay = 38.7;

  // Tidal forces on human body
  const tidal = computeTidalForceMetrics(massSolar, probeRadiusKm);

  return {
    massSolar,
    massKg: massSolar * SOLAR_MASS_KG,
    schwarzschildRadiusKm: rsKm,
    photonSphereKm,
    iscoKm,
    probeRadiusKm,
    probeRadiusRs,
    escapeVelocityC,
    escapeVelocityKms,
    timeDilationFactor,
    gravitationalRedshiftZ,
    lightDeflectionArcsec: deflectionArcsec,
    lightDeflectionDeg: deflectionDeg,
    mercuryPrecessionArcsecCentury,
    gpsGravitationalDriftUsDay,
    gpsKinematicDriftUsDay,
    gpsNetDriftUsDay,
    tidal,
    kerrEventHorizonKm,
    ergosphereEquatorKm,
    metric: computeMetricTensor(massSolar, probeRadiusRs, clampedSpin),
  };
}

// ── Geodesic RK4 Integrator with General Relativistic Correction Term ────
// d^2r/dtau^2 = -GM/r^2 + L^2/r^3 - 3GM L^2 / (c^2 r^4)
export function stepGeodesicRK4(
  particle: GeodesicParticle,
  dt: number,
  gm: number = 100,
  cSpeed: number = 18,
  rs: number = 2.0,
  spinA: number = 0
): GeodesicParticle {
  if (!particle.active || particle.absorbed) return particle;

  const rSq = particle.x * particle.x + particle.y * particle.y;
  const r = Math.sqrt(rSq);

  // If crossed event horizon, absorb
  if (r <= rs) {
    return {
      ...particle,
      active: false,
      absorbed: true,
    };
  }

  // Acceleration function:
  // a = -gm * r_hat / r^2 * (1 + 3 * L^2 / (c^2 * r^2)) + frameDragging
  const getAcc = (x: number, y: number, vx: number, vy: number) => {
    const curRSq = Math.max(0.0001, x * x + y * y);
    const curR = Math.sqrt(curRSq);
    const angMom = x * vy - y * vx; // L = r x v
    const angMomSq = angMom * angMom;
    
    // Einstein GR correction factor: (1 + 3 L^2 / (c^2 r^2))
    const grFactor = 1.0 + (3.0 * angMomSq) / (cSpeed * cSpeed * curRSq);
    const totalA = (-gm / curRSq) * grFactor;

    let ax = totalA * (x / curR);
    let ay = totalA * (y / curR);

    // Lense-Thirring frame dragging for rotating Kerr black hole
    if (spinA > 0.01) {
      const dragStrength = (2 * gm * spinA * 4) / Math.pow(curR, 3);
      ax += -dragStrength * (y / curR);
      ay += dragStrength * (x / curR);
    }

    return { ax, ay };
  };

  // Classical RK4 steps
  const a1 = getAcc(particle.x, particle.y, particle.vx, particle.vy);
  const k1_vx = a1.ax * dt;
  const k1_vy = a1.ay * dt;
  const k1_x = particle.vx * dt;
  const k1_y = particle.vy * dt;

  const a2 = getAcc(
    particle.x + 0.5 * k1_x,
    particle.y + 0.5 * k1_y,
    particle.vx + 0.5 * k1_vx,
    particle.vy + 0.5 * k1_vy
  );
  const k2_vx = a2.ax * dt;
  const k2_vy = a2.ay * dt;
  const k2_x = (particle.vx + 0.5 * k1_vx) * dt;
  const k2_y = (particle.vy + 0.5 * k1_vy) * dt;

  const a3 = getAcc(
    particle.x + 0.5 * k2_x,
    particle.y + 0.5 * k2_y,
    particle.vx + 0.5 * k2_vx,
    particle.vy + 0.5 * k2_vy
  );
  const k3_vx = a3.ax * dt;
  const k3_vy = a3.ay * dt;
  const k3_x = (particle.vx + 0.5 * k2_vx) * dt;
  const k3_y = (particle.vy + 0.5 * k2_vy) * dt;

  const a4 = getAcc(
    particle.x + k3_x,
    particle.y + k3_y,
    particle.vx + k3_vx,
    particle.vy + k3_vy
  );
  const k4_vx = a4.ax * dt;
  const k4_vy = a4.ay * dt;
  const k4_x = (particle.vx + k3_vx) * dt;
  const k4_y = (particle.vy + k3_vy) * dt;

  const newX = particle.x + (k1_x + 2 * k2_x + 2 * k3_x + k4_x) / 6;
  const newY = particle.y + (k1_y + 2 * k2_y + 2 * k3_y + k4_y) / 6;
  const newVx = particle.vx + (k1_vx + 2 * k2_vx + 2 * k3_vx + k4_vx) / 6;
  const newVy = particle.vy + (k1_vy + 2 * k2_vy + 2 * k3_vy + k4_vy) / 6;

  // Append trail point (capped at 180 points for 60fps performance)
  const newTrail = [...particle.trail, { x: newX, y: newY }];
  if (newTrail.length > 180) {
    newTrail.shift();
  }

  // Deactivate if escaped too far (> 850 units)
  const isOutOfField = Math.hypot(newX, newY) > 850;

  return {
    ...particle,
    x: newX,
    y: newY,
    vx: newVx,
    vy: newVy,
    trail: newTrail,
    active: !isOutOfField,
    absorbed: false,
  };
}

// ── Metric Tensor Components & Curvature Invariants ──────────────────────────
export function computeMetricTensor(
  massSolar: number,
  probeRadiusRs: number,
  kerrSpin: number = 0,
  thetaRad: number = Math.PI / 2
): MetricTensorValues {
  const rsKm = computeSchwarzschildRadiusKm(massSolar);
  const rKm = Math.max(rsKm * 1.0001, probeRadiusRs * rsKm);
  const rM = rKm / rsKm; // r in units of r_s
  const aStar = Math.max(0, Math.min(0.998, kerrSpin));

  // Schwarzschild components in standard coordinates
  const g00 = -(1.0 - 1.0 / rM);
  const g11 = 1.0 / Math.max(0.00001, 1.0 - 1.0 / rM);
  const g22 = rKm * rKm;
  const sinTheta = Math.sin(thetaRad);
  const g33 = rKm * rKm * sinTheta * sinTheta;

  // Kretschmann invariant: K = R^abcd R_abcd = 48 G^2 M^2 / (c^4 r^6)
  const rMeters = rKm * 1000;
  const mKg = massSolar * SOLAR_MASS_KG;
  const num = 48 * Math.pow(G_CONSTANT * mKg, 2);
  const den = Math.pow(C_SPEED, 4) * Math.pow(Math.max(1, rMeters), 6);
  const kretschmannScalar = num / Math.max(1e-12, den);

  // Kerr Frame Dragging Angular Velocity:
  // At equatorial plane: Omega ~ 2 G J / (c^2 r^3)
  const jSpin = (aStar * G_CONSTANT * Math.pow(mKg, 2)) / C_SPEED;
  const frameDraggingOmegaRadS =
    (2 * G_CONSTANT * jSpin) / (Math.pow(C_SPEED, 2) * Math.pow(Math.max(1, rMeters), 3));

  // Radii in units of r_s
  const outerHorizonRs = 0.5 * (1 + Math.sqrt(Math.max(0, 1 - aStar * aStar)));
  const ergosphereEquatorRs = 1.0;
  const photonSphereRs = 1.0 + Math.cos((2 / 3) * Math.acos(-aStar));

  // Prograde ISCO for Kerr
  const z1 = 1 + Math.cbrt(1 - aStar * aStar) * (Math.cbrt(1 + aStar) + Math.cbrt(1 - aStar));
  const z2 = Math.sqrt(3 * aStar * aStar + z1 * z1);
  const iscoRadiusRs = (3 + z2 - Math.sqrt(Math.max(0, (3 - z1) * (3 + z1 + 2 * z2)))) / 2;

  return {
    g00,
    g11,
    g22,
    g33,
    kretschmannScalar,
    ricciScalar: 0, // Vacuum solution R_mu_nu = 0 => R = 0
    frameDraggingOmegaRadS,
    iscoRadiusRs,
    photonSphereRs,
    outerHorizonRs,
    ergosphereEquatorRs,
  };
}

// ── Binary Black Hole Inspiral & Gravitational Wave Chirp (LIGO Simulation) ──
export function computeGravitationalWaveChirp(
  m1Solar: number,
  m2Solar: number,
  timeFraction: number // 0 to 1 over inspiral cycle
): BinaryChirpParams {
  const m1 = m1Solar;
  const m2 = m2Solar;
  const totalMass = Math.max(1, m1 + m2);
  const chirpMassSolar = Math.pow(m1 * m2, 3 / 5) / Math.pow(totalMass, 1 / 5);

  // Frequency range: 25 Hz up to merger ringdown frequency
  const fIsco =
    Math.pow(C_SPEED, 3) /
    (Math.pow(6, 1.5) * Math.PI * G_CONSTANT * (totalMass * SOLAR_MASS_KG));
  const fStart = 32;
  const fMax = Math.min(680, Math.max(130, fIsco * 2.2));

  const tFrac = Math.max(0, Math.min(1, timeFraction));
  let currentFreqHz = fStart;
  let strainAmplitude = 0;
  let phase = 0;

  if (tFrac < 0.86) {
    // Inspiral phase: f(t) grows as power law
    const progress = tFrac / 0.86;
    currentFreqHz = fStart + Math.pow(progress, 3.2) * (fMax - fStart);
    strainAmplitude = 0.15 + 0.85 * Math.pow(progress, 2.5);
    phase =
      2 * Math.PI * (fStart * progress + 0.5 * (fMax - fStart) * Math.pow(progress, 4));
  } else if (tFrac < 0.93) {
    // Merger phase (peak strain at ISCO crossing)
    currentFreqHz = fMax;
    strainAmplitude = 1.0;
    phase = 2 * Math.PI * fMax * (tFrac - 0.86) * 12;
  } else {
    // Ringdown phase (exponential decay of quasi-normal mode)
    const ringdownFrac = (tFrac - 0.93) / 0.07;
    currentFreqHz = fMax * 1.18;
    strainAmplitude = Math.exp(-ringdownFrac * 6.5);
    phase = 2 * Math.PI * currentFreqHz * ringdownFrac * 4;
  }

  const timeToMergerSeconds = Math.max(0, (1 - tFrac) * 0.45);
  const luminosityWatts = strainAmplitude * 3.6e49 * (totalMass / 60);
  const eventHorizonCombinedKm = computeSchwarzschildRadiusKm(totalMass);

  return {
    m1Solar,
    m2Solar,
    chirpMassSolar,
    timeToMergerSeconds,
    currentFreqHz,
    strainAmplitude,
    phase,
    luminosityWatts,
    eventHorizonCombinedKm,
  };
}

// ── 5 Historical & Cutting-Edge Guided Investigations ────────────────────────
export const GUIDED_INVESTIGATIONS: GuidedInvestigation[] = [
  {
    id: "mercury-precession",
    title: "Anomalous Perihelion Precession of Mercury",
    subtitle: "Einstein's 1915 triumph over Le Verrier's hypothetical planet 'Vulcan'",
    historicalYear: 1915,
    leadScientist: "Albert Einstein",
    objective:
      "Verify that the relativistic 1/r³ geodesic correction term produces an advance of perihelion equal to 42.98 arcsec per century for Mercury's orbit around the Sun.",
    recommendedMode: "spacetime",
    targetPresetId: "sun",
    targetMassSolar: 1.0,
    targetProbeDistanceRs: 4.5,
    formula: "\\Delta\\phi = \\frac{6\\pi GM}{c^2 a(1 - e^2)} \\approx 42.98'' / \\text{century}",
    formulaDescription:
      "Orbital precession angle per revolution produced by the cubic general relativistic effective potential term.",
    steps: [
      "Select the 'Sun (G-Type Main Sequence)' celestial preset.",
      "Launch an eccentric probe in 'Relativistic Geodesics' mode.",
      "Observe the orbital rosette pattern as the perihelion point rotates forward each cycle.",
      "Compare the observed relativistic geodesic trajectory with classical Newtonian Keplerian ellipse (which would close upon itself with zero precession).",
    ],
    expectedObservation:
      "The orbit fails to close into a static ellipse; instead, the perihelion advances continuously forward in the direction of orbital motion.",
    keyTakeaway:
      "Spacetime curvature naturally explains Mercury's 43 arcsec/century anomaly without needing unseen dark matter or hypothetical inner planets.",
  },
  {
    id: "eddington-eclipse",
    title: "1919 Solar Eclipse Gravitational Light Deflection",
    subtitle: "Sir Arthur Eddington's expedition confirming the curvature of space",
    historicalYear: 1919,
    leadScientist: "Sir Arthur Eddington & Frank Dyson",
    objective:
      "Measure the bending of starlight grazing a massive body and prove that Einstein's GR prediction (4GM/c²b) is exactly double Newton's ballistic photon prediction (2GM/c²b).",
    recommendedMode: "lensing",
    targetPresetId: "sun",
    targetMassSolar: 1.0,
    targetProbeDistanceRs: 250000,
    targetImpactParameterRs: 2.8,
    formula: "\\alpha = \\frac{4GM}{c^2 b} = \\frac{2 r_s}{b} = 1.751'' \\quad (\\text{at solar limb})",
    formulaDescription:
      "Deflection angle of null geodesics grazing mass M at impact parameter b.",
    steps: [
      "Switch to 'Lensing & Black Hole Shadow' mode.",
      "Set the celestial mass to 1.0 M☉ (Sun) and adjust the photon impact parameter b to graze the solar radius.",
      "Observe the starlight deflection angle on the telemetry readout (~1.75 arcsec).",
      "Decrease the impact parameter towards the photon sphere (1.5 r_s) and observe how the deflection angle diverges towards infinity (critical photon capture).",
    ],
    expectedObservation:
      "As impact parameter b decreases towards the critical photon capture radius b_crit = (3√3/2) r_s ≈ 2.598 r_s, photons orbit multiple times before escaping or falling in.",
    keyTakeaway:
      "Light travels along null geodesics in curved spacetime; space curvature contributes an equal share to time dilation in deflecting photons.",
  },
  {
    id: "gps-relativistic-synthesis",
    title: "GPS Relativistic Synthesis (+38.7 μs/day)",
    subtitle: "Balancing General Relativistic blueshift against Special Relativistic kinematic dilation",
    historicalYear: 1977,
    leadScientist: "US Naval Research Laboratory & Bradford Parkinson",
    objective:
      "Synthesize the competing relativistic effects acting on GPS constellation atomic clocks at 20,200 km altitude.",
    recommendedMode: "timedilation",
    targetPresetId: "sun",
    targetMassSolar: 1.0,
    targetProbeDistanceRs: 5.0,
    formula:
      "\\Delta t_{\\text{net}} = +45.9\\,\\mu\\text{s/day} \\,(\\text{GR blueshift}) - 7.2\\,\\mu\\text{s/day} \\,(\\text{SR dilation}) = +38.7\\,\\mu\\text{s/day}",
    formulaDescription:
      "Net daily clock offset between an Earth surface atomic clock and a GPS satellite clock.",
    steps: [
      "Switch to 'Time Dilation & GPS' mode.",
      "Examine the 3 synchronized atomic clocks: Distant Observer (t_∞), Local Deep-Field Clock, and GPS Constellation Clock.",
      "Note how satellite clocks run FASTER by +45.9 μs/day because Earth's gravitational potential is weaker at 20,200 km altitude.",
      "Note how satellite clocks run SLOWER by -7.2 μs/day because their orbital velocity is 3.87 km/s.",
      "Calculate the daily accumulated navigational error if uncorrected: 38.7 μs × c ≈ 11.6 km/day.",
    ],
    expectedObservation:
      "Without Einstein's GR and SR equations programmed into the satellite frequency synthesizers (10.22999999543 MHz instead of 10.23 MHz), global satellite navigation would fail within 2 minutes.",
    keyTakeaway:
      "General Relativity is not merely an abstract cosmic theory; it is an active engineering requirement for modern smartphones and autonomous aviation.",
  },
  {
    id: "penrose-ergosphere",
    title: "Kerr Ergosphere & Penrose Rotational Energy Extraction",
    subtitle: "Harvesting the rotational kinetic energy of spinning spacetime",
    historicalYear: 1969,
    leadScientist: "Sir Roger Penrose",
    objective:
      "Analyze frame-dragging around a rotating Kerr black hole (a* = 0.95) and locate the static limit (ergosphere) where particles are forced to corotate with spacetime.",
    recommendedMode: "spacetime",
    targetPresetId: "cygnus-x1",
    targetMassSolar: 21.2,
    targetProbeDistanceRs: 1.8,
    targetKerrSpin: 0.95,
    formula:
      "r_E(\\theta) = M + \\sqrt{M^2 - a^2 \\cos^2\\theta}, \\quad \\Delta E_{\\text{max}} = (1 - 1/\\sqrt{2}) M c^2 \\approx 29\\% M c^2",
    formulaDescription:
      "Boundary of the ergosphere (static limit) and theoretical maximum rotational energy extraction limit.",
    steps: [
      "Select 'Cygnus X-1' or 'Miller's Planet Host' with Kerr spin a* > 0.9.",
      "Enable 'Ergosphere' in the 3D visualizer overlay.",
      "Observe the oblate spheroid region between the outer event horizon r_+ and the static limit r_E.",
      "Launch a geodesic probe into the ergosphere and watch spacetime frame dragging actively twist its orbital plane into corotation.",
    ],
    expectedObservation:
      "Inside the ergosphere, the g_00 metric component flips sign; stationary observers with respect to infinity cannot exist because dt is no longer timelike.",
    keyTakeaway:
      "Up to 29% of a Kerr black hole's rest mass can be converted into useful energy via the Penrose mechanism and Blandford-Znajek relativistic jets.",
  },
  {
    id: "spaghettification-threshold",
    title: "Tidal Spaghettification & Safe Horizon Crossing",
    subtitle:
      "Why supermassive black holes permit human exploration while stellar black holes destroy matter",
    historicalYear: 1988,
    leadScientist: "Stephen Hawking & Kip Thorne",
    objective:
      "Demonstrate that tidal stretching forces at the event horizon scale as 1/M², allowing gentle crossing of Sagittarius A*'s horizon while Cygnus X-1 is immediately fatal.",
    recommendedMode: "spacetime",
    targetPresetId: "sagittarius-a",
    targetMassSolar: 4150000,
    targetProbeDistanceRs: 1.05,
    formula:
      "\\Delta a_{\\text{tidal}} = \\frac{2 G M \\Delta r}{r^3} \\implies \\Delta a_{\\text{horizon}} = \\frac{c^6 \\Delta r}{4 G^2 M^2} \\propto \\frac{1}{M^2}",
    formulaDescription:
      "Differential tidal acceleration across body length Δr at distance r and specifically at the event horizon r_s.",
    steps: [
      "Select 'Cygnus X-1' (21.2 M☉) and position the probe at 1.2 r_s. Note the catastrophic tidal force (> 100,000 g's).",
      "Switch preset to 'Sagittarius A*' (4.15 million M☉) at the same 1.2 r_s radius.",
      "Read the live tidal force gauge: it drops below 0.001 g's!",
      "Observe that an astronaut can safely glide across the supermassive event horizon without feeling any local structural distress.",
    ],
    expectedObservation:
      "The tidal force gauge changes from crimson 'EXTREME SPAGHETTI' to emerald 'NEGLIGIBLE / SAFE' purely by increasing the black hole's mass.",
    keyTakeaway:
      "Event horizons have no local physical matter or surface; for supermassive black holes, spacetime curvature at the horizon is so gentle that the Equivalence Principle ensures you feel weightless.",
  },
];

