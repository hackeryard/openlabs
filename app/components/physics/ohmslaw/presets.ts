import { CircuitState } from "./engine";

const baseNodes = {
  "100,100": { id: "100,100", x: 100, y: 100 },
  "100,300": { id: "100,300", x: 100, y: 300 },
  "300,100": { id: "300,100", x: 300, y: 100 },
  "300,300": { id: "300,300", x: 300, y: 300 },
};

export const PRESETS: Record<string, CircuitState> = {
  "simple-series": {
    nodes: {
      ...baseNodes,
      "200,100": { id: "200,100", x: 200, y: 100 },
    },
    components: {
      "batt1": { id: "batt1", type: "battery", node1: "100,300", node2: "100,100", value: 9 },
      "w1": { id: "w1", type: "wire", node1: "100,100", node2: "200,100", value: 0 },
      "r1": { id: "r1", type: "resistor", node1: "200,100", node2: "300,100", value: 10 },
      "w2": { id: "w2", type: "wire", node1: "300,100", node2: "300,300", value: 0 },
      "r2": { id: "r2", type: "resistor", node1: "300,300", node2: "100,300", value: 20 },
    }
  },
  "simple-parallel": {
    nodes: {
      ...baseNodes,
      "200,100": { id: "200,100", x: 200, y: 100 },
      "200,300": { id: "200,300", x: 200, y: 300 },
      "200,200": { id: "200,200", x: 200, y: 200 },
      "300,200": { id: "300,200", x: 300, y: 200 },
    },
    components: {
      "batt1": { id: "batt1", type: "battery", node1: "100,300", node2: "100,100", value: 12 },
      "w1": { id: "w1", type: "wire", node1: "100,100", node2: "200,100", value: 0 },
      "w2": { id: "w2", type: "wire", node1: "100,300", node2: "200,300", value: 0 },
      "w3": { id: "w3", type: "wire", node1: "200,100", node2: "200,200", value: 0 },
      "w4": { id: "w4", type: "wire", node1: "200,300", node2: "300,300", value: 0 },
      "r1": { id: "r1", type: "resistor", node1: "200,200", node2: "300,200", value: 10 },
      "r2": { id: "r2", type: "resistor", node1: "200,100", node2: "300,100", value: 10 },
      "w5": { id: "w5", type: "wire", node1: "300,100", node2: "300,200", value: 0 },
      "w6": { id: "w6", type: "wire", node1: "300,200", node2: "300,300", value: 0 },
    }
  },
  "bulb-demo": {
    nodes: baseNodes,
    components: {
      "batt1": { id: "batt1", type: "battery", node1: "100,300", node2: "100,100", value: 12 },
      "sw1": { id: "sw1", type: "switch", node1: "100,100", node2: "300,100", value: 0, isOpen: false },
      "w1": { id: "w1", type: "wire", node1: "300,100", node2: "300,300", value: 0 },
      "bulb1": { id: "bulb1", type: "bulb", node1: "300,300", node2: "100,300", value: 5 },
    }
  },
  "potentiometer-dimmer": {
    nodes: {
      ...baseNodes,
      "200,100": { id: "200,100", x: 200, y: 100 },
    },
    components: {
      "batt1": { id: "batt1", type: "battery", node1: "100,300", node2: "100,100", value: 12 },
      "pot1": { id: "pot1", type: "potentiometer", node1: "100,100", node2: "200,100", value: 25 },
      "w1": { id: "w1", type: "wire", node1: "200,100", node2: "300,100", value: 0 },
      "bulb1": { id: "bulb1", type: "bulb", node1: "300,100", node2: "300,300", value: 10 },
      "w2": { id: "w2", type: "wire", node1: "300,300", node2: "100,300", value: 0 },
    }
  },
  "meters-verification": {
    nodes: {
      ...baseNodes,
      "200,100": { id: "200,100", x: 200, y: 100 },
      "200,300": { id: "200,300", x: 200, y: 300 },
    },
    components: {
      "batt1": { id: "batt1", type: "battery", node1: "100,300", node2: "100,100", value: 10 },
      "amm1": { id: "amm1", type: "ammeter", node1: "100,100", node2: "200,100", value: 0 },
      "r1": { id: "r1", type: "resistor", node1: "200,100", node2: "300,100", value: 10 },
      "w1": { id: "w1", type: "wire", node1: "300,100", node2: "300,300", value: 0 },
      "w2": { id: "w2", type: "wire", node1: "300,300", node2: "100,300", value: 0 },
      "vm1": { id: "vm1", type: "voltmeter", node1: "200,100", node2: "300,100", value: 0 },
    }
  }
};
