// reactionDetails.js

export const REACTION_DETAILS = {
  water: {
    type: "Synthesis / Combustion",
    energy: "Exothermic (Releases Heat)",
    context: "Hydrogen Fuel Cells",
    facts: [
      "Used in rocket propulsion.",
      "Produces only water vapor as emission.",
      "Requires activation energy (spark) to start."
    ],
    imageQuery: "hydrogen fuel cell diagram"
  },
  magnesium_burn: {
    type: "Synthesis / Oxidation",
    energy: "Highly Exothermic",
    context: "Flares & Fireworks",
    facts: [
      "Burns with a blinding brilliant white light.",
      "Produces Magnesium Oxide (white powder).",
      "Cannot be extinguished by water."
    ],
    imageQuery: "magnesium oxide lattice structure"
  },
  salt: {
    type: "Synthesis",
    energy: "Exothermic",
    context: "Culinary & Industrial",
    facts: [
      "Combines a soft metal (Na) with a toxic gas (Cl).",
      "Result is essential for human life.",
      "Forms a cubic crystal lattice structure."
    ],
    imageQuery: "sodium chloride crystal lattice"
  },
  ammonia: {
    type: "Reversible Synthesis",
    energy: "Exothermic",
    context: "Haber Process (Agriculture)",
    facts: [
      "Responsible for 50% of the world's food production.",
      "Requires high pressure (200 atm) and temp (450°C).",
      "Uses an iron catalyst."
    ],
    imageQuery: "Haber process industrial plant diagram"
  },
  methane: {
    type: "Combustion",
    energy: "Exothermic",
    context: "Natural Gas Heating",
    facts: [
      "The primary component of natural gas.",
      "Cleanest burning fossil fuel.",
      "Blue flame indicates complete combustion."
    ],
    imageQuery: "methane combustion reaction diagram"
  },
  zinc_acid: {
    type: "Single Replacement",
    energy: "Exothermic",
    context: "Hydrogen Gas Production",
    facts: [
      "Classic 'Pop Test' reaction.",
      "Zinc displaces Hydrogen from the acid.",
      "Rapidly produces bubbles of H2 gas."
    ],
    imageQuery: "single displacement reaction diagram"
  },
  displacement: {
    type: "Single Displacement",
    energy: "Exothermic",
    context: "Metal Extraction",
    facts: [
      "Iron is more reactive than Copper.",
      "Blue solution fades to green (Iron Sulfate).",
      "Copper metal deposits on the iron nail."
    ],
    imageQuery: "reactivity series of metals chart"
  },
  neutralization: {
    type: "Double Displacement",
    energy: "Exothermic",
    context: "pH Balancing",
    facts: [
      "Acid + Base = Salt + Water.",
      "Crucial in antacid medication.",
      "Used to treat acidic soil in farming."
    ],
    imageQuery: "acid base titration curve"
  },
  marble_acid: {
    type: "Double Displacement",
    energy: "Exothermic",
    context: "Geology & Acid Rain",
    facts: [
      "Why statues dissolve in acid rain.",
      "Produces Calcium Chloride, Water, and CO2.",
      "Fizzing indicates CO2 release."
    ],
    imageQuery: "calcium carbonate acid reaction"
  },
  peroxide: {
    type: "Decomposition",
    energy: "Exothermic",
    context: "Elephant Toothpaste",
    facts: [
      "Rapidly breaks down into Water and Oxygen.",
      "Potassium Iodide acts as a catalyst.",
      "Exothermic enough to create steam."
    ],
    imageQuery: "catalytic decomposition of hydrogen peroxide"
  },
  thermite: {
    type: "Redox",
    energy: "Extremely Exothermic",
    context: "Railway Welding",
    facts: [
      "Reaches temperatures of 2500°C.",
      "Molten iron is produced instantly.",
      "Aluminum is the reducing agent."
    ],
    imageQuery: "thermite reaction welding diagram"
  },
  precipitation: {
    type: "Double Displacement",
    energy: "Endothermic/Neutral",
    context: "Photography & Water Treatment",
    facts: [
      "Forms an insoluble solid (Precipitate).",
      "Used to remove heavy metals from water.",
      "AgCl turns purple in sunlight (Photo-sensitive)."
    ],
    imageQuery: "silver chloride precipitation diagram"
  },
  ethanol_burn: {
    type: "Combustion",
    energy: "Exothermic",
    context: "Biofuels",
    facts: [
      "Renewable fuel source.",
      "Burns cleaner than gasoline.",
      "Produces CO2 and Water."
    ],
    imageQuery: "ethanol combustion engine diagram"
  },
  limestone: {
    type: "Thermal Decomposition",
    energy: "Endothermic",
    context: "Cement Manufacturing",
    facts: [
      "Requires continuous heat to proceed.",
      "Produces Quicklime (CaO).",
      "Rotary kilns are used in industry."
    ],
    imageQuery: "lime kiln schematic"
  }
};