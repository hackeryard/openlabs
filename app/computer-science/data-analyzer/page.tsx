"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Users, Filter, Share2, RefreshCw, 
  Maximize2, Activity, X, Info, TrendingUp, 
  Shield, AlertTriangle, Download, Zap, 
  Target, PieChart, Link2, UserCheck 
} from 'lucide-react';
import * as d3 from 'd3';

// ==================== TYPES ====================
interface Node {
  id: string;
  label: string;
  group: number;
  value: number;
  influence: number;
  color?: string;
  x?: number;
  y?: number;
  originalInfluence?: number;
  connections?: number;
  role?: 'influencer' | 'hub' | 'member' | 'isolated';
}

interface Link {
  source: string;
  target: string;
  value: number;
  originalValue?: number;
  strength?: 'weak' | 'medium' | 'strong';
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

// ==================== GENERATE REALISTIC SOCIAL NETWORK ====================
const generateSocialNetwork = (): GraphData => {
  const nodes: Node[] = [];
  const links: Link[] = [];
  
  // Color palette for different communities
  const colors = ['#9333EA', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
  
  // Create 3 distinct communities with different characteristics
  const communities = [
    { name: 'Tech Community', size: 20, baseInfluence: 0.7, color: '#9333EA' },
    { name: 'Marketing Hub', size: 18, baseInfluence: 0.6, color: '#EC4899' },
    { name: 'Content Creators', size: 22, baseInfluence: 0.8, color: '#3B82F6' }
  ];

  // Generate nodes for each community
  communities.forEach((comm, idx) => {
    const groupId = idx + 1;
    
    // Create community leader (high influence)
    const leaderId = `leader-${groupId}`;
    nodes.push({
      id: leaderId,
      label: `${comm.name} Leader`,
      group: groupId,
      value: 45 + Math.random() * 10,
      influence: 0.92 + Math.random() * 0.07,
      color: colors[groupId % colors.length],
      role: 'influencer'
    });

    // Create community members
    for (let i = 0; i < comm.size; i++) {
      const nodeId = `member-${groupId}-${i}`;
      
      // Realistic influence distribution
      let influence;
      const rand = Math.random();
      if (rand < 0.15) influence = 0.8 + Math.random() * 0.15; // 15% high influence
      else if (rand < 0.5) influence = 0.5 + Math.random() * 0.3; // 35% medium influence
      else influence = 0.2 + Math.random() * 0.3; // 50% low influence
      
      // Determine role based on influence
      let role: 'influencer' | 'hub' | 'member' | 'isolated' = 'member';
      if (influence > 0.8) role = 'influencer';
      else if (influence > 0.6) role = 'hub';
      else if (influence < 0.3) role = 'isolated';
      
      nodes.push({
        id: nodeId,
        label: `User ${String.fromCharCode(65 + (i % 26))}${i}`,
        group: groupId,
        value: 15 + Math.random() * 25,
        influence,
        color: colors[groupId % colors.length],
        role
      });

      // Connect to leader (strong connection)
      links.push({
        source: nodeId,
        target: leaderId,
        value: 0.6 + Math.random() * 0.4,
        strength: 'strong'
      });

      // Create intra-community connections based on influence
      if (i > 0) {
        const prevNode = `member-${groupId}-${i - 1}`;
        const connectionStrength = influence > 0.7 ? 0.7 : influence > 0.4 ? 0.4 : 0.2;
        links.push({
          source: nodeId,
          target: prevNode,
          value: connectionStrength + Math.random() * 0.2,
          strength: connectionStrength > 0.6 ? 'strong' : connectionStrength > 0.3 ? 'medium' : 'weak'
        });
      }

      // Additional connections for hubs
      if (role === 'hub' && i > 2) {
        const randomMember = `member-${groupId}-${Math.floor(Math.random() * i)}`;
        links.push({
          source: nodeId,
          target: randomMember,
          value: 0.4 + Math.random() * 0.3,
          strength: 'medium'
        });
      }
    }
  });

  // Create cross-community connections (bridges)
  for (let i = 0; i < 15; i++) {
    const g1 = 1 + Math.floor(Math.random() * 3);
    const g2 = 1 + Math.floor(Math.random() * 3);
    if (g1 !== g2) {
      const node1 = `member-${g1}-${Math.floor(Math.random() * 15)}`;
      const node2 = `member-${g2}-${Math.floor(Math.random() * 15)}`;
      links.push({
        source: node1,
        target: node2,
        value: 0.2 + Math.random() * 0.3,
        strength: 'weak'
      });
    }
  }

  // Add some isolated nodes (barely connected)
  for (let i = 0; i < 5; i++) {
    const nodeId = `isolated-${i}`;
    nodes.push({
      id: nodeId,
      label: `Isolated ${i+1}`,
      group: 4,
      value: 10,
      influence: 0.1 + Math.random() * 0.15,
      color: '#6B7280',
      role: 'isolated'
    });
    // Just one weak connection
    if (i % 2 === 0) {
      links.push({
        source: nodeId,
        target: `member-${1 + Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 10)}`,
        value: 0.1,
        strength: 'weak'
      });
    }
  }

  return { nodes, links };
};

// ==================== DATA CLEANING & ANALYSIS FUNCTIONS ====================
const analyzeNetwork = (data: GraphData) => {
  // Calculate various network metrics
  const totalNodes = data.nodes.length;
  const totalLinks = data.links.length;
  
  // Average influence
  const avgInfluence = data.nodes.reduce((sum, n) => sum + n.influence, 0) / totalNodes;
  
  // Network density
  const maxPossibleLinks = totalNodes * (totalNodes - 1) / 2;
  const density = totalLinks / maxPossibleLinks * 100;
  
  // Find communities
  const communities = new Map<number, number>();
  data.nodes.forEach(n => {
    communities.set(n.group, (communities.get(n.group) || 0) + 1);
  });
  
  // Find influencers (nodes with high influence and many connections)
  const nodeConnections = new Map<string, number>();
  data.links.forEach(link => {
    nodeConnections.set(link.source as string, (nodeConnections.get(link.source as string) || 0) + 1);
    nodeConnections.set(link.target as string, (nodeConnections.get(link.target as string) || 0) + 1);
  });
  
  const influencers = data.nodes
    .filter(n => n.influence > 0.7)
    .map(n => ({
      ...n,
      connections: nodeConnections.get(n.id) || 0
    }))
    .sort((a, b) => b.influence - a.influence);
  
  // Find bridges (nodes connecting different communities)
  const bridges: string[] = [];
  const linkMap = new Map();
  data.links.forEach(link => {
    const source = data.nodes.find(n => n.id === link.source);
    const target = data.nodes.find(n => n.id === link.target);
    if (source && target && source.group !== target.group) {
      bridges.push(source.id);
      bridges.push(target.id);
    }
  });
  
  return {
    totalNodes,
    totalLinks,
    avgInfluence: avgInfluence * 100,
    density,
    communities: Array.from(communities.entries()).map(([id, count]) => ({ id, count, percentage: (count/totalNodes)*100 })),
    influencers: influencers.slice(0, 5),
    bridgeCount: new Set(bridges).size,
    isolatedCount: data.nodes.filter(n => (nodeConnections.get(n.id) || 0) < 2).length
  };
};

const cleanData = (data: GraphData, level: number): { 
  data: GraphData, 
  explanation: string,
  changes: string[],
  analysis: any 
} => {
  if (level === 0) {
    const analysis = analyzeNetwork(data);
    return {
      data,
      explanation: "📊 Raw Data: Showing complete social network with all nodes and connections. This represents unfiltered social media data with various user types.",
      changes: ["No filtering applied", "All nodes visible", "All connections preserved"],
      analysis
    };
  }
  
  const changes: string[] = [];
  
  // Progressive filtering based on cleaning level
  const influenceThreshold = 0.15 * (1 - level / 120);
  const connectionThreshold = 0.1 * (1 - level / 120);
  
  // Filter out low-influence nodes first
  let filteredNodes = data.nodes;
  let filteredLinks = data.links;
  
  if (level > 20) {
    const beforeCount = filteredNodes.length;
    filteredNodes = filteredNodes.filter(n => n.influence > influenceThreshold);
    const removed = beforeCount - filteredNodes.length;
    if (removed > 0) changes.push(`🗑️ Removed ${removed} low-influence users (influence < ${(influenceThreshold*100).toFixed(0)}%)`);
  }
  
  const nodeIds = new Set(filteredNodes.map(n => n.id));
  
  // Filter weak connections
  if (level > 40) {
    const beforeCount = filteredLinks.length;
    filteredLinks = filteredLinks.filter(l => 
      nodeIds.has(l.source as string) && 
      nodeIds.has(l.target as string) && 
      l.value > connectionThreshold
    );
    const removed = beforeCount - filteredLinks.length;
    if (removed > 0) changes.push(`🔗 Removed ${removed} weak connections (strength < ${(connectionThreshold*100).toFixed(0)}%)`);
  }
  
  // Identify and highlight key structures based on cleaning level
  if (level > 60) {
    changes.push(`🎯 Focus on core network: ${filteredNodes.length} key users with ${filteredLinks.length} strong connections`);
    
    // Find remaining influencers
    const influencers = filteredNodes.filter(n => n.influence > 0.7).length;
    changes.push(`⭐ ${influencers} key influencers remain in the network`);
  }
  
  if (level > 80) {
    changes.push(`🔍 Extracted backbone structure showing only high-value connections`);
    
    // Community analysis
    const communities = new Set(filteredNodes.map(n => n.group)).size;
    changes.push(`👥 ${communities} distinct communities preserved`);
  }
  
  if (level === 100) {
    changes.push(`⚡ Maximum filtering: Showing only core influencers and their strongest connections`);
  }
  
  const result = { nodes: filteredNodes, links: filteredLinks };
  const analysis = analyzeNetwork(result);
  
  // Generate explanation
  let explanation = "";
  if (level < 30) {
    explanation = `🔵 LIGHT FILTERING (${level}%): Removing obvious noise and inactive users. Good for initial data exploration while preserving most relationships.`;
  } else if (level < 60) {
    explanation = `🟡 MODERATE FILTERING (${level}%): Focusing on engaged users and meaningful connections. Reveals community structure and identifies potential influencers.`;
  } else if (level < 90) {
    explanation = `🟠 AGGRESSIVE FILTERING (${level}%): Extracting core network backbone. Highlights key opinion leaders and strong community ties.`;
  } else {
    explanation = `🔴 MAXIMUM FILTERING (${level}%): Pure influencer network showing only the most influential users and their strongest relationships. Useful for identifying key stakeholders.`;
  }
  
  return { data: result, explanation, changes, analysis };
};

// ==================== 2D NETWORK GRAPH ====================
const NetworkGraph2D = ({ 
  data, 
  onNodeClick,
  selectedNode,
  cleaningLevel,
  highlightedCommunity
}: { 
  data: GraphData; 
  onNodeClick: (node: Node | null) => void;
  selectedNode: Node | null;
  cleaningLevel: number;
  highlightedCommunity: number | null;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current || data.nodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    setDimensions({ width, height });

    // Run force simulation
    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.value / 2 + 15));

    simulation.tick(200);
    simulation.stop();

    // Create node position map
    const nodeMap = new Map(data.nodes.map(n => [n.id, n]));

    // Clear and draw
    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3.select(svgRef.current);

    // Draw links with gradient based on strength
    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", (d: any) => {
        const source = nodeMap.get(d.source);
        const target = nodeMap.get(d.target);
        if (hoveredNode && (d.source === hoveredNode.id || d.target === hoveredNode.id)) return '#C084FC';
        if (selectedNode && (d.source === selectedNode.id || d.target === selectedNode.id)) return '#C084FC';
        if (source?.group === target?.group) return '#94A3B8';
        return '#6B7280';
      })
      .attr("stroke-opacity", (d: any) => {
        if (hoveredNode && (d.source === hoveredNode.id || d.target === hoveredNode.id)) return 1;
        if (selectedNode && (d.source === selectedNode.id || d.target === selectedNode.id)) return 0.9;
        if (d.strength === 'strong') return 0.8;
        if (d.strength === 'medium') return 0.5;
        return 0.3;
      })
      .attr("stroke-width", (d: any) => d.value * 4)
      .attr("x1", (d: any) => nodeMap.get(d.source)?.x || 0)
      .attr("y1", (d: any) => nodeMap.get(d.source)?.y || 0)
      .attr("x2", (d: any) => nodeMap.get(d.target)?.x || 0)
      .attr("y2", (d: any) => nodeMap.get(d.target)?.y || 0);

    // Draw nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      .attr("cursor", "pointer")
      .on("click", (event: any, d: any) => {
        onNodeClick(d);
        event.stopPropagation();
      })
      .on("mouseenter", (event: any, d: any) => {
        setHoveredNode(d);
        setTooltipPos({ x: event.pageX, y: event.pageY });
      })
      .on("mouseleave", () => setHoveredNode(null));

    // Node circles with effects
    node.append("circle")
      .attr("r", (d: any) => {
        let size = d.value / 2;
        if (d.role === 'influencer') size *= 1.3;
        if (hoveredNode?.id === d.id || selectedNode?.id === d.id) size *= 1.2;
        return size;
      })
      .attr("fill", (d: any) => {
        if (highlightedCommunity && d.group !== highlightedCommunity) {
          return `${d.color}40`; // Add transparency for non-selected communities
        }
        return d.color;
      })
      .attr("stroke", (d: any) => {
        if (d.role === 'influencer') return '#FFD700';
        if (d.role === 'hub') return '#C084FC';
        if (hoveredNode?.id === d.id) return '#fff';
        return 'none';
      })
      .attr("stroke-width", (d: any) => {
        if (d.role === 'influencer') return 3;
        if (d.role === 'hub') return 2;
        return 1;
      })
      .attr("filter", "url(#glow)");

    // Add glow effect
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", "3")
      .attr("result", "blur");
    
    filter.append("feMerge")
      .selectAll("feMergeNode")
      .data(["blur", "SourceGraphic"])
      .join("feMergeNode")
      .attr("in", (d: any) => d);

    // Labels
    node.append("text")
      .text((d: any) => d.label)
      .attr("x", 0)
      .attr("y", (d: any) => -d.value / 2 - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", (d: any) => {
        if (d.role === 'influencer') return '12px';
        if (hoveredNode?.id === d.id) return '12px';
        return '10px';
      })
      .attr("font-weight", (d: any) => d.role === 'influencer' ? 'bold' : 'normal')
      .attr("pointer-events", "none");

    // Influence badges
    node.append("text")
      .text((d: any) => {
        if (d.role === 'influencer') return '👑';
        if (d.role === 'hub') return '🔗';
        return '';
      })
      .attr("x", (d: any) => d.value / 2 + 5)
      .attr("y", -5)
      .attr("font-size", "14px")
      .attr("pointer-events", "none");

    // Add invisible larger hit area for better interaction
    node.append("circle")
      .attr("r", (d: any) => d.value / 2 + 10)
      .attr("fill", "transparent")
      .attr("pointer-events", "all")
      .attr("cursor", "pointer")
      .on("click", (event: any, d: any) => {
        onNodeClick(d);
        event.stopPropagation();
      })
      .on("mouseenter", (event: any, d: any) => {
        setHoveredNode(d);
        setTooltipPos({ x: event.pageX, y: event.pageY });
      })
      .on("mouseleave", () => setHoveredNode(null));

    // Legend/Scale
    svg.append("text")
      .attr("x", 20)
      .attr("y", 30)
      .attr("fill", "#94A3B8")
      .attr("font-size", "12px")
      .text(`👑 Influencer | 🔗 Hub | Cleaning: ${cleaningLevel}%`);

  }, [data, selectedNode, hoveredNode, onNodeClick, cleaningLevel, highlightedCommunity]);

  return (
    <>
      <svg 
        ref={svgRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent'
        }}
        onClick={() => onNodeClick(null)}
      />
      
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bg-slate-900 border border-white/10 rounded-lg p-3 shadow-2xl z-50 pointer-events-none"
            style={{ 
              left: tooltipPos.x + 20, 
              top: tooltipPos.y - 80,
              maxWidth: '250px'
            }}
          >
            <div className="font-medium text-purple-400">{hoveredNode.label}</div>
            <div className="text-xs text-slate-400 mt-1 space-y-1">
              <div>Influence: {(hoveredNode.influence * 100).toFixed(1)}%</div>
              <div>Role: {hoveredNode.role === 'influencer' ? '👑 Key Influencer' : 
                         hoveredNode.role === 'hub' ? '🔗 Community Hub' : 
                         hoveredNode.role === 'isolated' ? '📡 Isolated User' : '👤 Regular Member'}</div>
              <div>Community: {hoveredNode.group === 1 ? 'Tech' : 
                               hoveredNode.group === 2 ? 'Marketing' : 
                               hoveredNode.group === 3 ? 'Content' : 'Other'}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ==================== MAIN COMPONENT ====================
export default function SocialNetworkAnalyzer() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [originalData, setOriginalData] = useState<GraphData>({ nodes: [], links: [] });
  const [cleanLevel, setCleanLevel] = useState(0);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [cleaningInfo, setCleaningInfo] = useState<{ explanation: string; changes: string[]; analysis: any }>({
    explanation: "",
    changes: [],
    analysis: null
  });
  const [showTutorial, setShowTutorial] = useState(true);
  const [highlightedCommunity, setHighlightedCommunity] = useState<number | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'influence' | 'communities' | 'connections'>('influence');

  useEffect(() => {
    setIsClient(true);
    const initialData = generateSocialNetwork();
    setGraphData(initialData);
    setOriginalData(initialData);
    
    // Initial analysis
    const analysis = analyzeNetwork(initialData);
    setCleaningInfo({
      explanation: "📊 Raw social network data loaded. Explore communities, identify influencers, and apply filters to see how data cleaning works.",
      changes: ["Network initialized with 3 communities", `${initialData.nodes.length} total users`, `${initialData.links.length} connections`],
      analysis
    });
  }, []);

  useEffect(() => {
    if (originalData.nodes.length > 0) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const { data, explanation, changes, analysis } = cleanData(originalData, cleanLevel);
        setGraphData(data);
        setCleaningInfo({ explanation, changes, analysis });
        setIsAnalyzing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [cleanLevel, originalData]);

  const influencers = useMemo(() => {
    return [...graphData.nodes]
      .filter(n => n.role === 'influencer')
      .sort((a, b) => b.influence - a.influence);
  }, [graphData.nodes]);

  const resetNetwork = () => {
    setCleanLevel(0);
    const fresh = generateSocialNetwork();
    setOriginalData(fresh);
    setGraphData(fresh);
    setSelectedNode(null);
    setHighlightedCommunity(null);
  };

  const getCommunityBreakdown = () => {
    const breakdown = new Map<number, { count: number, influencers: number, avgInfluence: number }>();
    graphData.nodes.forEach(node => {
      const existing = breakdown.get(node.group) || { count: 0, influencers: 0, avgInfluence: 0 };
      existing.count++;
      existing.avgInfluence += node.influence;
      if (node.role === 'influencer') existing.influencers++;
      breakdown.set(node.group, existing);
    });
    
    return Array.from(breakdown.entries()).map(([id, data]) => ({
      id,
      count: data.count,
      influencers: data.influencers,
      avgInfluence: (data.avgInfluence / data.count) * 100
    }));
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Social Network Analyzer...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Network className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-light">
                  <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    SOCIAL NETWORK ANALYZER
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Live Data Cleaning & Network Analysis Simulator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTutorial(true)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                title="How it works"
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                onClick={resetNetwork}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center gap-2"
                title="Reset Network"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition lg:hidden"
              >
                {showSidebar ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-3xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-purple-400 mb-4">🔬 Social Network Analysis Lab</h2>
              
              <div className="space-y-6 text-slate-300">
                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
                  <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    What You Can Explore
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><span className="text-white">Influence Detection:</span> Identify key influencers (👑) and community hubs (🔗)</li>
                    <li><span className="text-white">Community Structure:</span> Three distinct communities (Tech, Marketing, Content) with different characteristics</li>
                    <li><span className="text-white">Connection Strength:</span> Thicker lines = stronger relationships</li>
                    <li><span className="text-white">Data Cleaning:</span> See how filtering affects network structure in real-time</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-pink-400 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Live Experiments
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-black/30 p-3 rounded-lg">
                      <span className="font-bold text-cyan-400">1. Adjust Cleaning Slider</span>
                      <p className="text-slate-400 text-xs mt-1">Watch how low-influence users disappear first, then weak connections, revealing the core network</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <span className="font-bold text-cyan-400">2. Click Any Node</span>
                      <p className="text-slate-400 text-xs mt-1">See detailed metrics: influence score, role, community membership, and connection count</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <span className="font-bold text-cyan-400">3. Hover Over Nodes</span>
                      <p className="text-slate-400 text-xs mt-1">Quick preview of node information without clicking</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <span className="font-bold text-cyan-400">4. Community Filter</span>
                      <p className="text-slate-400 text-xs mt-1">Click community cards below to highlight specific groups</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                  <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Real-World Application
                  </h3>
                  <p className="text-sm">
                    This simulates how social media analysts process raw data:
                  </p>
                  <ul className="text-xs space-y-1 mt-2 text-slate-400">
                    <li>• <span className="text-white">Raw Data:</span> All users and interactions (like Twitter followers, Facebook friends)</li>
                    <li>• <span className="text-white">Light Cleaning:</span> Remove spam/bot accounts (low influence, few connections)</li>
                    <li>• <span className="text-white">Moderate Cleaning:</span> Focus on active users, identify communities</li>
                    <li>• <span className="text-white">Aggressive Cleaning:</span> Find key opinion leaders for marketing campaigns</li>
                    <li>• <span className="text-white">Maximum Cleaning:</span> Extract core influencer network for partnership identification</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => setShowTutorial(false)}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition w-full font-bold"
              >
                Start Experimenting
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          {showSidebar && (
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Cleaning Control */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
              >
                <h2 className="text-sm font-medium text-purple-400 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  DATA CLEANING SIMULATOR
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-400">Cleaning Intensity</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Raw</span>
                        <span className="text-purple-400 font-mono text-lg font-bold">{cleanLevel}%</span>
                        <span className="text-xs text-slate-500">Clean</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cleanLevel}
                      onChange={(e) => setCleanLevel(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  {isAnalyzing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-purple-400 flex items-center gap-2 bg-purple-500/10 p-3 rounded-lg"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Recalculating network structure...
                    </motion.div>
                  )}

                  {/* Current Operation */}
                  <div className="bg-black/30 p-4 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {cleaningInfo.explanation}
                    </p>
                  </div>

                  {/* Changes Log */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-slate-400">LIVE CHANGES:</h3>
                    {cleaningInfo.changes.map((change, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-xs bg-black/20 p-2 rounded border border-white/5"
                      >
                        {change}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Network Analysis Dashboard */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
              >
                <h2 className="text-sm font-medium text-pink-400 mb-4 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  NETWORK ANALYSIS
                </h2>

                {cleaningInfo.analysis && (
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/30 p-3 rounded-lg">
                        <div className="text-xs text-slate-400">Total Users</div>
                        <div className="text-xl font-bold text-purple-400">{cleaningInfo.analysis.totalNodes}</div>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg">
                        <div className="text-xs text-slate-400">Connections</div>
                        <div className="text-xl font-bold text-pink-400">{cleaningInfo.analysis.totalLinks}</div>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg">
                        <div className="text-xs text-slate-400">Avg Influence</div>
                        <div className="text-lg font-bold text-green-400">{cleaningInfo.analysis.avgInfluence.toFixed(1)}%</div>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg">
                        <div className="text-xs text-slate-400">Density</div>
                        <div className="text-lg font-bold text-blue-400">{cleaningInfo.analysis.density.toFixed(1)}%</div>
                      </div>
                    </div>

                    {/* Communities */}
                    <div>
                      <h3 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Communities
                      </h3>
                      <div className="space-y-2">
                        {getCommunityBreakdown().map(comm => (
                          <motion.div
                            key={comm.id}
                            className={`p-3 rounded-lg cursor-pointer transition ${
                              highlightedCommunity === comm.id ? 'bg-purple-500/30 border border-purple-500' : 'bg-black/30 hover:bg-black/50'
                            }`}
                            onClick={() => setHighlightedCommunity(highlightedCommunity === comm.id ? null : comm.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ 
                                  backgroundColor: comm.id === 1 ? '#9333EA' : comm.id === 2 ? '#EC4899' : '#3B82F6' 
                                }} />
                                <span className="text-sm">
                                  {comm.id === 1 ? 'Tech' : comm.id === 2 ? 'Marketing' : 'Content'}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400">{comm.count} users</span>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>Influencers: {comm.influencers}</div>
                              <div>Avg Inf: {comm.avgInfluence.toFixed(1)}%</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Top Influencers */}
                    <div>
                      <h3 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Key Influencers
                      </h3>
                      <div className="space-y-2">
                        {influencers.slice(0, 3).map((inf, idx) => (
                          <div
                            key={inf.id}
                            className="flex items-center justify-between p-2 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 transition"
                            onClick={() => setSelectedNode(inf)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400">👑</span>
                              <span className="text-sm">{inf.label}</span>
                            </div>
                            <span className="text-xs text-purple-400">{(inf.influence * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Main Graph */}
          <div className={`${showSidebar ? 'col-span-12 lg:col-span-8' : 'col-span-12'}`}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
              style={{ height: '700px' }}
            >
              <NetworkGraph2D
                data={graphData}
                onNodeClick={setSelectedNode}
                selectedNode={selectedNode}
                cleaningLevel={cleanLevel}
                highlightedCommunity={highlightedCommunity}
              />

              {/* Selected Node Details */}
              <AnimatePresence>
                {selectedNode && (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="absolute top-6 right-6 w-72 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 p-5 shadow-2xl"
                  >
                    <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                      {selectedNode.role === 'influencer' && '👑'}
                      {selectedNode.label}
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex justify-between text-slate-400">
                          <span>Influence Score</span>
                          <span className="text-purple-400 font-bold">{(selectedNode.influence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1 rounded-full mt-1">
                          <div 
                            className="bg-purple-400 h-1 rounded-full"
                            style={{ width: `${selectedNode.influence * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Role</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          selectedNode.role === 'influencer' ? 'bg-yellow-500/20 text-yellow-400' :
                          selectedNode.role === 'hub' ? 'bg-cyan-500/20 text-cyan-400' :
                          selectedNode.role === 'isolated' ? 'bg-slate-500/20 text-slate-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {selectedNode.role === 'influencer' ? '👑 Key Influencer' :
                           selectedNode.role === 'hub' ? '🔗 Community Hub' :
                           selectedNode.role === 'isolated' ? '📡 Isolated' :
                           '👤 Regular Member'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Community</span>
                        <span className="text-cyan-400">
                          {selectedNode.group === 1 ? 'Tech' :
                           selectedNode.group === 2 ? 'Marketing' :
                           selectedNode.group === 3 ? 'Content' : 'Other'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Connections</span>
                        <span className="text-pink-400">
                          {graphData.links.filter(l => 
                            l.source === selectedNode.id || l.target === selectedNode.id
                          ).length}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-white/10">
                        <p className="text-xs text-slate-500 italic">
                          {selectedNode.role === 'influencer' ? 'High influence user with many strong connections. Key for viral marketing.' :
                           selectedNode.role === 'hub' ? 'Connects many users within community. Important for information flow.' :
                           selectedNode.role === 'isolated' ? 'Few connections. May represent inactive or new user.' :
                           'Regular community member with moderate influence.'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Filter Tips */}
              <div className="absolute bottom-6 left-6 flex gap-2">
                <div className="bg-black/50 backdrop-blur rounded-lg px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
                  <span>👑 Influencer</span>
                  <span>🔗 Hub</span>
                  <span>👤 Member</span>
                  <span>📡 Isolated</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Clean Levels */}
            <div className="mt-4 grid grid-cols-5 gap-2">
              {[0, 25, 50, 75, 100].map(level => (
                <button
                  key={level}
                  onClick={() => setCleanLevel(level)}
                  className={`relative group ${cleanLevel === level ? 'z-10' : ''}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-100 transition blur ${
                    cleanLevel === level ? 'opacity-100' : ''
                  }`} />
                  <div className={`relative border rounded-lg p-2 text-center transition ${
                    cleanLevel === level 
                      ? 'bg-purple-500 border-purple-400 text-white' 
                      : 'bg-black/50 border-white/10 hover:bg-black/70 text-slate-400'
                  }`}>
                    <div className="text-xs font-medium">
                      {level === 0 ? 'Raw' :
                       level === 25 ? 'Light' :
                       level === 50 ? 'Moderate' :
                       level === 75 ? 'Aggressive' :
                       'Maximum'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}