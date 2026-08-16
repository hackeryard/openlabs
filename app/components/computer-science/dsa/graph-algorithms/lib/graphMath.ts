import {
  GraphData,
  GraphNode,
  GraphEdge,
  PathStep,
  MSTStep,
  FlowStep,
  ColoringResult,
  GraphPresetType,
} from "../types";

/**
 * Disjoint Set Union (DSU) for Kruskal's MST algorithm
 */
export class DisjointSet {
  private parent: Record<string, string> = {};
  private rank: Record<string, number> = {};

  constructor(elements: string[]) {
    elements.forEach((el) => {
      this.parent[el] = el;
      this.rank[el] = 0;
    });
  }

  find(item: string): string {
    if (this.parent[item] === item) return item;
    this.parent[item] = this.find(this.parent[item]);
    return this.parent[item];
  }

  union(setA: string, setB: string): boolean {
    const rootA = this.find(setA);
    const rootB = this.find(setB);
    if (rootA === rootB) return false;

    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB;
    } else if (this.rank[rootA] > this.rank[rootB]) {
      this.parent[rootB] = rootA;
    } else {
      this.parent[rootB] = rootA;
      this.rank[rootA]++;
    }
    return true;
  }
}

/**
 * Force-Directed Physics Layout Step (Coulomb repulsion + Hooke attraction + Center gravity)
 */
export function runForceDirectedSimulationStep(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width = 600,
  height = 440
): GraphNode[] {
  const kRepulse = 3500;
  const kSpring = 0.04;
  const restingLength = 110;
  const damping = 0.85;
  const centerGravity = 0.015;
  const cx = width / 2;
  const cy = height / 2;

  const newNodes = nodes.map((n) => ({
    ...n,
    vx: n.vx || 0,
    vy: n.vy || 0,
  }));

  // Coulomb Repulsion between all pairs of vertices
  for (let i = 0; i < newNodes.length; i++) {
    for (let j = i + 1; j < newNodes.length; j++) {
      const u = newNodes[i];
      const v = newNodes[j];
      let dx = v.x - u.x;
      let dy = v.y - u.y;
      let dist = Math.hypot(dx, dy);
      if (dist < 1) {
        dx = (Math.random() - 0.5) * 2;
        dy = (Math.random() - 0.5) * 2;
        dist = 1;
      }

      const force = kRepulse / (dist * dist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      u.vx -= fx;
      u.vy -= fy;
      v.vx += fx;
      v.vy += fy;
    }
  }

  // Hooke Spring Attraction along edges
  edges.forEach((edge) => {
    const u = newNodes.find((n) => n.id === edge.source);
    const v = newNodes.find((n) => n.id === edge.target);
    if (!u || !v) return;

    const dx = v.x - u.x;
    const dy = v.y - u.y;
    const dist = Math.hypot(dx, dy) || 1;
    const displacement = dist - restingLength;
    const force = kSpring * displacement;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;

    u.vx += fx;
    u.vy += fy;
    v.vx -= fx;
    v.vy -= fy;
  });

  // Center Gravity & Boundary containment
  return newNodes.map((n) => {
    n.vx += (cx - n.x) * centerGravity;
    n.vy += (cy - n.y) * centerGravity;

    n.vx *= damping;
    n.vy *= damping;

    const nextX = Math.max(35, Math.min(width - 35, n.x + n.vx));
    const nextY = Math.max(35, Math.min(height - 35, n.y + n.vy));

    return {
      ...n,
      x: Number(nextX.toFixed(1)),
      y: Number(nextY.toFixed(1)),
      vx: n.vx,
      vy: n.vy,
    };
  });
}

/**
 * Computes general graph metrics and topological invariants
 */
export function computeGraphInvariants(graph: GraphData) {
  const numVertices = graph.nodes.length;
  const numEdges = graph.edges.length;

  const degrees: Record<string, number> = {};
  graph.nodes.forEach((n) => (degrees[n.id] = 0));
  graph.edges.forEach((e) => {
    degrees[e.source] = (degrees[e.source] || 0) + 1;
    degrees[e.target] = (degrees[e.target] || 0) + 1;
  });

  const degreeSeq = Object.values(degrees).sort((a, b) => b - a);
  const avgDegree =
    numVertices > 0
      ? Object.values(degrees).reduce((a, b) => a + b, 0) / numVertices
      : 0;

  const maxPossibleEdges = (numVertices * (numVertices - 1)) / 2;
  const density =
    maxPossibleEdges > 0 ? (numEdges / maxPossibleEdges) * 100 : 0;

  // Connected components via DFS
  const visited = new Set<string>();
  let componentsCount = 0;

  const adj: Record<string, string[]> = {};
  graph.nodes.forEach((n) => (adj[n.id] = []));
  graph.edges.forEach((e) => {
    adj[e.source]?.push(e.target);
    if (!e.isDirected) adj[e.target]?.push(e.source);
  });

  graph.nodes.forEach((n) => {
    if (!visited.has(n.id)) {
      componentsCount++;
      const stack = [n.id];
      visited.add(n.id);
      while (stack.length > 0) {
        const curr = stack.pop()!;
        (adj[curr] || []).forEach((nbr) => {
          if (!visited.has(nbr)) {
            visited.add(nbr);
            stack.push(nbr);
          }
        });
      }
    }
  });

  // Adjacency Matrix
  const matrix: number[][] = [];
  const nodeIndexMap: Record<string, number> = {};
  graph.nodes.forEach((n, idx) => (nodeIndexMap[n.id] = idx));

  for (let i = 0; i < numVertices; i++) {
    matrix.push(new Array(numVertices).fill(0));
  }

  graph.edges.forEach((e) => {
    const u = nodeIndexMap[e.source];
    const v = nodeIndexMap[e.target];
    if (u !== undefined && v !== undefined) {
      matrix[u][v] = e.weight || 1;
      if (!e.isDirected) matrix[v][u] = e.weight || 1;
    }
  });

  return {
    numVertices,
    numEdges,
    degreeSeq,
    avgDegree,
    density,
    componentsCount,
    isConnected: componentsCount <= 1 && numVertices > 0,
    matrix,
  };
}

/**
 * Step-by-step Dijkstra Shortest Path
 */
export function generateDijkstraSteps(
  graph: GraphData,
  startNodeId: string,
  targetNodeId: string
): PathStep[] {
  const steps: PathStep[] = [];
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const visited = new Set<string>();

  graph.nodes.forEach((n) => {
    distances[n.id] = Infinity;
    previousNodes[n.id] = null;
  });

  distances[startNodeId] = 0;

  const adj: Record<string, { target: string; weight: number; edgeId: string }[]> = {};
  graph.nodes.forEach((n) => (adj[n.id] = []));
  graph.edges.forEach((e) => {
    adj[e.source]?.push({ target: e.target, weight: e.weight, edgeId: e.id });
    if (!e.isDirected) {
      adj[e.target]?.push({ target: e.source, weight: e.weight, edgeId: e.id });
    }
  });

  steps.push({
    currentNodeId: startNodeId,
    visitedNodes: [],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
    activeEdgeId: null,
    description: `Initialize Dijkstra: Start at node ${startNodeId} with dist = 0. All other nodes dist = ∞.`,
  });

  while (visited.size < graph.nodes.length) {
    let minNode: string | null = null;
    let minDist = Infinity;

    graph.nodes.forEach((n) => {
      if (!visited.has(n.id) && distances[n.id] < minDist) {
        minDist = distances[n.id];
        minNode = n.id;
      }
    });

    if (!minNode || minDist === Infinity) break;

    visited.add(minNode);

    steps.push({
      currentNodeId: minNode,
      visitedNodes: Array.from(visited),
      distances: { ...distances },
      previousNodes: { ...previousNodes },
      activeEdgeId: null,
      description: `Select unvisited node ${minNode} with minimum distance = ${minDist.toFixed(1)}.`,
    });

    if (minNode === targetNodeId) {
      steps.push({
        currentNodeId: minNode,
        visitedNodes: Array.from(visited),
        distances: { ...distances },
        previousNodes: { ...previousNodes },
        activeEdgeId: null,
        description: `Target node ${targetNodeId} reached! Shortest distance is ${distances[targetNodeId]}.`,
      });
      break;
    }

    const neighbors = adj[minNode] || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.target)) {
        const alt = distances[minNode] + edge.weight;
        if (alt < distances[edge.target]) {
          distances[edge.target] = alt;
          previousNodes[edge.target] = minNode;

          steps.push({
            currentNodeId: minNode,
            visitedNodes: Array.from(visited),
            distances: { ...distances },
            previousNodes: { ...previousNodes },
            activeEdgeId: edge.edgeId,
            description: `Relax edge (${minNode} → ${edge.target}): Found shorter path to ${edge.target} with dist = ${alt.toFixed(1)}.`,
          });
        }
      }
    }
  }

  return steps;
}

/**
 * Step-by-step BFS Shortest Path (Unweighted)
 */
export function generateBFSSteps(
  graph: GraphData,
  startNodeId: string,
  targetNodeId: string
): PathStep[] {
  const steps: PathStep[] = [];
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const visited = new Set<string>();

  graph.nodes.forEach((n) => {
    distances[n.id] = Infinity;
    previousNodes[n.id] = null;
  });

  distances[startNodeId] = 0;
  visited.add(startNodeId);
  const queue: string[] = [startNodeId];

  const adj: Record<string, { target: string; edgeId: string }[]> = {};
  graph.nodes.forEach((n) => (adj[n.id] = []));
  graph.edges.forEach((e) => {
    adj[e.source]?.push({ target: e.target, edgeId: e.id });
    if (!e.isDirected) adj[e.target]?.push({ target: e.source, edgeId: e.id });
  });

  steps.push({
    currentNodeId: startNodeId,
    visitedNodes: [startNodeId],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
    activeEdgeId: null,
    description: `Initialize BFS: Enqueue start node ${startNodeId} at level 0.`,
  });

  while (queue.length > 0) {
    const curr = queue.shift()!;

    steps.push({
      currentNodeId: curr,
      visitedNodes: Array.from(visited),
      distances: { ...distances },
      previousNodes: { ...previousNodes },
      activeEdgeId: null,
      description: `Dequeue node ${curr} (level ${distances[curr]}).`,
    });

    if (curr === targetNodeId) {
      steps.push({
        currentNodeId: curr,
        visitedNodes: Array.from(visited),
        distances: { ...distances },
        previousNodes: { ...previousNodes },
        activeEdgeId: null,
        description: `Target node ${targetNodeId} reached via BFS in ${distances[targetNodeId]} hops!`,
      });
      break;
    }

    for (const edge of adj[curr] || []) {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        distances[edge.target] = distances[curr] + 1;
        previousNodes[edge.target] = curr;
        queue.push(edge.target);

        steps.push({
          currentNodeId: curr,
          visitedNodes: Array.from(visited),
          distances: { ...distances },
          previousNodes: { ...previousNodes },
          activeEdgeId: edge.edgeId,
          description: `Discover unvisited neighbor ${edge.target} at level ${distances[edge.target]}.`,
        });
      }
    }
  }

  return steps;
}

/**
 * Step-by-step Bellman-Ford Algorithm
 */
export function generateBellmanFordSteps(
  graph: GraphData,
  startNodeId: string,
  targetNodeId: string
): PathStep[] {
  const steps: PathStep[] = [];
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};

  graph.nodes.forEach((n) => {
    distances[n.id] = Infinity;
    previousNodes[n.id] = null;
  });

  distances[startNodeId] = 0;

  steps.push({
    currentNodeId: startNodeId,
    visitedNodes: [startNodeId],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
    activeEdgeId: null,
    description: `Initialize Bellman-Ford: Start at node ${startNodeId} with dist = 0.`,
  });

  const V = graph.nodes.length;
  for (let iter = 1; iter <= V - 1; iter++) {
    let updated = false;

    for (const edge of graph.edges) {
      if (distances[edge.source] !== Infinity) {
        const alt = distances[edge.source] + edge.weight;
        if (alt < distances[edge.target]) {
          distances[edge.target] = alt;
          previousNodes[edge.target] = edge.source;
          updated = true;

          steps.push({
            currentNodeId: edge.target,
            visitedNodes: Object.keys(distances).filter((k) => distances[k] !== Infinity),
            distances: { ...distances },
            previousNodes: { ...previousNodes },
            activeEdgeId: edge.id,
            description: `Pass ${iter}/${V - 1}: Relax edge (${edge.source} → ${edge.target}) to dist = ${alt}.`,
          });
        }
      }

      if (!edge.isDirected && distances[edge.target] !== Infinity) {
        const alt = distances[edge.target] + edge.weight;
        if (alt < distances[edge.source]) {
          distances[edge.source] = alt;
          previousNodes[edge.source] = edge.target;
          updated = true;

          steps.push({
            currentNodeId: edge.source,
            visitedNodes: Object.keys(distances).filter((k) => distances[k] !== Infinity),
            distances: { ...distances },
            previousNodes: { ...previousNodes },
            activeEdgeId: edge.id,
            description: `Pass ${iter}/${V - 1}: Relax edge (${edge.target} → ${edge.source}) to dist = ${alt}.`,
          });
        }
      }
    }

    if (!updated) break;
  }

  steps.push({
    currentNodeId: targetNodeId,
    visitedNodes: Object.keys(distances).filter((k) => distances[k] !== Infinity),
    distances: { ...distances },
    previousNodes: { ...previousNodes },
    activeEdgeId: null,
    description: `Bellman-Ford Completed! Shortest path to ${targetNodeId} is ${distances[targetNodeId]}.`,
  });

  return steps;
}

/**
 * Step-by-step Kruskal's MST Algorithm
 */
export function generateKruskalSteps(graph: GraphData): MSTStep[] {
  const steps: MSTStep[] = [];
  const nodeIds = graph.nodes.map((n) => n.id);
  const dsu = new DisjointSet(nodeIds);

  const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);
  const acceptedEdgeIds: string[] = [];
  const rejectedEdgeIds: string[] = [];
  let totalWeight = 0;

  steps.push({
    evaluatedEdgeId: null,
    acceptedEdgeIds: [],
    rejectedEdgeIds: [],
    visitedNodes: [],
    totalWeight: 0,
    description: `Sort all ${graph.edges.length} edges in ascending order of weight.`,
  });

  for (const edge of sortedEdges) {
    const rootU = dsu.find(edge.source);
    const rootV = dsu.find(edge.target);

    if (rootU !== rootV) {
      dsu.union(edge.source, edge.target);
      acceptedEdgeIds.push(edge.id);
      totalWeight += edge.weight;

      steps.push({
        evaluatedEdgeId: edge.id,
        acceptedEdgeIds: [...acceptedEdgeIds],
        rejectedEdgeIds: [...rejectedEdgeIds],
        visitedNodes: nodeIds.filter((id) => dsu.find(id) === dsu.find(edge.source)),
        totalWeight,
        description: `Accept edge (${edge.source}—${edge.target}, w=${edge.weight}): Connects disjoint sets without creating a cycle.`,
      });
    } else {
      rejectedEdgeIds.push(edge.id);
      steps.push({
        evaluatedEdgeId: edge.id,
        acceptedEdgeIds: [...acceptedEdgeIds],
        rejectedEdgeIds: [...rejectedEdgeIds],
        visitedNodes: [],
        totalWeight,
        description: `Reject edge (${edge.source}—${edge.target}, w=${edge.weight}): Endpoints already in the same component (would form cycle).`,
      });
    }

    if (acceptedEdgeIds.length === graph.nodes.length - 1) {
      steps.push({
        evaluatedEdgeId: null,
        acceptedEdgeIds: [...acceptedEdgeIds],
        rejectedEdgeIds: [...rejectedEdgeIds],
        visitedNodes: nodeIds,
        totalWeight,
        description: `MST Complete! Spanning tree contains ${acceptedEdgeIds.length} edges with total weight = ${totalWeight}.`,
      });
      break;
    }
  }

  return steps;
}

/**
 * Step-by-step Prim's MST Algorithm
 */
export function generatePrimSteps(graph: GraphData, startNodeId: string): MSTStep[] {
  const steps: MSTStep[] = [];
  if (graph.nodes.length === 0) return steps;

  const visited = new Set<string>([startNodeId]);
  const acceptedEdgeIds: string[] = [];
  let totalWeight = 0;

  steps.push({
    evaluatedEdgeId: null,
    acceptedEdgeIds: [],
    rejectedEdgeIds: [],
    visitedNodes: [startNodeId],
    totalWeight: 0,
    description: `Initialize Prim's algorithm: Start cut tree at vertex ${startNodeId}.`,
  });

  while (visited.size < graph.nodes.length) {
    let minEdge: GraphEdge | null = null;
    let minWeight = Infinity;

    for (const edge of graph.edges) {
      const uIn = visited.has(edge.source);
      const vIn = visited.has(edge.target);

      if ((uIn && !vIn) || (!uIn && vIn)) {
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      }
    }

    if (!minEdge) break;

    const newVertex = visited.has(minEdge.source) ? minEdge.target : minEdge.source;
    visited.add(newVertex);
    acceptedEdgeIds.push(minEdge.id);
    totalWeight += minEdge.weight;

    steps.push({
      evaluatedEdgeId: minEdge.id,
      acceptedEdgeIds: [...acceptedEdgeIds],
      rejectedEdgeIds: [],
      visitedNodes: Array.from(visited),
      totalWeight,
      description: `Grow Tree: Add lightest cut edge (${minEdge.source}—${minEdge.target}, w=${minEdge.weight}) to include node ${newVertex}.`,
    });
  }

  return steps;
}

/**
 * Step-by-step Edmonds-Karp / Ford-Fulkerson Maximum Flow
 */
export function generateMaxFlowSteps(
  graph: GraphData,
  sourceId: string,
  sinkId: string
): FlowStep[] {
  const steps: FlowStep[] = [];
  let currentMaxFlow = 0;

  const capacity: Record<string, Record<string, number>> = {};
  const flow: Record<string, Record<string, number>> = {};

  graph.nodes.forEach((u) => {
    capacity[u.id] = {};
    flow[u.id] = {};
    graph.nodes.forEach((v) => {
      capacity[u.id][v.id] = 0;
      flow[u.id][v.id] = 0;
    });
  });

  graph.edges.forEach((e) => {
    const cap = e.capacity || e.weight || 5;
    capacity[e.source][e.target] += cap;
    if (!e.isDirected) {
      capacity[e.target][e.source] += cap;
    }
  });

  steps.push({
    augmentingPath: [],
    augmentingEdgeIds: [],
    bottleneckCapacity: 0,
    currentMaxFlow: 0,
    description: `Initialize Ford-Fulkerson: Source is ${sourceId}, Sink is ${sinkId}. Initial flow = 0.`,
  });

  const findAugmentingPath = (): { path: string[]; bottleneck: number } | null => {
    const parent: Record<string, string | null> = {};
    graph.nodes.forEach((n) => (parent[n.id] = null));
    parent[sourceId] = sourceId;

    const queue: string[] = [sourceId];

    while (queue.length > 0) {
      const u = queue.shift()!;
      if (u === sinkId) break;

      for (const v of graph.nodes.map((n) => n.id)) {
        const residual = capacity[u][v] - flow[u][v];
        if (residual > 0 && parent[v] === null) {
          parent[v] = u;
          queue.push(v);
        }
      }
    }

    if (parent[sinkId] === null) return null;

    const path: string[] = [];
    let curr = sinkId;
    let bottleneck = Infinity;

    while (curr !== sourceId) {
      const prev = parent[curr]!;
      path.unshift(curr);
      bottleneck = Math.min(bottleneck, capacity[prev][curr] - flow[prev][curr]);
      curr = prev;
    }
    path.unshift(sourceId);

    return { path, bottleneck };
  };

  while (true) {
    const result = findAugmentingPath();
    if (!result) break;

    const { path, bottleneck } = result;

    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      flow[u][v] += bottleneck;
      flow[v][u] -= bottleneck;
    }

    currentMaxFlow += bottleneck;

    const augmentingEdgeIds: string[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      const edge = graph.edges.find(
        (e) => (e.source === u && e.target === v) || (!e.isDirected && e.source === v && e.target === u)
      );
      if (edge) augmentingEdgeIds.push(edge.id);
    }

    steps.push({
      augmentingPath: path,
      augmentingEdgeIds,
      bottleneckCapacity: bottleneck,
      currentMaxFlow,
      description: `Augmenting Path: [${path.join(" → ")}] with bottleneck capacity Δ = ${bottleneck}. Total Flow = ${currentMaxFlow}.`,
    });
  }

  steps.push({
    augmentingPath: [],
    augmentingEdgeIds: [],
    bottleneckCapacity: 0,
    currentMaxFlow,
    description: `Max Flow Reached! No further augmenting paths exist. Max Network Flow = ${currentMaxFlow}.`,
  });

  return steps;
}

export const COLOR_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#ec4899",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ef4444",
  "#84cc16",
];

/**
 * Welsh-Powell Greedy Graph Coloring Algorithm & Conflict validator
 */
export function computeGraphColoring(
  graph: GraphData,
  manualColors?: Record<string, string>
): ColoringResult {
  if (graph.nodes.length === 0) {
    return { colorMap: {}, chromaticNumber: 0, isBipartite: true, conflicts: [] };
  }

  const degrees: Record<string, number> = {};
  const adj: Record<string, string[]> = {};
  graph.nodes.forEach((n) => {
    degrees[n.id] = 0;
    adj[n.id] = [];
  });

  graph.edges.forEach((e) => {
    degrees[e.source] = (degrees[e.source] || 0) + 1;
    degrees[e.target] = (degrees[e.target] || 0) + 1;
    adj[e.source]?.push(e.target);
    adj[e.target]?.push(e.source);
  });

  let colorMap: Record<string, string> = {};

  if (manualColors && Object.keys(manualColors).length > 0) {
    colorMap = { ...manualColors };
  } else {
    const sortedNodes = [...graph.nodes].sort(
      (a, b) => degrees[b.id] - degrees[a.id]
    );

    const colorIndexMap: Record<string, number> = {};

    sortedNodes.forEach((node) => {
      const neighborColors = new Set<number>();
      (adj[node.id] || []).forEach((nbrId) => {
        if (colorIndexMap[nbrId] !== undefined) {
          neighborColors.add(colorIndexMap[nbrId]);
        }
      });

      let colorIdx = 0;
      while (neighborColors.has(colorIdx)) {
        colorIdx++;
      }
      colorIndexMap[node.id] = colorIdx;
    });

    Object.entries(colorIndexMap).forEach(([nodeId, idx]) => {
      colorMap[nodeId] = COLOR_PALETTE[idx % COLOR_PALETTE.length];
    });
  }

  const conflicts: string[] = [];
  graph.edges.forEach((edge) => {
    const c1 = colorMap[edge.source];
    const c2 = colorMap[edge.target];
    if (c1 && c2 && c1.toLowerCase() === c2.toLowerCase()) {
      conflicts.push(edge.id);
    }
  });

  const distinctColors = new Set(Object.values(colorMap).filter(Boolean));
  const chromaticNumber = distinctColors.size;

  const bipColors: Record<string, number> = {};
  let isBipartite = true;
  const set1: string[] = [];
  const set2: string[] = [];

  graph.nodes.forEach((start) => {
    if (bipColors[start.id] === undefined && isBipartite) {
      bipColors[start.id] = 0;
      set1.push(start.id);
      const queue = [start.id];

      while (queue.length > 0) {
        const u = queue.shift()!;
        const nextColor = 1 - bipColors[u];

        for (const v of adj[u] || []) {
          if (bipColors[v] === undefined) {
            bipColors[v] = nextColor;
            if (nextColor === 0) set1.push(v);
            else set2.push(v);
            queue.push(v);
          } else if (bipColors[v] === bipColors[u]) {
            isBipartite = false;
            break;
          }
        }
      }
    }
  });

  return {
    colorMap,
    chromaticNumber,
    isBipartite,
    bipartiteSets: isBipartite ? { set1, set2 } : undefined,
    conflicts,
  };
}

/**
 * Standard Graph Presets
 */
export function getGraphPreset(preset: GraphPresetType): GraphData {
  switch (preset) {
    case "petersen": {
      const outerR = 140;
      const innerR = 75;
      const cx = 300;
      const cy = 210;
      const nodes: GraphNode[] = [];
      const labels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        nodes.push({
          id: labels[i],
          label: labels[i],
          x: cx + outerR * Math.cos(angle),
          y: cy + outerR * Math.sin(angle),
        });
      }

      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        nodes.push({
          id: labels[i + 5],
          label: labels[i + 5],
          x: cx + innerR * Math.cos(angle),
          y: cy + innerR * Math.sin(angle),
        });
      }

      const edges: GraphEdge[] = [
        { id: "e01", source: "0", target: "1", weight: 3 },
        { id: "e12", source: "1", target: "2", weight: 4 },
        { id: "e23", source: "2", target: "3", weight: 2 },
        { id: "e34", source: "3", target: "4", weight: 5 },
        { id: "e40", source: "4", target: "0", weight: 3 },
        { id: "e05", source: "0", target: "5", weight: 6 },
        { id: "e16", source: "1", target: "6", weight: 2 },
        { id: "e27", source: "2", target: "7", weight: 4 },
        { id: "e38", source: "3", target: "8", weight: 1 },
        { id: "e49", source: "4", target: "9", weight: 3 },
        { id: "e57", source: "5", target: "7", weight: 5 },
        { id: "e79", source: "7", target: "9", weight: 2 },
        { id: "e96", source: "9", target: "6", weight: 4 },
        { id: "e68", source: "6", target: "8", weight: 3 },
        { id: "e85", source: "8", target: "5", weight: 2 },
      ];

      return { nodes, edges };
    }

    case "flow_network": {
      const nodes: GraphNode[] = [
        { id: "Source", label: "Src", x: 100, y: 210 },
        { id: "A", label: "A", x: 240, y: 110 },
        { id: "B", label: "B", x: 240, y: 310 },
        { id: "C", label: "C", x: 380, y: 110 },
        { id: "D", label: "D", x: 380, y: 310 },
        { id: "Sink", label: "Snk", x: 500, y: 210 },
      ];

      const edges: GraphEdge[] = [
        { id: "eSA", source: "Source", target: "A", weight: 10, capacity: 10, isDirected: true },
        { id: "eSB", source: "Source", target: "B", weight: 8, capacity: 8, isDirected: true },
        { id: "eAB", source: "A", target: "B", weight: 4, capacity: 4, isDirected: true },
        { id: "eAC", source: "A", target: "C", weight: 8, capacity: 8, isDirected: true },
        { id: "eBD", source: "B", target: "D", weight: 9, capacity: 9, isDirected: true },
        { id: "eCD", source: "C", target: "D", weight: 6, capacity: 6, isDirected: true },
        { id: "eCT", source: "C", target: "Sink", weight: 10, capacity: 10, isDirected: true },
        { id: "eDT", source: "D", target: "Sink", weight: 10, capacity: 10, isDirected: true },
      ];

      return { nodes, edges };
    }

    case "complete5": {
      const r = 130;
      const cx = 300;
      const cy = 210;
      const nodes: GraphNode[] = [];
      const edges: GraphEdge[] = [];
      const labels = ["A", "B", "C", "D", "E"];

      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        nodes.push({
          id: labels[i],
          label: labels[i],
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle),
        });
      }

      let edgeCount = 0;
      for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 5; j++) {
          edges.push({
            id: `e_${labels[i]}_${labels[j]}`,
            source: labels[i],
            target: labels[j],
            weight: (edgeCount % 7) + 2,
          });
          edgeCount++;
        }
      }

      return { nodes, edges };
    }

    case "bipartite33": {
      const nodes: GraphNode[] = [
        { id: "U1", label: "U1", x: 180, y: 100 },
        { id: "U2", label: "U2", x: 180, y: 210 },
        { id: "U3", label: "U3", x: 180, y: 320 },
        { id: "V1", label: "V1", x: 420, y: 100 },
        { id: "V2", label: "V2", x: 420, y: 210 },
        { id: "V3", label: "V3", x: 420, y: 320 },
      ];

      const edges: GraphEdge[] = [];
      const setU = ["U1", "U2", "U3"];
      const setV = ["V1", "V2", "V3"];

      let w = 1;
      setU.forEach((u) => {
        setV.forEach((v) => {
          edges.push({
            id: `e_${u}_${v}`,
            source: u,
            target: v,
            weight: ((w * 3) % 9) + 2,
          });
          w++;
        });
      });

      return { nodes, edges };
    }

    case "binary_tree": {
      const nodes: GraphNode[] = [
        { id: "1", label: "1", x: 300, y: 70 },
        { id: "2", label: "2", x: 180, y: 180 },
        { id: "3", label: "3", x: 420, y: 180 },
        { id: "4", label: "4", x: 120, y: 310 },
        { id: "5", label: "5", x: 240, y: 310 },
        { id: "6", label: "6", x: 360, y: 310 },
        { id: "7", label: "7", x: 480, y: 310 },
      ];

      const edges: GraphEdge[] = [
        { id: "e12", source: "1", target: "2", weight: 4 },
        { id: "e13", source: "1", target: "3", weight: 3 },
        { id: "e24", source: "2", target: "4", weight: 2 },
        { id: "e25", source: "2", target: "5", weight: 5 },
        { id: "e36", source: "3", target: "6", weight: 1 },
        { id: "e37", source: "3", target: "7", weight: 6 },
      ];

      return { nodes, edges };
    }

    case "wheel6": {
      const cx = 300;
      const cy = 210;
      const r = 130;
      const nodes: GraphNode[] = [{ id: "Hub", label: "Hub", x: cx, y: cy }];
      const edges: GraphEdge[] = [];

      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6;
        const id = `R${i + 1}`;
        nodes.push({
          id,
          label: id,
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle),
        });

        edges.push({ id: `e_hub_${id}`, source: "Hub", target: id, weight: 3 });

        const nextId = `R${((i + 1) % 6) + 1}`;
        edges.push({ id: `e_${id}_${nextId}`, source: id, target: nextId, weight: 4 });
      }

      return { nodes, edges };
    }

    case "grid2x3": {
      const nodes: GraphNode[] = [
        { id: "A1", label: "A1", x: 180, y: 130 },
        { id: "A2", label: "A2", x: 300, y: 130 },
        { id: "A3", label: "A3", x: 420, y: 130 },
        { id: "B1", label: "B1", x: 180, y: 280 },
        { id: "B2", label: "B2", x: 300, y: 280 },
        { id: "B3", label: "B3", x: 420, y: 280 },
      ];

      const edges: GraphEdge[] = [
        { id: "eA1A2", source: "A1", target: "A2", weight: 3 },
        { id: "eA2A3", source: "A2", target: "A3", weight: 2 },
        { id: "eB1B2", source: "B1", target: "B2", weight: 4 },
        { id: "eB2B3", source: "B2", target: "B3", weight: 1 },
        { id: "eA1B1", source: "A1", target: "B1", weight: 5 },
        { id: "eA2B2", source: "A2", target: "B2", weight: 2 },
        { id: "eA3B3", source: "A3", target: "B3", weight: 3 },
      ];

      return { nodes, edges };
    }

    case "weighted_network":
    default: {
      const nodes: GraphNode[] = [
        { id: "S", label: "S", x: 120, y: 210 },
        { id: "A", label: "A", x: 250, y: 100 },
        { id: "B", label: "B", x: 250, y: 320 },
        { id: "C", label: "C", x: 390, y: 100 },
        { id: "D", label: "D", x: 390, y: 320 },
        { id: "T", label: "T", x: 500, y: 210 },
      ];

      const edges: GraphEdge[] = [
        { id: "eSA", source: "S", target: "A", weight: 4 },
        { id: "eSB", source: "S", target: "B", weight: 2 },
        { id: "eAB", source: "A", target: "B", weight: 1 },
        { id: "eAC", source: "A", target: "C", weight: 5 },
        { id: "eBC", source: "B", target: "C", weight: 8 },
        { id: "eBD", source: "B", target: "D", weight: 10 },
        { id: "eCD", source: "C", target: "D", weight: 2 },
        { id: "eCT", source: "C", target: "T", weight: 6 },
        { id: "eDT", source: "D", target: "T", weight: 3 },
      ];

      return { nodes, edges };
    }
  }
}
