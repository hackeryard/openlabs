export const REACTIONS_DATA = {
  // -------------------------
  // 1. SYNTHESIS REACTIONS
  // -------------------------
  water: {
    name: "Formation of Water",
    equation: "2H₂ + O₂ → 2H₂O",
    description: "Hydrogen burns in Oxygen to produce Water (Exothermic).",
    atoms: [
      { id: "H1", element: "H", color: "#ffffff" }, { id: "H2", element: "H", color: "#ffffff" },
      { id: "H3", element: "H", color: "#ffffff" }, { id: "H4", element: "H", color: "#ffffff" },
      { id: "O1", element: "O", color: "#ef4444" }, { id: "O2", element: "O", color: "#ef4444" },
    ],
    reactants: {
      H1: [-2.2, 0, 0], H2: [-1.6, 0, 0],
      H3: [2.2, 0, 0], H4: [1.6, 0, 0],
      O1: [0, 1, 0], O2: [0, 1.6, 0],
    },
    products: {
      O1: [-1.2, 0, 0], H1: [-1.8, -0.6, 0], H2: [-0.6, -0.6, 0],
      O2: [1.2, 0, 0], H3: [0.6, -0.6, 0], H4: [1.8, -0.6, 0],
    }
  },

  magnesium_burn: {
    name: "Burning Magnesium",
    equation: "2Mg + O₂ → 2MgO",
    description: "The classic bright white light experiment.",
    atoms: [
      { id: "Mg1", element: "Mg", color: "#94a3b8" }, // Silver/Grey
      { id: "Mg2", element: "Mg", color: "#94a3b8" },
      { id: "O1", element: "O", color: "#ef4444" },
      { id: "O2", element: "O", color: "#ef4444" },
    ],
    reactants: {
      Mg1: [-2, 0, 0], Mg2: [-3, 0, 0], // Mg strips
      O1: [2, 0.5, 0], O2: [2, -0.5, 0], // O2 Molecule
    },
    products: {
      // Ionic Lattice formation
      Mg1: [-1, 0, 0], O1: [-0.3, 0, 0],
      Mg2: [1, 0, 0], O2: [1.7, 0, 0],
    }
  },

  salt: {
    name: "Sodium + Chlorine",
    equation: "2Na + Cl₂ → 2NaCl",
    description: "Highly reactive metal meets poisonous gas to make table salt.",
    atoms: [
      { id: "Na1", element: "Na", color: "#a855f7" }, // Purple
      { id: "Na2", element: "Na", color: "#a855f7" },
      { id: "Cl1", element: "Cl", color: "#22c55e" }, // Green
      { id: "Cl2", element: "Cl", color: "#22c55e" },
    ],
    reactants: {
      Na1: [-2, 0.5, 0], Na2: [-2, -0.5, 0],
      Cl1: [2, 0, 0], Cl2: [2.8, 0, 0],
    },
    products: {
      Na1: [-0.8, 0, 0], Cl1: [0, 0, 0],
      Na2: [0.8, -0.8, 0], Cl2: [1.6, -0.8, 0],
    }
  },

  ammonia: {
    name: "Haber Process",
    equation: "N₂ + 3H₂ ⇌ 2NH₃",
    description: "Industrial production of fertilizer.",
    atoms: [
      { id: "N1", element: "N", color: "#3b82f6" }, { id: "N2", element: "N", color: "#3b82f6" },
      { id: "H1", element: "H", color: "#ffffff" }, { id: "H2", element: "H", color: "#ffffff" },
      { id: "H3", element: "H", color: "#ffffff" }, { id: "H4", element: "H", color: "#ffffff" },
      { id: "H5", element: "H", color: "#ffffff" }, { id: "H6", element: "H", color: "#ffffff" },
    ],
    reactants: {
      N1: [-0.3, 0, 0], N2: [0.3, 0, 0],
      H1: [-2, 1.5, 0], H2: [-1.4, 1.5, 0],
      H3: [0, 2, 0], H4: [0.6, 2, 0],
      H5: [2, 1.5, 0], H6: [2.6, 1.5, 0],
    },
    products: {
      N1: [-1.5, 0, 0], H1: [-1.5, 0.8, 0], H2: [-2.2, -0.5, 0], H3: [-0.8, -0.5, 0],
      N2: [1.5, 0, 0], H4: [1.5, 0.8, 0], H5: [2.2, -0.5, 0], H6: [0.8, -0.5, 0],
    }
  },

  // -------------------------
  // 2. COMBUSTION
  // -------------------------
  methane: {
    name: "Methane Combustion",
    equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    description: "Burning natural gas (Bunsen Burner).",
    atoms: [
      { id: "C1", element: "C", color: "#333333" },
      { id: "H1", element: "H", color: "#ffffff" }, { id: "H2", element: "H", color: "#ffffff" },
      { id: "H3", element: "H", color: "#ffffff" }, { id: "H4", element: "H", color: "#ffffff" },
      { id: "O1", element: "O", color: "#ef4444" }, { id: "O2", element: "O", color: "#ef4444" },
      { id: "O3", element: "O", color: "#ef4444" }, { id: "O4", element: "O", color: "#ef4444" },
    ],
    reactants: {
      C1: [0, 0, 0],
      H1: [0, 0.8, 0], H2: [0.8, -0.4, 0], H3: [-0.8, -0.4, 0], H4: [0, 0, 0.8],
      O1: [-2.5, 1, 0], O2: [-2.5, 1.6, 0],
      O3: [2.5, 1, 0], O4: [2.5, 1.6, 0],
    },
    products: {
      C1: [0, 0, 0], O1: [-1.2, 0, 0], O2: [1.2, 0, 0],
      O3: [-2.5, -1, 0], H1: [-3, -1.5, 0], H2: [-2, -1.5, 0],
      O4: [2.5, -1, 0], H3: [3, -1.5, 0], H4: [2, -1.5, 0],
    }
  },

  // -------------------------
  // 3. SINGLE REPLACEMENT
  // -------------------------
  zinc_acid: {
    name: "Zinc + Hydrochloric Acid",
    equation: "Zn + 2HCl → ZnCl₂ + H₂",
    description: "The 'Pop Test' reaction. Metal releases Hydrogen gas.",
    atoms: [
      { id: "Zn1", element: "Zn", color: "#64748b" }, // Blue-ish Grey
      { id: "H1", element: "H", color: "#ffffff" },
      { id: "H2", element: "H", color: "#ffffff" },
      { id: "Cl1", element: "Cl", color: "#22c55e" },
      { id: "Cl2", element: "Cl", color: "#22c55e" },
    ],
    reactants: {
      Zn1: [-2.5, 0, 0], // Metal Solid
      H1: [0.5, 0.5, 0], Cl1: [1.2, 0.5, 0], // HCl 1
      H2: [0.5, -0.5, 0], Cl2: [1.2, -0.5, 0] // HCl 2
    },
    products: {
      // Zinc Chloride salt
      Zn1: [0, 0, 0], Cl1: [-1, 0.5, 0], Cl2: [1, -0.5, 0],
      // Hydrogen gas flies up
      H1: [0, 2, 0], H2: [0.6, 2, 0]
    }
  },

  displacement: {
    name: "Iron + Copper Sulfate",
    equation: "Fe + CuSO₄ → FeSO₄ + Cu",
    description: "Iron nail turns copper-colored. (Displacement).",
    atoms: [
      { id: "Fe1", element: "Fe", color: "#475569" }, // Dark Grey
      { id: "Cu1", element: "Cu", color: "#d97706" }, // Copper Orange
      { id: "S1", element: "S", color: "#fbbf24" },   // Yellow
      { id: "O1", element: "O", color: "#ef4444" },
      { id: "O2", element: "O", color: "#ef4444" },
      { id: "O3", element: "O", color: "#ef4444" },
      { id: "O4", element: "O", color: "#ef4444" },
    ],
    reactants: {
      Fe1: [-3, 0, 0], // Iron nail
      Cu1: [1, 0, 0], S1: [2, 0, 0], // CuSO4 Cluster
      O1: [2, 1, 0], O2: [2, -1, 0], O3: [2, 0, 1], O4: [2, 0, -1]
    },
    products: {
      // Iron kicks out Copper
      Fe1: [1, 0, 0], S1: [2, 0, 0], // FeSO4
      O1: [2, 1, 0], O2: [2, -1, 0], O3: [2, 0, 1], O4: [2, 0, -1],
      // Copper is now alone
      Cu1: [-3, 0, 0]
    }
  },

  // -------------------------
  // 4. ACID-BASE & CARBONATES
  // -------------------------
  neutralization: {
    name: "Acid + Base",
    equation: "HCl + NaOH → NaCl + H₂O",
    description: "Neutralization forming Salt and Water.",
    atoms: [
      { id: "H1", element: "H", color: "#ffffff" },
      { id: "Cl1", element: "Cl", color: "#22c55e" },
      { id: "Na1", element: "Na", color: "#a855f7" },
      { id: "O1", element: "O", color: "#ef4444" },
      { id: "H2", element: "H", color: "#ffffff" },
    ],
    reactants: {
      H1: [-2, 0.5, 0], Cl1: [-1.3, 0.5, 0], // HCl
      Na1: [1.5, 0, 0], O1: [2.3, 0, 0], H2: [2.9, 0.3, 0], // NaOH
    },
    products: {
      Na1: [-0.5, 0, 0], Cl1: [0.5, 0, 0], // NaCl
      O1: [2, 0, 0], H1: [1.5, -0.6, 0], H2: [2.5, -0.6, 0], // H2O
    }
  },

  marble_acid: {
    name: "Marble Chips + Acid",
    equation: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂",
    description: "Carbonates react with acid to fizz (release CO₂).",
    atoms: [
      { id: "Ca1", element: "Ca", color: "#9ca3af" }, // Calcium
      { id: "C1", element: "C", color: "#333333" },
      { id: "O1", element: "O", color: "#ef4444" }, { id: "O2", element: "O", color: "#ef4444" }, { id: "O3", element: "O", color: "#ef4444" },
      { id: "H1", element: "H", color: "#ffffff" }, { id: "H2", element: "H", color: "#ffffff" },
      { id: "Cl1", element: "Cl", color: "#22c55e" }, { id: "Cl2", element: "Cl", color: "#22c55e" },
    ],
    reactants: {
      // CaCO3
      Ca1: [-2, 0, 0], C1: [-2, 1, 0], O1: [-2.8, 1.5, 0], O2: [-1.2, 1.5, 0], O3: [-2, 0.2, 0.8],
      // 2 HCl
      H1: [1, 0.5, 0], Cl1: [1.7, 0.5, 0],
      H2: [1, -0.5, 0], Cl2: [1.7, -0.5, 0],
    },
    products: {
      // CaCl2
      Ca1: [-1, 0, 0], Cl1: [-1.8, 0, 0], Cl2: [-0.2, 0, 0],
      // H2O
      O3: [2, -1, 0], H1: [1.5, -1.5, 0], H2: [2.5, -1.5, 0],
      // CO2 Gas
      C1: [1.5, 1.5, 0], O1: [0.7, 1.5, 0], O2: [2.3, 1.5, 0],
    }
  },

  // -------------------------
  // 5. DECOMPOSITION
  // -------------------------
  peroxide: {
    name: "Elephant Toothpaste",
    equation: "2H₂O₂ → 2H₂O + O₂",
    description: "Catalytic decomposition of Hydrogen Peroxide.",
    atoms: [
      { id: "O1", element: "O", color: "#ef4444" }, { id: "O2", element: "O", color: "#ef4444" },
      { id: "H1", element: "H", color: "#ffffff" }, { id: "H2", element: "H", color: "#ffffff" },
      { id: "O3", element: "O", color: "#ef4444" }, { id: "O4", element: "O", color: "#ef4444" },
      { id: "H3", element: "H", color: "#ffffff" }, { id: "H4", element: "H", color: "#ffffff" },
    ],
    reactants: {
      O1: [-2, 0, 0], O2: [-1.2, 0.5, 0], H1: [-2.5, -0.5, 0], H2: [-0.7, 1, 0],
      O3: [2, 0, 0], O4: [1.2, 0.5, 0], H3: [2.5, -0.5, 0], H4: [0.7, 1, 0],
    },
    products: {
      O1: [-2, -1, 0], H1: [-2.6, -1.5, 0], H2: [-1.4, -1.5, 0],
      O3: [2, -1, 0], H3: [2.6, -1.5, 0], H4: [1.4, -1.5, 0],
      O2: [-0.4, 1.5, 0], O4: [0.4, 1.5, 0] // Oxygen Gas
    }
  },

  limestone: {
    name: "Limestone Cycle",
    equation: "CaCO₃ → CaO + CO₂",
    description: "Thermal decomposition used to make cement.",
    atoms: [
      { id: "Ca1", element: "Ca", color: "#9ca3af" },
      { id: "C1", element: "C", color: "#333333" },
      { id: "O1", element: "O", color: "#ef4444" }, { id: "O2", element: "O", color: "#ef4444" }, { id: "O3", element: "O", color: "#ef4444" },
    ],
    reactants: {
      Ca1: [0, 0.5, 0], C1: [0, -0.5, 0],
      O1: [-0.8, -1, 0], O2: [0.8, -1, 0], O3: [0, 0.3, 0.8],
    },
    products: {
      Ca1: [-1.5, 0, 0], O3: [-0.7, 0, 0], // Quicklime
      C1: [1.5, 0, 0], O1: [0.5, 0, 0], O2: [2.5, 0, 0], // CO2
    }
  },

  // -------------------------
  // 6. REDOX (HIGH ENERGY)
  // -------------------------
  thermite: {
    name: "Thermite Reaction",
    equation: "Fe₂O₃ + 2Al → Al₂O₃ + 2Fe",
    description: "Molten Iron production. Extremely hot redox reaction.",
    atoms: [
      { id: "Fe1", element: "Fe", color: "#475569" }, // Dark Grey
      { id: "Fe2", element: "Fe", color: "#475569" },
      { id: "O1", element: "O", color: "#ef4444" },
      { id: "O2", element: "O", color: "#ef4444" },
      { id: "O3", element: "O", color: "#ef4444" },
      { id: "Al1", element: "Al", color: "#cbd5e1" }, // Light Silver
      { id: "Al2", element: "Al", color: "#cbd5e1" },
    ],
    reactants: {
      // Iron Oxide Cluster
      Fe1: [-1.5, 0.5, 0], Fe2: [-2.5, -0.5, 0],
      O1: [-2, 0, 0.8], O2: [-1, -0.5, -0.5], O3: [-3, 0.5, -0.5],
      // Aluminium Atoms
      Al1: [2, 0, 0], Al2: [3, 0, 0],
    },
    products: {
      // Aluminium Oxide Cluster (Al steals the Oxygen)
      Al1: [-1, 0, 0], Al2: [-2, 0, 0],
      O1: [-1.5, 0.8, 0], O2: [-1.5, -0.8, 0.5], O3: [-2.5, 0, -0.5],
      // Pure Iron ejected
      Fe1: [2, 1, 0], Fe2: [2, -1, 0],
    }
  },

  // -------------------------
  // 7. DOUBLE DISPLACEMENT (PRECIPITATION)
  // -------------------------
  precipitation: {
    name: "Silver Nitrate Precipitation",
    equation: "AgNO₃ + NaCl → AgCl + NaNO₃",
    description: "Formation of solid Silver Chloride white precipitate.",
    atoms: [
      { id: "Ag1", element: "Ag", color: "#e2e8f0" }, // Shiny Silver
      { id: "N1", element: "N", color: "#3b82f6" },
      { id: "O1", element: "O", color: "#ef4444" }, { id: "O2", element: "O", color: "#ef4444" }, { id: "O3", element: "O", color: "#ef4444" },
      { id: "Na1", element: "Na", color: "#a855f7" },
      { id: "Cl1", element: "Cl", color: "#22c55e" },
    ],
    reactants: {
      // AgNO3 Group
      Ag1: [-2, 0, 0], N1: [-2.8, 0, 0],
      O1: [-3.5, 0.5, 0], O2: [-3.5, -0.5, 0], O3: [-2.8, 1, 0],
      // NaCl Group
      Na1: [2, 0, 0], Cl1: [2.8, 0, 0],
    },
    products: {
      // AgCl (Solid Precipitate Clump in center)
      Ag1: [0.2, 0, 0], Cl1: [-0.2, 0, 0],
      // NaNO3 (Spectator ions floating apart)
      Na1: [2.5, -1, 0],
      N1: [-2.5, 1, 0], O1: [-3, 1.5, 0], O2: [-2, 1.5, 0], O3: [-2.5, 0.2, 0],
    }
  },

  // -------------------------
  // 8. ORGANIC CHEMISTRY
  // -------------------------
  ethanol_burn: {
    name: "Combustion of Ethanol",
    equation: "C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O",
    description: "Burning alcohol for clean energy.",
    atoms: [
      { id: "C1", element: "C", color: "#333333" }, { id: "C2", element: "C", color: "#333333" },
      { id: "O_eth", element: "O", color: "#ef4444" },
      { id: "H1", element: "H", color: "#ffffff" }, { id: "H2", element: "H", color: "#ffffff" },
      { id: "H3", element: "H", color: "#ffffff" }, { id: "H4", element: "H", color: "#ffffff" },
      { id: "H5", element: "H", color: "#ffffff" }, { id: "H6", element: "H", color: "#ffffff" },
      // Oxygen Gas atoms
      { id: "Ox1", element: "O", color: "#ef4444" }, { id: "Ox2", element: "O", color: "#ef4444" },
      { id: "Ox3", element: "O", color: "#ef4444" }, { id: "Ox4", element: "O", color: "#ef4444" },
      { id: "Ox5", element: "O", color: "#ef4444" }, { id: "Ox6", element: "O", color: "#ef4444" },
    ],
    reactants: {
      // Ethanol Molecule (Center)
      C1: [-0.5, 0, 0], C2: [0.5, 0, 0],
      O_eth: [1.2, 0.5, 0], H6: [1.8, 0.2, 0], // The OH group
      H1: [-0.5, 1, 0], H2: [-0.5, -1, 0], H3: [-1.2, 0, 0], // H on C1
      H4: [0.5, 1, 0], H5: [0.5, -1, 0], // H on C2
      // 3 O2 Molecules orbiting
      Ox1: [-3, 1.5, 0], Ox2: [-2.2, 1.5, 0],
      Ox3: [3, 1.5, 0], Ox4: [2.2, 1.5, 0],
      Ox5: [0, -2.5, 0], Ox6: [0.8, -2.5, 0],
    },
    products: {
      // 2 CO2 Molecules
      C1: [-2, 0, 0], Ox1: [-2.8, 0, 0], Ox2: [-1.2, 0, 0],
      C2: [2, 0, 0], Ox3: [2.8, 0, 0], Ox4: [1.2, 0, 0],
      // 3 H2O Molecules
      O_eth: [0, 1.5, 0], H1: [-0.6, 1, 0], H2: [0.6, 1, 0],
      Ox5: [-1.5, -2, 0], H3: [-2.1, -2.5, 0], H4: [-0.9, -2.5, 0],
      Ox6: [1.5, -2, 0], H5: [0.9, -2.5, 0], H6: [2.1, -2.5, 0],
    }
  }
};