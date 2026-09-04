"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import NextLabModal from "@/app/components/NextLabModal";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Activity,
  ChevronRight,
  ChevronLeft,
  Info,
  Microscope,
  Dna,
  Eye,
  SlidersHorizontal,
  Target,
  Shuffle,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  FlaskConical,
  Crosshair,
  Pill,
  Split,
  GitFork,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// ─── TYPES & CANONICAL PHASES ────────────────────────────────────────────────

export type DivisionMode = "mitosis" | "meiosis";
export type CellModelType = "animal" | "plant";
export type StainingMode = "fluorescence" | "brightfield" | "phase_contrast";
export type DrugInhibitor = "none" | "colchicine" | "taxol" | "nocodazole";
export type NondisjunctionType = "none" | "anaphase_1" | "anaphase_2";

export type MitosisPhase =
  | "interphase"
  | "prophase"
  | "prometaphase"
  | "metaphase"
  | "anaphase"
  | "telophase"
  | "cytokinesis";

export type MeiosisPhase =
  | "interphase"
  | "prophase_1"
  | "metaphase_1"
  | "anaphase_1"
  | "telophase_1"
  | "prophase_2"
  | "metaphase_2"
  | "anaphase_2"
  | "telophase_2"
  | "gametes_complete";

export interface ChromosomeEntity {
  id: string;
  name: string;
  parent: "maternal" | "paternal";
  homologueGroup: 1 | 2;
  alleles: string[];
  color: string;
  recombinantColor?: string;
  centromereType: "metacentric" | "submetacentric";
  isRecombinant: boolean;
  length: number;
}

export interface CytologyTelemetry {
  ploidy: string;
  dnaContent: string;
  chromosomeCount: number;
  chromatidCount: number;
  cohesinStatus: "intact" | "arm_cleaved" | "centromere_cleaved";
  spindleTension: "bipolar_balanced" | "monopolar_slack" | "arrested_drug";
  apcActive: boolean;
  sacStatus: "satisfied" | "active_arrest";
  recombinationRate: string;
}

export interface GuidedCytologyExperiment {
  id: string;
  title: string;
  objective: string;
  mode: DivisionMode;
  targetPhase: string;
  description: string;
  keyInsight: string;
  actionHint: string;
}

export const GUIDED_CYTOLOGY_EXPERIMENTS: GuidedCytologyExperiment[] = [
  {
    id: "exp_somatic_mitosis",
    title: "Protocol 1: Somatic Equational Cloning",
    objective: "Track a 2n = 4 diploid cell through equational division into two genetically identical daughter clones.",
    mode: "mitosis",
    targetPhase: "cytokinesis",
    description: "Witness cohesin ring cleavage by Separase at Anaphase and contrast animal cleavage furrow with plant cell plate synthesis.",
    keyInsight: "Mitosis preserves ploidy (2n -> 2n) and produces exact genetic clones essential for multicellular growth and tissue renewal.",
    actionHint: "Step forward from Metaphase into Anaphase to watch sister chromatids disjoin to opposite poles.",
  },
  {
    id: "exp_meiotic_chiasmata",
    title: "Protocol 2: Synapsis & Chiasmata Crossing-Over",
    objective: "Orchestrate homologous bivalent synapsis in Prophase I to physically exchange non-sister chromatid segments.",
    mode: "meiosis",
    targetPhase: "prophase_1",
    description: "Click chiasmata loci along the synaptonemal complex to swap maternal and paternal alleles, tracing recombinant chromatids into gametes.",
    keyInsight: "Crossing-over breaks genetic linkage and introduces reciprocal genomic novelty distinct from either parental chromosome.",
    actionHint: "Click the glowing chiasma nodes directly on the chromosome arms in Prophase I.",
  },
  {
    id: "exp_independent_assortment",
    title: "Protocol 3: Mendel's Independent Assortment",
    objective: "Demonstrate random bivalent orientation at the Metaphase I equatorial plate yielding 2^n combinations.",
    mode: "meiosis",
    targetPhase: "metaphase_1",
    description: "Flip the maternal and paternal homologue orientations of Chromosome 1 and Chromosome 2 to produce all 4 gametic assortments.",
    keyInsight: "Independent assortment of maternal and paternal chromosomes produces 2^n = 4 distinct non-homologous permutations.",
    actionHint: "Use the 'Flip Orientation' button at Metaphase I to randomize pole assignments.",
  },
  {
    id: "exp_aneuploidy_fault",
    title: "Protocol 4: Spindle Nondisjunction & Aneuploidy",
    objective: "Inject spindle detachment errors at Anaphase I or Anaphase II to observe the cytogenetic etiology of trisomy and monosomy.",
    mode: "meiosis",
    targetPhase: "anaphase_1",
    description: "Compare Meiosis I failure (100% abnormal gametes: two n+1 and two n-1) against Meiosis II failure (50% normal n, 25% n+1, 25% n-1).",
    keyInsight: "Chromosomal nondisjunction is the clinical driver of human aneuploidies such as Trisomy 21 (Down syndrome) and Turner syndrome.",
    actionHint: "Select 'Meiosis I Failure' in the mutator dropdown, then advance to gamete completion.",
  },
  {
    id: "exp_colchicine_arrest",
    title: "Protocol 5: Colchicine Metaphase Karyotyping",
    objective: "Apply the spindle-poison Colchicine to depolymerize microtubules and trap chromosomes at the equatorial plate.",
    mode: "mitosis",
    targetPhase: "metaphase",
    description: "Observe the Spindle Assembly Checkpoint (SAC) halt anaphase onset when kinetochore tension is obliterated.",
    keyInsight: "Colchicine inhibits tubulin polymerization, freezing cells in metaphase for diagnostic clinical cytogenetic karyotyping.",
    actionHint: "Select 'Colchicine' under Spindle Inhibitors and observe SAC arrest.",
  },
];

const MITOSIS_PHASE_SEQUENCE: { id: MitosisPhase; name: string; desc: string; stageTime: string }[] = [
  { id: "interphase", name: "Interphase (G2)", desc: "Chromatin diffuse; centrosomes duplicated with centrioles; DNA replicated (4C).", stageTime: "18.5 hrs" },
  { id: "prophase", name: "Prophase", desc: "Chromatin condenses into X-chromatids; centrosomes migrate toward opposite poles; nucleolus disassembles.", stageTime: "45 min" },
  { id: "prometaphase", name: "Prometaphase", desc: "Nuclear envelope fragments into vesicles; kinetochore microtubules capture centromeres.", stageTime: "15 min" },
  { id: "metaphase", name: "Metaphase", desc: "Chromosomes align along equatorial metaphase plate; Spindle Assembly Checkpoint (SAC) validates tension.", stageTime: "20 min" },
  { id: "anaphase", name: "Anaphase", desc: "Separase cleaves cohesin rings; sister chromatids disjoin and migrate toward opposite spindle poles.", stageTime: "10 min" },
  { id: "telophase", name: "Telophase", desc: "Nuclear envelopes reform around decondensing daughter chromosomes; spindle disassembles.", stageTime: "20 min" },
  { id: "cytokinesis", name: "Cytokinesis", desc: "Actin contractile cleavage furrow (animal) or Golgi cell plate (plant) partitions cell into 2 daughter clones.", stageTime: "30 min" },
];

const MEIOSIS_PHASE_SEQUENCE: { id: MeiosisPhase; name: string; desc: string; stageTime: string }[] = [
  { id: "interphase", name: "Interphase G2", desc: "Germline diploid stem cell with replicated DNA (4C) and intact double membrane.", stageTime: "24 hrs" },
  { id: "prophase_1", name: "Prophase I (Pachytene)", desc: "Homologues synapse into bivalent tetrads; non-sister chromatids form chiasmata and cross over.", stageTime: "several days" },
  { id: "metaphase_1", name: "Metaphase I", desc: "Bivalents align double-file along equator; independent assortment generates 2^n combinations.", stageTime: "30 min" },
  { id: "anaphase_1", name: "Anaphase I (Reduction)", desc: "Homologous chromosome pairs separate; ploidy reduced from 2n to n; sister chromatids remain linked.", stageTime: "15 min" },
  { id: "telophase_1", name: "Telophase I", desc: "Dyads arrive at poles; cell cleaves into two secondary haploid cells without intervening DNA synthesis.", stageTime: "25 min" },
  { id: "prophase_2", name: "Prophase II", desc: "Spindle apparatus reforms in both secondary cells perpendicular to first division axis.", stageTime: "20 min" },
  { id: "metaphase_2", name: "Metaphase II", desc: "Individual chromosomes align single-file at equatorial plate in both secondary cells.", stageTime: "20 min" },
  { id: "anaphase_2", name: "Anaphase II (Equational)", desc: "Centromeres divide; sister chromatids separate toward opposite poles in both dividing cells.", stageTime: "12 min" },
  { id: "telophase_2", name: "Telophase II", desc: "Four distinct nuclear envelopes reform around haploid chromosome sets.", stageTime: "25 min" },
  { id: "gametes_complete", name: "Gametes Formed", desc: "Four genetically unique haploid gametes (n = 2) complete with recombinant allele assortments.", stageTime: "Complete" },
];

export default function MitosisMeiosisLab() {
  // ─── OPENLABS HOOKS ──────────────────────────────────────────────────────────
  const {
    completeExperiment,
    xpResult,
    nextLabProgression,
    showNextLabModal,
    setShowNextLabModal,
  } = useLab("biology/mitosis-meiosis", "biology", "simulation");

  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Mitosis, Meiosis & Microscopic Cell Division Studio",
      theory:
        "Mitosis produces 2 identical diploid (2n) daughter cells via equational division. Meiosis undergoes 2 successive rounds (reductional Meiosis I and equational Meiosis II) with crossing-over genetic recombination to form 4 unique haploid (n) gametes.",
      extraContext:
        "Interactive virtual microscope with 100x/400x/1000x oil immersion lenses, confocal fluorescence & brightfield staining, pharmacological spindle inhibitors (Colchicine, Taxol, Nocodazole), chiasmata crossing-over matrix, independent assortment flip, and chromosomal nondisjunction aneuploidy mutator.",
    });
  }, [setExperimentData]);

  // ─── WORKBENCH STATE ─────────────────────────────────────────────────────────
  const [divisionMode, setDivisionMode] = useState<DivisionMode>("mitosis");
  const [cellModel, setCellModel] = useState<CellModelType>("animal");
  const [stainingMode, setStainingMode] = useState<StainingMode>("fluorescence");
  const [drugInhibitor, setDrugInhibitor] = useState<DrugInhibitor>("none");
  const [nondisjunctionMode, setNondisjunctionMode] = useState<NondisjunctionType>("none");

  // Lens & Optical Microscope controls
  const [magnification, setMagnification] = useState<100 | 400 | 1000>(400);
  const [focusDial, setFocusDial] = useState<number>(50); // 50 is razor-sharp focus
  const [showReticle, setShowReticle] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [stageCoord, setStageCoord] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sub-Navigation Tabs
  const [activeTab, setActiveTab] = useState<"microscope" | "recombination" | "karyotype" | "gametes" | "challenges">("microscope");

  // Active Phase Indices
  const [mitosisIdx, setMitosisIdx] = useState<number>(0);
  const [meiosisIdx, setMeiosisIdx] = useState<number>(0);

  // Playback Animation
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Crossing-over recombination states
  const [crossover1, setCrossover1] = useState<boolean>(false);
  const [crossover2, setCrossover2] = useState<boolean>(false);

  // Independent assortment orientation in Meiosis (flip chromosome 1 or 2 homologue pole)
  const [flipPair1, setFlipPair1] = useState<boolean>(false);
  const [flipPair2, setFlipPair2] = useState<boolean>(false);

  // Selected chromosome or gamete for clinical inspection
  const [selectedChr, setSelectedChr] = useState<ChromosomeEntity | null>(null);
  const [selectedGameteIdx, setSelectedGameteIdx] = useState<number | null>(null);

  // Active Challenge / Protocol
  const [activeProtocol, setActiveProtocol] = useState<GuidedCytologyExperiment | null>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthBeep = useCallback(
    (freq: number, type: OscillatorType = "sine", duration = 0.12) => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // suppressed
      }
    },
    [soundEnabled]
  );

  const playSeparaseChime = useCallback(() => {
    if (!soundEnabled) return;
    playSynthBeep(880, "triangle", 0.22);
    setTimeout(() => playSynthBeep(1174.66, "sine", 0.28), 90);
  }, [soundEnabled, playSynthBeep]);

  const playChiasmaZap = useCallback(() => {
    if (!soundEnabled) return;
    playSynthBeep(523.25, "square", 0.1);
    setTimeout(() => playSynthBeep(659.25, "sine", 0.15), 60);
  }, [soundEnabled, playSynthBeep]);

  // ─── CHROMOSOME DATA ARCHITECTURE ──────────────────────────────────────────
  const chromosomes: ChromosomeEntity[] = useMemo(() => {
    return [
      {
        id: "chr1_mat",
        name: "Chromosome 1 (Maternal)",
        parent: "maternal",
        homologueGroup: 1,
        alleles: crossover1 ? ["A", "B", "c"] : ["A", "B", "C"],
        color: "#06b6d4", // Electric Cyan
        recombinantColor: "#f43f5e",
        centromereType: "metacentric",
        isRecombinant: crossover1,
        length: 56,
      },
      {
        id: "chr1_pat",
        name: "Chromosome 1 (Paternal)",
        parent: "paternal",
        homologueGroup: 1,
        alleles: crossover1 ? ["a", "b", "C"] : ["a", "b", "c"],
        color: "#f43f5e", // Radiant Coral
        recombinantColor: "#06b6d4",
        centromereType: "metacentric",
        isRecombinant: crossover1,
        length: 56,
      },
      {
        id: "chr2_mat",
        name: "Chromosome 2 (Maternal)",
        parent: "maternal",
        homologueGroup: 2,
        alleles: crossover2 ? ["D", "e"] : ["D", "E"],
        color: "#38bdf8", // Sky Blue
        recombinantColor: "#fb7185",
        centromereType: "submetacentric",
        isRecombinant: crossover2,
        length: 44,
      },
      {
        id: "chr2_pat",
        name: "Chromosome 2 (Paternal)",
        parent: "paternal",
        homologueGroup: 2,
        alleles: crossover2 ? ["d", "E"] : ["d", "e"],
        color: "#fb7185", // Rose Pink
        recombinantColor: "#38bdf8",
        centromereType: "submetacentric",
        isRecombinant: crossover2,
        length: 44,
      },
    ];
  }, [crossover1, crossover2]);

  // Current active phase objects
  const currentMitosisPhase = MITOSIS_PHASE_SEQUENCE[mitosisIdx];
  const currentMeiosisPhase = MEIOSIS_PHASE_SEQUENCE[meiosisIdx];

  // ─── BIOLOGICAL TELEMETRY DERIVATION ───────────────────────────────────────
  const telemetry: CytologyTelemetry = useMemo(() => {
    if (divisionMode === "mitosis") {
      switch (currentMitosisPhase.id) {
        case "interphase":
          return {
            ploidy: "2n = 4",
            dnaContent: "4C (Replicated DNA)",
            chromosomeCount: 4,
            chromatidCount: 8,
            cohesinStatus: "intact",
            spindleTension: "monopolar_slack",
            apcActive: false,
            sacStatus: "active_arrest",
            recombinationRate: "0.0 cM (Mitotic Linkage)",
          };
        case "prophase":
        case "prometaphase":
          return {
            ploidy: "2n = 4",
            dnaContent: "4C",
            chromosomeCount: 4,
            chromatidCount: 8,
            cohesinStatus: "intact",
            spindleTension: drugInhibitor !== "none" ? "arrested_drug" : "monopolar_slack",
            apcActive: false,
            sacStatus: "active_arrest",
            recombinationRate: "0.0 cM",
          };
        case "metaphase":
          return {
            ploidy: "2n = 4 (Equatorial Single-File)",
            dnaContent: "4C",
            chromosomeCount: 4,
            chromatidCount: 8,
            cohesinStatus: "intact",
            spindleTension: drugInhibitor !== "none" ? "arrested_drug" : "bipolar_balanced",
            apcActive: drugInhibitor === "none",
            sacStatus: drugInhibitor === "none" ? "satisfied" : "active_arrest",
            recombinationRate: "0.0 cM",
          };
        case "anaphase":
          return {
            ploidy: "4n = 8 (Disjoined Chromatids)",
            dnaContent: "4C",
            chromosomeCount: 8,
            chromatidCount: 8,
            cohesinStatus: "centromere_cleaved",
            spindleTension: "bipolar_balanced",
            apcActive: true,
            sacStatus: "satisfied",
            recombinationRate: "0.0 cM",
          };
        case "telophase":
        case "cytokinesis":
        default:
          return {
            ploidy: "2x (2n = 4) Identical Clones",
            dnaContent: "2C per daughter cell",
            chromosomeCount: 4,
            chromatidCount: 4,
            cohesinStatus: "centromere_cleaved",
            spindleTension: "monopolar_slack",
            apcActive: false,
            sacStatus: "satisfied",
            recombinationRate: "0.0 cM (Genetically Clonal)",
          };
      }
    } else {
      // Meiosis
      switch (currentMeiosisPhase.id) {
        case "interphase":
          return {
            ploidy: "2n = 4 Germline Stem Cell",
            dnaContent: "4C",
            chromosomeCount: 4,
            chromatidCount: 8,
            cohesinStatus: "intact",
            spindleTension: "monopolar_slack",
            apcActive: false,
            sacStatus: "active_arrest",
            recombinationRate: "0.0 cM",
          };
        case "prophase_1":
          return {
            ploidy: "2n = 4 (Synapsed Bivalents / Tetrads)",
            dnaContent: "4C",
            chromosomeCount: 4,
            chromatidCount: 8,
            cohesinStatus: "intact",
            spindleTension: "monopolar_slack",
            apcActive: false,
            sacStatus: "active_arrest",
            recombinationRate: crossover1 || crossover2 ? "50.0 cM (Recombinant Chiasmata)" : "0.0 cM (Linked)",
          };
        case "metaphase_1":
          return {
            ploidy: "2n = 4 (Double-File Tetrads)",
            dnaContent: "4C",
            chromosomeCount: 4,
            chromatidCount: 8,
            cohesinStatus: "intact",
            spindleTension: drugInhibitor !== "none" ? "arrested_drug" : "bipolar_balanced",
            apcActive: drugInhibitor === "none",
            sacStatus: drugInhibitor === "none" ? "satisfied" : "active_arrest",
            recombinationRate: crossover1 || crossover2 ? "50.0 cM" : "0.0 cM",
          };
        case "anaphase_1":
          return {
            ploidy:
              nondisjunctionMode === "anaphase_1"
                ? "Aneuploid Segregation (Homologue Non-Disjunction)"
                : "Reductional: Homologues Separate (2n -> n)",
            dnaContent: "4C",
            chromosomeCount: 4,
            chromatidCount: 8,
            cohesinStatus: "arm_cleaved",
            spindleTension: nondisjunctionMode === "anaphase_1" ? "monopolar_slack" : "bipolar_balanced",
            apcActive: true,
            sacStatus: "satisfied",
            recombinationRate: crossover1 || crossover2 ? "50.0 cM" : "0.0 cM",
          };
        case "telophase_1":
        case "prophase_2":
        case "metaphase_2":
          return {
            ploidy: "2x (n = 2) Secondary Gametocytes",
            dnaContent: "2C per cell (Dyads)",
            chromosomeCount: 2,
            chromatidCount: 4,
            cohesinStatus: "arm_cleaved",
            spindleTension: "bipolar_balanced",
            apcActive: true,
            sacStatus: "satisfied",
            recombinationRate: crossover1 || crossover2 ? "50.0 cM" : "0.0 cM",
          };
        case "anaphase_2":
          return {
            ploidy:
              nondisjunctionMode === "anaphase_2"
                ? "Aneuploid Chromatid Non-Disjunction"
                : "Equational: Sister Chromatids Disjoin",
            dnaContent: "2C",
            chromosomeCount: 4,
            chromatidCount: 4,
            cohesinStatus: "centromere_cleaved",
            spindleTension: nondisjunctionMode === "anaphase_2" ? "monopolar_slack" : "bipolar_balanced",
            apcActive: true,
            sacStatus: "satisfied",
            recombinationRate: crossover1 || crossover2 ? "50.0 cM" : "0.0 cM",
          };
        case "telophase_2":
        case "gametes_complete":
        default:
          return {
            ploidy:
              nondisjunctionMode === "anaphase_1"
                ? "Aneuploidy: two (n+1) and two (n-1)"
                : nondisjunctionMode === "anaphase_2"
                ? "Aneuploidy: two (n), one (n+1), one (n-1)"
                : "4x (n = 2) Genetically Unique Gametes",
            dnaContent: "1C per gamete",
            chromosomeCount: 2,
            chromatidCount: 2,
            cohesinStatus: "centromere_cleaved",
            spindleTension: "monopolar_slack",
            apcActive: false,
            sacStatus: "satisfied",
            recombinationRate: crossover1 || crossover2 ? "50.0 cM (Mendelian Recombination)" : "0.0 cM",
          };
      }
    }
  }, [
    divisionMode,
    currentMitosisPhase,
    currentMeiosisPhase,
    drugInhibitor,
    nondisjunctionMode,
    crossover1,
    crossover2,
  ]);

  // ─── AUTOPLAY CYCLING ENGINE ───────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;

    if (drugInhibitor === "colchicine" || drugInhibitor === "taxol") {
      // Arrested at metaphase!
      if (
        (divisionMode === "mitosis" && currentMitosisPhase.id === "metaphase") ||
        (divisionMode === "meiosis" && currentMeiosisPhase.id === "metaphase_1")
      ) {
        setIsPlaying(false);
        playSynthBeep(220, "sawtooth", 0.4);
        return;
      }
    }

    const timer = setInterval(() => {
      if (divisionMode === "mitosis") {
        setMitosisIdx((prev) => {
          if (prev >= MITOSIS_PHASE_SEQUENCE.length - 1) {
            setIsPlaying(false);
            completeExperiment();
            return prev;
          }
          const next = prev + 1;
          if (MITOSIS_PHASE_SEQUENCE[next].id === "anaphase") playSeparaseChime();
          else playSynthBeep(320 + next * 40);
          return next;
        });
      } else {
        setMeiosisIdx((prev) => {
          if (prev >= MEIOSIS_PHASE_SEQUENCE.length - 1) {
            setIsPlaying(false);
            completeExperiment();
            return prev;
          }
          const next = prev + 1;
          if (MEIOSIS_PHASE_SEQUENCE[next].id === "anaphase_1" || MEIOSIS_PHASE_SEQUENCE[next].id === "anaphase_2") {
            playSeparaseChime();
          } else {
            playSynthBeep(300 + next * 35);
          }
          return next;
        });
      }
    }, 2800 / playbackSpeed);

    return () => clearInterval(timer);
  }, [
    isPlaying,
    divisionMode,
    playbackSpeed,
    drugInhibitor,
    currentMitosisPhase,
    currentMeiosisPhase,
    completeExperiment,
    playSeparaseChime,
    playSynthBeep,
  ]);

  const handleNextPhase = () => {
    if (divisionMode === "mitosis") {
      if (mitosisIdx < MITOSIS_PHASE_SEQUENCE.length - 1) {
        const next = mitosisIdx + 1;
        setMitosisIdx(next);
        if (MITOSIS_PHASE_SEQUENCE[next].id === "anaphase") playSeparaseChime();
        else playSynthBeep(360 + next * 35);
      } else {
        completeExperiment();
      }
    } else {
      if (meiosisIdx < MEIOSIS_PHASE_SEQUENCE.length - 1) {
        const next = meiosisIdx + 1;
        setMeiosisIdx(next);
        if (MEIOSIS_PHASE_SEQUENCE[next].id === "anaphase_1" || MEIOSIS_PHASE_SEQUENCE[next].id === "anaphase_2") {
          playSeparaseChime();
        } else {
          playSynthBeep(330 + next * 30);
        }
      } else {
        completeExperiment();
      }
    }
  };

  const handlePrevPhase = () => {
    if (divisionMode === "mitosis") {
      if (mitosisIdx > 0) setMitosisIdx((i) => i - 1);
    } else {
      if (meiosisIdx > 0) setMeiosisIdx((i) => i - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setMitosisIdx(0);
    setMeiosisIdx(0);
    setCrossover1(false);
    setCrossover2(false);
    setFlipPair1(false);
    setFlipPair2(false);
    setDrugInhibitor("none");
    setNondisjunctionMode("none");
    setSelectedChr(null);
    setSelectedGameteIdx(null);
  };

  // ─── MICROSCOPE BLUR & THEME TOKENS ────────────────────────────────────────
  const blurPx = Math.abs(focusDial - 50) * 0.12;

  // Staining Color Tokens
  const themeColors = useMemo(() => {
    if (stainingMode === "fluorescence") {
      return {
        stageBg: "bg-slate-950",
        bezelRing: "border-slate-800 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]",
        cellBorder: "border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.18)]",
        cytoplasm: "rgba(8, 20, 35, 0.78)",
        spindleFiber: "#10b981", // Alexa Fluor 488 Emerald
        spindleGlow: "#10b981",
        centrosome: "#34d399",
        kinetochore: "#f59e0b", // Amber tension sensor
        dnaMaternal: "#06b6d4", // DAPI Sky Cyan
        dnaPaternal: "#f43f5e", // Rhodamine Crimson
        chiasma: "#a855f7", // Purple recombinant bridge
        cleavageFurrow: "#f43f5e",
        cellPlate: "#10b981",
      };
    } else if (stainingMode === "brightfield") {
      return {
        stageBg: "bg-amber-50/15 dark:bg-zinc-950",
        bezelRing: "border-zinc-300 dark:border-zinc-800 shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]",
        cellBorder: "border-rose-300/60 shadow-[0_0_40px_rgba(244,63,94,0.12)]",
        cytoplasm: "rgba(254, 242, 242, 0.4)",
        spindleFiber: "#94a3b8",
        spindleGlow: "transparent",
        centrosome: "#64748b",
        kinetochore: "#334155",
        dnaMaternal: "#6366f1", // Giemsa Basophilic Violet
        dnaPaternal: "#ec4899", // Giemsa Eosinophilic Magenta
        chiasma: "#8b5cf6",
        cleavageFurrow: "#be123c",
        cellPlate: "#059669",
      };
    } else {
      // Phase Contrast
      return {
        stageBg: "bg-zinc-950",
        bezelRing: "border-zinc-800 shadow-[inset_0_0_70px_rgba(0,0,0,0.8)]",
        cellBorder: "border-zinc-400/50 shadow-[0_0_40px_rgba(255,255,255,0.15)]",
        cytoplasm: "rgba(24, 24, 27, 0.82)",
        spindleFiber: "#cbd5e1",
        spindleGlow: "transparent",
        centrosome: "#94a3b8",
        kinetochore: "#ffffff",
        dnaMaternal: "#f1f5f9",
        dnaPaternal: "#94a3b8",
        chiasma: "#e2e8f0",
        cleavageFurrow: "#ffffff",
        cellPlate: "#cbd5e1",
      };
    }
  }, [stainingMode]);

  // Derived Gamete Outcomes for Meiosis
  const meioticGametes = useMemo(() => {
    if (nondisjunctionMode === "anaphase_1") {
      // Meiosis I failure: 100% abnormal (two n+1, two n-1)
      return [
        { id: 1, label: "Gamete 1", ploidy: "n + 1 = 3", chrCount: 3, status: "Aneuploid (Disomy)", syndrome: "Trisomy etiology (e.g. Down Syndrome 47,+21)" },
        { id: 2, label: "Gamete 2", ploidy: "n + 1 = 3", chrCount: 3, status: "Aneuploid (Disomy)", syndrome: "Trisomy etiology (e.g. Klinefelter 47,XXY)" },
        { id: 3, label: "Gamete 3", ploidy: "n - 1 = 1", chrCount: 1, status: "Aneuploid (Nullisomy)", syndrome: "Monosomy etiology (e.g. Turner 45,X)" },
        { id: 4, label: "Gamete 4", ploidy: "n - 1 = 1", chrCount: 1, status: "Aneuploid (Nullisomy)", syndrome: "Monosomy etiology (Lethal Autosomal Monosomy)" },
      ];
    } else if (nondisjunctionMode === "anaphase_2") {
      // Meiosis II failure: 50% normal, 25% n+1, 25% n-1
      return [
        { id: 1, label: "Gamete 1", ploidy: "n = 2", chrCount: 2, status: "Normal Euploid", syndrome: "Healthy Diploid Zygote Expected" },
        { id: 2, label: "Gamete 2", ploidy: "n = 2", chrCount: 2, status: "Normal Euploid", syndrome: "Healthy Diploid Zygote Expected" },
        { id: 3, label: "Gamete 3", ploidy: "n + 1 = 3", chrCount: 3, status: "Aneuploid (Trisomy Risk)", syndrome: "Trisomy 21 / Trisomy 18 etiology" },
        { id: 4, label: "Gamete 4", ploidy: "n - 1 = 1", chrCount: 1, status: "Aneuploid (Monosomy Risk)", syndrome: "Monosomy X (Turner Syndrome) risk" },
      ];
    } else {
      // Normal segregation: 4 distinct haploid gametes
      return [
        {
          id: 1,
          label: "Gamete 1",
          ploidy: "n = 2",
          chrCount: 2,
          status: crossover1 || crossover2 ? "Recombinant Haploid" : "Parental Haploid",
          syndrome: "Normal Euploid Gamete",
          alleles: `${crossover1 ? "A-B-c" : "A-B-C"} ; ${crossover2 ? "D-e" : "D-E"}`,
        },
        {
          id: 2,
          label: "Gamete 2",
          ploidy: "n = 2",
          chrCount: 2,
          status: crossover1 || crossover2 ? "Recombinant Haploid" : "Parental Haploid",
          syndrome: "Normal Euploid Gamete",
          alleles: `${crossover1 ? "A-B-C" : "A-B-C"} ; ${crossover2 ? "D-E" : "D-E"}`,
        },
        {
          id: 3,
          label: "Gamete 3",
          ploidy: "n = 2",
          chrCount: 2,
          status: crossover1 || crossover2 ? "Recombinant Haploid" : "Parental Haploid",
          syndrome: "Normal Euploid Gamete",
          alleles: `${crossover1 ? "a-b-C" : "a-b-c"} ; ${crossover2 ? "d-E" : "d-e"}`,
        },
        {
          id: 4,
          label: "Gamete 4",
          ploidy: "n = 2",
          chrCount: 2,
          status: crossover1 || crossover2 ? "Recombinant Haploid" : "Parental Haploid",
          syndrome: "Normal Euploid Gamete",
          alleles: `${crossover1 ? "a-b-c" : "a-b-c"} ; ${crossover2 ? "d-e" : "d-e"}`,
        },
      ];
    }
  }, [nondisjunctionMode, crossover1, crossover2]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 sm:pb-12 select-none">
      {/* ─── COMMAND CENTER HEADER ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-card/90 via-card/50 to-background backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.08),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-primary/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.2)] shrink-0">
                <Microscope size={28} />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
                    Mitosis, Meiosis &amp; Cytokinesis Studio
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold">
                    CYTOLOGY ENGINE v4.0
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                  High-resolution virtual microscopy, dynamic chromatid disjunction, synaptonemal chiasmata crossing-over, Spindle Assembly Checkpoint (SAC), and chromosomal aneuploidy mutator.
                </p>
              </div>
            </div>

            {/* Quick Mode & Sound Actions */}
            <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
              {/* Division Mode Switcher */}
              <div className="flex items-center p-1 bg-card border border-border rounded-2xl shadow-xs">
                <button
                  onClick={() => {
                    setDivisionMode("mitosis");
                    handleReset();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    divisionMode === "mitosis"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Mitosis (Somatic 2n)
                </button>
                <button
                  onClick={() => {
                    setDivisionMode("meiosis");
                    handleReset();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    divisionMode === "meiosis"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Meiosis (Gametes 4×n)
                </button>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled((s) => !s)}
                className={`p-2.5 rounded-2xl border transition shadow-xs cursor-pointer ${
                  soundEnabled
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
                title={soundEnabled ? "Mute Tones" : "Enable Audio Synthesizer"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-card border border-border text-xs font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40 transition shadow-xs cursor-pointer"
                title="Reset to Interphase"
              >
                <RefreshCw size={13} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Biological Formula & Ploidy Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/80 backdrop-blur-sm text-xs">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                {divisionMode === "mitosis" ? "2n → 2 × 2n (Equational)" : "2n → 2 × n → 4 × n (Reductional)"}
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground truncate">
                {divisionMode === "mitosis"
                  ? "Preserves ploidy: Sister chromatids disjoin to clone somatic mother cell"
                  : "Meiosis I segregates homologous bivalents; Meiosis II disjoins sister chromatids"}
              </div>
            </div>

            <div className="flex items-center gap-2 md:justify-center font-mono">
              <span className="text-[10px] font-black uppercase text-muted-foreground">Ploidy:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-background border border-border text-[11px] font-bold text-foreground">
                {telemetry.ploidy}
              </span>
              <span className="text-[10px] font-black uppercase text-muted-foreground ml-2">DNA:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-background border border-border text-[11px] font-bold text-foreground">
                {telemetry.dnaContent}
              </span>
            </div>

            <div className="flex items-center gap-2 justify-between md:justify-end text-xs font-mono">
              <span className="text-muted-foreground text-[11px]">Phase:</span>
              <span className="font-bold text-emerald-500">
                {divisionMode === "mitosis" ? currentMitosisPhase.name : currentMeiosisPhase.name}
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground text-[11px]">Step:</span>
              <span className="font-bold text-foreground">
                {divisionMode === "mitosis"
                  ? `${mitosisIdx + 1} / ${MITOSIS_PHASE_SEQUENCE.length}`
                  : `${meiosisIdx + 1} / ${MEIOSIS_PHASE_SEQUENCE.length}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN WORKSPACE CONTENT ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-5">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("microscope")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "microscope"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Microscope size={14} />
              <span>Microscope Ocular</span>
            </button>
            {divisionMode === "meiosis" && (
              <button
                onClick={() => setActiveTab("recombination")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "recombination"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Dna size={14} />
                <span>Recombination Studio</span>
              </button>
            )}
            {divisionMode === "meiosis" && (
              <button
                onClick={() => setActiveTab("gametes")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "gametes"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Split size={14} />
                <span>Gamete Inspector (4x)</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab("karyotype")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "karyotype"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity size={14} />
              <span>Cytogenetics &amp; SAC</span>
            </button>
            <button
              onClick={() => setActiveTab("challenges")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "challenges"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Award size={14} />
              <span>Protocols ({GUIDED_CYTOLOGY_EXPERIMENTS.length})</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground font-mono shrink-0 ml-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Optics &amp; Chromatin Core Active</span>
          </div>
        </div>

        {/* ─── TAB 1: MICROSCOPE OCULAR WORKBENCH ──────────────────────────── */}
        {activeTab === "microscope" && (
          <div className="space-y-5">
            {/* Microscope Stage Control Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card/80 backdrop-blur-xl border border-border/90 rounded-3xl p-4 sm:p-5 shadow-sm text-xs">
              {/* Lens Turret */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center justify-between">
                  <span>Objective Lens Turret</span>
                  <Microscope size={12} className="text-emerald-500" />
                </label>
                <div className="flex items-center gap-1.5">
                  {[100, 400, 1000].map((mag) => (
                    <button
                      key={mag}
                      onClick={() => setMagnification(mag as 100 | 400 | 1000)}
                      className={`flex-1 py-2 rounded-xl font-mono font-bold border transition cursor-pointer ${
                        magnification === mag
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/50 shadow-xs"
                          : "bg-background border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {mag}x {mag === 1000 ? "Oil" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cytochemical Staining */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center justify-between">
                  <span>Staining Regime</span>
                  <Eye size={12} className="text-primary" />
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={stainingMode}
                    onChange={(e) => setStainingMode(e.target.value as StainingMode)}
                    className="flex-1 bg-background border border-border rounded-xl px-3 py-2 font-bold text-foreground focus:outline-none cursor-pointer shadow-xs"
                  >
                    <option value="fluorescence">Fluorescence (DAPI/Tubulin/Actin)</option>
                    <option value="brightfield">Brightfield (Giemsa Cytology)</option>
                    <option value="phase_contrast">Phase Contrast (Live Unstained)</option>
                  </select>
                  <button
                    onClick={() => setShowReticle((r) => !r)}
                    className={`px-2.5 py-2 rounded-xl border text-[10px] font-bold transition cursor-pointer ${
                      showReticle
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                    title="Toggle Stage Reticle Grid"
                  >
                    Reticle
                  </button>
                </div>
              </div>

              {/* Optical Focus Ring */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-muted-foreground block">
                    Optical Focus Dial
                  </label>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">
                    {focusDial === 50 ? "Sharp (100%)" : `${Math.max(10, Math.round((1 - blurPx / 6) * 100))}% Focus`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={focusDial}
                  onChange={(e) => setFocusDial(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                  title="Fine Optical Focus"
                />
              </div>

              {/* Cytokinesis Model & Spindle Inhibitor Intervention */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center justify-between">
                  <span>Cytokinesis &amp; Inhibitors</span>
                  <FlaskConical size={12} className="text-amber-500" />
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCellModel("animal")}
                    className={`flex-1 py-2 rounded-xl font-bold border transition cursor-pointer ${
                      cellModel === "animal"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                    title="Animal Cell (Contractile Ring Cleavage Furrow)"
                  >
                    Animal
                  </button>
                  <button
                    onClick={() => setCellModel("plant")}
                    className={`flex-1 py-2 rounded-xl font-bold border transition cursor-pointer ${
                      cellModel === "plant"
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                    title="Plant Cell (Phragmoplast Golgi Cell Plate)"
                  >
                    Plant
                  </button>
                  <select
                    value={drugInhibitor}
                    onChange={(e) => setDrugInhibitor(e.target.value as DrugInhibitor)}
                    className="flex-1 bg-background border border-border rounded-xl px-2 py-2 text-[11px] font-bold text-foreground focus:outline-none cursor-pointer"
                    title="Spindle Inhibitor Chemical"
                  >
                    <option value="none">No Drug</option>
                    <option value="colchicine">Colchicine</option>
                    <option value="taxol">Taxol</option>
                    <option value="nocodazole">Nocodazole</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ─── VIRTUAL MICROSCOPE SVG CANVAS STAGE ─────────────────────── */}
            <div className={`relative ${themeColors.stageBg} border border-border rounded-3xl p-3 sm:p-6 shadow-2xl overflow-hidden min-h-[420px] sm:min-h-[540px] flex items-center justify-center`}>
              {/* Circular Optical Aperture Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.85)_82%,#000_100%)] pointer-events-none z-20" />

              {/* Stage Reticle Overlays */}
              {showReticle && (
                <div className="absolute inset-0 pointer-events-none opacity-20 z-10">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-400 border-dashed" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-emerald-400 border-dashed" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-emerald-400" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-emerald-400" />
                  {/* Caliper Ticks */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-400">STAGE RETICLE 10 μm / DIV</div>
                </div>
              )}

              {/* Top-Left Stage Information Pill */}
              <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-white shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-black tracking-wider uppercase">
                  {divisionMode === "mitosis" ? currentMitosisPhase.name : currentMeiosisPhase.name}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {divisionMode === "mitosis"
                    ? `${mitosisIdx + 1}/${MITOSIS_PHASE_SEQUENCE.length}`
                    : `${meiosisIdx + 1}/${MEIOSIS_PHASE_SEQUENCE.length}`}
                </span>
              </div>

              {/* Top-Right Objective Badge */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-white text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">{magnification}x</span>
                <span className="text-zinc-400">{magnification === 1000 ? "OIL IMMERSION" : "OBJECTIVE"}</span>
                {drugInhibitor !== "none" && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold uppercase text-[9px]">
                    {drugInhibitor}
                  </span>
                )}
              </div>

              {/* ─── HIGH-PRECISION SVG GRAPHICAL CELL ENGINE ───────────────── */}
              <div
                className="relative transition-transform duration-500 ease-out z-10 w-full max-w-[360px] sm:max-w-[500px] aspect-square flex items-center justify-center"
                style={{
                  filter: `blur(${blurPx}px)`,
                  transform: `scale(${magnification === 100 ? 0.72 : magnification === 400 ? 1.0 : 1.25}) translate(${stageCoord.x}px, ${stageCoord.y}px)`,
                }}
              >
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <radialGradient id="centrosomeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </radialGradient>
                    <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="chiasmaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>

                  {/* 1. Plasma Membrane / Cell Wall Boundary */}
                  {cellModel === "plant" ? (
                    // Plant Cell Wall (Rigid rectangular with rounded corners)
                    <rect
                      x="40"
                      y="40"
                      width="420"
                      height="420"
                      rx="35"
                      fill={themeColors.cytoplasm}
                      stroke="#059669"
                      strokeWidth="9"
                      className="transition-all duration-700"
                    />
                  ) : (
                    // Animal Cell Membrane (Pinches inwards during Cytokinesis)
                    <path
                      d={
                        (divisionMode === "mitosis" && currentMitosisPhase.id === "cytokinesis") ||
                        (divisionMode === "meiosis" && currentMeiosisPhase.id === "telophase_1") ||
                        (divisionMode === "meiosis" && currentMeiosisPhase.id === "gametes_complete")
                          ? "M 90,250 C 90,110 220,110 250,195 C 280,110 410,110 410,250 C 410,390 280,390 250,305 C 220,390 90,390 90,250 Z"
                          : (divisionMode === "mitosis" && currentMitosisPhase.id === "anaphase") ||
                            (divisionMode === "mitosis" && currentMitosisPhase.id === "telophase") ||
                            (divisionMode === "meiosis" && currentMeiosisPhase.id === "anaphase_1")
                          ? "M 65,250 C 65,120 435,120 435,250 C 435,380 65,380 65,250 Z"
                          : "M 75,250 C 75,135 425,135 425,250 C 425,365 75,365 75,250 Z"
                      }
                      fill={themeColors.cytoplasm}
                      stroke={stainingMode === "fluorescence" ? "#06b6d4" : "#f43f5e"}
                      strokeWidth="3.5"
                      className="transition-all duration-700"
                    />
                  )}

                  {/* 2. Nuclear Envelope Cycle */}
                  {/* Interphase Intact Double Membrane */}
                  {((divisionMode === "mitosis" && currentMitosisPhase.id === "interphase") ||
                    (divisionMode === "meiosis" && currentMeiosisPhase.id === "interphase")) && (
                    <g>
                      <ellipse
                        cx="250"
                        cy="250"
                        rx="125"
                        ry="125"
                        fill="none"
                        stroke={stainingMode === "fluorescence" ? "#38bdf8" : "#818cf8"}
                        strokeWidth="2.5"
                        strokeDasharray="5 3"
                        className="animate-pulse"
                      />
                      {/* Nucleolus */}
                      <circle cx="275" cy="225" r="18" fill="#38bdf8" opacity="0.35" />
                    </g>
                  )}

                  {/* Prometaphase Vesicular Breakdown */}
                  {divisionMode === "mitosis" && currentMitosisPhase.id === "prometaphase" && (
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="135"
                      ry="135"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="8 12"
                      opacity="0.35"
                    />
                  )}

                  {/* Telophase / Cytokinesis: Dual Reforming Envelopes */}
                  {((divisionMode === "mitosis" && (currentMitosisPhase.id === "telophase" || currentMitosisPhase.id === "cytokinesis")) ||
                    (divisionMode === "meiosis" && (currentMeiosisPhase.id === "telophase_1" || currentMeiosisPhase.id === "prophase_2"))) && (
                    <>
                      <ellipse cx="150" cy="250" rx="70" ry="85" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
                      <ellipse cx="350" cy="250" rx="70" ry="85" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
                    </>
                  )}

                  {/* 3. Centrosome Poles & Microtubule Asters */}
                  {drugInhibitor !== "colchicine" && drugInhibitor !== "nocodazole" && (
                    <>
                      {/* Left Pole */}
                      <g transform="translate(100, 250)">
                        <circle cx="0" cy="0" r="8" fill="#10b981" filter="url(#laserGlow)" />
                        {/* Aster Rays */}
                        {[-50, -30, -10, 10, 30, 50].map((deg) => (
                          <line
                            key={deg}
                            x1="0"
                            y1="0"
                            x2={Math.cos((deg * Math.PI) / 180) * 40}
                            y2={Math.sin((deg * Math.PI) / 180) * 40}
                            stroke="#10b981"
                            strokeWidth="1.2"
                            opacity="0.6"
                          />
                        ))}
                      </g>

                      {/* Right Pole */}
                      <g transform="translate(400, 250)">
                        <circle cx="0" cy="0" r="8" fill="#10b981" filter="url(#laserGlow)" />
                        {/* Aster Rays */}
                        {[130, 150, 170, 190, 210, 230].map((deg) => (
                          <line
                            key={deg}
                            x1="0"
                            y1="0"
                            x2={Math.cos((deg * Math.PI) / 180) * 40}
                            y2={Math.sin((deg * Math.PI) / 180) * 40}
                            stroke="#10b981"
                            strokeWidth="1.2"
                            opacity="0.6"
                          />
                        ))}
                      </g>
                    </>
                  )}

                  {/* 4. Dynamic Kinetochore Microtubule Fibers */}
                  {drugInhibitor !== "colchicine" && drugInhibitor !== "nocodazole" && (
                    <g opacity="0.65" stroke={themeColors.spindleFiber} strokeWidth="1.5" strokeDasharray="3 2">
                      {/* Metaphase / Prometaphase Spindle Bipolar Lattice */}
                      {(currentMitosisPhase.id === "metaphase" || currentMeiosisPhase.id === "metaphase_1") && (
                        <>
                          <line x1="100" y1="250" x2="250" y2="160" />
                          <line x1="400" y1="250" x2="250" y2="160" />
                          <line x1="100" y1="250" x2="250" y2="220" />
                          <line x1="400" y1="250" x2="250" y2="220" />
                          <line x1="100" y1="250" x2="250" y2="280" />
                          <line x1="400" y1="250" x2="250" y2="280" />
                          <line x1="100" y1="250" x2="250" y2="340" />
                          <line x1="400" y1="250" x2="250" y2="340" />
                        </>
                      )}

                      {/* Mitosis Anaphase: Fibers pull sister chromatids to poles */}
                      {divisionMode === "mitosis" && currentMitosisPhase.id === "anaphase" && (
                        <>
                          {/* Left Pole to Left Chromatids */}
                          <line x1="100" y1="250" x2="165" y2="160" />
                          <line x1="100" y1="250" x2="165" y2="220" />
                          <line x1="100" y1="250" x2="165" y2="280" />
                          <line x1="100" y1="250" x2="165" y2="340" />

                          {/* Right Pole to Right Chromatids */}
                          <line x1="400" y1="250" x2="335" y2="160" />
                          <line x1="400" y1="250" x2="335" y2="220" />
                          <line x1="400" y1="250" x2="335" y2="280" />
                          <line x1="400" y1="250" x2="335" y2="340" />
                        </>
                      )}

                      {/* Meiosis Anaphase 1: Fibers pull whole homologous dyads to poles */}
                      {divisionMode === "meiosis" && currentMeiosisPhase.id === "anaphase_1" && (
                        <>
                          <line x1="100" y1="250" x2="170" y2="190" />
                          <line x1="400" y1="250" x2={nondisjunctionMode === "anaphase_1" ? "170" : "330"} y2="190" />
                          <line x1="100" y1="250" x2="170" y2="310" />
                          <line x1="400" y1="250" x2="330" y2="310" />
                        </>
                      )}
                    </g>
                  )}

                  {/* 5. Cytokinesis Plant Cell Plate / Animal Furrow */}
                  {((divisionMode === "mitosis" && currentMitosisPhase.id === "cytokinesis") ||
                    (divisionMode === "meiosis" && currentMeiosisPhase.id === "gametes_complete")) && (
                    cellModel === "plant" ? (
                      <g>
                        <rect x="246" y="60" width="8" height="380" rx="3" fill="#10b981" filter="url(#laserGlow)" />
                        {/* Golgi Secretory Pectin Vesicles */}
                        {[100, 140, 180, 220, 260, 300, 340, 380].map((y) => (
                          <circle key={y} cx="250" cy={y} r="5" fill="#34d399" />
                        ))}
                      </g>
                    ) : (
                      // Animal Contractile Furrow Ring
                      <g>
                        <line x1="250" y1="100" x2="250" y2="400" stroke="#f43f5e" strokeWidth="3" strokeDasharray="3 3" />
                        <circle cx="250" cy="195" r="4" fill="#f43f5e" filter="url(#laserGlow)" />
                        <circle cx="250" cy="305" r="4" fill="#f43f5e" filter="url(#laserGlow)" />
                      </g>
                    )
                  )}

                  {/* 6. DYNAMIC CHROMOSOME ENGINE ──────────────────────────── */}
                  {/* Case A: Somatic Mitosis (2n = 4) */}
                  {divisionMode === "mitosis" && (
                    <g>
                      {chromosomes.map((chr, index) => {
                        const isSelected = selectedChr?.id === chr.id;
                        const phaseId = currentMitosisPhase.id;

                        // Anaphase / Telophase: Sister Chromatid Disjunction!
                        if (phaseId === "anaphase" || phaseId === "telophase" || phaseId === "cytokinesis") {
                          const leftX = phaseId === "anaphase" ? 170 : 145;
                          const rightX = phaseId === "anaphase" ? 330 : 355;
                          const yPos = 160 + index * 58;

                          return (
                            <g key={chr.id}>
                              {/* Chromatid A (Pulled Left toward 100, 250) */}
                              <g
                                transform={`translate(${leftX}, ${yPos})`}
                                onClick={() => {
                                  setSelectedChr(chr);
                                  playSynthBeep(440 + index * 50);
                                }}
                                className="cursor-pointer transition-transform duration-700"
                              >
                                {/* Centromere leads left, arms drag right in '<' shape */}
                                <path
                                  d={`M 18,-${chr.length / 2.2} Q 0,0 18,${chr.length / 2.2}`}
                                  fill="none"
                                  stroke={chr.color}
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                />
                                <circle cx="0" cy="0" r="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                                <text x="-16" y="3" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                                  {chr.alleles[0]}
                                </text>
                              </g>

                              {/* Chromatid B (Pulled Right toward 400, 250) */}
                              <g
                                transform={`translate(${rightX}, ${yPos})`}
                                onClick={() => {
                                  setSelectedChr(chr);
                                  playSynthBeep(440 + index * 50);
                                }}
                                className="cursor-pointer transition-transform duration-700"
                              >
                                {/* Centromere leads right, arms drag left in '>' shape */}
                                <path
                                  d={`M -18,-${chr.length / 2.2} Q 0,0 -18,${chr.length / 2.2}`}
                                  fill="none"
                                  stroke={chr.color}
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                />
                                <circle cx="0" cy="0" r="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                                <text x="8" y="3" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                                  {chr.alleles[0]}
                                </text>
                              </g>
                            </g>
                          );
                        }

                        // Interphase, Prophase, Prometaphase, Metaphase (Duplicated Sister Chromatids Together)
                        let x = 250;
                        let y = 160 + index * 58;
                        let rot = 0;

                        if (phaseId === "interphase") {
                          x = 230 + (index % 2) * 40;
                          y = 210 + (index - 1.5) * 35;
                          rot = (index - 1.5) * 30;
                        } else if (phaseId === "prophase") {
                          x = 225 + (index % 2) * 50;
                          y = 190 + index * 36;
                          rot = (index - 1.5) * 20;
                        } else if (phaseId === "prometaphase") {
                          x = 240 + (index % 2) * 20;
                          y = 170 + index * 50;
                          rot = (index - 1.5) * 10;
                        } else if (phaseId === "metaphase") {
                          // Single-file vertical alignment at Metaphase Plate
                          x = 250;
                          y = 160 + index * 58;
                          rot = 90;
                        }

                        return (
                          <g
                            key={chr.id}
                            transform={`translate(${x}, ${y}) rotate(${rot})`}
                            onClick={() => {
                              setSelectedChr(chr);
                              playSynthBeep(440 + index * 50);
                            }}
                            className="cursor-pointer transition-all duration-700"
                          >
                            {/* Chromatid 1 */}
                            <rect
                              x="-7"
                              y={-chr.length / 2}
                              width="5.5"
                              height={chr.length}
                              rx="2.8"
                              fill={chr.color}
                              stroke={isSelected ? "#10b981" : "rgba(255,255,255,0.4)"}
                              strokeWidth={isSelected ? "2.5" : "1"}
                            />
                            {/* Chromatid 2 */}
                            <rect
                              x="1.5"
                              y={-chr.length / 2}
                              width="5.5"
                              height={chr.length}
                              rx="2.8"
                              fill={chr.color}
                              stroke={isSelected ? "#10b981" : "rgba(255,255,255,0.4)"}
                              strokeWidth={isSelected ? "2.5" : "1"}
                            />
                            {/* Centromeric Kinetochore constriction */}
                            <ellipse cx="0" cy="0" rx="4.5" ry="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                            {/* Allele label */}
                            <text x="10" y="3" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                              {chr.alleles.join("")}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* Case B: Gametic Meiosis (2n = 4 -> 4x n = 2) */}
                  {divisionMode === "meiosis" && (
                    <g>
                      {/* Prophase 1: Synapsed Homologues forming Bivalents / Tetrads with Chiasmata */}
                      {currentMeiosisPhase.id === "prophase_1" && (
                        <>
                          {/* Bivalent 1 (Chr 1 Maternal + Paternal) */}
                          <g transform="translate(250, 190)">
                            {/* Maternal Chromatids (Left pair) */}
                            <rect x="-14" y="-28" width="5.5" height="56" rx="2.5" fill="#06b6d4" />
                            <rect x="-7.5" y="-28" width="5.5" height="56" rx="2.5" fill="#06b6d4" />

                            {/* Paternal Chromatids (Right pair) */}
                            <rect x="2" y="-28" width="5.5" height="56" rx="2.5" fill="#f43f5e" />
                            <rect x="8.5" y="-28" width="5.5" height="56" rx="2.5" fill="#f43f5e" />

                            {/* Interactive Chiasma Node */}
                            <g
                              onClick={() => {
                                setCrossover1((c) => !c);
                                playChiasmaZap();
                              }}
                              className="cursor-pointer"
                            >
                              <circle
                                cx="0"
                                cy="14"
                                r="8"
                                fill={crossover1 ? "#a855f7" : "#f59e0b"}
                                className="animate-pulse"
                                filter="url(#laserGlow)"
                              />
                              <text x="-4" y="17" fill="#ffffff" fontSize="8" fontWeight="bold">✕</text>
                            </g>

                            {/* Recombinant segment preview */}
                            {crossover1 && (
                              <>
                                <rect x="-7.5" y="14" width="5.5" height="14" rx="1.5" fill="#f43f5e" stroke="#a855f7" strokeWidth="1" />
                                <rect x="2" y="14" width="5.5" height="14" rx="1.5" fill="#06b6d4" stroke="#a855f7" strokeWidth="1" />
                              </>
                            )}

                            <text x="-35" y="-32" fill="#06b6d4" fontSize="9" fontWeight="bold">Chr 1 Mat (A-B-C)</text>
                            <text x="12" y="-32" fill="#f43f5e" fontSize="9" fontWeight="bold">Chr 1 Pat (a-b-c)</text>
                          </g>

                          {/* Bivalent 2 (Chr 2 Maternal + Paternal) */}
                          <g transform="translate(250, 310)">
                            {/* Maternal Chromatids (Left pair) */}
                            <rect x="-14" y="-22" width="5.5" height="44" rx="2.5" fill="#38bdf8" />
                            <rect x="-7.5" y="-22" width="5.5" height="44" rx="2.5" fill="#38bdf8" />

                            {/* Paternal Chromatids (Right pair) */}
                            <rect x="2" y="-22" width="5.5" height="44" rx="2.5" fill="#fb7185" />
                            <rect x="8.5" y="-22" width="5.5" height="44" rx="2.5" fill="#fb7185" />

                            {/* Interactive Chiasma Node */}
                            <g
                              onClick={() => {
                                setCrossover2((c) => !c);
                                playChiasmaZap();
                              }}
                              className="cursor-pointer"
                            >
                              <circle
                                cx="0"
                                cy="10"
                                r="7"
                                fill={crossover2 ? "#a855f7" : "#f59e0b"}
                                className="animate-pulse"
                                filter="url(#laserGlow)"
                              />
                              <text x="-4" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">✕</text>
                            </g>

                            {/* Recombinant segment preview */}
                            {crossover2 && (
                              <>
                                <rect x="-7.5" y="10" width="5.5" height="12" rx="1.5" fill="#fb7185" stroke="#a855f7" strokeWidth="1" />
                                <rect x="2" y="10" width="5.5" height="12" rx="1.5" fill="#38bdf8" stroke="#a855f7" strokeWidth="1" />
                              </>
                            )}

                            <text x="-32" y="-26" fill="#38bdf8" fontSize="9" fontWeight="bold">Chr 2 Mat (D-E)</text>
                            <text x="12" y="-26" fill="#fb7185" fontSize="9" fontWeight="bold">Chr 2 Pat (d-e)</text>
                          </g>
                        </>
                      )}

                      {/* Metaphase 1: Double-File Alignment along Metaphase Plate (Independent Assortment) */}
                      {currentMeiosisPhase.id === "metaphase_1" && (
                        <>
                          {/* Homologue Pair 1 */}
                          <g transform="translate(250, 190)">
                            {/* Left Dyad */}
                            <g transform={`translate(${flipPair1 ? 22 : -22}, 0)`}>
                              <rect x="-6" y="-28" width="5.5" height="56" rx="2.5" fill={flipPair1 ? "#f43f5e" : "#06b6d4"} />
                              <rect x="0.5" y="-28" width="5.5" height="56" rx="2.5" fill={flipPair1 ? "#f43f5e" : "#06b6d4"} />
                              <ellipse cx="0" cy="0" rx="4" ry="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                            </g>
                            {/* Right Dyad */}
                            <g transform={`translate(${flipPair1 ? -22 : 22}, 0)`}>
                              <rect x="-6" y="-28" width="5.5" height="56" rx="2.5" fill={flipPair1 ? "#06b6d4" : "#f43f5e"} />
                              <rect x="0.5" y="-28" width="5.5" height="56" rx="2.5" fill={flipPair1 ? "#06b6d4" : "#f43f5e"} />
                              <ellipse cx="0" cy="0" rx="4" ry="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                            </g>
                          </g>

                          {/* Homologue Pair 2 */}
                          <g transform="translate(250, 310)">
                            {/* Left Dyad */}
                            <g transform={`translate(${flipPair2 ? 22 : -22}, 0)`}>
                              <rect x="-6" y="-22" width="5.5" height="44" rx="2.5" fill={flipPair2 ? "#fb7185" : "#38bdf8"} />
                              <rect x="0.5" y="-22" width="5.5" height="44" rx="2.5" fill={flipPair2 ? "#fb7185" : "#38bdf8"} />
                              <ellipse cx="0" cy="0" rx="4" ry="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                            </g>
                            {/* Right Dyad */}
                            <g transform={`translate(${flipPair2 ? -22 : 22}, 0)`}>
                              <rect x="-6" y="-22" width="5.5" height="44" rx="2.5" fill={flipPair2 ? "#38bdf8" : "#fb7185"} />
                              <rect x="0.5" y="-22" width="5.5" height="44" rx="2.5" fill={flipPair2 ? "#38bdf8" : "#fb7185"} />
                              <ellipse cx="0" cy="0" rx="4" ry="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                            </g>
                          </g>
                        </>
                      )}

                      {/* Anaphase 1: Reductional Segregation of Whole Dyads */}
                      {currentMeiosisPhase.id === "anaphase_1" && (
                        <>
                          {/* Pair 1: Normal separates left and right; or Meiosis 1 Nondisjunction sends both left */}
                          <g transform={`translate(170, 190)`}>
                            <rect x="-6" y="-28" width="5.5" height="56" rx="2.5" fill="#06b6d4" />
                            <rect x="0.5" y="-28" width="5.5" height="56" rx="2.5" fill="#06b6d4" />
                            <circle cx="0" cy="0" r="3.5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                          </g>

                          <g transform={`translate(${nondisjunctionMode === "anaphase_1" ? 170 : 330}, ${nondisjunctionMode === "anaphase_1" ? 220 : 190})`}>
                            <rect x="-6" y="-28" width="5.5" height="56" rx="2.5" fill="#f43f5e" />
                            <rect x="0.5" y="-28" width="5.5" height="56" rx="2.5" fill="#f43f5e" />
                            <circle cx="0" cy="0" r="3.5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                          </g>

                          {/* Pair 2 */}
                          <g transform="translate(170, 310)">
                            <rect x="-6" y="-22" width="5.5" height="44" rx="2.5" fill="#38bdf8" />
                            <rect x="0.5" y="-22" width="5.5" height="44" rx="2.5" fill="#38bdf8" />
                            <circle cx="0" cy="0" r="3.5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                          </g>

                          <g transform="translate(330, 310)">
                            <rect x="-6" y="-22" width="5.5" height="44" rx="2.5" fill="#fb7185" />
                            <rect x="0.5" y="-22" width="5.5" height="44" rx="2.5" fill="#fb7185" />
                            <circle cx="0" cy="0" r="3.5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                          </g>
                        </>
                      )}

                      {/* Anaphase 2 & Gametes Complete: 4 sets of haploid chromosomes */}
                      {(currentMeiosisPhase.id === "anaphase_2" || currentMeiosisPhase.id === "gametes_complete") && (
                        <g>
                          {/* Gamete 1: Top Left */}
                          <g transform="translate(140, 160)">
                            <rect x="-3" y="-20" width="5" height="40" rx="2" fill="#06b6d4" />
                            <rect x="8" y="-15" width="5" height="30" rx="2" fill="#38bdf8" />
                            <circle cx="0" cy="0" r="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                            <text x="-25" y="-26" fill="#06b6d4" fontSize="8" fontWeight="bold">n = 2 (Gamete 1)</text>
                          </g>

                          {/* Gamete 2: Bottom Left */}
                          <g transform="translate(140, 340)">
                            <rect x="-3" y="-20" width="5" height="40" rx="2" fill="#06b6d4" />
                            <rect x="8" y="-15" width="5" height="30" rx="2" fill="#38bdf8" />
                            <circle cx="0" cy="0" r="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                            <text x="-25" y="-26" fill="#06b6d4" fontSize="8" fontWeight="bold">n = 2 (Gamete 2)</text>
                          </g>

                          {/* Gamete 3: Top Right */}
                          <g transform="translate(360, 160)">
                            <rect x="-3" y="-20" width="5" height="40" rx="2" fill="#f43f5e" />
                            <rect x="8" y="-15" width="5" height="30" rx="2" fill="#fb7185" />
                            <circle cx="0" cy="0" r="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                            <text x="-25" y="-26" fill="#f43f5e" fontSize="8" fontWeight="bold">n = 2 (Gamete 3)</text>
                          </g>

                          {/* Gamete 4: Bottom Right */}
                          <g transform="translate(360, 340)">
                            <rect x="-3" y="-20" width="5" height="40" rx="2" fill="#f43f5e" />
                            <rect x="8" y="-15" width="5" height="30" rx="2" fill="#fb7185" />
                            <circle cx="0" cy="0" r="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                            <text x="-25" y="-26" fill="#f43f5e" fontSize="8" fontWeight="bold">n = 2 (Gamete 4)</text>
                          </g>
                        </g>
                      )}
                    </g>
                  )}
                </svg>
              </div>

              {/* Chiasma Crossing-Over Trigger & Assortment Quick-Action Dock */}
              {divisionMode === "meiosis" && currentMeiosisPhase.id === "prophase_1" && (
                <div className="absolute bottom-4 z-30 flex items-center gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => {
                      setCrossover1((c) => !c);
                      playChiasmaZap();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer"
                  >
                    <Shuffle size={14} />
                    <span>Swap Chr 1 Chiasma (A-B-C)</span>
                  </button>
                  <button
                    onClick={() => {
                      setCrossover2((c) => !c);
                      playChiasmaZap();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer"
                  >
                    <Shuffle size={14} />
                    <span>Swap Chr 2 Chiasma (D-E)</span>
                  </button>
                </div>
              )}

              {/* Independent Assortment Flip Dock at Metaphase 1 */}
              {divisionMode === "meiosis" && currentMeiosisPhase.id === "metaphase_1" && (
                <div className="absolute bottom-4 z-30 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFlipPair1((f) => !f);
                      playSynthBeep(520, "triangle");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-background/90 border border-border text-foreground font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    <Shuffle size={13} />
                    <span>Flip Chr 1 Orientation</span>
                  </button>
                  <button
                    onClick={() => {
                      setFlipPair2((f) => !f);
                      playSynthBeep(580, "triangle");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-background/90 border border-border text-foreground font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    <Shuffle size={13} />
                    <span>Flip Chr 2 Orientation</span>
                  </button>
                </div>
              )}
            </div>

            {/* ─── PHASE TIMELINE SCRUBBER ─────────────────────────────────── */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" />
                  <span className="text-xs font-black text-foreground">Cell Division Phase Timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPhase}
                    disabled={divisionMode === "mitosis" ? mitosisIdx === 0 : meiosisIdx === 0}
                    className="p-1.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground transition disabled:opacity-30 cursor-pointer"
                    title="Previous Phase"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-mono font-black text-foreground">
                    {divisionMode === "mitosis"
                      ? `${mitosisIdx + 1} / ${MITOSIS_PHASE_SEQUENCE.length}`
                      : `${meiosisIdx + 1} / ${MEIOSIS_PHASE_SEQUENCE.length}`}
                  </span>
                  <button
                    onClick={handleNextPhase}
                    disabled={
                      divisionMode === "mitosis"
                        ? mitosisIdx === MITOSIS_PHASE_SEQUENCE.length - 1
                        : meiosisIdx === MEIOSIS_PHASE_SEQUENCE.length - 1
                    }
                    className="p-1.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground transition disabled:opacity-30 cursor-pointer"
                    title="Next Phase"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Scrubbing Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {(divisionMode === "mitosis" ? MITOSIS_PHASE_SEQUENCE : MEIOSIS_PHASE_SEQUENCE).map((phase, idx) => {
                  const isActive = divisionMode === "mitosis" ? mitosisIdx === idx : meiosisIdx === idx;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => {
                        if (divisionMode === "mitosis") setMitosisIdx(idx);
                        else setMeiosisIdx(idx);
                        playSynthBeep(320 + idx * 30);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-emerald-500 text-white shadow-sm font-black"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {phase.name}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground font-mono">
                <p>{divisionMode === "mitosis" ? currentMitosisPhase.desc : currentMeiosisPhase.desc}</p>
                <span className="shrink-0 text-emerald-500 font-bold">
                  Stage Duration: {divisionMode === "mitosis" ? currentMitosisPhase.stageTime : currentMeiosisPhase.stageTime}
                </span>
              </div>
            </div>

            {/* ─── LIVE TELEMETRY DASHBOARD ──────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Chromosomes (N)
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-cyan-500 font-mono">
                    {telemetry.chromosomeCount}
                  </span>
                  <span className="text-[10px] text-muted-foreground">bodies</span>
                </div>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Chromatids (2N)
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-rose-500 font-mono">
                    {telemetry.chromatidCount}
                  </span>
                  <span className="text-[10px] text-muted-foreground">copies</span>
                </div>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Cohesin Status
                </span>
                <span className="text-xs font-black capitalize text-foreground font-mono block">
                  {telemetry.cohesinStatus.replace("_", " ")}
                </span>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Spindle Tension
                </span>
                <span className={`text-xs font-black capitalize font-mono block ${
                  telemetry.spindleTension === "bipolar_balanced" ? "text-emerald-500" : "text-amber-500"
                }`}>
                  {telemetry.spindleTension.replace("_", " ")}
                </span>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  APC/C &amp; SAC Status
                </span>
                <div className="flex items-center gap-1 mt-1 text-xs font-black">
                  {telemetry.apcActive ? (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <ShieldCheck size={14} /> SAC Passed
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1">
                      <ShieldAlert size={14} /> SAC Arrest
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground block">
                  Aneuploidy Mutator
                </span>
                <select
                  value={nondisjunctionMode}
                  onChange={(e) => setNondisjunctionMode(e.target.value as NondisjunctionType)}
                  className="w-full bg-background border border-border rounded-xl px-2 py-1 text-[11px] font-bold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="none">Normal Disjunction</option>
                  <option value="anaphase_1">Meiosis I Error (100% Aneuploid)</option>
                  <option value="anaphase_2">Meiosis II Error (50% Aneuploid)</option>
                </select>
              </div>
            </div>

            {/* Selected Chromosome Karyotype Locus Inspector */}
            {selectedChr && (
              <div className="bg-card border border-border rounded-3xl p-5 shadow-md space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <Dna size={18} className="text-emerald-500" />
                    <h3 className="text-sm font-black text-foreground">
                      Karyotype Locus Inspector: {selectedChr.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedChr(null)}
                    className="text-xs text-muted-foreground hover:text-foreground font-bold cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">Parental Origin</span>
                    <span className="font-black capitalize text-foreground">{selectedChr.parent}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">Centromere Type</span>
                    <span className="font-black capitalize text-foreground">{selectedChr.centromereType}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">Recombination Status</span>
                    <span className={`font-black ${selectedChr.isRecombinant ? "text-amber-500" : "text-emerald-500"}`}>
                      {selectedChr.isRecombinant ? "Recombinant Chiasma" : "Parental Linked"}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                    <span className="text-[10px] text-muted-foreground block">Genotype Loci</span>
                    <span className="font-black text-primary text-sm">{selectedChr.alleles.join(" — ")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: SYNAPTONEMAL RECOMBINATION STUDIO ────────────────────── */}
        {activeTab === "recombination" && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                  <Dna size={20} className="text-emerald-500" />
                  <span>Synaptonemal Crossing-Over &amp; Chiasmata Matrix</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  In Prophase I (Pachytene), non-sister chromatids of homologous pairs physically break and re-fuse at chiasmata.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCrossover1((c) => !c);
                    setCrossover2((c) => !c);
                    playChiasmaZap();
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-black rounded-xl shadow-xs transition cursor-pointer"
                >
                  Toggle All Chiasmata
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Homologue 1: Chr 1 Matrix */}
              <div className="p-5 bg-muted/30 rounded-2xl border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-foreground">Homologue Pair 1 (Locus A-B-C)</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    crossover1 ? "bg-amber-500/20 text-amber-500" : "bg-muted text-muted-foreground"
                  }`}>
                    {crossover1 ? "Recombinant Chiasma" : "Parental Linked"}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Maternal Chromatid:</span>
                    <strong className="text-cyan-500">{crossover1 ? "A — B — c (Recombinant)" : "A — B — C (Parental)"}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Paternal Chromatid:</span>
                    <strong className="text-rose-500">{crossover1 ? "a — b — C (Recombinant)" : "a — b — c (Parental)"}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Recombination Frequency:</span>
                    <strong className="text-foreground">{crossover1 ? "50.0 cM (Map Distance)" : "0.0 cM"}</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCrossover1((c) => !c);
                    playChiasmaZap();
                  }}
                  className="w-full py-2.5 rounded-xl bg-background border border-border hover:bg-muted text-xs font-bold text-foreground transition cursor-pointer"
                >
                  {crossover1 ? "Revert to Parental Linkage" : "Induce Chiasma at Locus C"}
                </button>
              </div>

              {/* Homologue 2: Chr 2 Matrix */}
              <div className="p-5 bg-muted/30 rounded-2xl border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-foreground">Homologue Pair 2 (Locus D-E)</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    crossover2 ? "bg-amber-500/20 text-amber-500" : "bg-muted text-muted-foreground"
                  }`}>
                    {crossover2 ? "Recombinant Chiasma" : "Parental Linked"}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Maternal Chromatid:</span>
                    <strong className="text-sky-500">{crossover2 ? "D — e (Recombinant)" : "D — E (Parental)"}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Paternal Chromatid:</span>
                    <strong className="text-pink-500">{crossover2 ? "d — E (Recombinant)" : "d — e (Parental)"}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Recombination Frequency:</span>
                    <strong className="text-foreground">{crossover2 ? "50.0 cM (Map Distance)" : "0.0 cM"}</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCrossover2((c) => !c);
                    playChiasmaZap();
                  }}
                  className="w-full py-2.5 rounded-xl bg-background border border-border hover:bg-muted text-xs font-bold text-foreground transition cursor-pointer"
                >
                  {crossover2 ? "Revert to Parental Linkage" : "Induce Chiasma at Locus E"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: GAMETE INSPECTOR (4X) ────────────────────────────────── */}
        {activeTab === "gametes" && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="border-b border-border pb-4">
              <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                <Split size={20} className="text-emerald-500" />
                <span>Meiotic Gamete Outcomes &amp; Karyotypes</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Inspect each of the four haploid gametes produced by Meiosis. Observe how crossing-over, independent assortment, and nondisjunction determine viability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {meioticGametes.map((gamete, idx) => {
                const isSelected = selectedGameteIdx === idx;
                return (
                  <div
                    key={gamete.id}
                    onClick={() => setSelectedGameteIdx(idx)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 shadow-md"
                        : "bg-muted/30 border-border hover:border-emerald-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-foreground">{gamete.label}</span>
                      <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[10px] font-mono font-bold">
                        {gamete.ploidy}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chromosomes:</span>
                        <strong className="text-cyan-500">{gamete.chrCount}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Classification:</span>
                        <strong className="text-foreground">{gamete.status}</strong>
                      </div>
                      {gamete.alleles && (
                        <div className="pt-1 text-[11px] text-emerald-500 font-bold truncate">
                          Alleles: {gamete.alleles}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                      {gamete.syndrome}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 4: CYTOGENETICS & CLINICAL ANEUPLOIDY HUD ───────────────── */}
        {activeTab === "karyotype" && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="border-b border-border pb-4">
              <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                <Activity size={20} className="text-emerald-500" />
                <span>Clinical Cytogenetics &amp; Checkpoint Signaling</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Investigate Spindle Assembly Checkpoint (SAC) mechanics, separase cohesin cleavage, and human karyotype aneuploidies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SAC Signaling Pathway */}
              <div className="p-5 bg-muted/30 rounded-2xl border border-border/80 space-y-3">
                <span className="text-sm font-black text-foreground">Spindle Assembly Checkpoint (SAC / M-Phase Checkpoint)</span>
                <p className="text-xs text-muted-foreground">
                  The Mitotic Checkpoint Complex (Mad2, BubR1, Bub3) senses unattached kinetochores. Once all kinetochores experience bipolar tension, Cdc20 activates APC/C to ubiquitinate Securin, releasing Separase to cleave Cohesin rings.
                </p>
                <div className="p-3 bg-background rounded-xl border border-border space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tension State:</span>
                    <strong className="text-emerald-500">{telemetry.spindleTension}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mad2 Sensor:</span>
                    <strong className="text-foreground">{telemetry.apcActive ? "Dissociated (Permissive)" : "Bound to Kinetochore (Arrest)"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Separase State:</span>
                    <strong className="text-emerald-500">{telemetry.apcActive ? "Active Cleavage" : "Inhibited by Securin"}</strong>
                  </div>
                </div>
              </div>

              {/* Human Aneuploidy Clinical Reference */}
              <div className="p-5 bg-muted/30 rounded-2xl border border-border/80 space-y-3">
                <span className="text-sm font-black text-foreground">Aneuploidy Outcomes &amp; Clinical Syndromes</span>
                <p className="text-xs text-muted-foreground">
                  Nondisjunction of homologous pairs or sister chromatids leads to numerical aneuploid karyotypes in offspring:
                </p>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-background border border-border flex justify-between">
                    <span className="text-muted-foreground">Trisomy 21 (47,XX/XY,+21):</span>
                    <span className="font-bold text-rose-500">Down Syndrome</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background border border-border flex justify-between">
                    <span className="text-muted-foreground">Monosomy X (45,X):</span>
                    <span className="font-bold text-amber-500">Turner Syndrome</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background border border-border flex justify-between">
                    <span className="text-muted-foreground">47,XXY:</span>
                    <span className="font-bold text-primary">Klinefelter Syndrome</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background border border-border flex justify-between">
                    <span className="text-muted-foreground">Trisomy 18 (47,+18):</span>
                    <span className="font-bold text-rose-500">Edwards Syndrome</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: GUIDED PROTOCOLS ────────────────────────────────────── */}
        {activeTab === "challenges" && (
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Award size={20} className="text-emerald-500" />
              <div>
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  Guided Cytology Protocols
                </h2>
                <p className="text-xs text-muted-foreground">
                  Step-by-step investigations covering somatic division, genetic recombination, and pharmacological spindle arrest.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUIDED_CYTOLOGY_EXPERIMENTS.map((exp) => {
                const isActive = activeProtocol?.id === exp.id;
                return (
                  <div
                    key={exp.id}
                    onClick={() => {
                      setActiveProtocol(exp);
                      setDivisionMode(exp.mode);
                      if (exp.mode === "mitosis") {
                        const idx = MITOSIS_PHASE_SEQUENCE.findIndex((p) => p.id === exp.targetPhase);
                        if (idx !== -1) setMitosisIdx(idx);
                      } else {
                        const idx = MEIOSIS_PHASE_SEQUENCE.findIndex((p) => p.id === exp.targetPhase);
                        if (idx !== -1) setMeiosisIdx(idx);
                      }
                      if (exp.id === "exp_meiotic_chiasmata") setCrossover1(true);
                      if (exp.id === "exp_aneuploidy_fault") setNondisjunctionMode("anaphase_1");
                      if (exp.id === "exp_colchicine_arrest") setDrugInhibitor("colchicine");
                      setActiveTab("microscope");
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                      isActive
                        ? "bg-emerald-500/10 border-emerald-500 shadow-sm"
                        : "bg-background border-border hover:border-emerald-500/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-foreground">{exp.title}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{exp.description}</p>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="flex items-center gap-1 truncate max-w-[240px]">
                        <Sparkles size={12} /> {exp.keyInsight}
                      </span>
                      <span className="flex items-center gap-1 shrink-0">Execute <ChevronRight size={13} /></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── STICKY BOTTOM DOCKED CONTROLLER ───────────────────────────────── */}
      <div className="fixed bottom-3 inset-x-3 sm:max-w-xl sm:mx-auto z-40">
        <div className="bg-card/95 backdrop-blur-2xl border border-border/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center justify-between gap-2">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition transform active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            <span>{isPlaying ? "Pause Cycle" : "Autoplay Phase"}</span>
          </button>

          <button
            onClick={handleNextPhase}
            className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl bg-background border border-border hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
            title="Advance to Next Phase"
          >
            <ChevronRight size={16} />
            <span className="hidden sm:inline">Next Phase</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-xl bg-background border border-border hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
            title="Reset to Interphase"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ─── NEXT LAB MODAL & XP GAMIFICATION ──────────────────────────────── */}
      {showNextLabModal && nextLabProgression && (
        <NextLabModal
          isOpen={showNextLabModal}
          onClose={() => setShowNextLabModal(false)}
          xpEarned={xpResult?.xpEarned || 50}
          track={nextLabProgression.track}
          nextStep={nextLabProgression.nextStep}
          isFinalStep={nextLabProgression.isFinalStep}
          trackPercentage={nextLabProgression.trackPercentage}
        />
      )}
    </div>
  );
}
