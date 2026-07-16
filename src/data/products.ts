import type { Product } from "../types";

/* All copy below is original placeholder text written for this practice
   project. Compound names are generic (non-proprietary) drug names. */

export const products: Product[] = [
  {
    id: "p-tirz",
    slug: "tirzepatide",
    name: "Tirzepatide 40mg",
    compoundClass: "GLP-1 & GIP dual agonist",
    badge: "Most popular",
    summary:
      "Dual agonist of GLP-1 & GIP receptors. Designed for the strongest, most sustained appetite control.",
    description:
      "Tirzepatide works on two gut hormones at once, which tends to mean stronger appetite control for most people. It is our most-chosen treatment, balancing strong results with a manageable side-effect profile.",
    comparedTo: "the active ingredient in some branded dual-agonist pens",
    accent: "#1d6b50",
    rating: 4.9,
    reviewCount: 612,
    img: "/images/products/tirzepatide/front.jpg",
    images: [
      "/images/products/tirzepatide/front.jpg",
      "/images/products/tirzepatide/back.jpg",
      "/images/products/tirzepatide/open.jpg",
      "/images/products/tirzepatide/uv.jpg",
    ],
    fillVolume: "3 mL",
    verifiedContent: "40.05 mg",
    concentration: "13.35 mg/mL",
    purity: "99.85%",
    batchNumber: "TR786PAOS",
    reportUrl:
      "https://verify.janoshik.com/tests/147174-ALLUVI_TIRZEPATIDE_40MG_KIT_T5MBWRAYD4HN",
    highlights: [
      "Acts on both GLP-1 and GIP receptors",
      "Most members reach their starting goal within 4 months",
      "Once-weekly self-administered injection",
      "Titration plan included and adjusted by your clinician",
    ],
    doses: [
      { id: "tirz-2_5", label: "Starter", strength: "2.5 mg", price: 59, supply: "4 weeks" },
      { id: "tirz-5", label: "Build-up", strength: "5 mg", price: 79, supply: "4 weeks" },
      { id: "tirz-7_5", label: "Maintenance", strength: "7.5 mg", price: 99, supply: "4 weeks" },
      { id: "tirz-10", label: "Full strength", strength: "10 mg", price: 119, supply: "4 weeks" },
    ],
  },
  {
    id: "p-reta-20",
    slug: "retatrutide-20mg",
    name: "Retatrutide 20mg",
    compoundClass: "GLP-1, GIP & Glucagon triple agonist",
    badge: "New",
    summary:
      "Lower-strength Retatrutide kit — a gentler introduction to the triple agonist at a lower entry price.",
    description:
      "Retatrutide 20mg is a lower-strength introduction to our triple-agonist option. Acts on GLP-1, GIP and glucagon pathways together, at a smaller dose for members who want to start slowly.",
    comparedTo: "investigational triple-agonist compounds",
    accent: "#2a7a5a",
    rating: 4.8,
    reviewCount: 84,
    img: "/images/products/retatrutide-20mg/front.jpg",
    images: [
      "/images/products/retatrutide-20mg/front.jpg",
      "/images/products/retatrutide-20mg/back.jpg",
      "/images/products/retatrutide-20mg/open.jpg",
      "/images/products/retatrutide-20mg/uv.jpg",
    ],
    fillVolume: "2.4 mL",
    verifiedContent: "22.96 mg",
    concentration: "9.57 mg/mL",
    purity: "99.21%",
    batchNumber: "AR1721TRT",
    reportUrl:
      "https://verify.janoshik.com/tests/163215-ALLUVI_RETATRUTIDE_20MG_KIT_GBHEFN58JXXZ",
    highlights: [
      "Lower-strength triple-agonist kit — gentler entry point",
      "Acts on GLP-1, GIP and Glucagon pathways together",
      "Pre-filled research pen, cold-chain dispatched",
      "Independently assayed by Janoshik Analytical",
    ],
    doses: [
      { id: "reta20-0_5", label: "Starter", strength: "0.5 mg", price: 35, supply: "4 weeks" },
      { id: "reta20-1", label: "Build-up", strength: "1 mg", price: 49, supply: "4 weeks" },
      { id: "reta20-2", label: "Maintenance", strength: "2 mg", price: 69, supply: "4 weeks" },
      { id: "reta20-4", label: "Full strength", strength: "4 mg", price: 89, supply: "4 weeks" },
    ],
  },
  {
    id: "p-reta",
    slug: "retatrutide",
    name: "Retatrutide 40mg",
    compoundClass: "GLP-1, GIP & Glucagon triple agonist",
    badge: "Max strength",
    summary:
      "Triple agonist of GLP-1, GIP & Glucagon. Next-generation metabolic support.",
    description:
      "Retatrutide acts on three hormone pathways, adding a glucagon effect on top of GLP-1 and GIP. It is our most powerful treatment and is best suited to members who have already tolerated a GLP-1 medicine.",
    comparedTo: "investigational triple-agonist compounds",
    accent: "#16523e",
    rating: 4.9,
    reviewCount: 121,
    img: "/images/products/retatrutide/front.jpg",
    images: [
      "/images/products/retatrutide/front.jpg",
      "/images/products/retatrutide/back.jpg",
      "/images/products/retatrutide/open.jpg",
      "/images/products/retatrutide/uv.jpg",
    ],
    fillVolume: "3 mL",
    verifiedContent: "40.02 mg",
    concentration: "13.34 mg/mL",
    purity: "99.65%",
    batchNumber: "RT402LKM",
    reportUrl: "https://verify.janoshik.com/tests/165632_3JXHCZ6NJHGX",
    highlights: [
      "Acts on three receptors: GLP-1, GIP and Glucagon",
      "Our strongest appetite and metabolic effect",
      "Recommended after tolerating a GLP-1 first",
      "Close clinician supervision throughout titration",
    ],
    doses: [
      { id: "reta-1", label: "Starter", strength: "1 mg", price: 40, supply: "4 weeks" },
      { id: "reta-2", label: "Build-up", strength: "2 mg", price: 69, supply: "4 weeks" },
      { id: "reta-4", label: "Maintenance", strength: "4 mg", price: 99, supply: "4 weeks" },
      { id: "reta-8", label: "Full strength", strength: "8 mg", price: 139, supply: "4 weeks" },
    ],
  },
  {
    id: "p-nad",
    slug: "nad-plus",
    name: "NAD+ 1,000mg",
    compoundClass: "NAD+ coenzyme",
    badge: "New",
    summary:
      "1,000 mg NAD+ (nicotinamide adenine dinucleotide) — energy metabolism and longevity research.",
    description:
      "A high-dose NAD+ kit delivered as two 500 mg pre-filled pens. Central to cellular energy production and used in laboratory investigations of mitochondrial function and cellular senescence.",
    comparedTo: "NR / NMN precursor supplements",
    accent: "#8a6cb4",
    rating: 4.6,
    reviewCount: 24,
    img: "/images/products/nad/front.jpg",
    images: [
      "/images/products/nad/front.jpg",
      "/images/products/nad/back.jpg",
      "/images/products/nad/open.jpg",
      "/images/products/nad/uv.jpg",
    ],
    highlights: [
      "1,000 mg total NAD+ per kit (2 × 500 mg pens)",
      "Coenzyme central to cellular energy production",
      "Cold-chain dispatched from a licensed facility",
      "Restocking soon — join the wait-list at checkout",
    ],
    doses: [
      { id: "nad-1000", label: "Full kit", strength: "1,000 mg (2 × pen)", price: 140, supply: "Full kit" },
    ],
  },
  {
    id: "p-glow",
    slug: "glow",
    name: "Glow 70mg",
    compoundClass: "Skin & recovery peptide blend",
    badge: "New",
    summary:
      "GHK-Cu, BPC-157 and TB-500 blend — designed for skin, hair and cellular repair.",
    description:
      "A three-peptide blend combining GHK-Cu (a copper tripeptide linked to collagen synthesis and skin renewal) with BPC-157 and TB-500 for cellular repair support. Supplied as a pre-filled research kit for laboratory use.",
    comparedTo: "combined skin and repair peptide protocols",
    accent: "#c86ba3",
    rating: 4.8,
    reviewCount: 58,
    img: "/images/products/glow/front.jpg",
    images: [
      "/images/products/glow/front.jpg",
      "/images/products/glow/back.jpg",
      "/images/products/glow/open.jpg",
      "/images/products/glow/uv.jpg",
    ],
    fillVolume: "3.4 mL",
    verifiedContent: "40.69 mg total",
    concentration: "GHK-Cu 7.59 · BPC-157 2.39 · TB-500 1.99 mg/mL",
    purity: "≥99%",
    batchNumber: "GL0621XSA",
    reportUrl:
      "https://verify.janoshik.com/tests/163217-ALLUVI_GLOW_70MG_KIT_DCL3AJSE4JQP",
    highlights: [
      "GHK-Cu 50 mg + BPC-157 10 mg + TB-500 10 mg per kit",
      "Supports skin, hair and cellular repair pathways",
      "Two pre-filled research pens per kit",
      "Independently assayed by Janoshik Analytical",
    ],
    doses: [
      { id: "glow-70", label: "Full kit", strength: "70 mg (2 × pen)", price: 100, supply: "Full kit" },
    ],
  },
  {
    id: "p-bpc-tb",
    slug: "bpc-157-tb-500",
    name: "BPC-157 & TB-500 40mg",
    compoundClass: "Recovery peptide blend",
    badge: "New",
    summary:
      "Dual BPC-157 and TB-500 blend — a common stack for recovery research protocols.",
    description:
      "A 40 mg dual peptide blend of BPC-157 and TB-500 supplied in a pre-filled research pen. Frequently paired in recovery-focused research protocols and independently purity-tested.",
    comparedTo: "standalone BPC-157 or TB-500 research vials",
    accent: "#4a6fb4",
    rating: 4.7,
    reviewCount: 42,
    img: "/images/products/bpc-tb500/front.jpg",
    images: [
      "/images/products/bpc-tb500/front.jpg",
      "/images/products/bpc-tb500/back.jpg",
      "/images/products/bpc-tb500/open.jpg",
      "/images/products/bpc-tb500/uv.jpg",
    ],
    fillVolume: "3 mL",
    verifiedContent: "41.58 mg total",
    concentration: "BPC-157 7.33 · TB-500 6.53 mg/mL",
    purity: "≥99%",
    batchNumber: "BP1701FSR",
    reportUrl:
      "https://verify.janoshik.com/tests/163218-ALLUVI_BPC157_TB500_40MG_KIT_EAI125ZEF8TB",
    highlights: [
      "20 mg BPC-157 + 20 mg TB-500 per pen",
      "Popular dual-peptide recovery stack",
      "Pre-filled research pen — cold-chain dispatched",
      "Independently assayed by Janoshik Analytical",
    ],
    doses: [
      { id: "bpc-tb-40", label: "Full kit", strength: "40 mg (BPC-157 + TB-500)", price: 130, supply: "Full kit" },
    ],
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);
