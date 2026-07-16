/* ============================================================
   Shared domain types — Vyra Health
   ============================================================ */

export type CompoundClass =
  | "GLP-1 & GIP dual agonist"
  | "GLP-1, GIP & Glucagon triple agonist"
  | "Skin & recovery peptide blend"
  | "Recovery peptide blend"
  | "NAD+ coenzyme";

export type ProductBadge =
  | "Most popular"
  | "Best value"
  | "Max strength"
  | "New";

export interface DoseOption {
  id: string;
  label: string;
  /** strength shown to the user, e.g. "5 mg" */
  strength: string;
  /** price in USD for this dose */
  price: number;
  /** how long one vial lasts, plain text */
  supply: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** short tagline, e.g. "GLP-1 & GIP dual agonist" */
  compoundClass: CompoundClass;
  badge?: ProductBadge;
  /** one-line summary used on cards */
  summary: string;
  /** longer marketing description */
  description: string;
  /** comparable branded reference, for context only */
  comparedTo: string;
  doses: DoseOption[];
  /** key bullet points on the detail page */
  highlights: string[];
  /** brand accent colour for art */
  accent: string;
  rating: number;
  reviewCount: number;
  /** product box photo, served from /public/images */
  img: string;
  /** gallery images shown on the product detail page (main first, then sub-images) */
  images?: string[];
  /** fill volume shown in the analytical card, e.g. "3 mL" */
  fillVolume?: string;
  /** total assayed content, e.g. "40.05 mg" */
  verifiedContent?: string;
  /** concentration per ml, e.g. "13.35 mg/mL" */
  concentration?: string;
  /** independent lab purity, e.g. "99.85%" */
  purity?: string;
  /** batch id shown on the analytical card */
  batchNumber?: string;
  /** URL to the third-party analytical report */
  reportUrl?: string;
}

export interface Review {
  id: string;
  name: string;
  initials: string;
  location: string;
  rating: number;
  product: string;
  monthsIn: number;
  lostLabel: string;
  quote: string;
  verified: boolean;
  /** "men" or "women" — chooses a matching portrait from randomuser.me */
  gender: "men" | "women";
  /** index 0–99 into randomuser.me/api/portraits/{gender}/{n}.jpg */
  portraitIdx: number;
}

export interface Faq {
  id: string;
  category: "Getting started" | "Treatment" | "Delivery" | "Billing" | "Safety";
  question: string;
  answer: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  accent: string;
  gender: "men" | "women";
  /** explicit portrait URL, served from /public/images */
  img: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  duration: string;
}

/* --- Workflow / state types --- */

export interface QuizAnswers {
  goal?: string;
  heightCm?: number;
  weightKg?: number;
  triedBefore?: string;
  conditions: string[];
  pregnant?: string;
  consent?: boolean;
}

export interface QuizResult {
  eligible: boolean;
  bmi: number | null;
  reason: string;
  recommendedProductSlug?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  doseId: string;
  doseLabel: string;
  strength: string;
  price: number;
  quantity: number;
  accent: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type OrderStatus =
  | "Clinician review"
  | "Approved"
  | "Dispensing"
  | "Dispatched"
  | "Delivered";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  placedAt: string;
  address: ShippingAddress;
  /** clinician note shown on the account page */
  clinicianNote: string;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  phone: string;
}
