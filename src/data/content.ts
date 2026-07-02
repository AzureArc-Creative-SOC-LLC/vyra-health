import type { ProcessStep } from "../types";

/* Static page content for the practice project. */

export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: "Take the eligibility quiz",
    description:
      "Answer a few questions about your goals and health history. It's free, takes about two minutes, and there's no commitment.",
    duration: "~2 minutes",
  },
  {
    id: 2,
    title: "A clinician reviews you",
    description:
      "A registered clinician reads your answers and decides whether treatment is suitable — and which one fits you best.",
    duration: "Within 24 hours",
  },
  {
    id: 3,
    title: "Your treatment is dispensed",
    description:
      "Once approved, your treatment is prepared at a licensed facility, lab-checked, and packed discreetly.",
    duration: "Same day",
  },
  {
    id: 4,
    title: "It arrives at your door",
    description:
      "A tracked courier delivers within 72 hours in plain packaging. Your starter guide is in the box.",
    duration: "Within 72 hours",
  },
  {
    id: 5,
    title: "We support you all the way",
    description:
      "1:1 clinician chat and free dietitian sessions stay with you for the whole journey — adjust, ask, reorder when ready.",
    duration: "Ongoing",
  },
];

export const numberStats = [
  { value: "1,247", label: "Members reviewed", sub: "and counting" },
  { value: "15–20%", label: "Average weight loss", sub: "among members at 6 months" },
  { value: "4.8★", label: "Average rating", sub: "from verified members" },
  { value: "72 hrs", label: "Typical dispatch", sub: "after clinician approval" },
  { value: "≥99%", label: "Verified purity", sub: "on every released batch" },
  { value: "80%", label: "Cost reduction", sub: "vs. comparable branded pens" },
];

export const trustPoints = [
  {
    title: "Clinician-reviewed",
    text: "Every single order is read and signed off by a registered clinician before it's dispensed.",
  },
  {
    title: "One honest price",
    text: "Treatment, review, delivery and dietitian support — all in one price. No subscriptions.",
  },
  {
    title: "Lab-tested quality",
    text: "Each batch is checked for ≥99% purity at a licensed compounding facility.",
  },
  {
    title: "Support that stays",
    text: "1:1 clinician chat and free dietitian sessions for the whole of your journey.",
  },
];

export const affiliateTiers = [
  {
    name: "Member",
    commission: "10%",
    perks: ["10% on every referred order", "Personal referral link", "Monthly payouts"],
  },
  {
    name: "Advocate",
    commission: "15%",
    perks: [
      "15% commission",
      "Custom discount code for your audience",
      "Priority affiliate support",
      "Early access to new treatments",
    ],
    featured: true,
  },
  {
    name: "Partner",
    commission: "20%+",
    perks: [
      "20%+ negotiated commission",
      "Co-branded landing pages",
      "Dedicated partner manager",
      "Quarterly performance bonuses",
    ],
  },
];
