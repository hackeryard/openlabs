import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Cardiac Cycle, ECG & Heart Hemodynamics Virtual Lab | OpenLabs",
  description:
    "Simulate the 4-chamber human heart pump, cardiac cycle phases, synchronized Wiggers diagram, Lead II ECG waveforms, heart sounds (S1/S2 Lub-Dub), and clinical hemodynamics online.",
  keywords: [
    "cardiac cycle virtual lab",
    "wiggers diagram online simulation",
    "ecg simulator online",
    "heart hemodynamics simulation",
    "cardiac output stroke volume calculator",
    "heart sounds auscultation simulator",
    "frank starling law virtual experiment",
    "biology virtual lab",
    "cardiology simulation class 11 12 cbse",
    "ap biology heart anatomy lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/heart-cardiac-cycle",
  },
  openGraph: {
    title: "Cardiac Cycle, ECG & Heart Hemodynamics Virtual Lab | OpenLabs",
    description:
      "Interactive 4-chamber heart simulation, live Lead II ECG waveforms, Wiggers diagram, phonocardiogram heart sounds, and pathology presets.",
    url: "https://www.openlabs.org.in/biology/heart-cardiac-cycle",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/heart-cardiac-cycle-hero.png",
        alt: "Cardiac Cycle & Heart Hemodynamics Virtual Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardiac Cycle, ECG & Heart Hemodynamics Virtual Lab | OpenLabs",
    description:
      "Simulate the human heart pump, cardiac cycle phases, synchronized Wiggers diagram, Lead II ECG waveforms, and heart sounds.",
    images: ["https://www.openlabs.org.in/images/biology/heart-cardiac-cycle-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HeartCardiacCycleLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="heart-cardiac-cycle"
      title="Cardiac Cycle, ECG & Heart Hemodynamics"
      description="Cardiovascular physiology laboratory simulating 4-chamber anatomical heart pumping, mechanical valve opening/closing, SA/AV node conduction, live Lead II ECG, Wiggers pressure-volume loops, and stethoscope auscultation."
      heroDescription="Explore the mechanical, electrical, and hemodynamic events of the human heartbeat in real time. Adjust heart rate, preload, contractility, and afterload to observe changes in cardiac output, ejection fraction, ventricular pressures, and heart sounds (S1 Lub and S2 Dub)."
      theory="The human cardiac cycle encompasses all mechanical and electrical events occurring from the beginning of one heartbeat to the beginning of the next. Deoxygenated blood returns via the Vena Cava to the Right Atrium, moves past the Tricuspid valve to the Right Ventricle, and is pumped into the Pulmonary Artery to the lungs. Oxygenated blood returns via the Pulmonary Veins into the Left Atrium, passes the Mitral/Bicuspid valve into the Left Ventricle, and is vigorously ejected across the Aortic valve into the systemic circulation. The cycle is tightly governed by the SA-AV electrical conduction network, the Frank-Starling mechanism (length-tension relationship), and pressure gradients mapped in the classical Wiggers Diagram."
      formula="CO = \text{HR} \times \text{SV} \quad \text{and} \quad \text{EF} = \frac{\text{SV}}{\text{EDV}} \times 100\% \quad \text{and} \quad \text{MAP} = \text{DBP} + \frac{1}{3}(\text{SBP} - \text{DBP})"
      formulaLabel="Cardiac Output, Ejection Fraction & Mean Arterial Pressure"
      launchUrl="/labs/biology/heart-cardiac-cycle"
      heroImageUrl="/images/biology/heart-cardiac-cycle-hero.png"
      visualLabel="4-Chamber Heart & Wiggers Diagram"
      visualDetail="Interactive Myocardial Wall • Realtime Lead II ECG • S1/S2 Auscultation • Frank-Starling Hemodynamics"
      accent={{ primary: "#e11d48", secondary: "#2563eb", warm: "#f59e0b" }}
      learningObjectives={[
        "Differentiate the 6 key mechanical phases of the cardiac cycle (Late Diastole, Atrial Systole, Isovolumetric Contraction, Rapid Ejection, Isovolumetric Relaxation, Rapid Inflow).",
        "Correlate Lead II ECG waveforms (P wave, QRS complex, T wave) with mechanical events in the Wiggers diagram.",
        "Calculate Cardiac Output (CO), Stroke Volume (SV), Ejection Fraction (EF), and Mean Arterial Pressure (MAP) under varying physiological conditions.",
        "Identify the origins of the primary heart sounds (S1 caused by AV valve closure, S2 caused by semilunar valve closure) and pathological murmurs.",
        "Apply the Frank-Starling Law to explain how changes in end-diastolic volume (preload) modulate myocardial contractility and stroke volume.",
      ]}
      applications={[
        "Clinical Cardiology & Electrocardiography: Diagnosing arrhythmias, AV conduction blocks, and myocardial infarctions from 12-lead ECG traces.",
        "Echocardiography & Hemodynamic Monitoring: Measuring Left Ventricular Ejection Fraction (LVEF) and cardiac output in intensive care units.",
        "Pharmacological Interventions: Assessing the impact of beta-blockers, inotropes (epinephrine, digoxin), and ACE inhibitors on cardiac workload and afterload.",
        "Valvular Heart Disease Management: Differentiating systolic ejection murmurs in Aortic Stenosis from regurgitant murmurs in Mitral Incompetence.",
      ]}
      faqs={[
        {
          question: "What is the difference between systole and diastole?",
          answer:
            "Systole refers to the phase of contraction when the heart chambers pump blood out (atrial systole pumps blood into the ventricles, and ventricular systole ejects blood into the pulmonary artery and aorta). Diastole is the relaxation phase during which the chambers refill with blood.",
        },
        {
          question: "What causes the heart sounds S1 ('Lub') and S2 ('Dub')?",
          answer:
            "S1 ('Lub') is generated by the sudden closure and vibration of the atrioventricular valves (Tricuspid and Mitral) at the start of ventricular systole. S2 ('Dub') is generated by the sudden closure of the semilunar valves (Aortic and Pulmonic) at the onset of ventricular diastole.",
        },
        {
          question: "What is the Wiggers Diagram and why is it important?",
          answer:
            "The Wiggers Diagram is a standard medical reference chart that synchronizes Left Ventricular pressure, Aortic pressure, Left Atrial pressure, Ventricular volume, Lead II ECG, and Phonocardiogram (heart sounds) on a shared time axis, illustrating the exact physical interplay behind every heartbeat.",
        },
        {
          question: "How does the Frank-Starling Law work?",
          answer:
            "The Frank-Starling Law states that the stroke volume of the heart increases in response to an increase in the volume of blood in the ventricles before contraction (end-diastolic volume / preload). Increased stretch of myocardial muscle fibers aligns actin and myosin filaments more optimally, generating greater contractile force.",
        },
      ]}
    />
  );
}
