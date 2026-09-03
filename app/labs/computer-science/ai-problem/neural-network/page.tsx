"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  Sparkles,
  ChevronRight,
  HelpCircle,
  BarChart3,
  Sliders,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Info,
  Maximize2,
  RefreshCw,
  Eye,
  Crosshair,
  TrendingDown,
  Gauge,
  CircleDot,
  Compass,
  Activity,
  Calculator,
  Binary,
  Cpu,
  Flame,
  AlertTriangle,
  FileCode,
  Grid,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

// ── Mathematical Types & Tensors ───────────────────────────────────────
type ActivationType = "relu" | "sigmoid" | "tanh" | "leaky_relu";
type OptimizerType = "sgd" | "momentum" | "adam" | "rmsprop";
type DatasetType = "xor" | "circle" | "moons" | "spiral" | "linear";
type LossFunctionType = "bce" | "mse";

interface DataPoint {
  x: number;
  y: number;
  label: number; // 0 or 1
}

interface Layer {
  size: number;
  activations: number[];
  zValues: number[];
  biases: number[];
  weights: number[][]; // weights[neuronIndex][prevNeuronIndex]
  weightGradients: number[][];
  biasGradients: number[];
  // Optimizer state tensors (Momentum & Adam)
  vWeights: number[][];
  mWeights: number[][];
  vBiases: number[];
  mBiases: number[];
  dropoutMask: boolean[];
}

// ── Activation Functions, Vector Derivatives & Math Engine ─────────────
function activate(x: number, fn: ActivationType): number {
  switch (fn) {
    case "relu":
      return Math.max(0, x);
    case "sigmoid":
      return 1 / (1 + Math.exp(-Math.max(-45, Math.min(45, x))));
    case "tanh":
      return Math.tanh(x);
    case "leaky_relu":
      return x > 0 ? x : 0.01 * x;
    default:
      return x;
  }
}

function activatePrime(x: number, fn: ActivationType): number {
  switch (fn) {
    case "relu":
      return x > 0 ? 1 : 0;
    case "sigmoid": {
      const s = activate(x, "sigmoid");
      return s * (1 - s);
    }
    case "tanh": {
      const t = Math.tanh(x);
      return 1 - t * t;
    }
    case "leaky_relu":
      return x > 0 ? 1 : 0.01;
    default:
      return 1;
  }
}

// Dataset Generator with 80/20 Train/Test Split
function generateDataset(type: DatasetType, count = 160): { train: DataPoint[]; test: DataPoint[] } {
  const points: DataPoint[] = [];

  if (type === "xor") {
    for (let i = 0; i < count; i++) {
      const corner = Math.floor(Math.random() * 4);
      const cx = corner % 2 === 0 ? -0.5 : 0.5;
      const cy = corner < 2 ? -0.5 : 0.5;
      const noiseX = (Math.random() - 0.5) * 0.38;
      const noiseY = (Math.random() - 0.5) * 0.38;
      const label = (cx > 0 ? 1 : 0) ^ (cy > 0 ? 1 : 0);
      points.push({ x: cx + noiseX, y: cy + noiseY, label });
    }
  } else if (type === "circle") {
    for (let i = 0; i < count; i++) {
      const label = i < count / 2 ? 0 : 1;
      const radius = label === 0 ? Math.random() * 0.38 : 0.54 + Math.random() * 0.36;
      const angle = Math.random() * Math.PI * 2;
      points.push({
        x: radius * Math.cos(angle) + (Math.random() - 0.5) * 0.06,
        y: radius * Math.sin(angle) + (Math.random() - 0.5) * 0.06,
        label,
      });
    }
  } else if (type === "moons") {
    const half = Math.floor(count / 2);
    for (let i = 0; i < half; i++) {
      const angle = (i / half) * Math.PI;
      points.push({
        x: Math.cos(angle) * 0.55 - 0.25 + (Math.random() - 0.5) * 0.12,
        y: Math.sin(angle) * 0.55 - 0.1 + (Math.random() - 0.5) * 0.12,
        label: 0,
      });
    }
    for (let i = 0; i < half; i++) {
      const angle = (i / half) * Math.PI;
      points.push({
        x: 0.25 - Math.cos(angle) * 0.55 + (Math.random() - 0.5) * 0.12,
        y: 0.1 - Math.sin(angle) * 0.55 + (Math.random() - 0.5) * 0.12,
        label: 1,
      });
    }
  } else if (type === "spiral") {
    const half = Math.floor(count / 2);
    for (let i = 0; i < half; i++) {
      const r = (i / half) * 0.85;
      const theta = (i / half) * 2.4 * Math.PI;
      points.push({
        x: r * Math.sin(theta) + (Math.random() - 0.5) * 0.08,
        y: r * Math.cos(theta) + (Math.random() - 0.5) * 0.08,
        label: 0,
      });
      points.push({
        x: -r * Math.sin(theta) + (Math.random() - 0.5) * 0.08,
        y: -r * Math.cos(theta) + (Math.random() - 0.5) * 0.08,
        label: 1,
      });
    }
  } else {
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1.6;
      const y = (Math.random() - 0.5) * 1.6;
      const label = y > x + 0.05 ? 1 : 0;
      points.push({ x, y, label });
    }
  }

  // Shuffle & Split 80/20
  const shuffled = [...points].sort(() => Math.random() - 0.5);
  const trainSize = Math.floor(count * 0.8);
  return {
    train: shuffled.slice(0, trainSize),
    test: shuffled.slice(trainSize),
  };
}

export default function NeuralNetworkLab() {
  const { completeExperiment } = useLab(
    "computer-science/ai-problem/neural-network",
    "computerScience",
    "exploration"
  );

  // ── Hyperparameters & Architecture State ────────────────────────────────
  const [datasetType, setDatasetType] = useState<DatasetType>("xor");
  const [activation, setActivation] = useState<ActivationType>("tanh");
  const [optimizer, setOptimizer] = useState<OptimizerType>("adam");
  const [lossFn, setLossFn] = useState<LossFunctionType>("bce");
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [l2Reg, setL2Reg] = useState<number>(0.0001);
  const [dropoutRate, setDropoutRate] = useState<number>(0.0);
  const [batchSize, setBatchSize] = useState<number>(32);

  const [hidden1Size, setHidden1Size] = useState<number>(6);
  const [hidden2Size, setHidden2Size] = useState<number>(4);
  const [hidden3Size, setHidden3Size] = useState<number>(0); // 0 = disabled

  // ── Simulation Engine State ─────────────────────────────────────────────
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingSpeed, setTrainingSpeed] = useState<number>(4); // steps per frame
  const [epoch, setEpoch] = useState<number>(0);
  const [trainLoss, setTrainLoss] = useState<number>(0.693);
  const [testLoss, setTestLoss] = useState<number>(0.693);
  const [trainAcc, setTrainAcc] = useState<number>(50);
  const [testAcc, setTestAcc] = useState<number>(50);
  const [gradientNorm, setGradientNorm] = useState<number>(0.25);
  const [gradientHealth, setGradientHealth] = useState<"healthy" | "vanishing" | "exploding">("healthy");

  // Loss Curve Histories
  const [trainLossHistory, setTrainLossHistory] = useState<number[]>([]);
  const [testLossHistory, setTestLossHistory] = useState<number[]>([]);

  // Interactive Probe Point & Inspector
  const [probePoint, setProbePoint] = useState<{ x: number; y: number }>({ x: 0.35, y: -0.25 });
  const [probeOutput, setProbeOutput] = useState<number>(0.5);
  const [activeTab, setActiveTab] = useState<"visualizer" | "matrices" | "theory" | "diagnostics">("visualizer");
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(1);
  const [hoveredNeuron, setHoveredNeuron] = useState<{ layer: number; index: number } | null>(null);

  // Confusion Matrix & Classification Metrics
  const [metrics, setMetrics] = useState({
    tp: 0,
    fp: 0,
    tn: 0,
    fn: 0,
    precision: 0,
    recall: 0,
    f1: 0,
  });

  // Milestones State
  const [milestones, setMilestones] = useState({
    trainedXor: false,
    highAccuracy: false,
    probedPoint: false,
    testedDeepNet: false,
    testedAdam: false,
    analyzedGradients: false,
  });

  // Dataset State
  const datasetRef = useRef(generateDataset("xor"));

  // Canvas Refs
  const networkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const decisionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lossCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pulsePhaseRef = useRef<number>(0);

  // ── Network Model Weights, Biases & Optimizers ───────────────────────────
  const networkRef = useRef<Layer[]>([]);
  const adamTimeStepRef = useRef<number>(0);

  // Initialize Layer Tensors with He / Xavier Initialization
  const initNetwork = useCallback(() => {
    const layerSizes = [2, hidden1Size];
    if (hidden2Size > 0) layerSizes.push(hidden2Size);
    if (hidden3Size > 0) layerSizes.push(hidden3Size);
    layerSizes.push(1); // Output layer (sigmoid binary probability)

    const layers: Layer[] = [];

    for (let l = 0; l < layerSizes.length; l++) {
      const size = layerSizes[l];
      const prevSize = l === 0 ? 0 : layerSizes[l - 1];

      const weights: number[][] = [];
      const weightGradients: number[][] = [];
      const vWeights: number[][] = [];
      const mWeights: number[][] = [];
      const biases: number[] = [];
      const biasGradients: number[] = [];
      const vBiases: number[] = [];
      const mBiases: number[] = [];

      for (let i = 0; i < size; i++) {
        biases.push((Math.random() - 0.5) * 0.2);
        biasGradients.push(0);
        vBiases.push(0);
        mBiases.push(0);

        if (l > 0) {
          const wRow: number[] = [];
          const wgRow: number[] = [];
          const vwRow: number[] = [];
          const mwRow: number[] = [];

          // He Initialization variance: sqrt(2 / fan_in)
          const scale = Math.sqrt(2 / Math.max(1, prevSize));
          for (let j = 0; j < prevSize; j++) {
            wRow.push((Math.random() - 0.5) * 2 * scale);
            wgRow.push(0);
            vwRow.push(0);
            mwRow.push(0);
          }
          weights.push(wRow);
          weightGradients.push(wgRow);
          vWeights.push(vwRow);
          mWeights.push(mwRow);
        }
      }

      layers.push({
        size,
        activations: new Array(size).fill(0),
        zValues: new Array(size).fill(0),
        biases,
        weights,
        weightGradients,
        biasGradients,
        vWeights,
        mWeights,
        vBiases,
        mBiases,
        dropoutMask: new Array(size).fill(true),
      });
    }

    networkRef.current = layers;
    adamTimeStepRef.current = 0;
    setEpoch(0);
    setTrainLossHistory([]);
    setTestLossHistory([]);
  }, [hidden1Size, hidden2Size, hidden3Size]);

  // Handle Dataset Change
  const handleDatasetChange = (type: DatasetType) => {
    setDatasetType(type);
    datasetRef.current = generateDataset(type);
    initNetwork();
  };

  useEffect(() => {
    initNetwork();
  }, [initNetwork]);

  // ── Tensor Forward Pass ($z = W a + b, a = \sigma(z)$) ───────────────────
  const forwardPass = useCallback(
    (input: [number, number], layers: Layer[], actFn: ActivationType, applyDropout = false) => {
      layers[0].activations[0] = input[0];
      layers[0].activations[1] = input[1];

      for (let l = 1; l < layers.length; l++) {
        const layer = layers[l];
        const prevLayer = layers[l - 1];
        const isOutput = l === layers.length - 1;

        for (let i = 0; i < layer.size; i++) {
          let sum = layer.biases[i];
          for (let j = 0; j < prevLayer.size; j++) {
            sum += layer.weights[i][j] * prevLayer.activations[j];
          }
          layer.zValues[i] = sum;

          // Activation function
          let act = isOutput ? activate(sum, "sigmoid") : activate(sum, actFn);

          // Apply inverted dropout mask during training
          if (applyDropout && !isOutput && dropoutRate > 0) {
            const keep = Math.random() >= dropoutRate;
            layer.dropoutMask[i] = keep;
            act = keep ? act / (1 - dropoutRate) : 0;
          } else {
            layer.dropoutMask[i] = true;
          }

          layer.activations[i] = act;
        }
      }

      return layers[layers.length - 1].activations[0];
    },
    [dropoutRate]
  );

  // ── Full Gradient Descent & Backpropagation Step ─────────────────────────
  const trainStep = useCallback(() => {
    const layers = networkRef.current;
    if (layers.length === 0) return;

    const { train: trainSet, test: testSet } = datasetRef.current;
    const lr = learningRate;
    const actFn = activation;
    const lambda = l2Reg;

    adamTimeStepRef.current += 1;
    const t = adamTimeStepRef.current;

    // Zero gradient accumulators
    for (let l = 1; l < layers.length; l++) {
      for (let i = 0; i < layers[l].size; i++) {
        layers[l].biasGradients[i] = 0;
        for (let j = 0; j < layers[l].weights[i].length; j++) {
          layers[l].weightGradients[i][j] = 0;
        }
      }
    }

    // Mini-batch sampling or full batch
    const batch =
      batchSize >= trainSet.length
        ? trainSet
        : [...trainSet].sort(() => Math.random() - 0.5).slice(0, batchSize);

    let batchLoss = 0;
    let trainCorrect = 0;

    for (const point of batch) {
      const pred = forwardPass([point.x, point.y], layers, actFn, true);
      const target = point.label;

      // Loss calculation (BCE or MSE)
      const safePred = Math.max(1e-7, Math.min(1 - 1e-7, pred));
      const sampleLoss =
        lossFn === "bce"
          ? -(target * Math.log(safePred) + (1 - target) * Math.log(1 - safePred))
          : 0.5 * Math.pow(pred - target, 2);
      batchLoss += sampleLoss;

      if ((pred >= 0.5 ? 1 : 0) === target) trainCorrect++;

      // Backpropagation Output Delta ($\delta^{[L]}$)
      const deltas: number[][] = layers.map((l) => new Array(l.size).fill(0));
      const lastIdx = layers.length - 1;

      // BCE with Sigmoid yields elegant simplified gradient: pred - target
      deltas[lastIdx][0] =
        lossFn === "bce" ? pred - target : (pred - target) * activatePrime(layers[lastIdx].zValues[0], "sigmoid");

      // Backpropagate deltas through hidden layers using chain rule:
      // $\delta^{[l]} = ( (W^{[l+1]})^T \delta^{[l+1]} ) \odot \sigma'(z^{[l]})$
      for (let l = lastIdx - 1; l >= 1; l--) {
        const nextLayer = layers[l + 1];
        const currentLayer = layers[l];

        for (let i = 0; i < currentLayer.size; i++) {
          let sum = 0;
          for (let k = 0; k < nextLayer.size; k++) {
            sum += deltas[l + 1][k] * nextLayer.weights[k][i];
          }
          const z = currentLayer.zValues[i];
          const prime = activatePrime(z, actFn);
          // Apply dropout mask
          deltas[l][i] = currentLayer.dropoutMask[i] ? sum * prime : 0;
        }
      }

      // Accumulate weight & bias gradients: $\nabla_W = \delta a^T$
      for (let l = 1; l < layers.length; l++) {
        const prevActivations = layers[l - 1].activations;
        for (let i = 0; i < layers[l].size; i++) {
          layers[l].biasGradients[i] += deltas[l][i];
          for (let j = 0; j < prevActivations.length; j++) {
            layers[l].weightGradients[i][j] += deltas[l][i] * prevActivations[j];
          }
        }
      }
    }

    const B = batch.length;
    let totalGradSq = 0;
    let totalParams = 0;

    // ── Optimizer Parameter Updates (SGD, Momentum, Adam, RMSprop) ─────────
    for (let l = 1; l < layers.length; l++) {
      const layer = layers[l];

      for (let i = 0; i < layer.size; i++) {
        // Bias update
        const db = layer.biasGradients[i] / B;
        layer.biases[i] -= lr * db;

        for (let j = 0; j < layer.weights[i].length; j++) {
          // Weight gradient + L2 regularization penalty
          const dw = layer.weightGradients[i][j] / B + lambda * layer.weights[i][j];
          totalGradSq += dw * dw;
          totalParams++;

          if (optimizer === "sgd") {
            layer.weights[i][j] -= lr * dw;
          } else if (optimizer === "momentum") {
            const beta = 0.9;
            layer.vWeights[i][j] = beta * layer.vWeights[i][j] + (1 - beta) * dw;
            layer.weights[i][j] -= lr * layer.vWeights[i][j];
          } else if (optimizer === "rmsprop") {
            const gamma = 0.99;
            const eps = 1e-8;
            layer.vWeights[i][j] = gamma * layer.vWeights[i][j] + (1 - gamma) * dw * dw;
            layer.weights[i][j] -= (lr / Math.sqrt(layer.vWeights[i][j] + eps)) * dw;
          } else if (optimizer === "adam") {
            const beta1 = 0.9;
            const beta2 = 0.999;
            const eps = 1e-8;

            layer.mWeights[i][j] = beta1 * layer.mWeights[i][j] + (1 - beta1) * dw;
            layer.vWeights[i][j] = beta2 * layer.vWeights[i][j] + (1 - beta2) * dw * dw;

            // Bias correction
            const mHat = layer.mWeights[i][j] / (1 - Math.pow(beta1, t));
            const vHat = layer.vWeights[i][j] / (1 - Math.pow(beta2, t));

            layer.weights[i][j] -= (lr / (Math.sqrt(vHat) + eps)) * mHat;
          }
        }
      }
    }

    // ── Evaluate Test Set Metrics ──────────────────────────────────────────
    let testLossSum = 0;
    let tp = 0,
      fp = 0,
      tn = 0,
      fn = 0;

    for (const pt of testSet) {
      const pred = forwardPass([pt.x, pt.y], layers, actFn, false);
      const target = pt.label;
      const safePred = Math.max(1e-7, Math.min(1 - 1e-7, pred));
      testLossSum +=
        lossFn === "bce"
          ? -(target * Math.log(safePred) + (1 - target) * Math.log(1 - safePred))
          : 0.5 * Math.pow(pred - target, 2);

      const predBinary = pred >= 0.5 ? 1 : 0;
      if (predBinary === 1 && target === 1) tp++;
      else if (predBinary === 1 && target === 0) fp++;
      else if (predBinary === 0 && target === 0) tn++;
      else if (predBinary === 0 && target === 1) fn++;
    }

    const avgTrainLoss = batchLoss / B;
    const avgTestLoss = testLossSum / testSet.length;
    const trainAccVal = Math.round((trainCorrect / B) * 100);
    const testAccVal = Math.round(((tp + tn) / testSet.length) * 100);

    const prec = tp + fp > 0 ? tp / (tp + fp) : 0;
    const rec = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1Score = prec + rec > 0 ? (2 * (prec * rec)) / (prec + rec) : 0;

    const gNorm = Math.sqrt(totalGradSq / Math.max(1, totalParams));
    setGradientNorm(gNorm);
    setGradientHealth(gNorm < 1e-4 ? "vanishing" : gNorm > 15 ? "exploding" : "healthy");

    setTrainLoss(avgTrainLoss);
    setTestLoss(avgTestLoss);
    setTrainAcc(trainAccVal);
    setTestAcc(testAccVal);
    setEpoch((prev) => prev + 1);

    setTrainLossHistory((prev) => [...prev.slice(-50), avgTrainLoss]);
    setTestLossHistory((prev) => [...prev.slice(-50), avgTestLoss]);

    setMetrics({
      tp,
      fp,
      tn,
      fn,
      precision: Math.round(prec * 100),
      recall: Math.round(rec * 100),
      f1: Math.round(f1Score * 100),
    });

    // Milestone validations
    if (testAccVal >= 92) {
      setMilestones((prev) => ({ ...prev, highAccuracy: true }));
      completeExperiment();
    }
    if (datasetType === "xor" && testAccVal >= 90) {
      setMilestones((prev) => ({ ...prev, trainedXor: true }));
    }
    if (hidden2Size > 0 || hidden3Size > 0) {
      setMilestones((prev) => ({ ...prev, testedDeepNet: true }));
    }
    if (optimizer === "adam") {
      setMilestones((prev) => ({ ...prev, testedAdam: true }));
    }
  }, [
    learningRate,
    activation,
    optimizer,
    lossFn,
    l2Reg,
    batchSize,
    forwardPass,
    completeExperiment,
    datasetType,
    hidden2Size,
    hidden3Size,
  ]);

  // ── Render & Training Loop ───────────────────────────────────────────────
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      pulsePhaseRef.current += 0.04;

      if (isTraining) {
        for (let s = 0; s < trainingSpeed; s++) {
          trainStep();
        }
      }

      drawDecisionBoundary();
      drawNetworkCanvas();
      drawLossChart();

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [isTraining, trainingSpeed, trainStep]);

  // Update probe on coordinate change
  useEffect(() => {
    if (networkRef.current.length > 0) {
      const pred = forwardPass([probePoint.x, probePoint.y], networkRef.current, activation, false);
      setProbeOutput(pred);
    }
  }, [probePoint, forwardPass, activation, epoch]);

  // ── Canvas Renderer 1: Decision Boundary Map ─────────────────────────────
  const drawDecisionBoundary = () => {
    const canvas = decisionCanvasRef.current;
    if (!canvas || networkRef.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const displayW = Math.round(rect.width * dpr);
    const displayH = Math.round(rect.height * dpr);

    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    }

    const width = rect.width;
    const height = rect.height;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const resolution = 32;
    const cellW = width / resolution;
    const cellH = height / resolution;

    // Draw prediction contour grid
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const nx = (i / resolution) * 2 - 1;
        const ny = (1 - j / resolution) * 2 - 1;
        const pred = forwardPass([nx, ny], networkRef.current, activation, false);

        if (pred < 0.5) {
          const alpha = (0.5 - pred) * 1.8;
          ctx.fillStyle = `rgba(249, 115, 22, ${Math.min(0.85, alpha)})`;
        } else {
          const alpha = (pred - 0.5) * 1.8;
          ctx.fillStyle = `rgba(6, 182, 212, ${Math.min(0.85, alpha)})`;
        }
        ctx.fillRect(i * cellW, j * cellH, cellW + 1, cellH + 1);
      }
    }

    // Grid axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Scatter Data Points (Train = Filled, Test = Ring)
    const { train, test } = datasetRef.current;

    for (const pt of train) {
      const px = ((pt.x + 1) / 2) * width;
      const py = ((1 - pt.y) / 2) * height;

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = pt.label === 1 ? "#06b6d4" : "#f97316";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (const pt of test) {
      const px = ((pt.x + 1) / 2) * width;
      const py = ((1 - pt.y) / 2) * height;

      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "transparent";
      ctx.strokeStyle = pt.label === 1 ? "#22d3ee" : "#fb923c";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Probe point
    const probePx = ((probePoint.x + 1) / 2) * width;
    const probePy = ((1 - probePoint.y) / 2) * height;

    ctx.beginPath();
    ctx.arc(probePx, probePy, 9, 0, Math.PI * 2);
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "#a855f7";
    ctx.beginPath();
    ctx.arc(probePx, probePy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // ── Canvas Renderer 2: Synaptic Network Graph ────────────────────────────
  const drawNetworkCanvas = () => {
    const canvas = networkCanvasRef.current;
    if (!canvas || networkRef.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const displayW = Math.round(rect.width * dpr);
    const displayH = Math.round(rect.height * dpr);

    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    }

    const width = rect.width;
    const height = rect.height;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const layers = networkRef.current;
    const numLayers = layers.length;

    const layerXPositions = layers.map((_, idx) =>
      60 + (idx / (numLayers - 1)) * (width - 120)
    );

    const neuronPositions: { x: number; y: number }[][] = [];

    for (let l = 0; l < numLayers; l++) {
      const size = layers[l].size;
      const x = layerXPositions[l];
      const positions: { x: number; y: number }[] = [];

      for (let i = 0; i < size; i++) {
        const y = height / 2 + (i - (size - 1) / 2) * 44;
        positions.push({ x, y });
      }
      neuronPositions.push(positions);
    }

    // Synapses & Tensor connection lines
    for (let l = 1; l < numLayers; l++) {
      const prevPositions = neuronPositions[l - 1];
      const currPositions = neuronPositions[l];
      const weights = layers[l].weights;

      for (let i = 0; i < currPositions.length; i++) {
        for (let j = 0; j < prevPositions.length; j++) {
          const w = weights[i][j];
          const from = prevPositions[j];
          const to = currPositions[i];

          const weightMag = Math.min(5, Math.abs(w) * 1.6);
          ctx.lineWidth = Math.max(0.6, weightMag);
          ctx.strokeStyle =
            w >= 0
              ? `rgba(6, 182, 212, ${Math.min(0.85, 0.18 + Math.abs(w) * 0.2)})`
              : `rgba(249, 115, 22, ${Math.min(0.85, 0.18 + Math.abs(w) * 0.2)})`;

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();

          if (isTraining) {
            const phase = (pulsePhaseRef.current + j * 0.35 + i * 0.25) % 1;
            const pulseX = from.x + (to.x - from.x) * phase;
            const pulseY = from.y + (to.y - from.y) * phase;

            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = w >= 0 ? "#22d3ee" : "#fb923c";
            ctx.fill();
          }
        }
      }
    }

    // Neurons
    for (let l = 0; l < numLayers; l++) {
      const positions = neuronPositions[l];
      const layer = layers[l];

      for (let i = 0; i < positions.length; i++) {
        const { x, y } = positions[i];
        const act = layer.activations[i] || 0;
        const normAct = Math.max(0, Math.min(1, (act + 1) / 2));

        ctx.beginPath();
        ctx.arc(x, y, 17, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${Math.max(0.1, normAct * 0.35)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#0f172a";
        ctx.fill();

        const isHovered = hoveredNeuron?.layer === l && hoveredNeuron?.index === i;
        ctx.strokeStyle = isHovered
          ? "#facc15"
          : l === 0
          ? "#38bdf8"
          : l === numLayers - 1
          ? "#34d399"
          : "#a855f7";
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8.5px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(act.toFixed(2), x, y);
      }
    }

    ctx.restore();
  };

  // ── Canvas Renderer 3: Train vs Test Loss Curve ──────────────────────────
  const drawLossChart = () => {
    const canvas = lossCanvasRef.current;
    if (!canvas || trainLossHistory.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let y = 10; y < height; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const maxLoss = 1.0;
    const stepX = width / Math.max(1, trainLossHistory.length - 1);

    // Plot Train Loss (Rose)
    ctx.beginPath();
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 2;
    for (let i = 0; i < trainLossHistory.length; i++) {
      const lx = i * stepX;
      const ly = height - Math.min(1, trainLossHistory[i] / maxLoss) * (height - 15) - 5;
      if (i === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.stroke();

    // Plot Test Loss (Cyan)
    if (testLossHistory.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 1.8;
      for (let i = 0; i < testLossHistory.length; i++) {
        const lx = i * stepX;
        const ly = height - Math.min(1, testLossHistory[i] / maxLoss) * (height - 15) - 5;
        if (i === 0) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
      }
      ctx.stroke();
    }
  };

  const handleDecisionMapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = decisionCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const nx = (clickX / rect.width) * 2 - 1;
    const ny = (1 - clickY / rect.height) * 2 - 1;

    setProbePoint({ x: Number(nx.toFixed(2)), y: Number(ny.toFixed(2)) });
    setMilestones((prev) => ({ ...prev, probedPoint: true }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/20">
      {/* ── Top Engineering Header ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/computer-science/ai-problem"
            className="p-2 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
            title="Back to AI Problems"
          >
            <ArrowRight className="rotate-180" size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shadow-sm">
              <Brain size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                  Multilayer Perceptron Neural Network Lab
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Matrix Calculus &amp; Backpropagation
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Formal vector calculus, gradient descent optimizers (SGD, Adam, RMSprop), vanishing gradient diagnostics &amp; decision boundaries
              </p>
            </div>
          </div>
        </div>

        {/* Global Execution Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsTraining(!isTraining)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
              isTraining
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25"
            }`}
          >
            {isTraining ? <Pause size={14} /> : <Play size={14} />}
            <span>{isTraining ? "Pause Training" : "Run Epochs"}</span>
          </button>

          <button
            type="button"
            onClick={() => trainStep()}
            disabled={isTraining}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs cursor-pointer disabled:opacity-40"
            title="Step One Gradient Epoch"
          >
            Step 1 Epoch
          </button>

          <button
            type="button"
            onClick={initNetwork}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
            title="Reinitialize He/Xavier Weights"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Laboratory Container ── */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "visualizer", label: "Interactive Architecture & Decision Boundary", icon: Layers },
            { id: "matrices", label: "Weight Matrix & Gradient Tensor Inspector", icon: Grid },
            { id: "theory", label: "Mathematical Equations & Matrix Calculus", icon: Calculator },
            { id: "diagnostics", label: "Gradient Norm & Vanishing Gradient Gauge", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "matrices" || tab.id === "diagnostics") {
                    setMilestones((p) => ({ ...p, analyzedGradients: true }));
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Hyperparameter Controls ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 p-4 sm:p-5 bg-card border border-border rounded-3xl shadow-sm">
          {/* 1. Dataset */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Target Problem
            </label>
            <select
              value={datasetType}
              onChange={(e) => handleDatasetChange(e.target.value as DatasetType)}
              className="w-full px-2.5 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="xor">XOR Non-Linear Gate</option>
              <option value="circle">Concentric Circles</option>
              <option value="moons">Interlocking Moons</option>
              <option value="spiral">Dual Spirals (Hard)</option>
              <option value="linear">Linearly Separable</option>
            </select>
          </div>

          {/* 2. Activation Function */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Activation Function σ(z)
            </label>
            <select
              value={activation}
              onChange={(e) => setActivation(e.target.value as ActivationType)}
              className="w-full px-2.5 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="tanh">Tanh (Zero-Centered)</option>
              <option value="relu">ReLU (Non-Saturating)</option>
              <option value="leaky_relu">Leaky ReLU (No Dying)</option>
              <option value="sigmoid">Sigmoid (Logistic)</option>
            </select>
          </div>

          {/* 3. Optimizer */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Gradient Optimizer
            </label>
            <select
              value={optimizer}
              onChange={(e) => setOptimizer(e.target.value as OptimizerType)}
              className="w-full px-2.5 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="adam">Adam (Adaptive Moments)</option>
              <option value="momentum">Momentum SGD (β=0.9)</option>
              <option value="rmsprop">RMSprop (Root Mean Sq)</option>
              <option value="sgd">Vanilla Mini-Batch SGD</option>
            </select>
          </div>

          {/* 4. Loss Function */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Loss Function
            </label>
            <select
              value={lossFn}
              onChange={(e) => setLossFn(e.target.value as LossFunctionType)}
              className="w-full px-2.5 py-1.5 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="bce">Binary Cross-Entropy (BCE)</option>
              <option value="mse">Mean Squared Error (MSE)</option>
            </select>
          </div>

          {/* 5. Learning Rate */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>Learning Rate (η)</span>
              <span className="font-mono text-foreground font-bold">{learningRate}</span>
            </div>
            <input
              type="range"
              min={0.005}
              max={0.3}
              step={0.005}
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* 6. L2 Weight Decay */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <span>L2 Decay (λ)</span>
              <span className="font-mono text-foreground font-bold">{l2Reg}</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.005}
              step={0.0005}
              value={l2Reg}
              onChange={(e) => setL2Reg(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </section>

        {/* ── TAB 1: Visualizer Arena ── */}
        {activeTab === "visualizer" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Synaptic Graph */}
              <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-foreground">
                      {"Synaptic Flow Graph & Node Activations a^[l]"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono font-bold">
                    <span className="text-cyan-500">+W (Excitatory)</span>
                    <span className="text-orange-500">-W (Inhibitory)</span>
                  </div>
                </div>

                <div className="relative w-full h-80 bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                  <canvas ref={networkCanvasRef} width={560} height={320} className="w-full h-full object-contain" />
                </div>

                {/* Architecture Customizer Strip */}
                <div className="flex items-center justify-between gap-2 p-3 bg-muted/30 border border-border rounded-2xl flex-wrap">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Layers size={13} className="text-indigo-500" />
                    Topology: [2 &rarr; {hidden1Size} {hidden2Size > 0 ? `→ ${hidden2Size}` : ""} {hidden3Size > 0 ? `→ ${hidden3Size}` : ""} &rarr; 1]
                  </span>

                  <div className="flex items-center gap-2">
                    <select
                      value={hidden1Size}
                      onChange={(e) => setHidden1Size(Number(e.target.value))}
                      className="px-2 py-1 bg-card border border-border rounded-lg text-xs font-bold text-foreground cursor-pointer"
                    >
                      <option value={3}>H1: 3 Nodes</option>
                      <option value={4}>H1: 4 Nodes</option>
                      <option value={6}>H1: 6 Nodes</option>
                      <option value={8}>H1: 8 Nodes</option>
                    </select>

                    <select
                      value={hidden2Size}
                      onChange={(e) => setHidden2Size(Number(e.target.value))}
                      className="px-2 py-1 bg-card border border-border rounded-lg text-xs font-bold text-foreground cursor-pointer"
                    >
                      <option value={0}>H2: Off</option>
                      <option value={3}>H2: 3 Nodes</option>
                      <option value={4}>H2: 4 Nodes</option>
                      <option value={6}>H2: 6 Nodes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right: Decision Boundary Contour Map */}
              <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Crosshair size={14} className="text-purple-500" />
                    <h3 className="text-sm font-bold text-foreground">
                      2D Decision Boundary Contour Surface
                    </h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Click to probe coordinates
                  </span>
                </div>

                <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-border cursor-crosshair">
                  <canvas
                    ref={decisionCanvasRef}
                    width={360}
                    height={360}
                    onClick={handleDecisionMapClick}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Live Coordinate Probe */}
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {"Probe Point x = (x₁, x₂)"}
                    </div>
                    <div className="font-mono text-xs font-bold text-foreground mt-0.5">
                      {"x₁: "} {probePoint.x} &bull; {"x₂: "} {probePoint.y}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      {"Inference ŷ = P(Y=1|x)"}
                    </div>
                    <div
                      className={`font-mono text-sm font-black ${
                        probeOutput >= 0.5 ? "text-cyan-500" : "text-orange-500"
                      }`}
                    >
                      {(probeOutput * 100).toFixed(1)}% &rarr; Class {probeOutput >= 0.5 ? "1" : "0"}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Metrics Dashboard & Loss Graph */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Dual Loss Chart */}
              <div className="lg:col-span-6 bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <TrendingDown size={14} className="text-rose-500" />
                    <h4 className="text-xs font-bold text-foreground">
                      Loss Convergence (Train vs. Validation Test Set)
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono font-bold">
                    <span className="text-rose-500">&mdash; Train Loss</span>
                    <span className="text-cyan-500">&mdash; Test Loss</span>
                  </div>
                </div>

                <div className="w-full h-40 bg-slate-950 rounded-xl overflow-hidden p-2 border border-border">
                  <canvas ref={lossCanvasRef} width={450} height={150} className="w-full h-full" />
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-muted/40 rounded-xl">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold block">Epoch</span>
                    <span className="font-mono font-bold">{epoch}</span>
                  </div>
                  <div className="p-2 bg-muted/40 rounded-xl">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold block">Train Loss</span>
                    <span className="font-mono font-bold text-rose-500">{trainLoss.toFixed(4)}</span>
                  </div>
                  <div className="p-2 bg-muted/40 rounded-xl">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold block">Test Loss</span>
                    <span className="font-mono font-bold text-cyan-500">{testLoss.toFixed(4)}</span>
                  </div>
                  <div className="p-2 bg-muted/40 rounded-xl">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold block">Test Acc</span>
                    <span className="font-mono font-bold text-emerald-500">{testAcc}%</span>
                  </div>
                </div>
              </div>

              {/* Confusion Matrix & Classification Metrics */}
              <div className="lg:col-span-6 bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <h4 className="text-xs font-bold text-foreground">
                      Classification Confusion Matrix &amp; F1 Metrics
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">Test Partition (N={datasetRef.current.test.length})</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 2x2 Matrix */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-1.5 text-center font-mono text-xs font-bold">
                      <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
                        <span className="text-[9px] text-muted-foreground block">True Pos (TP)</span>
                        <span className="text-emerald-500 text-sm">{metrics.tp}</span>
                      </div>
                      <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl">
                        <span className="text-[9px] text-muted-foreground block">False Pos (FP)</span>
                        <span className="text-rose-500 text-sm">{metrics.fp}</span>
                      </div>
                      <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl">
                        <span className="text-[9px] text-muted-foreground block">False Neg (FN)</span>
                        <span className="text-rose-500 text-sm">{metrics.fn}</span>
                      </div>
                      <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
                        <span className="text-[9px] text-muted-foreground block">True Neg (TN)</span>
                        <span className="text-emerald-500 text-sm">{metrics.tn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="space-y-2 flex flex-col justify-center">
                    <div className="flex justify-between items-center p-2 bg-muted/40 rounded-xl text-xs font-bold">
                      <span className="text-muted-foreground">Precision:</span>
                      <span className="font-mono text-foreground">{metrics.precision}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/40 rounded-xl text-xs font-bold">
                      <span className="text-muted-foreground">Recall:</span>
                      <span className="font-mono text-foreground">{metrics.recall}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/40 rounded-xl text-xs font-bold">
                      <span className="text-muted-foreground">F1 Score:</span>
                      <span className="font-mono text-emerald-500">{metrics.f1}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── TAB 2: Weight Matrix & Gradient Tensor Inspector ── */}
        {activeTab === "matrices" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-foreground">
                  Synaptic Weight Matrix W^[l] &amp; Gradient Tensor &nabla;W L
                </h3>
                <p className="text-xs text-muted-foreground">
                  Inspect raw numerical floating-point tensor matrices and backpropagated derivatives per layer.
                </p>
              </div>

              {/* Layer Tab Switcher */}
              <div className="flex items-center gap-1.5">
                {networkRef.current.slice(1).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedLayerIndex(idx + 1)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedLayerIndex === idx + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Layer {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {networkRef.current[selectedLayerIndex] && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weight Matrix Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">
                    Weight Tensor W^[{selectedLayerIndex}] ({networkRef.current[selectedLayerIndex].size} &times; {networkRef.current[selectedLayerIndex - 1].size})
                  </span>
                  <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-border">
                    <table className="w-full text-center font-mono text-xs text-slate-200">
                      <tbody>
                        {networkRef.current[selectedLayerIndex].weights.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-white/5">
                            <td className="p-2 text-[10px] text-muted-foreground font-bold">Neuron {rIdx + 1}</td>
                            {row.map((val, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-2 font-bold ${
                                  val >= 0 ? "text-cyan-400" : "text-orange-400"
                                }`}
                              >
                                {val.toFixed(4)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Gradient Tensor Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                    Gradient Tensor &part;L / &part;W^[{selectedLayerIndex}]
                  </span>
                  <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-border">
                    <table className="w-full text-center font-mono text-xs text-slate-200">
                      <tbody>
                        {networkRef.current[selectedLayerIndex].weightGradients.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-white/5">
                            <td className="p-2 text-[10px] text-muted-foreground font-bold">Neuron {rIdx + 1}</td>
                            {row.map((val, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-2 font-bold ${
                                  Math.abs(val) > 0.01 ? "text-rose-400 font-black" : "text-slate-400"
                                }`}
                              >
                                {(val / Math.max(1, datasetRef.current.train.length)).toFixed(5)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── TAB 3: Theory & Matrix Calculus Formulary ── */}
        {activeTab === "theory" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-foreground">
                Mathematical Foundations: Matrix Vector Calculus &amp; Backpropagation
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Formal mathematical derivation of Multilayer Perceptrons and gradient descent optimization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Forward Propagation */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  <Cpu size={16} />
                  <span>1. Forward Propagation Equations</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 space-y-1.5 border border-border">
                  <div>{"z^[l] = W^[l] · a^[l-1] + b^[l]"}</div>
                  <div>{"a^[l] = σ(z^[l])"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"Where W^[l] ∈ R^(n_l × n_{l-1}) is the weight matrix, b^[l] ∈ R^(n_l) is the bias vector, and σ(·) is the element-wise activation function."}
                </p>
              </div>

              {/* 2. Loss Functions */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                  <TrendingDown size={16} />
                  <span>2. Loss Function L(y, ŷ)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-rose-300 space-y-1.5 border border-border">
                  <div>{"L_BCE = -1/N ∑ [ y_i ln(ŷ_i) + (1 - y_i) ln(1 - ŷ_i) ]"}</div>
                  <div>{"J(W, b) = L_BCE + (λ / 2N) ∑ ||W^[l]||_F^2"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {"Binary Cross-Entropy models Bernoulli likelihood distributions with optional L2 Frobenius norm regularization (λ)."}
                </p>
              </div>

              {/* 3. Output Layer Error Delta */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                  <Zap size={16} />
                  <span>3. Output Layer Delta (δ^[L])</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 space-y-1.5 border border-border">
                  <div>{"δ^[L] = ∇_a^[L] L ⊙ σ'(z^[L]) = ŷ - y"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Combining BCE with the Logistic Sigmoid derivative yields the canonical simplified error vector without numerical saturation.
                </p>
              </div>

              {/* 4. Hidden Layer Recursive Backprop */}
              <div className="p-5 bg-muted/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <RotateCcw size={16} />
                  <span>4. Recursive Chain Rule Error Propagation</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5 border border-border">
                  <div>{"δ^[l] = ((W^[l+1])^T · δ^[l+1]) ⊙ σ'(z^[l])"}</div>
                  <div>{"∂L / ∂W^[l] = δ^[l] · (a^[l-1])^T,    ∂L / ∂b^[l] = δ^[l]"}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Error gradients propagate recursively backwards through transposed synaptic matrices to compute partial weight derivatives.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── TAB 4: Vanishing Gradient Diagnostics ── */}
        {activeTab === "diagnostics" && (
          <section className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-foreground">
                  Gradient Magnitude &amp; Vanishing Gradient Diagnostics
                </h3>
                <p className="text-xs text-muted-foreground">
                  {"Monitor gradient norm ||∇_W L||_2 across deep layers to identify saturation and instability."}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase border ${
                  gradientHealth === "healthy"
                    ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                    : gradientHealth === "vanishing"
                    ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                    : "bg-rose-500/15 text-rose-500 border-rose-500/30"
                }`}
              >
                Gradient Status: {gradientHealth.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Gradient L2 Norm</span>
                <span className="text-2xl font-black font-mono text-foreground">{gradientNorm.toFixed(6)}</span>
                <p className="text-[10px] text-muted-foreground">
                  Average gradient vector length across all synaptic connections.
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Active Activation</span>
                <span className="text-2xl font-black font-mono text-indigo-500 uppercase">{activation}</span>
                <p className="text-[10px] text-muted-foreground">
                  {activation === "sigmoid"
                    ? "Sigmoid derivative max is 0.25, causing exponential vanishing in deep nets."
                    : activation === "relu"
                    ? "ReLU gradient is exactly 1.0 for positive inputs, preventing gradient vanishing."
                    : "Zero-centered activations maintain stable gradient variance."}
                </p>
              </div>

              <div className="p-5 bg-muted/40 border border-border rounded-2xl text-center space-y-2">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Optimizer State</span>
                <span className="text-2xl font-black font-mono text-emerald-500 uppercase">{optimizer}</span>
                <p className="text-[10px] text-muted-foreground">
                  {optimizer === "adam"
                    ? "Adam scales gradients by running root mean square variance (v_t)."
                    : "Momentum accelerates descent through saddle point plateaus."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Student Mastery Milestones ── */}
        <section className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              <h4 className="text-sm font-bold text-foreground">
                Deep Learning Mastery Objectives
              </h4>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-500">+50 XP Per Milestone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                id: "trainedXor",
                label: "Solve Minsky-Papert XOR Barrier",
                desc: "Prove non-linear separability by training hidden layer activations to >90% accuracy.",
                done: milestones.trainedXor,
              },
              {
                id: "highAccuracy",
                label: "Attain 92% Boundary Convergence",
                desc: "Tune learning rate (η) and loss optimization to converge on complex datasets.",
                done: milestones.highAccuracy,
              },
              {
                id: "testedDeepNet",
                label: "Deploy Deep Multi-Layer Topology",
                desc: "Configure 2 or more hidden layers for hierarchical feature representation.",
                done: milestones.testedDeepNet,
              },
              {
                id: "testedAdam",
                label: "Implement Adaptive Momentum (Adam)",
                desc: "Switch from standard SGD to Adam optimizer with exponential second moments.",
                done: milestones.testedAdam,
              },
              {
                id: "analyzedGradients",
                label: "Inspect Weight Tensors & Jacobian",
                desc: "Analyze matrix derivatives and vanishing gradient diagnostics.",
                done: milestones.analyzedGradients,
              },
              {
                id: "probedPoint",
                label: "Probe 2D Non-Linear Coordinate Space",
                desc: "Sample decision boundary coordinates and verify forward propagation outputs.",
                done: milestones.probedPoint,
              },
            ].map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition ${
                  m.done
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                    : "bg-muted/30 border-border text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2
                    size={14}
                    className={m.done ? "text-emerald-500" : "text-muted-foreground/40"}
                  />
                  <span className={m.done ? "text-emerald-600 dark:text-emerald-400" : ""}>
                    {m.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Daily Challenge Integration */}
        <DailyChallengeCard
          labId="computer-science/ai-problem/neural-network"
          currentParams={{
            accuracy: testAcc,
            loss: trainLoss,
            epoch,
            learningRate,
            activation,
            optimizer,
            datasetType,
            hidden1Size,
            hidden2Size,
          }}
        />
      </main>
    </div>
  );
}
