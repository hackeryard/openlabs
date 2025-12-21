export const REACTIONS = {
  waterFormation: {
    name: "Formation of Water",
    equation: "2H₂ + O₂ → 2H₂O",
    reactants: [
      { formula: "H2", count: 2 },
      { formula: "O2", count: 1 }
    ],
    products: [
      { formula: "H2O", count: 2 }
    ],
    type: "Combination",
    energy: "Exothermic",
    conditions: ["Spark / Heat"]
  }
};
