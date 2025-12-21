"use client";

import { useParams } from "next/navigation";
import ElectronicConfiguration from "../../../components/chemistry/ElectronicConfiguration";
import elements from "../../../src/data/elements";

export default function ElectronicConfigurationPage() {
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
    < ElectronicConfiguration
      atomicNumber={atomicNumber}
      symbol={element.symbol}
      name={element.name}
    />
  )
}
