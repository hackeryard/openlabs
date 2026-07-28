export type ComponentType = 'battery' | 'resistor' | 'wire' | 'switch' | 'ammeter' | 'voltmeter' | 'bulb' | 'capacitor' | 'potentiometer' | 'fuse' | 'led';

export interface CircuitNode {
  id: string; // usually an x,y coordinate or UUID
  x: number;
  y: number;
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  node1: string;
  node2: string;
  value: number; // Resistance (ohms) or Voltage (volts)
  isOpen?: boolean; // for switches and fuses
  internalResistance?: number; // for batteries
  maxCurrent?: number; // for fuses (rating in Amps)
  color?: string; // for LEDs (hex or color name)
  isAC?: boolean; // for batteries
  frequency?: number; // for AC batteries (Hz)
}

export interface CircuitState {
  nodes: Record<string, CircuitNode>;
  components: Record<string, CircuitComponent>;
}

export interface SolverResult {
  nodeVoltages: Record<string, number>;
  componentCurrents: Record<string, number>;
  componentVoltages: Record<string, number>;
  componentPowers: Record<string, number>;
  time: number;
}

/**
 * Solves a system of linear equations Ax = b using Gaussian Elimination.
 * Returns x array, or null if singular.
 */
function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  if (n === 0) return [];
  
  // Create augmented matrix
  const M = A.map((row, i) => [...row, b[i]]);
  
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    
    // Swap rows
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;
    
    // Check for singularity
    if (Math.abs(M[i][i]) < 1e-10) {
      return null;
    }
    
    // Eliminate below
    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }
  
  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += M[i][j] * x[j];
    }
    x[i] = (M[i][n] - sum) / M[i][i];
  }
  
  return x;
}

/**
 * Modified Nodal Analysis (MNA) solver (Transient).
 */
export function solveCircuit(
  state: CircuitState, 
  previousState: SolverResult | null = null, 
  dt: number = 0.016, 
  time: number = 0
): SolverResult {
  const nodes = Object.values(state.nodes);
  const components = Object.values(state.components);
  
  if (nodes.length === 0 || components.length === 0) {
    return { nodeVoltages: {}, componentCurrents: {}, componentVoltages: {}, componentPowers: {}, time };
  }

  // Create a mapping of node IDs to integer indices (1 to N, 0 is reserved for ground)
  // We must pick a ground node. Arbitrarily pick the first node.
  const groundNodeId = nodes[0].id;
  
  let nodeCount = 0;
  const nodeIndexMap: Record<string, number> = {};
  
  for (const node of nodes) {
    if (node.id === groundNodeId) {
      nodeIndexMap[node.id] = 0; // Ground is index 0
    } else {
      nodeCount++;
      nodeIndexMap[node.id] = nodeCount;
    }
  }

  // Identify all components that act as voltage sources in MNA (v-sources, wires, closed switches, ammeters)
  // A battery with internal resistance will be modeled as an ideal battery in series with a resistor.
  
  const vSources: { compId: string, node1: number, node2: number, voltage: number }[] = [];
  const iSources: { node1: number, node2: number, current: number }[] = [];
  const admittances: { node1: number, node2: number, g: number }[] = [];
  
  let extraNodesCount = nodeCount;
  const virtualNodes: Record<string, number> = {}; // componentId -> virtualNodeIndex

  components.forEach(comp => {
    let n1 = nodeIndexMap[comp.node1];
    let n2 = nodeIndexMap[comp.node2];
    
    if (n1 === undefined || n2 === undefined) return;

    if (comp.type === 'battery') {
      let rInt = Math.max(comp.internalResistance || 0, 1e-3); // minimum internal resistance 1 milliohm
      extraNodesCount++;
      const virtualNode = extraNodesCount;
      virtualNodes[comp.id] = virtualNode;
      
      let voltage = comp.value;
      if (comp.isAC) {
        const freq = comp.frequency || 1; // 1 Hz default
        voltage = comp.value * Math.sin(2 * Math.PI * freq * time);
      }
      
      // The battery is from n1 to virtualNode
      vSources.push({ compId: comp.id, node1: n1, node2: virtualNode, voltage: voltage });
      // The internal resistor is from virtualNode to n2
      admittances.push({ node1: virtualNode, node2: n2, g: 1 / rInt });
    } else if (comp.type === 'wire' || comp.type === 'ammeter' || ((comp.type === 'switch' || comp.type === 'fuse') && !comp.isOpen)) {
      // Model as a tiny resistor (1 milliohm)
      admittances.push({ node1: n1, node2: n2, g: 1 / 1e-3 });
    } else if (comp.type === 'resistor' || comp.type === 'bulb' || comp.type === 'potentiometer' || comp.type === 'led') {
      const r = Math.max(comp.value, 1e-6); // Prevent division by zero
      admittances.push({ node1: n1, node2: n2, g: 1 / r });
    } else if (comp.type === 'capacitor') {
      // Backward Euler integration
      // Capacitor modeled as a resistor in parallel with a current source
      const c = Math.max(comp.value, 1e-12); // Minimum 1 pF
      const realDt = Math.max(dt, 0.001); // Prevent division by zero
      const g = c / realDt;
      admittances.push({ node1: n1, node2: n2, g: g });
      
      const vPrev = previousState ? (previousState.componentVoltages[comp.id] || 0) : 0;
      const iEq = g * vPrev; // Current source value
      iSources.push({ node1: n1, node2: n2, current: iEq });
    } else if ((comp.type === 'switch' || comp.type === 'fuse') && comp.isOpen) {
      // Open circuit (admittance = 0)
    } else if (comp.type === 'voltmeter') {
      // Ideal voltmeter has infinite resistance -> admittance = 0
    }
  });

  const totalUnknownVoltages = extraNodesCount; 
  const M = vSources.length;
  const matrixSize = totalUnknownVoltages + M;
  
  const A = Array.from({ length: matrixSize }, () => new Array(matrixSize).fill(0));
  const b = new Array(matrixSize).fill(0);

  // Apply current sources to the b vector
  iSources.forEach(src => {
    // Current flows from node1 to node2, so it leaves node1 and enters node2.
    if (src.node1 !== 0) b[src.node1 - 1] -= src.current;
    if (src.node2 !== 0) b[src.node2 - 1] += src.current;
  });

  // Fill G matrix (upper left, size N x N)
  // Add GMIN to prevent singular matrices from floating nodes
  const GMIN = 1e-6; // 1 micro-siemen
  for (let i = 0; i < totalUnknownVoltages; i++) {
    A[i][i] += GMIN;
  }

  admittances.forEach(({ node1, node2, g }) => {
    if (node1 > 0) A[node1 - 1][node1 - 1] += g;
    if (node2 > 0) A[node2 - 1][node2 - 1] += g;
    if (node1 > 0 && node2 > 0) {
      A[node1 - 1][node2 - 1] -= g;
      A[node2 - 1][node1 - 1] -= g;
    }
  });

  // Fill B and C matrices (connection of voltage sources)
  vSources.forEach((vSrc, idx) => {
    const row = totalUnknownVoltages + idx;
    if (vSrc.node1 > 0) {
      A[vSrc.node1 - 1][row] = 1;
      A[row][vSrc.node1 - 1] = 1;
    }
    if (vSrc.node2 > 0) {
      A[vSrc.node2 - 1][row] = -1;
      A[row][vSrc.node2 - 1] = -1;
    }
    b[row] = vSrc.voltage;
  });

  const x = solveLinearSystem(A, b);

  const nodeVoltages: Record<string, number> = {};
  nodeVoltages[groundNodeId] = 0;
  
  for (const node of nodes) {
    if (node.id !== groundNodeId) {
      const idx = nodeIndexMap[node.id];
      nodeVoltages[node.id] = x ? x[idx - 1] : 0;
    }
  }

  const virtualVoltages: Record<number, number> = {};
  if (x) {
    for (let i = nodeCount + 1; i <= extraNodesCount; i++) {
      virtualVoltages[i] = x[i - 1];
    }
  }

  const componentCurrents: Record<string, number> = {};
  const componentVoltages: Record<string, number> = {};
  const componentPowers: Record<string, number> = {};

  components.forEach(comp => {
    const v1 = nodeVoltages[comp.node1] || 0;
    const v2 = nodeVoltages[comp.node2] || 0;
    let vDrop = v1 - v2;
    let current = 0;

    if (comp.type === 'battery') {
      const rInt = Math.max(comp.internalResistance || 0, 1e-3);
      const vNode = virtualNodes[comp.id];
      const vVirtual = virtualVoltages[vNode] || 0;
      vDrop = v1 - v2; 
      current = (vVirtual - v2) / rInt;
    } else if (comp.type === 'wire' || comp.type === 'ammeter' || ((comp.type === 'switch' || comp.type === 'fuse') && !comp.isOpen)) {
      current = vDrop / 1e-3;
    } else if (comp.type === 'resistor' || comp.type === 'bulb' || comp.type === 'potentiometer' || comp.type === 'led') {
      const r = Math.max(comp.value, 1e-6);
      current = vDrop / r;
    } else if (comp.type === 'capacitor') {
      // I = Ieq + G * vDrop
      // But we must compute the total current accurately: C * dv/dt
      const vPrev = previousState ? (previousState.componentVoltages[comp.id] || 0) : 0;
      const c = Math.max(comp.value, 1e-12);
      const realDt = Math.max(dt, 0.001);
      current = c * (vDrop - vPrev) / realDt;
    } else if (comp.type === 'voltmeter') {
      current = 0;
    } else if ((comp.type === 'switch' || comp.type === 'fuse') && comp.isOpen) {
      current = 0;
    }

    componentVoltages[comp.id] = Math.abs(vDrop);
    componentCurrents[comp.id] = current;
    componentPowers[comp.id] = Math.abs(vDrop * current);
  });

  return { nodeVoltages, componentCurrents, componentVoltages, componentPowers, time };
}
