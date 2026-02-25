"use client";

import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";

type Protocol = "TCP" | "UDP";
type Mode = "send" | "receive";

interface Layer {
  id: number;
  name: string;
  pdu: string;
  description: string;
  color: string;
  icon: string;
  details: {
    function: string;
    protocols: string[];
    devices: string[];
    example: string;
    quiz: {
      question: string;
      answer: string;
    };
  };
}

const layers: Layer[] = [
  { 
    id: 7, 
    name: "Application", 
    pdu: "Data", 
    description: "User-level network services - where applications interact with the network.",
    color: "bg-purple-500",
    icon: "💻",
    details: {
      function: "Provides network services to user applications (HTTP, FTP, SMTP, DNS)",
      protocols: ["HTTP/HTTPS", "FTP", "SMTP", "DNS", "DHCP", "SSH"],
      devices: ["Gateway", "Firewall", "Proxy Server"],
      example: "Your web browser sending an HTTP request to load a website",
      quiz: {
        question: "Which protocol operates at the Application layer?",
        answer: "HTTP, FTP, SMTP, DNS, DHCP, and SSH are all Application layer protocols"
      }
    }
  },
  { 
    id: 6, 
    name: "Presentation", 
    pdu: "Data", 
    description: "Data translation, encryption, and compression - ensures data is readable.",
    color: "bg-pink-500",
    icon: "🔐",
    details: {
      function: "Translates data formats, handles encryption/decryption, and compression",
      protocols: ["SSL/TLS", "JPEG", "MPEG", "GIF", "ASCII", "EBCDIC"],
      devices: ["Gateway", "Redirector"],
      example: "Converting JSON data to XML or encrypting data with SSL",
      quiz: {
        question: "What is the main function of the Presentation layer?",
        answer: "Data translation, encryption/decryption, and compression"
      }
    }
  },
  { 
    id: 5, 
    name: "Session", 
    pdu: "Data", 
    description: "Manages sessions between applications - establishes, maintains, and terminates connections.",
    color: "bg-yellow-500",
    icon: "🔌",
    details: {
      function: "Controls dialogue between devices (establish, maintain, synchronize, terminate)",
      protocols: ["NetBIOS", "PPTP", "RPC", "SAP", "L2TP"],
      devices: ["Gateway", "Firewall"],
      example: "A video call maintaining your session even when switching networks",
      quiz: {
        question: "What does the Session layer manage?",
        answer: "It establishes, maintains, and terminates connections between applications"
      }
    }
  },
  { 
    id: 4, 
    name: "Transport", 
    pdu: "Segment", 
    description: "End-to-end communication and error recovery - TCP for reliability, UDP for speed.",
    color: "bg-green-500",
    icon: "📦",
    details: {
      function: "Provides reliable or unreliable delivery, error checking, flow control",
      protocols: ["TCP", "UDP", "SPX", "SCTP"],
      devices: ["Gateway", "Firewall", "Load Balancer"],
      example: "TCP ensures your email arrives completely; UDP enables live video streaming",
      quiz: {
        question: "What's the difference between TCP and UDP?",
        answer: "TCP is connection-oriented and reliable, UDP is connectionless and faster but less reliable"
      }
    }
  },
  { 
    id: 3, 
    name: "Network", 
    pdu: "Packet", 
    description: "Logical addressing and routing - determines the best path for data.",
    color: "bg-blue-500",
    icon: "🌐",
    details: {
      function: "Handles routing, logical addressing (IP), and path determination",
      protocols: ["IP", "ICMP", "ARP", "RIP", "OSPF", "BGP"],
      devices: ["Router", "Layer 3 Switch", "Firewall"],
      example: "Your packet traveling through multiple routers to reach a server in another country",
      quiz: {
        question: "What device primarily operates at the Network layer?",
        answer: "Routers operate at the Network layer, handling IP addressing and routing"
      }
    }
  },
  { 
    id: 2, 
    name: "Data Link", 
    pdu: "Frame", 
    description: "Node-to-node delivery and error detection - organizes bits into frames.",
    color: "bg-orange-500",
    icon: "🔗",
    details: {
      function: "Provides node-to-node delivery, error detection, and MAC addressing",
      protocols: ["Ethernet", "PPP", "HDLC", "Frame Relay", "VLAN"],
      devices: ["Switch", "Bridge", "NIC", "Access Point"],
      example: "Your computer sending data to the local router via Ethernet",
      quiz: {
        question: "What addressing scheme is used at the Data Link layer?",
        answer: "MAC (Media Access Control) addresses are used at the Data Link layer"
      }
    }
  },
  { 
    id: 1, 
    name: "Physical", 
    pdu: "Bits", 
    description: "Physical transmission of raw bits over network media.",
    color: "bg-red-500",
    icon: "⚡",
    details: {
      function: "Transmits raw bits over physical medium (cables, radio waves, fiber)",
      protocols: ["Ethernet", "USB", "Bluetooth", "WiFi", "DSL", "ISDN"],
      devices: ["Hub", "Repeater", "Cable", "Fiber Optic", "NIC"],
      example: "Electrical signals traveling through an Ethernet cable or radio waves through the air",
      quiz: {
        question: "What is the PDU at the Physical layer?",
        answer: "Bits are the Protocol Data Unit at the Physical layer"
      }
    }
  },
];

const dataFlowSteps = [
  {
    title: "1. Application Layer (Layer 7)",
    description: "User data is created by applications (browser, email client, etc.)",
    details: "Data starts here as raw application data"
  },
  {
    title: "2. Presentation Layer (Layer 6)",
    description: "Data is formatted, encrypted, and compressed",
    details: "Adds formatting and encryption headers"
  },
  {
    title: "3. Session Layer (Layer 5)",
    description: "Session management and synchronization",
    details: "Establishes and maintains the connection"
  },
  {
    title: "4. Transport Layer (Layer 4)",
    description: "Data is broken into segments (TCP) or datagrams (UDP)",
    details: "Adds port numbers and sequence information"
  },
  {
    title: "5. Network Layer (Layer 3)",
    description: "Packets are created with source/destination IP addresses",
    details: "Adds logical addressing for routing"
  },
  {
    title: "6. Data Link Layer (Layer 2)",
    description: "Frames are created with MAC addresses",
    details: "Adds physical addressing for local network delivery"
  },
  {
    title: "7. Physical Layer (Layer 1)",
    description: "Bits are transmitted over physical medium",
    details: "Converts frames to electrical/optical signals"
  }
];

export default function OSIModel2D() {
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("send");
  const [protocol, setProtocol] = useState<Protocol>("TCP");
  const [message, setMessage] = useState("Hello OpenLabs 🚀");
  const [stack, setStack] = useState<string[]>([]);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const [packetAnimation, setPacketAnimation] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [selectedFlowStep, setSelectedFlowStep] = useState<number | null>(null);

  useEffect(() => {
    if (activeLayer) {
      const timer = setTimeout(() => {
        if (mode === "send" && activeLayer < 7) {
          setActiveLayer(activeLayer + 1);
        } else if (mode === "receive" && activeLayer > 1) {
          setActiveLayer(activeLayer - 1);
        } else {
          setActiveLayer(null);
          setPacketAnimation(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeLayer, mode]);

  const runSimulation = () => {
    setPacketAnimation(true);
    setExplanation("");
    
    if (mode === "send") {
      const encapsulated = layers.map((layer) => 
        `${layer.pdu} (Layer ${layer.id}: ${layer.name})`
      );
      setStack(encapsulated);
      setActiveLayer(1);
      setExplanation("Starting encapsulation from Physical layer...");
    } else {
      const decapsulated = [...layers.map((l) => 
        `${l.pdu} (Layer ${l.id}: ${l.name})`
      )].reverse();
      setStack(decapsulated);
      setActiveLayer(7);
      setExplanation("Starting decapsulation from Application layer...");
    }
  };

  const resetSimulation = () => {
    setStack([]);
    setActiveLayer(null);
    setPacketAnimation(false);
    setExplanation("");
  };

  const openLayerModal = (layer: Layer) => {
    setSelectedLayer(layer);
    setIsModalOpen(true);
  };

  const getLayerStatus = (layerId: number) => {
    if (activeLayer === layerId) return "active";
    if (mode === "send" && layerId < (activeLayer || 0)) return "completed";
    if (mode === "receive" && layerId > (activeLayer || 0)) return "completed";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">OSI Model Interactive Simulator</h1>
          <p className="text-slate-300">Learn how data flows through the 7 layers of the OSI model</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* LEFT - OSI STACK */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white mb-4">OSI Layers</h2>
            {layers.map((layer) => (
              <motion.div
                key={layer.id}
                whileHover={{ scale: 1.02, x: 10 }}
                onHoverStart={() => setHoveredLayer(layer.id)}
                onHoverEnd={() => setHoveredLayer(null)}
                onClick={() => openLayerModal(layer)}
                className={`
                  ${layer.color} cursor-pointer p-4 rounded-xl shadow-lg 
                  font-semibold text-white relative overflow-hidden
                  transition-all duration-300
                  ${getLayerStatus(layer.id) === "active" ? "ring-4 ring-white ring-opacity-50" : ""}
                  ${getLayerStatus(layer.id) === "completed" ? "opacity-50" : ""}
                `}
              >
                {/* Progress indicator */}
                {getLayerStatus(layer.id) === "completed" && (
                  <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-end pr-4">
                    <span className="text-white">✓</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl mr-3">{layer.icon}</span>
                  <span className="flex-1">Layer {layer.id}: {layer.name}</span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                    {layer.pdu}
                  </span>
                </div>
                
                {/* Hover preview */}
                <AnimatePresence>
                  {hoveredLayer === layer.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2 text-xs"
                    >
                      {layer.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* CENTER - SIMULATION */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Data Flow Simulation</h2>

            {/* Input Controls */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Message</label>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your message..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Protocol</label>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value as Protocol)}
                    className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="TCP">TCP (Reliable)</option>
                    <option value="UDP">UDP (Fast)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Mode</label>
                  <button
                    onClick={() => {
                      setMode(mode === "send" ? "receive" : "send");
                      resetSimulation();
                    }}
                    className="w-full p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                  >
                    {mode === "send" ? "📤 Sender" : "📥 Receiver"}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={runSimulation}
                  disabled={packetAnimation}
                  className="p-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {packetAnimation ? "Simulating..." : "▶ Run Simulation"}
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="p-3 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-semibold transition-colors"
                >
                  ↺ Reset
                </button>
              </div>
            </div>

            {/* Protocol Info */}
            <div className="mb-4 p-3 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">{protocol}:</span>{' '}
                {protocol === "TCP" 
                  ? "Connection-oriented, reliable, ordered delivery with error checking"
                  : "Connectionless, faster but less reliable, no guarantee of delivery"}
              </p>
            </div>

            {/* Animated Stack */}
            <div className="space-y-2 mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                {mode === "send" ? "Encapsulation Process" : "Decapsulation Process"}
              </h3>
              
              {stack.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: mode === "send" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`
                    relative p-3 rounded-lg text-center overflow-hidden
                    ${mode === "send" 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                      : "bg-gradient-to-r from-purple-500 to-blue-500"
                    }
                  `}
                >
                  {/* Animation overlay */}
                  {activeLayer === (mode === "send" ? index + 1 : 7 - index) && (
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ x: "100%" }}
                      animate={{ x: "-100%" }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      style={{ opacity: 0.3 }}
                    />
                  )}
                  
                  <span className="text-white font-medium">
                    {mode === "send" 
                      ? `📦 Adding ${item}`
                      : `📂 Removing ${item}`}
                  </span>
                </motion.div>
              ))}
              
              {explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-700"
                >
                  <p className="text-sm text-blue-200">{explanation}</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* RIGHT - DATA FLOW VISUALIZATION */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">📊 How Data Flows</h2>
            
            <div className="space-y-4">
              {dataFlowSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative p-4 rounded-lg cursor-pointer transition-all
                    ${selectedFlowStep === index 
                      ? 'bg-blue-600 ring-2 ring-blue-400' 
                      : 'bg-slate-700 hover:bg-slate-600'
                    }
                  `}
                  onClick={() => setSelectedFlowStep(selectedFlowStep === index ? null : index)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${selectedFlowStep === index ? 'bg-white text-blue-600' : 'bg-slate-600 text-white'}
                    `}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-slate-300">{step.description}</p>
                      
                      <AnimatePresence>
                        {selectedFlowStep === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-blue-400 border-opacity-30"
                          >
                            <p className="text-sm text-blue-100">{step.details}</p>
                            
                            {/* Visual indicator for encapsulation/decapsulation */}
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1 bg-slate-600 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-blue-400"
                                  initial={{ width: "0%" }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              </div>
                              <span className="text-xs text-blue-300">
                                {mode === "send" ? "Adding header" : "Removing header"}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Connection line between layers */}
                  {index < dataFlowSteps.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-600 -z-10" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Summary Card */}
            <motion.div 
              className="mt-6 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-white font-semibold mb-2">🎯 Key Takeaway</h3>
              <p className="text-sm text-purple-200">
                Data flows down the stack during transmission (encapsulation) and up the stack during reception (decapsulation). Each layer adds its own header with control information.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-2xl font-bold text-white">7</div>
            <div className="text-sm text-slate-400">OSI Layers</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-2xl font-bold text-white">
              {protocol === "TCP" ? "🔒 Reliable" : "⚡ Fast"}
            </div>
            <div className="text-sm text-slate-400">Current Protocol</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-2xl font-bold text-white">
              {mode === "send" ? "📤 Sending" : "📥 Receiving"}
            </div>
            <div className="text-sm text-slate-400">Current Mode</div>
          </div>
        </div>
      </div>

      {/* Headless UI Modal for Layer Details */}
      <Transition appear show={isModalOpen} as={typeof Fragment !== "undefined" ? Fragment : "div"}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={typeof Fragment !== "undefined" ? Fragment : "div"}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={typeof Fragment !== "undefined" ? Fragment : "div"}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all border border-slate-700">
                  {selectedLayer && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <Dialog.Title
                          as="h3"
                          className="text-2xl font-bold leading-6 text-white flex items-center gap-3"
                        >
                          <span className="text-4xl">{selectedLayer.icon}</span>
                          <span>{selectedLayer.name} Layer</span>
                        </Dialog.Title>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className={`${selectedLayer.color} h-2 rounded-full mb-6`} />

                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-400 mb-2">Description</h4>
                          <p className="text-white">{selectedLayer.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-700 rounded-lg">
                            <span className="text-sm text-slate-400">Layer Number</span>
                            <p className="text-2xl font-bold text-white">Layer {selectedLayer.id}</p>
                          </div>
                          <div className="p-3 bg-slate-700 rounded-lg">
                            <span className="text-sm text-slate-400">PDU</span>
                            <p className="text-2xl font-bold text-white">{selectedLayer.pdu}</p>
                          </div>
                        </div>

                        {/* Function */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-400 mb-2">Function</h4>
                          <p className="text-white">{selectedLayer.details.function}</p>
                        </div>

                        {/* Protocols */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-400 mb-2">Common Protocols</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedLayer.details.protocols.map((proto) => (
                              <span key={proto} className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                                {proto}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Devices */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-400 mb-2">Network Devices</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedLayer.details.devices.map((device) => (
                              <span key={device} className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                                {device}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Real-world Example */}
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <h4 className="text-sm font-semibold text-slate-400 mb-2">Real-world Example</h4>
                          <p className="text-white">{selectedLayer.details.example}</p>
                        </div>

                        {/* Quiz */}
                        <div className="p-4 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-700">
                          <h4 className="text-sm font-semibold text-blue-300 mb-2">📝 Quick Quiz</h4>
                          <p className="text-white mb-3">{selectedLayer.details.quiz.question}</p>
                          <details className="text-sm">
                            <summary className="text-blue-400 cursor-pointer hover:text-blue-300">Reveal Answer</summary>
                            <p className="mt-2 text-blue-200">{selectedLayer.details.quiz.answer}</p>
                          </details>
                        </div>

                        {/* Layer Relationships */}
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <h4 className="text-sm font-semibold text-slate-400 mb-2">Layer Relationships</h4>
                          <div className="space-y-2">
                            {selectedLayer.id < 7 && (
                              <p className="text-sm text-slate-300">
                                ⬆️ Passes data to Layer {selectedLayer.id + 1} ({layers[7 - selectedLayer.id - 1].name})
                              </p>
                            )}
                            {selectedLayer.id > 1 && (
                              <p className="text-sm text-slate-300">
                                ⬇️ Receives data from Layer {selectedLayer.id - 1} ({layers[7 - selectedLayer.id + 1].name})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}