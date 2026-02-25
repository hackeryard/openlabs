"use client";
// app/blockchain-graph-visualizer/page.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlockchainGraphVisualizer() {
  // ==================== STATE MANAGEMENT ====================
  // Blockchain Core
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [networkNodes, setNetworkNodes] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Visualization States
  const [viewMode, setViewMode] = useState('3d'); // '2d', '3d', 'graph'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [highlightPath, setHighlightPath] = useState([]);
  
  // Experiment States
  const [currentExperiment, setCurrentExperiment] = useState('immutability');
  const [experimentStep, setExperimentStep] = useState(0);
  const [attackActive, setAttackActive] = useState(false);
  const [attackType, setAttackType] = useState(null);
  const [attackProgress, setAttackProgress] = useState([]);
  const [maliciousNodes, setMaliciousNodes] = useState([]);
  const [tamperedBlocks, setTamperedBlocks] = useState([]);
  const [consensusStatus, setConsensusStatus] = useState('healthy');
  
  // Transaction Flow
  const [transactionPool, setTransactionPool] = useState([]);
  const [transactionGraph, setTransactionGraph] = useState({ nodes: [], links: [] });
  const [selectedPath, setSelectedPath] = useState([]);
  
  // Refs for canvas
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const animationRef = useRef(null);
  
  // ==================== INITIALIZATION ====================
  useEffect(() => {
    initializeBlockchain();
    initializeNetwork();
  }, []);
  
  useEffect(() => {
    if (canvasRef.current) {
      if (viewMode === '3d') draw3DVisualization();
      else if (viewMode === 'graph') drawGraphVisualization();
      else draw2DVisualization();
    }
  }, [blocks, networkNodes, selectedBlock, viewMode, zoomLevel, rotation, attackActive]);

  // ==================== BLOCKCHAIN CORE FUNCTIONS ====================
  const initializeBlockchain = () => {
    // Create genesis block
    const genesisBlock = {
      id: 'block_0',
      index: 0,
      timestamp: Date.now(),
      transactions: [{
        id: 'tx_genesis',
        from: 'SYSTEM',
        to: 'GENESIS',
        amount: 1000,
        type: 'coinbase',
        timestamp: Date.now(),
        signature: '0x' + 'f'.repeat(64)
      }],
      previousHash: '0'.repeat(64),
      hash: calculateHash(0, [], '0'.repeat(64), 0),
      nonce: 0,
      miner: 'System',
      size: 1024,
      version: 1,
      merkleRoot: '0x' + 'a'.repeat(64)
    };
    
    setBlocks([genesisBlock]);
    setTransactions(genesisBlock.transactions);
    setTransactionPool([]);
  };

  const initializeNetwork = () => {
    // Create initial network nodes (miners/validators)
    const nodes = [];
    for (let i = 0; i < 10; i++) {
      nodes.push({
        id: `node_${i}`,
        type: i < 7 ? 'honest' : 'malicious',
        status: 'active',
        blocksMined: 0,
        peers: getRandomPeers(i, 10),
        location: {
          x: Math.random() * 800 + 100,
          y: Math.random() * 400 + 50,
          z: Math.random() * 200
        },
        hashrate: Math.random() * 100,
        stake: Math.random() * 10000,
        version: `v1.0.${Math.floor(Math.random() * 5)}`
      });
    }
    setNetworkNodes(nodes);
  };

  const calculateHash = (index, transactions, previousHash, nonce) => {
    const data = index + JSON.stringify(transactions) + previousHash + nonce;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0').substring(0, 16);
  };

  // ==================== TRANSACTION FUNCTIONS ====================
  const createTransaction = (from, to, amount, type = 'transfer') => {
    const transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from,
      to,
      amount,
      type,
      timestamp: Date.now(),
      status: 'pending',
      signature: '0x' + Math.random().toString(36).substr(2, 64),
      confirmations: 0,
      gasUsed: Math.floor(Math.random() * 100000),
      gasPrice: Math.floor(Math.random() * 50) + 10
    };
    
    setTransactionPool(prev => [...prev, transaction]);
    updateTransactionGraph(transaction);
    return transaction;
  };

  const updateTransactionGraph = (newTx) => {
    setTransactionGraph(prev => {
      const newNodes = [...prev.nodes];
      const newLinks = [...prev.links];
      
      // Add sender node if not exists
      if (!newNodes.find(n => n.id === newTx.from)) {
        newNodes.push({ id: newTx.from, type: 'address', value: newTx.amount });
      }
      
      // Add receiver node if not exists
      if (!newNodes.find(n => n.id === newTx.to)) {
        newNodes.push({ id: newTx.to, type: 'address', value: 0 });
      }
      
      // Add transaction link
      newLinks.push({
        source: newTx.from,
        target: newTx.to,
        value: newTx.amount,
        id: newTx.id,
        timestamp: newTx.timestamp
      });
      
      return { nodes: newNodes, links: newLinks };
    });
  };

  // ==================== MINING SIMULATION ====================
  const mineBlock = (minerId) => {
    if (transactionPool.length === 0) return;
    
    const selectedTxs = transactionPool.slice(0, 5);
    const newBlock = {
      id: `block_${blocks.length}`,
      index: blocks.length,
      timestamp: Date.now(),
      transactions: selectedTxs,
      previousHash: blocks[blocks.length - 1].hash,
      hash: calculateHash(blocks.length, selectedTxs, blocks[blocks.length - 1].hash, Math.floor(Math.random() * 1000000)),
      nonce: Math.floor(Math.random() * 1000000),
      miner: minerId,
      size: 2048 + Math.random() * 1024,
      version: 2,
      merkleRoot: '0x' + Math.random().toString(36).substr(2, 64)
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setTransactionPool(prev => prev.slice(5));
    setTransactions(prev => [...prev, ...selectedTxs]);
    
    // Update miner stats
    setNetworkNodes(prev => prev.map(node => 
      node.id === minerId 
        ? { ...node, blocksMined: node.blocksMined + 1 }
        : node
    ));
  };

  // ==================== ATTACK SIMULATIONS ====================
  const simulate51PercentAttack = () => {
    setAttackType('51percent');
    setAttackActive(true);
    setCurrentExperiment('attack');
    
    const steps = [
      { step: 1, description: "Attacker gains >50% hashing power", action: "accumulate_power" },
      { step: 2, description: "Attacker mines private fork", action: "mine_fork" },
      { step: 3, description: "Attacker spends coins on main chain", action: "spend_coins" },
      { step: 4, description: "Attacker releases longer fork", action: "release_fork" },
      { step: 5, description: "Network reorganizes to attacker's chain", action: "reorg" }
    ];
    
    setAttackProgress(steps);
    setExperimentStep(0);
    
    // Visual simulation
    const interval = setInterval(() => {
      setExperimentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 2000);
  };

  const simulateSybilAttack = () => {
    setAttackType('sybil');
    setAttackActive(true);
    
    // Add malicious nodes
    const newMaliciousNodes = [];
    for (let i = 0; i < 15; i++) {
      newMaliciousNodes.push({
        id: `malicious_${i}`,
        type: 'malicious',
        status: 'active',
        peers: [],
        location: {
          x: Math.random() * 800 + 100,
          y: Math.random() * 400 + 50,
          z: Math.random() * 200
        }
      });
    }
    
    setMaliciousNodes(newMaliciousNodes);
    setNetworkNodes(prev => [...prev, ...newMaliciousNodes]);
  };

  const simulateEclipseAttack = (targetNode) => {
    setAttackType('eclipse');
    setAttackActive(true);
    
    // Isolate target node by controlling all its connections
    setNetworkNodes(prev => prev.map(node => {
      if (node.id === targetNode) {
        return { ...node, status: 'isolated', peers: [] };
      }
      return node;
    }));
  };

  const simulateDoubleSpend = () => {
    setAttackType('doublespend');
    setAttackActive(true);
    
    // Create conflicting transactions
    const tx1 = createTransaction('attacker', 'merchant', 100);
    const tx2 = createTransaction('attacker', 'attacker_other', 100);
    
    setTransactionPool([tx1, tx2]);
  };

  // ==================== IMMUTABILITY DEMONSTRATION ====================
  const demonstrateImmutability = () => {
    setCurrentExperiment('immutability');
    setExperimentStep(0);
    
    const steps = [
      { 
        step: 1, 
        description: "Block 5 contains transaction: Alice → Bob (10 BTC)",
        action: "show_block",
        blockIndex: 5
      },
      { 
        step: 2, 
        description: "Attacker tries to modify transaction to: Alice → Attacker (10 BTC)",
        action: "modify_block",
        blockIndex: 5
      },
      { 
        step: 3, 
        description: "Block hash changes! Original: 0x7d3a... New: 0x9f8b...",
        action: "hash_change"
      },
      { 
        step: 4, 
        description: "All subsequent blocks (6,7,8) now have invalid previous hash",
        action: "chain_break"
      },
      { 
        step: 5, 
        description: "Network detects inconsistency - rejects modified block",
        action: "reject"
      }
    ];
    
    setAttackProgress(steps);
    
    // Visual demonstration
    const interval = setInterval(() => {
      setExperimentStep(prev => {
        if (prev < steps.length - 1) {
          // Show tampering effect
          if (prev === 1) {
            setTamperedBlocks([5]);
          } else if (prev === 3) {
            setTamperedBlocks([5, 6, 7, 8]);
          }
          return prev + 1;
        } else {
          clearInterval(interval);
          setConsensusStatus('recovered');
          return prev;
        }
      });
    }, 2000);
  };

  // ==================== VISUALIZATION FUNCTIONS ====================
  const draw3DVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 3D perspective transform
    const perspective = 500;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw blocks in 3D space
    blocks.forEach((block, i) => {
      const x = (i - blocks.length/2) * 120;
      const y = 0;
      const z = Math.sin(i * 0.5) * 50;
      
      // Apply 3D projection
      const scale = perspective / (perspective + z);
      const projectedX = centerX + x * scale;
      const projectedY = centerY + y * scale - 100;
      
      // Apply rotation
      const rotatedX = projectedX * Math.cos(rotation.y) - projectedY * Math.sin(rotation.y);
      const rotatedY = projectedX * Math.sin(rotation.y) + projectedY * Math.cos(rotation.y);
      
      // Draw block with 3D effect
      const blockWidth = 80 * scale;
      const blockHeight = 60 * scale;
      
      // Block shadow
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 10 * scale;
      ctx.shadowOffsetX = 5 * scale;
      ctx.shadowOffsetY = 5 * scale;
      
      // Block color based on status
      if (tamperedBlocks.includes(block.index)) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      } else if (selectedBlock === block.id) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
      } else {
        const gradient = ctx.createLinearGradient(
          rotatedX, rotatedY, 
          rotatedX + blockWidth, rotatedY + blockHeight
        );
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(1, '#7c3aed');
        ctx.fillStyle = gradient;
      }
      
      ctx.fillRect(rotatedX, rotatedY, blockWidth, blockHeight);
      
      // Block border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(rotatedX, rotatedY, blockWidth, blockHeight);
      
      // Block number
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${12 * scale}px monospace`;
      ctx.fillText(`#${block.index}`, rotatedX + 10 * scale, rotatedY + 20 * scale);
      
      // Transaction count
      ctx.font = `${10 * scale}px monospace`;
      ctx.fillText(`📦 ${block.transactions.length}`, rotatedX + 10 * scale, rotatedY + 40 * scale);
      
      // Chain links
      if (i > 0) {
        const prevX = centerX + ((i-1) - blocks.length/2) * 120 * scale;
        const prevY = centerY - 100;
        
        ctx.beginPath();
        ctx.moveTo(rotatedX - 20 * scale, rotatedY + blockHeight/2);
        ctx.lineTo(prevX + 80 * scale + 20 * scale, prevY + blockHeight/2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
    
    // Draw network nodes in 3D
    networkNodes.forEach((node, i) => {
      const angle = (i / networkNodes.length) * Math.PI * 2;
      const radius = 200;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(angle * 2) * 50;
      
      const scale = perspective / (perspective + z);
      const projectedX = centerX + x * scale;
      const projectedY = centerY + y * scale;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(projectedX, projectedY, 15 * scale, 0, Math.PI * 2);
      
      if (node.type === 'malicious' || maliciousNodes.includes(node)) {
        ctx.fillStyle = '#ef4444';
      } else if (node.status === 'isolated') {
        ctx.fillStyle = '#f59e0b';
      } else {
        ctx.fillStyle = '#3b82f6';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Node label
      if (showLabels) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `${10 * scale}px monospace`;
        ctx.fillText(node.id, projectedX - 20 * scale, projectedY - 20 * scale);
      }
    });
  };

  const drawGraphVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create force-directed layout
    const nodes = transactionGraph.nodes.map((node, i) => ({
      ...node,
      x: centerX + Math.cos(i * 2.3) * 200,
      y: centerY + Math.sin(i * 1.7) * 150,
      vx: 0,
      vy: 0
    }));
    
    // Simple force simulation
    for (let iter = 0; iter < 50; iter++) {
      // Repulsive forces between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 1000 / (distance * distance);
          
          nodes[i].vx -= (dx / distance) * force;
          nodes[i].vy -= (dy / distance) * force;
          nodes[j].vx += (dx / distance) * force;
          nodes[j].vy += (dy / distance) * force;
        }
      }
      
      // Attractive forces from links
      transactionGraph.links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = distance / 20;
          
          source.vx += (dx / distance) * force;
          source.vy += (dy / distance) * force;
          target.vx -= (dx / distance) * force;
          target.vy -= (dy / distance) * force;
        }
      });
      
      // Apply velocity
      nodes.forEach(node => {
        node.x += node.vx * 0.1;
        node.y += node.vy * 0.1;
        node.vx *= 0.9;
        node.vy *= 0.9;
      });
    }
    
    // Draw links
    transactionGraph.links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        
        // Highlight selected path
        if (selectedPath.includes(link.id)) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 4;
        } else {
          ctx.strokeStyle = `rgba(79, 70, 229, ${link.value / 100})`;
          ctx.lineWidth = 2;
        }
        
        ctx.stroke();
        
        // Draw arrow
        const angle = Math.atan2(target.y - source.y, target.x - source.x);
        const arrowSize = 10;
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.moveTo(target.x, target.y);
        ctx.lineTo(
          target.x - arrowSize * Math.cos(angle - 0.3),
          target.y - arrowSize * Math.sin(angle - 0.3)
        );
        ctx.lineTo(
          target.x - arrowSize * Math.cos(angle + 0.3),
          target.y - arrowSize * Math.sin(angle + 0.3)
        );
        ctx.closePath();
        ctx.fill();
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      
      if (node.type === 'malicious') {
        ctx.fillStyle = '#ef4444';
      } else if (node.id === selectedTransaction) {
        ctx.fillStyle = '#f59e0b';
      } else {
        ctx.fillStyle = '#4f46e5';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Node label
      if (showLabels) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(node.id.substring(0, 6), node.x - 20, node.y - 25);
        
        // Value
        if (node.value) {
          ctx.fillStyle = '#10b981';
          ctx.font = '10px monospace';
          ctx.fillText(`${node.value} BTC`, node.x - 20, node.y + 35);
        }
      }
    });
  };

  const draw2DVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const startX = 100;
    const y = 150;
    const blockWidth = 100;
    const blockHeight = 80;
    
    // Draw blockchain
    blocks.forEach((block, i) => {
      const x = startX + i * (blockWidth + 30);
      
      // Block shadow
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 5;
      
      // Block background
      if (tamperedBlocks.includes(block.index)) {
        ctx.fillStyle = '#fee2e2';
      } else if (selectedBlock === block.id) {
        ctx.fillStyle = '#fef3c7';
      } else {
        ctx.fillStyle = '#e0e7ff';
      }
      
      ctx.fillRect(x, y, blockWidth, blockHeight);
      
      // Block border
      ctx.strokeStyle = tamperedBlocks.includes(block.index) ? '#ef4444' : '#4f46e5';
      ctx.lineWidth = tamperedBlocks.includes(block.index) ? 3 : 2;
      ctx.strokeRect(x, y, blockWidth, blockHeight);
      
      // Chain link
      if (i > 0) {
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x - 30, y + blockHeight/2);
        ctx.lineTo(x - 5, y + blockHeight/2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Hash label
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(block.previousHash.substring(0, 8) + '...', x - 60, y + blockHeight/2 - 10);
      }
      
      // Block content
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`#${block.index}`, x + 10, y + 20);
      
      ctx.font = '9px monospace';
      ctx.fillStyle = '#4b5563';
      ctx.fillText(`Hash: ${block.hash.substring(0, 8)}...`, x + 10, y + 40);
      ctx.fillText(`Txs: ${block.transactions.length}`, x + 10, y + 55);
      ctx.fillText(`Nonce: ${block.nonce}`, x + 10, y + 70);
      
      // Transactions preview
      if (block.transactions.length > 0 && showLabels) {
        ctx.fillStyle = '#059669';
        ctx.font = '8px monospace';
        ctx.fillText(block.transactions[0].from + '→' + block.transactions[0].to, x + 10, y + 90);
      }
    });
    
    // Draw network overlay
    ctx.globalAlpha = 0.3;
    networkNodes.forEach((node, i) => {
      const angle = (i / networkNodes.length) * Math.PI * 2;
      const radius = 300;
      const x = 500 + Math.cos(angle) * radius;
      const y = 300 + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'malicious' ? '#ef4444' : '#3b82f6';
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  };

  // ==================== HELPER FUNCTIONS ====================
  const getRandomPeers = (index, total) => {
    const peers = [];
    for (let i = 0; i < 3; i++) {
      const peer = Math.floor(Math.random() * total);
      if (peer !== index && !peers.includes(peer)) {
        peers.push(peer);
      }
    }
    return peers;
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🔗 Blockchain Graph Visualizer
            </h1>
            <p className="text-gray-400 mt-1">Interactive blockchain analysis & attack simulation</p>
          </div>
          
          {/* View Controls */}
          <div className="flex gap-2 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-4 py-2 rounded-md transition ${
                viewMode === '2d' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'
              }`}
            >
              2D View
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded-md transition ${
                viewMode === '3d' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'
              }`}
            >
              3D View
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-4 py-2 rounded-md transition ${
                viewMode === 'graph' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'
              }`}
            >
              Graph View
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-12 gap-4">
        {/* Left Sidebar - Controls */}
        <div className="col-span-3 space-y-4">
          {/* Transaction Creation */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Create Transaction
            </h2>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="From Address"
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-sm"
                defaultValue="Alice"
              />
              <input
                type="text"
                placeholder="To Address"
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-sm"
                defaultValue="Bob"
              />
              <input
                type="number"
                placeholder="Amount (BTC)"
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-sm"
                defaultValue="10"
              />
              <button
                onClick={() => createTransaction('Alice', 'Bob', 10)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 py-2 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition"
              >
                ➕ Create Transaction
              </button>
            </div>
          </div>

          {/* Mining Controls */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-bold mb-3">⛏️ Mining Controls</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => mineBlock('node_1')}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 py-2 rounded-lg font-bold hover:from-yellow-700 hover:to-orange-700 transition"
              >
                Mine Block
              </button>
              
              <div className="text-sm text-gray-400 mt-2">
                <div>Pending Txs: {transactionPool.length}</div>
                <div>Blocks: {blocks.length}</div>
                <div>Network Nodes: {networkNodes.length}</div>
              </div>
            </div>
          </div>

          {/* Attack Simulations */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-bold mb-3">⚔️ Attack Simulations</h2>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={simulate51PercentAttack}
                className="p-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-900 text-sm"
              >
                51% Attack
              </button>
              <button
                onClick={simulateSybilAttack}
                className="p-2 bg-orange-900/50 text-orange-300 rounded-lg hover:bg-orange-900 text-sm"
              >
                Sybil Attack
              </button>
              <button
                onClick={() => simulateEclipseAttack('node_0')}
                className="p-2 bg-yellow-900/50 text-yellow-300 rounded-lg hover:bg-yellow-900 text-sm"
              >
                Eclipse Attack
              </button>
              <button
                onClick={simulateDoubleSpend}
                className="p-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900 text-sm"
              >
                Double Spend
              </button>
            </div>
          </div>

          {/* Immutability Demo */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-bold mb-3">🔒 Immutability Demo</h2>
            
            <button
              onClick={demonstrateImmutability}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition mb-3"
            >
              Show Why Blockchain Can't Be Changed
            </button>
            
            {currentExperiment === 'immutability' && (
              <div className="space-y-2">
                {attackProgress.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: i <= experimentStep ? 1 : 0.3,
                      x: 0,
                      scale: i === experimentStep ? 1.05 : 1
                    }}
                    className={`p-2 rounded text-sm ${
                      i <= experimentStep 
                        ? i === experimentStep 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-600/20 text-green-300'
                        : 'bg-gray-700 text-gray-500'
                    }`}
                  >
                    <span className="font-mono mr-2">[{i + 1}]</span>
                    {step.description}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="col-span-6">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">📊 Live Visualization</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setZoomLevel(z => Math.min(z + 0.1, 2))}
                  className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  🔍+
                </button>
                <button
                  onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.5))}
                  className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  🔍-
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`p-1 rounded ${
                    showLabels ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  🏷️
                </button>
              </div>
            </div>
            
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full h-full"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                onMouseMove={(e) => {
                  if (viewMode === '3d' && e.buttons === 1) {
                    setRotation(prev => ({
                      x: prev.x + e.movementY * 0.01,
                      y: prev.y + e.movementX * 0.01
                    }));
                  }
                }}
              />
              
              {/* Attack Overlay */}
              {attackActive && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                  ⚠️ {attackType} Attack Active
                </div>
              )}
            </div>
            
            {/* Block Details */}
            {selectedBlock && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-gray-700 rounded-lg"
              >
                <h3 className="font-bold mb-2">Block Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Hash: {selectedBlock.substring(0, 16)}...</div>
                  <div>Transactions: {blocks.find(b => b.id === selectedBlock)?.transactions.length}</div>
                  <div>Timestamp: {new Date().toLocaleTimeString()}</div>
                  <div>Miner: Node_1</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Analysis */}
        <div className="col-span-3 space-y-4">
          {/* Transaction Pool */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-bold mb-3">📥 Transaction Pool</h2>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {transactionPool.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-2 bg-gray-700 rounded text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="font-mono text-blue-300">{tx.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono text-green-300">{tx.to}</span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span className="text-yellow-300">{tx.amount} BTC</span>
                      <span className="text-gray-400">Gas: {tx.gasPrice} Gwei</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Network Health */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-bold mb-3">🌐 Network Health</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Consensus:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  consensusStatus === 'healthy' 
                    ? 'bg-green-600' 
                    : 'bg-red-600 animate-pulse'
                }`}>
                  {consensusStatus}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Honest Nodes:</span>
                <span className="text-green-400">
                  {networkNodes.filter(n => n.type === 'honest').length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Malicious Nodes:</span>
                <span className="text-red-400">
                  {maliciousNodes.length + networkNodes.filter(n => n.type === 'malicious').length}
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                  style={{ 
                    width: `${(networkNodes.filter(n => n.type === 'honest').length / networkNodes.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Attack Analysis */}
          {attackActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-xl p-4 border border-red-700"
            >
              <h2 className="text-lg font-bold mb-3 text-red-400">📊 Attack Analysis</h2>
              
              <div className="space-y-2 text-sm">
                {attackProgress.map((step, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${
                      i <= experimentStep 
                        ? i === experimentStep 
                          ? 'bg-red-600' 
                          : 'bg-red-900/50'
                        : 'bg-gray-700 text-gray-500'
                    }`}
                  >
                    {step.description}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Statistics */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-bold mb-3">📈 Statistics</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-2xl font-bold text-blue-400">{blocks.length}</div>
                <div className="text-xs text-gray-400">Total Blocks</div>
              </div>
              
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-2xl font-bold text-green-400">{transactions.length}</div>
                <div className="text-xs text-gray-400">Transactions</div>
              </div>
              
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {blocks.reduce((acc, b) => acc + b.transactions.length, 0)}
                </div>
                <div className="text-xs text-gray-400">Total Txs</div>
              </div>
              
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {networkNodes.length}
                </div>
                <div className="text-xs text-gray-400">Nodes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Experiment Steps */}
      <div className="max-w-7xl mx-auto p-4 mt-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h2 className="text-lg font-bold mb-3">📋 Step-by-Step Experiment Guide</h2>
          
          <div className="grid grid-cols-5 gap-2">
            {[
              "1. Create Transaction",
              "2. Add to Mempool",
              "3. Mine Block",
              "4. Validate Chain", 
              "5. Test Immutability"
            ].map((step, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-center text-sm ${
                  i === experimentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}