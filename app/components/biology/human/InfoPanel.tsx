"use client"

import { Heart, Brain, Wind, Activity, Droplets, Circle } from "lucide-react"

type OrganInfo = {
  description: string
  system: string
  facts: string[]
  icon: React.ReactNode
}

const ORGAN_DATA: Record<string, OrganInfo> = {
  Brain: {
    description:
      "The brain is the control center of the nervous system, responsible for thought, memory, emotion, and coordinating body functions.",
    system: "Nervous System",
    facts: [
      "Contains roughly 86 billion neurons.",
      "Uses about 20% of the body's total energy.",
      "Divided into the cerebrum, cerebellum, and brainstem.",
    ],
    icon: <Brain className="h-5 w-5" />,
  },
  Heart: {
    description:
      "The heart is a muscular organ that pumps blood throughout the body via the circulatory system, supplying oxygen and nutrients to tissues.",
    system: "Circulatory System",
    facts: [
      "Beats around 100,000 times per day.",
      "Has four chambers: two atria and two ventricles.",
      "Pumps about 7,500 liters of blood daily.",
    ],
    icon: <Heart className="h-5 w-5" />,
  },
  Lungs: {
    description:
      "The lungs are the primary organs of respiration, exchanging oxygen and carbon dioxide between the air and the bloodstream.",
    system: "Respiratory System",
    facts: [
      "Contain about 300 million alveoli for gas exchange.",
      "The right lung has three lobes; the left has two.",
      "Total surface area is roughly the size of a tennis court.",
    ],
    icon: <Wind className="h-5 w-5" />,
  },
  Liver: {
    description:
      "The liver performs over 500 functions including detoxification, protein synthesis, and producing bile to aid digestion.",
    system: "Digestive System",
    facts: [
      "The largest internal organ in the body.",
      "Can regenerate from as little as 25% of its tissue.",
      "Filters about 1.4 liters of blood per minute.",
    ],
    icon: <Activity className="h-5 w-5" />,
  },
  Stomach: {
    description:
      "The stomach is a muscular sac that breaks down food using acid and enzymes before passing it to the small intestine.",
    system: "Digestive System",
    facts: [
      "Produces hydrochloric acid with a pH of 1.5–3.5.",
      "Can hold roughly 1 liter of food.",
      "Its lining is replaced every few days.",
    ],
    icon: <Droplets className="h-5 w-5" />,
  },
  Intestines: {
    description:
      "The intestines absorb nutrients and water from digested food. The small intestine handles most absorption; the large intestine compacts waste.",
    system: "Digestive System",
    facts: [
      "The small intestine is about 6 meters long.",
      "Home to trillions of beneficial gut bacteria.",
      "Lined with villi to maximize nutrient absorption.",
    ],
    icon: <Activity className="h-5 w-5" />,
  },
}

export default function InfoPanel({ organ }: { organ: string }) {
  const data = organ ? ORGAN_DATA[organ] : undefined

  if (!organ) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <Circle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No structure selected</h3>
        <p className="mt-2 max-w-xs text-sm text-slate-500">
          Click an organ in the 3D model to explore its anatomy, biological system, and key facts.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          {data?.icon ?? <Circle className="h-5 w-5" />}
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">{organ}</h2>
          {data?.system && (
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">
              {data.system}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">
        {data?.description ??
          `${organ} is a biological structure within the human body. Detailed information for this structure is being added.`}
      </p>

      {data?.facts && (
        <div className="mt-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Key Facts</h4>
          <ul className="space-y-2.5">
            {data.facts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
