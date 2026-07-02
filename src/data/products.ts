import type { Product } from "../types";

/* All copy below is original placeholder text written for this practice
   project. Compound names are generic (non-proprietary) drug names. */

export const products: Product[] = [
  {
    id: "p-tirz",
    slug: "tirzepatide",
    name: "Tirzepatide",
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
    id: "p-sema",
    slug: "semaglutide",
    name: "Semaglutide",
    compoundClass: "GLP-1 receptor agonist",
    badge: "Best value",
    summary:
      "Selective GLP-1 agonist. A gentler starting dose at a lower price point.",
    description:
      "Semaglutide is the most researched GLP-1 medicine available. It slows digestion and reduces appetite signals, and is a popular, lower-cost way to begin a treatment journey.",
    comparedTo: "the active ingredient in widely known branded GLP-1 pens",
    accent: "#258a66",
    rating: 4.8,
    reviewCount: 488,
    img: "/images/products/semaglutide/front.jpg",
    images: [
      "/images/products/semaglutide/front.jpg",
      "/images/products/semaglutide/back.jpg",
      "/images/products/semaglutide/open.jpg",
      "/images/products/semaglutide/uv.jpg",
    ],
    fillVolume: "1.5 mL",
    verifiedContent: "20.02 mg",
    concentration: "13.35 mg/mL",
    purity: "99.72%",
    batchNumber: "SM204HTLR",
    reportUrl: "https://verify.janoshik.com/tests/147173_KS3YGHPP2AJ1",
    highlights: [
      "The most clinically studied GLP-1 option",
      "Lowest entry price of our range",
      "Once-weekly self-administered injection",
      "Great first step before considering a dual agonist",
    ],
    doses: [
      { id: "sema-0_25", label: "Starter", strength: "0.25 mg", price: 35, supply: "4 weeks" },
      { id: "sema-0_5", label: "Build-up", strength: "0.5 mg", price: 49, supply: "4 weeks" },
      { id: "sema-1", label: "Maintenance", strength: "1 mg", price: 65, supply: "4 weeks" },
      { id: "sema-2", label: "Full strength", strength: "2 mg", price: 85, supply: "4 weeks" },
    ],
  },
  {
    id: "p-reta",
    slug: "retatrutide",
    name: "Retatrutide",
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
    id: "p-cagri",
    slug: "cagrilintide",
    name: "Cagrilintide",
    compoundClass: "Amylin receptor agonist",
    badge: "New",
    summary:
      "Amylin analogue that pairs well with GLP-1 therapy — newest addition to the range.",
    description:
      "Cagrilintide works on the amylin pathway rather than GLP-1, slowing stomach emptying and supporting fullness. Many members use it alongside a GLP-1 for a steadier appetite through the day.",
    comparedTo: "emerging amylin-analogue treatments",
    accent: "#43a884",
    rating: 4.7,
    reviewCount: 46,
    img: "/images/products/cagrilintide/front.jpg",
    images: [
      "/images/products/cagrilintide/front.jpg",
      "/images/products/cagrilintide/back.jpg",
      "/images/products/cagrilintide/open.jpg",
      "/images/products/cagrilintide/uv.jpg",
    ],
    fillVolume: "2.4 mL",
    verifiedContent: "24.10 mg",
    concentration: "10.04 mg/mL",
    purity: "99.44%",
    batchNumber: "CG240RQF",
    reportUrl: "https://verify.janoshik.com/tests/165637_1XWECMUZPLPE",
    highlights: [
      "Works on the amylin pathway — a different mechanism",
      "Pairs well alongside a GLP-1 treatment",
      "Helps smooth out appetite between meals",
      "Newest addition to the Vyra Health range",
    ],
    doses: [
      { id: "cagri-0_3", label: "Starter", strength: "0.3 mg", price: 70, supply: "4 weeks" },
      { id: "cagri-0_6", label: "Build-up", strength: "0.6 mg", price: 89, supply: "4 weeks" },
      { id: "cagri-1_2", label: "Maintenance", strength: "1.2 mg", price: 109, supply: "4 weeks" },
      { id: "cagri-2_4", label: "Full strength", strength: "2.4 mg", price: 129, supply: "4 weeks" },
    ],
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);
