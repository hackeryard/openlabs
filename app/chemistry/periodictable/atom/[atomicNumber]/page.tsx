"use client";

import { useParams } from "next/navigation";
import AtomicModel3D from "../../../../components/chemistry/AtomicModel3D"
import elements from "../../../../src/data/elements";

export default function AtomPage() {
  const { atomicNumber } = useParams();
  const Z = Number(atomicNumber);

  const element = elements.find(
    (e) => e.atomicNumber === Z
  );

  if (!element) {
    return (
      <div className="p-10 text-center">
        Element not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-center mb-2">
        {element.name} ({element.symbol})
      </h1>

      <p className="text-center text-gray-600 mb-6">
        Atomic Number: {element.atomicNumber}
      </p>

      {/* BIG 3D MODEL */}
      <div className="max-w-5xl mx-auto">
        <AtomicModel3D atomicNumber={element.atomicNumber} />
      </div>
    </div>
  );
}
