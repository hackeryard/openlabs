"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";

const BOND_COLORS = {
  ionic: "border-blue-500 bg-blue-50",
  covalent: "border-green-500 bg-green-50",
  metallic: "border-orange-500 bg-orange-50",
};

/* ====================== 3D HELPERS ====================== */
function Atom({ position, color, size = 0.3 }) {
  return (
    <Sphere args={[size, 32, 32]} position={position}>
      <meshStandardMaterial color={color} />
    </Sphere>
  );
}

function Electron({ position }) {
  return (
    <Sphere args={[0.08, 16, 16]} position={position}>
      <meshStandardMaterial color="#2563eb" />
    </Sphere>
  );
}

/* ====================== COMPONENT ====================== */
export default function ChemicalBondTypes() {
  const [enDiff, setEnDiff] = useState(1.5);

  const predictedBond =
    enDiff >= 1.7
      ? "Ionic Bond"
      : enDiff >= 0.4
      ? "Polar Covalent Bond"
      : "Non-Polar Covalent Bond";

  return (
    <div className="bg-white border rounded-xl p-6 space-y-12 shadow-sm">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-3xl font-bold">Types of Chemical Bonds</h2>
        <p className="text-gray-600 mt-1">
          Chemical bonds are the forces that hold atoms together to form
          molecules and compounds. Atoms bond to achieve lower energy and
          greater stability.
        </p>
      </div>

      {/* ================= IONIC BOND ================= */}
      <section className={`border-l-4 p-5 rounded-lg ${BOND_COLORS.ionic}`}>
        <h3 className="text-2xl font-semibold text-blue-700">1. Ionic Bond</h3>

        <p className="mt-2 text-gray-700">
          An <strong>ionic bond</strong> is formed when one atom completely
          transfers one or more electrons to another atom, forming oppositely
          charged ions that attract each other.
        </p>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">How it forms</h4>
            <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
              <li>Occurs between a <strong>metal</strong> and a <strong>non-metal</strong></li>
              <li>Metal loses electrons → becomes a <strong>cation (+)</strong></li>
              <li>Non-metal gains electrons → becomes an <strong>anion (−)</strong></li>
              <li>Electrostatic attraction holds ions together</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Example</h4>
            <p className="text-gray-700 mt-1">
              <strong>Sodium Chloride (NaCl)</strong>
            </p>
            <p className="text-sm text-gray-600">
              Na → Na⁺ + e⁻ <br />
              Cl + e⁻ → Cl⁻
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Properties</h4>
          <table className="w-full text-sm mt-2 border">
            <tbody>
              <tr><td className="border p-2">Melting point</td><td className="border p-2">High</td></tr>
              <tr><td className="border p-2">Electrical conductivity</td><td className="border p-2">Yes (molten / aqueous)</td></tr>
              <tr><td className="border p-2">Solubility</td><td className="border p-2">Often soluble in water</td></tr>
              <tr><td className="border p-2">Bond strength</td><td className="border p-2">Strong</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= COVALENT BOND ================= */}
      <section className={`border-l-4 p-5 rounded-lg ${BOND_COLORS.covalent}`}>
        <h3 className="text-2xl font-semibold text-green-700">
          2. Covalent Bond
        </h3>

        <p className="mt-2 text-gray-700">
          A <strong>covalent bond</strong> is formed when two atoms share one or
          more pairs of electrons to achieve stability.
        </p>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">How it forms</h4>
            <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
              <li>Occurs between <strong>non-metal atoms</strong></li>
              <li>Electrons are shared, not transferred</li>
              <li>Bond is directional</li>
              <li>Forms molecules</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Examples</h4>
            <ul className="text-gray-700 mt-1 space-y-1">
              <li>H₂O — Water</li>
              <li>CO₂ — Carbon dioxide</li>
              <li>O₂ — Oxygen</li>
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Types of Covalent Bonds</h4>
          <table className="w-full text-sm mt-2 border">
            <thead>
              <tr>
                <th className="border p-2">Type</th>
                <th className="border p-2">Electron Pairs</th>
                <th className="border p-2">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border p-2">Single</td><td className="border p-2">1</td><td className="border p-2">H–H</td></tr>
              <tr><td className="border p-2">Double</td><td className="border p-2">2</td><td className="border p-2">O=O</td></tr>
              <tr><td className="border p-2">Triple</td><td className="border p-2">3</td><td className="border p-2">N≡N</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Polar vs Non-Polar</h4>
          <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
            <li><strong>Polar:</strong> Unequal sharing (H₂O)</li>
            <li><strong>Non-polar:</strong> Equal sharing (O₂, N₂)</li>
          </ul>
        </div>
      </section>

      {/* ================= METALLIC BOND ================= */}
      <section className={`border-l-4 p-5 rounded-lg ${BOND_COLORS.metallic}`}>
        <h3 className="text-2xl font-semibold text-orange-700">
          3. Metallic Bond
        </h3>

        <p className="mt-2 text-gray-700">
          A <strong>metallic bond</strong> is formed when positive metal ions are
          surrounded by a sea of delocalized electrons.
        </p>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Electron Sea Model</h4>
            <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
              <li>Valence electrons are free to move</li>
              <li>Explains electrical conductivity</li>
              <li>Non-directional bond</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Examples</h4>
            <ul className="text-gray-700 mt-1 space-y-1">
              <li>Iron (Fe)</li>
              <li>Copper (Cu)</li>
              <li>Aluminium (Al)</li>
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Properties</h4>
          <table className="w-full text-sm mt-2 border">
            <tbody>
              <tr><td className="border p-2">Conductivity</td><td className="border p-2">High</td></tr>
              <tr><td className="border p-2">Malleability</td><td className="border p-2">High</td></tr>
              <tr><td className="border p-2">Ductility</td><td className="border p-2">High</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= COMPARISON ================= */}
      <section>
        <h3 className="text-xl font-semibold mb-3">
          Comparison of Chemical Bonds
        </h3>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Property</th>
              <th className="border p-2">Ionic</th>
              <th className="border p-2">Covalent</th>
              <th className="border p-2">Metallic</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border p-2">Electron behavior</td><td className="border p-2">Transferred</td><td className="border p-2">Shared</td><td className="border p-2">Delocalized</td></tr>
            <tr><td className="border p-2">Conductivity</td><td className="border p-2">High (solution)</td><td className="border p-2">Low</td><td className="border p-2">High</td></tr>
            <tr><td className="border p-2">Melting point</td><td className="border p-2">High</td><td className="border p-2">Low</td><td className="border p-2">Variable</td></tr>
          </tbody>
        </table>
      </section>

      {/* ===================== ENHANCEMENTS (APPENDED ONLY) ===================== */}

      {/* Dot–Cross Diagrams */}
      <section className="border rounded-xl p-6">
        <h3 className="text-2xl font-semibold mb-3">Dot–Cross Diagrams</h3>
        <p className="text-gray-600 mb-3">
          Dot–cross diagrams show the transfer or sharing of electrons using
          different symbols for different atoms.
        </p>

        <pre className="bg-gray-100 p-4 rounded text-sm">
Na •  → Na⁺  
Cl ××××××× + • → Cl⁻  

H • : O : • H
        </pre>
      </section>

      {/* Electronegativity Slider */}
      <section className="border rounded-xl p-6">
        <h3 className="text-2xl font-semibold mb-3">
          Electronegativity Difference Simulator
        </h3>

        <input
          type="range"
          min="0"
          max="4"
          step="0.1"
          value={enDiff}
          onChange={(e) => setEnDiff(Number(e.target.value))}
          className="w-full"
        />

        <div className="mt-3 text-center">
          <div className="font-semibold">ΔEN = {enDiff.toFixed(1)}</div>
          <div className="text-xl font-bold text-blue-600">
            {predictedBond}
          </div>
        </div>
      </section>

      {/* 3D Bond Models */}
<section className="border rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
  <h3 className="text-2xl font-semibold mb-1">
    3D Bond Models
  </h3>
  <p className="text-sm text-gray-600 mb-6">
    Visual representations to support theoretical understanding of chemical bonds
  </p>

  <div className="grid md:grid-cols-3 gap-6 h-80">

    {/* ================= IONIC ================= */}
    <div className="relative rounded-xl border bg-white shadow-md hover:shadow-lg transition">
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        Ionic Bond
      </div>

      <div className="h-56">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.8} />
          <Atom position={[-1, 0, 0]} color="orange" />
          <Atom position={[1, 0, 0]} color="green" />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <div className="px-4 pb-4 text-center">
        <p className="text-xs text-gray-600">
          Electron transfer forms oppositely charged ions
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          Example: NaCl
        </p>
      </div>
    </div>

    {/* ================= COVALENT ================= */}
    <div className="relative rounded-xl border bg-white shadow-md hover:shadow-lg transition">
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        Covalent Bond
      </div>

      <div className="h-56">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.8} />
          <Atom position={[0, 0, 0]} color="red" />
          <Electron position={[-0.6, 0, 0]} />
          <Electron position={[0.6, 0, 0]} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <div className="px-4 pb-4 text-center">
        <p className="text-xs text-gray-600">
          Shared electron pair holds atoms together
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          Example: H₂, O₂
        </p>
      </div>
    </div>

    {/* ================= METALLIC ================= */}
    <div className="relative rounded-xl border bg-white shadow-md hover:shadow-lg transition">
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
        Metallic Bond
      </div>

      <div className="h-56">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.8} />
          <Atom position={[-1, 0, 0]} color="gray" />
          <Atom position={[1, 0, 0]} color="gray" />
          <Electron position={[0, 0.5, 0]} />
          <Electron position={[0, -0.5, 0]} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <div className="px-4 pb-4 text-center">
        <p className="text-xs text-gray-600">
          Delocalized electrons enable conductivity
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          Example: Cu, Fe
        </p>
      </div>
    </div>

  </div>
</section>


    </div>
  );
}
