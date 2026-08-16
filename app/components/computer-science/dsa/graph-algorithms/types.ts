export type GraphTabId = "studio" | "pathfinding" | "mst" | "coloring" | "flow";

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  capacity?: number;
  flow?: number;
  isDirected?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type PathAlgorithm = "dijkstra" | "bfs" | "bellman_ford";

export interface PathStep {
  currentNodeId: string | null;
  visitedNodes: string[];
  distances: Record<string, number>;
  previousNodes: Record<string, string | null>;
  activeEdgeId: string | null;
  pathEdgeIds?: string[];
  description: string;
}

export type MSTAlgorithm = "kruskal" | "prim";

export interface MSTStep {
  evaluatedEdgeId: string | null;
  acceptedEdgeIds: string[];
  rejectedEdgeIds: string[];
  visitedNodes: string[];
  totalWeight: number;
  description: string;
}

export interface FlowStep {
  augmentingPath: string[];
  augmentingEdgeIds: string[];
  bottleneckCapacity: number;
  currentMaxFlow: number;
  description: string;
}

export interface ColoringResult {
  colorMap: Record<string, string>;
  chromaticNumber: number;
  isBipartite: boolean;
  bipartiteSets?: { set1: string[]; set2: string[] };
  conflicts: string[];
}

export type GraphPresetType =
  | "petersen"
  | "complete5"
  | "bipartite33"
  | "binary_tree"
  | "wheel6"
  | "grid2x3"
  | "weighted_network"
  | "flow_network";
