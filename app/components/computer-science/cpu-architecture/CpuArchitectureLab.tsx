"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import {
  Cpu,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Lightbulb,
  Play,
  Pause,
  ArrowRight,
  Zap,
  BookOpen,
  FastForward,
  Terminal,
  Database,
  Binary,
  Activity,
  Code2,
  Edit3,
  CornerDownLeft,
  Radio,
  Share2,
} from "lucide-react";

export interface I8085Registers {
  A: number;   // 8-bit Accumulator
  B: number;   // 8-bit Register B
  C: number;   // 8-bit Register C
  D: number;   // 8-bit Register D
  E: number;   // 8-bit Register E
  H: number;   // 8-bit High Memory Pointer
  L: number;   // 8-bit Low Memory Pointer
  SP: number;  // 16-bit Stack Pointer
  PC: number;  // 16-bit Program Counter
  TR: number;  // 8-bit Temporary Register
  IR: number;  // 8-bit Instruction Register
}

export interface I8085Flags {
  S: boolean;   // Sign flag
  Z: boolean;   // Zero flag
  AC: boolean;  // Auxiliary Carry flag
  P: boolean;   // Parity flag (even parity = true)
  CY: boolean;  // Carry flag
}

export interface I8085ControlSignals {
  RD: boolean;
  WR: boolean;
  ALE: boolean;
  IOM: boolean;   // 1 = I/O, 0 = Memory
  S0: boolean;
  S1: boolean;
  CLK_OUT: boolean;
  RESET_OUT: boolean;
  HLDA: boolean;
}

export const PRESET_8085_PROGRAMS = [
  {
    id: "add_registers",
    name: "1. Addition & Flags (MVI, ADD, DCR)",
    desc: "Load A=0x25, B=0x15, Add B to A, check CY & Z flags",
    instructions: [
      "MVI A, 25H",
      "MVI B, 15H",
      "ADD B",
      "MOV C, A",
      "DCR C",
      "HLT",
    ],
  },
  {
    id: "hl_memory",
    name: "2. Memory Pointer HL Transfer (MVI, MOV M, A)",
    desc: "Load HL with address 0x000A, store A into RAM[HL]",
    instructions: [
      "MVI H, 00H",
      "MVI L, 0AH",
      "MVI A, 7FH",
      "MOV M, A",
      "INR L",
      "MVI A, 80H",
      "MOV M, A",
      "HLT",
    ],
  },
  {
    id: "logic_ops",
    name: "3. Logical Operations (ANA, XRA, ORA)",
    desc: "Bitwise logic test: AND, XOR, and OR with Register D",
    instructions: [
      "MVI A, F0H",
      "MVI D, 0FH",
      "ANA D",
      "MVI A, AAH",
      "XRA D",
      "ORA D",
      "HLT",
    ],
  },
  {
    id: "sub_carry",
    name: "4. Subtraction & Borrow (MVI, SUB, SBB)",
    desc: "Subtract B from A and examine Sign (S) and Carry (CY) borrow",
    instructions: [
      "MVI A, 10H",
      "MVI B, 20H",
      "SUB B",
      "HLT",
    ],
  },
];

export default function CpuArchitectureLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "computer-science/cpu-architecture",
    "computer-science",
    "simulation"
  );

  // Execution & Clock Speed
  const [clockSpeedHz, setClockSpeedHz] = useState<number>(2);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isHalted, setIsHalted] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("add_registers");

  // User Custom Command Line Input
  const [customInputCmd, setCustomInputCmd] = useState<string>("");
  const [historyLog, setHistoryLog] = useState<string[]>([
    "8085 Microprocessor Architecture Ready. Enter instructions or select presets.",
  ]);

  // Program Instruction Memory (Assembly Lines)
  const [programList, setProgramList] = useState<string[]>([...PRESET_8085_PROGRAMS[0].instructions]);

  // ─── 8085 HARDWARE REGISTERS ──────────────────────────────────────
  const [regs, setRegs] = useState<I8085Registers>({
    A: 0x25,
    B: 0x15,
    C: 0x00,
    D: 0x0f,
    E: 0x00,
    H: 0x00,
    L: 0x0a,
    SP: 0x00ff,
    PC: 0x0000,
    TR: 0x15,
    IR: 0x80,
  });

  // ─── 8085 FLAGS (S, Z, AC, P, CY) ─────────────────────────────────
  const [flags, setFlags] = useState<I8085Flags>({
    S: false,
    Z: false,
    AC: false,
    P: true,
    CY: false,
  });

  // ─── 8085 TIMING & CONTROL SIGNALS ───────────────────────────────
  const [control, setControl] = useState<I8085ControlSignals>({
    RD: true,
    WR: false,
    ALE: true,
    IOM: false, // Memory mode
    S0: true,
    S1: true,
    CLK_OUT: true,
    RESET_OUT: false,
    HLDA: false,
  });

  // ─── 8085 INTERRUPT & SERIAL PINS ─────────────────────────────────
  const [trapPin, setTrapPin] = useState<boolean>(false);
  const [rst75Pin, setRst75Pin] = useState<boolean>(false);
  const [intrPin, setIntrPin] = useState<boolean>(false);
  const [sidBit, setSidBit] = useState<number>(0);
  const [sodBit, setSodBit] = useState<number>(0);

  // ─── 16-BYTE RAM MEMORY (0x0000 to 0x000F) ────────────────────────
  const [ram, setRam] = useState<number[]>([
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x7f, 0x80,
    0x00, 0x00, 0x00, 0x00,
  ]);

  // Current active data bus value & machine cycle state
  const [internalBusVal, setInternalBusVal] = useState<number>(0x25);
  const [machineCycle, setMachineCycle] = useState<string>("M1: Opcode Fetch (T1-T4)");

  // Compute parity of an 8-bit number
  const computeParity = (num: number) => {
    let ones = 0;
    for (let i = 0; i < 8; i++) {
      if ((num >> i) & 1) ones++;
    }
    return ones % 2 === 0;
  };

  // Execute a single Assembly Instruction
  const executeInstruction = (cmdStr: string) => {
    const raw = cmdStr.trim().toUpperCase();
    if (!raw || raw.startsWith("//")) return;

    const parts = raw.split(/[\s,]+/);
    const op = parts[0];
    const arg1 = parts[1];
    const arg2 = parts[2];

    const parseHex = (valStr: string) => {
      if (!valStr) return 0;
      const clean = valStr.replace(/H$/, "");
      return parseInt(clean, 16) || 0;
    };

    setRegs((prev) => {
      let a = prev.A;
      let b = prev.B;
      let c = prev.C;
      let d = prev.D;
      let e = prev.E;
      let h = prev.H;
      let l = prev.L;
      let sp = prev.SP;
      let pc = (prev.PC + 1) & 0xffff;
      let tr = prev.TR;
      let ir = prev.IR;

      let bus = a;
      let cy = flags.CY;
      let z = flags.Z;
      let s = flags.S;
      let p = flags.P;
      let ac = flags.AC;
      let mCycle = "M1: Opcode Fetch";

      // HL Memory Pointer Address
      const hlAddr = (h << 8) | l;
      const ramHL = ram[hlAddr % 16] || 0;

      // ─── 1. DATA TRANSFER INSTRUCTIONS ─────────────────────────────
      if (op === "MVI") {
        const val = parseHex(arg2) & 0xff;
        bus = val;
        mCycle = "M2: Memory Read (Immediate Byte)";
        if (arg1 === "A") a = val;
        else if (arg1 === "B") b = val;
        else if (arg1 === "C") c = val;
        else if (arg1 === "D") d = val;
        else if (arg1 === "E") e = val;
        else if (arg1 === "H") h = val;
        else if (arg1 === "L") l = val;
        else if (arg1 === "M") {
          setRam((prevRam) => {
            const nr = [...prevRam];
            nr[hlAddr % 16] = val;
            return nr;
          });
        }
      } else if (op === "MOV") {
        let srcVal = 0;
        if (arg2 === "A") srcVal = a;
        else if (arg2 === "B") srcVal = b;
        else if (arg2 === "C") srcVal = c;
        else if (arg2 === "D") srcVal = d;
        else if (arg2 === "E") srcVal = e;
        else if (arg2 === "H") srcVal = h;
        else if (arg2 === "L") srcVal = l;
        else if (arg2 === "M") srcVal = ramHL;

        bus = srcVal;
        mCycle = "M1: Register Move Transfer";

        if (arg1 === "A") a = srcVal;
        else if (arg1 === "B") b = srcVal;
        else if (arg1 === "C") c = srcVal;
        else if (arg1 === "D") d = srcVal;
        else if (arg1 === "E") e = srcVal;
        else if (arg1 === "H") h = srcVal;
        else if (arg1 === "L") l = srcVal;
        else if (arg1 === "M") {
          setRam((prevRam) => {
            const nr = [...prevRam];
            nr[hlAddr % 16] = srcVal;
            return nr;
          });
        }
      } else if (op === "XCHG") {
        // Exchange DE with HL
        const tempH = h;
        const tempL = l;
        h = d;
        l = e;
        d = tempH;
        e = tempL;
        mCycle = "M1: Internal Register Pair Swap";
      }

      // ─── 2. ARITHMETIC INSTRUCTIONS ────────────────────────────────
      else if (op === "ADD" || op === "ADC") {
        let operand = b;
        if (arg1 === "B") operand = b;
        else if (arg1 === "C") operand = c;
        else if (arg1 === "D") operand = d;
        else if (arg1 === "E") operand = e;
        else if (arg1 === "H") operand = h;
        else if (arg1 === "L") operand = l;
        else if (arg1 === "M") operand = ramHL;
        else if (arg1 === "A") operand = a;

        tr = operand;
        const carryIn = op === "ADC" && cy ? 1 : 0;
        const sum = a + operand + carryIn;

        cy = sum > 0xff;
        a = sum & 0xff;
        z = a === 0;
        s = (a & 0x80) !== 0;
        p = computeParity(a);
        ac = ((prev.A & 0x0f) + (operand & 0x0f) + carryIn) > 0x0f;
        bus = a;
        mCycle = "M1: ALU Addition Compute";
      } else if (op === "SUB" || op === "SBB") {
        let operand = b;
        if (arg1 === "B") operand = b;
        else if (arg1 === "C") operand = c;
        else if (arg1 === "D") operand = d;
        else if (arg1 === "E") operand = e;
        else if (arg1 === "H") operand = h;
        else if (arg1 === "L") operand = l;
        else if (arg1 === "M") operand = ramHL;
        else if (arg1 === "A") operand = a;

        tr = operand;
        const borrowIn = op === "SBB" && cy ? 1 : 0;
        const diff = a - operand - borrowIn;

        cy = diff < 0;
        a = (diff + 256) & 0xff;
        z = a === 0;
        s = (a & 0x80) !== 0;
        p = computeParity(a);
        bus = a;
        mCycle = "M1: ALU Subtraction Compute";
      } else if (op === "INR") {
        let res = 0;
        if (arg1 === "A") a = (a + 1) & 0xff, res = a;
        else if (arg1 === "B") b = (b + 1) & 0xff, res = b;
        else if (arg1 === "C") c = (c + 1) & 0xff, res = c;
        else if (arg1 === "D") d = (d + 1) & 0xff, res = d;
        else if (arg1 === "E") e = (e + 1) & 0xff, res = e;
        else if (arg1 === "H") h = (h + 1) & 0xff, res = h;
        else if (arg1 === "L") l = (l + 1) & 0xff, res = l;
        else if (arg1 === "M") {
          res = (ramHL + 1) & 0xff;
          setRam((prevRam) => {
            const nr = [...prevRam];
            nr[hlAddr % 16] = res;
            return nr;
          });
        }
        z = res === 0;
        s = (res & 0x80) !== 0;
        p = computeParity(res);
        bus = res;
        mCycle = "M1: Increment Register";
      } else if (op === "DCR") {
        let res = 0;
        if (arg1 === "A") a = (a - 1 + 256) & 0xff, res = a;
        else if (arg1 === "B") b = (b - 1 + 256) & 0xff, res = b;
        else if (arg1 === "C") c = (c - 1 + 256) & 0xff, res = c;
        else if (arg1 === "D") d = (d - 1 + 256) & 0xff, res = d;
        else if (arg1 === "E") e = (e - 1 + 256) & 0xff, res = e;
        else if (arg1 === "H") h = (h - 1 + 256) & 0xff, res = h;
        else if (arg1 === "L") l = (l - 1 + 256) & 0xff, res = l;
        else if (arg1 === "M") {
          res = (ramHL - 1 + 256) & 0xff;
          setRam((prevRam) => {
            const nr = [...prevRam];
            nr[hlAddr % 16] = res;
            return nr;
          });
        }
        z = res === 0;
        s = (res & 0x80) !== 0;
        p = computeParity(res);
        bus = res;
        mCycle = "M1: Decrement Register";
      }

      // ─── 3. LOGICAL INSTRUCTIONS ───────────────────────────────────
      else if (op === "ANA") {
        let operand = b;
        if (arg1 === "B") operand = b;
        else if (arg1 === "C") operand = c;
        else if (arg1 === "D") operand = d;
        else if (arg1 === "E") operand = e;
        else if (arg1 === "H") operand = h;
        else if (arg1 === "L") operand = l;

        a = a & operand;
        cy = false;
        z = a === 0;
        s = (a & 0x80) !== 0;
        p = computeParity(a);
        bus = a;
        mCycle = "M1: Bitwise AND";
      } else if (op === "ORA") {
        let operand = b;
        if (arg1 === "B") operand = b;
        else if (arg1 === "C") operand = c;
        else if (arg1 === "D") operand = d;
        else if (arg1 === "E") operand = e;
        else if (arg1 === "H") operand = h;
        else if (arg1 === "L") operand = l;

        a = a | operand;
        cy = false;
        z = a === 0;
        s = (a & 0x80) !== 0;
        p = computeParity(a);
        bus = a;
        mCycle = "M1: Bitwise OR";
      } else if (op === "XRA") {
        let operand = b;
        if (arg1 === "B") operand = b;
        else if (arg1 === "C") operand = c;
        else if (arg1 === "D") operand = d;
        else if (arg1 === "E") operand = e;
        else if (arg1 === "H") operand = h;
        else if (arg1 === "L") operand = l;

        a = a ^ operand;
        cy = false;
        z = a === 0;
        s = (a & 0x80) !== 0;
        p = computeParity(a);
        bus = a;
        mCycle = "M1: Bitwise XOR";
      } else if (op === "CMA") {
        // Complement Accumulator (~A)
        a = (~a) & 0xff;
        bus = a;
        mCycle = "M1: One's Complement";
      }

      // ─── 4. SERIAL & SYSTEM ────────────────────────────────────────
      else if (op === "SIM") {
        // Set Interrupt Mask / Serial Output
        setSodBit((a >> 7) & 1);
        mCycle = "M1: Serial Output Latch";
      } else if (op === "RIM") {
        // Read Interrupt Mask / Serial Input
        a = (a & 0x7f) | (sidBit << 7);
        mCycle = "M1: Serial Input Read";
      } else if (op === "HLT") {
        setIsHalted(true);
        setIsRunning(false);
        mCycle = "HALT State Acknowledged";
      }

      setFlags({ S: s, Z: z, AC: ac, P: p, CY: cy });
      setInternalBusVal(bus);
      setMachineCycle(mCycle);

      return {
        A: a,
        B: b,
        C: c,
        D: d,
        E: e,
        H: h,
        L: l,
        SP: sp,
        PC: pc,
        TR: tr,
        IR: raw.charCodeAt(0) || ir,
      };
    });

    setHistoryLog((prev) => [`> ${cmdStr}`, ...prev.slice(0, 7)]);
    completeExperiment();
  };

  // Step next instruction in current program list
  const stepProgram = () => {
    if (isHalted || programList.length === 0) return;
    const currentIdx = regs.PC % programList.length;
    const cmd = programList[currentIdx];
    executeInstruction(cmd);
  };

  // Clock Ticker Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isHalted) {
      interval = setInterval(() => {
        stepProgram();
      }, 1000 / clockSpeedHz);
    }
    return () => clearInterval(interval);
  }, [isRunning, isHalted, clockSpeedHz, regs.PC, programList]);

  // Load Preset
  const handleLoadPreset = (preset: typeof PRESET_8085_PROGRAMS[0]) => {
    setSelectedPresetId(preset.id);
    setIsRunning(false);
    setIsHalted(false);
    setProgramList([...preset.instructions]);
    setRegs({
      A: 0x25,
      B: 0x15,
      C: 0x00,
      D: 0x0f,
      E: 0x00,
      H: 0x00,
      L: 0x0a,
      SP: 0x00ff,
      PC: 0x0000,
      TR: 0x15,
      IR: 0x80,
    });
    setFlags({ S: false, Z: false, AC: false, P: true, CY: false });
    setHistoryLog([`Loaded ${preset.name}`]);
    completeExperiment();
  };

  // Direct Register Edit Handler
  const handleEditRegister = (regKey: keyof I8085Registers, newValStr: string) => {
    const val = parseInt(newValStr, 16);
    if (!isNaN(val)) {
      setRegs((prev) => ({
        ...prev,
        [regKey]: regKey === "SP" || regKey === "PC" ? val & 0xffff : val & 0xff,
      }));
    }
  };

  // AI Chat registration
  useEffect(() => {
    setExperimentData({
      title: "Intel 8085 Microprocessor Hardware Architecture Studio",
      theory: "Complete 8085 microprocessor hardware architecture: ALU, Accumulator, Temporary Register, 5-bit Flag flip-flops (S, Z, AC, P, CY), General Purpose Register Array (B, C, D, E, H, L, HL memory pointer), Stack Pointer (SP), Program Counter (PC), Timing and Control Unit (RD, WR, ALE, IO/M, S0, S1), Interrupt Controller (TRAP, RST 7.5, RST 6.5, RST 5.5, INTR), and Serial I/O (SID, SOD).",
      extraContext: { regs, flags, machineCycle, isHalted, ramHL: ram[((regs.H << 8) | regs.L) % 16] },
    });
  }, [regs, flags, machineCycle, isHalted, ram, setExperimentData]);

  const hlAddr = ((regs.H << 8) | regs.L) & 0xffff;

  return (
    <div className="w-full p-2.5 sm:p-4 bg-background text-foreground space-y-2.5 max-w-7xl mx-auto">
      {/* ─── 1. TOP HEADER & INTERACTIVE COMMAND INJECTOR ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-card border border-border rounded-2xl p-2.5 sm:px-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <Cpu size={18} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-foreground tracking-tight leading-none">
              Intel 8085 Microprocessor Architecture Studio
            </h1>
            <span className="text-[10px] text-muted-foreground font-medium">
              Hardware Register Array &bull; ALU Subsystem &bull; Control Matrix &bull; Interrupts &bull; Serial I/O
            </span>
          </div>
        </div>

        {/* Master Execution Controls & Clock Speed */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Selector */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
            {PRESET_8085_PROGRAMS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleLoadPreset(p)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all truncate max-w-[130px] ${
                  selectedPresetId === p.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.name.split(" ")[1] || p.name}
              </button>
            ))}
          </div>

          {/* Clock Speed Slider */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-muted/60 border border-border rounded-xl font-mono text-[10px]">
            <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`} />
            <span className="font-bold text-amber-500 min-w-[34px]">{clockSpeedHz}Hz</span>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={clockSpeedHz}
              onChange={(e) => setClockSpeedHz(parseFloat(e.target.value))}
              className="w-16 h-1 bg-background rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Step / Run Controls */}
          <button
            onClick={() => {
              setIsRunning(!isRunning);
              completeExperiment();
            }}
            className="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            {isRunning ? <Pause size={13} className="fill-current" /> : <Play size={13} className="fill-current" />}
            <span>{isRunning ? "Pause" : "Run"}</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              stepProgram();
            }}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            Single Step
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setIsHalted(false);
              setRegs({
                A: 0x25,
                B: 0x15,
                C: 0x00,
                D: 0x0f,
                E: 0x00,
                H: 0x00,
                L: 0x0a,
                SP: 0x00ff,
                PC: 0x0000,
                TR: 0x15,
                IR: 0x80,
              });
              setFlags({ S: false, Z: false, AC: false, P: true, CY: false });
            }}
            className="p-1.5 bg-card hover:bg-accent border border-border rounded-xl text-muted-foreground hover:text-foreground"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* ─── 2. LIVE INTERACTIVE ASSEMBLY INSTRUCTION INJECTOR ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 px-3 bg-muted/40 border border-border rounded-2xl text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <Terminal size={14} className="text-amber-500 shrink-0" />
          <span className="font-bold font-mono text-[11px] text-muted-foreground shrink-0">Enter Custom 8085 Opcode:</span>
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              placeholder="e.g. MVI A, 45H or ADD B or MOV M, A"
              value={customInputCmd}
              onChange={(e) => setCustomInputCmd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customInputCmd.trim()) {
                  executeInstruction(customInputCmd);
                  setCustomInputCmd("");
                }
              }}
              className="flex-1 px-2.5 py-1 bg-slate-950 text-amber-400 font-mono text-xs rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={() => {
                if (customInputCmd.trim()) {
                  executeInstruction(customInputCmd);
                  setCustomInputCmd("");
                }
              }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-xl transition flex items-center gap-1 shrink-0"
            >
              <span>Execute</span>
              <CornerDownLeft size={12} />
            </button>
          </div>
        </div>

        {/* Machine Cycle Status */}
        <div className="flex items-center gap-2 font-mono text-[10px] shrink-0">
          <span className="text-muted-foreground font-bold">Status:</span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-border font-black text-amber-400">
            {machineCycle}
          </span>
        </div>
      </div>

      {/* ─── 3. COMPLETE 8085 HARDWARE ARCHITECTURE BLOCK DIAGRAM ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
        {/* ─── LEFT: ALU, ACCUMULATOR, TR, FLAGS (4 cols) ─── */}
        <div className="lg:col-span-4 flex flex-col space-y-2">
          {/* Interrupt & Serial I/O Header */}
          <div className="grid grid-cols-2 gap-2">
            {/* Interrupt Control */}
            <div className="p-2 bg-card border border-border rounded-2xl space-y-1">
              <span className="text-[9px] font-black uppercase text-rose-500 block">Interrupt Control</span>
              <div className="flex gap-1 font-mono text-[8px]">
                <button
                  onClick={() => setTrapPin(!trapPin)}
                  className={`px-1.5 py-0.5 rounded border transition-all ${
                    trapPin ? "bg-rose-500 text-white font-bold" : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  TRAP
                </button>
                <button
                  onClick={() => setRst75Pin(!rst75Pin)}
                  className={`px-1.5 py-0.5 rounded border transition-all ${
                    rst75Pin ? "bg-rose-500 text-white font-bold" : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  RST 7.5
                </button>
                <button
                  onClick={() => setIntrPin(!intrPin)}
                  className={`px-1.5 py-0.5 rounded border transition-all ${
                    intrPin ? "bg-rose-500 text-white font-bold" : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  INTR
                </button>
              </div>
            </div>

            {/* Serial I/O Control */}
            <div className="p-2 bg-card border border-border rounded-2xl space-y-1">
              <span className="text-[9px] font-black uppercase text-indigo-500 block">Serial I/O Control</span>
              <div className="flex justify-between font-mono text-[9px] px-1 pt-0.5">
                <button
                  onClick={() => setSidBit(sidBit === 1 ? 0 : 1)}
                  className="text-indigo-400 font-bold hover:underline"
                >
                  SID (In): {sidBit}
                </button>
                <span className="text-muted-foreground">SOD (Out): {sodBit}</span>
              </div>
            </div>
          </div>

          {/* Accumulator (Reg A) */}
          <div className="p-2.5 bg-card border border-border rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-foreground flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-sky-500/10 text-sky-500 text-[9px] flex items-center justify-center font-bold">A</span>
                Accumulator (8-Bit)
              </span>
              <span className="text-[8px] font-mono text-muted-foreground uppercase">Direct ALU Input</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded-xl border border-border/80 font-mono text-xs">
              <span className="text-slate-400 text-[10px]">Value:</span>
              <div className="flex items-center gap-1">
                <span className="text-sky-400 font-black text-sm">0x{regs.A.toString(16).toUpperCase().padStart(2, "0")}</span>
                <span className="text-[10px] text-slate-500">({regs.A})</span>
                <input
                  type="text"
                  placeholder="Hex"
                  maxLength={2}
                  onBlur={(e) => handleEditRegister("A", e.target.value)}
                  className="w-8 px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-[10px] text-sky-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Temporary Register (TR) */}
          <div className="p-2 bg-card border border-border rounded-2xl space-y-1 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-foreground flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-500/10 text-amber-500 text-[8px] flex items-center justify-center font-bold">TR</span>
                Temporary Register (8-Bit)
              </span>
              <span className="text-amber-400 font-mono font-black text-xs">0x{regs.TR.toString(16).toUpperCase().padStart(2, "0")}</span>
            </div>
          </div>

          {/* Flags Register Flip-Flops (S, Z, AC, P, CY) */}
          <div className="p-2.5 bg-card border border-border rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-foreground">Status Flags (5 Flip-Flops)</span>
              <span className="text-[8px] font-mono text-muted-foreground">Click to Toggle</span>
            </div>

            <div className="grid grid-cols-5 gap-1 font-mono text-center">
              {[
                { label: "S", name: "Sign", val: flags.S, key: "S" },
                { label: "Z", name: "Zero", val: flags.Z, key: "Z" },
                { label: "AC", name: "Aux", val: flags.AC, key: "AC" },
                { label: "P", name: "Parity", val: flags.P, key: "P" },
                { label: "CY", name: "Carry", val: flags.CY, key: "CY" },
              ].map((f) => (
                <button
                  key={f.label}
                  onClick={() => setFlags((prev) => ({ ...prev, [f.key]: !prev[f.key as keyof I8085Flags] }))}
                  className={`p-1 rounded-xl border text-[9px] transition-all ${
                    f.val
                      ? "bg-amber-500 text-black border-amber-400 font-black shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  <div className="font-bold">{f.label}</div>
                  <div className="text-[8px] opacity-80">{f.val ? "1" : "0"}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 8-Bit ALU */}
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-emerald-400 uppercase">Arithmetic Logic Unit (ALU)</span>
              <span className="text-[9px] font-mono text-emerald-500">8-Bit Parallel</span>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded-xl border border-emerald-500/40 font-mono text-xs">
              <span className="text-slate-400 text-[10px]">Computation:</span>
              <span className="text-emerald-400 font-black">
                A ({regs.A}) &bull; TR ({regs.TR})
              </span>
            </div>
          </div>
        </div>

        {/* ─── CENTER: INTERNAL 8-BIT BUS & TIMING/CONTROL (3 cols) ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-between p-2.5 bg-slate-950 border border-border rounded-2xl shadow-inner relative space-y-2">
          <div className="text-center z-10">
            <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider block">Internal 8-Bit Data Bus</span>
            <span className="text-[8px] font-mono text-slate-400">Bidirectional Data Trunk</span>
          </div>

          {/* Instruction Register & Decoder */}
          <div className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-[9px] font-bold text-purple-400 uppercase block">Instruction Reg (IR)</span>
            <span className="text-xs font-black font-mono text-purple-300">
              0x{regs.IR.toString(16).toUpperCase().padStart(2, "0")}
            </span>
            <span className="text-[8px] font-mono text-slate-400 block">Machine Decoder Ready</span>
          </div>

          {/* Timing & Control Unit Box */}
          <div className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-[9px] font-mono">
            <span className="font-black text-amber-400 uppercase block text-center">Timing &amp; Control</span>
            <div className="grid grid-cols-2 gap-1 text-slate-300">
              <span className={control.RD ? "text-emerald-400 font-bold" : ""}>RD: {control.RD ? "0" : "1"}</span>
              <span className={control.WR ? "text-rose-400 font-bold" : ""}>WR: {control.WR ? "0" : "1"}</span>
              <span className={control.ALE ? "text-amber-400 font-bold" : ""}>ALE: {control.ALE ? "1" : "0"}</span>
              <span>IO/M: {control.IOM ? "IO" : "MEM"}</span>
              <span>S0: {control.S0 ? "1" : "0"}</span>
              <span>S1: {control.S1 ? "1" : "0"}</span>
            </div>
          </div>

          {/* Bus State Indicator */}
          <div className="z-10 bg-slate-900 border border-slate-800 py-1 px-2 rounded-xl text-center w-full">
            <span className="text-[8px] text-slate-400 block font-bold uppercase">Bus Active Value:</span>
            <span className="text-xs font-black font-mono text-amber-400">
              0x{internalBusVal.toString(16).toUpperCase().padStart(2, "0")} ({internalBusVal})
            </span>
          </div>
        </div>

        {/* ─── RIGHT: REGISTER ARRAY (B,C, D,E, H,L, SP, PC) (5 cols) ─── */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          {/* General Purpose Register Array (B-C, D-E, H-L) */}
          <div className="p-2.5 bg-card border border-border rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-foreground">General Purpose Register Array</span>
              <span className="text-[8px] font-mono text-muted-foreground">8-Bit Regs / 16-Bit Pairs</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* BC Pair */}
              <div className="p-1.5 bg-slate-950 rounded-xl border border-border text-center space-y-0.5">
                <span className="text-[9px] font-bold text-sky-400 block">BC Pair</span>
                <div className="flex justify-around font-mono text-xs font-black">
                  <span className="text-sky-300">B: 0x{regs.B.toString(16).toUpperCase().padStart(2, "0")}</span>
                  <span className="text-sky-300">C: 0x{regs.C.toString(16).toUpperCase().padStart(2, "0")}</span>
                </div>
              </div>

              {/* DE Pair */}
              <div className="p-1.5 bg-slate-950 rounded-xl border border-border text-center space-y-0.5">
                <span className="text-[9px] font-bold text-emerald-400 block">DE Pair</span>
                <div className="flex justify-around font-mono text-xs font-black">
                  <span className="text-emerald-300">D: 0x{regs.D.toString(16).toUpperCase().padStart(2, "0")}</span>
                  <span className="text-emerald-300">E: 0x{regs.E.toString(16).toUpperCase().padStart(2, "0")}</span>
                </div>
              </div>

              {/* HL Memory Pointer Pair */}
              <div className="p-1.5 bg-slate-950 rounded-xl border border-amber-500/50 text-center space-y-0.5 ring-1 ring-amber-500/20">
                <span className="text-[9px] font-black text-amber-400 block">HL Pointer [M]</span>
                <div className="flex justify-around font-mono text-xs font-black">
                  <span className="text-amber-300">H: 0x{regs.H.toString(16).toUpperCase().padStart(2, "0")}</span>
                  <span className="text-amber-300">L: 0x{regs.L.toString(16).toUpperCase().padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Purpose 16-Bit Registers: SP & PC */}
          <div className="grid grid-cols-2 gap-2">
            {/* Stack Pointer (SP) */}
            <div className="p-2 bg-card border border-border rounded-2xl space-y-1">
              <span className="text-[9px] font-bold text-purple-400 uppercase block">Stack Pointer (SP, 16-Bit)</span>
              <span className="text-xs font-black font-mono text-foreground block">
                0x{regs.SP.toString(16).toUpperCase().padStart(4, "0")}
              </span>
            </div>

            {/* Program Counter (PC) */}
            <div className="p-2 bg-card border border-border rounded-2xl space-y-1">
              <span className="text-[9px] font-bold text-amber-400 uppercase block">Program Counter (PC, 16-Bit)</span>
              <span className="text-xs font-black font-mono text-foreground block">
                0x{regs.PC.toString(16).toUpperCase().padStart(4, "0")} (Line {regs.PC})
              </span>
            </div>
          </div>

          {/* 16-Byte RAM Memory Matrix (0x0000 - 0x000F) */}
          <div className="p-2.5 bg-card border border-border rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-foreground flex items-center gap-1.5">
                <Database size={13} className="text-emerald-500" />
                RAM Memory Matrix (Click to Edit)
              </span>
              <span className="text-[9px] font-mono text-amber-400 font-bold">
                HL Memory Pointer @ [0x{hlAddr.toString(16).toUpperCase().padStart(4, "0")}] = 0x{ram[hlAddr % 16]?.toString(16).toUpperCase().padStart(2, "0")}
              </span>
            </div>

            <div className="grid grid-cols-8 gap-1 font-mono text-[8px]">
              {ram.map((byte, idx) => {
                const isHLTarget = (hlAddr % 16) === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      const input = prompt(`Edit RAM[0x${idx.toString(16).toUpperCase()}] in hex:`, byte.toString(16).toUpperCase());
                      if (input !== null) {
                        const val = parseInt(input, 16);
                        if (!isNaN(val)) {
                          setRam((prev) => {
                            const n = [...prev];
                            n[idx] = val & 0xff;
                            return n;
                          });
                        }
                      }
                    }}
                    className={`py-1 rounded border text-center transition-all ${
                      isHLTarget
                        ? "bg-amber-500 text-black border-amber-400 font-black shadow-md scale-105"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    <div className="text-[7px] opacity-70">0x{idx.toString(16).toUpperCase()}</div>
                    <div className="text-[10px] font-bold">0x{byte.toString(16).toUpperCase().padStart(2, "0")}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instruction Execution Log Console */}
          <div className="p-2 bg-slate-950 border border-border rounded-2xl font-mono text-[10px] space-y-0.5">
            <span className="text-[8px] text-slate-500 uppercase font-bold block">Execution Trace Log:</span>
            {historyLog.slice(0, 3).map((item, idx) => (
              <div key={idx} className="text-slate-300 truncate">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
