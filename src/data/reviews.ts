import type { Review } from "../types";

/* Fictional reviews written for this practice project. */

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Hannah P.",
    initials: "HP",
    location: "Leeds",
    rating: 5,
    product: "Tirzepatide",
    monthsIn: 4,
    lostLabel: "14 kg down",
    quote:
      "The food noise just quieted down. My clinician adjusted my dose twice and answered every question within a few hours.",
    verified: true,
    gender: "women",
    portraitIdx: 32,
  },
  {
    id: "r2",
    name: "Marcus T.",
    initials: "MT",
    location: "Bristol",
    rating: 5,
    product: "Retatrutide 20mg",
    monthsIn: 3,
    lostLabel: "9 kg down",
    quote:
      "Started on the lowest dose and built up slowly. No drama, discreet packaging, and the dietitian sessions actually helped.",
    verified: true,
    gender: "men",
    portraitIdx: 41,
  },
  {
    id: "r3",
    name: "Priya S.",
    initials: "PS",
    location: "Manchester",
    rating: 5,
    product: "Tirzepatide",
    monthsIn: 6,
    lostLabel: "21 kg down",
    quote:
      "Six months in and I feel like myself again. The check-ins kept me on track when motivation dipped.",
    verified: true,
    gender: "women",
    portraitIdx: 68,
  },
  {
    id: "r4",
    name: "David L.",
    initials: "DL",
    location: "Glasgow",
    rating: 4,
    product: "Retatrutide",
    monthsIn: 2,
    lostLabel: "7 kg down",
    quote:
      "Strong appetite control. First week was a little queasy but the clinician walked me through managing it.",
    verified: true,
    gender: "men",
    portraitIdx: 12,
  },
  {
    id: "r5",
    name: "Aisha K.",
    initials: "AK",
    location: "Birmingham",
    rating: 5,
    product: "Retatrutide 20mg",
    monthsIn: 5,
    lostLabel: "16 kg down",
    quote:
      "Fast dispatch every single month. Knowing a real clinician signs off each order makes me trust it.",
    verified: true,
    gender: "women",
    portraitIdx: 90,
  },
  {
    id: "r6",
    name: "Tom R.",
    initials: "TR",
    location: "Cardiff",
    rating: 5,
    product: "NAD+",
    monthsIn: 3,
    lostLabel: "Steadier energy",
    quote:
      "Started the NAD+ kit alongside my GLP-1 and my energy through the afternoon feels noticeably steadier.",
    verified: true,
    gender: "men",
    portraitIdx: 77,
  },
];

export const reviewStats = {
  average: 4.8,
  total: 1247,
  breakdown: [
    { stars: 5, pct: 86 },
    { stars: 4, pct: 10 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 0 },
  ],
};
