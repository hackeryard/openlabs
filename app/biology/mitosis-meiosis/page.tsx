import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Mitosis, Meiosis & Microscopic Cell Division Virtual Lab | OpenLabs",
  description:
    "Interactive cytogenetics and cell biology laboratory. Simulate somatic mitosis (2n -> 2n), gametic meiosis (2n -> 4 x n), crossing-over chiasmata recombination, spindle assembly checkpoint (SAC), and chromosomal nondisjunction aneuploidy mutations under brightfield and fluorescence microscopy.",
  keywords: [
    "mitosis virtual lab",
    "meiosis simulation online",
    "cell division microscope interactive",
    "crossing over chiasmata simulator",
    "spindle assembly checkpoint SAC",
    "nondisjunction aneuploidy simulation",
    "trisomy monosomy karyotype",
    "animal cleavage furrow vs plant cell plate",
    "biology virtual lab",
    "ap biology cell cycle mitosis meiosis",
    "cbse class 11 cell division lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/mitosis-meiosis",
  },
  openGraph: {
    title: "Mitosis, Meiosis & Microscopic Cell Division Virtual Lab | OpenLabs",
    description:
      "Simulate somatic mitosis, reductional meiosis, crossing-over recombination, and chromosomal nondisjunction under high-power virtual microscopy.",
    url: "https://www.openlabs.org.in/biology/mitosis-meiosis",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/mitosis-meiosis-hero.png",
        alt: "Mitosis and Meiosis Virtual Cell Division Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitosis, Meiosis & Microscopic Cell Division Virtual Lab | OpenLabs",
    description:
      "Interactive simulation of somatic mitosis, gametic meiosis, chiasmata crossing-over, and nondisjunction aneuploidies.",
    images: ["https://www.openlabs.org.in/images/biology/mitosis-meiosis-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MitosisMeiosisLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="mitosis-meiosis"
      title="Mitosis, Meiosis & Cell Division Studio"
      description="Cellular cytogenetics laboratory simulating somatic mitosis (2n -> 2n), gametogenesis meiosis (2n -> 4 x n), crossing-over chiasmata recombination, spindle assembly checkpoint tension, and nondisjunction aneuploidies under virtual brightfield and fluorescence microscopy."
      heroDescription="Journey into the eukaryotic nucleus under high-power virtual microscopy (100x to 1000x oil immersion). Control the progression through Prophase, Metaphase, Anaphase, Telophase, and Cytokinesis. Compare animal actin contractile rings with plant Golgi-derived cell plates, click chiasmata loci to orchestrate homologous crossing-over in Prophase I, and inject nondisjunction errors to observe the etiology of numerical chromosomal aneuploidies."
      theory="Eukaryotic cellular proliferation and inheritance are governed by two distinct division mechanisms. Somatic mitosis is an equational division that duplicates a diploid mother cell into two genetically identical daughter cells (2n -> 2n), essential for growth, tissue repair, and asexual reproduction. Meiosis is a specialized two-round division sequence in germ cells: Meiosis I reduces chromosome ploidy by segregating homologous chromosome pairs (2n -> 2 x n), while Meiosis II segregates sister chromatids without intervening DNA replication, yielding four genetically unique haploid gametes (4 x n). Genetic diversity is amplified through homologous non-sister chromatid crossing-over at chiasmata during Prophase I (Pachytene) and independent assortment of bivalents at Metaphase I (2^n combinations). Defects in the Spindle Assembly Checkpoint (SAC) lead to chromosomal nondisjunction, causing aneuploidies such as Trisomy 21 (Down syndrome) and Monosomy X (Turner syndrome)."
      formula="2n \xrightarrow{\text{Mitosis}} 2 \times 2n \quad \text{and} \quad 2n \xrightarrow{\text{Meiosis I}} 2 \times n \xrightarrow{\text{Meiosis II}} 4 \times n \quad \text{and} \quad N_{\text{combinations}} = 2^n"
      formulaLabel="Ploidy Conservation, Reductional Division & Assortment Combinatorics"
      launchUrl="/labs/biology/mitosis-meiosis"
      heroImageUrl="/images/biology/mitosis-meiosis-hero.png"
      visualLabel="Virtual Microscope & Chromosome Cytokinesis Engine"
      visualDetail="1000x Oil Immersion Lens • DAPI/Tubulin Fluorescence • Crossing-Over Matrix • Nondisjunction Fault Injector"
      accent={{ primary: "#10b981", secondary: "#06b6d4", warm: "#f59e0b" }}
      learningObjectives={[
        "Differentiate somatic equational division (Mitosis: 2n -> 2n) from gametic reductional division (Meiosis: 2n -> 4 x n).",
        "Trace chromosome dynamics step-by-step: chromatin condensation, nuclear envelope breakdown, metaphase plate alignment, cohesin cleavage by separase, and cytokinetic cleavage.",
        "Compare cytokinesis mechanisms between animal cells (actin-myosin contractile ring cleavage furrow) and plant cells (Golgi phragmoplast vesicles fusing into a pectin/cellulose cell plate).",
        "Manipulate homologous non-sister chromatid crossing-over at chiasmata and calculate recombination frequency.",
        "Simulate Spindle Assembly Checkpoint (SAC) failure and compare the karyotype outcomes of Anaphase I vs Anaphase II nondisjunction (two n+1 and two n-1 vs two normal n, one n+1, one n-1).",
      ]}
      applications={[
        "Oncology & Cancer Therapeutics: Targeting tubulin polymerization dynamics with taxanes and vinca alkaloids to arrest malignant mitotic spindle assembly.",
        "Clinical Cytogenetics & Pre-implantation Genetic Diagnosis: Karyotyping amniotic fluid and chorionic villus samples for chromosomal trisomies.",
        "Reproductive Endocrinology: Evaluating maternal age-related cohesin degradation and nondisjunction risk in in-vitro fertilization (IVF).",
        "Agricultural Plant Polyploidy Breeding: Utilizing colchicine to block spindle fibers and induce autotetraploid crop varieties with enhanced fruit biomass.",
      ]}
      faqs={[
        {
          question: "What is the key difference between homologous chromosomes and sister chromatids?",
          answer:
            "Sister chromatids are two identical copies of a single chromosome joined at a shared centromere, produced during S-phase DNA replication. Homologous chromosomes are pairs of matching chromosomes (one maternal, one paternal) containing the same genes in the same locus order, but carrying potentially different alleles. In Mitosis and Meiosis II, sister chromatids separate; in Meiosis I, homologous pairs separate.",
        },
        {
          question: "Why is Meiosis I called 'reductional' while Meiosis II is called 'equational'?",
          answer:
            "Meiosis I reduces the ploidy number from diploid (2n = 46 in humans) to haploid (n = 23) because homologous chromosome bivalents segregate into separate daughter cells. Meiosis II is equational because it separates sister chromatids without changing ploidy: both the starting cells and final gametes remain haploid (n = 23).",
        },
        {
          question: "Why do plant cells form a cell plate instead of a cleavage furrow during cytokinesis?",
          answer:
            "Plant cells are encased in a rigid, inextensible cellulose cell wall that prevents the plasma membrane from pinching inward with an actin-myosin contractile ring. Instead, during late anaphase and telophase, the phragmoplast microtubule scaffold guides Golgi-derived vesicles carrying pectin and hemicellulose to the equatorial plane, fusing outward from the center to construct a new cell plate and middle lamella.",
        },
        {
          question: "How does nondisjunction in Meiosis I differ from nondisjunction in Meiosis II in terms of gamete outcomes?",
          answer:
            "In Meiosis I nondisjunction, both homologous chromosomes fail to separate and migrate into the same secondary gametocyte; following Meiosis II, all 4 gametes are abnormal (50% n+1, 50% n-1; 100% aneuploid). In Meiosis II nondisjunction, a single pair of sister chromatids fails to separate in one cell; resulting in 50% normal haploid gametes (n), 25% trisomic (n+1), and 25% monosomic (n-1).",
        },
      ]}
    />
  );
}
