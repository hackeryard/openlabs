// app/components/seo/FormulaSection.tsx
import React from "react";
import { getConceptFormulas } from "@/app/lib/knowledge/graph";
import { Calculator } from "lucide-react";

interface FormulaSectionProps {
  conceptId: string;
}

export default function FormulaSection({ conceptId }: FormulaSectionProps) {
  const formulas = getConceptFormulas(conceptId);

  if (!formulas.length) return null;

  return (
    <div className="w-full my-6 p-5 bg-card/80 border border-border/60 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Calculator size={18} className="text-blue-500" />
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Key Formulas & Equations</h3>
      </div>

      <div className="space-y-4">
        {formulas.map((f) => (
          <div key={f.id} className="p-4 rounded-lg bg-muted/30 border border-border/40 font-mono text-sm space-y-2">
            <div className="font-sans font-bold text-foreground">{f.title}</div>
            <div className="text-lg font-bold text-primary bg-background p-2 rounded border border-border/50 text-center">
              {f.expression}
            </div>
            <p className="font-sans text-xs text-muted-foreground">{f.description}</p>
            {Object.keys(f.variables).length > 0 && (
              <div className="font-sans text-xs pt-2 border-t border-border/40">
                <span className="font-semibold text-muted-foreground">Variable Definitions:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-muted-foreground">
                  {Object.entries(f.variables).map(([symbol, desc]) => (
                    <li key={symbol}>
                      <span className="font-mono font-bold text-foreground">{symbol}</span>: {desc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
