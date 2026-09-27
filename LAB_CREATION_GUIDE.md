# 🧪 OpenLabs: Complete Guide to Creating & Registering a New Lab

This guide is the complete, canonical standard operating procedure (SOP) for creating, wiring, and publishing an interactive virtual laboratory simulation on OpenLabs (`openlabs.org.in`).

Whenever adding a new lab for **Physics, Chemistry, Biology, Computer Science, or Mathematics**, all 9 steps below must be performed to ensure proper functionality, authentication, SEO, gamification, curriculum progression, AI assistant context, and navigation.

---

## 📋 The 9-Step Lab Checklist Overview

| Step | File / Location | Purpose |
|---|---|---|
| **1** | `app/components/<subject>/<LabName>Lab.tsx` (or `.jsx`) | Interactive simulation engine (Canvas/Three.js/WebGL/React) |
| **2** | `app/labs/<subject>/<slug>/page.tsx` | Authenticated dynamic simulation route (`ssr: false` + `UniversalLoader`) |
| **3** | `app/hooks/useXP.ts` & `<DailyChallengeCard />` | Gamification wiring (XP reward tier, daily challenge validation, `<NextLabModal />`) |
| **4** | `app/lib/pageKnowledge.ts` & `useChat()` | Context-aware AI Assistant knowledge (usage protocols, formulas, pitfalls) |
| **5** | `app/<subject>/<slug>/page.tsx` | Public SEO & Educational landing page (`EducationalLandingLayout` + Schema.org) |
| **6** | `app/lib/labs.ts` | Central lab registry (`LABS` array, challenge parameters, XP category) |
| **7** | `app/lib/tracks.ts` | Curriculum track placement (step sequencing, difficulty, estimated time) |
| **8** | `app/components/Navbar.tsx` & `app/<subject>/page.tsx` | Mega-menu navigation, subject hub catalog, and homepage hero |
| **9** | `app/sitemap.ts` & `CHANGELOG.md` | Search indexing XML entry, docs sync, and `tsc` verification |

---

## 🛠️ Step-by-Step Implementation Instructions

### Step 1: Build the Interactive Component
**File Path**: `app/components/<subject>/<LabName>Lab.tsx` (or `.jsx`)

* Must be marked with `"use client";` at top.
* Use Tailwind semantic tokens (`bg-card`, `text-foreground`, `border-border`, `bg-primary`, `bg-muted`) backed by CSS variables in `globals.css` to support light/dark theme seamlessly.
* Ensure responsive layout: controls toolbar + dynamic canvas/sandbox + live telemetry/readouts.
* Register experiment context for OpenLabs AI:
  ```tsx
  import { useChat } from "@/app/components/ChatContext";

  // Inside your component on mount:
  const { setExperimentData } = useChat();
  useEffect(() => {
    setExperimentData({
      title: "Your Lab Title",
      theory: "Core mathematical or physical theory...",
      extraContext: "Current parameters or active state summary",
    });
  }, []);
  ```

---

### Step 2: Create the Authenticated Simulation Route
**File Path**: `app/labs/<subject>/<slug>/page.tsx`

* Thin Server/Client wrapper that dynamically imports the component with `ssr: false` (to support Canvas, WebGL, and Three.js):
  ```tsx
  "use client";

  import dynamic from "next/dynamic";
  import UniversalLoader from "@/app/components/UniversalLoader";

  const LabComponent = dynamic(
    () => import("@/app/components/<subject>/<LabName>Lab"),
    {
      ssr: false,
      loading: () => <UniversalLoader subject="<subject>" customMessage="Initializing simulation..." />,
    }
  );

  export default function Page() {
    return <LabComponent />;
  }
  ```
* All routes under `/labs/*` are automatically protected by auth in `middleware.ts`.

---

### Step 3: Wire Gamification, XP & Daily Challenge
**In Component**: `app/components/<subject>/<LabName>Lab.tsx`

1. **XP & Next-Lab Modal Hook**:
   ```tsx
   import { useLab } from "@/app/hooks/useXP";
   import NextLabModal from "@/app/components/NextLabModal";

   // Inside component:
   const {
     completeExperiment,
     xpResult,
     nextLabProgression,
     showNextLabModal,
     setShowNextLabModal
   } = useLab("<subject>/<slug>", "<subject>", "simulation"); // "simulation" | "exploration" | "editor"
   ```
   * Trigger `completeExperiment()` when the learner satisfies the experiment goal or clicks "Finish Experiment".
   * Render `<NextLabModal />` if active:
     ```tsx
     {showNextLabModal && nextLabProgression && (
       <NextLabModal
         isOpen={showNextLabModal}
         onClose={() => setShowNextLabModal(false)}
         xpEarned={xpResult?.xpEarned || 50}
         currentTrack={nextLabProgression.track}
         nextStep={nextLabProgression.nextStep}
         isFinalStep={nextLabProgression.isFinalStep}
         trackPercentage={nextLabProgression.trackPercentage}
       />
     )}
     ```

2. **Daily Challenge Card** (if numeric/measurable parameter is challengeable):
   ```tsx
   import DailyChallengeCard from "@/app/components/DailyChallengeCard";

   <DailyChallengeCard
     labId="<subject>/<slug>"
     currentParams={{
       targetParam: currentValue, // e.g. period: 2.01, resistance: 50
     }}
     onComplete={() => completeExperiment()}
   />
   ```

---

### Step 4: Add Context-Aware AI Knowledge
**File Path**: `app/lib/pageKnowledge.ts`

Add an entry into `PAGE_KNOWLEDGE` keyed by `"<subject>/<slug>"`:
```typescript
"<subject>/<slug>": {
  title: "Lab Display Name",
  subject: "Physics", // or Chemistry, Biology, Computer Science, Mathematics
  category: "Subtopic Domain",
  governingFormulas: ["Formula 1", "Formula 2"],
  coreConcepts: "Brief summary of scientific laws and numerical models...",
  usageGuide: [
    "1. Step 1: Adjust initial slider parameters...",
    "2. Step 2: Click Run/Simulate to observe...",
    "3. Step 3: Collect data points from the readout...",
    "4. Step 4: Verify with the theoretical formula...",
  ],
  controlsGuide: [
    "Slider X: Controls property Y (range A to B)",
    "Toggle Z: Enables real-time telemetry overlay",
    "Reset Button: Restores initial conditions",
  ],
  suggestedInquiries: [
    "What happens when parameter X is doubled?",
    "Can you configure the system to achieve resonance?",
  ],
  commonMistakes: [
    "Forgetting to account for unit conversions (e.g. cm vs m)",
  ],
},
```

---

### Step 5: Build the Public SEO Educational Landing Page
**File Path**: `app/<subject>/<slug>/page.tsx`

Use `EducationalLandingLayout` (or `PhysicsExperimentLanding` for physics) to ensure full Schema.org JSON-LD structured data and high-ranking GEO/AEO optimization:

```tsx
import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";

export const metadata: Metadata = {
  title: "Lab Name Interactive Virtual Lab | OpenLabs",
  description: "Comprehensive interactive online simulation and practical experiment for...",
  keywords: ["keyword 1", "keyword 2", "virtual lab", "online simulation"],
  alternates: {
    canonical: "https://www.openlabs.org.in/<subject>/<slug>",
  },
};

const content: EducationalContent = {
  slug: "<slug>",
  subject: "<subject>",
  title: "Lab Name",
  description: "Comprehensive meta description...",
  difficulty: "Intermediate", // "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: "15 mins",
  theory: "Detailed explanation of governing physical/chemical/computational principles...",
  learningObjectives: [
    "Understand the relationship between X and Y",
    "Calculate values using formula Z",
  ],
  realWorldApplications: [
    "Application 1 in modern engineering/industry",
    "Application 2 in biological/computing systems",
  ],
  faqs: [
    { question: "What does this lab simulate?", answer: "..." },
    { question: "How are the calculations performed?", answer: "..." },
  ],
  relatedExperiments: [
    { title: "Related Lab", url: "/<subject>/<related-slug>" },
  ],
};

export default function Page() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/<subject>/<slug>"
    />
  );
}
```

---

### Step 6: Register in the Central Lab Registry
**File Path**: `app/lib/labs.ts`

Add an entry into the `LABS` array:
```typescript
{
  id: "<subject>/<slug>", // MUST match path segment used in useLab() and routes
  name: "Lab Display Name",
  subject: "physics", // "physics" | "chemistry" | "biology" | "computerScience" | "mathematics"
  type: "simulation", // "simulation" (+50 XP) | "exploration" (+30 XP) | "editor" (+40 XP)
  challengeEnabled: true, // true if Daily Challenge cron can target this lab
  challengeParams: ["targetParamName"], // numeric variables validatable by DailyChallenge API
  description: "Short 1-sentence description for cards and search indexes.",
},
```

---

### Step 7: Add to Curriculum Tracks & Learning Sequences
**File Path**: `app/lib/tracks.ts`

Assign the new lab to its appropriate `CurriculumTrack` in `CURRICULUM_TRACKS`:
```typescript
{
  labId: "<subject>/<slug>",
  title: "Lab Name",
  description: "What the learner accomplishes in this step.",
  difficulty: "Intermediate",
  estimatedMinutes: 15,
  xpReward: 50,
}
```

---

### Step 8: Update Navbars, Subject Hubs & Hero
1. **Subject Hub Catalog** (`app/<subject>/page.tsx`):
   * Add experiment item to `experiments` array (`PhysicsExperiment`, `ChemistryExperiment`, etc.).
2. **Navbar Dropdown** (`app/components/Navbar.tsx`):
   * If highlighting this lab, add to `highlights` under the appropriate discipline in `labCategories`.
3. **Homepage Hero** (`app/components/Hero.tsx`):
   * If featured on the homepage carousel, add to `labsData`.
4. **Subtopic Hub** (`app/<subject>/<subtopic>/page.tsx`):
   * Add card to the subtopic's `cards` array if applicable.

---

### Step 9: Search Engine Indexing, Automated SEO Testing & Documentation Sync
1. **XML Sitemap & SEO Route Policy** (`app/sitemap.ts` & `app/lib/seoRoutePolicy.ts`):
   * Register the public educational landing page (`https://www.openlabs.org.in/<subject>/<slug>`) with priority `0.8` (automatically enumerated via `LABS` in `app/lib/labs.ts`).
   * **DO NOT** add the simulation route (`/labs/<subject>/<slug>`) to `sitemap.ts`. Interactive simulation routes are protected behind authentication, excluded in `robots.ts`, and shielded with `X-Robots-Tag: noindex, nofollow, noarchive` via `app/labs/layout.tsx` and `middleware.ts`.
2. **Automated SEO Regression Suite**:
   ```bash
   yarn test:seo
   ```
   * Verifies all routes against `app/lib/seoRoutePolicy.ts`, checks sitemap completeness, confirms zero `/labs/*` entries, and checks absolute canonical URLs.
3. **Typecheck & Linting**:
   ```bash
   yarn tsc --noEmit
   yarn lint
   ```
4. **Mandatory Documentation Synchronization**:
   * As defined in `.agents/rules/documentation-sync.md`, update all companion documentation before completing any task:
     * `CHANGELOG.md` — log the newly added lab under the current date.
     * `README.md` — increment lab counts and add to subject highlights.
     * `REQUIREMENTS.md` — append functional requirement (`FR-1...`) with lab specification.
     * `ROADMAP.md` — mark lab item as `[SHIPPED ✅]`.
     * `CLAUDE.md` & `AGENTS.md` — update architectural conventions or registries if modified.
