import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Blood Transfusion & ABO Blood Groups Virtual Lab | OpenLabs",
  description: "Examine human blood components, ABO and Rh antigen-antibody agglutination reactions, and clinical transfusion compatibility online.",
  keywords: [
    "blood transfusion simulation",
    "abo blood groups lab",
    "rh factor agglutination",
    "red blood cell antigens",
    "universal donor universal recipient",
    "hematology virtual lab",
    "biology simulation",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/blood",
  },
  openGraph: {
    title: "Blood Transfusion & ABO Blood Groups Virtual Lab | OpenLabs",
    description: "Examine human blood components, ABO and Rh antigen-antibody agglutination reactions, and clinical transfusion compatibility online.",
    url: "https://www.openlabs.org.in/biology/blood",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/blood-hero.png",
        alt: "Blood Transfusion & ABO Compatibility Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blood Transfusion & ABO Blood Groups Virtual Lab | OpenLabs",
    description: "Examine human blood components, ABO and Rh antigen-antibody agglutination reactions, and clinical transfusion compatibility online.",
    images: ["https://www.openlabs.org.in/images/biology/blood-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BloodLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="blood"
      title="Blood Transfusion & ABO Compatibility"
      description="Interactive immuno-hematology laboratory simulating ABO and Rh surface antigens, antibody agglutination, and emergency crossmatch compatibility."
      heroDescription="Explore human hematology and immuno-serology. Test unknown donor and recipient blood samples with Anti-A, Anti-B, and Anti-D serums, observe real-time agglutination clumping, and prevent acute hemolytic transfusion reactions."
      theory="Human blood classification is governed by carbohydrate and protein antigens expressed on the erythrocyte plasma membrane. The ABO system depends on alleles I^A, I^B, and i encoding glycosyltransferases that attach terminal sugars (N-acetylgalactosamine for A-antigen, D-galactose for B-antigen) to the precursor H-antigen. When incompatible blood is transfused, circulating IgM and IgG antibodies bind surface antigens, causing agglutination and fatal complement-mediated hemolysis."
      formula="\text{Immune Response: } \text{Ag}_A + \text{Ab}_{\text{anti-A}} \xrightarrow{} \text{Agglutination Clumping (Lysis)}"
      formulaLabel="Antigen-Antibody Cross-Linking Reaction"
      launchUrl="/labs/biology/blood"
      heroImageUrl="/images/biology/blood-hero.png"
      visualLabel="Immuno-Hematology Agglutination Well Plate"
      visualDetail="ABO & Rh Antigen Surface Mapping • 16-Cell Transfusion Compatibility Matrix • Emergency O- Crossmatch"
      accent={{ primary: "#e11d48", secondary: "#9333ea", warm: "#f59e0b" }}
      learningObjectives={[
        "Identify surface antigens and plasma antibodies present in blood groups A, B, AB, and O.",
        "Perform virtual forward and reverse blood typing using Anti-A, Anti-B, and Anti-D diagnostic serums.",
        "Explain why type O-negative is the universal red cell donor and type AB-positive is the universal recipient.",
        "Describe the pathophysiology of Hemolytic Disease of the Fetus and Newborn (Erythroblastosis Fetalis).",
      ]}
      applications={[
        "Hospital Blood Banking & Emergency Trauma Transfusion Protocols.",
        "Obstetric Rh Immunoglobulin (RhoGAM) Prophylaxis.",
        "Forensic Serology & Crime Scene Bloodstain Analysis.",
        "Organ and Bone Marrow Transplantation HLA Histocompatibility Matching.",
      ]}
      faqs={[
        {
          question: "Why is blood type O-negative considered the universal red blood cell donor?",
          answer:
            "Type O-negative erythrocytes lack surface A-antigens, B-antigens, and Rh(D) antigens. When transfused into a recipient of any blood group, the recipient's plasma antibodies find no foreign antigens to bind against, preventing immune agglutination during emergency resuscitations.",
        },
        {
          question: "What causes agglutination during an incompatible blood transfusion?",
          answer:
            "Agglutination occurs when recipient antibodies recognize foreign antigens on the donor's red blood cells. The multivalent antibodies cross-link multiple erythrocytes together into visible clumps, obstructing capillaries and triggering intravascular hemolysis with acute renal failure.",
        },
        {
          question: "How does the Rh factor cause Erythroblastosis Fetalis in pregnancy?",
          answer:
            "When an Rh-negative mother carries an Rh-positive fetus, fetal red blood cells entering maternal circulation at delivery stimulate the mother to produce Anti-D IgG antibodies. In subsequent Rh-positive pregnancies, these maternal IgG antibodies cross the placenta and destroy fetal red blood cells.",
        },
      ]}
    />
  );
}
